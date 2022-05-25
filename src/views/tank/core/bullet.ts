/**
 * @description 子彈
 */
import {
  Direction,
  BulletType,
  RESOURCE_IMAGE,
  ImageBlockCoordinate,
  ExplosionType,
  BULLET_DESTROY_AUDIO,
} from './const';
import { Tank, EnemyOne, EnemyTwo, EnemyThree, PlayTank } from './tank';
import { bulletMapCollision, checkIntersect } from './collision';
import type { Map } from './map';
import { CrackAnimation } from './crackAnimation';
import { map, bulletArray, enemyArray, player1, player2, crackArray } from './play';

export class Bullet {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  owner: Tank;
  type: BulletType;
  dir: Direction;
  speed: number;
  size: number;
  hit: boolean;
  isDestroyed: boolean;
  // eslint-disable-next-line max-params
  constructor(context: CanvasRenderingContext2D, owner: Tank, type: BulletType, dir: Direction) {
    this.ctx = context;
    this.x = 0;
    this.y = 0;
    this.owner = owner;
    this.type = type;
    this.dir = dir;
    this.speed = 3;
    this.size = 6;
    this.hit = false;
    this.isDestroyed = false;
  }

  draw() {
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      ImageBlockCoordinate.bullet[0] + this.dir * this.size,
      ImageBlockCoordinate.bullet[1],
      this.size,
      this.size,
      this.x,
      this.y,
      this.size,
      this.size
    );
    this.move();
  }

  move() {
    if (this.dir === Direction.UP) {
      this.y -= this.speed;
    } else if (this.dir === Direction.DOWN) {
      this.y += this.speed;
    } else if (this.dir === Direction.RIGHT) {
      this.x += this.speed;
    } else if (this.dir === Direction.LEFT) {
      this.x -= this.speed;
    }
    this.isHit();
  }

  // 碰撞檢測
  isHit() {
    if (this.isDestroyed) {
      return;
    }
    // 臨界檢測
    if (this.x < map!.offsetX) {
      this.x = map!.offsetX;
      this.hit = true;
    } else if (this.x > map!.offsetX + map!.mapWidth - this.size) {
      this.x = map!.offsetX + map!.mapWidth - this.size;
      this.hit = true;
    }
    if (this.y < map!.offsetY) {
      this.y = map!.offsetY;
      this.hit = true;
    } else if (this.y > map!.offsetY + map!.mapHeigh - this.size) {
      this.y = map!.offsetY + map!.mapHeigh - this.size;
      this.hit = true;
    }

    // 子彈是否碰撞了其他子彈
    if (!this.hit) {
      if (Array.isArray(bulletArray) && bulletArray.length > 0) {
        for (let i = 0; i < bulletArray.length; i++) {
          if (
            // eslint-disable-next-line eqeqeq
            bulletArray[i] != this &&
            // eslint-disable-next-line eqeqeq
            this.owner.isAI != bulletArray[i].owner.isAI &&
            bulletArray[i].hit === false &&
            checkIntersect(bulletArray[i], this, 0)
          ) {
            this.hit = true;
            bulletArray[i].hit = true;
            break;
          }
        }
      }
    }

    if (!this.hit) {
      // 地圖檢測
      if (bulletMapCollision(this, map as Map)) {
        this.hit = true;
      }
      // 是否擊中坦克
      if (this.type === BulletType.PLAYER) {
        if (Array.isArray(enemyArray) && enemyArray.length > 0) {
          for (let i = 0; i < enemyArray.length; i++) {
            const enemyObj = enemyArray[i];
            if (!enemyObj.isDestroyed && checkIntersect(this, enemyObj, 0)) {
              checkIntersect(this, enemyObj, 0); // qs: 為什麼調用兩次
              if (enemyObj.lives > 1) {
                enemyObj.lives--;
              } else {
                enemyObj.distroy();
              }
              this.hit = true;
              break;
            }
          }
        }
      } else if (this.type === BulletType.ENEMY) {
        if (player1!.lives > 0 && checkIntersect(this, player1 as PlayTank, 0)) {
          if (!player1!.isProtected && !player1!.isDestroyed) {
            player1!.distroy();
          }
          this.hit = true;
        } else if (player2!.lives > 0 && checkIntersect(this, player2 as PlayTank, 0)) {
          if (!player2!.isProtected && !player2!.isDestroyed) {
            player2!.distroy();
          }
          this.hit = true;
        }
      }
    }
    if (this.hit) {
      this.distroy();
    }
  }

  // 銷毀
  distroy() {
    this.isDestroyed = true;
    crackArray.push(new CrackAnimation(ExplosionType.BULLET, this.ctx, this));
    if (!this.owner.isAI) {
      BULLET_DESTROY_AUDIO.play();
    }
  }
}
