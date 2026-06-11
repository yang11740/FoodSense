export const isLikelyBlankImage = (dataUrl: string, sampleSize = 64): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      const context = canvas.getContext('2d');
      if (!context) {
        resolve(false);
        return;
      }

      context.drawImage(image, 0, 0, sampleSize, sampleSize);
      const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data;
      let sum = 0;
      let sumSq = 0;
      const count = pixels.length / 4;

      for (let index = 0; index < pixels.length; index += 4) {
        const gray = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        sum += gray;
        sumSq += gray * gray;
      }

      const mean = sum / count;
      const variance = sumSq / count - mean * mean;
      // 仅拦截几乎全黑的画面，避免误伤浅色菜品或单一色调照片
      resolve(mean < 10);
    };
    image.onerror = () => reject(new Error('图片加载失败'));
    image.src = dataUrl;
  });
