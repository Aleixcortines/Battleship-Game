package com.aleixbattleship.salvo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.Date;
import java.util.List;

@RepositoryRestResource
public interface GameRepository extends JpaRepository<Game, Long> {

    //Repository Query Methods - finds information from the database and declares it on the repository interface.
    List<Game> findByDate (Date date);

}
