export interface CodeTemplate {
    name: string;
    description: string;
    html: string;
    css: string;
    js: string;
}

export const codeTemplates: CodeTemplate[] = [
    {
        name: "Blank Canvas",
        description: "Start from scratch",
        html: "",
        css: "",
        js: ""
    },
    {
        name: "Basic HTML5",
        description: "HTML5 boilerplate",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Start building something amazing...</p>
</body>
</html>`,
        css: `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}`,
        js: `console.log('Welcome to 2050 IDE!');`
    },
    {
        name: "Flexbox Layout",
        description: "Responsive flexbox grid",
        html: `<div class="container">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
    <div class="card">Card 4</div>
</div>`,
        css: `.container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    background: #f0f0f0;
}

.card {
    flex: 1 1 200px;
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.card:hover {
    transform: translateY(-5px);
}`,
        js: `document.querySelectorAll('.card').forEach((card, index) => {
    card.addEventListener('click', () => {
        console.log(\`Clicked card \${index + 1}\`);
    });
});`
    },
    {
        name: "Interactive Counter",
        description: "Simple counter app",
        html: `<div class="counter-app">
    <h1>Counter App</h1>
    <div class="counter-display">0</div>
    <div class="button-group">
        <button id="decrease">-</button>
        <button id="reset">Reset</button>
        <button id="increase">+</button>
    </div>
</div>`,
        css: `.counter-app {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Arial', sans-serif;
}

h1 {
    color: white;
    margin-bottom: 2rem;
}

.counter-display {
    font-size: 5rem;
    font-weight: bold;
    color: #FFD300;
    margin-bottom: 2rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.button-group {
    display: flex;
    gap: 1rem;
}

button {
    padding: 1rem 2rem;
    font-size: 1.5rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    background: white;
    color: #667eea;
}

button:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

button:active {
    transform: scale(0.95);
}`,
        js: `let count = 0;
const display = document.querySelector('.counter-display');
const decreaseBtn = document.getElementById('decrease');
const resetBtn = document.getElementById('reset');
const increaseBtn = document.getElementById('increase');

function updateDisplay() {
    display.textContent = count;
    display.style.color = count > 0 ? '#4ade80' : count < 0 ? '#f87171' : '#FFD300';
}

decreaseBtn.addEventListener('click', () => {
    count--;
    updateDisplay();
});

resetBtn.addEventListener('click', () => {
    count = 0;
    updateDisplay();
});

increaseBtn.addEventListener('click', () => {
    count++;
    updateDisplay();
});`
    },
    {
        name: "Animated Card",
        description: "Card with hover effects",
        html: `<div class="card">
    <div class="card-header">
        <h2>Amazing Card</h2>
    </div>
    <div class="card-body">
        <p>Hover over me to see the magic! ✨</p>
    </div>
    <div class="card-footer">
        <button>Learn More</button>
    </div>
</div>`,
        css: `body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #0f172a;
    font-family: 'Arial', sans-serif;
}

.card {
    width: 300px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 30px 80px rgba(102, 126, 234, 0.4);
}

.card-header {
    padding: 2rem;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
}

.card-header h2 {
    margin: 0;
    color: white;
    font-size: 1.5rem;
}

.card-body {
    padding: 2rem;
    color: white;
}

.card-footer {
    padding: 1.5rem 2rem;
    background: rgba(0,0,0,0.2);
}

button {
    width: 100%;
    padding: 0.75rem;
    background: white;
    color: #667eea;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

button:hover {
    background: #FFD300;
    color: #0f172a;
    transform: scale(1.05);
}`,
        js: `const card = document.querySelector('.card');
const button = document.querySelector('button');

button.addEventListener('click', () => {
    alert('Button clicked! 🎉');
});

card.addEventListener('mouseenter', () => {
    console.log('Card hovered!');
});`
    }
];
