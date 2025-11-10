// Income Calculation
const calculateBtn = document.getElementById('calculateBtn');
const incomeResult = document.getElementById('incomeResult');

const cropData = {
    rice: { avgYield: 2.5, avgPrice: 25000, avgCost: 15000 },
    wheat: { avgYield: 2.8, avgPrice: 22000, avgCost: 12000 },
    corn: { avgYield: 3.2, avgPrice: 20000, avgCost: 13000 },
    cotton: { avgYield: 1.8, avgPrice: 50000, avgCost: 25000 },
    sugarcane: { avgYield: 60, avgPrice: 2500, avgCost: 30000 },
    soybean: { avgYield: 2.0, avgPrice: 35000, avgCost: 14000 }
};

// Auto-fill suggestions
document.getElementById('incomeCrop').addEventListener('change', (e) => {
    const crop = e.target.value;
    const data = cropData[crop];
    
    if (data) {
        document.getElementById('expectedYield').value = data.avgYield;
        document.getElementById('marketPrice').value = data.avgPrice;
        document.getElementById('productionCost').value = data.avgCost;
    }
});

calculateBtn.addEventListener('click', () => {
    const area = parseFloat(document.getElementById('incomeArea').value);
    const yieldPerAcre = parseFloat(document.getElementById('expectedYield').value);
    const pricePerTon = parseFloat(document.getElementById('marketPrice').value);
    const costPerAcre = parseFloat(document.getElementById('productionCost').value);
    
    if (!area || !yieldPerAcre || !pricePerTon || !costPerAcre) {
        alert('Please fill all fields');
        return;
    }
    
    const totalYield = area * yieldPerAcre;
    const totalRevenue = totalYield * pricePerTon;
    const totalCost = area * costPerAcre;
    const netProfit = totalRevenue - totalCost;
    
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
    document.getElementById('totalCost').textContent = `₹${totalCost.toLocaleString()}`;
    document.getElementById('netProfit').textContent = `₹${netProfit.toLocaleString()}`;
    
    incomeResult.classList.remove('hidden');
    
    // Create chart
    const canvas = document.getElementById('incomeChart');
    const ctx = canvas.getContext('2d');
    
    if (window.incomeChart) {
        window.incomeChart.destroy();
    }
    
    window.incomeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Revenue', 'Costs', 'Net Profit'],
            datasets: [{
                data: [totalRevenue, totalCost, netProfit > 0 ? netProfit : 0],
                backgroundColor: [
                    'rgba(74, 222, 128, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(96, 165, 250, 0.8)'
                ],
                borderColor: '#1a332b',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { 
                        color: '#ffffff',
                        font: { size: 14 }
                    }
                }
            }
        }
    });
});
