package com.aleixbattleship.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;


@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}

	@Bean
	public PasswordEncoder passwordEncoder() { //encrypts passwords. If the database is hacked, it won't show the real passwords, but a 60-character encoded string,
		//prefixed by the encryption algorithm used.
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository,ShipRepository shipRepository,SalvoRepository salvoRepository, ScoreRepository scoreRepository) {
		return (args) -> {
			// Create players
			Player p1 = new Player("Jack","Bauer", "j.bauer@ctu.gov", passwordEncoder().encode("24"));
			playerRepository.save(p1);
			Player p2 = new Player("Chloe","O'Brian","c.obrian@ctu.gov", passwordEncoder().encode("24"));
			playerRepository.save(p2);
			Player p3=new Player("Kim", "Bauer","kim_bauer@gmail.com", passwordEncoder().encode("24"));
			playerRepository.save(p3);
			Player p4=new Player("Toni", "Almeyda","t.almeida@ctu.gov", passwordEncoder().encode("24"));
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

			//create gamePlayers in every game
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
			//Game 4
			GamePlayer gp7 = new GamePlayer(g4,p2);
			gamePlayerRepository.save(gp7);
			GamePlayer gp8 = new GamePlayer(g4,p3);
			gamePlayerRepository.save(gp8);
			//Game 5
			GamePlayer gp9 = new GamePlayer(g5,p4);
			gamePlayerRepository.save(gp9);
			GamePlayer gp10 = new GamePlayer(g5,p3);
			gamePlayerRepository.save(gp10);
			//Game 6
			GamePlayer gp11 = new GamePlayer(g6,p3);
			gamePlayerRepository.save(gp11);
			GamePlayer gp12= new GamePlayer(g6,p3);
			gamePlayerRepository.save(gp12);
			//Game 7
			GamePlayer gp13 = new GamePlayer(g7,p4);
			gamePlayerRepository.save(gp13);
			//Game 8
			GamePlayer gp14 = new GamePlayer(g8,p3);
			gamePlayerRepository.save(gp14);
			GamePlayer gp15 = new GamePlayer(g8,p4);
			gamePlayerRepository.save(gp15);

			//Create Ships and locations
			//In game 1
			Ship s1 =new Ship("Destroyer", Arrays.asList("H2","H3","H4"));
			//add the ship inside game player 1
			gp1.addShip(s1);
			//and save the ship on ship repository
			shipRepository.save(s1);
			Ship s2= new Ship("Submarine",Arrays.asList("E1", "F1", "G1"));
			gp1.addShip(s2);
			shipRepository.save(s2);
			Ship s3= new Ship("PatrolBoat",Arrays.asList("B4", "B5"));
			gp1.addShip(s3);
			shipRepository.save(s3);
			Ship s4= new Ship("Destroyer",Arrays.asList("B5", "C5","D5"));
			gp2.addShip(s4);
			shipRepository.save(s4);
			Ship s5= new Ship("PatrolBoat",Arrays.asList("F1", "F2"));
			gp2.addShip(s5);
			shipRepository.save(s5);
			//In game 2
			Ship s6= new Ship("Destroyer",Arrays.asList("B5", "C5","D5"));
			gp3.addShip(s6);
			shipRepository.save(s6);
			Ship s7= new Ship("PatrolBoat",Arrays.asList("C6", "C7"));
			gp3.addShip(s7);
			shipRepository.save(s7);
			Ship s8= new Ship("Submarine",Arrays.asList("A2", "A3", "A4"));
			gp4.addShip(s8);
			shipRepository.save(s8);
			Ship s9= new Ship("PatrolBoat",Arrays.asList("G6", "H6"));
			gp4.addShip(s9);
			shipRepository.save(s9);
			//In game 3
			Ship s10= new Ship("Destroyer",Arrays.asList("B5", "C5","D5"));
			gp5.addShip(s10);
			shipRepository.save(s10);
			Ship s11= new Ship("PatrolBoat",Arrays.asList("C6", "C7"));
			gp5.addShip(s11);
			shipRepository.save(s11);
			Ship s12= new Ship("Submarine",Arrays.asList("A2", "A3","A4"));
			gp6.addShip(s12);
			shipRepository.save(s12);
			Ship s13= new Ship("PatrolBoat",Arrays.asList("G6", "H6"));
			gp6.addShip(s13);
			shipRepository.save(s13);
			//In game 4
			Ship s14= new Ship("Destroyer",Arrays.asList("B5", "C5", "D5"));
			gp7.addShip(s14);
			shipRepository.save(s14);
			Ship s15= new Ship("Destroyer",Arrays.asList("C6", "C7"));
			gp7.addShip(s15);
			shipRepository.save(s15);
			Ship s16= new Ship("Submarine",Arrays.asList("A2", "A3", "A4"));
			gp8.addShip(s16);
			shipRepository.save(s16);
			Ship s17= new Ship("PatrolBoat",Arrays.asList("G6", "H6"));
			gp8.addShip(s17);
			shipRepository.save(s17);
			//In game 5
			Ship s18= new Ship("Destroyer",Arrays.asList("B5", "C5", "D5"));
			gp9.addShip(s18);
			shipRepository.save(s18);
			Ship s19= new Ship("PatrolBoat",Arrays.asList("C6", "C7"));
			gp9.addShip(s19);
			shipRepository.save(s19);
			Ship s20= new Ship("Submarine",Arrays.asList("A2", "A3","A4"));
			gp10.addShip(s20);
			shipRepository.save(s20);
			Ship s21= new Ship("Submarine",Arrays.asList("G6", "H6"));
			gp10.addShip(s21);
			shipRepository.save(s21);
			//In game 6
			Ship s22= new Ship("Destroyer",Arrays.asList("B5", "C5", "D5"));
			gp11.addShip(s22);
			shipRepository.save(s22);
			Ship s23= new Ship("PatrolBoat",Arrays.asList("C6", "C7"));
			gp12.addShip(s23);
			shipRepository.save(s23);
			//In game 8
			Ship s24= new Ship("Destroyer",Arrays.asList("B5", "C5", "D5"));
			gp14.addShip(s24);
			shipRepository.save(s24);
			Ship s25= new Ship("PatrolBoat",Arrays.asList("C6", "C7"));
			gp14.addShip(s25);
			shipRepository.save(s25);
			Ship s26= new Ship("Submarine",Arrays.asList("A2", "A3","A4"));
			gp15.addShip(s26);
			shipRepository.save(s26);
			Ship s27= new Ship("PatrolBoat",Arrays.asList("G6", "H6"));
			gp15.addShip(s27);
			shipRepository.save(s27);

			//Create salvos and locations
			//in game 1
			Salvo salvo1 = new Salvo(1, Arrays.asList("B5", "C5", "F1"),gp1);
			salvoRepository.save(salvo1);
			Salvo salvo2 = new Salvo(1,Arrays.asList("B4", "B5", "B6"),gp2);
			salvoRepository.save(salvo2);
			Salvo salvo3 = new Salvo(2, Arrays.asList("F2", "D5"), gp1);
			salvoRepository.save(salvo3);
			Salvo salvo4 = new Salvo (2, Arrays.asList("E1", "H3", "A2"), gp2);
			salvoRepository.save(salvo4);
			//in game2
			Salvo salvo5 = new Salvo(1, Arrays.asList("A2", "A4", "G6"),gp3);
			salvoRepository.save(salvo5);
			Salvo salvo6 = new Salvo (1, Arrays.asList("B5", "D5", "C7"), gp4);
			salvoRepository.save(salvo6);
			Salvo salvo7 = new Salvo(2, Arrays.asList("A3", "H6"), gp3);
			salvoRepository.save(salvo7);
			Salvo salvo8 = new Salvo (2, Arrays.asList("C5", "C6"), gp4);
			salvoRepository.save(salvo8);
			//in game 3
			Salvo salvo9 = new Salvo(1, Arrays.asList("G6", "H6", "A4"),gp5);
			salvoRepository.save(salvo9);
			Salvo salvo10 = new Salvo (1, Arrays.asList("H1", "H2", "H3"), gp6);
			salvoRepository.save(salvo10);
			Salvo salvo11 = new Salvo(2, Arrays.asList("A2", "A3", "D8"), gp5);
			salvoRepository.save(salvo11);
			Salvo salvo12 = new Salvo (2, Arrays.asList("E1", "F2", "G3"), gp6);
			salvoRepository.save(salvo12);
			//in game 4
			Salvo salvo13 = new Salvo(1, Arrays.asList("A3", "A4", "F7"),gp7);
			salvoRepository.save(salvo13);
			Salvo salvo14 = new Salvo (1, Arrays.asList("B5", "C6", "H1"), gp8);
			salvoRepository.save(salvo14);
			Salvo salvo15 = new Salvo(2, Arrays.asList("A2", "G6", "H6"), gp7);
			salvoRepository.save(salvo15);
			Salvo salvo16 = new Salvo (2, Arrays.asList("C5", "C7", "D5"), gp8);
			salvoRepository.save(salvo16);
			//in game 5
			Salvo salvo17 = new Salvo(1, Arrays.asList("A1", "A2", "A3"),gp9);
			salvoRepository.save(salvo17);
			Salvo salvo18 = new Salvo (1, Arrays.asList("B5", "B6", "C7"), gp10);
			salvoRepository.save(salvo18);
			Salvo salvo19 = new Salvo(2, Arrays.asList("G6", "G7", "G8"), gp9);
			salvoRepository.save(salvo19);
			Salvo salvo20 = new Salvo (2, Arrays.asList("C6", "D6", "E6"), gp10);
			salvoRepository.save(salvo20);
			Salvo salvo21 = new Salvo(3, Arrays.asList("H1", "H8"), gp10);
			salvoRepository.save(salvo21);

			//Create the scores
			//In game 1
			Score sc1 = new Score(1.0);
			p1.addScore(sc1);
			g1.addScore(sc1);
			scoreRepository.save(sc1);
			Score sc2 = new Score(0.0);
			p2.addScore(sc2);
			g1.addScore(sc2);
			scoreRepository.save(sc2);
			//In game 2
			Score sc3 = new Score(0.5);
			p1.addScore(sc3);
			g2.addScore(sc3);
			Score sc4 = new Score(0.5);
			p2.addScore(sc4);
			g2.addScore(sc4);
			Score sc5 = new Score(1.0);
			p2.addScore(sc5);
			g3.addScore(sc5);
			Score sc6 = new Score(0.0);
			p4.addScore(sc6);
			g3.addScore(sc6);
			Score sc7 = new Score(0.5);
			p2.addScore(sc7);
			g4.addScore(sc7);
			Score sc8 = new Score(0.5);
			p1.addScore(sc8);
			g4.addScore(sc8);
			Score sc9 = new Score(0.0);
			p4.addScore(sc9);
			g5.addScore(sc9);
			Score sc10 = new Score(1.0);
			p1.addScore(sc10);
			g5.addScore(sc10);
			Score sc11 = new Score(1.0);
			p3.addScore(sc11);
			g6.addScore(sc11);
			Score sc12 = new Score(0.0);
			p4.addScore(sc12);
			g7.addScore(sc12);
			Score sc13 = new Score(1.0);
			p3.addScore(sc13);
			g8.addScore(sc13);
			Score sc14 = new Score(0.0);
			p4.addScore(sc14);
			g8.addScore(sc14);

			scoreRepository.save(sc3);
			scoreRepository.save(sc4);
			scoreRepository.save(sc5);
			scoreRepository.save(sc6);
			scoreRepository.save(sc7);
			scoreRepository.save(sc8);
			scoreRepository.save(sc9);
			scoreRepository.save(sc10);
			scoreRepository.save(sc11);
			scoreRepository.save(sc12);
			scoreRepository.save(sc13);
			scoreRepository.save(sc14);





		};
	}


	}

//Authentication (determines who the User is and its role): This subclass takes the name someone has entered for log in, search the
//database with that name, and return a UserDetails object with name, password, and role information for that user if it exists.
//If not, it returns an error message. It doesn't check if the password is correct; That's handled by Spring Security's User class internally.

@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {
	@Autowired
	PlayerRepository playerRepository;

	@Override
	public void init(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(username-> {
			Player player = playerRepository.findByUserName(username);
			if (player != null) {
				return new User(player.getUserName(), player.getPassword(username),
						AuthorityUtils.createAuthorityList("USER"));
			} else {
				throw new UsernameNotFoundException("Unknown user: " + username);
			}
		});
	}
}
//Authorization (what the User can do): This subclass configures the authorization rules. What different roles can do.
//The matchers are checked in order, so it's important to know what we want to authorize and whom, to put them in the correct order.

@EnableWebSecurity
@Configuration
class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http.authorizeRequests()
				.antMatchers("/admin/**").hasAuthority("ADMIN")
				.antMatchers("/web/games.html").permitAll()
				.and()
				.formLogin();//creates a login controller.

		http.formLogin() //If a user tries to access a URL that requires authentication, a GET for the URL /login is automatically issued.
				.usernameParameter("username")
				.passwordParameter("password")
				.loginPage("/api/login"); //An HTML login form is generated and returned when GET /login occurs.
		//When a user submits that form, it does a POST to /login with the request parameters username and password.
		//The user authentication code is used to verify that data. If successful, the user is redirected
		//to the original URL. If the data is not valid, a failure HTML page is returned.
		http.logout().logoutUrl("/api/logout"); //logs the user out. Clears any authentication.

		// turn off checking for CSRF tokens
		http.csrf().disable();

		// if user is not authenticated, just send an authentication failure response
		http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if login is successful, just clear the flags asking for authentication
		http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

		// if login fails, just send an authentication failure response
		http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if logout is successful, just send a success response
		http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());

	}

	private void clearAuthenticationAttributes(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		}
	}
}











