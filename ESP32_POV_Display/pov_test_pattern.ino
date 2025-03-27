#include <FastLED.h>

// LED-Konfiguration
#define NUM_LEDS 128       // Anzahl der LEDs im Streifen
#define DATA_PIN 5         // GPIO-Pin für Datenleitung der LEDs
#define LED_TYPE WS2813    // LED-Typ
#define COLOR_ORDER GRB    // Farbfolge bei den LEDs

// LED-Array
CRGB leds[NUM_LEDS];

// Testmuster-Konfiguration
#define NUM_PATTERNS 5      // Anzahl verschiedener Testmuster

void setup() {
  // Serielle Kommunikation initialisieren
  Serial.begin(115200);
  Serial.println("ESP32 POV Test-Muster gestartet");
  
  // LEDs initialisieren
  FastLED.addLeds<LED_TYPE, DATA_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(50);  // Helligkeit auf 50 von 255 setzen
  
  // Alle LEDs ausschalten
  FastLED.clear();
  FastLED.show();
}

void loop() {
  // Durchlaufe verschiedene Testmuster
  for (int pattern = 0; pattern < NUM_PATTERNS; pattern++) {
    Serial.print("Zeige Testmuster ");
    Serial.println(pattern);
    
    for (int i = 0; i < 100; i++) {  // 100 Wiederholungen pro Muster
      showPattern(pattern);
      delay(10);  // Kurze Verzögerung
    }
  }
}

void showPattern(int pattern) {
  // Alle LEDs ausschalten
  FastLED.clear();
  
  switch (pattern) {
    case 0:
      // Vollständig weiß
      fill_solid(leds, NUM_LEDS, CRGB::White);
      break;
      
    case 1:
      // Regenbogen
      for (int i = 0; i < NUM_LEDS; i++) {
        leds[i] = CHSV(i * 2, 255, 255);
      }
      break;
      
    case 2:
      // Abwechselnde rote und blaue Streifen
      for (int i = 0; i < NUM_LEDS; i++) {
        leds[i] = (i % 4 < 2) ? CRGB::Red : CRGB::Blue;
      }
      break;
      
    case 3:
      // Sinuswelle in Grün
      for (int i = 0; i < NUM_LEDS; i++) {
        int brightness = sin8(i * 4 + millis() / 10);
        leds[i] = CRGB(0, brightness, 0);
      }
      break;
      
    case 4:
      // Bewegendes Pixel
      int pos = (millis() / 20) % NUM_LEDS;
      leds[pos] = CRGB::Yellow;
      break;
  }
  
  // LEDs aktualisieren
  FastLED.show();
}