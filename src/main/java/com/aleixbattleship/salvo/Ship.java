package com.aleixbattleship.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Entity
public class Ship {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long Id;
    private String Type;

    //define a collection of locations
    @ElementCollection
    @Column(name="cell")
    private List<String> Locations = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gamePlayerId")
    private GamePlayer gamePlayer;

    //constructors
    public Ship(){}

    public Ship (String Type,List Locations){
        this.Type=Type;
        this.Locations=Locations;
    }

    //methods
    public Long getId() {
        return Id;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public List<String> getLocations() {
        return Locations;
    }

    public void setLocations(List<String> locations) {
        Locations = locations;
    }

    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;    }

    @Override
    public String toString() {
        return "Ship{" +
                "Id=" + Id +
                ", Type='" + Type + '\'' +
                ", Locations=" + Locations +
                ", gamePlayer=" + gamePlayer +
                '}';
    }

}
