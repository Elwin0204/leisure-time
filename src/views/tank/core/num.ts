import { RESOURCE_IMAGE, ImageBlockCoordinate } from './const';
export class Num {
  ctx: CanvasRenderingContext2D;
  size: number;
  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
    this.size = 14;
  }

  draw(num: number, x: number, y: number) {
    let tempX = x;
    const tempY = y;
    const tempNumArray = [];
    if (num === 0) {
      tempNumArray.push(0);
    } else {
      while (num > 0) {
        tempNumArray.push(num % 10);
        num = parseInt(`${num / 10}`);
      }
    }
    for (let i = tempNumArray.length - 1; i >= 0; i--) {
      tempX = x + (tempNumArray.length - i - 1) * this.size;
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        ImageBlockCoordinate.num[0] + tempNumArray[i] * 14,
        ImageBlockCoordinate.num[1],
        this.size,
        this.size,
        tempX,
        tempY,
        this.size,
        this.size
      );
    }
  }
}
