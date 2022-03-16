import {fabric} from "fabric";
import {Object} from "fabric/fabric-impl";
import {Breakpoint} from "@app/core/services/breakpoint-observer.service";

const degreesToRadians = fabric.util.degreesToRadians;

export function setCornerLines(activeObject: Object, size: Breakpoint) {
  let cornerSize = 20;
  let borderScaleFactor = 4;

  if(size === Breakpoint.XS || size === Breakpoint.SM) {
    cornerSize = 30;
  }

  activeObject.set({
    borderColor: '#20bfa9',
    cornerColor: 'rgba(0,49,255,0.85)',
    borderScaleFactor,
    cornerSize,
    cornerStyle: 'circle'
  });

  _setCustomCoordinates(activeObject, 2, 4);
}

function _setCustomCoordinates(activeObject: Object, desktopFactor = 1, touchFactor = 3) {
  (activeObject as any)._setCornerCoords =  function() {
    let coords = this.oCoords,
      newTheta = degreesToRadians(45 - this.angle),
      cosTheta = (fabric.util as any).cos(newTheta),
      sinTheta = (fabric.util as any).sin(newTheta),
      /* Math.sqrt(2 * Math.pow(this.cornerSize, 2)) / 2, */
      /* 0.707106 stands for sqrt(2)/2 */
      cornerHypotenuse = this.cornerSize * desktopFactor * 0.707106,
      touchHypotenuse = this.touchCornerSize * touchFactor * 0.707106,
      cosHalfOffset = cornerHypotenuse * cosTheta,
      sinHalfOffset = cornerHypotenuse * sinTheta,
      touchCosHalfOffset = touchHypotenuse * cosTheta,
      touchSinHalfOffset = touchHypotenuse * sinTheta,
      x, y;

    for (const control in coords) {
      x = coords[control].x;
      y = coords[control].y;
      coords[control].corner = {
        tl: {
          x: x - sinHalfOffset,
          y: y - cosHalfOffset
        },
        tr: {
          x: x + cosHalfOffset,
          y: y - sinHalfOffset
        },
        bl: {
          x: x - cosHalfOffset,
          y: y + sinHalfOffset
        },
        br: {
          x: x + sinHalfOffset,
          y: y + cosHalfOffset
        }
      };
      coords[control].touchCorner = {
        tl: {
          x: x - touchSinHalfOffset,
          y: y - touchCosHalfOffset
        },
        tr: {
          x: x + touchCosHalfOffset,
          y: y - touchSinHalfOffset
        },
        bl: {
          x: x - touchCosHalfOffset,
          y: y + touchSinHalfOffset
        },
        br: {
          x: x + touchSinHalfOffset,
          y: y + touchCosHalfOffset
        }
      };
    }
  }
}
