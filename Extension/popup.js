let extensionEnabled = false;

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
        // Optionally, send a message to content script to enable/disable functionality
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {enabled: isEnabled});
        });

        extensionEnabled = isEnabled;
    });
});

function applyMask(video, canvas, maskIndex) {
    const masks = [
        computeFrameMask1,
        computeFrameMask2,
        computeFrameMask3,
        // Define additional mask functions as needed
    ];

    if (maskIndex >= 0 && maskIndex < masks.length) {
        masks[maskIndex](video, canvas); // Call the selected mask function
    }
}

// Example mask function
function computeFrameMask1(video, canvas) {
    width = video.videoWidth / 2;
    height = video.videoHeight / 2;
    ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    frame = ctx.getImageData(0, 0, width, height);
    const data = frame.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i + 0];
        const green = data[i + 1];
        const blue = data[i + 2];
        if (green > 100 && red > 100 && blue > 100) {
            data[i + 0] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;

        }
    }
    ctx.putImageData(frame, 0, 0);
}

// Example mask function
function computeFrameMask2(video, canvas) {
    return computeFrameMask1(video, canvas);
}

function computeFrameMask3(video, canvas) {
    return computeFrameMask1(video, canvas);
}

async function main(defaults) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    let extensionEnabled = true; // Default to true, but you should load this from storage
    chrome.storage.sync.get('extensionEnabled', function(data) {
        extensionEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true;
    });

    let maskIndex = 0;

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
        function: videoProcessingFunction, // Defined outside to keep this cleaner
        args: [maskIndex, extensionEnabled], // Pass maskIndex and extensionEnabled as arguments
    }, _ => !chrome.runtime.lastError || console.log("Error(getVids):", chrome.runtime.lastError));

    // Wait to find videos before informing the user
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (videoList.length === 0) {
        // videosListEl.classList.add("noVidsFound");
        // videosListEl.innerHTML = `No videos found on page! <br> If there is one, use the feedback button on the options page!`;
    }
}

chrome.storage.sync.get('defaults', defaults => {
    main(defaults.defaults);
});


function videoProcessingFunction(maskIndex) {
    chrome.storage.sync.get('extensionEnabled', function(data) {
        const extensionEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true;
        updateExtensionState(extensionEnabled); // Enable functionality
    });

    function updateExtensionState(isEnabled) {
        extensionEnabled = isEnabled;
        document.querySelectorAll('video').forEach(video => {
            let canvasContainer = video.nextElementSibling;
            if (isEnabled) {
                if (!canvasContainer || !canvasContainer.classList.contains('video-canvas-container')) {
                    console.log("Extension is enabled. Setting up...");
                    const canvas = overlayCanvasOnVideo(video);
                    applyEffectToCanvas(canvas, maskIndex);
                }
            } else if (canvasContainer && canvasContainer.classList.contains('video-canvas-container')) {
                console.log("Extension is disabled.");
                canvasContainer.remove(); // Remove the canvas container if the extension is disabled
            }
        });
    }

    function overlayCanvasOnVideo(video) {
        let container = video.closest('.video-canvas-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'video-canvas-container';
            video.parentNode.insertBefore(container, video);
            container.appendChild(video);
        }

        container.style.position = 'relative';
        container.style.display = 'inline-block';

        let canvas = document.createElement('canvas');
        canvas.width = video.videoWidth / 2;
        canvas.height = video.videoHeight / 2;
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.pointerEvents = 'none';
        container.appendChild(canvas);

        return canvas;
    }

    function applyEffectToCanvas(canvas, maskIndex) {
        const ctx = canvas.getContext('2d');
        const video = canvas.parentNode.querySelector('video');

        // video.addEventListener('play', function() {
            
        // });
        drawVideoWithEffect(video, canvas, ctx, maskIndex);
    }

    function drawVideoWithEffect(video, canvas, ctx, maskIndex) {
        if (video.paused || video.ended) return;

        console.log(extensionEnabled);
        if (!extensionEnabled) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        } else {
            console.log("Yo, I am here too!");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Example effect: adjust brightness based on maskIndex
            // More complex effects and masks can be applied here based on actual use cases
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                // Simple brightness effect
                // data[i] = data[i] * (1 + maskIndex * 0.1); // Red
                // data[i + 1] = data[i + 1] * (1 + maskIndex * 0.1); // Green
                // data[i + 2] = data[i + 2] * (1 + maskIndex * 0.1); // Blue

                const red = data[i + 0];
                const green = data[i + 1];
                const blue = data[i + 2];
                if (green > 100 && red > 100 && blue > 100) {
                    data[i + 0] = 0;
                    data[i + 1] = 0;
                    data[i + 2] = 0;

                }
            }
            ctx.putImageData(imageData, 0, 0);
        }
        requestAnimationFrame(() => drawVideoWithEffect(video, canvas, ctx, maskIndex));
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.hasOwnProperty('extensionEnabled')) {
        updateExtensionState(request.extensionEnabled);
    }
});
