package com.ayush.Train.enitity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;


@Entity
public class TrainSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "train_id")
    @JsonManagedReference
    private com.ayush.Train.enitity.Train train;

    @ManyToOne
    @JoinColumn(name="source_station_id")
    private com.ayush.Train.enitity.Station source;

    @ManyToOne
    @JoinColumn(name="destination_station_id")
    private com.ayush.Train.enitity.Station destination;

    private String departureTime;
    private String arrivalTime;

    public TrainSchedule()
    {

    }

    public TrainSchedule(Long id, com.ayush.Train.enitity.Train train, com.ayush.Train.enitity.Station source, com.ayush.Train.enitity.Station destination, String departureTime, String arrivalTime) {
        this.id = id;
        this.train = train;
        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public com.ayush.Train.enitity.Train getTrain() {
        return train;
    }

    public void setTrain(com.ayush.Train.enitity.Train train) {
        this.train = train;
    }

    public com.ayush.Train.enitity.Station getSource() {
        return source;
    }

    public void setSource(com.ayush.Train.enitity.Station source) {
        this.source = source;
    }

    public com.ayush.Train.enitity.Station getDestination() {
        return destination;
    }

    public void setDestination(com.ayush.Train.enitity.Station destination) {
        this.destination = destination;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
}