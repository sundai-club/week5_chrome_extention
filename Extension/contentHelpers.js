const debug = true;



async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

let cachedImage = null;
let cachedImageId = null;
async function getCachedImage(imageUrl) {
    if (!cachedImage || cachedImageId !== imageUrl) {
        cachedImage = await loadImage(imageUrl).catch(console.error);
    }
    cachedImageId = imageUrl;
    return cachedImage;
}

function setCanvasSize(canvas, video, maxWidth=800) {
    // Ensure the video's metadata is loaded to get its natural dimensions
    if (video.readyState >= 1) {
        resizeCanvas(); // Video metadata is ready, resize immediately
    } else {
        video.addEventListener('loadedmetadata', resizeCanvas); // Wait for metadata
    }

    function resizeCanvas() {
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        let canvasWidth = video.videoWidth;
        let canvasHeight = video.videoHeight;

        // Scale down if the video width is greater than maxWidth, maintaining aspect ratio
        if (canvasWidth > maxWidth) {
            canvasWidth = maxWidth;
            canvasHeight = maxWidth / videoAspectRatio;
        }

        // Set the canvas dimensions
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Use CSS to visually scale the canvas to match the video's offsetWidth
        const scaleRatio = video.offsetWidth / canvasWidth;
        canvas.style.transform = `scale(${scaleRatio})`;
        canvas.style.transformOrigin = 'top left';

        // Adjust the canvas container size if necessary to fit the scaled canvas
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
    }
}