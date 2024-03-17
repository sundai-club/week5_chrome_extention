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

function setCanvasSize(canvas, video, maxWidth = 1200) {
    // Ensure the video's metadata is loaded to get its natural dimensions
    const videoAspectRatio = video.videoWidth / video.videoHeight;

    // Initialize canvas dimensions to the video's intrinsic dimensions
    let canvasWidth = video.videoWidth;
    let canvasHeight = video.videoHeight;

    const videoRect = video.getBoundingClientRect();

    // Scale down if the video width is greater than maxWidth, maintaining aspect ratio
    if (canvasWidth > maxWidth) {
        canvasWidth = maxWidth;
        canvasHeight = maxWidth / videoAspectRatio;
    }

    // Set the canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const scaleRatio = video.offsetWidth / canvasWidth;

    // Calculate the offsets if the video is centered within its container
    // const container = video.parentElement;
    // const offsetX = (videoRect.width - canvasWidth) / 2;
    // const offsetY = (videoRect.height - canvasHeight) / 2;

    // Apply the calculated offsets and scale to the canvas
    canvas.style.position = 'absolute';
    canvas.style.top = `${video.offsetTop}px`; // + verticalOffset
    canvas.style.left = `${video.offsetLeft}px`; // + horizontalOffset
    canvas.style.transform = `scale(${scaleRatio})`;
    canvas.style.transformOrigin = 'top left';
    
    // Set the canvas visual dimensions to match the video
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
}