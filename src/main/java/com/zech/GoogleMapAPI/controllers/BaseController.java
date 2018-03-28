package com.zech.GoogleMapAPI.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class BaseController {

    @RequestMapping("/sec")
    public String secRoute(){
        return "index";
    }
    @RequestMapping("/")
    public String baseRoute(){
        return "index";
    }
}
