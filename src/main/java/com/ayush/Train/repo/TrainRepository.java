package com.ayush.Train.repo;

import com.ayush.Train.enitity.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainRepository extends JpaRepository<com.ayush.Train.enitity.Train,Long> {
}