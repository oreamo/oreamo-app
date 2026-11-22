package com.oreamo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class OreamoApplication {

    public static void main(String[] args) {
        SpringApplication.run(OreamoApplication.class, args);
    }
}
