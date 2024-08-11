let list = [];
let isRadians = true; // Default mode is Radians
let chartInstance = null; // To store the current chart instance

function clearDisplay() {
    document.getElementById('display').value = '';
}

function appendNumber(number) {
    let display = document.getElementById('display');
    display.value += number;
}

function appendOperator(operator) {
    let display = document.getElementById('display');
    if (operator === 'sqrt') {
        display.value += '√(';
    } else if (operator === 'pi') {
        display.value += Math.PI;
    } else if (operator === 'e') {
        display.value += Math.E;
    } else {
        display.value += operator;
    }
}

function calculate() {
    let display = document.getElementById('display');
    let expression = display.value;

    try {
        // Handling square root
        expression = expression.replace(/√\(/g, 'Math.sqrt(');

        // Handling trigonometric and logarithmic functions
        expression = expression.replace(/sin\(/g, isRadians ? 'Math.sin(' : '(Math.sin(toRadians(');
        expression = expression.replace(/cos\(/g, isRadians ? 'Math.cos(' : '(Math.cos(toRadians(');
        expression = expression.replace(/tan\(/g, isRadians ? 'Math.tan(' : '(Math.tan(toRadians(');
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/exp\(/g, 'Math.exp(');

        let result = eval(expression);

        list.push(result);
        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
}

function toRadians(value) {
    return value * (Math.PI / 180);
}

function toDegrees(value) {
    return value * (180 / Math.PI);
}

function toggleRadDeg() {
    let button = document.querySelector("button[onclick='toggleRadDeg()']");
    isRadians = !isRadians;
    button.textContent = isRadians ? 'Rad' : 'Deg';
}

function clearMemory() {
    list = [];
    alert('Calculator memory cleared.');
}

function displayList() {
    alert(`Current List: ${list.join(', ')}`);
}

function sumList() {
    let sum = list.reduce((acc, curr) => acc + curr, 0);
    alert(`Sum of list values: ${sum}`);
}

function exit() {
    alert('Exiting calculator...');
    clearDisplay();
    clearMemory();
}

function plotGraph() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    const func = document.getElementById('function-input').value;
    const xValues = [];
    const yValues = [];

    for (let x = -10; x <= 10; x += 0.01) {  // Smaller increment for smoother graph
        xValues.push(x);
        let y;
        try {
            y = eval(func.replace(/x/g, x));
            yValues.push(y);
        } catch (error) {
            yValues.push(null);
        }
    }

    if (chartInstance) {
        chartInstance.destroy();  // Destroy the previous chart instance
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: `y = ${func}`,
                data: yValues,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}
