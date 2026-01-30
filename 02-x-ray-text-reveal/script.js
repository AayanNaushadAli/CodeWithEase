document.addEventListener('mousemove', (e) => {
    const textElement = document.querySelector('.x-ray-text');
    const rect = textElement.getBoundingClientRect();

    // Calculate position relative to the element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update CSS variables
    textElement.style.setProperty('--x', `${x}px`);
    textElement.style.setProperty('--y', `${y}px`);
});

// Add a touch move for mobile support
document.addEventListener('touchmove', (e) => {
    const textElement = document.querySelector('.x-ray-text');
    const rect = textElement.getBoundingClientRect();
    const touch = e.touches[0];

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    textElement.style.setProperty('--x', `${x}px`);
    textElement.style.setProperty('--y', `${y}px`);
});
