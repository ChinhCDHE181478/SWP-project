package dev.chinhcd.backend.services.duclm.impl;


import dev.chinhcd.backend.models.duclm.New;
import dev.chinhcd.backend.repository.duclm.INewRepository;
import dev.chinhcd.backend.services.duclm.INewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewService implements INewService {

    private final INewRepository iNewRepository;

    @Override
    public List<New> getThreeNews() {
        return iNewRepository.findThreeNews();
    }
}
