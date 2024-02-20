class Filter {
    constructor(name, image, funcName, args) {
        this.name = name;
        this.image = image;
        this.funcName = funcName;
        this.args = args;
    }
}

const filterGrid = [
    new Filter('None', 'empty.png', 'default', {}),
    new Filter('Grayscale', 'grayscale.png', 'grayscale', {}),
    new Filter('Invert Colors', 'invert.png', 'invertColors', {}),
    new Filter('Sepia', 'sepia.png', 'sepia', {}),
    new Filter('Comic Book', 'comic.png', 'comicBook', {}),
    new Filter('Vignette', 'vignette.png', 'vignette', {}),
    new Filter('Arnold Frame', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 1., 'maintain_aspect_ratio': false}),
    new Filter('Painting Frame', 'painting_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/painting.jpg'), 'scale': 1., 'maintain_aspect_ratio': false}),
    new Filter('Threshold 0', 'threshold.png', 'threshold', {"threshold": [50, 50, 50]}),
    new Filter('Threshold 1', 'threshold.png', 'threshold', {"threshold": [100, 100, 100]}),
    new Filter('Threshold 2', 'threshold.png', 'threshold', {"threshold": [150, 150, 150]}),
    new Filter('Threshold 3', 'threshold.png', 'threshold', {"threshold": [200, 200, 200]}),
    new Filter('Threshold 4', 'threshold.png', 'threshold', {"threshold": [250, 250, 250]}),
    new Filter('Arnold Frame 2', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 1., 'maintain_aspect_ratio': true}),
    new Filter('Arnold Frame 3', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 0.5, 'maintain_aspect_ratio': true}),
    new Filter('Arnold Frame 4', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 0.5, 'maintain_aspect_ratio': false, deleteWhite: false}),
]
