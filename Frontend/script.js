// Configuration
const API_BASE_URL = 'http://localhost:8080';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const sourceCodeInput = document.getElementById('sourceCode');
const destinationCodeInput = document.getElementById('destinationCode');
const loadingElement = document.getElementById('loading');
const resultsContainer = document.getElementById('results');
const trainsList = document.getElementById('trainsList');
const resultsCount = document.getElementById('resultsCount');
const noResultsElement = document.getElementById('noResults');
const errorElement = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

// Sidebar elements
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const swapButton = document.getElementById('swapStations');
const routeCards = document.querySelectorAll('.route-card');

// State
let isSearching = false;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeSidebar();
    initializeRouteCards();
    initializeSwapButton();
});

// Event Listeners
searchForm.addEventListener('submit', handleSearchSubmit);

function initializeApp() {
    // Clear input fields
    sourceCodeInput.value = '';
    destinationCodeInput.value = '';
    
    // Add input event listeners
    sourceCodeInput.addEventListener('input', handleInputChange);
    destinationCodeInput.addEventListener('input', handleInputChange);
}

function initializeSidebar() {
    // Sidebar toggle for mobile
    sidebarToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        
        // Create overlay for mobile
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });
        }
        
        if (sidebar.classList.contains('open')) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    });

    // Menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.querySelector('a').getAttribute('data-section');
            switchSection(targetSection);
            
            // Update active menu item
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.classList.remove('active');
            }
        });
    });
}

function initializeRouteCards() {
    routeCards.forEach(card => {
        card.addEventListener('click', () => {
            const sourceCode = card.getAttribute('data-source');
            const destCode = card.getAttribute('data-dest');
            
            sourceCodeInput.value = sourceCode;
            destinationCodeInput.value = destCode;
            
            // Trigger search
            searchTrains(sourceCode, destCode);
        });
    });
}

function initializeSwapButton() {
    swapButton?.addEventListener('click', () => {
        const sourceValue = sourceCodeInput.value;
        const destValue = destinationCodeInput.value;
        
        sourceCodeInput.value = destValue;
        destinationCodeInput.value = sourceValue;
    });
}

function switchSection(sectionName) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update header title
    const headerTitle = document.querySelector('.header-left h1');
    const titles = {
        search: 'Train Search',
        pnr: 'PNR Status',
        live: 'Live Train Status',
        schedule: 'Train Schedule',
        stations: 'Station Information',
        booking: 'My Bookings'
    };
    
    if (headerTitle && titles[sectionName]) {
        headerTitle.textContent = titles[sectionName];
    }
}

async function handleSearchSubmit(event) {
    event.preventDefault();
    
    // Prevent multiple simultaneous searches
    if (isSearching) {
        console.log('Search already in progress...');
        return;
    }
    
    const sourceCode = sourceCodeInput.value.trim().toUpperCase();
    const destinationCode = destinationCodeInput.value.trim().toUpperCase();
    
    // Validate inputs
    if (!validateInputs(sourceCode, destinationCode)) {
        return;
    }
    
    await searchTrains(sourceCode, destinationCode);
}

function validateInputs(sourceCode, destinationCode) {
    if (!sourceCode || !destinationCode) {
        showAlert('Please enter both source and destination station codes.');
        return false;
    }
    
    if (sourceCode === destinationCode) {
        showAlert('Source and destination stations cannot be the same.');
        return false;
    }
    
    return true;
}

function handleInputChange(event) {
    event.target.value = event.target.value.toUpperCase();
}

async function searchTrains(sourceCode, destinationCode) {
    try {
        // Set searching state
        isSearching = true;
        
        // Reset UI state
        hideAllResults();
        showLoading();
        
        // Fetch train data
        const trains = await fetchTrains(sourceCode, destinationCode);
        
        // Hide loading
        hideLoading();

        if (trains && trains.length > 0) {
            const uniqueTrains = removeDuplicateTrains(trains);
            console.log(`Original trains: ${trains.length}, After deduplication: ${uniqueTrains.length}`);
            displayTrains(uniqueTrains);
        } else {
            showNoResults();
        }
        
    } catch (error) {
        hideLoading();
        showError(error);
    } finally {
        // Reset searching state
        isSearching = false;
    }
}

function removeDuplicateTrains(trains) {
    const uniqueTrainsMap = new Map();
    
    trains.forEach(train => {
        // Create unique key based on train details
        const uniqueKey = `${train.train.trainNumber}-${train.departureTime}-${train.arrivalTime}-${train.source.stationCode}-${train.destination.stationCode}`;
        
        // Only add if not already present
        if (!uniqueTrainsMap.has(uniqueKey)) {
            uniqueTrainsMap.set(uniqueKey, train);
        } else {
            console.log(`Duplicate train found and removed: ${train.train.trainName} (${train.train.trainNumber})`);
        }
    });
    
    // Convert map values back to array
    return Array.from(uniqueTrainsMap.values());
}

function removeDuplicateTrainsByNumber(trains) {
    const seenTrainNumbers = new Set();
    const uniqueTrains = [];
    
    trains.forEach(train => {
        if (!seenTrainNumbers.has(train.train.trainNumber)) {
            seenTrainNumbers.add(train.train.trainNumber);
            uniqueTrains.push(train);
        } else {
            console.log(`Duplicate train number found and removed: ${train.train.trainName} (${train.train.trainNumber})`);
        }
    });
    
    return uniqueTrains;
}

async function fetchTrains(sourceCode, destinationCode) {
    const url = `${API_BASE_URL}/search/by-code?sourceCode=${sourceCode}&destinationCode=${destinationCode}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

function displayTrains(trains) {
    updateResultsCount(trains.length);
    clearTrainsList();
    
    trains.forEach((train, index) => {
        const trainCard = createTrainCard(train);
        trainsList.appendChild(trainCard);
        
        // Stagger animation
        setTimeout(() => {
            trainCard.classList.add('fade-in');
        }, index * 100);
    });
    
    showResults();
}

function createTrainCard(train) {
    const card = document.createElement('div');
    card.className = 'train-card';
    
    const departureTime = formatTime(train.departureTime);
    const arrivalTime = formatTime(train.arrivalTime);
    
    card.innerHTML = `
        <div class="train-header">
            <div class="train-info">
                <h3>${escapeHtml(train.train.trainName)}</h3>
                <div class="train-number">#${escapeHtml(train.train.trainNumber)}</div>
            </div>
            <button class="book-btn" onclick="bookTrain('${train.train.trainNumber}')">Book</button>
        </div>
        <div class="journey-details">
            <div class="station-info source">
                <div class="station-name">${escapeHtml(train.source.stationName)}</div>
                <div class="station-code">${escapeHtml(train.source.stationCode)}</div>
                <div class="time">${departureTime}</div>
            </div>
            <div class="journey-line">
                <div class="line">
                    <div class="train-icon"></div>
                </div>
            </div>
            <div class="station-info destination">
                <div class="station-name">${escapeHtml(train.destination.stationName)}</div>
                <div class="station-code">${escapeHtml(train.destination.stationCode)}</div>
                <div class="time">${arrivalTime}</div>
            </div>
        </div>
    `;

    return card;
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// UI State Management Functions
function updateResultsCount(count) {
    resultsCount.textContent = `${count} train${count !== 1 ? 's' : ''} found`;
}

function clearTrainsList() {
    trainsList.innerHTML = '';
}

function hideAllResults() {
    resultsContainer.style.display = 'none';
    noResultsElement.style.display = 'none';
    errorElement.style.display = 'none';
}

function showLoading() {
    loadingElement.style.display = 'block';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

function showResults() {
    resultsContainer.style.display = 'block';
}

function showNoResults() {
    noResultsElement.style.display = 'block';
    noResultsElement.classList.add('fade-in');
}

function showError(error) {
    console.error('Error fetching trains:', error);
    
    errorElement.style.display = 'block';
    errorElement.classList.add('fade-in');
    
    // Show user-friendly error messages
    if (error.message.includes('Failed to fetch')) {
        errorMessage.textContent = 'Unable to connect to the server. Please make sure the API is running on http://localhost:8080';
    } else {
        errorMessage.textContent = `Error: ${error.message}`;
    }
}

function showAlert(message) {
    alert(message);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Additional Feature Functions
function bookTrain(trainNumber) {
    showAlert(`Booking functionality for train ${trainNumber} will be implemented soon!`);
}

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.classList.remove('active');
    }
});

// Export functions for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatTime,
        validateInputs,
        escapeHtml,
        removeDuplicateTrains,
        removeDuplicateTrainsByNumber
    };
}