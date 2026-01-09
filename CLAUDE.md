# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Colombian severance pay (liquidación) calculator. A simple client-side web application that calculates employee severance benefits based on Colombian labor law.

## Running the Application

This is a static HTML/JavaScript application with no build step or dependencies. Simply open `index.html` in a web browser:

```bash
open index.html
```

Or serve it locally with any HTTP server:

```bash
python3 -m http.server 8000
# Then navigate to http://localhost:8000
```

## Architecture

**Single-file application**: All logic is contained in `severance_calculator.js` as a standalone ES6 class.

**Core calculation class**: `SeveranceCalculator` computes four components of Colombian severance:
- **Primas** (bonuses): salary × days_worked / 360
- **Cesantías** (savings): same as primas
- **Intereses sobre cesantías** (interest on savings): savings × days_worked × 12% / 360
- **Vacaciones** (vacation): salary × days_worked / 720

**Colombian accounting**: Uses 360-day accounting year (12 months × 30 days), common in Colombian labor law. Maximum calculated period is capped at 360 days.

**Constants**:
- `MINIMUM_WAGE`: 877803 COP (Colombian pesos)
- `START_DATE`: 2023-01-01 (earliest allowed employment date)

**UI Integration**: `calculateSeverance()` function bridges HTML form to calculator class, handling input parsing and error display.

## Testing

See [TESTING.md](./TESTING.md) for the comprehensive test suite implementation plan using Vitest.
