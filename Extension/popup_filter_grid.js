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
    new Filter('Face Detector Demo', 'face_detector.png', 'faceDetectorDemo', {}),
    new Filter('Landmark Detector Demo', 'landmark_detector.png', 'landmarkDetectorDemo', {}),
    new Filter('Grayscale', 'grayscale.png', 'grayscale', {}),
    new Filter('Invert Colors', 'invert.png', 'invertColors', {}),
    new Filter('Sepia', 'sepia.png', 'sepia', {}),
    new Filter('Comic Book', 'comic.png', 'comicBook', {}),
    new Filter('Vignette', 'vignette.png', 'vignette', {}),
    new Filter('Arnold Frame', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 1., 'maintain_aspect_ratio': false}),
    new Filter('Painting Frame', 'painting_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/painting.jpg'), 'scale': 1., 'maintain_aspect_ratio': false}),
    new Filter('Threshold', 'threshold.png', 'threshold', {"threshold": [50, 50, 50]}),
    new Filter('Dizzy', 'dizzy.png', 'wavy', {'dynamic': true, 'speed':1.0, 'amplitude': 1.0}),
    new Filter('Wavy', 'wavy.png', 'wavy', {'dynamic': false, 'amplitude': 2.0}),
    new Filter('Pixelate', 'pixelate.png', 'pixelation', {}),
    new Filter('Central Distortion', 'positive_central_distortion.png', 'centralDistortion', {'distortionStrength': 1, 'effectRadius':100}),
    new Filter('Central Distortion 2', 'negative_central_distortion.png', 'centralDistortion', {'distortionStrength': -1, 'effectRadius':100}),
    new Filter('Central Distortion 3', 'positive_central_distortion.png', 'centralDistortion', {'distortionStrength': 1, 'effectRadius':300}),
    new Filter('Central Distortion 4', 'negative_central_distortion.png', 'centralDistortion', {'distortionStrength': -1, 'effectRadius':300}),
    new Filter('Threshold 2', 'threshold.png', 'threshold', {"threshold": [100, 100, 100]}),
    new Filter('Threshold 3', 'threshold.png', 'threshold', {"threshold": [150, 150, 150]}),
    new Filter('Threshold 4', 'threshold.png', 'threshold', {"threshold": [200, 200, 200]}),
    new Filter('Threshold 5', 'threshold.png', 'threshold', {"threshold": [250, 250, 250]}),
    new Filter('Arnold Frame 2', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 1., 'maintain_aspect_ratio': true}),
    new Filter('Arnold Frame 3', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 0.5, 'maintain_aspect_ratio': true}),
    new Filter('Arnold Frame 4', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 0.5, 'maintain_aspect_ratio': false, deleteWhite: false}),
]
