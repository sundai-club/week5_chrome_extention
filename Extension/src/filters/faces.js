LEFT_EYE_IDX = 468;
RIGHT_EYE_IDX = 473;
NOSE_IDX = 4;
MOUTH_IDX = 14;

async function baseFaceFilter(model_name, video, canvas, ctx, callback, callback_args) {
    if (!MEDIA_PIPE_LOADED) return;

    // It has to be a non-blocking promise to not spam the requests
    return new Promise((resolve, reject) => {
        // Set up randomized class name so that the webpage knows which video to process
        const class_name = `to-detect-${Math.random().toString(36).substring(7)}`;
        video.parentNode.id = class_name;

        // Event listener to handle faceLandmarker results
        const handleResults = (event) => {
            if (event.source === window && event.data.type === 'mediaPipeResults') {
                if (debug) console.log('content: Received faceLandmarker results', event.data.data);
                
                setCanvasSize(canvas, video);
                callback(video, canvas, ctx, event.data.data, callback_args);
                
                video.parentNode.id = ''; // Clean up: remove class name
                window.removeEventListener('message', handleResults); // Remove event listener to avoid leaks
                if (debug) console.log('content: promise released');
                resolve(); // Resolve the promise
            }
        };

        window.addEventListener('message', handleResults);

        // Dispatch event to request faceLandmarker processing
        const event = new CustomEvent('runMediaPipe', { detail: { video_class: class_name, model_name: model_name} });
        document.dispatchEvent(event);
        if (debug) console.log('content: faceLandmarker event dispatched');
    });
}

async function landmarkDetectorDemo(video, canvas, ctx, callback_args) {
    function callback(video, canvas, ctx, results, {color="red"} = {}) {
        if (results == null) return;
        function connect_two_idxs(ctx, pt1, pt2, landmarks) {
            ctx.beginPath();
            ctx.moveTo(landmarks[pt1].x * canvas.width, landmarks[pt1].y * canvas.height);
            ctx.lineTo(landmarks[pt2].x * canvas.width, landmarks[pt2].y * canvas.height);
            ctx.stroke();
        }

        ctx.lineWidth = 2;
        for (let i = 0; i < results.faceLandmarks.length; i++) {
            ctx.strokeStyle = color;
            connect_two_idxs(ctx, LEFT_EYE_IDX, NOSE_IDX, results.faceLandmarks[i]);
            connect_two_idxs(ctx, RIGHT_EYE_IDX, NOSE_IDX, results.faceLandmarks[i]);
            ctx.strokeStyle = "green";
            connect_two_idxs(ctx, NOSE_IDX, MOUTH_IDX, results.faceLandmarks[i]);
        }
    }
    
    await baseFaceFilter("faceLandmarker", video, canvas, ctx, callback, callback_args);
}


async function faceDetectorDemo(video, canvas, ctx, callback_args) {
    function callback(video, canvas, ctx, results, {color="red"} = {}) {
        if (results == null) return;
        function connect_two_idxs(ctx, pt1, pt2) {
            ctx.beginPath();
            ctx.moveTo(pt1.x * canvas.width, pt1.y * canvas.height);
            ctx.lineTo(pt2.x * canvas.width, pt2.y * canvas.height);
            ctx.stroke();
        }

        ctx.lineWidth = 2;
        for (let i = 0; i < results.detections.length; i++) {
            ctx.strokeStyle = color;
            dpp = results.detections[i].keypoints
            connect_two_idxs(ctx, dpp[0], dpp[2]);
            connect_two_idxs(ctx, dpp[1], dpp[2]);
            ctx.strokeStyle = "green";
            connect_two_idxs(ctx, dpp[3], dpp[2]);
        }
    }
    
    await baseFaceFilter("faceDetector", video, canvas, ctx, callback, callback_args);
}

async function faceDistortion(video, canvas, ctx, callback_args) {
    function callback(video, canvas, ctx, results, {center_point=2, effectRadius=0.2, distortion_kwargs={}} = {}) {
        if (results == null) return;

        scales = results.faceLandmarks.map(detection => {
            let scale = Math.sqrt(   (detection[MOUTH_IDX].x - detection[NOSE_IDX].x)**2 +
                                    (detection[MOUTH_IDX].y - detection[NOSE_IDX].y)**2 );
            return scale;
        });
        
        distortion_centers = results.faceLandmarks.map((face, idx) => {
            return {
                x: face[center_point].x,
                y: face[center_point].y,
                radius: scales[idx] * effectRadius
            };
        });
        centralDistortionFilter(video, canvas, ctx, {...distortion_kwargs, centers: distortion_centers});
    }

    await baseFaceFilter("faceLandmarker", video, canvas, ctx, callback, callback_args);
}