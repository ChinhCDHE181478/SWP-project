package dev.chinhcd.backend.models.duclm;

import dev.chinhcd.backend.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;

@Entity
@Table(name = "user_practice")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPractice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "practice_id")
    private Practice practice;

    @Column
    private int totalScore;

    @Column
    private Time totalTime;
}

