const pages = document.querySelectorAll('.page');

// Initialize z-indexes
// Stack order: Top page has highest z-index initially
// As they flip to left, the logic inverts for the left stack.
// But mostly we just need the "right side" stack to decrease in z-index from top to bottom.
pages.forEach((page, index) => {
    page.style.zIndex = pages.length - index;
});

pages.forEach((page, index) => {
    page.addEventListener('click', function () {
        if (this.classList.contains('flipped')) {
            // If already flipped, flip back (to right)
            this.classList.remove('flipped');
            // When returning to right stack, its z-index should be higher than the page below it
            this.style.zIndex = pages.length - index;
        } else {
            // Flip forward (to left)
            this.classList.add('flipped');
            // When moving to left stack, page 1 should be at bottom, page 2 on top of it.
            // Page 1 is index 0. Page 2 is index 1.
            // So on left, z-index should be proportional to index.
            this.style.zIndex = 20 + index; // Add base offset to ensure it sits on top of right stack if needed, though they are side-by-side
        }

        // Check if any page is flipped
        const isAnyPageFlipped = Array.from(pages).some(p => p.classList.contains('flipped'));
        const book = document.querySelector('.book');
        if (isAnyPageFlipped) {
            book.classList.add('opened');
        } else {
            book.classList.remove('opened');
        }
    });
});

// Reset Button Logic
const resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent bubbling to page click
        // Filter only pages that are currently flipped
        const flippedPages = Array.from(pages).filter(p => p.classList.contains('flipped'));

        // Reverse them to close from the last opened page backwards (optional visual preference),
        // or just close them. Since they are stacked, closing them all at once might look like a single block moving if not delayed. 
        // But the user asked for "smooth transition ... come back to 1st page".
        // Simply removing 'flipped' will trigger the CSS transition.

        flippedPages.reverse().forEach((page, i) => {
            // Optional: Add a small delay for a "card shuffle" close effect, or just close all.
            // Let's close all at once for a smooth "book closing" effect.
            // Actually, if we close all at once, z-index management is key.

            page.classList.remove('flipped');

            // We need to restore the z-index for the "right" stack.
            // The original logic was: page.style.zIndex = pages.length - index;
            // "index" here refers to the original index in the NodeList 'pages'.

            // We need to find the original index of this page.
            const originalIndex = Array.from(pages).indexOf(page);
            page.style.zIndex = pages.length - originalIndex;
        });

        // Also remove the .opened class from the book to center it back
        document.querySelector('.book').classList.remove('opened');
    });
}
