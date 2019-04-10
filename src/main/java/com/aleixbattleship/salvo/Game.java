package com.aleixbattleship.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
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

    @OneToMany(mappedBy="game", fetch= FetchType.EAGER)
    Set<Score> scores = new HashSet<>();

    public Game(){}

    public Game (LocalDateTime date){

        this.date = date;

    }
    //methods
    //method to add score
    public void addScore(Score score) {
        score.setGame(this);
        //add the score to the set of scores for this game.
        this.scores.add(score);
    }

    //gets and sets
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

//    public List<Player> getPlayers() {
//        return this.gamePlayers.stream().map(sub -> sub.getPlayer()).collect(toList());
//    }

    public Set<Score> getScores() {
        return scores;
    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }

    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", date=" + date +
                '}';
    }
}
