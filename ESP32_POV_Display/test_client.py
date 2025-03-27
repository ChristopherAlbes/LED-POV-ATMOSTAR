#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Test-Client für den ESP32 POV Display

Dieser Client sendet ein einfaches Testmuster an den ESP32.
Verwenden Sie dieses Skript, um die Kommunikation zu testen,
ohne die Desktop-Capture-Funktionalität zu nutzen.
"""

import socket
import time
import numpy as np
import argparse

def parse_arguments():
    parser = argparse.ArgumentParser(description='Send test patterns to ESP32 POV display')
    parser.add_argument('--ip', type=str, default='192.168.1.100', 
                        help='IP address of the ESP32 (default: 192.168.1.100)')
    parser.add_argument('--port', type=int, default=8888, 
                        help='UDP port of the ESP32 (default: 8888)')
    parser.add_argument('--width', type=int, default=128, 
                        help='Width of the POV display (default: 128)')
    parser.add_argument('--pattern', type=int, default=0, 
                        help='Pattern type (0: vertical bars, 1: horizontal bars, 2: checkerboard)')
    return parser.parse_args()

def create_pattern(pattern_type, width, height=128):
    """Erzeuge ein Testmuster"""
    if pattern_type == 0:
        # Vertikale Streifen
        pattern = np.zeros((height, width, 3), dtype=np.uint8)
        for i in range(width):
            if (i // 8) % 3 == 0:
                pattern[:, i] = [255, 0, 0]  # Rot
            elif (i // 8) % 3 == 1:
                pattern[:, i] = [0, 255, 0]  # Grün
            else:
                pattern[:, i] = [0, 0, 255]  # Blau
        return pattern
    
    elif pattern_type == 1:
        # Horizontale Streifen
        pattern = np.zeros((height, width, 3), dtype=np.uint8)
        for i in range(height):
            if (i // 8) % 3 == 0:
                pattern[i, :] = [255, 0, 0]  # Rot
            elif (i // 8) % 3 == 1:
                pattern[i, :] = [0, 255, 0]  # Grün
            else:
                pattern[i, :] = [0, 0, 255]  # Blau
        return pattern
    
    elif pattern_type == 2:
        # Schachbrettmuster
        pattern = np.zeros((height, width, 3), dtype=np.uint8)
        for i in range(height):
            for j in range(width):
                if ((i // 16) + (j // 16)) % 2 == 0:
                    pattern[i, j] = [255, 255, 255]  # Weiß
                else:
                    pattern[i, j] = [0, 0, 0]  # Schwarz
        return pattern
    
    else:
        # Regenbogenmuster
        pattern = np.zeros((height, width, 3), dtype=np.uint8)
        for i in range(width):
            hue = int(i * 180 / width)
            for j in range(height):
                # Einfache HSV zu RGB Umwandlung
                if hue < 60:
                    r, g, b = 255, int(hue * 255 / 60), 0
                elif hue < 120:
                    r, g, b = int((120 - hue) * 255 / 60), 255, 0
                else:
                    r, g, b = 0, 255, int((hue - 120) * 255 / 60)
                pattern[j, i] = [r, g, b]
        return pattern

def send_column_data(udp_socket, esp32_ip, esp32_port, column_idx, column_data):
    """Sendet Daten für eine einzelne Spalte an den ESP32."""
    # Wir nehmen die durchschnittliche Farbe der Spalte
    avg_color = np.mean(column_data, axis=0).astype(int)
    r, g, b = avg_color
    
    # Bereite das Datenpaket im Format "column,r,g,b" vor
    data = f"{column_idx},{r},{g},{b}"
    
    # Sende die Daten
    udp_socket.sendto(data.encode(), (esp32_ip, esp32_port))

def main():
    args = parse_arguments()
    
    # UDP-Socket für die Kommunikation mit dem ESP32 erstellen
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    # Erstelle das Testmuster
    pattern = create_pattern(args.pattern, args.width)
    
    print(f"Testmuster-Client gestartet - sende an {args.ip}:{args.port}")
    print(f"Muster-Typ: {args.pattern}")
    print("Drücken Sie Strg+C zum Beenden")

    try:
        while True:
            # Durchlaufe jede Spalte und sende die Daten an den ESP32
            for col in range(args.width):
                column_data = pattern[:, col, :]
                send_column_data(udp_socket, args.ip, args.port, col, column_data)
                
                # Kleine Pause, um den ESP32 nicht zu überlasten
                time.sleep(0.001)
            
            print(".", end="", flush=True)
            time.sleep(0.5)  # Aktualisiere alle 0,5 Sekunden
            
    except KeyboardInterrupt:
        print("\nProgramm beendet.")
    finally:
        udp_socket.close()

if __name__ == "__main__":
    main()