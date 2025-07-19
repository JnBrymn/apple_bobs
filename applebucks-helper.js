// AppleBucks Helper - For games to easily give AppleBucks to players
// Include this script in your game to give AppleBucks!

// Function to give AppleBucks to the player
function giveAppleBucks(amount = 1) {
    // Check if we're in the Apple Bobs environment
    if (window.parent && window.parent.appleBobs) {
        // We're in an iframe, call parent function
        window.parent.appleBobs.giveAppleBucks(amount);
        return true;
    } else if (window.appleBobs) {
        // We're directly in Apple Bobs
        window.appleBobs.giveAppleBucks(amount);
        return true;
    } else {
        // We're standalone, save for when we return to Apple Bobs
        const currentEarned = localStorage.getItem('appleBobs_earnedInGame') || '0';
        const newEarned = parseInt(currentEarned) + amount;
        localStorage.setItem('appleBobs_earnedInGame', newEarned.toString());
        
        // Show a message to the player
        showAppleBucksMessage(`🎉 You earned ${amount} AppleBuck${amount > 1 ? 's' : ''}!`);
        return true;
    }
}

// Function to return to Apple Bobs with earned AppleBucks
function returnToAppleBobs() {
    const earned = localStorage.getItem('appleBobs_earnedInGame');
    if (earned && parseInt(earned) > 0) {
        // Return to Apple Bobs with earned AppleBucks
        const returnUrl = '../?earnedBucks=' + earned;
        localStorage.removeItem('appleBobs_earnedInGame'); // Clear earned amount
        window.location.href = returnUrl;
    } else {
        // Just return to Apple Bobs
        window.location.href = '../';
    }
}

// Function to show AppleBucks messages in games
function showAppleBucksMessage(message) {
    // Remove existing message
    const existingMessage = document.querySelector('.applebucks-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'applebucks-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem;
        border-radius: 6px;
        font-weight: bold;
        z-index: 1000;
        animation: applebucksSlideIn 0.3s ease-out;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Add CSS animation for AppleBucks messages
if (!document.querySelector('#applebucks-styles')) {
    const style = document.createElement('style');
    style.id = 'applebucks-styles';
    style.textContent = `
        @keyframes applebucksSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add a "Return to Apple Bobs" button to games
function addReturnButton() {
    // Only add if it doesn't exist
    if (!document.querySelector('#return-to-applebobs')) {
        const returnButton = document.createElement('button');
        returnButton.id = 'return-to-applebobs';
        returnButton.innerHTML = '🍎 Return to Apple Bobs';
        returnButton.onclick = returnToAppleBobs;
        returnButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            z-index: 1000;
            font-size: 1rem;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: background-color 0.3s;
        `;
        
        returnButton.addEventListener('mouseenter', () => {
            returnButton.style.backgroundColor = '#45a049';
        });
        
        returnButton.addEventListener('mouseleave', () => {
            returnButton.style.backgroundColor = '#4CAF50';
        });
        
        document.body.appendChild(returnButton);
    }
}

// Auto-add return button when script loads
document.addEventListener('DOMContentLoaded', function() {
    addReturnButton();
});

// Make functions available globally
window.AppleBucks = {
    give: giveAppleBucks,
    return: returnToAppleBobs,
    showMessage: showAppleBucksMessage,
    addReturnButton: addReturnButton
};

// Console helper
console.log('🍎 AppleBucks Helper loaded! Use AppleBucks.give(amount) to give AppleBucks to players!'); 