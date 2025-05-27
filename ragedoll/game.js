// Matter.js module aliases
const { Engine, Render, World, Bodies, Body, Composite, Constraint, Mouse, MouseConstraint, Events } = Matter;

// Cookie functions
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Create cookie button
const cookieButton = document.createElement('button');
cookieButton.innerHTML = '🍪 Get Cookie';
cookieButton.style.position = 'absolute';
cookieButton.style.top = '10px';
cookieButton.style.right = '10px';
cookieButton.style.padding = '10px 20px';
cookieButton.style.fontSize = '20px';
cookieButton.style.cursor = 'pointer';
cookieButton.style.backgroundColor = '#4CAF50';
cookieButton.style.color = 'white';
cookieButton.style.border = 'none';
cookieButton.style.borderRadius = '5px';
cookieButton.style.zIndex = '1000';

cookieButton.onclick = function() {
    moolah += 50; // Add 50 moolah when cookie button is clicked
    document.getElementById('moolah').textContent = moolah;
    setCookie('moolah', moolah, 365);
    
    // Create a floating text effect
    const floatingText = document.createElement('div');
    floatingText.textContent = '+50 🍪';
    floatingText.style.position = 'absolute';
    floatingText.style.left = (cookieButton.offsetLeft + cookieButton.offsetWidth/2) + 'px';
    floatingText.style.top = (cookieButton.offsetTop - 20) + 'px';
    floatingText.style.color = '#4CAF50';
    floatingText.style.fontSize = '20px';
    floatingText.style.fontWeight = 'bold';
    floatingText.style.transition = 'all 1s ease-out';
    floatingText.style.opacity = '1';
    document.body.appendChild(floatingText);
    
    // Animate the floating text
    setTimeout(() => {
        floatingText.style.transform = 'translateY(-50px)';
        floatingText.style.opacity = '0';
    }, 50);
    
    // Remove the floating text after animation
    setTimeout(() => {
        document.body.removeChild(floatingText);
    }, 1000);
};

document.getElementById('game-container').appendChild(cookieButton);

// Game state
let moolah = parseInt(getCookie('moolah')) || 200; // Load moolah from cookie or use default
let currentWeapon = getCookie('currentWeapon') || null;
const weapons = {
    pistol: { damage: 10, cost: 100, cooldown: 500 },
    shotgun: { damage: 25, cost: 300, cooldown: 1000 },
    rifle: { damage: 40, cost: 500, cooldown: 200 }
};

// Initialize Matter.js
const engine = Engine.create();
const world = engine.world;
const render = Render.create({
    canvas: document.getElementById('gameCanvas'),
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#2a2a2a'
    }
});

// Create welcome message
const welcomeMessage = document.createElement('div');
welcomeMessage.style.position = 'absolute';
welcomeMessage.style.top = '50%';
welcomeMessage.style.left = '50%';
welcomeMessage.style.transform = 'translate(-50%, -50%)';
welcomeMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
welcomeMessage.style.color = 'white';
welcomeMessage.style.padding = '20px';
welcomeMessage.style.borderRadius = '10px';
welcomeMessage.style.textAlign = 'center';
welcomeMessage.style.zIndex = '1000';
welcomeMessage.innerHTML = `
    <h2>Welcome to Ragdoll Battle Arena!</h2>
    <p>You start with 200 moolah!</p>
    <p>1. Buy a pistol from the shop</p>
    <p>2. Click to shoot the ragdoll</p>
    <p>3. Earn moolah by hitting the ragdoll</p>
    <p>4. Buy better weapons with your moolah</p>
    <button onclick="this.parentElement.remove()" style="padding: 10px 20px; margin-top: 10px; cursor: pointer;">Got it!</button>
`;
document.getElementById('game-container').appendChild(welcomeMessage);

// Create ground
const ground = Bodies.rectangle(400, 590, 810, 20, { 
    isStatic: true,
    render: { fillStyle: '#4a4a4a' }
});

// Create ragdoll
function createRagdoll(x, y) {
    const group = Body.nextGroup(true);
    
    const head = Bodies.circle(x, y - 30, 15, {
        collisionFilter: { group: group },
        render: { fillStyle: '#ff0000' }
    });
    
    const torso = Bodies.rectangle(x, y, 20, 40, {
        collisionFilter: { group: group },
        render: { fillStyle: '#ff0000' }
    });
    
    const leftArm = Bodies.rectangle(x - 25, y, 10, 30, {
        collisionFilter: { group: group },
        render: { fillStyle: '#ff0000' }
    });
    
    const rightArm = Bodies.rectangle(x + 25, y, 10, 30, {
        collisionFilter: { group: group },
        render: { fillStyle: '#ff0000' }
    });
    
    const leftLeg = Bodies.rectangle(x - 10, y + 40, 10, 30, {
        collisionFilter: { group: group },
        render: { fillStyle: '#ff0000' }
    });
    
    const rightLeg = Bodies.rectangle(x + 10, y + 40, 10, 30, {
        collisionFilter: { group: group },
        render: { fillStyle: '#ff0000' }
    });

    // Create constraints
    const headTorso = Constraint.create({
        bodyA: head,
        bodyB: torso,
        stiffness: 0.8,
        render: { visible: false }
    });

    const torsoLeftArm = Constraint.create({
        bodyA: torso,
        bodyB: leftArm,
        pointA: { x: -10, y: -20 },
        stiffness: 0.8,
        render: { visible: false }
    });

    const torsoRightArm = Constraint.create({
        bodyA: torso,
        bodyB: rightArm,
        pointA: { x: 10, y: -20 },
        stiffness: 0.8,
        render: { visible: false }
    });

    const torsoLeftLeg = Constraint.create({
        bodyA: torso,
        bodyB: leftLeg,
        pointA: { x: -10, y: 20 },
        stiffness: 0.8,
        render: { visible: false }
    });

    const torsoRightLeg = Constraint.create({
        bodyA: torso,
        bodyB: rightLeg,
        pointA: { x: 10, y: 20 },
        stiffness: 0.8,
        render: { visible: false }
    });

    return {
        parts: [head, torso, leftArm, rightArm, leftLeg, rightLeg],
        constraints: [headTorso, torsoLeftArm, torsoRightArm, torsoLeftLeg, torsoRightLeg]
    };
}

// Add ragdoll to world
const ragdoll = createRagdoll(400, 300);
World.add(world, [...ragdoll.parts, ...ragdoll.constraints, ground]);

// Mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: { visible: false }
    }
});
World.add(world, mouseConstraint);

// Weapon system
let lastShot = 0;

function shoot(e) {
    if (!currentWeapon) return;
    
    const now = Date.now();
    if (now - lastShot < weapons[currentWeapon].cooldown) return;
    
    lastShot = now;
    
    const mousePos = mouse.position;
    const bullet = Bodies.circle(mousePos.x, mousePos.y, 5, {
        velocity: { x: (mousePos.x - 400) * 0.1, y: (mousePos.y - 300) * 0.1 },
        render: { fillStyle: '#ffff00' }
    });
    
    World.add(world, bullet);
    
    // Remove bullet after 2 seconds
    setTimeout(() => {
        World.remove(world, bullet);
    }, 2000);
}

// Collision detection
Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        
        // Check if bullet hit ragdoll
        if (bodyA.render.fillStyle === '#ffff00' || bodyB.render.fillStyle === '#ffff00') {
            const bullet = bodyA.render.fillStyle === '#ffff00' ? bodyA : bodyB;
            const ragdollPart = bodyA.render.fillStyle === '#ffff00' ? bodyB : bodyA;
            
            if (ragdoll.parts.includes(ragdollPart)) {
                // Apply damage
                Body.applyForce(ragdollPart, bullet.position, {
                    x: bullet.velocity.x * 0.1,
                    y: bullet.velocity.y * 0.1
                });
                
                // Add moolah
                moolah += weapons[currentWeapon].damage;
                document.getElementById('moolah').textContent = moolah;
                setCookie('moolah', moolah, 365); // Save moolah for 1 year
                
                // Remove bullet
                World.remove(world, bullet);
            }
        }
    });
});

// Weapon shop
function buyWeapon(weaponType) {
    if (moolah >= weapons[weaponType].cost) {
        moolah -= weapons[weaponType].cost;
        currentWeapon = weaponType;
        document.getElementById('moolah').textContent = moolah;
        setCookie('moolah', moolah, 365); // Save moolah for 1 year
        setCookie('currentWeapon', currentWeapon, 365); // Save current weapon for 1 year
        updateShopButtons();
    }
}

function updateShopButtons() {
    const buttons = document.querySelectorAll('.weapon-btn');
    buttons.forEach(button => {
        const weaponType = button.getAttribute('onclick').match(/'([^']+)'/)[1];
        button.disabled = moolah < weapons[weaponType].cost;
    });
}

// Event listeners
render.canvas.addEventListener('click', shoot);
render.canvas.addEventListener('mousemove', (e) => {
    mouse.position.x = e.offsetX;
    mouse.position.y = e.offsetY;
});

// Start the engine and renderer
Engine.run(engine);
Render.run(render);

// Update shop buttons initially
updateShopButtons(); 