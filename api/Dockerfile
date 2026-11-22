FROM eclipse-temurin:25-jdk AS builder

WORKDIR /app

# Step 1. Download dependencies
COPY gradlew build.gradle settings.gradle ./
COPY gradle gradle
RUN ./gradlew dependencies --no-daemon

# Step 2. Build the jar
COPY src src
RUN ./gradlew bootJar --no-daemon

# Step 3. Run the jar
FROM eclipse-temurin:25-jre

WORKDIR /app

COPY --from=builder /app/build/libs/oreamo-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
