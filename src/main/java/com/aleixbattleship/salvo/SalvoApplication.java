package com.aleixbattleship.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;


@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository,ShipRepository shipRepository) {
		return (args) -> {
			// Create players
			Player p1 = new Player("Jack","Bauer", "j.bauer@ctu.gov" );
			playerRepository.save(p1);
			Player p2 = new Player("Chloe","O'Brian","c.obrian@ctu.gov");
			playerRepository.save(p2);
			Player p3=new Player("Kim", "Bauer","kim_bauer@gmail.com");
			playerRepository.save(p3);
			Player p4=new Player("Toni", "Almeyda","t.almeida@ctu.gov");
			playerRepository.save(p4);

			//Create games
			Game g1 = new Game(LocalDateTime.now());
			gameRepository.save(g1);
			Game g2= new Game (LocalDateTime.now().plusHours(1));
			gameRepository.save(g2);
			Game g3= new Game(LocalDateTime.now().plusHours(2));
			gameRepository.save(g3);
			Game g4= new Game(LocalDateTime.now().plusHours(3));
			gameRepository.save(g4);
			Game g5= new Game(LocalDateTime.now().plusHours(4));
			gameRepository.save(g5);
			Game g6= new Game(LocalDateTime.now().plusHours(5));
			gameRepository.save(g6);
			Game g7= new Game(LocalDateTime.now().plusHours(6));
			gameRepository.save(g7);
			Game g8= new Game(LocalDateTime.now().plusHours(7));
			gameRepository.save(g8);

			//create gamePlayers
			//Game 1
			GamePlayer gp1 = new GamePlayer(g1, p1);
			gamePlayerRepository.save(gp1);
			GamePlayer gp2 = new GamePlayer(g1, p2);
			gamePlayerRepository.save(gp2);

			//Game 2
			GamePlayer gp3 = new GamePlayer(g2, p1);
			gamePlayerRepository.save(gp3);
			GamePlayer gp4 = new GamePlayer(g2, p2);
			gamePlayerRepository.save(gp4);

			//Game 3
			GamePlayer gp5 = new GamePlayer(g3,p2);
			gamePlayerRepository.save(gp5);
			GamePlayer gp6 = new GamePlayer(g3,p4);
			gamePlayerRepository.save(gp6);

			//Create Ships for game player 1
			Ship s1 =new Ship("Destroyer", Arrays.asList("H2","H3","H4"));
			//add the ship inside game player 1
			gp1.addShip(s1);
			//and save the ship on ship repository
			shipRepository.save(s1);
			Ship s2= new Ship("Submarine",Arrays.asList("E1", "F1", "G1"));
			gp1.addShip(s2);
			shipRepository.save(s2);
			Ship s3= new Ship("Patrol Boat",Arrays.asList("B4", "B5"));
			gp1.addShip(s3);
			shipRepository.save(s3);
			Ship s4= new Ship("Destroyer",Arrays.asList("B5", "C5","D5"));
			gp1.addShip(s4);
			shipRepository.save(s4);
			Ship s5= new Ship("Patrol Boat",Arrays.asList("F1", "F2"));
			gp2.addShip(s5);
			shipRepository.save(s5);
			Ship s6= new Ship("Destroyer",Arrays.asList("B5", "C5","D5"));
			gp2.addShip(s6);
			shipRepository.save(s6);



		};
	}


	}










