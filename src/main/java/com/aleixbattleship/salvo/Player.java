package com.aleixbattleship.salvo;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;


@Entity
public class Player {

    @Id
    @GeneratedValue (strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private String name;
    private String lastName;
    private String userName;
    private String password;

    @OneToMany(mappedBy="player", fetch= FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy="player", fetch= FetchType.EAGER)
    Set<Score> scores = new HashSet<>();

    public Player(){}

    public Player (String name, String lastName, String userName,String password){
        this.id=id;
        this.name= name;
        this.lastName=lastName;
        this.userName=userName;
        this.password=password;
    }

    public Player ( String userName,String password){
        this.userName=userName;
        this.password=password;
    }

    //methods
    //method to add score
    public void addScore(Score score) {
        score.setPlayer(this);
        //add the score to the set of scores for this game.
        this.scores.add(score);
    }

    //gets and sets

    public Long getId() {
        return id;
    }

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name=name;
    }

    public String getLastName(){
        return lastName;
    }

    public void setLastName(String lastName){
        this.lastName=lastName;
    }


    public String getUserName(){ return userName; }

    public void setUserName(String userName) { this.userName = userName; }

    public Set <GamePlayer> getGamePlayers(){
        return gamePlayers;
    }

    public Set<Score> getScores() {
        return scores;
    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }

    public String getPassword(){return password;}

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", lastName='" + lastName + '\'' +
                ", userName='" + userName + '\'' +
                '}';
    }


}