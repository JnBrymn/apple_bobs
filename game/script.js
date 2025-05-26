// Game state
let cookies = 0;
let cookiesPerSecond = 0;

// Upgrade costs and amounts
const upgrades = {
    cursor: { cost: 15, amount: 0, cps: 0.1 },
    grandma: { cost: 100, amount: 0, cps: 1 },
    farm: { cost: 1100, amount: 0, cps: 8 },
    mine: { cost: 12000, amount: 0, cps: 47 },
    factory: { cost: 130000, amount: 0, cps: 260 },
    bank: { cost: 1400000, amount: 0, cps: 1400 },
    temple: { cost: 20000000, amount: 0, cps: 7800 },
    'wizard-tower': { cost: 330000000, amount: 0, cps: 44000 },
    shipment: { cost: 5100000000, amount: 0, cps: 260000 },
    portal: { cost: 77900000000, amount: 0, cps: 1600000 },
    'time-machine': { cost: 10000000000, amount: 0, cps: 10000000 },
    GOD: { cost: 5000000000000, amount: 0, cps: 100000000 }
};

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    const cookie = document.getElementById('cookie');
    
    // Cookie click event with animation
    cookie.addEventListener('click', () => {
        cookies++;
        updateStats();
        
        // Add click animation
        cookie.classList.add('clicked');
        setTimeout(() => {
            cookie.classList.remove('clicked');
        }, 500);
    });

    // Start the game loop
    setInterval(gameLoop, 1000);
});

// Main game loop
function gameLoop() {
    let totalCps = 0;
    for (const [key, upgrade] of Object.entries(upgrades)) {
        totalCps += upgrade.amount * upgrade.cps;
    }
    cookies += totalCps;
    cookiesPerSecond = totalCps;
    updateStats();
}

// Update the display
function updateStats() {
    document.getElementById('cookies').textContent = Math.floor(cookies);
    document.getElementById('cps').textContent = cookiesPerSecond.toFixed(1);

    // Update upgrade buttons
    for (const [key, upgrade] of Object.entries(upgrades)) {
        const button = document.querySelector(`#${key} button`);
        const costElement = document.getElementById(`${key}-cost`);
        const amountElement = document.getElementById(`${key}-amount`);

        costElement.textContent = Math.floor(upgrade.cost);
        amountElement.textContent = upgrade.amount;
        button.disabled = cookies < upgrade.cost;
    }
}

// Buy upgrade function
function buyUpgrade(upgradeType) {
    const upgrade = upgrades[upgradeType];
    if (cookies >= upgrade.cost) {
        cookies -= upgrade.cost;
        upgrade.amount++;
        upgrade.cost = Math.floor(upgrade.cost * 1.15); // Increase cost by 15%
        updateStats();
    }
} 