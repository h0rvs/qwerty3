let words = [];
let currentWordIndex = 0;
let currentCharIndex = 0;
let correctChars = 0;
let totalChars = 0;
let correctWords = 0;
let startTime = null;
let timer = null;
let timeLeft = 60;
let testDuration = 60;
let isRunning = false;
let isPaused = false;
let currentTextLength = 10;
let currentTextType = 'words';
let testCompleted = false;
let currentDifficulty = 'легкая';

let textDisplay, textInput, resetBtn, pauseBtn, changeTextBtn;
let wpmElement, accuracyElement, timerElement, wordsCountElement;
let resultsContainer, continueBtn;
let resultWpmElement, resultAccuracyElement, resultWordsElement, resultCharsElement;

function displayText(wordsArray) {
    textDisplay.innerHTML = '';
    
    wordsArray.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        
        if (wordIndex === currentWordIndex) {
            wordSpan.classList.add('current');
        }
        
        const chars = word.split('');
        chars.forEach((char, charIndex) => {
            const charSpan = document.createElement('span');
            charSpan.className = 'letter';
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
        });
        
        textDisplay.appendChild(wordSpan);
        textDisplay.appendChild(document.createTextNode(' '));
    });
    
    // if (currentWordIndex < words.length) {
    //     const cursor = document.createElement('span');
    //     cursor.className = 'cursor';
    //     textDisplay.appendChild(cursor);
    // }
}

function startTypingTest() {
    if (isRunning) return;
    
    isRunning = true;
    isPaused = false;
    testCompleted = false;
    startTime = new Date();
    textInput.disabled = false;
    textInput.placeholder = "Продолжайте печатать...";
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Пауза';
    
    timeLeft = testDuration;
    timerElement.textContent = timeLeft;
    
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    
    resetStats();
}

function resetTest() {
    isRunning = false;
    isPaused = false;
    testCompleted = false;
    clearInterval(timer);
    timeLeft = testDuration;
    currentWordIndex = 0;
    currentCharIndex = 0;
    correctChars = 0;
    totalChars = 0;
    correctWords = 0;
    startTime = null;
    
    timerElement.textContent = timeLeft;
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100%';
    wordsCountElement.textContent = '0';
    
    words = window.getRandomText(currentTextLength, currentTextType, currentDifficulty);
    displayText(words);
    
    textInput.value = '';
    textInput.disabled = false;
    textInput.placeholder = "Начните печатать здесь, чтобы запустить таймер...";
    textInput.focus();
    
    resultsContainer.classList.add('hidden');
}

function togglePause() {
    if (!isRunning) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        clearInterval(timer);
        textInput.disabled = true;
        textInput.placeholder = "Тест на паузе. Нажмите 'Продолжить'";
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Продолжить';
    } else {
        timer = setInterval(updateTimer, 1000);
        textInput.disabled = false;
        textInput.placeholder = "Продолжайте печатать...";
        textInput.focus();
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Пауза';
    }
}

function updateTimer() {
    if (isPaused) return;
    
    timeLeft--;
    timerElement.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        finishTest();
    }
}

function finishTest() {
    isRunning = false;
    testCompleted = true;
    
    const timeUsed = testDuration - timeLeft;
    
    const actualTimeUsed = timeUsed > 0 ? timeUsed : 1;
    const wpm = Math.round((correctWords / actualTimeUsed) * 60) || 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    wpmElement.textContent = wpm;
    accuracyElement.textContent = `${accuracy}%`;
    
    showResults(wpm, accuracy, correctWords, correctChars);
}

function showResults(wpm, accuracy, wordsCount, charsCount) {
    testCompleted = true;
    
    resultWpmElement.textContent = wpm;
    resultAccuracyElement.textContent = `${accuracy}%`;
    resultWordsElement.textContent = wordsCount;
    resultCharsElement.textContent = charsCount;
    
    resultsContainer.classList.remove('hidden');
    
    textInput.disabled = true;
    textInput.placeholder = "Тест завершен. Нажмите 'Новый тест' для продолжения";
    
    clearInterval(timer);
}

function hideResultsAndReset() {
    testCompleted = false;
    resultsContainer.classList.add('hidden');
    resetTest();
}

function resetStats() {
    correctChars = 0;
    totalChars = 0;
    correctWords = 0;
    startTime = new Date();
}

function handleInput() {
    if (testCompleted) return;
    
    if (!isRunning && !isPaused && textInput.value.trim() !== '') {
        startTypingTest();
    }
    
    if (!isRunning || isPaused) return;
    
    const inputValue = textInput.value.trim();
    const currentWord = words[currentWordIndex];
    
    const wordElements = document.querySelectorAll('.word');
    wordElements.forEach((wordEl, index) => {
        wordEl.classList.remove('current');
        if (index === currentWordIndex) {
            wordEl.classList.add('current');
        }
    });
    
    const letters = wordElements[currentWordIndex].querySelectorAll('.letter');
    let allCorrect = true;
    
    for (let i = 0; i < Math.max(currentWord.length, inputValue.length); i++) {
        if (i < letters.length) {
            if (i < inputValue.length) {
                if (inputValue[i] === currentWord[i]) {
                    letters[i].classList.add('correct');
                    letters[i].classList.remove('incorrect');
                } else {
                    letters[i].classList.add('incorrect');
                    letters[i].classList.remove('correct');
                    allCorrect = false;
                }
            } else {
                letters[i].classList.remove('correct', 'incorrect');
            }
        }
    }
    
    if (inputValue.endsWith(' ') || (inputValue.length >= currentWord.length && allCorrect)) {
        const typedWord = inputValue.trim();
        
        totalChars += currentWord.length;
        if (typedWord === currentWord) {
            correctChars += currentWord.length;
            correctWords++;
            wordElements[currentWordIndex].classList.add('correct');
            wordElements[currentWordIndex].classList.remove('incorrect');
        } else {
            wordElements[currentWordIndex].classList.add('incorrect');
            wordElements[currentWordIndex].classList.remove('correct');
        }
        
        currentWordIndex++;
        currentCharIndex = 0;
        textInput.value = '';
        
        if (currentWordIndex >= words.length) {
            const newWords = window.getRandomText(10, currentTextType, currentDifficulty);
            words.push(...newWords);
        }
        
        displayText(words);
        
        updateStats();
    }
}

function updateStats() {
    if (!startTime) return;
    
    const elapsedTimeInSeconds = (new Date() - startTime) / 1000; 
    if (elapsedTimeInSeconds < 0.1) return;
    
    const wpm = Math.round((correctWords / elapsedTimeInSeconds) * 60) || 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    wpmElement.textContent = wpm;
    accuracyElement.textContent = `${accuracy}%`;
    wordsCountElement.textContent = correctWords;
}

function changeText(length = null, type = null) {
    if (length !== null) {
        currentTextLength = length;
        currentTextType = 'words';
        
        const textOptions = document.querySelectorAll('.text-option');
        textOptions.forEach(option => {
            if (option.dataset.length == length) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    } 

    else if (type !== null) {
        currentTextType = type;
        if (type === 'quote') {
            currentTextLength = 5; 
        } else if (type === 'code') {
            currentTextLength = 5; 
        } else {
            currentTextLength = 10; 
        }
        
        const textOptions = document.querySelectorAll('.text-option');
        textOptions.forEach(option => {
            if (option.dataset.type === type) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    resetTest();
}

function changeTextInCurrentCategory() {
    words = window.getRandomText(currentTextLength, currentTextType, currentDifficulty);
    displayText(words);

    isRunning = false;
    isPaused = false;
    testCompleted = false;
    clearInterval(timer);
    timeLeft = testDuration;
    currentWordIndex = 0;
    currentCharIndex = 0;
    correctChars = 0;
    totalChars = 0;
    correctWords = 0;
    
    timerElement.textContent = timeLeft;
    wpmElement.textContent = '0';
    accuracyElement.textContent = '100%';
    wordsCountElement.textContent = '0';
    
    textInput.value = '';
    textInput.disabled = false;
    textInput.placeholder = "Начните печатать здесь, чтобы запустить таймер...";
    
    resultsContainer.classList.add('hidden');
}

function updateTestDuration(newDuration) {
    testDuration = newDuration;
    timeLeft = newDuration;
    timerElement.textContent = newDuration;
    
    if (!isRunning) {
        resetTest();
    }
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    if (!isRunning) {
        words = window.getRandomText(currentTextLength, currentTextType, currentDifficulty);
        displayText(words);
    }
}

function initTraining() {
    textDisplay = document.getElementById('text-display');
    textInput = document.getElementById('text-input');
    resetBtn = document.getElementById('reset-btn');
    pauseBtn = document.getElementById('pause-btn');
    changeTextBtn = document.getElementById('change-text-btn');
    
    wpmElement = document.getElementById('wpm');
    accuracyElement = document.getElementById('accuracy');
    timerElement = document.getElementById('timer');
    wordsCountElement = document.getElementById('words-count');
    
    resultsContainer = document.getElementById('results-container');
    continueBtn = document.getElementById('continue-btn');
    
    resultWpmElement = document.getElementById('result-wpm');
    resultAccuracyElement = document.getElementById('result-accuracy');
    resultWordsElement = document.getElementById('result-words');
    resultCharsElement = document.getElementById('result-chars');
    
    const savedDuration = localStorage.getItem('testDuration');
    if (savedDuration) {
        const time = parseInt(savedDuration);
        if (!isNaN(time) && time > 0) {
            testDuration = time;
            timeLeft = time;
            timerElement.textContent = time;
        }
    }
    
    const savedDifficulty = localStorage.getItem('difficulty');
    if (savedDifficulty) {
        currentDifficulty = savedDifficulty;
    }
    
    words = window.getRandomText(currentTextLength, currentTextType, currentDifficulty);
    displayText(words);
    
    textInput.addEventListener('input', handleInput);
    resetBtn.addEventListener('click', resetTest);
    pauseBtn.addEventListener('click', togglePause);
    changeTextBtn.addEventListener('click', changeTextInCurrentCategory);
    continueBtn.addEventListener('click', hideResultsAndReset);
    
    const textOptions = document.querySelectorAll('.text-option');
    textOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (option.dataset.length) {
                changeText(parseInt(option.dataset.length));
            } else if (option.dataset.type) {
                changeText(null, option.dataset.type);
            }
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            resetTest();
        }
    });
    
    setTimeout(() => {
        textInput.focus();
    }, 100);
}

window.initTraining = initTraining;
window.updateTestDuration = updateTestDuration;
window.setDifficulty = setDifficulty;

window.resetTest = resetTest;
