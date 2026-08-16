# Depth — Spearfishing Conditions

A lightweight, installable Progressive Web App that gives a live **go / no-go** read on spearfishing conditions — wind, swell, and rain — for any coastline or dive spot, before you drive to the water.

**Live app:** https://mohtadinasri.github.io/depth/

## Features

- Live conditions gauge (0–10 score) with go / caution / no-go read
- Wind speed & direction compass, swell height/period, rain outlook
- 7-day forecast outlook with mini condition dials
- Search any coast/bay/dive spot, or use your current location
- Dive log to track past sessions
- Metric/imperial unit toggle
- Installable as a standalone app (PWA) with offline support

## Tech

Vanilla HTML/CSS/JavaScript — no frameworks, no build step, no backend.

Data sources (all free, no API key required):
- [Open-Meteo Marine API](https://open-meteo.com/) — swell/wave data
- [Open-Meteo Forecast API](https://open-meteo.com/) — wind & rain
- [Open-Meteo Geocoding API](https://open-meteo.com/) — spot search

## Running locally

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/index.html`.

## Disclaimer

This app is guidance only, not a safety device. Always check conditions on site and dive within your limits.
