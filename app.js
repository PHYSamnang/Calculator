document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    let currentInput = '';
    let previousInput = '';
    let operation = null;

    document.querySelector('.buttons').addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;

        const value = e.target.dataset.value;
        
        if (value === 'clear') {
            currentInput = '';
            previousInput = '';
            operation = null;
            display.value = '';
            return;
        }

        if ('0123456789.'.includes(value)) {
            if (value === '.' && currentInput.includes('.')) return;
            currentInput += value;
            display.value = currentInput;
            return;
        }

        if ('+-*/'.includes(value)) {
            if (currentInput === '') return;
            if (previousInput !== '') {
                calculate();
            }
            operation = value;
            previousInput = currentInput;
            currentInput = '';
            return;
        }

        if (value === '=') {
            if (currentInput === '' || previousInput === '') return;
            calculate();
            operation = null;
            previousInput = '';
        }
    });

    function calculate() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

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

        currentInput = result.toString();
        display.value = currentInput;
    }
});