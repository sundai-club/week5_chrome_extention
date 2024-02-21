async function imageFrameFilter(video, canvas, {imageUrl = "", maintain_aspect_ratio = false, scale = 1.0, deleteWhite=true} = {}) {
    if (!imageUrl) return;
    setCanvasSize(canvas, video);
    const ctx = canvas.getContext("2d");

    if (debug) console.log("Loading image frame from: ", imageUrl);
    const image = await getCachedImage(imageUrl).catch(console.error);
    if (!image) {
        if (debug) console.log("Failed to load image.");
        return;
    }

    // Calculate new dimensions based on scaling and aspect ratio flags
    let scaledWidth, scaledHeight;
    if (maintain_aspect_ratio) {
        const imgAspect = image.width / image.height;
        scaledWidth = scale * canvas.width;
        scaledHeight = scaledWidth / imgAspect;
    } else {
        scaledWidth = scale * canvas.width;
        scaledHeight = scale * canvas.height;
    }

    // Calculate position to center the frame
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;

    // Draw the frame
    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    if (debug) console.log("Image frame drawn  at: ", x, y, scaledWidth, scaledHeight);

    // Optional: make white transparent
    if (deleteWhite) {
        th = 240;
        frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        data = frame.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 1] > th && data[i] > th && data[i + 2] > th) {
                data[i + 3] = 0; 
            }
        }
        ctx.putImageData(frame, 0, 0);
    }
}
