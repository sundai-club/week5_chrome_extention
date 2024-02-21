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
    "faceMesh": drawLandmarks,
};


function emptyFilter(video, canvas, ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}
