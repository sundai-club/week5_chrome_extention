document.addEventListener('DOMContentLoaded', function() {
    const maskOptions = [
        'images/filters_images/mask1.png', 
        'images/filters_images/mask1.png', 
        'images/filters_images/mask1.png',
        // Add paths to your mask images
    ];

    const masksGrid = document.querySelector('.masks-grid');
    maskOptions.forEach(mask => {
        const maskItem = document.createElement('div');
        maskItem.classList.add('mask-item');
        const img = document.createElement('img');
        img.src = mask;
        maskItem.appendChild(img);
        masksGrid.appendChild(maskItem);
    });

    const toggle = document.getElementById('extensionToggle');
    toggle.addEventListener('click', function() {
        this.classList.toggle('on');
        const isEnabled = this.classList.contains('on');
        console.log('Extension ' + (isEnabled ? 'enabled' : 'disabled'));
        this.querySelector('.toggle-label').textContent = isEnabled ? 'ON' : 'OFF';
        chrome.storage.sync.set({'extensionEnabled': isEnabled}); // Save state
    });
});


chrome.storage.sync.get('defaults', defaults => {
    main(defaults.defaults);
});


async function main(defaults) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const videoList = [];
    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
        if (request.greeting === "videos") {
            sendResponse({ greeting: 'success' });
            if(request.videos.length > 0) {
                videoList.push(...request.videos);
            }
        } else {
            sendResponse({ greeting: 'failure' });
        }
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        function: () => {
            function mapVid(vid, index) {
                return vid;
            }
            const vids = Array.from(document.querySelectorAll("video")).map(mapVid);
            chrome.runtime.sendMessage({ greeting: "videos", videos: vids });
        },
    }, _ => !chrome.runtime.lastError || console.log("Error(getVids):", chrome.runtime.lastError));

    // Wait to find videos before informing the user
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (videoList.length === 0) {
        // TODO: display it in the popup
        console.log("No videos found on the page.");
    }

    function addVideoEffects() {
        // Update each video
        let maskFunctionIdx = 0;
        let extensionEnabled = document.getElementById('extensionToggle').classList.contains('on');

        chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            function: videoProcessingFunction, // Defined outside to keep this cleaner
            args: [extensionEnabled, maskFunctionIdx], // Pass maskIndex and extensionEnabled as arguments
        }, _ => !chrome.runtime.lastError || console.log("Error(getVids):", chrome.runtime.lastError));

        requestAnimationFrame(addVideoEffects);
    }

    requestAnimationFrame(addVideoEffects);
}


function videoProcessingFunction(extensionEnabled, maskFunctionIdx) {

    // 0. Define helper functions
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

    // 1. Define all masks here
    function computeFrameMask1(video, canvas) {
        setCanvasSize(canvas, video);
        const width = canvas.width;
        const height = canvas.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(video, 0, 0, width, height);
        const frame = ctx.getImageData(0, 0, width, height);
        const data = frame.data;

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 1] > 100 && data[i] > 100 && data[i + 2] > 100) {
                data[i] = data[i + 1] = data[i + 2] = 0;
            } else {
                data[i + 3] = 0; // Set alpha to 0
            }
        }
        ctx.putImageData(frame, 0, 0);
    }
    
    let maskFuntions = [computeFrameMask1];

    // 2. Process each video
    document.querySelectorAll('video').forEach(processOneVideo);

    function processOneVideo(video) {
        let canvas = null;

        // 2.1 Delete or create canvas if video is present
        let canvasContainer = video.parentNode;
        if (extensionEnabled) {
            if (!canvasContainer || !canvasContainer.classList.contains('video-canvas-container')) {
                // Create a canvas and overlay it on the video
                console.log("Extension is enabled. Setting up canvas");

                container = document.createElement('div');
                container.className = 'video-canvas-container';
                video.parentNode.insertBefore(container, video);
                container.appendChild(video);

                container.style.position = 'relative';
                container.style.display = 'inline-block';

                canvas = document.createElement('canvas');
                canvas.style.position = 'absolute';
                canvas.style.left = '0';
                canvas.style.top = '0';
                canvas.style.pointerEvents = 'none';
                container.appendChild(canvas);

            } else {
                // Canvas already exists
                canvas = canvasContainer.querySelector('canvas');
            }
            // 2.2 Apply effect only if the video is playing
            if (!video.paused && !video.ended) {
                requestAnimationFrame(() => maskFuntions[maskFunctionIdx](video, canvas));
            }
        } else if (canvasContainer && canvasContainer.classList.contains('video-canvas-container')) {
            // Remove the canvas container if the extension is disabled
            console.log("Extension is disabled. Cleaning canvas");
            canvasContainer.parentNode.appendChild(video);
            canvasContainer.remove();
        }
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.hasOwnProperty('extensionEnabled')) {
        updateExtensionState(request.extensionEnabled);
    }
});
