package com.calebcodes.fitness.entity;

import com.calebcodes.fitness.dto.ExerciseDto;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercise")
@Data
@ToString(exclude = {"workout", "workingSet"})
@EqualsAndHashCode(exclude = {"workout", "workingSet"})
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

    @Column(name="gifUrl")
    private String gifUrl;

    @JsonManagedReference
    @OneToMany(mappedBy = "exercise",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private List<WorkingSet> workingSet = new ArrayList<>();

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "workout_id")
    private Workout workout;

    public Exercise() {
    }

    public void addWorkingSet(WorkingSet workingSet) {
        this.workingSet.add(workingSet);
        workingSet.setExercise(this);
    }


    public void removeWorkingSet(WorkingSet workingSet) {
        this.workingSet.remove(workingSet);
        workingSet.setExercise(null);
    }




}
