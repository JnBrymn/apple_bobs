// Apple Bobs - AppleBucks System
// This script manages the AppleBucks currency system for playing games

// Initialize AppleBucks system
let appleBucks = 5; // Start with 5 AppleBucks

// Load AppleBucks from localStorage if available
function loadAppleBucks() {
    const saved = localStorage.getItem('appleBobs_appleBucks');
    if (saved !== null) {
        appleBucks = parseInt(saved);
    }
    console.log('🍎 Loaded AppleBucks:', appleBucks);
    updateAppleBucksDisplay();
}

// Save AppleBucks to localStorage
function saveAppleBucks() {
    localStorage.setItem('appleBobs_appleBucks', appleBucks.toString());
}

// Update the AppleBucks display
function updateAppleBucksDisplay() {
    const balanceElement = document.getElementById('applebucks-balance');
    if (balanceElement) {
        balanceElement.textContent = appleBucks;
        console.log('🍎 Updated display to:', appleBucks);
    } else {
        console.log('❌ Could not find applebucks-balance element');
    }
    
    // Update game link states
    updateGameLinkStates();
}

// Update game link states (enabled/disabled based on AppleBucks)
function updateGameLinkStates() {
    const gameLinks = document.querySelectorAll('.game-link');
    gameLinks.forEach(link => {
        if (appleBucks >= 1) {
            link.classList.remove('disabled');
        } else {
            link.classList.add('disabled');
        }
    });
    
    // Check if we need to give a free AppleBuck
    if (appleBucks <= 0) {
        giveFreeAppleBuck();
    }
}

// Give a free AppleBuck when player runs out
function giveFreeAppleBuck() {
    // Only give free AppleBuck if we haven't already given one recently
    const lastFreeBuck = localStorage.getItem('appleBobs_lastFreeBuck');
    const now = Date.now();
    
    if (!lastFreeBuck || (now - parseInt(lastFreeBuck)) > 60000) { // 1 minute cooldown
        appleBucks = 1;
        saveAppleBucks();
        localStorage.setItem('appleBobs_lastFreeBuck', now.toString());
        
        showMessage('🍎 Oh no! You ran out of AppleBucks! Here, I\'ll give you 1 AppleBuck to keep playing!', 'info');
        
        // Update display after a short delay
        setTimeout(() => {
            updateAppleBucksDisplay();
        }, 100);
    }
}

// Function to play a game (costs 1 AppleBuck)
function playGame(gamePath) {
    if (appleBucks >= 1) {
        // Deduct 1 AppleBuck
        appleBucks -= 1;
        saveAppleBucks();
        updateAppleBucksDisplay();
        
        // Show confirmation message
        showMessage(`🎮 Playing game! -1 AppleBuck (${appleBucks} remaining)`, 'success');
        
        // Navigate to the game after a short delay
        setTimeout(() => {
            window.location.href = gamePath;
        }, 1000);
    } else {
        showMessage('❌ Not enough AppleBucks! You need 1 AppleBuck to play.', 'error');
    }
}

// Function to give AppleBucks during gameplay (for games to call)
function giveAppleBucksDuringGame(amount = 1) {
    appleBucks += amount;
    saveAppleBucks();
    updateAppleBucksDisplay();
    showMessage(`🎉 +${amount} AppleBuck${amount > 1 ? 's' : ''}! Total: ${appleBucks}`, 'success');
}

// Function to earn AppleBucks (called when returning from games)
function earnAppleBucks(amount = 1) {
    appleBucks += amount;
    saveAppleBucks();
    updateAppleBucksDisplay();
    showMessage(`🎉 You earned ${amount} AppleBuck${amount > 1 ? 's' : ''}! Total: ${appleBucks}`, 'success');
}

// Function to reset AppleBucks (for testing)
function resetAppleBucks() {
    appleBucks = 5;
    saveAppleBucks();
    updateAppleBucksDisplay();
    showMessage('🔄 AppleBucks reset to 5!', 'info');
}

// Show message to user
function showMessage(message, type = 'info') {
    // Remove existing message
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        border-radius: 6px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            messageDiv.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#f44336';
            break;
        case 'info':
            messageDiv.style.backgroundColor = '#2196F3';
            break;
        default:
            messageDiv.style.backgroundColor = '#333';
    }
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Add CSS animation for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
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

// Check if returning from a game (look for URL parameters)
function checkGameReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameResult = urlParams.get('gameResult');
    const gameName = urlParams.get('gameName');
    const earnedBucks = urlParams.get('earnedBucks');
    
    if (earnedBucks) {
        const amount = parseInt(earnedBucks);
        earnAppleBucks(amount);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (gameResult === 'win') {
        earnAppleBucks(2); // Win 2 AppleBucks for winning
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (gameResult === 'play') {
        // Just played a game, no bonus
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Add reset button for testing (only show in development)
function addResetButton() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const resetButton = document.createElement('button');
        resetButton.textContent = '🔄 Reset AppleBucks';
        resetButton.onclick = resetAppleBucks;
        resetButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff9800;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            z-index: 1000;
        `;
        document.body.appendChild(resetButton);
        
        // Add test button to give AppleBucks
        const testButton = document.createElement('button');
        testButton.textContent = '🍎 +1 AppleBuck';
        testButton.onclick = () => earnAppleBucks(1);
        testButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 150px;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            z-index: 1000;
        `;
        document.body.appendChild(testButton);
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍎 AppleBucks script loaded!');
    
    // Add a big test button to the page
    const testDiv = document.createElement('div');
    testDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4CAF50;
            color: white;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        ">
            <h2>🍎 AppleBucks Test</h2>
            <p>If you see this, the script is working!</p>
            <button onclick="window.appleBobs.earnAppleBucks(10)" style="
                background: white;
                color: #4CAF50;
                border: none;
                padding: 1rem 2rem;
                border-radius: 6px;
                font-size: 1.2rem;
                cursor: pointer;
                margin: 0.5rem;
            ">Give Me 10 AppleBucks!</button>
            <button onclick="this.parentElement.remove()" style="
                background: #f44336;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 6px;
                font-size: 1.2rem;
                cursor: pointer;
                margin: 0.5rem;
            ">Close</button>
        </div>
    `;
    document.body.appendChild(testDiv);
    
    loadAppleBucks();
    checkGameReturn();
    addResetButton();
    
    // Add keyboard shortcut for reset (Ctrl+R)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            resetAppleBucks();
        }
    });

    // Initialize game search functionality with a small delay to ensure DOM is ready
    setTimeout(() => {
        console.log('🔍 Attempting to initialize search...');
        initializeGameSearch();
    }, 100);
});

// Make functions available globally for debugging
window.appleBobs = {
    playGame,
    earnAppleBucks,
    resetAppleBucks,
    getAppleBucks: () => appleBucks,
    giveAppleBucks: earnAppleBucks, // Alias for games to use
    giveAppleBucksDuringGame: giveAppleBucksDuringGame // For games to give AppleBucks during gameplay
};

// Search Game Functionality
function initializeGameSearch() {
    console.log('🔍 Starting search initialization...');
    
    const searchInput = document.getElementById('gameSearch');
    const searchResults = document.getElementById('searchResults');
    const gameList = document.querySelector('.game-list');
    
    console.log('🔍 Search elements found:', {
        searchInput: !!searchInput,
        searchResults: !!searchResults,
        gameList: !!gameList
    });
    
    if (!searchInput || !searchResults || !gameList) {
        console.log('❌ Search elements not found, skipping search initialization');
        console.log('🔍 Available elements:', {
            'gameSearch': document.getElementById('gameSearch'),
            'searchResults': document.getElementById('searchResults'),
            'game-list': document.querySelector('.game-list'),
            'search-container': document.querySelector('.search-container')
        });
        return;
    }
    
    console.log('✅ All search elements found, initializing...');
    
    // Add search event listeners
    searchInput.addEventListener('input', function() {
        console.log('🔍 Search input event triggered:', this.value);
        const searchTerm = this.value.toLowerCase().trim();
        filterGames(searchTerm);
    });
    
    // Add search on Enter key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('🔍 Enter key pressed, focusing first visible game');
            // Focus on first visible game link
            const firstVisibleLink = document.querySelector('.game-list li:not(.hidden) .game-link');
            if (firstVisibleLink) {
                firstVisibleLink.focus();
            }
        }
    });
    
    // Add clear search on Escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log('🔍 Escape key pressed, clearing search');
            this.value = '';
            filterGames('');
            this.focus();
        }
    });
    
    // Add search icon click to focus
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('search-container')) {
                searchInput.focus();
            }
        });
    }
    
    console.log('✅ Search functionality initialized successfully!');
    
    // Test the search functionality
    setTimeout(() => {
        console.log('🔍 Testing search functionality...');
        filterGames('test');
        setTimeout(() => {
            filterGames('');
            console.log('🔍 Search test completed');
        }, 500);
    }, 1000);
}

function filterGames(searchTerm) {
    console.log('🔍 filterGames called with term:', searchTerm);
    
    const gameItems = document.querySelectorAll('.game-list li');
    const searchResults = document.getElementById('searchResults');
    let visibleCount = 0;
    let totalCount = gameItems.length;
    
    console.log('🔍 Found game items:', totalCount);
    
    gameItems.forEach((item, index) => {
        const gameLink = item.querySelector('.game-link');
        const gameText = gameLink ? gameLink.textContent.toLowerCase() : '';
        
        console.log(`🔍 Game ${index + 1}:`, gameText);
        
        // Remove previous highlighting
        item.classList.remove('highlighted');
        
        if (searchTerm === '') {
            // Show all games
            item.classList.remove('hidden');
            visibleCount++;
        } else if (gameText.includes(searchTerm)) {
            // Show matching games
            item.classList.remove('hidden');
            item.classList.add('highlighted');
            visibleCount++;
            
            // Highlight the matching text
            highlightText(gameLink, searchTerm);
        } else {
            // Hide non-matching games
            item.classList.add('hidden');
        }
    });
    
    console.log('🔍 Filtering complete. Visible:', visibleCount, 'Total:', totalCount);
    
    // Update search results display
    if (searchTerm === '') {
        searchResults.textContent = `Showing all ${totalCount} games`;
    } else {
        searchResults.textContent = `Found ${visibleCount} of ${totalCount} games`;
        
        // Add search term to results
        if (visibleCount > 0) {
            searchResults.innerHTML = `Found <strong>${visibleCount}</strong> of ${totalCount} games matching "<em>${searchTerm}</em>"`;
        } else {
            searchResults.innerHTML = `No games found matching "<em>${searchTerm}</em>"`;
        }
    }
    
    // Update search input styling
    const searchInput = document.getElementById('gameSearch');
    if (searchInput) {
        if (searchTerm === '') {
            searchInput.style.borderColor = '#ddd';
        } else if (visibleCount > 0) {
            searchInput.style.borderColor = '#4CAF50';
        } else {
            searchInput.style.borderColor = '#f44336';
        }
    }
}

function highlightText(element, searchTerm) {
    if (!element || !searchTerm) return;
    
    const originalText = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlightedText = originalText.replace(regex, '<mark style="background: #ffeb3b; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    
    // Only update if we haven't already highlighted
    if (!element.dataset.originalText) {
        element.dataset.originalText = originalText;
    }
    
    if (element.innerHTML !== highlightedText) {
        element.innerHTML = highlightedText;
    }
}

function clearSearch() {
    const searchInput = document.getElementById('gameSearch');
    if (searchInput) {
        searchInput.value = '';
        filterGames('');
        searchInput.focus();
    }
}

// Add search functionality to the global appleBobs object
window.appleBobs.search = {
    filterGames,
    clearSearch,
    initializeGameSearch
};

// Test function for debugging search
function testSearch() {
    console.log('🧪 Test Search Function called!');
    
    // Check if search elements exist
    const searchInput = document.getElementById('gameSearch');
    const searchResults = document.getElementById('searchResults');
    const gameList = document.querySelector('.game-list');
    
    console.log('🧪 Search elements check:', {
        searchInput: searchInput ? 'Found' : 'Missing',
        searchResults: searchResults ? 'Found' : 'Missing',
        gameList: gameList ? 'Found' : 'Missing'
    });
    
    if (searchInput && searchResults && gameList) {
        console.log('✅ All search elements found!');
        
        // Test the search functionality
        searchInput.value = 'tetris';
        filterGames('tetris');
        
        // Show success message
        alert('Search test completed! Check console for details.');
    } else {
        console.log('❌ Some search elements are missing!');
        alert('Search elements missing! Check console for details.');
    }
} 