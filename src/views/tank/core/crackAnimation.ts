import { ExplosionType, ImageBlockCoordinate, RESOURCE_IMAGE } from './const';
import type { Tank } from './tank';
import type { Bullet } from './bullet';
/**
 * @description 爆炸效果
 */
export class CrackAnimation {
  times: number;
  ctx: CanvasRenderingContext2D;
  frame: number;
  x: number;
  y: number;
  posName: keyof typeof ImageBlockCoordinate;
  size: number;
  isOver: boolean;
  tempDir: number;
  owner: Tank | Bullet;
  constructor(type: ExplosionType, context: CanvasRenderingContext2D, crackObj: Tank | Bullet) {
    this.times = 0;
    this.ctx = context;
    this.frame = 0;
    this.x = 0;
    this.y = 0;
    // this.posName = '';
    this.size = 0;
    this.isOver = false;
    this.tempDir = 1;
    this.owner = crackObj;
    if (type === ExplosionType.TANK) {
      this.posName = 'tankBomb';
      this.size = 66;
      this.frame = 4;
    } else {
      this.posName = 'bulletBomb';
      this.size = 32;
      this.frame = 3;
    }
    this.x = crackObj.x + parseInt(`${(crackObj.size - this.size) / 2}`);
    this.y = crackObj.y + parseInt(`${(crackObj.size - this.size) / 2}`);
  }

  draw() {
    const gaptime = 3;
    const temp = parseInt(`${this.times / gaptime}`);
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      ImageBlockCoordinate[this.posName][0] + temp * this.size,
      ImageBlockCoordinate[this.posName][1],
      this.size,
      this.size,
      this.x,
      this.y,
      this.size,
      this.size
    );
    this.times += this.tempDir;
    if (this.times > this.frame * gaptime - parseInt(`${gaptime / 2}`)) {
      this.tempDir = -1;
    }
    if (this.times <= 0) {
      this.isOver = true;
    }
  }
}
