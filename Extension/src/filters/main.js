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
    "centralDistortion": centralDistortionFilter
};


function emptyFilter(video, canvas) {
    setCanvasSize(canvas, video);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
}
