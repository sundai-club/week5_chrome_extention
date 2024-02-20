const debug = true;

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



// Inject the libraries
function injectedFunction(extensionId) {

    window.libsInjected = false;
    if(!window.libsInjected) {
        window.libsInjected = false;
        if (debug) console.log('Injecting the libraries');

        lib_url = chrome.runtime.getURL("src/thirdparty/mediapipe/face_mesh");
        var a = document.createElement('script');
        a.setAttribute('src', lib_url + "/face_mesh.js");
        a.setAttribute('data-runtime-id', `${extensionId}`);
        document.body.appendChild(a);

        if (debug) console.log('Libraries injected');
        window.libsInjected = true;
    } else {
        if (debug) console.log('Libs were already injected here');
    }
}

chrome.action.onClicked.addListener(function (tab) {
    if(!tab.id) {
        if (debug) console.log('Background injector: No tab found');
        return;
    }

    chrome.scripting.executeScript({
        target: {
            tabId: tab.id,
        },
        world: 'MAIN',
        func: injectLibs,
        args: [chrome.runtime.id]
    });
});
