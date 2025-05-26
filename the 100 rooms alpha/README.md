let cookies = 0;
let cps = 0;

const buildings = [
    { name: "Cursor", baseCost: 15, baseCps: 0.1, owned: 0 },
    { name: "Grandma", baseCost: 100, baseCps: 1, owned: 0 },
    { name: "Farm", baseCost: 1100, baseCps: 8, owned: 0 },
    { name: "Mine", baseCost: 12000, baseCps: 47, owned: 0 },
    { name: "Factory", baseCost: 130000, baseCps: 260, owned: 0 },
    { name: "Bank", baseCost: 1400000, baseCps: 1400, owned: 0 },
    { name: "Temple", baseCost: 15000000, baseCps: 7000, owned: 0 },
    { name: "Wizard Tower", baseCost: 160000000, baseCps: 35000, owned: 0 },
    { name: "Shipment", baseCost: 1700000000, baseCps: 175000, owned: 0 },
    { name: "Alchemy Lab", baseCost: 18000000000, baseCps: 875000, owned: 0 },
    { name: "Portal", baseCost: 190000000000, baseCps: 4375000, owned: 0 },
    { name: "Time Machine", baseCost: 2000000000000, baseCps: 21875000, owned: 0 },
    { name: "Antimatter Condenser", baseCost: 21000000000000, baseCps: 109375000, owned: 0 },
    { name: "Prism", baseCost: 220000000000000, baseCps: 546875000, owned: 0 }
    { name: "Chromosphere", baseCost: 2300000000000000, baseCps: 2734375000, owned: 0 },
    { name: "Galactic Federation", baseCost: 24000000000000000, baseCps: 13671875000, owned: 0 },
    { name: "Antimatter Cell", baseCost: 250000000000000000, baseCps: 68359375000, owned: 0 },
    { name: "Black Hole", baseCost: 2600000000000000000, baseCps: 341796875000, owned: 0 },
    { name: "Whirlpool", baseCost: 27000000000000000000, baseCps: 1708984375000, owned: 0 },
    { name: "Black Hole", baseCost: 280000000000000000000, baseCps: 8544921875000, owned: 0 },
    { name: "Whirlpool", baseCost: 2900000000000000000000, baseCps: 42724609375000, owned: 0 },
];

const cookieCount = document.getElementById('cookie-count');
const cpsDisplay = document.getElementById('cps');
const cookieButton = document.getElementById('cookie-button');
const buildingContainer = document.getElementById('building-container');

function updateCookieCount() {
    cookieCount.textContent = `Cookies: ${Math.floor(cookies)}`;
}

function updateCps() {
    cps = buildings.reduce((sum, building) => sum + building.baseCps * building.owned, 0);
    cpsDisplay.textContent = `Per second: ${cps.toFixed(1)}`;
}

function createBuildingButtons() {
    buildings.forEach((building, index) => {
        const buildingElement = document.createElement('div');
        buildingElement.className = 'building';
        buildingElement.innerHTML = `
            <span>${building.name}: <span id="${building.name}-owned">0</span></span>
            <button id="buy-${building.name}">Buy (${building.baseCost} cookies)</button>
        `;
        buildingContainer.appendChild(buildingElement);

        document.getElementById(`buy-${building.name}`).addEventListener('click', () => buyBuilding(index));
    });
}

function buyBuilding(index) {
    const building = buildings[index];
    const cost = Math.floor(building.baseCost * Math.pow(1.15, building.owned));