function GetLowQualityImage(imageUrl, quality,size) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Ensure cross-origin images are loaded
    img.src = imageUrl;

    // Use requestAnimationFrame to reduce jank during image processing
    const onImageLoad = () => {
      try {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate dimensions based on max width and height
        const maxWidth = size;
        const maxHeight = size;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > maxWidth) {
            width = maxWidth;
            height = Math.round(width / aspectRatio);
          }
          if (height > maxHeight) {
            height = maxHeight;
            width = Math.round(height * aspectRatio);
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Use setTimeout to offload processing to the next event loop
        setTimeout(() => {
          // Convert canvas to data URL with reduced quality
          const dataURL = canvas.toDataURL("image/jpeg", quality);
          resolve(dataURL);
        }, 0);
      } catch (error) {
        reject(new Error("Failed to process image: " + error.message));
      }
    };

    img.onload = () => requestAnimationFrame(onImageLoad);

    img.onerror = (error) => {
      reject(new Error("Failed to load image: " + error.message));
    };
  });
}

export default GetLowQualityImage;
