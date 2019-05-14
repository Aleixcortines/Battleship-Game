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
    private String type;

    //define a collection of locations
    @ElementCollection
    @Column(name="locations")
    private List<String> locations = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gamePlayerId")
    private GamePlayer gamePlayer;

    //constructors
    public Ship(){}

    public Ship (String type, List<String> locations){
        this.type=type;
        this.locations=locations;
    }

    //methods
    public Long getId() {

        return Id;
    }

    public String getType() {

        return type;
    }

    public void setType(String type) {

        this.type = type;
    }

    public List<String> getLocations() {

        return locations;
    }

    public void setLocations(List<String> locations) {

        this.locations = locations;
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
                ", type='" + type + '\'' +
                ", locations=" + locations +
                ", gamePlayer=" + gamePlayer +
                '}';
    }

}
