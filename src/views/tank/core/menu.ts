/**
 * @description 遊戲開始菜單
 */
import {
  ImageBlockCoordinate,
  MENU_IMAGE,
  RESOURCE_IMAGE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from './const';
import { SelectTank } from './tank';
export class Menu {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  playNum: number;
  times: 0;
  selectTank: SelectTank;
  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
    this.x = 0;
    this.y = SCREEN_HEIGHT;
    this.playNum = 1;
    this.times = 0;
    this.selectTank = new SelectTank(context);
  }

  // 繪製菜單
  draw() {
    this.times++;
    let temp = 0;
    if (parseInt(`${this.times / 6}`) % 2 === 0) {
      temp = 0;
    } else {
      temp = this.selectTank.size;
    }
    if (this.y <= 0) {
      this.y = 0;
    } else {
      this.y -= 5;
    }
    this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.ctx.save();
    // 繪製背景
    this.ctx.drawImage(MENU_IMAGE, this.x, this.y);
    // 繪製選擇坦克
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      ImageBlockCoordinate.selectTank[0],
      ImageBlockCoordinate.selectTank[1] + temp,
      this.selectTank.size,
      this.selectTank.size,
      this.selectTank.x,
      this.y + this.selectTank.ys[this.playNum - 1],
      this.selectTank.size,
      this.selectTank.size
    );
    this.ctx.restore();
  }

  // 選擇坦克上下移動
  next(n: number) {
    this.playNum += n;
    if (this.playNum > 2) {
      this.playNum = 1;
    } else if (this.playNum < 1) {
      this.playNum = 2;
    }
  }
}
