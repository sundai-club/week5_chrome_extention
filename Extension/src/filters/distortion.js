
function wavyDistortionFilter(video, canvas, ctx, {amplitude=5., dynamic=true, speed=1.} = {}) {
    setCanvasSize(canvas, video);
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
    setCanvasSize(canvas, video);
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

function centralDistortionFilter(video, canvas, ctx, {distortionStrength=1, effectRadius=0.1, centers=[{x: 0.5, y: 0.5}]} = {}) {
    setCanvasSize(canvas, video);
    if (centers.length === 0) return;
    effectRadius *= Math.max(canvas.width, canvas.height);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const output = ctx.createImageData(canvas.width, canvas.height);

    centers = centers.map(center => ({ x: center.x * canvas.width, y: center.y * canvas.height }));
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let closestCenter = centers[0];
            let minDist = Number.MAX_VALUE;
            centers.forEach(center => {
                const dx = x - center.x;
                const dy = y - center.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minDist) {
                    minDist = distance;
                    closestCenter = center;
                }
            });

            const dx = x - closestCenter.x;
            const dy = y - closestCenter.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const normalizedDistance = distance / effectRadius;

            if (distance < effectRadius) {
                const distortion = distortionStrength * Math.pow(1 - normalizedDistance, 2);
                const distortedDistance = distance * (1 + distortion);

                const normalizedDistortedX = (distortedDistance / distance) * dx;
                const normalizedDistortedY = (distortedDistance / distance) * dy;
                const srcX = closestCenter.x + normalizedDistortedX;
                const srcY = closestCenter.y + normalizedDistortedY;

                const srcIndex = (Math.floor(srcY) * canvas.width + Math.floor(srcX)) * 4;
                const destIndex = (y * canvas.width + x) * 4;

                output.data[destIndex] = imageData.data[srcIndex];
                output.data[destIndex + 1] = imageData.data[srcIndex + 1];
                output.data[destIndex + 2] = imageData.data[srcIndex + 2];
                output.data[destIndex + 3] = 255; // Fully opaque.
            } else {
                const index = (y * canvas.width + x) * 4;
                output.data[index] = imageData.data[index];
                output.data[index + 1] = imageData.data[index + 1];
                output.data[index + 2] = imageData.data[index + 2];
                output.data[index + 3] = imageData.data[index + 3];
            }
        }
    }

    ctx.putImageData(output, 0, 0);
}
