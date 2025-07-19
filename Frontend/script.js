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

// Prevent multiple simultaneous API calls
let isSearching = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

searchForm.addEventListener('submit', handleSearchSubmit);

// Initialize the application
function initializeApp() {
    // Pre-fill with sample data for quick testing
    sourceCodeInput.value = '';
    destinationCodeInput.value = '';
    
    // Add input event listeners for better UX
    sourceCodeInput.addEventListener('input', handleInputChange);
    destinationCodeInput.addEventListener('input', handleInputChange);
}

// Handle search form submission
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

// Validate user inputs
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

// Handle input changes (convert to uppercase)
function handleInputChange(event) {
    event.target.value = event.target.value.toUpperCase();
}

// Main function to search for trains
async function searchTrains(sourceCode, destinationCode) {
    try {
        // Set searching flag
        isSearching = true;
        
        // Reset UI state
        hideAllResults();
        showLoading();
        
        // Make API call
        const trains = await fetchTrains(sourceCode, destinationCode);
        
        // Hide loading
        hideLoading();
        
        // Remove duplicates and display results
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
        // Reset searching flag
        isSearching = false;
    }
}

// Remove duplicate trains based on train number and timing
function removeDuplicateTrains(trains) {
    const uniqueTrainsMap = new Map();
    
    trains.forEach(train => {
        // Create a unique key combining multiple fields to identify duplicates
        const uniqueKey = `${train.train.trainNumber}-${train.departureTime}-${train.arrivalTime}-${train.source.stationCode}-${train.destination.stationCode}`;
        
        // Only add if this unique combination hasn't been seen before
        if (!uniqueTrainsMap.has(uniqueKey)) {
            uniqueTrainsMap.set(uniqueKey, train);
        } else {
            console.log(`Duplicate train found and removed: ${train.train.trainName} (${train.train.trainNumber})`);
        }
    });
    
    // Convert Map values back to array
    return Array.from(uniqueTrainsMap.values());
}

// Alternative deduplication method - simpler approach based on train number only
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

// Fetch trains from API
async function fetchTrains(sourceCode, destinationCode) {
    const url = `${API_BASE_URL}/search/by-code?sourceCode=${sourceCode}&destinationCode=${destinationCode}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

// Display the list of trains
function displayTrains(trains) {
    updateResultsCount(trains.length);
    clearTrainsList();
    
    trains.forEach((train, index) => {
        const trainCard = createTrainCard(train);
        trainsList.appendChild(trainCard);
        
        // Add staggered animation
        setTimeout(() => {
            trainCard.classList.add('fade-in');
        }, index * 100);
    });
    
    showResults();
}

// Create a train card element
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
        <button class="book-btn">Book</button>
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

// Format time from 24-hour to 12-hour format
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update results count display
function updateResultsCount(count) {
    resultsCount.textContent = `${count} train${count !== 1 ? 's' : ''} found`;
}

// Clear the trains list
function clearTrainsList() {
    trainsList.innerHTML = '';
}

// UI State Management Functions
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
    
    // Set appropriate error message
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

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatTime,
        validateInputs,
        escapeHtml,
        removeDuplicateTrains,
        removeDuplicateTrainsByNumber
    };
}