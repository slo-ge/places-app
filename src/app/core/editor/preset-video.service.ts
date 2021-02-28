import {fabric} from "fabric";
import {Canvas} from "fabric/fabric-impl";
import {BackgroundImage} from "@app/core/model/preset";

export class PresetVideo {


  constructor() {
  }

  public static initializeVideo(canvas: Canvas, videoUrl: string, background: BackgroundImage) {
    const video = PresetVideo.getVideoElement(videoUrl);
    PresetVideo.setVideoBackground(video, canvas);

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

  private static getVideoElement(url: string) {
    const videoE = document.createElement('video');
    videoE.width = 640; // TODO: set width
    videoE.height = 640; // TODO: set height
    videoE.muted = true;
    videoE.crossOrigin = "anonymous";
    const source = document.createElement('source');
    source.src = url;
    source.type = 'video/mp4';
    videoE.appendChild(source);
    return videoE;
  }
}
