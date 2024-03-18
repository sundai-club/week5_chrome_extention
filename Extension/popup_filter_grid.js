LEFT_EYE_IDX = 468;
RIGHT_EYE_IDX = 473;
NOSE_IDX = 4;
MOUTH_IDX = 14;

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
    new Filter('Shuffle', 'shuffle.png', 'shuffle', {upd_time: 5, filters_to_choose: [
        new Filter('Tiny Face', 'Tiny Face.png', 'faceDistortion', {center_point: NOSE_IDX, effectRadius: 1, distortion_kwargs: {distortionStrength: 2}}),
        new Filter('Tiny Head', 'Tiny Head.png', 'faceDistortion', {center_point: NOSE_IDX, effectRadius: 2.4, distortion_kwargs: {distortionStrength: 1}}),
        new Filter('Big Head', 'Big Head.png', 'faceDistortion', {center_point: NOSE_IDX, effectRadius: 4.8, distortion_kwargs: {distortionStrength: -0.4}}),
        new Filter('Big Nose', 'Big Nose.png', 'faceDistortion', {center_point: NOSE_IDX, effectRadius: 1.2, distortion_kwargs: {distortionStrength: -1}}),
        new Filter('Big Mouth', 'Big Mouth.png', 'faceDistortion', {center_point: MOUTH_IDX, effectRadius: 1.2, distortion_kwargs: {distortionStrength: -1}}),
        new Filter('Tiny Mouth', 'Tiny Mouth.png', 'faceDistortion', {center_point: MOUTH_IDX, effectRadius: 1.2, distortion_kwargs: {distortionStrength: 1}}),
        new Filter('Dizzy', 'Dizzy.png', 'wavy', {dynamic: true, speed:1.0, amplitude: 1.0}),
        new Filter('Wavy', 'Wavy.png', 'wavy', {dynamic: false, amplitude: 2.0}),
        new Filter('Pixelate', 'Pixelate.png', 'pixelation', {}),
    ]}),
    new Filter('Grayscale', 'Grey Scale.png', 'grayscale', {}),
    new Filter('Invert Colors', 'Invert Colors.png', 'invertColors', {}),
    new Filter('Sepia', 'Sepia.png', 'sepia', {}),
    // new Filter('Comic Book', 'comic.png', 'comicBook', {}),

    new Filter('Tiny Face', 'Tiny Face.png', 'faceDistortion', {center_point: NOSE_IDX, effectRadius: 1, distortion_kwargs: {distortionStrength: 2}}),
    new Filter('Tiny Head', 'Tiny Head.png', 'faceDistortion', {center_point: NOSE_IDX, effectRadius: 2.4, distortion_kwargs: {distortionStrength: 1}}),
    new Filter('Big Head', 'Big Head.png', 'faceDistortion', {center_point: NOSE_IDX, effectRadius: 4.8, distortion_kwargs: {distortionStrength: -0.4}}),
    new Filter('Big Nose', 'Big Nose.png', 'faceDistortion', {center_point: NOSE_IDX, effectRadius: 1.2, distortion_kwargs: {distortionStrength: -1}}),
    new Filter('Big Mouth', 'Big Mouth.png', 'faceDistortion', {center_point: MOUTH_IDX, effectRadius: 1.2, distortion_kwargs: {distortionStrength: -1}}),
    new Filter('Tiny Mouth', 'Tiny Mouth.png', 'faceDistortion', {center_point: MOUTH_IDX, effectRadius: 1.2, distortion_kwargs: {distortionStrength: 1}}),

    new Filter('Vignette', 'Vignette.png', 'vignette', {}),
    new Filter('Arnold Frame', 'Arnold Frame.png', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 1., 'maintain_aspect_ratio': false}),
    new Filter('Painting Frame', 'Painting Frame.png', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/painting.jpg'), 'scale': 1., 'maintain_aspect_ratio': false}),
    new Filter('Threshold', 'Threshold.png', 'threshold', {threshold: [50, 50, 50]}),
    new Filter('Dizzy', 'Dizzy.png', 'wavy', {dynamic: true, speed:1.0, amplitude: 1.0}),
    new Filter('Wavy', 'Wavy.png', 'wavy', {dynamic: false, amplitude: 2.0}),
    new Filter('Pixelate', 'Pixelate.png', 'pixelation', {}),
    // new Filter('Central Distortion', 'positive_central_distortion.png', 'centralDistortion', {'distortionStrength': 1, 'effectRadius':0.1}),
    // new Filter('Central Distortion 2', 'negative_central_distortion.png', 'centralDistortion', {'distortionStrength': -1, 'effectRadius':0.1}),
    new Filter('Central Distortion 3', 'Central Distortion 3.png', 'centralDistortion', {distortionStrength: 1}),
    new Filter('Central Distortion 4', 'Central Distortion 4.png', 'centralDistortion', {distortionStrength: -1}),
    new Filter('Face Detector Demo', 'face_detector.png', 'faceDetectorDemo', {}),
    new Filter('Landmark Detector Demo', 'landmark_detector.png', 'landmarkDetectorDemo', {}),
    // new Filter('Central Distortion 5', 'positive_central_distortion.png', 'centralDistortion', {'distortionStrength': 3, 'effectRadius':0.3}),
    // new Filter('Central Distortion 6', 'negative_central_distortion.png', 'centralDistortion', {'distortionStrength': -3, 'effectRadius':0.3}),
    // new Filter('Threshold 2', 'threshold.png', 'threshold', {"threshold": [100, 100, 100]}),
    // new Filter('Threshold 2', 'threshold.png', 'threshold', {"threshold": [100, 100, 100]}),
    // new Filter('Threshold 3', 'threshold.png', 'threshold', {"threshold": [150, 150, 150]}),
    // new Filter('Threshold 4', 'threshold.png', 'threshold', {"threshold": [200, 200, 200]}),
    // new Filter('Threshold 5', 'threshold.png', 'threshold', {"threshold": [250, 250, 250]}),
    // new Filter('Arnold Frame 2', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 1., 'maintain_aspect_ratio': true}),
    // new Filter('Arnold Frame 3', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 0.5, 'maintain_aspect_ratio': true}),
    // new Filter('Arnold Frame 4', 'arnold_frame.jpg', 'image_frame', {'imageUrl': chrome.runtime.getURL('data/frames/arnold.jpg'), 'scale': 0.5, 'maintain_aspect_ratio': false, deleteWhite: false}),
]
