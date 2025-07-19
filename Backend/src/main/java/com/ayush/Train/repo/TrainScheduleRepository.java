package com.ayush.Train.repo;

import com.ayush.Train.enitity.TrainSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainScheduleRepository extends JpaRepository<com.ayush.Train.enitity.TrainSchedule,Long> {

    List<com.ayush.Train.enitity.TrainSchedule> findBySource_StationCodeAndDestination_StationCode(String sourceCode, String destinationCode);
    List<com.ayush.Train.enitity.TrainSchedule> findBySource_StationNameAndDestination_StationName(String sourceName, String destinationName);
}