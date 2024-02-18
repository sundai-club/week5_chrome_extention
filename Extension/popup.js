document.addEventListener('DOMContentLoaded', function() {
    const maskOptions = [
        'mask1.png', 'mask2.png', 'mask3.png',
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
        if(this.classList.contains('on')) {
            console.log('Extension enabled');
            this.querySelector('.toggle-label').textContent = 'ON';
            // Implement enabling logic
        } else {
            console.log('Extension disabled');
            this.querySelector('.toggle-label').textContent = 'OFF';
            // Implement disabling logic
        }
    });

});

async function main(defaults) {
    const videosListEl = document.getElementById("videosList");
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const vidMap = {}; // index: { localindex, parsedFilter, playbackRate, windowUri }
    const videoList = []; // accumulator for videos from all frames
    const vidQueue = [];
    let vidCounter = 0;
    let addVideoRunning = false;

    chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
        if (request.greeting === "videos") {
            sendResponse({ greeting: 'success' });
            if(request.videos.length > 0) {
                videoList.push(...request.videos);
                vidQueue.push(...request.videos);
            };
        } else {
            sendResponse({ greeting: 'failure' });
        }
    });

    chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        function: () => {
            function mapVid(vid, index) {
                console.log("Adding new video: ", index, vid, { index: index, filter: vid.style.filter, playbackRate: vid.playbackRate, uri: window.location.href });

                // Create canvas
                function overlayCanvasOnVideo(video) {
                    // Check if the video already has a container
                    let container = video.closest('.video-canvas-container');
                    if (!container) {
                        // Create a container div and wrap the video inside it
                        container = document.createElement('div');
                        container.className = 'video-canvas-container';
                        video.parentNode.insertBefore(container, video);
                        container.appendChild(video);
                    }
                
                    // Set the container's CSS to position the video and canvas correctly
                    container.style.position = 'relative';
                    container.style.display = 'inline-block'; // Or 'block' depending on layout needs
                
                    // Create and set up the canvas element
                    let canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.style.position = 'absolute';
                    canvas.style.left = '0';
                    canvas.style.top = '0';
                    canvas.style.pointerEvents = 'none'; // Allows click events to pass through to the video
                
                    // Insert the canvas into the container, above the video
                    container.appendChild(canvas);
                
                    // Return the canvas for further use (e.g., drawing)
                    return canvas;
                }
                // canvas_child = document.createElement('div');
                // canvas_child.innerHTML = '<canvas id="c1" width="160" height="96"></canvas>';
                // vid.parentElement.appendChild(canvas_child);
                canvas = overlayCanvasOnVideo(vid);

                function timerCallback(video, canvas) {
                    if (video.paused || video.ended) {
                        return;
                    }
                    computeFrame(video, canvas);
                    setTimeout(() => {
                        timerCallback(video, canvas);
                    }, 0);
                };

                function computeFrame(video, canvas) {
                    // console.log("Yo");
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
                };

                // Update canvas
                vid.addEventListener(
                    "play",
                    () => {
                        timerCallback(vid, canvas);
                    },
                    false,
                );
                timerCallback(vid, canvas);
                
                return { index: index, filter: vid.style.filter, playbackRate: vid.playbackRate, uri: window.location.href };
            }
            const vids = Array.from(document.querySelectorAll("video")).map(mapVid);
            chrome.runtime.sendMessage({ greeting: "videos", videos: vids });
        },
    }, _ => !chrome.runtime.lastError || console.log("Error(getVids):", chrome.runtime.lastError));

    // give it time to find videos before telling user there aren't any
    await sleep(1000).then(() => {
        if (videoList.length === 0) {
            videosListEl.classList.add("noVidsFound");
            videosListEl.innerHTML = `No videos found on page! <br> If there is one, use the feedback button on the options page!`;
        }
    });
}


chrome.storage.sync.get('defaults', defaults => {
    main(defaults.defaults);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
