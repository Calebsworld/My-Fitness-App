package com.calebcodes.fitness.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "workout")
@Data
@ToString(exclude = {"user", "exercises"})
@EqualsAndHashCode(exclude = {"user", "exercises"})
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="description")
    private String description;

    @JsonManagedReference
    @OneToMany(mappedBy = "workout",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private Set<Exercise> exercises = new HashSet<>();

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    // bi-directional relationship
    public void addExercise(Exercise exercise) {
        this.exercises.add(exercise);
        exercise.setWorkout(this);
    }

    // bi-directional relationship

    public void removeExercise(Exercise exercise) {
        this.exercises.remove(exercise);
        exercise.setWorkout(null);
    }

}
