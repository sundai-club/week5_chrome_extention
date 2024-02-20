if (debug) console.log("contentScript.js is running");

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

// 3. Process each video

function processOneVideo(video) {

    // lib_url = chrome.runtime.getURL("src/thirdparty/mediapipe/face_mesh");
    // facemesh = new FaceMesh({
    //     locateFile: (file) => `${lib_url}/${file}`
    // });
    // // set facemesh config
    // facemesh.setOptions({
    //     maxNumFaces: 1,
    //     refineLandmarks: true,
    //     minDetectionConfidence: 0.5,
    //     minTrackingConfidence: 0.5,
    // });

    // MEDIA_PIPE_LOADED = true;
    // if (debug) console.log('MediaPipe components loaded.', facemesh);

    console.log('injected?', window.libsInjected)


    let canvas = null;

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
            requestAnimationFrame(() => maskFuntions[currentMaskFunctionId](video, canvas, currentMaskArgs));
        }
    } else if (canvasContainer && canvasContainer.classList.contains('video-canvas-container')) {
        // Remove the canvas container if the extension is disabled
        if (debug) console.log("Extension is disabled. Cleaning canvas");
        canvasContainer.parentNode.appendChild(video);
        canvasContainer.remove();
    }
}

function videoUpdateLoop() {
    document.querySelectorAll('video').forEach(processOneVideo);
    requestAnimationFrame(videoUpdateLoop); // Continue the loop
}

requestAnimationFrame(videoUpdateLoop); // Start the loop
