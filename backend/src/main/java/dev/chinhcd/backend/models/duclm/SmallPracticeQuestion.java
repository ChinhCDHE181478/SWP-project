package dev.chinhcd.backend.models.duclm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "small_practice_question")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SmallPracticeQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "smallPracticeId", nullable = false)
    private SmallPractice smallPractice;

    @ManyToOne
    @JoinColumn(name = "questionId", nullable = false)
    private Question question;
}
