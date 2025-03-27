# ESP32 POV Display Projekt

Dieses Projekt implementiert ein POV (Persistence of Vision) Display mit einem ESP32 und WS2813 LEDs, um den Inhalt eines Desktop-Bildschirms auf einem rotierenden Zylinder anzuzeigen.

## Hardware-Anforderungen

- ESP32 WROOM 32 Mikrocontroller
- 128 WS2813 LEDs in einem Streifen
- Hall-Sensor zur Erkennung der Rotationsposition
- Stromversorgung für den LED-Streifen (5V, je nach LED-Anzahl ausreichender Stromstärke)
- Motorgesteuerte rotierende Halterung für den LED-Streifen

## Verkabelung

1. **LED-Anschluss:**
   - Datenpin der WS2813 LEDs an GPIO 5 des ESP32
   - 5V und GND mit entsprechender Stromversorgung verbinden

2. **Hall-Sensor:**
   - Signal des Hall-Sensors an GPIO 13 des ESP32
   - VCC und GND mit 3.3V und GND des ESP32 verbinden

## Software-Anforderungen

### ESP32:
- Arduino IDE mit ESP32-Unterstützung
- FastLED-Bibliothek

### Desktop:
- Python 3.x
- Bibliotheken: opencv-python, pillow, mss, numpy

## Installation

### ESP32-Code:
1. Öffnen Sie die Arduino IDE
2. Installieren Sie die ESP32-Platinen-Unterstützung
3. Installieren Sie die FastLED-Bibliothek
4. Öffnen Sie die `ESP32_POV_Display.ino` Datei
5. Passen Sie die WLAN-Einstellungen an (SSID und Passwort)
6. Hochladen auf den ESP32

### Desktop-Software:
1. Installieren Sie Python (falls noch nicht vorhanden)
2. Installieren Sie die benötigten Bibliotheken:
   ```
   pip install opencv-python pillow mss numpy
   ```
3. Starten Sie das Desktop-Capture-Programm:
   ```
   python desktop_capture.py --ip <ESP32-IP-Adresse>
   ```

## Konfiguration

### ESP32-Code:
- `NUM_LEDS`: Anzahl der LEDs im Streifen (Standardwert: 128)
- `DATA_PIN`: GPIO-Pin für die LED-Datenleitung (Standardwert: 5)
- `HALL_SENSOR_PIN`: GPIO-Pin für den Hall-Sensor (Standardwert: 13)

### Desktop-Software:
- `--ip`: IP-Adresse des ESP32 (Standardwert: 192.168.1.100)
- `--port`: UDP-Port des ESP32 (Standardwert: 8888)
- `--width`: Breite des POV-Displays (Standardwert: 128)
- `--fps`: Ziel-Bildrate (Standardwert: 30)

## Funktionsweise

1. Der ESP32 stellt eine WLAN-Verbindung her und startet einen UDP-Server
2. Die Desktop-Software erfasst den Bildschirminhalt
3. Jede Spalte des skalierten Bildes wird an den ESP32 gesendet
4. Der ESP32 speichert die Bilddaten
5. Wenn der Hall-Sensor eine vollständige Rotation erkennt, wird das Bild auf den LEDs angezeigt

## Fehlerbehebung

- **ESP32 verbindet sich nicht mit dem WLAN:** Überprüfen Sie SSID und Passwort
- **Kein Bild wird angezeigt:** Prüfen Sie die IP-Adresse und den Port
- **Unscharfes Bild:** Passen Sie die Rotationsgeschwindigkeit oder die Spaltenanzahl an

## Weiterentwicklung

- Implementierung eines Webservers auf dem ESP32 für einfachere Konfiguration
- Drahtlose Stromversorgung für den rotierenden Teil
- Zusätzliche Sensoren für bessere Synchronisation
- Kompression der Bilddaten für bessere Übertragungsraten