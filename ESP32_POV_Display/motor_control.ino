#include <ESP32Servo.h>

// Motor-Konfiguration
#define MOTOR_PIN 14        // GPIO-Pin für den Motor (PWM)
#define HALL_SENSOR_PIN 13  // GPIO-Pin für den Hall-Sensor

// Drehzahl-Einstellungen
#define MIN_SPEED 20        // Minimale Geschwindigkeit (0-255)
#define MAX_SPEED 180       // Maximale Geschwindigkeit (0-255)
#define TARGET_RPM 300      // Ziel-Drehzahl in Umdrehungen pro Minute

// Servo/Motor-Objekt
Servo motor;

// Variablen für die Drehzahlregelung
volatile unsigned long lastRotationTime = 0;
volatile unsigned long currentRotationTime = 0;
volatile boolean rotationDetected = false;
int currentSpeed = MIN_SPEED;
float currentRPM = 0;

void setup() {
  // Serielle Kommunikation initialisieren
  Serial.begin(115200);
  Serial.println("ESP32 Motor-Steuerung gestartet");
  
  // Motor initialisieren
  ESP32PWM::allocateTimer(0);
  motor.setPeriodHertz(50);    // Standard für Servos/ESCs: 50 Hz
  motor.attach(MOTOR_PIN, 1000, 2000);  // Min/Max Pulsdauer anpassen
  
  // Motor zunächst auf minimaler Geschwindigkeit
  motor.write(MIN_SPEED);
  
  // Hall-Sensor als Eingang mit Pullup-Widerstand einrichten
  pinMode(HALL_SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(HALL_SENSOR_PIN), rotationIsr, FALLING);
  
  // Kurze Pause für die Initialisierung
  delay(2000);
  
  Serial.println("Motor wird gestartet...");
}

void loop() {
  // Berechne aktuelle Drehzahl, wenn eine Rotation erkannt wurde
  if (rotationDetected) {
    unsigned long rotationTime = currentRotationTime - lastRotationTime;
    currentRPM = 60000.0 / rotationTime; // Umrechnung in RPM
    
    Serial.print("Drehzahl: ");
    Serial.print(currentRPM);
    Serial.println(" RPM");
    
    // Drehzahlregelung
    adjustSpeed();
    
    rotationDetected = false;
  }
  
  // Beim Anlaufen oder wenn keine Rotation erkannt wird
  unsigned long currentTime = millis();
  if (currentTime - lastRotationTime > 2000) {
    // Keine Rotation seit 2 Sekunden, erhöhe die Geschwindigkeit
    if (currentSpeed < MAX_SPEED) {
      currentSpeed += 5;
      if (currentSpeed > MAX_SPEED) currentSpeed = MAX_SPEED;
      
      motor.write(currentSpeed);
      
      Serial.print("Keine Rotation erkannt. Erhöhe Geschwindigkeit auf: ");
      Serial.println(currentSpeed);
    }
  }
  
  delay(500); // Regelmäßige Überprüfung
}

// Interrupt-Service-Routine für die Rotationserkennung
void IRAM_ATTR rotationIsr() {
  // Debouncing - ignoriere Trigger, die zu schnell aufeinanderfolgen
  unsigned long now = millis();
  if (now - currentRotationTime > 50) {  // 50ms Debounce-Zeit
    lastRotationTime = currentRotationTime;
    currentRotationTime = now;
    rotationDetected = true;
  }
}

// Geschwindigkeit anpassen, um die Ziel-Drehzahl zu erreichen
void adjustSpeed() {
  if (currentRPM < TARGET_RPM - 5) {
    // Drehzahl zu niedrig, erhöhe die Geschwindigkeit
    if (currentSpeed < MAX_SPEED) {
      currentSpeed += 1;
      motor.write(currentSpeed);
      
      Serial.print("Erhöhe Geschwindigkeit auf: ");
      Serial.println(currentSpeed);
    }
  } 
  else if (currentRPM > TARGET_RPM + 5) {
    // Drehzahl zu hoch, reduziere die Geschwindigkeit
    if (currentSpeed > MIN_SPEED) {
      currentSpeed -= 1;
      motor.write(currentSpeed);
      
      Serial.print("Reduziere Geschwindigkeit auf: ");
      Serial.println(currentSpeed);
    }
  }
}