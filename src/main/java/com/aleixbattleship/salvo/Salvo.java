package com.aleixbattleship.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Salvo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long Id;
    private Integer turn;
    //JPA connection with gameplayer. Define a game player related with salvo.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gamePlayerId")
    private GamePlayer gamePlayer;
    //define a collection of locations
    @ElementCollection
    @Column(name="cell")
    private List<String> Locations = new ArrayList<>();


    //contructor
    public Salvo(){}

    public Salvo (Integer turn,List Locations, GamePlayer gamePlayer){
        this.turn=turn;
        this.Locations=Locations;
        this.gamePlayer=gamePlayer;
    }

    //methods
    //gets and sets
    public Long getId() {
        return Id;
    }
    public Integer getTurn(){
        return turn;
    }
    public void setTurn(Integer turn) {
        this.turn = turn;
    }

    public GamePlayer getGamePlayer(){
        return gamePlayer;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }

    public List<String> getLocations() {
        return Locations;
    }

    public void setLocations(List<String> locations) {
        this.Locations = locations;
    }

    @Override
    public String toString() {
        return "Salvo{" +
                "Id=" + Id +
                ", turn=" + turn +
                ", gamePlayer=" + gamePlayer +
                ", Locations=" + Locations +
                '}';
    }
}
