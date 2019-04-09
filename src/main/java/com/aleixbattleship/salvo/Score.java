package com.aleixbattleship.salvo;


import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")

    private Long Id;
    private double score;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_ID")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_ID")
    private Game game;


    //constructor
    public Score(){}

    public Score(double score){
        this.score=score;

    }
    //methods
    //gets and sets

    public Long getId() {
        return Id;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
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

    @Override
    public String toString() {
        return "Score{" +
                "Id=" + Id +
                ", score=" + score +
                ", player=" + player +
                ", game=" + game +
                '}';
    }
}
