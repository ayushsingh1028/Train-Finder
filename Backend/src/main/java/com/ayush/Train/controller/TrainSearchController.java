package com.ayush.Train.controller;

import com.ayush.Train.enitity.TrainSchedule;
import com.ayush.Train.service.TrainSearchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
@CrossOrigin
public class TrainSearchController {

    private com.ayush.Train.service.TrainSearchService trainSearchService;

    private TrainSearchController(TrainSearchService trainSearchService)
    {
        this.trainSearchService=trainSearchService;
    }

    @GetMapping("/by-code")
    public List<com.ayush.Train.enitity.TrainSchedule> findTrainByStationCode(@RequestParam String sourceCode,
                                                                              @RequestParam String destinationCode)
    {
        return trainSearchService.findTrainByStationCode(sourceCode.toUpperCase(),destinationCode.toUpperCase());
    }


    @GetMapping("/by-name")
    public List<TrainSchedule> findTrainByStationName(@RequestParam String sourceName,
                                                      @RequestParam String destinationName)
    {
        return trainSearchService.findTrainByStationName(sourceName.toUpperCase(),destinationName.toUpperCase());
    }

}