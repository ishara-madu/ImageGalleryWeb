function AddWatermark(imageSrc, watermarkText) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.crossOrigin = "Anonymous"; // Handle cross-origin issues if necessary
    img.src = imageSrc;

    img.onload = () => {
      // Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Set watermark styles
      ctx.font = "bold 78px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Calculate the center position
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      const angle = Math.PI / 4; // Rotate by 45 degrees

      // Save the current context state
      ctx.save();

      // Move the context's origin to the center of the canvas
      ctx.translate(x, y);

      // Rotate the context
      ctx.rotate(angle);

      // Draw the watermark text at the rotated position
      ctx.fillText(watermarkText, 0, 0);

      // Restore the context to its original state
      ctx.restore();

      // Return the watermarked image as a data URL
      resolve(canvas.toDataURL());
    };
  });
}

export default AddWatermark;
