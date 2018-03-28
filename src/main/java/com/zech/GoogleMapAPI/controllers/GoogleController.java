package com.zech.GoogleMapAPI.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

@Controller
public class GoogleController {
    @RequestMapping("/googleMaps")
    public @ResponseBody String mapsRoute(){
        final String uri = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAdbF1AbR7XWc5dSSQ9co6Y8H5kAydDQXQ&libraries=places";

        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(uri, String.class);

        return result;
    }
}
