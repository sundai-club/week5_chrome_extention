
function wavyDistortionFilter(video, canvas, ctx, {amplitude=5., dynamic=true, speed=1.} = {}) {
    let time = 0.;
    if (dynamic) time = new Date().getTime() * 0.002 * speed;

    amplitude *= 20;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const output = new ImageData(canvas.width, canvas.height); // Create a new ImageData object for the output

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const wave = Math.sin(y / amplitude + time) * amplitude;
            const newX = x + wave;

            if (newX >= 0 && newX < canvas.width) {
                const newIndex = (y * canvas.width + Math.floor(newX)) * 4;
                output.data[index] = imageData.data[newIndex];
                output.data[index + 1] = imageData.data[newIndex + 1];
                output.data[index + 2] = imageData.data[newIndex + 2];
                output.data[index + 3] = 255; // Fully opaque
            } else {
                // If newX is outside the canvas, copy the original pixel
                output.data[index] = imageData.data[index];
                output.data[index + 1] = imageData.data[index + 1];
                output.data[index + 2] = imageData.data[index + 2];
                output.data[index + 3] = 255; // Fully opaque
            }
        }
    }

    ctx.putImageData(output, 0, 0);
}

function pixelationFilter(video, canvas, ctx, {pixelSize = 10} = {}) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const width = canvas.width / pixelSize;
    const height = canvas.height / pixelSize;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const imageData = ctx.getImageData(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            let totalR = 0, totalG = 0, totalB = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                totalR += imageData.data[i];
                totalG += imageData.data[i + 1];
                totalB += imageData.data[i + 2];
            }
            const count = imageData.data.length / 4;
            const averageR = totalR / count;
            const averageG = totalG / count;
            const averageB = totalB / count;
            ctx.fillStyle = `rgb(${averageR},${averageG},${averageB})`;
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }
}


function centralDistortionFilter(video, canvas, ctx, {distortionStrength=1, effectRadius=100} = {}) {
    // Draw the video frame to the canvas.
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const output = ctx.createImageData(canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2; // Max radius limited to half the smallest dimension
    effectRadius = Math.min(effectRadius, maxRadius); // Ensure the effect radius doesn't exceed the max radius

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const normalizedDistance = distance / effectRadius;

            // Apply the distortion if within the effect radius, otherwise leave the pixel as it is
            if (distance < effectRadius) {
                // Determine the distortion factor based on distance from the center
                const distortion = distortionStrength * Math.pow(1 - normalizedDistance, 2);
                const distortedDistance = distance * (1 + distortion);

                // Map the distorted coordinates back to the source image space
                const normalizedDistortedX = (distortedDistance / distance) * dx;
                const normalizedDistortedY = (distortedDistance / distance) * dy;
                const srcX = centerX + normalizedDistortedX;
                const srcY = centerY + normalizedDistortedY;

                const srcIndex = (Math.floor(srcY) * canvas.width + Math.floor(srcX)) * 4;
                const destIndex = (y * canvas.width + x) * 4;

                output.data[destIndex] = imageData.data[srcIndex];
                output.data[destIndex + 1] = imageData.data[srcIndex + 1];
                output.data[destIndex + 2] = imageData.data[srcIndex + 2];
                output.data[destIndex + 3] = 255; // Fully opaque.
            } else {
                // Outside the effect radius, copy the pixels directly.
                const index = (y * canvas.width + x) * 4;
                output.data[index] = imageData.data[index];
                output.data[index + 1] = imageData.data[index + 1];
                output.data[index + 2] = imageData.data[index + 2];
                output.data[index + 3] = imageData.data[index + 3];
            }
        }
    }

    // Put the distorted image data back to the canvas.
    ctx.putImageData(output, 0, 0);
}
