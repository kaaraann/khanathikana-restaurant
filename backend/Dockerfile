# Use Maven image for building
FROM maven:3.9-openjdk-17 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Use OpenJDK runtime image
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built jar file
COPY --from=build /app/target/khanathikana-backend-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
