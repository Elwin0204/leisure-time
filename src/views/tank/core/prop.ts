import { ImageBlockCoordinate, MapBlock, PROP_AUDIO, RESOURCE_IMAGE } from './const';
import { Tank, PlayTank, EnemyOne, EnemyTwo, EnemyThree } from './tank';
import { Map } from './map';
import { checkIntersect } from './collision';
import { player1, player2, map, enemyArray, GamePlay } from './play';
const mapChangeIndex = [
  [23, 11],
  [23, 12],
  [23, 13],
  [23, 14],
  [24, 11],
  [24, 14],
  [25, 11],
  [25, 14],
];
/**
 * @description
 */
export class Prop {
  x: number;
  y: number;
  duration: number;
  type: number;
  hit: boolean;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  isDestroyed: boolean;
  size: number;

  constructor(context: CanvasRenderingContext2D) {
    this.x = 0;
    this.y = 0;
    this.duration = 600;
    this.type = 0;
    this.hit = false;
    this.width = 30;
    this.height = 28;
    this.ctx = context;
    this.isDestroyed = false;
    this.size = 28;
  }

  init() {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
    this.duration = 600;
    this.type = parseInt(`${Math.random() * 6}`);
    this.x = parseInt(`${Math.random() * 384}`) + map!.offsetX;
    this.y = parseInt(`${Math.random() * 384}`) + map!.offsetY;
    this.isDestroyed = false;
  }

  isHit() {
    let player: PlayTank | null = null;
    if (player1!.lives > 0 && checkIntersect(this, player1 as PlayTank, 0)) {
      this.hit = true;
      player = player1;
    } else if (player2!.lives > 0 && checkIntersect(this, player2 as PlayTank, 0)) {
      this.hit = true;
      player = player2;
    }
    if (this.hit) {
      PROP_AUDIO.play();
      this.isDestroyed = true;
      this.ctx.clearRect(this.x, this.y, this.width, this.height);
      switch (this.type) {
        case 0:
          player!.lives++;
          break;
        case 1:
          GamePlay.setEnemyStopTime(500);
          break;
        case 2:
          map!.updateMap(mapChangeIndex, MapBlock.GRID);
          GamePlay.setHomeProtectTime(500);
          break;
        case 3:
          if (Array.isArray(enemyArray) && enemyArray.length > 0) {
            for (let i = 0; i < enemyArray.length; i++) {
              const enemyObj = enemyArray[i];
              enemyObj.distroy();
            }
          }
          break;
        case 4:
          break;
        case 5:
          player!.isProtected = true;
          player!.protectedTime = 500;
          break;
        default:
          break;
      }
    }
  }
  draw() {
    if (this.duration > 0 && !this.isDestroyed) {
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        ImageBlockCoordinate.prop[0] + this.type * this.width,
        ImageBlockCoordinate.prop[1],
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      this.duration--;
      this.isHit();
    } else {
      this.ctx.clearRect(this.x, this.y, this.width, this.height);
      this.isDestroyed = true;
    }
  }
}
