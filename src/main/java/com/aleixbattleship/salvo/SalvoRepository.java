package com.aleixbattleship.salvo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


    // Rest Repository - sends instances of Java classes (stored in JpaRepository) to browsers and other web services in JSON strings,
    // and defines URL links to get the JSON data.
    @RepositoryRestResource
    public interface SalvoRepository extends JpaRepository <Salvo, Long> {

    }

