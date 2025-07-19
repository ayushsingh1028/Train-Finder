package com.ayush.Train.service;


import com.ayush.Train.enitity.TrainSchedule;
import com.ayush.Train.repo.TrainScheduleRepository;
import com.ayush.Train.repo.TrainScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainSearchService {

    private TrainScheduleRepository trainScheduleRepository;

    public TrainSearchService(TrainScheduleRepository trainScheduleRepository)
    {
        this.trainScheduleRepository=trainScheduleRepository;
    }


    public List<com.ayush.Train.enitity.TrainSchedule> findTrainByStationCode(String sourceCode, String destinationCode) {
        return trainScheduleRepository.
                findBySource_StationCodeAndDestination_StationCode(sourceCode,destinationCode);
    }

    public List<com.ayush.Train.enitity.TrainSchedule> findTrainByStationName(String sourceName, String destinationName) {
        return trainScheduleRepository.
                findBySource_StationNameAndDestination_StationName(sourceName,destinationName);

    }
}