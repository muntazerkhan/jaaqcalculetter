const API_KEY = 'goldapi-k7qasm72w0rwu-io';

async function getExchangeRate() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        return data.rates.INR;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return 83; // फॉलबैक रेट (अगर API काम न करे)
    }
}

async function getMetalRates() {
    try {
        // एक्सचेंज रेट प्राप्त करें
        const usdToInr = await getExchangeRate();
        console.log('USD to INR rate:', usdToInr);

        // सोने का रेट प्राप्त करें
        const goldResponse = await fetch('https://www.goldapi.io/api/XAU/USD', {
            headers: {
                'x-access-token': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        const goldData = await goldResponse.json();
        console.log('Gold data from API:', goldData);
        
        // चांदी का रेट प्राप्त करें
        const silverResponse = await fetch('https://www.goldapi.io/api/XAG/USD', {
            headers: {
                'x-access-token': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        const silverData = await silverResponse.json();
        console.log('Silver data from API:', silverData);

        const goldRate = goldData.price_gram_24k * usdToInr;
        const silverRate = silverData.price_gram_24k * usdToInr;

        console.log('Final rates in INR:', {
            goldRate: goldRate,
            silverRate: silverRate
        });

        return {
            goldRate: goldRate,
            silverRate: silverRate,
            usdToInr: usdToInr
        };
    } catch (error) {
        console.error('Error fetching rates:', error);
        alert('मेटल रेट प्राप्त करने में त्रुटि। कृपया बाद में पुनः प्रयास करें।');
        return null;
    }
}

async function calculateZakat() {
    // लोडिंग शुरू करें
    const button = document.getElementById('calculateBtn');
    button.classList.add('loading');
    
    try {
        // इनपुट वैल्यू प्राप्त करें
        const cashAmount = parseFloat(document.getElementById('cashAmount').value) || 0;
        const goldGrams = parseFloat(document.getElementById('goldGrams').value) || 0;
        const silverGrams = parseFloat(document.getElementById('silverGrams').value) || 0;

        // वर्तमान मेटल रेट प्राप्त करें
        const rates = await getMetalRates();
        if (!rates) {
            button.classList.remove('loading');
            return;
        }

        // मूल्यों की गणना रुपये में करें
        const goldAmount = goldGrams * rates.goldRate;
        const silverAmount = silverGrams * rates.silverRate;

        // ज़कात की गणना (2.5% प्रत्येक राशि का)
        const cashZakat = cashAmount * 0.025;
        const goldZakat = goldAmount * 0.025;
        const silverZakat = silverAmount * 0.025;
        const totalZakat = cashZakat + goldZakat + silverZakat;

        // परिणाम प्रदर्शित करें
        document.getElementById('cashZakat').textContent = cashZakat.toFixed(2);
        document.getElementById('goldZakat').textContent = goldZakat.toFixed(2);
        document.getElementById('silverZakat').textContent = silverZakat.toFixed(2);
        document.getElementById('totalZakat').textContent = totalZakat.toFixed(2);

        // वर्तमान रेट प्रदर्शित करें
        document.getElementById('goldRate').textContent = rates.goldRate.toFixed(2);
        document.getElementById('silverRate').textContent = rates.silverRate.toFixed(2);
    } catch (error) {
        console.error('Error in calculation:', error);
        alert('कैलकुलेशन में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
        // लोडिंग समाप्त करें
        button.classList.remove('loading');
    }
} 