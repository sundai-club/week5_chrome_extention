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
