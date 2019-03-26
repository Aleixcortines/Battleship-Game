package com.aleixbattleship.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import static java.util.stream.Collectors.toList;

import java.lang.Long;
import java.util.Set;

@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private LocalDateTime date;


    @OneToMany(mappedBy="game", fetch= FetchType.EAGER)
    Set<GamePlayer> gamePlayers;


    public Game(){}

    public Game (LocalDateTime date){

        this.date = date;

    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getDate() {

        return date;
    }

    public void setDate(LocalDateTime date) {

        this.date = date;
    }

    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }

    public List<Player> getPlayers() {
        return this.gamePlayers.stream().map(sub -> sub.getPlayer()).collect(toList());
    }

    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", date=" + date +
                '}';
    }
}
