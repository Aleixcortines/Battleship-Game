package com.aleixbattleship.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    //Request Methods - (RequestMapping: specifies the URL where the data is displayed)
    @RequestMapping("/games")
    public List<Object> getAll() {

        return gameRepository.findAll()
                .stream()
                .map(game -> getAll(game))
                .collect(toList());
        }

    private Map<String,Object> getAll(Game game){
        Map<String, Object> mapId = new HashMap<>();

        mapId.put("id",game.getId());
        mapId.put("created",game.getDate());
        mapId.put("gamePlayers",game.getPlayers().stream().map(player -> getAll(player).collect(collectingAndThen())));
        return mapId;
    }



    private Map<String, Object> getAll(GamePlayer gamePlayerlayer) {
        Map<String, Object>  mapId = new LinkedHashMap<>();
        mapId.put("id", gamePlayer.getId());
        mapId.put("email", .getUserName());
        return mapId;
    }





    }

