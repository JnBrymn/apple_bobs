document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.getElementById('contact-btn');
    const navLinks = document.querySelectorAll('nav a');

    contactBtn.addEventListener('click', function() {
        alert('Thanks for clicking! You can customize this interaction.');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('GitHub Pages site loaded successfully!');
});

let score = 0;
let upgradeCost = 5;
let cooldownTime = 10000; // 10 seconds
let isUpgraded = false;

const scoreElement = document.getElementById('score');
const clickBtn = document.getElementById('clickBtn');
const upgradeBtn = document.getElementById('upgradeBtn');
const upgradeCostElement = document.getElementById('upgradeCost');
const line = document.getElementById('line');

function updateScore() {
    scoreElement.textContent = score;
    upgradeBtn.disabled = score < upgradeCost;
}

function animateLine() {
    line.style.height = '100%';
    setTimeout(() => {
        line.style.height = '0';
    }, cooldownTime);
}

function handleClick() {
    if (clickBtn.disabled) return;
    
    score++;
    updateScore();
    animateLine();
    
    clickBtn.disabled = true;
    setTimeout(() => {
        clickBtn.disabled = false;
    }, cooldownTime);
}

function handleUpgrade() {
    if (score < upgradeCost) return;
    
    score -= upgradeCost;
    upgradeCost = Math.floor(upgradeCost * 1.5);
    cooldownTime = 5000; // 5 seconds after upgrade
    isUpgraded = true;
    
    updateScore();
    upgradeCostElement.textContent = upgradeCost;
}

clickBtn.addEventListener('click', handleClick);
upgradeBtn.addEventListener('click', handleUpgrade);

// Initialize
updateScore();