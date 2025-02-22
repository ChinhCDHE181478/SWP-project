package dev.chinhcd.backend.services.duclm.impl;


import dev.chinhcd.backend.models.duclm.Tip;
import dev.chinhcd.backend.repository.duclm.ITipRepository;
import dev.chinhcd.backend.services.duclm.ITipService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipService implements ITipService {

    private final ITipRepository iTipRepository;

    @Override
    public List<Tip> getThreeTips() {
        return iTipRepository.findThreeTips();
    }
}
