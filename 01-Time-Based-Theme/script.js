function updateThemeAndClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const greetingElement = document.getElementById('greeting');
    const clockElement = document.getElementById('clock');
    const body = document.body;

    // Determine Theme
    let themeClass = '';
    let greetingText = '';

    if (hours >= 6 && hours < 12) {
        themeClass = 'morning';
        greetingText = 'Good Morning';
    } else if (hours >= 12 && hours < 17) {
        themeClass = 'afternoon';
        greetingText = 'Good Afternoon';
    } else if (hours >= 17 && hours < 20) {
        themeClass = 'evening';
        greetingText = 'Good Evening';
    } else {
        themeClass = 'night';
        greetingText = 'Good Night';
    }

    // Apply Theme if changed
    if (body.className !== themeClass) {
        body.className = themeClass;
        greetingElement.textContent = greetingText;
    }

    // Update Clock
    const timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    clockElement.textContent = timeString;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

// Initial call
updateThemeAndClock();

// Update every second
setInterval(updateThemeAndClock, 1000);
