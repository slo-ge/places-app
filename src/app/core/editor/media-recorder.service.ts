import {Injectable} from '@angular/core';
import {Canvas} from "fabric/fabric-impl";
declare var MediaRecorder: any;

@Injectable({
  providedIn: 'root'
})
export class MediaRecorderService {

  constructor() { }

  /**
   * Records canvas html element
   * @param canvas
   * @param time
   */
  private record(canvas: HTMLCanvasElement, time: number): Promise<string> {
    const recordedChunks = [] as any;
    return new Promise((res, _rej) => {
      const stream = (canvas as any).captureStream(25 /*fps*/);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm; codecs=vp9"
      });

      //ondataavailable will fire in interval of `time || 4000 ms`
      mediaRecorder.start(time || 4000);

      mediaRecorder.ondataavailable = (_e: any) => {
        recordedChunks.push((event as any).data);

        if (mediaRecorder.state === 'recording') {
          // after stop data avilable event run one more time
          mediaRecorder.stop();
        }

      };

      mediaRecorder.onstop = (_event: any) => {
        const blob = new Blob(recordedChunks, {
          type: "video/webm"
        });
        const url = URL.createObjectURL(blob);
        res(url);
      }
    })
  }

  /**
   * Return the url of the video as blob url
   * -> this url can be opened in browser
   */
  getUrl(canvas: Canvas): Promise<string> {
    if (canvas) {
      return this.record(canvas.getElement(), 4000);
    } else {
      console.error('canvas must not be null');
      return Promise.reject(new Error('canvas can not be null'));
    }
  }
}
