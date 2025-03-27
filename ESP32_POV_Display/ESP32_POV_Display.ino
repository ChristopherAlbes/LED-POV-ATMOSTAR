#include <FastLED.h>
#include <WiFi.h>
#include <WiFiUdp.h>

// LED-Konfiguration
#define NUM_LEDS 128        // Anzahl der LEDs im Streifen
#define DATA_PIN 5          // GPIO-Pin für Datenleitung der LEDs
#define LED_TYPE WS2813     // LED-Typ
#define COLOR_ORDER GRB     // Farbfolge bei den LEDs

// WLAN-Konfiguration - Bitte Ihre eigenen Werte eingeben
const char* ssid = "IHR_WLAN_NAME";
const char* password = "IHR_WLAN_PASSWORT";

// UDP-Konfiguration
WiFiUDP udp;
unsigned int localPort = 8888;  // Port zum Empfangen der Daten
char packetBuffer[1024];        // Buffer für eingehende Pakete

// LED-Array
CRGB leds[NUM_LEDS];

// Positions-Sensor-Konfiguration (für Rotationserkennung)
#define HALL_SENSOR_PIN 13      // Hall-Sensor oder anderer Positions-Sensor
volatile unsigned long lastRotationTime = 0;
volatile boolean newRotation = false;

// Variablen für die POV-Anzeige
const int COLUMNS = 128;        // Anzahl der Pixel-Spalten (entspricht der Auflösung)
uint8_t imageData[COLUMNS][3];  // Speichert RGB-Daten für jede Spalte

void setup() {
  // Serielle Kommunikation initialisieren
  Serial.begin(115200);
  
  // LEDs initialisieren
  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(50);  // Helligkeit auf 50 von 255 setzen
  
  // Alle LEDs ausschalten
  FastLED.clear();
  FastLED.show();
  
  // Mit WLAN verbinden
  setupWiFi();
  
  // UDP starten
  udp.begin(localPort);
  Serial.printf("UDP-Server gestartet, Port %d\\n", localPort);
  
  // Positions-Sensor-Interrupt einrichten
  pinMode(HALL_SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(HALL_SENSOR_PIN), rotationDetected, FALLING);
  
  Serial.println("ESP32 POV Display bereit!");
}

void loop() {
  // Prüfen auf neue UDP-Pakete
  int packetSize = udp.parsePacket();
  if (packetSize) {
    processUDPPacket(packetSize);
  }
  
  // Wenn eine neue Rotation erkannt wurde, beginne mit der Anzeige
  if (newRotation) {
    displayImage();
    newRotation = false;
  }
}

// WLAN-Verbindung herstellen
void setupWiFi() {
  Serial.printf("Verbinde mit %s ", ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println(" verbunden!");
  Serial.print("IP-Adresse: ");
  Serial.println(WiFi.localIP());
}

// Verarbeitet eingehende UDP-Pakete
void processUDPPacket(int packetSize) {
  // Empfange das Paket
  int len = udp.read(packetBuffer, sizeof(packetBuffer));
  if (len > 0) {
    packetBuffer[len] = 0;  // NULL-Terminierung
  }
  
  // Format für Bilddaten: <Spaltenindex>,<R>,<G>,<B>\\n
  // Beispiel: "10,255,0,0\\n" für Spalte 10 mit Rot
  
  char* token = strtok(packetBuffer, ",");
  if (token != NULL) {
    int column = atoi(token);
    
    // Prüfen, ob die Spalte im gültigen Bereich liegt
    if (column >= 0 && column < COLUMNS) {
      // Roten Farbwert lesen
      token = strtok(NULL, ",");
      if (token != NULL) {
        imageData[column][0] = atoi(token);
        
        // Grünen Farbwert lesen
        token = strtok(NULL, ",");
        if (token != NULL) {
          imageData[column][1] = atoi(token);
          
          // Blauen Farbwert lesen
          token = strtok(NULL, "\\n");
          if (token != NULL) {
            imageData[column][2] = atoi(token);
          }
        }
      }
    }
  }
}

// ISR für die Rotationserkennung
void IRAM_ATTR rotationDetected() {
  // Debouncing - ignoriere Trigger, die zu schnell aufeinanderfolgen
  unsigned long currentTime = millis();
  if (currentTime - lastRotationTime > 50) {  // 50ms Debounce-Zeit
    lastRotationTime = currentTime;
    newRotation = true;
  }
}

// Zeigt das empfangene Bild auf den LEDs an
void displayImage() {
  // Berechne, wie lange eine vollständige Rotation dauert
  static unsigned long lastDisplayTime = 0;
  unsigned long rotationDuration = millis() - lastDisplayTime;
  lastDisplayTime = millis();
  
  // Berechne, wie viel Zeit pro Spalte zur Verfügung steht
  float timePerColumn = rotationDuration / (float)COLUMNS;
  
  // Zeige jede Spalte des Bildes an
  for (int col = 0; col < COLUMNS; col++) {
    // Setze alle LEDs auf die Farbe dieser Spalte
    for (int led = 0; led < NUM_LEDS; led++) {
      leds[led] = CRGB(imageData[col][0], imageData[col][1], imageData[col][2]);
    }
    
    // LEDs aktualisieren
    FastLED.show();
    
    // Warte die berechnete Zeit
    delayMicroseconds(timePerColumn * 1000);
  }
  
  // LEDs nach Anzeige ausschalten
  FastLED.clear();
  FastLED.show();
}