const debug = false;

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

// function setCanvasSize(canvas, video, maxWidth=1200) {
//     // Ensure the video's metadata is loaded to get its natural dimensions
//     if (video.readyState >= 1) {
//         resizeCanvas(); // Video metadata is ready, resize immediately
//     } else {
//         video.addEventListener('loadedmetadata', resizeCanvas); // Wait for metadata
//     }

//     function resizeCanvas() {
//         const videoAspectRatio = video.videoWidth / video.videoHeight;
//         let canvasWidth = video.videoWidth;
//         let canvasHeight = video.videoHeight;

//         // Scale down if the video width is greater than maxWidth, maintaining aspect ratio
//         if (canvasWidth > maxWidth) {
//             canvasWidth = maxWidth;
//             canvasHeight = maxWidth / videoAspectRatio;
//         }

//         // Set the canvas dimensions
//         canvas.width = canvasWidth;
//         canvas.height = canvasHeight;

//         // Use CSS to visually scale the canvas to match the video's offsetWidth
//         const scaleRatio = video.offsetWidth / canvasWidth;
//         canvas.style.transform = `scale(${scaleRatio})`;
//         canvas.style.transformOrigin = 'top left';

//         // Adjust the canvas container size if necessary to fit the scaled canvas
//         canvas.style.width = `${canvasWidth}px`;
//         canvas.style.height = `${canvasHeight}px`;

//         const video_position = getVideoPosition(video);
//         // console.log(video_position);
//         // canvas.style.top = video_position.top + 'px';
//         // canvas.style.left = video_position.left + 'px';
//     }

//     function getVideoPosition(video) {
//         // Get the container element, e.g., the video player
//         const container = video.parentElement;

//         // Calculate aspect ratios
//         const videoAspectRatio = video.videoWidth / video.videoHeight;
//         const containerAspectRatio = container.offsetWidth / container.offsetHeight;

//         // Calculate the video's displayed size
//         const scaleRatioWidth = video.offsetWidth / video.videoWidth;
//         const scaleRatioHeight = video.offsetHeight / video.videoHeight;

//         // Calculate offsets based on the aspect ratios
//         let horizontalOffset = 0;
//         let verticalOffset = 0;

//         if (videoAspectRatio < containerAspectRatio) {
//         // Video is pillarboxed (vertical video)
//         horizontalOffset = (container.offsetWidth - video.offsetWidth) / 2;
//         } else if (videoAspectRatio > containerAspectRatio) {
//         // Video is letterboxed (horizontal video)
//         verticalOffset = (container.offsetHeight - video.offsetHeight) / 2;
//         }

//         // Get the video element's position
//         const rect = video.getBoundingClientRect();

//         // The exact position of the video within the player
//         const videoPosition = {
//         top: rect.top + verticalOffset,
//         left: rect.left + horizontalOffset
//         };
//     }

// }

function setCanvasSize(canvas, video, maxWidth = 1200) {
    // Ensure the video's metadata is loaded to get its natural dimensions
    if (video.readyState >= 1) {
        resizeCanvas(); // Video metadata is ready, resize immediately
    } else {
        video.addEventListener('loadedmetadata', resizeCanvas); // Wait for metadata
    }

    function resizeCanvas() {
        // Get the aspect ratio of the video
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

        // Calculate the scale ratio based on the displayed size
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
}