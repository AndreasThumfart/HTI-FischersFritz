# HTI-Fischers Fritz - Digitales Fischfangbuch

Fischers Fritz ist ein digitales Prototyp-Projekt, das im Rahmen des Studienfachs Human Technology Interaction (HTI) entwickelt wurde. Das Ziel des Projekts ist es, ein interaktives Userinterface für ein digitales Fischfangbuch zu erstellen und die Interaktion zwischen Benutzer und Weboberfläche zu testen.

Inhalt
Projektübersicht
Features
Technologien
Installation
Nutzung
Struktur des Projekts
Autoren
Lizenz

Projektübersicht
Dieses Projekt ist ein Prototyp, der sich auf die Benutzerfreundlichkeit und Interaktivität konzentriert. Es bietet Fischern die Möglichkeit, ihre Fänge digital zu protokollieren, Details zu speichern und visuell ansprechend darzustellen.

-------------------------------------------------------------------------------------------

Features
Startseite:
Zeigt eine interaktive Karte und einen zentralen Button für die Fangaufnahme.

Fang aufnehmen:
Ein Formular, das über ein Offcanvas-Panel oder Modal eingeblendet wird.
Eingabe von Fängedetails: Fischname, Gewicht, Länge, Standort, Köder und mehr.
Integration eines Kamera-Uploads zur Erkennung von Fischen.

History:
Zeigt eine chronologische Liste von Fängen an.
Details jedes Fangs sind in einem Bootstrap-Akkordeon einsehbar.
Möglichkeit zur Filterung nach Zeitraum (24 Stunden, 1 Woche, 1 Monat, 1 Jahr).

Profil:
Informationen zum Benutzer und Statistiken zu den bisher gefangenen Fischen.

Datenvisualisierung:
Interaktive Darstellung der Fänge durch Bilder und Zahlen.

Simulierte Kamerafunktion:
Möglichkeit, ein Bild hochzuladen und zufällige Fischdaten zu generieren.

----------------------------------------------------------------------------------------

Technologien

Das Projekt verwendet folgende Technologien:

Frontend:

HTML, CSS, JavaScript
Bootstrap 5.2.3 für Styling und interaktive Komponenten
jQuery für DOM-Manipulation und Events
Google Maps API für die interaktive Kartendarstellung
Backend:

Keine dedizierte Backend-Logik, Daten werden im sessionStorage simuliert.

Datenhaltung:

JSON-Dateien (userdata.json, fish.json) zur Speicherung von Benutzer- und Fischdaten.

---------------------------------------------------------------------------------------
Installation
Projekt klonen:

bash
1) Code kopieren
    git clone https://github.com/<'Benutzername'>/fischers-fritz.git
    cd fischers-fritz

2) Abhängigkeiten installieren: Es werden keine zusätzlichen Pakete benötigt, da Bootstrap und jQuery über CDN eingebunden sind.

3) Lokalen Server starten: Verwenden Sie einen beliebigen lokalen Webserver, z. B.:
    bash
    python -m http.server
Oder verwenden Sie Live Server in Visual Studio Code.

4) Projekt im Browser öffnen: Rufen Sie http://localhost:8000 auf.

----------------------------------------------------------------------------------------

Nutzung
1. Startseite
Klicken Sie auf den "Fischfang"-Button, um das Eingabeformular für einen neuen Fang zu öffnen.
Die interaktive Karte dient zur Anzeige der Fangorte (derzeit statisch).
2. Fang hinzufügen
Füllen Sie das Formular aus:
Geben Sie Fischdetails ein oder nutzen Sie die Kamerafunktion.
Klicken Sie auf Speichern, um den Fang hinzuzufügen.
3. History
Navigieren Sie zur History-Seite, um eine Übersicht aller gespeicherten Fänge zu sehen.
Nutzen Sie das Akkordeon, um Fängedetails anzuzeigen.
4. Profil
Auf der Profilseite können Benutzer ihre Statistiken und bisherigen Fänge sehen.

----------------------------------------------------------------------------------------

Live-Demo
Das Projekt kann online unter folgendem Link aufgerufen und getestet werden:

Fischers Fritz - Online testen
https://hti-fischersfritz.azurewebsites.net/

-----------------------------------------------------------------------------------------   

Autoren
Team: Firat, Gunkel, Sucic & Thumfart
Fach: Human Technology Interaction (HTI)
Hochschule: FH Wien der WKW

-----------------------------------------------------------------------------------------
Lizenz
Dieses Projekt ist ein Studienprojekt und dient ausschließlich zu Lern- und Testzwecken. Die Inhalte dürfen ohne Genehmigung der Autoren nicht kommerziell genutzt werden.
