if (debug) console.log("contentScript.js is running");

let MEDIA_PIPE_LOADED = false;
let faceLandmarker = null;

// 1. Set up the global variables
let extensionEnabled = false;
let currentMaskFunctionId = "default";
let currentMaskArgs = {};

chrome.storage.sync.get(['extensionEnabled', 'currentMaskId', 'currentMaskArgs'], (result) => {
    extensionEnabled = result.extensionEnabled || false;
    currentMaskFunctionId = result.currentMaskId || "default";
    currentMaskArgs = result.currentMaskArgs || {};
});

// 2. Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "toggleState") {
        extensionEnabled = request.enabled;
        if (debug) console.log('content: Extension state changed to', extensionEnabled);
    } else if (request.type === "changeMask") {
        currentMaskFunctionId = request.maskId;
        currentMaskArgs = request.args;
        if (debug) console.log('content: Mask changed to', request.maskId);
    }
});

// 3. Listen for messages from the webpage (to use MediaPipe)
window.addEventListener('message', (event) => {
    if (event.source === window && event.data.type === 'faceLandmarkerReady') {
        console.log('Received faceLandmarkerReady');
        MEDIA_PIPE_LOADED = true;
    }
});

// 4. Process each video
let canvas = null;
function processOneVideo(video) {
    // 3.1 Delete or create canvas if video is present
    let canvasContainer = video.parentNode;
    if (extensionEnabled) {
        if (!canvasContainer || !canvasContainer.classList.contains('video-canvas-container')) {
            // Create a canvas and overlay it on the video
            if (debug) console.log("Extension is enabled. Setting up canvas");

            container = document.createElement('div');
            container.className = 'video-canvas-container';
            video.parentNode.insertBefore(container, video);
            container.appendChild(video);

            container.style.position = 'relative';
            container.style.width = '100%'; // Take full width of the original video space
            container.style.height = '100%';

            canvas = document.createElement('canvas');
            canvas.style.position = 'absolute';
            canvas.style.left = '0';
            canvas.style.top = '0';
            canvas.style.width = '100%'; // Ensure it scales with the container
            canvas.style.height = '100%'; // Match the video height within the container
            canvas.style.pointerEvents = 'none'; // Make sure it doesn't block interactions
            container.appendChild(canvas);
        } else {
            // Canvas already exists
            canvas = canvasContainer.querySelector('canvas');
        }
        // 3.2 Apply effect only if the video is playing
        if (!video.paused && !video.ended) {
            requestAnimationFrame(() => {
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                maskFuntions[currentMaskFunctionId](video, canvas, ctx, currentMaskArgs);
            });
        }
    } else if (canvasContainer && canvasContainer.classList.contains('video-canvas-container')) {
        // Remove the canvas container if the extension is disabled
        if (debug) console.log("Extension is disabled. Cleaning canvas");
        canvasContainer.parentNode.appendChild(video);
        canvasContainer.remove();
    }
}


function videoUpdateLoop() {
    let FPS_LIMIT = 60;
    document.querySelectorAll('video').forEach(processOneVideo);
    setTimeout(() => {
        requestAnimationFrame(videoUpdateLoop);
    }, 1000 / FPS_LIMIT);
}

window.addEventListener('load', function() {
    requestAnimationFrame(videoUpdateLoop);
});
