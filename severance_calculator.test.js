import { describe, it, expect } from 'vitest';
import { SeveranceCalculator } from './severance_calculator.js';

describe('SeveranceCalculator', () => {
  describe('constructor', () => {
    describe('validation', () => {
      it('should throw error when salary is less than 1', () => {
        expect(() => {
          new SeveranceCalculator({
            salary: 0,
            startDate: '2023-01-01',
            endDate: '2023-12-31'
          });
        }).toThrow('Salary must be greater than zero');
      });

      it('should throw error when salary is negative', () => {
        expect(() => {
          new SeveranceCalculator({
            salary: -1000,
            startDate: '2023-01-01',
            endDate: '2023-12-31'
          });
        }).toThrow('Salary must be greater than zero');
      });

      it('should throw error when start date is before 2023-01-01', () => {
        expect(() => {
          new SeveranceCalculator({
            salary: 1000000,
            startDate: '2022-12-31',
            endDate: '2023-06-01'
          });
        }).toThrow('January 1, 2023 is the earliest possible date');
      });

      it('should throw error when end date equals start date', () => {
        expect(() => {
          new SeveranceCalculator({
            salary: 1000000,
            startDate: '2023-01-01',
            endDate: '2023-01-01'
          });
        }).toThrow('The end date needs to be after the start date');
      });

      it('should throw error when end date is before start date', () => {
        expect(() => {
          new SeveranceCalculator({
            salary: 1000000,
            startDate: '2023-06-01',
            endDate: '2023-01-01'
          });
        }).toThrow('The end date needs to be after the start date');
      });
    });

    describe('successful construction', () => {
      it('should create instance with valid parameters', () => {
        const calculator = new SeveranceCalculator({
          salary: 1000000,
          startDate: '2023-01-01',
          endDate: '2023-12-31'
        });

        expect(calculator).toBeInstanceOf(SeveranceCalculator);
        expect(calculator.salary).toBe(1000000);
        expect(calculator.startDate).toEqual(new Date('2023-01-01'));
        expect(calculator.endDate).toEqual(new Date('2023-12-31'));
      });

      it('should accept minimum wage salary', () => {
        const calculator = new SeveranceCalculator({
          salary: SeveranceCalculator.MINIMUM_WAGE,
          startDate: '2023-01-01',
          endDate: '2023-12-31'
        });

        expect(calculator.salary).toBe(877803);
      });

      it('should accept start date exactly on 2023-01-01', () => {
        const calculator = new SeveranceCalculator({
          salary: 1000000,
          startDate: '2023-01-01',
          endDate: '2023-06-01'
        });

        expect(calculator.startDate).toEqual(new Date('2023-01-01'));
      });
    });
  });

  describe('daysWorked()', () => {
    it('should calculate 1 day worked', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-01-02'
      });

      expect(calculator.daysWorked()).toBe(1);
    });

    it('should calculate 30 days worked', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-01-31'
      });

      expect(calculator.daysWorked()).toBe(30);
    });

    it('should calculate 180 days worked', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-06-30'
      });

      expect(calculator.daysWorked()).toBe(180);
    });

    it('should calculate 359 days worked', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-12-26'
      });

      expect(calculator.daysWorked()).toBe(359);
    });

    it('should calculate exactly 360 days worked', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-12-27'
      });

      expect(calculator.daysWorked()).toBe(360);
    });

    it('should cap at 360 days when 361 days worked', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-12-28'
      });

      expect(calculator.daysWorked()).toBe(360);
    });

    it('should cap at 360 days when 500 days worked', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2024-05-15'
      });

      expect(calculator.daysWorked()).toBe(360);
    });

    it('should cap at 360 days when 730 days worked (2 years)', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2024-12-31'
      });

      expect(calculator.daysWorked()).toBe(360);
    });
  });

  describe('bonuses()', () => {
    it('should calculate bonuses using formula: (salary × days) / 360', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      const expected = (1000000 * 181) / 360;
      expect(calculator.bonuses()).toBeCloseTo(expected, 2);
    });

    it('should calculate bonuses for 180 days', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-06-30'
      });

      expect(calculator.bonuses()).toBeCloseTo(500000, 2);
    });

    it('should calculate bonuses for full 360 days', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-12-27'
      });

      expect(calculator.bonuses()).toBe(1000000);
    });

    it('should calculate bonuses at minimum wage', () => {
      const calculator = new SeveranceCalculator({
        salary: 877803,
        startDate: '2023-01-01',
        endDate: '2023-12-27'
      });

      expect(calculator.bonuses()).toBe(877803);
    });
  });

  describe('savings()', () => {
    it('should equal bonuses', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      expect(calculator.savings()).toBe(calculator.bonuses());
    });

    it('should calculate savings for 180 days', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-06-30'
      });

      expect(calculator.savings()).toBeCloseTo(500000, 2);
    });

    it('should calculate savings for full 360 days', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-12-27'
      });

      expect(calculator.savings()).toBe(1000000);
    });
  });

  describe('interestOnSavings()', () => {
    it('should calculate interest using formula: round((savings × days × 0.12) / 360)', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      const days = 181;
      const savings = calculator.savings();
      const expected = Math.round((savings * days * 0.12) / 360);
      expect(calculator.interestOnSavings()).toBe(expected);
    });

    it('should return rounded integer value', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      expect(Number.isInteger(calculator.interestOnSavings())).toBe(true);
    });

    it('should calculate interest for 180 days', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-06-30'
      });

      const savings = 500000;
      const expected = Math.round((savings * 180 * 0.12) / 360);
      expect(calculator.interestOnSavings()).toBe(expected);
    });

    it('should calculate interest for full 360 days at minimum wage', () => {
      const calculator = new SeveranceCalculator({
        salary: 877803,
        startDate: '2023-01-01',
        endDate: '2023-12-27'
      });

      const savings = 877803;
      const expected = Math.round((savings * 360 * 0.12) / 360);
      expect(calculator.interestOnSavings()).toBe(expected);
      expect(calculator.interestOnSavings()).toBe(105336);
    });
  });

  describe('vacation()', () => {
    it('should calculate vacation using formula: (salary × days) / 720', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      const expected = (1000000 * 181) / 720;
      expect(calculator.vacation()).toBeCloseTo(expected, 2);
    });

    it('should calculate vacation for 180 days', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-06-30'
      });

      expect(calculator.vacation()).toBeCloseTo(250000, 2);
    });

    it('should calculate vacation for full 360 days', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-12-27'
      });

      expect(calculator.vacation()).toBe(500000);
    });

    it('should calculate vacation at minimum wage', () => {
      const calculator = new SeveranceCalculator({
        salary: 877803,
        startDate: '2023-01-01',
        endDate: '2023-12-27'
      });

      expect(calculator.vacation()).toBeCloseTo(438901.5, 2);
    });
  });

  describe('total()', () => {
    it('should sum all components and round to integer', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      const expected = Math.round(
        calculator.bonuses() +
        calculator.savings() +
        calculator.interestOnSavings() +
        calculator.vacation()
      );

      expect(calculator.total()).toBe(expected);
    });

    it('should return integer value', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      expect(Number.isInteger(calculator.total())).toBe(true);
    });

    it('should calculate total for 181 days scenario', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      // Based on actual calculation
      expect(calculator.total()).toBe(1287278);
    });

    it('should calculate total for 360 days at minimum wage', () => {
      const calculator = new SeveranceCalculator({
        salary: 877803,
        startDate: '2023-01-01',
        endDate: '2023-12-27'
      });

      // Based on TESTING.md expected values
      expect(calculator.total()).toBe(2299844);
    });
  });

  describe('toString()', () => {
    it('should return formatted string with all components', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      const output = calculator.toString();

      expect(output).toContain('Total liquidacion due for 181 days worked at $1000000');
      expect(output).toContain('Primas:');
      expect(output).toContain('Cesantias:');
      expect(output).toContain('Intereses sobre cesantias:');
      expect(output).toContain('Vacaciones:');
      expect(output).toContain('Total:');
    });

    it('should format bonuses with 2 decimal places', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      const output = calculator.toString();
      const bonusesValue = calculator.bonuses().toFixed(2);

      expect(output).toContain(`Primas: ${bonusesValue}`);
    });

    it('should format savings with 2 decimal places', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      const output = calculator.toString();
      const savingsValue = calculator.savings().toFixed(2);

      expect(output).toContain(`Cesantias: ${savingsValue}`);
    });

    it('should format vacation with 2 decimal places', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      const output = calculator.toString();
      const vacationValue = calculator.vacation().toFixed(2);

      expect(output).toContain(`Vacaciones: ${vacationValue}`);
    });

    it('should show interest as integer without decimal places', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      const output = calculator.toString();
      const interestValue = calculator.interestOnSavings();

      expect(output).toContain(`Intereses sobre cesantias: ${interestValue}`);
      expect(output).not.toContain(`Intereses sobre cesantias: ${interestValue}.00`);
    });

    it('should show total as integer without decimal places', () => {
      const calculator = new SeveranceCalculator({
        salary: 1000000,
        startDate: '2023-01-01',
        endDate: '2023-07-01'
      });

      const output = calculator.toString();
      const totalValue = calculator.total();

      expect(output).toContain(`Total: ${totalValue}`);
      expect(output).not.toContain(`Total: ${totalValue}.00`);
    });
  });

  describe('integration scenarios', () => {
    describe('6-month employment', () => {
      it('should calculate correctly for 6 months (181 days)', () => {
        const calculator = new SeveranceCalculator({
          salary: 1000000,
          startDate: '2023-01-01',
          endDate: '2023-07-01'
        });

        expect(calculator.daysWorked()).toBe(181);
        expect(calculator.bonuses()).toBeCloseTo(502777.78, 2);
        expect(calculator.savings()).toBeCloseTo(502777.78, 2);
        expect(calculator.interestOnSavings()).toBe(30334);
        expect(calculator.vacation()).toBeCloseTo(251388.89, 2);
        expect(calculator.total()).toBe(1287278);
      });
    });

    describe('full year at minimum wage', () => {
      it('should calculate correctly for 360 days at minimum wage', () => {
        const calculator = new SeveranceCalculator({
          salary: 877803,
          startDate: '2023-01-01',
          endDate: '2023-12-27'
        });

        expect(calculator.daysWorked()).toBe(360);
        expect(calculator.bonuses()).toBe(877803);
        expect(calculator.savings()).toBe(877803);
        expect(calculator.interestOnSavings()).toBe(105336);
        expect(calculator.vacation()).toBeCloseTo(438901.5, 2);
        expect(calculator.total()).toBe(2299844);
      });
    });

    describe('multi-year capping', () => {
      it('should cap at 360 days for 2-year employment', () => {
        const calculator = new SeveranceCalculator({
          salary: 1000000,
          startDate: '2023-01-01',
          endDate: '2024-12-31'
        });

        expect(calculator.daysWorked()).toBe(360);
        expect(calculator.bonuses()).toBe(1000000);
        expect(calculator.savings()).toBe(1000000);
        expect(calculator.interestOnSavings()).toBe(120000);
        expect(calculator.vacation()).toBe(500000);
        expect(calculator.total()).toBe(2620000);
      });

      it('should produce same result for 361 days as 360 days', () => {
        const calculator360 = new SeveranceCalculator({
          salary: 1000000,
          startDate: '2023-01-01',
          endDate: '2023-12-27'
        });

        const calculator361 = new SeveranceCalculator({
          salary: 1000000,
          startDate: '2023-01-01',
          endDate: '2023-12-28'
        });

        expect(calculator360.total()).toBe(calculator361.total());
      });
    });

    describe('edge cases', () => {
      it('should handle 1 day of work', () => {
        const calculator = new SeveranceCalculator({
          salary: 1000000,
          startDate: '2023-01-01',
          endDate: '2023-01-02'
        });

        expect(calculator.daysWorked()).toBe(1);
        expect(calculator.total()).toBeGreaterThan(0);
      });

      it('should handle exactly 30 days (1 month)', () => {
        const calculator = new SeveranceCalculator({
          salary: 1000000,
          startDate: '2023-01-01',
          endDate: '2023-01-31'
        });

        expect(calculator.daysWorked()).toBe(30);
        expect(calculator.bonuses()).toBeCloseTo(83333.33, 2);
      });

      it('should handle high salary values', () => {
        const calculator = new SeveranceCalculator({
          salary: 50000000,
          startDate: '2023-01-01',
          endDate: '2023-12-27'
        });

        expect(calculator.daysWorked()).toBe(360);
        expect(calculator.total()).toBeGreaterThan(0);
        expect(Number.isFinite(calculator.total())).toBe(true);
      });
    });
  });
});
