const debug = true;

// Load MediaPipe Vision
let MEDIA_PIPE_LOADED = false;

lib_url = chrome.runtime.getURL("src/thirdparty/mediapipe/face_mesh");
const script = document.createElement('script');
script.src = lib_url + "/face_mesh.js";
script.onload = function() {
    if (debug) console.log('MediaPipe loaded. Starting to load components.', script);

    facemesh = new FaceMesh({
        locateFile: (file) => `${lib_url}/${file}`
    });
    // set facemesh config
    facemesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    MEDIA_PIPE_LOADED = true;
    if (debug) console.log('MediaPipe components loaded.', facemesh);
};

(document.head || document.documentElement).appendChild(script);


// (async () => {
//     lib_url = chrome.runtime.getURL("src/thirdparty/mediapipe/face_mesh");
//     FaceMesh = await import(lib_url + "/face_mesh.js");

//     if (debug) console.log('MediaPipe loaded. Starting to load components.', FaceMesh);

//     facemesh = new FaceMesh({
//         locateFile: (file) => `${lib_url}/${file}`
//     });

//     // set facemesh config
//     facemesh.setOptions({
//         maxNumFaces: 1,
//         refineLandmarks: true,
//         minDetectionConfidence: 0.5,
//         minTrackingConfidence: 0.5,
//     });

//     MEDIA_PIPE_LOADED = true;
//     if (debug) console.log('MediaPipe components loaded.', facemesh);
// })();
