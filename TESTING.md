# Test Suite Implementation Plan

## Overview
Implement comprehensive test suite for the Colombian severance calculator using Vitest, targeting 100% code coverage of the `SeveranceCalculator` class.

## Approach: Vitest with ES Modules

**Why Vitest:**
- Zero-config ES6 module support
- Fast execution with excellent watch mode
- Built-in coverage reporting
- Jest-compatible API

**Architecture Strategy:**
- Convert to ES modules using `type: "module"` in package.json
- Add exports to `severance_calculator.js` for testing
- Update `index.html` to use `<script type="module">`
- Expose `calculateSeverance` to window for onclick compatibility

## Implementation Steps

### 1. Initialize Node.js Project

**Create package.json:**
```json
{
  "name": "col-liquidacion",
  "version": "1.0.0",
  "description": "Colombian severance pay calculator",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "^1.2.0",
    "@vitest/coverage-v8": "^1.2.0"
  }
}
```

**Update .gitignore:**
```
.idea/*
node_modules/
coverage/
```

**Install dependencies:**
```bash
npm install
```

### 2. Modify Source Code for Testability

**severance_calculator.js - Add at end (line 75+):**
```javascript
// Export for testing/module use
export { SeveranceCalculator, calculateSeverance };

// Make function available globally for inline onclick handlers
window.calculateSeverance = calculateSeverance;
```

**index.html - Update line 7:**
```html
<!-- Change from: -->
<script defer src="severance_calculator.js"></script>

<!-- To: -->
<script type="module" src="severance_calculator.js"></script>
```

### 3. Create Test File

**Create severance_calculator.test.js** with comprehensive test coverage:

#### Test Structure:
1. **Constructor Validation**
   - Salary > 0 validation
   - Start date >= 2023-01-01 validation
   - End date > start date validation
   - Valid construction success

2. **daysWorked() Tests**
   - Short periods (1 day, 30 days)
   - Normal periods (180 days, 359 days)
   - Exactly 360 days
   - Over 360 days (361, 500) - verify capping

3. **Calculation Method Tests**
   - `bonuses()`: (salary × days) / 360
   - `savings()`: equals bonuses
   - `interestOnSavings()`: round((savings × days × 0.12) / 360)
   - `vacation()`: (salary × days) / 720
   - `total()`: sum of all components, rounded

4. **toString() Tests**
   - Output format verification
   - Number formatting accuracy

5. **Integration Tests**
   - 6-month employment scenario
   - Full year at minimum wage
   - Multi-year capping at 360 days

#### Key Test Cases with Expected Values:

**180-day calculation:**
```javascript
salary: 1,000,000, days: 181
bonuses: 502,777.78
savings: 502,777.78
interestOnSavings: 30,167
vacation: 251,388.89
total: 1,287,112
```

**360-day calculation (minimum wage):**
```javascript
salary: 877,803, days: 360
bonuses: 877,803
savings: 877,803
interestOnSavings: 105,336
vacation: 438,901.50
total: 2,299,844
```

**Over 360 days (capping test):**
```javascript
startDate: 2023-01-01, endDate: 2024-12-31
actual days: 730
daysWorked() returns: 360
```

#### Test Organization Pattern:
```javascript
import { describe, it, expect } from 'vitest';
import { SeveranceCalculator } from './severance_calculator.js';

describe('SeveranceCalculator', () => {
  describe('constructor', () => {
    describe('validation', () => { /* error tests */ });
    describe('successful construction', () => { /* happy path */ });
  });
  describe('daysWorked()', () => { /* calculation tests */ });
  describe('bonuses()', () => { /* formula tests */ });
  describe('savings()', () => { /* formula tests */ });
  describe('interestOnSavings()', () => { /* formula + rounding tests */ });
  describe('vacation()', () => { /* formula tests */ });
  describe('total()', () => { /* sum + rounding tests */ });
  describe('toString()', () => { /* format tests */ });
  describe('integration scenarios', () => { /* end-to-end tests */ });
});
```

### 4. Testing Best Practices

- Use `toBeCloseTo()` for floating-point comparisons
- One assertion per test when possible
- Descriptive test names: "should..."
- Test both success and error paths
- Independent tests (no shared state)

## Critical Files

- **severance_calculator.js** - Add exports at line 75
- **index.html** - Update script tag on line 7
- **.gitignore** - Add node_modules/, coverage/
- **package.json** (new) - Project config with test scripts
- **severance_calculator.test.js** (new) - Test suite

## Verification Plan

### Run Tests:
```bash
npm test                # Run all tests once
npm run test:watch      # Interactive watch mode
npm run test:coverage   # Generate coverage report
```

### Success Criteria:
- ✅ All tests pass
- ✅ 100% code coverage (lines, functions, branches, statements)
- ✅ Coverage report in `coverage/` directory
- ✅ Browser functionality still works (open index.html)
- ✅ Calculator produces correct results for all test scenarios

### Manual Verification:
1. Open index.html in browser
2. Test calculation: salary=1,000,000, start=2023-01-01, end=2023-07-01
3. Verify result shows: ~1,287,112 total
4. Verify no console errors

## Coverage Goals

- **Target: 100%** for all metrics
- Lines: 100%
- Functions: 100%
- Branches: 100%
- Statements: 100%

Small codebase makes complete coverage achievable and maintainable.
