const maskFuntions = {
    "default" : emptyFilter,
    "shuffle" : randomShuffle,
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


let lastShuffleUpdateTime = new Date().getTime();
let randomFilter = null;
function randomShuffle(video, canvas, ctx, {upd_time=5, filters_to_choose=[]} = {}) {
    let time = new Date().getTime();
    if (randomFilter == null || (time - lastShuffleUpdateTime) > upd_time * 1000) {
        lastShuffleUpdateTime = time;
        randomFilter = filters_to_choose[Math.floor(Math.random() * filters_to_choose.length)];
        if (debug) console.log("Random Filter is set to ", randomFilter.name);
    }

    maskFuntions[randomFilter.funcName](video, canvas, ctx, randomFilter.args);
}