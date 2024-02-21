LEFT_EYE_IDX = 468;
RIGHT_EYE_IDX = 473;
NOSE_IDX = 4;
MOUTH_IDX = 14;

async function baseFaceFilter(video, canvas, callback, callback_args) {
    // It has to be a non-blocking promise to not spam the requests
    return new Promise((resolve, reject) => {
        // Set up randomized class name
        const class_name = `to-detect-${Math.random().toString(36).substring(7)}`;
        video.classList.add(class_name);

        // Event listener to handle faceLandmarker results
        const handleResults = (event) => {
            if (event.source === window && event.data.type === 'faceLandmarkerResults') {
                if (debug) console.log('content: Received faceLandmarker results', event.data.data);
                callback(video, canvas, event.data.data, callback_args);
                video.classList.remove(class_name); // Clean up: remove class name
                window.removeEventListener('message', handleResults); // Remove event listener to avoid leaks
                resolve(); // Resolve the promise
            }
        };

        window.addEventListener('message', handleResults);

        // Dispatch event to request faceLandmarker processing
        const event = new CustomEvent('runFaceLandmarker', { detail: { video_class: class_name } });
        document.dispatchEvent(event);
        if (debug) console.log('content: faceLandmarker event dispatched');
    });
}

async function drawLandmarks(video, canvas, callback_args) {
    function callback(video, canvas, results, {color="red"} = {}) {
        function connect_two_idxs(ctx, pt1, pt2, landmarks) {
            ctx.beginPath();
            ctx.moveTo(landmarks[pt1].x * canvas.width, landmarks[pt1].y * canvas.height);
            ctx.lineTo(landmarks[pt2].x * canvas.width, landmarks[pt2].y * canvas.height);
            ctx.stroke();
        }

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        for (let i = 0; i < results.faceLandmarks.length; i++) {
            connect_two_idxs(ctx, LEFT_EYE_IDX, NOSE_IDX, results.faceLandmarks[i]);
            connect_two_idxs(ctx, RIGHT_EYE_IDX, NOSE_IDX, results.faceLandmarks[i]);
            connect_two_idxs(ctx, NOSE_IDX, MOUTH_IDX, results.faceLandmarks[i]);
        }
    }
    
    await baseFaceFilter(video, canvas, callback, callback_args);
}