# AVT: Programmieraufgabe 3: Visuelle Analyse und Metriken 

## Einleitung

Nutzen Sie die Vorlage und die in der Vorlesung kennengelernten Fehlermetriken zur Analyse der Videoausgabe. Die Vorlage enthält einen Player, welche 2 Videos **synchron** abspielt, so dass diese Frame-genau verglichen werden können.
Dazu wurde das Quellmaterial in PNG-Sequenzen umgewandelt. Beispielmaterial finden Sie im Moodle. Fügen Sie das Material entpackt im `media`-Verzeichnis ein, danach sollte die Wiedergabe möglich sein.

Genauere Teilaufgaben finden Sie weiter unten im Dokument. Diese ergeben bis zu **9 Punkte**.

**1 Punkt gibt es wie bisher auch für allgemeine Code-Qualität.**

## Abgabe

Bitte laden Sie Ihre Lösung als **ZIP-Datei** im Moodle hoch. Bitte entfernen Sie vor dem Archivieren die PNG-Sequenzen aus Ihrem Projekt, da die Abgabe sonst unnötig groß wird.

## Teilaufgabe 1 (3 Punkte)

Nutzen Sie den vorbereiteten Anwendungsrumpf und berechnen Sie für das aktuelle Bildpaar der beiden Videos jeweils den _Maximum Error (MAX)_ und die _Sum of Absolute Differences (SAD)_. 
Geben Sie die errechneten Werte auf der Benutzeroberfläche im vorbereiteten Bereich aus! Die Gestaltung steht Ihnen frei.

## Teilaufgabe 2 (3 Punkte)

Erweitern Sie Ihre Lösung um den _Mean Absolute Difference (MAD)_, den _Mean Squared Error (MSE)_ und die _Peak-Signal-to-Noise-Ratio (PSNR)_ und geben Sie auch diese Werte auf der Benutzeroberfläche aus.

## Teilaufgabe 3 (3 Punkte)

Geben Sie für alle berechneten Metriken nicht nur den Ist-Zustand für das aktuelle Bildpaar an, sondern ergänzen Sie auch einen Mittelwert für jede der Metriken, welcher sich kontinuierlich während der Wiedergabe aktualisiert.
Ergänzen Sie für eines der Videos ein Histogramm welches die Farbverteilung des aktuellen Frames visualisiert und während der Wiedergabe aktualisiert wird.

## Hinweise und Tipps

- Nutzen Sie die `newFrameAvailable`-Methode des Precise-Videoplayers um zu überprüfen ob der aktuelle Frame bereits analysiert wurde

- Das oben verlinkte Videomaterial liegt in 3 Qualitätsstufen vor (Q30, Q50 und Q60), je höher die Zahl, desto schlechter die Qualität. Testweise können die Paarungen in der `main.js` geändert werden (voreingestellt ist ein Vergleich zwischen Q30 und Q60). Beispielsweise sollten Unterschiede zwischen Q50 und Q60 nicht so groß sein wie zwischen Q30 und Q60.

- Versuchen Sie für eine gute Performance die Anzahl der Iterationen über die Pixel-Buffer so gering wie möglich zu halten und errechnen Sie wiederverwendbare Zwischenergebnisse!

- Wenn Sie trotzdem Performance-Probleme haben und nicht mit der Framerate des Videos mithalten können, passen Sie in `main.js` die Framerate des Videos an (im Konstruktorargument des PlaybackController)

- Eine Einführung und Erläuterung für den Aufbau und die Funktionsweise eines Histogramms finden sie [hier](https://www.allaboutcircuits.com/technical-articles/image-histogram-characteristics-machine-learning-image-processing/).

- Wer eigene Videomaterialien verwenden möchte kann dies gerne tun. Am besten dazu das Tool FFMPEG installieren und ein Video in verschiedenen Qualitätsstufen extrahieren (Befehl variiert je nach verwendetem Codec). Anschließend eine PNG-Sequenz beider Videos ausspielen, z.B. mit `ffmpeg -i input.mov thumb%04d.png -hide_banner`. Anschließend müssen nur die Pfade in der `main.js` angepasst werden!
