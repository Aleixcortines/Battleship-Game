package com.aleixbattleship.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;


@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository) {
		return (args) -> {
			// save a couple of players
			Player p1 = new Player("Jack","Bauer", "j.bauer@ctu.gov" );
			playerRepository.save(p1);
			Player p2 = new Player("Chloe","O'Brian","c.obrian@ctu.gov");
			playerRepository.save(p2);
			Player p3=new Player("Kim", "Bauer","kim_bauer@gmail.com");
			playerRepository.save(p3);

			Game g1 = new Game(LocalDateTime.now());
			gameRepository.save(g1);
			Game g2= new Game (LocalDateTime.now().plusHours(1));
			gameRepository.save(g2);
			Game g3= new Game(LocalDateTime.now().plusHours(2));
			gameRepository.save(g3);


			GamePlayer gp1 = new GamePlayer(g1, p1);
			gamePlayerRepository.save(gp1);
			GamePlayer gp2 = new GamePlayer(g2, p2);
			gamePlayerRepository.save(gp2);
			GamePlayer gp3 = new GamePlayer(g3, p3);
			gamePlayerRepository.save(gp3);


		};
	}


	}










