package com.calebcodes.fitness.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "exercise")
@Data
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="description")
    private String description;

    @Column(name="target")
    private String target;

    @Column(name="bodyPart")
    private String bodyPart;

    @Column(name="equipment")
    private String equipment;

    @OneToMany(mappedBy = "exercise")
    private List<WorkingSet> workingSets;

    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;

    public Exercise() {
    }

    public void addWorkingSet(WorkingSet workingSet) {
        this.workingSets.add(workingSet);
        workingSet.setExercise(this);
    }

    public void removeWorkingSet(WorkingSet workingSet) {
        this.workingSets.remove(workingSet);
        workingSet.setExercise(null);
    }

    public void setWorkout(Workout workout) {
        this.workout = workout;
    }



}
