const maskFuntions = {
    "default" : tresholdFilter,
    "threshold" : tresholdFilter
};

function tresholdFilter(video, canvas, {threshold = [100, 100, 100]} = {}) {
    setCanvasSize(canvas, video);
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, width, height);
    const frame = ctx.getImageData(0, 0, width, height);
    const data = frame.data;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i + 1] > threshold[0] && data[i] > threshold[1] && data[i + 2] > threshold[2]) {
            data[i] = data[i + 1] = data[i + 2] = 0;
        } else {
            data[i + 3] = 0; // Set alpha to 0
        }
    }
    ctx.putImageData(frame, 0, 0);
}