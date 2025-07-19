// Configuration
const API_BASE_URL = 'http://localhost:8080';


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


let isSearching = false;


document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

searchForm.addEventListener('submit', handleSearchSubmit);


function initializeApp() {

    sourceCodeInput.value = '';
    destinationCodeInput.value = '';
    

    sourceCodeInput.addEventListener('input', handleInputChange);
    destinationCodeInput.addEventListener('input', handleInputChange);
}


async function handleSearchSubmit(event) {
    event.preventDefault();
    

    if (isSearching) {
        console.log('Search already in progress...');
        return;
    }
    
    const sourceCode = sourceCodeInput.value.trim().toUpperCase();
    const destinationCode = destinationCodeInput.value.trim().toUpperCase();
    

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

        isSearching = true;
        

        hideAllResults();
        showLoading();
        

        const trains = await fetchTrains(sourceCode, destinationCode);
        

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

        isSearching = false;
    }
}


function removeDuplicateTrains(trains) {
    const uniqueTrainsMap = new Map();
    
    trains.forEach(train => {

        const uniqueKey = `${train.train.trainNumber}-${train.departureTime}-${train.arrivalTime}-${train.source.stationCode}-${train.destination.stationCode}`;
        

        if (!uniqueTrainsMap.has(uniqueKey)) {
            uniqueTrainsMap.set(uniqueKey, train);
        } else {
            console.log(`Duplicate train found and removed: ${train.train.trainName} (${train.train.trainNumber})`);
        }
    });
    

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
    

    if (error.message.includes('Failed to fetch')) {
        errorMessage.textContent = 'Unable to connect to the server. Please make sure the API is running on http://localhost:8080';
    } else {
        errorMessage.textContent = `Error: ${error.message}`;
    }
}

function showAlert(message) {
    alert(message);
}

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


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatTime,
        validateInputs,
        escapeHtml,
        removeDuplicateTrains,
        removeDuplicateTrainsByNumber
    };
}