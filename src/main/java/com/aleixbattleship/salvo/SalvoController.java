package com.aleixbattleship.salvo;

import com.sun.xml.internal.bind.v2.model.core.ID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.PermitAll;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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


    //Request Methods - (RequestMapping: specifies the URL where the data is displayed)
    @RequestMapping("/games")
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
        dto.put("gamePlayers",game.getPlayers()
                .stream().
                        map(Player -> getAll(Player))
                                .collect(toList()));
        return dto;
    }

    private Map<String, Object> getAll(Player Player) {
        Map<String, Object>  dto = new LinkedHashMap<>();
        dto.put("id", Player.getId());
        dto.put("email", Player.getUserName());
        return dto;
    }

       @RequestMapping("/game_view/{gamePlayerID}")
        public Map <String,Object> gameViewId(@PathVariable Long gamePlayerID) {
        Map<String,Object> gameViewDTO = new LinkedHashMap<>();
        GamePlayer gamePlayer= gamePlayerRepository.getOne(gamePlayerID);
        gameViewDTO.put("game", getGameViewInfo(gamePlayer));
            return gameViewDTO;
    }


    private Map <String,Object> getGPInfo(GamePlayer gamePlayer){

        Map <String,Object> dtoGamePlayerInfo= new HashMap<>();

        dtoGamePlayerInfo.put("id",gamePlayer.getId());
        dtoGamePlayerInfo.put("player",getAll(gamePlayer.getPlayer()));

        return dtoGamePlayerInfo;
    }

    private Map <String,Object> getGameViewInfo (GamePlayer gamePlayer){
        Map<String,Object> gameInfo = new HashMap<>();

        gameInfo.put("id",gamePlayer.getGame().getId());
        gameInfo.put("created",gamePlayer.getGame().getDate());
        gameInfo.put("Game Player",gamePlayer.getGame().getGamePlayers()
                .stream()
                .map(gp -> getGPInfo(gp))
                .collect(toList()));

        gameInfo.put("Ships",gamePlayer.getShip()
                .stream()
                .map(ship -> makeShipDTO(ship))
                .collect(toList())

        );

        return gameInfo;
    }

    private Map <String,Object> makeShipDTO (Ship ship){
        Map <String,Object> shipDTO = new HashMap<>();
        shipDTO.put("Type",ship.getType());
        shipDTO.put("Location",ship.getLocations());
        return shipDTO;
    }

}


