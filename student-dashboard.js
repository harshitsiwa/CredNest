// Student Dashboard Calculations & Interactivity
document.addEventListener('DOMContentLoaded', () => {
    const amountSlider = document.getElementById('amountSlider');
    const tenureSlider = document.getElementById('tenureSlider');
    
    const amountVal = document.getElementById('amountVal');
    const tenureVal = document.getElementById('tenureVal');
    
    const monthlyEmi = document.getElementById('monthlyEmi');
    const totalInterest = document.getElementById('totalInterest');
    const totalPayable = document.getElementById('totalPayable');
    
    const annualInterestRate = 8.5; // Fixed Interest rate

    function formatRupees(amount) {
        return '₹' + Math.round(amount).toLocaleString('en-IN');
    }

    function calculateEMI() {
        const principal = parseFloat(amountSlider.value);
        const tenureYears = parseInt(tenureSlider.value);
        
        // Update Labels
        amountVal.textContent = formatRupees(principal);
        tenureVal.textContent = `${tenureYears} Year${tenureYears > 1 ? 's' : ''}`;
        
        // Formula variables
        const monthlyRate = annualInterestRate / 12 / 100;
        const numberOfPayments = tenureYears * 12;
        
        // EMI Calculation
        let emi = 0;
        if (monthlyRate === 0) {
            emi = principal / numberOfPayments;
        } else {
            emi = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        }
        
        const repayable = emi * numberOfPayments;
        const interest = repayable - principal;
        
        // Display Output
        monthlyEmi.textContent = formatRupees(emi);
        totalInterest.textContent = formatRupees(interest);
        totalPayable.textContent = formatRupees(repayable);
    }

    if (amountSlider && tenureSlider) {
        amountSlider.addEventListener('input', calculateEMI);
        tenureSlider.addEventListener('input', calculateEMI);
        calculateEMI(); // Initial calculation
    }

    // Scrollable audit log simulators
    const logConsole = document.querySelector('.scrollbar-thin');
    if (logConsole) {
        const simLogs = [
            'Running advanced device-fingerprinting checks...',
            'Comparing geolocation telemetry. Latency is within acceptable limits.',
            'Hashing documents. Integrity signature matches blockchain hashes.',
            'Analyzing applicant debt-to-income limits. Status: APPROVED.',
            'Risk scoring completed. Fraud Probability Score stabilized at 8.0%.',
            'Ready to disburse upon final approval signatures.'
        ];
        
        let index = 0;
        const interval = setInterval(() => {
            if (index >= simLogs.length) {
                clearInterval(interval);
                return;
            }
            
            const p = document.createElement('p');
            p.className = 'text-gray-400 font-light';
            
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            p.innerHTML = `<span class="text-indigo-400">[${time}]</span> ${simLogs[index]}`;
            logConsole.appendChild(p);
            
            // Scroll to bottom
            logConsole.scrollTop = logConsole.scrollHeight;
            index++;
        }, 6000);
    }
});
