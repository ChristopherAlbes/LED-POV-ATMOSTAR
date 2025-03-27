#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import cv2
import numpy as np
import socket
import time
import mss
import sys
import argparse

def parse_arguments():
    parser = argparse.ArgumentParser(description='Capture desktop and send to ESP32 POV display')
    parser.add_argument('--ip', type=str, default='192.168.1.100', 
                        help='IP address of the ESP32 (default: 192.168.1.100)')
    parser.add_argument('--port', type=int, default=8888, 
                        help='UDP port of the ESP32 (default: 8888)')
    parser.add_argument('--width', type=int, default=128, 
                        help='Width of the POV display (default: 128)')
    parser.add_argument('--fps', type=int, default=30, 
                        help='Target frame rate (default: 30)')
    return parser.parse_args()

def capture_screen(columns):
    # Erstelle einen Screenshot-Grabber
    with mss.mss() as sct:
        # Hole den primären Monitor
        monitor = sct.monitors[1]
        
        # Erfasse den Screenshot
        screenshot = sct.grab(monitor)
        
        # Konvertiere zu einem OpenCV-Bild
        img = np.array(screenshot)
        img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
        
        # Skaliere das Bild, um es an unsere POV-Spalten anzupassen
        height = img.shape[0]
        aspect_ratio = img.shape[1] / img.shape[0]
        new_width = int(columns)
        new_height = int(new_width / aspect_ratio)
        
        # Falls das Bild zu hoch/breit ist, passe es entsprechend an
        if new_height > 128:
            new_height = 128
            new_width = int(new_height * aspect_ratio)
        
        img_resized = cv2.resize(img, (new_width, new_height))
        
        # Fülle das Bild auf, um 128 Pixel Höhe zu haben (zentriert)
        pad_top = (128 - new_height) // 2
        pad_bottom = 128 - new_height - pad_top
        
        img_padded = cv2.copyMakeBorder(
            img_resized, 
            pad_top, pad_bottom, 0, 0, 
            cv2.BORDER_CONSTANT, 
            value=[0, 0, 0]
        )
        
        return img_padded

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
    
    # Spaltenanzahl des POV-Displays
    columns = args.width
    
    print(f"Desktop-Capture gestartet - sende an {args.ip}:{args.port}")
    print("Drücken Sie Strg+C zum Beenden")

    try:
        while True:
            start_time = time.time()
            
            # Bildschirm erfassen
            img = capture_screen(columns)
            
            # Zeige das erfasste Bild an (Debug)
            cv2.imshow('Captured Screen', img)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
            
            # Durchlaufe jede Spalte und sende die Daten an den ESP32
            for col in range(min(columns, img.shape[1])):
                column_data = img[:, col, :]
                send_column_data(udp_socket, args.ip, args.port, col, column_data)
                
                # Kleine Pause, um den ESP32 nicht zu überlasten
                time.sleep(0.001)
            
            # Berechne und halt die Bildrate
            elapsed_time = time.time() - start_time
            sleep_time = max(0, 1.0/args.fps - elapsed_time)
            time.sleep(sleep_time)
            
            # Zeige die tatsächliche Bildrate an
            actual_fps = 1.0 / (elapsed_time + sleep_time)
            print(f"\rBildrate: {actual_fps:.2f} FPS", end="")
            
    except KeyboardInterrupt:
        print("\nProgramm beendet.")
    finally:
        cv2.destroyAllWindows()
        udp_socket.close()

if __name__ == "__main__":
    main()