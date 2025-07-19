package com.ayush.Train.controller;

import com.ayush.Train.enitity.Train;
import com.ayush.Train.service.TrainService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trains")
public class TrainController {

    private com.ayush.Train.service.TrainService trainService;
    public TrainController(com.ayush.Train.service.TrainService trainService)
    {
        this.trainService=trainService;
    }

    @GetMapping
    public List<com.ayush.Train.enitity.Train> getAllTrains()
    {
        return trainService.getAllTrains();
    }

    @PostMapping
    public com.ayush.Train.enitity.Train addTrain(@RequestBody Train train)
    {
        return trainService.addTrain(train);
    }



}