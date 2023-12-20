package com.calebcodes.fitness;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.calebcodes.fitness")
public class SpringBootFitnessApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootFitnessApplication.class, args);
	}


}
