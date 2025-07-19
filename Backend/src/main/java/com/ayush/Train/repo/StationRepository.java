package com.ayush.Train.repo;

import com.ayush.Train.enitity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface StationRepository extends JpaRepository<com.ayush.Train.enitity.Station,Long> {
}