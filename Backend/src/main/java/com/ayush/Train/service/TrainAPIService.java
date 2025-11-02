//package com.ayush.Train.service;
//
//import org.springframework.stereotype.Service;
//
//import java.io.IOException;
//import java.net.URI;
//import java.net.http.HttpClient;
//import java.net.http.HttpRequest;
//import java.net.http.HttpResponse;
//
//@Service
//public class TrainAPIService {
//
//    public String getTrainInfo(String source, String destination) throws IOException, InterruptedException {
//        String apiUrl = "https://indian-railways-train-fetcher.p.rapidapi.com/get_train_info?start=" +
//                source + "&destination=" + destination;
//
//        HttpRequest request = HttpRequest.newBuilder()
//                .uri(URI.create(apiUrl))
//                .header("x-rapidapi-host", "indian-railways-train-fetcher.p.rapidapi.com")
//                .header("x-rapidapi-key", "b1b169f0d8msh769d273fb66c80bp1cad7cjsn1698a7c000dc") // Your API key
//                .GET()
//                .build();
//
//        HttpClient client = HttpClient.newHttpClient();
//        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
//
//        return response.body();
//    }
//}
