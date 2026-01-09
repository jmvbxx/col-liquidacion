// Severance Calculator in JavaScript
class SeveranceCalculator {
    static MINIMUM_WAGE = 877803;
    static START_DATE = new Date('2023-01-01');

    constructor({ salary, startDate, endDate }) {
        if (salary < 1) throw new Error('Salary must be greater than zero');
        if (new Date(startDate) < SeveranceCalculator.START_DATE) {
            throw new Error('January 1, 2023 is the earliest possible date');
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

// Display results with deductions support
function displayResults(calculator, deductions, warningMessage = '') {
    const calculated = {
        primas: calculator.bonuses(),
        cesantias: calculator.savings(),
        intereses: calculator.interestOnSavings(),
        vacaciones: calculator.vacation()
    };

    const remaining = {
        primas: calculated.primas - deductions.primas,
        cesantias: calculated.cesantias - deductions.cesantias,
        intereses: calculated.intereses - deductions.intereses,
        vacaciones: calculated.vacaciones - deductions.vacaciones
    };

    const totalCalculated = calculator.total();
    const totalDeductions = deductions.primas + deductions.cesantias +
                           deductions.intereses + deductions.vacaciones;
    const totalRemaining = totalCalculated - totalDeductions;

    const formatCurrency = (amount) => {
        return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const getRemainingClass = (amount) => {
        return amount > 0.01 ? 'remaining-positive' : 'remaining-zero';
    };

    const warningHtml = warningMessage ?
        `<div class="info-note" style="border-left-color: #d9534f; color: #d9534f;">${warningMessage}</div>` : '';

    const html = `
        <p><strong>Days worked:</strong> ${calculator.daysWorked()} days</p>

        <table class="results-table">
            <thead>
                <tr>
                    <th>Component</th>
                    <th>Calculated</th>
                    <th>Paid</th>
                    <th>Remaining</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Primas</td>
                    <td>${formatCurrency(calculated.primas)}</td>
                    <td>${formatCurrency(deductions.primas)}</td>
                    <td class="${getRemainingClass(remaining.primas)}">${formatCurrency(remaining.primas)}</td>
                </tr>
                <tr>
                    <td>Cesantías</td>
                    <td>${formatCurrency(calculated.cesantias)}</td>
                    <td>${formatCurrency(deductions.cesantias)}</td>
                    <td class="${getRemainingClass(remaining.cesantias)}">${formatCurrency(remaining.cesantias)}</td>
                </tr>
                <tr>
                    <td>Intereses sobre Cesantías</td>
                    <td>${formatCurrency(calculated.intereses)}</td>
                    <td>${formatCurrency(deductions.intereses)}</td>
                    <td class="${getRemainingClass(remaining.intereses)}">${formatCurrency(remaining.intereses)}</td>
                </tr>
                <tr>
                    <td>Vacaciones</td>
                    <td>${formatCurrency(calculated.vacaciones)}</td>
                    <td>${formatCurrency(deductions.vacaciones)}</td>
                    <td class="${getRemainingClass(remaining.vacaciones)}">${formatCurrency(remaining.vacaciones)}</td>
                </tr>
                <tr class="total-row">
                    <td>TOTAL</td>
                    <td>${formatCurrency(totalCalculated)}</td>
                    <td>${formatCurrency(totalDeductions)}</td>
                    <td class="${getRemainingClass(totalRemaining)}">${formatCurrency(totalRemaining)}</td>
                </tr>
            </tbody>
        </table>

        ${warningHtml}

        <div class="info-note">
            <strong>Note:</strong> Colombian labor law uses a 360-day accounting year (12 months × 30 days).
            Remember to deduct any primas already paid mid-year (typically in June).
        </div>
    `;

    document.getElementById('result-content').innerHTML = html;
}

// Calculate with deductions applied
function calculateWithDeductions() {
    if (!window.currentCalculator) {
        alert('Please calculate severance amounts first.');
        return;
    }

    const deductions = {
        primas: parseFloat(document.getElementById('deduction-primas').value) || 0,
        cesantias: parseFloat(document.getElementById('deduction-cesantias').value) || 0,
        intereses: parseFloat(document.getElementById('deduction-intereses').value) || 0,
        vacaciones: parseFloat(document.getElementById('deduction-vacaciones').value) || 0
    };

    // Validate deductions don't exceed calculated amounts
    const calculator = window.currentCalculator;
    const warnings = [];

    if (deductions.primas > calculator.bonuses()) {
        warnings.push('Primas deduction exceeds calculated amount');
    }
    if (deductions.cesantias > calculator.savings()) {
        warnings.push('Cesantías deduction exceeds calculated amount');
    }
    if (deductions.intereses > calculator.interestOnSavings()) {
        warnings.push('Intereses deduction exceeds calculated amount');
    }
    if (deductions.vacaciones > calculator.vacation()) {
        warnings.push('Vacaciones deduction exceeds calculated amount');
    }

    if (warnings.length > 0) {
        const warningMessage = '<strong>Warning:</strong> ' + warnings.join('; ') +
                               '. The deductions will still be applied but may result in negative remaining amounts.';
        displayResults(calculator, deductions, warningMessage);
    } else {
        displayResults(calculator, deductions);
    }
}

// Toggle deductions section visibility
function toggleDeductions() {
    const section = document.getElementById('deductions-section');
    const button = document.getElementById('toggle-deductions');
    const inputs = section.querySelectorAll('input, button.secondary-button, .deductions-help');

    if (button.textContent === 'Hide') {
        inputs.forEach(el => el.style.display = 'none');
        button.textContent = 'Show';
    } else {
        inputs.forEach(el => el.style.display = '');
        button.textContent = 'Hide';
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

        // Store calculator in global scope for deduction calculations
        window.currentCalculator = calculator;

        // Display results without deductions first
        displayResults(calculator, {
            primas: 0,
            cesantias: 0,
            intereses: 0,
            vacaciones: 0
        });

        // Show deductions section after first calculation
        document.getElementById('deductions-section').style.display = 'block';

    } catch (error) {
        document.getElementById('result-content').innerHTML = `
            <p style="color: #d9534f;"><strong>Error:</strong> ${error.message}</p>
        `;
    }
}

// Export for testing/module use
export { SeveranceCalculator, calculateSeverance };

// Make functions available globally for inline onclick handlers (browser only)
if (typeof window !== 'undefined') {
    window.calculateSeverance = calculateSeverance;
    window.calculateWithDeductions = calculateWithDeductions;
    window.toggleDeductions = toggleDeductions;
}
