const debug = false;

function sendMessageToContentScript(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "toggleState") {
        chrome.storage.sync.set({'extensionEnabled': request.enabled});
        sendMessageToContentScript({type: "toggleState", enabled: request.enabled});
        if (debug) console.log('background: Extension state changed to', request.enabled);
    } else if (request.type === "changeMask") {
        chrome.storage.sync.set({'currentMaskId': request.maskId});
        chrome.storage.sync.set({'currentMaskArgs': request.args});
        chrome.storage.sync.set({'selectedMaskGridID': request.gridId});
        sendMessageToContentScript({type: "changeMask", maskId: request.maskId, args: request.args});
        if (debug) console.log('background: Mask changed to', request.gridId, request.maskId, request.args);
    }
});


// Inject MediaPipe !!!
async function injectMediaPipe(lib_url, models_url, debug=false) {
    if (debug) console.log('Trying to inject MediaPipe');
    let MediaPipeModule = await import(lib_url + '/vision_bundle.js');
    const VisionPathResolver = await MediaPipeModule.FilesetResolver.forVisionTasks(lib_url + "/wasm");

    window.models = {};
    window.models['faceLandmarker'] = await MediaPipeModule.FaceLandmarker.createFromOptions(
        VisionPathResolver,
        {
            baseOptions: {
                modelAssetPath: models_url + '/face_landmarker.task'
            } ,
        runningMode: "IMAGE",
        numFaces: 4,
    });
    window.models['faceDetector'] = await MediaPipeModule.FaceDetector.createFromOptions(
        VisionPathResolver,
        {
            baseOptions: {
                modelAssetPath: models_url + '/blaze_face_short_range.tflite'
            },
            runningMode: "IMAGE",
            minDetectionConfidence: 0.5
        }
    );
    
    if (debug) console.log('MediaPipe is sucsesfully loaded.');
    window.postMessage({ type: 'faceLandmarkerReady'}, '*');

    // Add even listener to communicate with the content script
    document.addEventListener('runMediaPipe', async (e) => {
        let results = null;

        if (!window.models[e.detail.model_name] || !e.detail.video_class) {
            if (debug) console.error('webpage: MediaPipe or video element not found.');
        } else {
            try {
                const video = document.getElementById(e.detail.video_class).querySelector('video');
                if (debug) console.log('Running MediaPipe model');
                results = await window.models[e.detail.model_name].detect(video);
            } catch (error) {
                if (debug) console.error('Error running faceLandmarker:', error);
            }
        }

        window.postMessage({ type: 'mediaPipeResults', data: results }, '*');
    });
};


let injectedTabs = {};
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        injectedTabs[tabId] = true;
        lib_url = chrome.runtime.getURL("src/thirdparty/mediapipe/task_vision");
        models_url = chrome.runtime.getURL("data/models/");

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            world: 'MAIN',
            func: injectMediaPipe,
            args: [lib_url, models_url, debug]
        }).then(() => {
            if (debug) console.log('background: Library injected successfully.');
        }).catch(err => {
            if (debug) console.error('background: Failed to inject library:', err);
        });
    }
});

chrome.tabs.onRemoved.addListener(function(tabId) {
    delete injectedTabs[tabId]; // Clear record when tab is closed
});
