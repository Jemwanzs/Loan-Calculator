// Function to calculate mortgage details
function calculateLoan() {
    // Clear previous results
    clearResults();

    // Hide amortization table if it's open
    hideAmortizationTable();

    // Get input values
    const borrowedAmount = getInputIntValue('borrowedAmount');
    const loanTerm = getInputIntValue('loanTerm');
    const interestRate = getInputFloatValue('interestRate');

    // ***Validate inputs
    if (isNaN(borrowedAmount) || isNaN(loanTerm) || isNaN(interestRate)) {
        alert('Please enter valid numeric inputs.');
        return;
    }

    // Validate percentages
    if (interestRate > 100) {
        alert("Interest Rate should not exceed 100%");
        return;
    }

    // Convert percentages to decimal
    const numberOfMonths = loanTerm;
    const interestRateDecimal = interestRate / 100;

    // Calculate loan details
    const monthlyInterestRate = interestRateDecimal / 12;
    const monthlyPayment = calculateMonthlyPayment(borrowedAmount, monthlyInterestRate, numberOfMonths);
    const totalPayment = monthlyPayment * numberOfMonths;
    const interestAmount = totalPayment - borrowedAmount;

    // Display results
    displayResults({
        borrowedAmt: borrowedAmount,
        loanPeriod: loanTerm,
        AnnualinterestRate: interestRate,
        monthlyPayment: monthlyPayment,
        totalPayment: totalPayment,
        interestAmount: interestAmount
    });

    // Show results and scroll to them
    const resultsElement = document.getElementById('results');
    resultsElement.style.display = 'block';
    resultsElement.scrollIntoView({ behavior: 'smooth' });
}

// Function to calculate monthly LOAN payment
function calculateMonthlyPayment(borrowedAmount, monthlyInterestRate, numberOfMonths) {
    return (borrowedAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths));
}
// Function to generate amortization table
function generateAmortizationTable() {
    // Ensure loan calculation is done before generating loan schedule
    const monthlyPaymentText = document.getElementById('monthlyPayment').textContent.trim();
    if (monthlyPaymentText === 'NaN') {
        alert('Please calculate the loan first.');
        return;
    }

    // Get input values
    const borrowedAmount = getInputFloatValue('borrowedAmount');
    const loanTerm = getInputIntValue('loanTerm');
    const interestRate = getInputFloatValue('interestRate');

    // Convert percentages to decimal
    const numberOfMonths = loanTerm;
    const interestRateDecimal = interestRate / 100;

    // Calculate loan details
    const monthlyInterestRate = interestRateDecimal / 12;
    const monthlyPayment = calculateMonthlyPayment(borrowedAmount, monthlyInterestRate, numberOfMonths);

    // Generate and display amortization schedule
    generateAmortizationSchedule(borrowedAmount, monthlyInterestRate, numberOfMonths, monthlyPayment);

    // Show the amortization table and scroll to it
    showAmortizationTable();
}

// Function to generate amortization schedule rows
function generateAmortizationSchedule(borrowedAmount, monthlyInterestRate, numberOfMonths, monthlyPayment) {
    const tableBody = document.querySelector('#amortizationTable tbody');
    tableBody.innerHTML = ''; // Clear existing table rows

    // Add initial row for month zero
    const initialRow = document.createElement('tr');
    initialRow.innerHTML = `
        <td>0</td>
        <td>${formatCurrency('')}</td>
        <td>${formatCurrency('')}</td>
        <td>${formatCurrency('')}</td>
        <td>${formatCurrency(borrowedAmount)}</td>
    `;
    tableBody.appendChild(initialRow);

    let balance = borrowedAmount;
    for (let month = 1; month <= numberOfMonths; month++) {
        const interest = balance * monthlyInterestRate;
        const principal = monthlyPayment - interest;
        balance -= principal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month}</td>
            <td>${formatCurrency(monthlyPayment)}</td>
            <td>${formatCurrency(interest)}</td>
            <td>${formatCurrency(principal)}</td>
            <td>${formatCurrency(balance)}</td>
        `;
        tableBody.appendChild(row);
    }
}

// Helper function to clear previous results
function clearResults() {
    const resultFields = ['borrowedAmt', 'loanPeriod', 'AnnualinterestRate', 'monthlyPayment', 'totalPayment', 'interestAmount'];
    resultFields.forEach(field => {
        document.getElementById(field).textContent = 'NaN';
    });
}

// Helper function to display results with thousands separators
function displayResults(results) {
    Object.keys(results).forEach(key => {
        const value = results[key];
        document.getElementById(key).textContent = formatCurrency(value);
    });
}

// Helper function to get float value from input
function getInputFloatValue(id) {
    return parseFloat(document.getElementById(id).value.replace(/,/g, ''));
}

// Helper function to get integer value from input
function getInputIntValue(id) {
    return parseInt(document.getElementById(id).value.replace(/,/g, ''));
}

// Helper function to format currency with thousands separator
function formatCurrency(amount) {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Function to hide the amortization table
function hideAmortizationTable() {
    const amortizationTableElement = document.getElementById('amortizationTable');
    amortizationTableElement.style.display = 'none';
}

// Function to show the amortization table
function showAmortizationTable() {
    const amortizationTableElement = document.getElementById('amortizationTable');
    amortizationTableElement.style.display = 'block';
}

// Apply formatting to input fields
document.addEventListener('DOMContentLoaded', function () {
    formatInputFieldWithCommas(document.getElementById('borrowedAmount'));
    formatInputFieldWithCommas(document.getElementById('loanTerm'));
    formatInputFieldWithCommas(document.getElementById('interestRate'));
});

// Helper function to format input fields with comma separators
function formatInputFieldWithCommas(inputElement) {
    inputElement.addEventListener('input', function () {
        const value = inputElement.value.replace(/,/g, '');
        if (!isNaN(value)) {
            inputElement.value = parseFloat(value).toLocaleString('en-US');
        }
    });
}

// Function to print all elements except the Calculate and Amortization buttons
function printTables() {
    var amortizationTable = document.getElementById('amortizationTable');
    if (!amortizationTable || amortizationTable.style.display === 'none') {
        alert('Please run loan schedule first.');
        return;
    }
    // Print the page
    window.print();
}

// Event listener for the print button
document.getElementById('printButton').addEventListener('click', printTables);