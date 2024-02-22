const debug = true;
const socket = io('https://sundai-socket-io.glitch.me/');

socket.on('connect', () => {
    console.log('Connected to the server');
    // Ready to receive messages
});
  
socket.on('new message', (msg) => {
    console.log('New message:', msg.message);

    const filter = filterGrid.find(f => f.name === msg.message);

    if (filter) {
        chrome.runtime.sendMessage({type: "changeMask", maskId: filter.funcName, args: filter.args});

        //selectedMask = document.querySelector('.selected');
        //if (selectedMask) {
        //    selectedMask.classList.remove('selected'); // Remove highlight from previously selected mask
        //}
        //maskItem.classList.add('selected'); // Highlight the new selection

        if (debug) console.log('popup: Mask changed to', filter.name);
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});

function selectFilter(funcName) {
    // Assuming each filter's DOM element has an ID or data attribute that matches the filter's funcName
    const filterElement = document.querySelector(`[data-func-name="${funcName}"]`);
    if (filterElement) {
        // If the filter element exists, simulate a click to select the filter
        filterElement.click();
        console.log(`Filter selected: ${funcName}`);
    } else {
        console.log(`No filter element found for ${funcName}`);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Init the state of the popup: toggle button
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

    // Construct the masks grid
    const masksGridcontainer = document.querySelector('.masks-grid');
    filterGrid.forEach((filter, idx) => {
        mask_id = "mask_" + idx;
        const maskItem = document.createElement('div');

        // Add the mask image
        maskItem.classList.add('mask-item');
        maskItem.id = mask_id;
        const img = document.createElement('img');
        img.src = "data/filter_icons/" + filter.image;
        maskItem.appendChild(img);

        // Add a name under
        const name = document.createElement('div');
        name.classList.add('mask-name');
        name.textContent = filter.name;
        maskItem.appendChild(name);

        masksGridcontainer.appendChild(maskItem);

        // Add event listener to change the mask
        maskItem.addEventListener('click', function() {
            chrome.runtime.sendMessage({type: "changeMask", maskId: filter.funcName, args: filter.args, gridId: this.id});

            selectedMask = document.querySelector('.selected');
            if (selectedMask) {
                selectedMask.classList.remove('selected'); // Remove highlight from previously selected mask
            }
            maskItem.classList.add('selected'); // Highlight the new selection

            if (debug) console.log('popup: Mask changed to', filter.name);
        });
    });

    chrome.storage.sync.get( 'selectedMaskGridID', function(data) {
        selectedMaskGridID = data.selectedMaskGridID;
        if (selectedMaskGridID) {
            const selectedMask = document.getElementById(selectedMaskGridID);
            if (selectedMask) {
                selectedMask.classList.add('selected');
            }
        }
    });

    // Add event listeners to update the logic accordingly
    const toggle = document.getElementById('extensionToggle');
    toggle.addEventListener('click', function() {
        const isEnabled = this.classList.toggle('on');
        chrome.runtime.sendMessage({type: "toggleState", enabled: isEnabled});
        if (debug) console.log('popup: Extension state changed to', isEnabled);
    });
});