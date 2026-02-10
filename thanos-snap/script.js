const snapBtn = document.getElementById('snap-btn');
const target = document.getElementById('target');
const container = document.querySelector('.container');

// Number of canvas layers (more = higher quality but slower)
const LAYER_COUNT = 32;

snapBtn.addEventListener('click', async () => {
    // Disable button to prevent double clicks
    snapBtn.disabled = true;
    snapBtn.innerText = "Snapping...";

    // 1. Capture the element as a canvas
    const canvas = await html2canvas(target, {
        backgroundColor: null
    });

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Get raw pixel data
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixelArr = imageData.data;

    // Create array of empty image data for each layer
    const layers = [];
    for (let i = 0; i < LAYER_COUNT; i++) {
        const c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        c.className = 'dust-layer';
        
        // Position exactly over the original element
        const rect = target.getBoundingClientRect();
        c.style.left = rect.left + 'px';
        c.style.top = rect.top + 'px';
        c.style.width = width + 'px'; // Ensure visual size matches
        c.style.height = height + 'px';
        c.style.transition = `opacity 1.5s ease-out`; // Fade out
        
        document.body.appendChild(c);
        
        layers.push({
            canvas: c,
            ctx: c.getContext('2d'),
            imageData: c.getContext('2d').createImageData(width, height)
        });
    }

    // 2. Distribute pixels to layers
    // We want a "weighted random" distribution to create clumping/drift
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            
            // Skip transparent pixels
            if (pixelArr[index + 3] === 0) continue;

            // Weighted random layers
            // Using logic to simulate disintegration from one side or random noise
            // Simpler approach: 2x Weighted probability
            const p = x / width; 
            // We want randomness but slight bias? Let's just do weighted noise
            // const layerIndex = Math.floor(LAYER_COUNT * (Math.random() + 2 * p) / 3);
            const layerIndex = Math.floor(Math.random() * LAYER_COUNT); // Pure random distribution works best for general "dust"
            
            const layer = layers[layerIndex];
            
            // Copy pixel data to specific layer
            layer.imageData.data[index] = pixelArr[index];         // R
            layer.imageData.data[index + 1] = pixelArr[index + 1]; // G
            layer.imageData.data[index + 2] = pixelArr[index + 2]; // B
            layer.imageData.data[index + 3] = pixelArr[index + 3]; // A
        }
    }

    // 3. Put data back into layer canvases
    layers.forEach(layer => {
        layer.ctx.putImageData(layer.imageData, 0, 0);
    });

    // 4. Hide original element immediately
    target.style.visibility = 'hidden';

    // 5. Animate layers
    // Each layer moves slightly differently (rotation + translation)
    layers.forEach((layer, i) => {
        // Calculate random movement vectors
        // Add some "drift" to the left/right and up
        const angle = (Math.random() - 0.5) * 2 * Math.PI;
        // Identify "speed" based on layer index to create parallax feel?
        // Or just random physics
        const tx = 60 * (Math.random() - 0.5); // Random spread X
        const ty = -100 * Math.random();      // Drift Up mostly
        const rot = 15 * (Math.random() - 0.5); // Slight rotation

        // Delay slightly based on index?
        // setTimeout(() => {
            // Use WAAPI (Web Animations API) for performance
            const keyframes = [
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, opacity: 0 }
            ];
            
            const timing = {
                duration: 1500 + Math.random() * 1000, // 1.5s - 2.5s duration
                easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
                fill: 'forwards'
            };
            
            const anim = layer.canvas.animate(keyframes, timing);
            
            anim.onfinish = () => {
                layer.canvas.remove();
            };
        // }, i * 10); // Slight stagger?
    });
    
    // Optional: Restore logic (reload page or button)
    setTimeout(() => {
        // document.location.reload(); 
    }, 3000);
});
