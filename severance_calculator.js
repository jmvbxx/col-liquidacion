// Severance Calculator in JavaScript
class SeveranceCalculator {
    static MINIMUM_WAGE = 877803;
    static START_DATE = new Date('2020-01-01');

    constructor({ salary, startDate, endDate }) {
        if (salary < 1) throw new Error('Salary must be greater than zero');
        if (new Date(startDate) < SeveranceCalculator.START_DATE) {
            throw new Error('January 1, 2020 is the earliest possible date');
        }
        if (new Date(endDate) <= new Date(startDate)) {
            throw new Error('The end date needs to be after the start date');
        }

        this.salary = salary;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
    }

    daysWorked() {
        const days = Math.floor((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
        return Math.min(days, 360); // Ensure days do not exceed 360
    }

    bonuses() {
        return (this.salary * this.daysWorked()) / 360;
    }

    savings() {
        return this.bonuses();
    }

    interestOnSavings() {
        return Math.round((this.savings() * this.daysWorked() * 0.12) / 360);
    }

    vacation() {
        return (this.salary * this.daysWorked()) / 720;
    }

    total() {
        return Math.round(
            this.bonuses() + this.savings() + this.interestOnSavings() + this.vacation()
        );
    }

    toString() {
        return `Total liquidacion due for ${this.daysWorked()} days worked at $${this.salary}:
        Primas: ${this.bonuses().toFixed(2)}
        Cesantias: ${this.savings().toFixed(2)}
        Intereses sobre cesantias: ${this.interestOnSavings()}
        Vacaciones: ${this.vacation().toFixed(2)}
        Total: ${this.total()}`;
    }
}

// Example usage in HTML integration
function calculateSeverance() {
    const salary = parseFloat(document.getElementById('salary').value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    try {
        const calculator = new SeveranceCalculator({
            salary: salary || SeveranceCalculator.MINIMUM_WAGE,
            startDate,
            endDate,
        });

        document.getElementById('result').innerText = calculator.toString();
    } catch (error) {
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
}
