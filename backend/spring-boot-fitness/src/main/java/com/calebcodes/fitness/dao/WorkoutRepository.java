package com.calebcodes.fitness.dao;

import com.calebcodes.fitness.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
}
