package com.calebcodes.fitness.dao;

import com.calebcodes.fitness.entity.WorkingSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource(path = "working-sets")
public interface WorkingSetRepository extends JpaRepository<WorkingSet, Integer> {
}
