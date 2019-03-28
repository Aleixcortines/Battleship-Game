package com.aleixbattleship.salvo;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
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

    @OneToMany(mappedBy="player", fetch= FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    public Player(){}

    public Player (String name, String lastName, String userName){
        this.id=id;
        this.name= name;
        this.lastName=lastName;
        this.userName=userName;
    }

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