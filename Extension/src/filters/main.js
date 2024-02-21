const maskFuntions = {
    "default" : emptyFilter,
    "threshold" : tresholdFilter,
    "grayscale" : grayscaleFilter,
    "invertColors" : invertColorsFilter,
    "sepia" : sepiaFilter,
    "comicBook" : posterizeFilter,
    "vignette" : vignetteFilter,
    "image_frame": imageFrameFilter,
    "wavy": wavyDistortionFilter,
    "pixelation": pixelationFilter,
    "centralDistortion": centralDistortionFilter,
    "landmarkDetectorDemo": landmarkDetectorDemo,
    "faceDetectorDemo": faceDetectorDemo,
    "faceDistortion": faceDistortion,
};


function emptyFilter(video, canvas, ctx) {
    setCanvasSize(canvas, video);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}
