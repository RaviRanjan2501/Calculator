class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.isComputationDone = false;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.isComputationDone = false;
        this.updateDisplay();
    }

    delete() {
        if (!isFinite(this.currentOperand)) {
            this.clear();
            return;
        }
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.isComputationDone) {
            this.currentOperand = number.toString();
            this.isComputationDone = false;
        } else {
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number.toString();
            } else {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return;

        if (this.previousOperand !== '' && this.currentOperand !== '0') {
            this.compute();
            this.updateDisplay(); // Show intermediate result
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    compute() {
        if (this.operation == null) {
            this.currentOperand = '0';
            this.isComputationDone = false;
            return;
        }
        let computation;
        const prev = parseFloat(this.previousOperand.toString().replace(/[()]/g, ''));
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        computation = parseFloat(computation.toFixed(5));
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.isComputationDone = true;
    }

    updateDisplay() {
        let currentOperand = this.currentOperand;
        if (currentOperand.toString().includes('e')) {
            currentOperand = Number(currentOperand).toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 5 });
        }
        this.currentOperandTextElement.innerText = currentOperand;
        if (currentOperand.toString().length > 9) {
            this.currentOperandTextElement.classList.add('small-font');
        } else {
            this.currentOperandTextElement.classList.remove('small-font');
        }
        if (this.operation != null) {
            let prev = this.previousOperand;
            if (prev < 0) {
                prev = `(${prev})`;
            }
            this.previousOperandTextElement.innerText = 
                `${prev} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

    // Add data attributes to html buttons before selecting them
    const _buttons = document.querySelectorAll('.buttons button');
    _buttons.forEach(button => {
        const text = button.innerText;
        if (text === 'AC') {
            button.setAttribute('data-all-clear', '');
        } else if (text === 'DEL') {
            button.setAttribute('data-delete', '');
        } else if (text === '=') {
            button.setAttribute('data-equals', '');
        } else if (['÷', '*', '+', '-'].includes(text)) {
            button.setAttribute('data-operation', '');
        }
    });

    const numberButtons = document.querySelectorAll('.buttons button:not(.span-two):not([data-operation])');
    const operationButtons = document.querySelectorAll('.buttons button[data-operation]');
    const equalsButton = document.querySelector('.buttons .span-two[data-equals]');
    const deleteButton = document.querySelector('.buttons button[data-delete]');
    const allClearButton = document.querySelector('.buttons .span-two[data-all-clear]');
    const previousOperandTextElement = document.querySelector('.previous-operand');
    const currentOperandTextElement = document.querySelector('.current-operand');

    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.innerText);
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.innerText);
        });
    });

    if (equalsButton) {
        equalsButton.addEventListener('click', () => {
            calculator.compute();
            calculator.updateDisplay();
        });
    }

    if (allClearButton) {
        allClearButton.addEventListener('click', () => {
            calculator.clear();
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            calculator.delete();
        });
    }
