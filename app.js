document.addEventListener("DOMContentLoaded", () => {
  // Splash Screen Logic
  const splash = document.getElementById('splash-screen');
  
  if (!localStorage.getItem('hasSeenSplash')) {
    splash.classList.remove('hidden');
    setTimeout(() => {
      splash.classList.add('hidden');
      localStorage.setItem('hasSeenSplash', 'true');
    }, 1500); // 1.5 seconds
  }

  // Calculator State Machine
  const display = document.getElementById('display');
  const historyDisplay = document.getElementById('history');
  let currentInput = '0';
  let previousInput = '';
  let operation = undefined;

  const updateDisplay = () => {
    display.innerText = currentInput;
    if (operation != null) {
      historyDisplay.innerText = `${previousInput} ${operation}`;
    } else {
      historyDisplay.innerText = '';
    }
  };

  const appendNumber = (number) => {
    if (number === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' && number !== '.') {
      currentInput = number;
    } else {
      currentInput += number;
    }
  };

  const chooseOperation = (op) => {
    if (currentInput === '') return;
    if (previousInput !== '') {
      compute();
    }
    operation = op;
    previousInput = currentInput;
    currentInput = '';
  };

  const compute = () => {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;
    
    // Quick switch for basic math
    switch (operation) {
      case '+': computation = prev + current; break;
      case '−': computation = prev - current; break; // Note: using the minus symbol from HTML
      case '×': computation = prev * current; break;
      case '÷': computation = prev / current; break;
      default: return;
    }
    currentInput = computation.toString();
    operation = undefined;
    previousInput = '';
  };

  const handleScientific = (action) => {
    const current = parseFloat(currentInput);
    if (isNaN(current)) return;

    switch (action) {
      case 'sin': currentInput = Math.sin(current * Math.PI / 180).toFixed(6).replace(/\.?0+$/, ''); break; // Assuming Degrees
      case 'cos': currentInput = Math.cos(current * Math.PI / 180).toFixed(6).replace(/\.?0+$/, ''); break;
      case 'tan': currentInput = Math.tan(current * Math.PI / 180).toFixed(6).replace(/\.?0+$/, ''); break;
      case 'pow': currentInput = Math.pow(current, 2).toString(); break;
    }
    updateDisplay();
  };

  // Event Delegation for Keypad
  document.querySelector('.keypad').addEventListener('click', (e) => {
    if (!e.target.matches('button')) return;
    
    const btn = e.target;
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (value !== undefined) {
      appendNumber(value);
      updateDisplay();
      return;
    }

    if (action === 'clear') {
      currentInput = '0';
      previousInput = '';
      operation = undefined;
      updateDisplay();
    } else if (action === 'delete') {
      currentInput = currentInput.toString().slice(0, -1) || '0';
      updateDisplay();
    } else if (action === 'calculate') {
      compute();
      updateDisplay();
    } else if (['sin', 'cos', 'tan', 'pow'].includes(action)) {
      handleScientific(action);
    } else {
      // Map button actions to math symbols
      const opMap = { 'add': '+', 'subtract': '−', 'multiply': '×', 'divide': '÷' };
      chooseOperation(opMap[action]);
      updateDisplay();
    }
  });
});
