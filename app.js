document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const previousOperation = document.querySelector('.previous-operation');
    const historyPanel = document.querySelector('.history-panel');
    const historyToggle = document.querySelector('.history-toggle');
    const themeToggle = document.querySelector('.theme-toggle');
    const historyList = document.querySelector('.history-list');
    const clearHistoryBtn = document.querySelector('.clear-history');
    
    let currentInput = '';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;
    
    // Theme handling
    themeToggle.addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        themeToggle.innerHTML = document.body.dataset.theme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('calculatorTheme', document.body.dataset.theme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
        themeToggle.innerHTML = savedTheme === 'dark' ? 
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // History panel toggle
    historyToggle.addEventListener('click', () => {
        historyPanel.classList.toggle('active');
        updateHistoryDisplay();
    });

    function updateHistoryDisplay() {
        const history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div>${item.operation}</div>
                <small>${new Date(item.timestamp).toLocaleString()}</small>
            </div>
        `).join('');
    }

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.setItem('calculatorHistory', '[]');
        updateHistoryDisplay();
    });

    document.querySelector('.buttons').addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;

        const value = e.target.dataset.value;
        
        if (value === 'clear') {
            currentInput = '';
            previousInput = '';
            operation = null;
            display.value = '0';
            previousOperation.textContent = '';
            return;
        }

        if (value === 'backspace') {
            currentInput = currentInput.slice(0, -1);
            display.value = currentInput || '0';
            return;
        }

        if (value === '±') {
            currentInput = (parseFloat(currentInput || '0') * -1).toString();
            display.value = currentInput;
            return;
        }

        if (value === '%') {
            currentInput = (parseFloat(currentInput || '0') / 100).toString();
            display.value = currentInput;
            return;
        }

        if ('0123456789.'.includes(value)) {
            if (shouldResetDisplay) {
                currentInput = '';
                shouldResetDisplay = false;
            }
            if (value === '.' && currentInput.includes('.')) return;
            currentInput += value;
            display.value = currentInput;
            return;
        }

        if ('+-*/'.includes(value)) {
            if (currentInput === '' && previousInput === '') return;
            
            if (currentInput === '') {
                operation = value;
                previousOperation.textContent = `${previousInput} ${value}`;
                return;
            }

            if (previousInput !== '') {
                calculate();
            }
            operation = value;
            previousInput = currentInput;
            previousOperation.textContent = `${previousInput} ${value}`;
            shouldResetDisplay = true;
            return;
        }

        if (value === '=') {
            if (currentInput === '' || previousInput === '') return;
            calculate();
            previousOperation.textContent = '';
            operation = null;
            previousInput = '';
            shouldResetDisplay = true;
        }
    });

    function calculate() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        const operation_text = `${prev} ${operation} ${current}`;

        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            default:
                return;
        }

        // Save to history
        const history = JSON.parse(localStorage.getItem('calculatorHistory') || '[]');
        history.unshift({
            timestamp: new Date().toISOString(),
            operation: `${operation_text} = ${result}`
        });
        if (history.length > 50) history.pop();
        localStorage.setItem('calculatorHistory', JSON.stringify(history));

        currentInput = result.toString();
        display.value = currentInput;
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if ('0123456789.'.includes(key)) {
            document.querySelector(`button[data-value="${key}"]`)?.click();
        }
        if ('+-*/'.includes(key)) {
            document.querySelector(`button[data-value="${key}"]`)?.click();
        }
        if (key === 'Enter') {
            document.querySelector('button[data-value="="]').click();
        }
        if (key === 'Escape') {
            document.querySelector('button[data-value="clear"]').click();
        }
        if (key === 'Backspace') {
            document.querySelector('button[data-value="backspace"]').click();
        }
    });
});