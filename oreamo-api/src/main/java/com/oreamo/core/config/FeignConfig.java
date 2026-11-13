package com.oreamo.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.RequestInterceptor;

@Configuration
public class FeignConfig {

    private static final String SERVER_KEY_HEADER = "X-Oreamo-Server-Key";

    @Value("${app.agent.server-key}")
    private String serverKey;

    @Bean
    public RequestInterceptor serverKeyRequestInterceptor() {
        return template -> template.header(SERVER_KEY_HEADER, serverKey);
    }
}
