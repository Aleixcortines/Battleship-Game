package com.aleixbattleship.salvo;


import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class GamePlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_ID")
    private Player player;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_ID")
    private Game game;

    //one to many relation. The owner field in Ship is the Gameplayer (in the database sense) of this relationship
    @OneToMany(mappedBy = "gamePlayer",fetch=FetchType.EAGER )
    Set<Ship> ships = new HashSet<>();

    private LocalDateTime date;

    public GamePlayer(){}

    public GamePlayer(Game gameID,Player playerID){
//    this.id=id;
//    this.date=date;
    this.game=gameID;
    this.player=playerID;
    }
    //method to add a new ship
    public void addShip(Ship ship) {
        //The addShip() code sets the owner of ship to that gameplayer
        ship.setGamePlayer(this);
        //adds the ship to the set of ships for this gameplayer.
        this.ships.add(ship);
    }
    //gets and sets
    public Long getId() {
        return id;
    }

    public LocalDateTime getDate() { return date; }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    //We use Set rather than List because Set collection automatically ignores duplicate entries when added.
    public Set<Ship> getShip() {
        return ships;
    }

    public void setShips(Set<Ship> ships) { this.ships = ships;}

    @Override
    public String toString() {
        return "GamePlayer{" +
                "id=" + id +
                ", date=" + date +
                ", gameID=" + game +
                ", playerID=" + player +
                '}';
    }
}
