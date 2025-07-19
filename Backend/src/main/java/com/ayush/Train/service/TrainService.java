package com.ayush.Train.service;


import com.ayush.Train.enitity.Train;
import com.ayush.Train.repo.TrainRepository;
import com.ayush.Train.repo.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainService {

    private TrainRepository trainRepository;

    public TrainService(TrainRepository trainRepository)
    {
        this.trainRepository=trainRepository;
    }


    public List<Train> getAllTrains() {
        return trainRepository.findAll();
    }

    public Train addTrain(com.ayush.Train.enitity.Train train) {
        return trainRepository.save(train);
    }
}