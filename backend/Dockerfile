# Use Maven image for building
FROM maven:3.8-openjdk-17 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Use Eclipse Temurin runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built jar file
COPY --from=build /app/target/khanathikana-backend-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
