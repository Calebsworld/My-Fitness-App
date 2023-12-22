package com.calebcodes.fitness.dao;

import com.calebcodes.fitness.entity.Exercise;
import com.calebcodes.fitness.entity.Workout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Optional;

//@CrossOrigin("http://localhost:4200")
@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    Optional<Workout> findByName(String name);
    Page<Workout> findWorkoutsByUserId(Long id, PageRequest of);

}
