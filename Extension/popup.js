const debug = true;

document.addEventListener('DOMContentLoaded', function() {
    // Init the state
    chrome.storage.sync.get('extensionEnabled', function(data) {
        const toggle = document.getElementById('extensionToggle');
        if (data.extensionEnabled) {
            toggle.classList.add('on');
            toggle.querySelector('.toggle-label').textContent = 'ON';
        } else {
            toggle.classList.remove('on');
            toggle.querySelector('.toggle-label').textContent = 'OFF';
        }
    });

    const maskOptions = [
        'images/filters_images/mask1.png', 
        'images/filters_images/mask1.png', 
        'images/filters_images/mask1.png',
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

    // Add event listeners to update the logic accordingly
    const toggle = document.getElementById('extensionToggle');
    toggle.addEventListener('click', function() {
        const isEnabled = this.classList.toggle('on');
        chrome.runtime.sendMessage({type: "toggleState", enabled: isEnabled});
        if (debug) console.log('popup: Extension state changed to', isEnabled);
    });
});