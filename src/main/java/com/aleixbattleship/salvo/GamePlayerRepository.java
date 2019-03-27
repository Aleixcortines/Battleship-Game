package com.aleixbattleship.salvo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface GamePlayerRepository extends JpaRepository<GamePlayer, Long> {

    //Repository Query Methods - finds information from the database and declares it on the repository interface.
    List<GamePlayer> findByPlayer (Player player);


}