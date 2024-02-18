function injectedFunction(extensionId) {
    if(!window.injected) {
        if (window.trustedTypes && window.trustedTypes.createPolicy) { // Check if Trusted Types is supported
            window.policy = window.trustedTypes.createPolicy('myExtensionPolicy', {
                createScriptURL: (url) => url // Implement a policy for creating trusted script URLs
            });
        }
        
        console.log('Starting injection');
        var a = document.createElement('script');

        var trustedScriptURLA = window.policy.createScriptURL(`chrome-extension://${extensionId}/vendor/env.js`);
        a.setAttribute('src', trustedScriptURLA);
        a.setAttribute('data-become-waifu', "1");
        a.setAttribute('data-runtime-id', `${extensionId}`);
        console.log(`chrome-extension://${extensionId}/vendor/env.js`)
        document.body.appendChild(a);
        
        console.log('Looks like its injected');
        window.injected = true;
    } else {
        console.log('Can not inject');
    }
}

chrome.action.onClicked.addListener(function (tab) {
    if(!tab.id) {
        console.log('No tab id');
        return;
    }

    console.log('Initiating Injection');
    chrome.scripting.executeScript({
        target: {
        tabId: tab.id,
    },
    world: 'MAIN',
    func: injectedFunction,
    args: [chrome.runtime.id]
    });
});
