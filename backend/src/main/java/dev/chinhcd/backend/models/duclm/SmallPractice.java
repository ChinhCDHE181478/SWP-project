package dev.chinhcd.backend.models.duclm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "small_practice")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SmallPractice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int smallPracticeId;

    @Column(nullable = false)
    private String testName;

    @Column(nullable = false, columnDefinition = "Date")
    private Date testDate;

    @ManyToOne
    @JoinColumn(name = "practiceId")
    private Practice practice;

}
