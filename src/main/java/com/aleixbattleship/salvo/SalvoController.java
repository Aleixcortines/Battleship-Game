package com.aleixbattleship.salvo;

import com.sun.xml.internal.bind.v2.model.core.ID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.PermitAll;
import java.util.*;
import java.lang.String;
import java.lang.Object;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toList;


// Rest Controller - defines methods that get (or modify) data from a repository, and return an object (JSON).
@RestController
@RequestMapping("/api")
public class SalvoController {
    //Attributes - (Autowired annotation: gets the instance needed, in this case, the Repositories where the instances are saved)
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private GamePlayerRepository gamePlayerRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private PlayerRepository playerRepository;

    @RequestMapping(path="/games")

    public Map<String,Object> getCurrentUser(Authentication authentication) {
        Map<String, Object> currentUser = new LinkedHashMap<>();
        if (!isGuest(authentication ) ){
            currentUser.put("player", getPlayerDTO(playerRepository.findByUserName(authentication.getName())));
        } else {
            currentUser.put("player","null");
        }
        currentUser.put("games", getAll());
        return currentUser;
    }
    //Request Methods - (RequestMapping: specifies the URL where the data is displayed)
    @RequestMapping(path="/games", method = RequestMethod.POST)

    public ResponseEntity <Map<String,Object>> createGame (Authentication authentication){

        if (authentication==null){
            return new ResponseEntity<>(makeMap("error", "Log in please!"),HttpStatus.UNAUTHORIZED);
        } else {
            Game game = new Game();
            gameRepository.save(game);
            Player player = getCurrentPlayer(authentication);
            GamePlayer gamePlayer = new GamePlayer(game,player);
            gamePlayerRepository.save(gamePlayer);

            return new ResponseEntity<>(makeMap("gpid", gamePlayer.getId()), HttpStatus.CREATED);

        }
    }


    //This function returns true (if user is logged in) or false (if not) --> called in "RequestMapping ("/games")"
    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }
    public List<Object> getAll() {

        return gameRepository.findAll()
                .stream()
                .map(game -> getAll(game))
                .collect(toList());
        }

    private Map<String,Object> getAll(Game game){
        Map<String, Object> dto = new HashMap<>();

        dto.put("id",game.getId());
        dto.put("created",game.getDate());
        dto.put("gamePlayers",game.getGamePlayers()
                .stream().
                        map(gamePlayer -> getGPInfo(gamePlayer))
                                .collect(toList()));
       dto.put("scores", game.getScores().stream().map(score -> makeScoreDTO(score)).collect(toList()));
        return dto;
    }

    private Map<String,Object> makeScoreDTO(Score score) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("player", score.getPlayer().getUserName());
        dto.put("score", score.getScore());

        return dto;
    }

    private Map<String, Object> getPlayerDTO(Player player) {
        Map<String, Object>  dto = new LinkedHashMap<>();
        dto.put("id", player.getId());
        dto.put("email", player.getUserName());
        return dto;
    }

    private Map <String,Object> getGPInfo(GamePlayer gamePlayer){

        Map <String,Object> dtoGamePlayerInfo= new HashMap<>();

        dtoGamePlayerInfo.put("id",gamePlayer.getId());
        dtoGamePlayerInfo.put("player",getPlayerDTO(gamePlayer.getPlayer()));


        return dtoGamePlayerInfo;
    }


    @RequestMapping(path="/game/{gameID}/players", method = RequestMethod.POST)

    public ResponseEntity <Object> joinGame (@PathVariable Long gameID, Authentication authentication){

        Game game = gameRepository.getOne(gameID);

        if (authentication==null){
            return new ResponseEntity<>(makeMap("error", "Log in please!"), HttpStatus.UNAUTHORIZED);
        }
        if (game == null){
            return new ResponseEntity<>(makeMap("error", "There is no game to play"), HttpStatus.FORBIDDEN);
        }
        if(game.getGamePlayers().size()==2) {
            return new ResponseEntity<>(makeMap("error", "Game is full"), HttpStatus.FORBIDDEN);
        }else {

            GamePlayer gamePlayer = new GamePlayer(game,getCurrentPlayer(authentication));
            gamePlayerRepository.save(gamePlayer);

            return new ResponseEntity<>(makeMap("gpid", gamePlayer.getId()), HttpStatus.CREATED);
        }
    }

       @RequestMapping("/game_view/{gamePlayerID}")
       public ResponseEntity<Map<String, Object>> getCurrentGamePlayer(@PathVariable long gamePlayerID, Authentication authentication){

           GamePlayer currentGamePlayer = gamePlayerRepository.getOne(gamePlayerID);

           if(currentGamePlayer.getPlayer().getId()== getCurrentPlayer(authentication).getId()){
               return new ResponseEntity<>(gameViewId(gamePlayerID), HttpStatus.ACCEPTED);
           }else{
               return new ResponseEntity<>(makeMap("Error", "You are not authorized to see this game!"), HttpStatus.UNAUTHORIZED);
           }

       }

    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
        public Map <String,Object> gameViewId(@PathVariable Long gamePlayerID) {
        Map<String,Object> gameViewDTO = new LinkedHashMap<>();
        GamePlayer gamePlayer= gamePlayerRepository.getOne(gamePlayerID);
        gameViewDTO.put("game", getGameViewInfo(gamePlayer));
            return gameViewDTO;
    }


    private Map <String,Object> getGameViewInfo (GamePlayer gamePlayer){
        Map<String,Object> gameInfo = new HashMap<>();

        gameInfo.put("id",gamePlayer.getGame().getId());
        gameInfo.put("created",gamePlayer.getGame().getDate());
        gameInfo.put("GamePlayer",gamePlayer.getGame().getGamePlayers()
                .stream()
                .map(gp -> getGPInfo(gp))
                .collect(toList()));

        gameInfo.put("Ships",gamePlayer.getShip()
                .stream()
                .map(ship -> makeShipDTO(ship))
                .collect(toList())
        );

        gameInfo.put("mySalvoes",gamePlayer.getSalvo()

                .stream()
                .map(salvo -> makeSalvoDTO(salvo))
                .collect(toList())
        );
        if (gamePlayer.getGame().getGamePlayers().size()>1){
            gameInfo.put("opponentSalvoes", getOpponent(gamePlayer).getSalvo()
                    .stream()
                    .map(salvo -> makeSalvoDTO(salvo))
                    .collect(toList()));
        }

        return gameInfo;
    }

    private Map <String,Object> makeShipDTO (Ship ship){
        Map <String,Object> shipDTO = new HashMap<>();
        shipDTO.put("Type",ship.getType());
        shipDTO.put("Location",ship.getLocations());
        return shipDTO;
    }


    private Map <String,Object> makeSalvoDTO(Salvo salvo){

        Map <String,Object> salvoDTO = new HashMap<>();
        salvoDTO.put("Turn",salvo.getTurn());
        salvoDTO.put("Location",salvo.getLocations());


        return salvoDTO;
    }

    private GamePlayer getOpponent (GamePlayer gamePlayer){

       return gamePlayer.getGame().getGamePlayers()
               .stream()
               .filter(gamePlayer1 -> !gamePlayer.equals(gamePlayer1))
               .findFirst()
               .orElse(null);
    }

    @RequestMapping(path = "/players", method = RequestMethod.GET)
    List <Object> getPlayersInfo(){

        Set<Player> players = new LinkedHashSet<>(playerRepository.findAll());
          return players
          .stream()
          .map(this::getPlayerDTO)
          .collect(toList());
    }


    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Object> register(@RequestBody Player player) {


        if ( player.getUserName().isEmpty() || player.getPassword().isEmpty()) {
            return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
        }

        if (playerRepository.findByUserName(player.getUserName()) !=  null) {
            return new ResponseEntity<>("Name already in use", HttpStatus.FORBIDDEN);
        }
        //method to encript the password
        player.setPassword(passwordEncoder.encode(player.getPassword()));
        playerRepository.save(player);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

        //method to obtain the player on the authentication
        public Player getCurrentPlayer(Authentication authentication){

        if(authentication != null){

            return playerRepository.findByUserName(authentication.getName());

        } else {
            return null;
        }


    }
}

