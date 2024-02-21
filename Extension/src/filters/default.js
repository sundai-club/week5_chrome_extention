function tresholdFilter(video, canvas, ctx, {threshold = [100, 100, 100]} = {}) {
    const width = canvas.width;
    const height = canvas.height;

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

function grayscaleFilter(video, canvas, ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }

    ctx.putImageData(frame, 0, 0);
}

function invertColorsFilter(video, canvas, ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // Invert red
        data[i + 1] = 255 - data[i + 1]; // Invert green
        data[i + 2] = 255 - data[i + 2]; // Invert blue
    }

    ctx.putImageData(frame, 0, 0);
}


function sepiaFilter(video, canvas, ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;

    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        data[i] = (red * 0.393) + (green * 0.769) + (blue * 0.189); // Red
        data[i + 1] = (red * 0.349) + (green * 0.686) + (blue * 0.168); // Green
        data[i + 2] = (red * 0.272) + (green * 0.534) + (blue * 0.131); // Blue
    }

    ctx.putImageData(frame, 0, 0);
}

function posterizeFilter(video, canvas, ctx, {levels = 5} = {}) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;

    // Calculate the interval for posterization
    const step = Math.floor(255 / levels);

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.floor(data[i] / step) * step; // Red
        data[i + 1] = Math.floor(data[i + 1] / step) * step; // Green
        data[i + 2] = Math.floor(data[i + 2] / step) * step; // Blue
        // Alpha (data[i + 3]) remains unchanged
    }

    ctx.putImageData(frame, 0, 0);
}


function vignetteFilter(video, canvas, ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.sqrt(centerX * centerX + centerY * centerY);

    let data = frame.data;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let distanceX = x - centerX;
            let distanceY = y - centerY;
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            let offset = 4 * (y * canvas.width + x);
            let vignette = 1 - distance / radius;

            data[offset] *= vignette; // Red
            data[offset + 1] *= vignette; // Green
            data[offset + 2] *= vignette; // Blue
        }
    }

    ctx.putImageData(frame, 0, 0);
}
