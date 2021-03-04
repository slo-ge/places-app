import {fabric} from "fabric";
import {Canvas} from "fabric/fabric-impl";
import {BackgroundImage, Preset} from "@app/core/model/preset";

export class PresetVideo {


  constructor() {
  }

  public static initializeVideo(canvas: Canvas, videoUrl: string, preset: Preset) {
    const video = PresetVideo.getVideoElement(videoUrl, preset);
    PresetVideo.setVideoBackground(video, canvas);

    console.warn('danger: we can not always call the requestAnimFrame method');
    console.warn('because it will be triggered on every preset change');

    fabric.util.requestAnimFrame(function render() {
      canvas.renderAll();
      fabric.util.requestAnimFrame(render);
    });
  }

  private static setVideoBackground(video: HTMLVideoElement, canvas: Canvas) {
    const fabVideo = new fabric.Image(video, {left: 0, top: 0, selectable: false});
    (fabVideo.getElement() as HTMLVideoElement).play();
    fabVideo.scaleToWidth(canvas.width || 0);
    //fabVideo.lockMovementX = true;
    canvas.moveTo(fabVideo, 0);
  }

  private static getVideoElement(url: string, preset: Preset) {
    const videoE = document.createElement('video');
    videoE.width = preset.width;
    videoE.height = preset.height;
    videoE.muted = true; // otherwise there will be: https://stackoverflow.com/a/50742427
    videoE.loop = true;
    videoE.crossOrigin = "anonymous";
    const source = document.createElement('source');
    source.src = url;
    source.type = preset.backgroundImage.mime;
    videoE.appendChild(source);
    return videoE;
  }
}
