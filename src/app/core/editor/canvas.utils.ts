/**
 * scales the canvas to a different width and height,
 * and returns the new canvas HtmlElement
 */
export function getScaledImage(originCanvas: HTMLCanvasElement, maxWidth: number, maxHeight: number): HTMLCanvasElement {
  const ratioX = maxWidth / originCanvas.width;
  const ratioY = maxHeight / originCanvas.height;
  const ratio = Math.min(ratioX, ratioY);

  const newWidth = Math.round(originCanvas.width * ratio);
  const newHeight = Math.round(originCanvas.height * ratio);

  const tmpCanvas = document.createElement('canvas');
  const ctx = tmpCanvas.getContext('2d');
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;
  ctx?.drawImage(originCanvas, 0, 0, originCanvas.width, originCanvas.height, 0, 0, tmpCanvas.width, tmpCanvas.height);
  return tmpCanvas;
}
