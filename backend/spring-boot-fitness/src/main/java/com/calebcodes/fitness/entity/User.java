package com.calebcodes.fitness.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@EqualsAndHashCode(exclude = {"workouts"})
@ToString(exclude = {"workouts"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name="first_name", nullable = false)
    private String firstName;

    @Column(name="last_name", nullable = false)
    private String lastName;

    @Column(name="email", nullable = false)
    private String email;

    @Column(name="avatar")
    private String avatar;

    @OneToMany(mappedBy = "user",
    cascade = CascadeType.ALL,
    fetch = FetchType.LAZY)
    private List<Workout> workouts = new ArrayList<>();

    public void addWorkout(Workout workout) {
        this.workouts.add(workout);
        workout.setUser(this);
    }

    public void removeWorkout(Workout workout) {
        this.workouts.remove(workout);
        workout.setUser(null);
    }



}
