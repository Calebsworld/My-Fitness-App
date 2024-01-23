# Use the official OpenJDK 17 image as the base image
FROM openjdk:17

# Create a non-root user named "appuser"
RUN useradd -r -u 1001 -m appuser

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled JAR file from the target directory to the container
COPY target/spring-boot-fitness-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose the port that your Spring Boot application will run on (change if necessary)
EXPOSE 8080

# Change the ownership of the working directory to the "appuser"
RUN chown -R appuser: /app

# Switch to the "appuser" user
USER appuser

# Define the command to run your Spring Boot application
CMD ["java", "-jar", "app.jar"]
