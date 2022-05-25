/* eslint-disable prettier/prettier */
import { ImageBlockCoordinate, RESOURCE_IMAGE, StageDir, START_AUDIO } from "./const";
import { Num } from "./num";
import { GamePlay } from './play';

/**
 * @description 
 */
export class Stage {
  ctx: CanvasRenderingContext2D;
  drawHeight: number;
  level: number;
  temp: number;
  dir: StageDir;
  isReady: boolean;
  levelNum: Num;

  constructor (context: CanvasRenderingContext2D, l: number) {
    this.ctx = context;
    this.ctx.fillStyle = '#7f7f7f';
    this.drawHeight = 15;
    this.level = l;
    this.temp = 0;
    this.dir = StageDir.CLOSE;
    this.isReady = false;
    this.levelNum = new Num(context);
  }

  init (level: number) {
    this.dir = StageDir.CLOSE;
    this.isReady = false;
    this.level = level;
    this.temp = 0;
  }

  draw () {
    if (this.dir === StageDir.CLOSE) {
      if (this.temp === 225) {
        // 78, 14為STAGE字樣在圖片資源中的寬和高, 194, 208為canvas中的位置
        this.ctx.drawImage(RESOURCE_IMAGE, ImageBlockCoordinate.stageLevel[0], ImageBlockCoordinate.stageLevel[1], 78, 14, 194, 208, 78, 14);
        this.levelNum.draw(this.level, 308, 208);
        // 繪製地圖, 調用play中的方法
        GamePlay.initMap();
      } else if (this.temp === 225 + 600) {
        // 600即調用了600/15次, 主要用來停頓
        this.temp = 225;
        this.dir = StageDir.OPEN;
        START_AUDIO.play();
      } else {
        this.ctx.fillRect(0, this.temp, 512, this.drawHeight);
        this.ctx.fillRect(0, 448 - this.temp - this.drawHeight, 512, this.drawHeight);
      }
    } else if (this.temp >= 0) {
        this.ctx.clearRect(0, this.temp, 512, this.drawHeight);
        this.ctx.clearRect(0, 448 - this.temp - this.drawHeight, 512, this.drawHeight);
      } else {
        this.isReady = true;
      }
    this.temp += this.drawHeight * this.dir;
  }
}