function initSettings() {
    const saveSettingsBtn = document.getElementById('save-settings');
    const resetSettingsBtn = document.getElementById('reset-settings');
    
    initTimeSettings();
    initDifficultySettings();
    initColorSettings();
    initSoundSettings();
    
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', function() {
            alert('Настройки сохранены!');
        });
    }
    
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', function() {
            if (confirm('Сбросить все настройки к стандартным?')) {
                resetToDefaultSettings();
            }
        });
    }
    
    loadSettings();
}

function initTimeSettings() {
    const timeOptions = document.querySelectorAll('.setting-group:nth-child(1) .setting-option');
    
    timeOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('сек')) {
                const time = parseInt(this.textContent);
                if (!isNaN(time) && time > 0) {
                    timeOptions.forEach(b => {
                        b.classList.remove('active');
                    });
                    
                    this.classList.add('active');
                    
                    localStorage.setItem('testDuration', time);
                    
                    applyTestDuration(time);
                }
            }
        });
    });
}

function initDifficultySettings() {
    const difficultyOptions = document.querySelectorAll('.setting-group:nth-child(2) .setting-option');
    
    difficultyOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            difficultyOptions.forEach(b => {
                b.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const difficulty = this.textContent.toLowerCase();
            localStorage.setItem('difficulty', difficulty);
            
            applyDifficulty(difficulty);
        });
    });
}

function initColorSettings() {
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            colorOptions.forEach(b => {
                b.classList.remove('active');
            });
            
            this.classList.add('active');
            
            const color = this.getAttribute('data-color');
            if (typeof window.changeThemeColor === 'function') {
                window.changeThemeColor(color);
            }
            
            localStorage.setItem('themeColor', color);
        });
    });
}

function initSoundSettings() {
    const soundSwitch = document.querySelector('.switch input');
    if (soundSwitch) {
        const savedSound = localStorage.getItem('soundEnabled');
        if (savedSound !== null) {
            soundSwitch.checked = savedSound === 'true';
        }
        
        soundSwitch.addEventListener('change', function() {
            localStorage.setItem('soundEnabled', this.checked);
        });
    }
}

function applyTestDuration(duration) {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = duration;
    }
    
    if (typeof window.updateTestDuration === 'function') {
        window.updateTestDuration(duration);
    }
}

function applyDifficulty(difficulty) {
    if (typeof window.setDifficulty === 'function') {
        window.setDifficulty(difficulty);
    }
}

function loadSettings() {
    const savedDuration = localStorage.getItem('testDuration');
    if (savedDuration) {
        const time = parseInt(savedDuration);
        if (!isNaN(time) && time > 0) {
            const timeOptions = document.querySelectorAll('.setting-group:nth-child(1) .setting-option');
            timeOptions.forEach(btn => {
                const btnText = btn.textContent;
                const btnTime = parseInt(btnText);
                if (!isNaN(btnTime) && btnTime === time) {
                    btn.classList.add('active');
                }
            });
            
            applyTestDuration(time);
        }
    }
    
    // Загружаем сложность
    const savedDifficulty = localStorage.getItem('difficulty');
    if (savedDifficulty) {
        const difficultyOptions = document.querySelectorAll('.setting-group:nth-child(2) .setting-option');
        difficultyOptions.forEach(btn => {
            if (btn.textContent.toLowerCase() === savedDifficulty) {
                btn.classList.add('active');
            }
        });
        
        applyDifficulty(savedDifficulty);
    }
    
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(btn => {
            if (btn.getAttribute('data-color') === savedColor) {
                btn.classList.add('active');
            }
        });
        
        if (typeof window.changeThemeColor === 'function') {
            window.changeThemeColor(savedColor);
        }
    }
}

function resetToDefaultSettings() {
    const defaultDuration = 60;
    localStorage.setItem('testDuration', defaultDuration);
    
    const timeOptions = document.querySelectorAll('.setting-group:nth-child(1) .setting-option');
    timeOptions.forEach(btn => {
        if (btn.textContent === '60 сек') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    applyTestDuration(defaultDuration);
    
    const defaultDifficulty = 'легкая';
    localStorage.setItem('difficulty', defaultDifficulty);
    
    const difficultyOptions = document.querySelectorAll('.setting-group:nth-child(2) .setting-option');
    difficultyOptions.forEach(btn => {
        if (btn.textContent.toLowerCase() === defaultDifficulty) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    applyDifficulty(defaultDifficulty);
    
    const defaultColor = 'orange';
    localStorage.setItem('themeColor', defaultColor);
    
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach((btn, index) => {
        if (index === 0) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    if (typeof window.changeThemeColor === 'function') {
        window.changeThemeColor(defaultColor);
    }
    
    localStorage.setItem('soundEnabled', 'true');
    const soundSwitch = document.querySelector('.switch input');
    if (soundSwitch) {
        soundSwitch.checked = true;
    }
    
    alert('Настройки сброшены к стандартным!');
}

window.initSettings = initSettings;