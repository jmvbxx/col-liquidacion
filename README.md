# Colombian Severance Pay Calculator (Calculadora de Liquidación)

A simple, client-side web application for calculating employee severance benefits according to Colombian labor law.

## Overview

This calculator computes the four components of Colombian severance pay (liquidación) when an employment relationship ends:

- **Primas** (Bonuses) - Semi-annual bonus payments
- **Cesantías** (Severance Savings) - Mandatory savings fund
- **Intereses sobre Cesantías** (Interest on Savings) - 12% annual interest on cesantías
- **Vacaciones** (Vacation Pay) - Accrued vacation compensation

## Features

- Zero dependencies - Pure JavaScript with no frameworks
- No build step required - Just open in a browser
- Colombian labor law compliant - Uses 360-day accounting year
- Input validation - Enforces minimum wage and date constraints
- Real-time calculation - Instant results on form submission

## Colombian Labor Law Context

This calculator implements the **360-day accounting year** standard used in Colombian labor calculations, where:
- A year = 360 days (12 months × 30 days)
- Calculations are capped at 360 days maximum
- All formulas follow Colombian Ministry of Labor guidelines

**Important Notes:**
- Deduct any primas already paid mid-year (typically in June)
- The minimum wage is set to 877,803 COP (update yearly as needed)
- Start dates are limited to January 1, 2020 or later

## Quick Start

### Option 1: Open Directly
```bash
open index.html
```

### Option 2: Local HTTP Server
```bash
# Using Python
python3 -m http.server 8000
# Then navigate to http://localhost:8000

# Or using Node.js
npx http-server
```

## Usage

1. Enter the average monthly salary in Colombian pesos (COP)
2. Select the employment start date
3. Select the employment end date
4. Click "Calculate" to see the breakdown

The calculator will display:
- Days worked (capped at 360)
- Each severance component amount
- Total severance payment due

## Calculation Formulas

The calculator uses the following formulas per Colombian labor law:

| Component | Formula |
|-----------|---------|
| **Primas** | (salary × days_worked) ÷ 360 |
| **Cesantías** | (salary × days_worked) ÷ 360 |
| **Intereses** | (cesantías × days_worked × 0.12) ÷ 360 |
| **Vacaciones** | (salary × days_worked) ÷ 720 |

### Example Calculation

For an employee with:
- Monthly salary: 1,000,000 COP
- Employment period: 181 days (≈6 months)

Results:
```
Primas:                  502,777.78 COP
Cesantías:               502,777.78 COP
Intereses:                30,167.00 COP
Vacaciones:              251,388.89 COP
─────────────────────────────────────
Total:                 1,287,112.00 COP
```

## Development

### Project Structure
```
col-liquidacion/
├── index.html                    # Web interface
├── severance_calculator.js       # Core calculation logic (ES6 module)
├── severance_calculator.test.js  # Test suite
├── package.json                  # Node.js project config
├── README.md                     # This file
├── CLAUDE.md                     # AI assistant instructions
└── TESTING.md                    # Test implementation plan
```

### Architecture

**Single-file application** - All logic is contained in `severance_calculator.js` as a standalone ES6 class:

```javascript
class SeveranceCalculator {
  static MINIMUM_WAGE = 877803;
  static START_DATE = new Date('2020-01-01');

  constructor({ salary, startDate, endDate }) { /* ... */ }
  daysWorked() { /* ... */ }
  bonuses() { /* ... */ }
  savings() { /* ... */ }
  interestOnSavings() { /* ... */ }
  vacation() { /* ... */ }
  total() { /* ... */ }
  toString() { /* ... */ }
}
```

The class is exported as an ES6 module and can be imported for testing or extended functionality.

## Testing

The project includes a comprehensive test suite using [Vitest](https://vitest.dev/).

### Setup
```bash
npm install
```

### Run Tests
```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

### Test Coverage

Target: **100% code coverage** across all metrics
- Lines, functions, branches, and statements
- See [TESTING.md](./TESTING.md) for detailed test plan

## Constants

Update these values in `severance_calculator.js` as needed:

```javascript
static MINIMUM_WAGE = 877803;    // Update annually per Colombian law
static START_DATE = new Date('2020-01-01');  // Earliest allowed date
```

## Validation Rules

The calculator enforces the following validations:

1. **Salary** - Must be greater than zero
2. **Start Date** - Must be January 1, 2020 or later
3. **End Date** - Must be after the start date
4. **Days Worked** - Automatically capped at 360 days

## Browser Compatibility

Works in all modern browsers supporting:
- ES6 modules (`type="module"`)
- ES6 classes
- Native Date object
- DOM manipulation APIs

Tested in: Chrome, Firefox, Safari, Edge

## License

This project is provided as-is for educational and personal use.

## Contributing

Feel free to submit issues or pull requests for:
- Bug fixes
- Formula corrections
- UI improvements
- Additional features

When updating formulas, always cite official Colombian labor law sources.

## Resources

- [Colombian Ministry of Labor](https://www.mintrabajo.gov.co/)
- [Código Sustantivo del Trabajo](https://www.ilo.org/dyn/travail/docs/1539/CodigoSustantivodelTrabajoColombia.pdf)
- Colombian minimum wage updates published annually

---

**Note:** This calculator is for informational purposes. Always consult with a qualified labor attorney or accountant for official severance calculations.
