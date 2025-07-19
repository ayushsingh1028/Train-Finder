package com.ayush.Train.controller;

import com.ayush.Train.enitity.Station;
import com.ayush.Train.enitity.Train;
import com.ayush.Train.enitity.TrainSchedule;
import com.ayush.Train.repo.StationRepository;
import com.ayush.Train.repo.TrainRepository;
import com.ayush.Train.repo.TrainScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/test")
public class Test {

    @Autowired
    com.ayush.Train.repo.StationRepository stationRepository;

    @Autowired
    com.ayush.Train.repo.TrainRepository trainRepository;

    @Autowired
    com.ayush.Train.repo.TrainScheduleRepository trainScheduleRepository;

    @GetMapping
    public void test()
    {
        com.ayush.Train.enitity.Station delhi=new com.ayush.Train.enitity.
                Station(null,"New Delhi","NDLS");
        Station mumbai=new Station(null,"Mumbai central","CST");
        Station kolkata=new Station(null,"Kolkata","KOAA");
        Station chennai=new Station(null,"Chennai Central","MAS");

        stationRepository.saveAll(List.of(delhi,mumbai,kolkata,chennai));

        com.ayush.Train.enitity.Train rajdhani = new com.ayush.Train.enitity.Train(null,"Rajdhani Express","12306",null);
        com.ayush.Train.enitity.Train durunto = new com.ayush.Train.enitity.Train(null,"Durunto Express","12260",null);
        com.ayush.Train.enitity.Train shatabdi = new com.ayush.Train.enitity.Train(null,"Shatabdi Express","12043",null);

        trainRepository.saveAll(List.of(rajdhani,durunto,shatabdi));


        com.ayush.Train.enitity.TrainSchedule sc1=new com.ayush.Train.enitity.TrainSchedule(null,rajdhani,delhi,mumbai,"06:00","14:00");
        com.ayush.Train.enitity.TrainSchedule sc2=new com.ayush.Train.enitity.TrainSchedule(null,durunto,mumbai,kolkata,"08:00","21:00");
        com.ayush.Train.enitity.TrainSchedule sc3=new com.ayush.Train.enitity.TrainSchedule(null,shatabdi,kolkata,chennai,"11:30","19:00");

        trainScheduleRepository.saveAll(List.of(sc1,sc2,sc3));

        System.out.println("Data inserted in database...");

    }
}