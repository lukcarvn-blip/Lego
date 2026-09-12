export const getAverageColor = (imageSrc: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve('#3b82f6'); // Default color if SSR
      return;
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('#3b82f6');
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        let count = 0;
        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
          // Ignore completely transparent pixels
          if (data[i + 3] > 0) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        if (count === 0) {
          resolve('#3b82f6');
          return;
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch (e) {
        // Handle CORS errors or canvas tainting
        resolve('#3b82f6');
      }
    };
    img.onerror = () => resolve('#3b82f6');
    img.src = imageSrc;
  });
};
