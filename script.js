
  
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tableBody');
    const loadingText = document.getElementById('loading');
    const stockTable = document.getElementById('stockTable');
    const formulaSelect = document.getElementById('formulaSelect');
    const execDate = document.getElementById('execDate');
    
    let allStocks = [];
    let filteredStocks = [];

    let request = {
        "index": [
          "NIFTY 500",
          "NIFTY MIDSMALLCAP 400",
          "NIFTY MICROCAP 250"
        ],
        "series": [
          "EQ",
          "BE"
        ],
        "sector": [
          0,
          "Construction",
          "Media Entertainment & Publication",
          "Financial Services",
          "Capital Goods",
          "Healthcare",
          "Construction Materials",
          "Consumer Durables",
          "Consumer Services",
          "Metals & Mining",
          "Telecommunication",
          "Forest Materials",
          "Chemicals",
          "Services",
          "Automobile and Auto Components",
          "Fast Moving Consumer Goods",
          "Power",
          "Oil Gas & Consumable Fuels",
          "Textiles",
          "Diversified",
          "Realty",
          "Utilities",
          "Information Technology",
          "Electrical Equipment",
          "Food Products"
        ],
        "stockMin": 5,
        "stockMax": 1500,
        "date":'',
        "strategyValue": "6 Month ROC "
      }
    
      
      function getLastWorkingDate() {
        const today = new Date();
        let lastWorkingDay = new Date(today);
          lastWorkingDay.setDate(lastWorkingDay.getDate()-1);
      
        // Check if today is a weekend (Saturday or Sunday)
        const dayOfWeek = lastWorkingDay.getDay();
      
        // If it's Sunday (0) or Saturday (6), adjust the date to Friday
        if (dayOfWeek === 0) {
          // If today is Sunday, go back 2 days to Friday
          lastWorkingDay.setDate(lastWorkingDay.getDate() - 2);
        } else if (dayOfWeek === 6) {
          // If today is Saturday, go back 1 day to Friday
          lastWorkingDay.setDate(lastWorkingDay.getDate() - 1);
        }
      
        return lastWorkingDay;
      }
    

    // Predefined formulas
    const preDefinedForms = [{
        label: '6 mnth roc (default)',
        value: '6 Month ROC'
    }, {
        label: '6 mnth roc and 3 month std',
        value: '6 Month ROC / 3 Month STD'
    }, {
        label: 'author spl',
        value: '(0.75 * 3 Month ROC + 0.25 * 6 Month ROC) / 3 Month STD'
    }, {
        label: '3 mnth roc ',
        value: '3 Month ROC'
    }, {
        label: 'custom',
        value: '(0.25 * 9 Month ROC + 0.25 * 6 Month ROC + 0.5 * 3 Month ROC)'
    }, {
        label: 'custom with std',
        value: '(0.25 * 9 Month ROC + 0.25 * 6 Month ROC + 0.5 * 3 Month ROC) / 3 Month STD'
    }];

    // Function to populate the formula dropdown
    function populateFormulaDropdown() {
        preDefinedForms.forEach(form => {
            const option = document.createElement('option');
            option.value = form.value;
            option.textContent = form.label;
            formulaSelect.appendChild(option);
        });
    }
    

    function fetchData(formula) {
    request.date = getLastWorkingDate().toISOString();
    
    execDate.innerText = getLastWorkingDate().toLocaleDateString()
    request.strategyValue = formula;
        loadingText.style.display = 'block';
        stockTable.style.display = 'none';

    
        fetch('https://green-sigma-node-backend-lz42rlmeha-uc.a.run.app/api/sigmaScannerTrial',{
            method:'POST',
            body:JSON.stringify(request),
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmYwZWI0NDBjOTQ0MTI3MjFkOWU2NGQiLCJpYXQiOjE3MjcwOTc5NTAsImV4cCI6MTcyNzI3MDc1MH0.JpxGs-6OkCy-i96klu_LvtvnCtZ4T15A-QSgebGiPAA'
            }
        })  // Replace with your API URL
            .then(response => response.json())
            .then(data => {
                allStocks = data.data;
                filteredStocks = allStocks.slice(0, 50);
                displayTable(filteredStocks);
                loadingText.style.display = 'none';
                stockTable.style.display = 'table';
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                loadingText.textContent = 'Failed to load data';
            });
    }

    function displayTable(stocks) {
        tableBody.innerHTML = '';

        stocks.forEach((stock,index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${index+1}</td>
                <td>${stock.symbol}</td>
                <td>${stock.sector}</td>
                <td>₹${stock.stock_price}</td>
                <td>${stock.score}</td>
            `;
            tableBody.appendChild(row);
        });
    }

        formulaSelect.addEventListener('change', (event) => {
            const selectedFormula = event.target.value;
            fetchData(selectedFormula);
        });
    
        // Initial setup
        populateFormulaDropdown();
        fetchData(preDefinedForms[0].value);
});


