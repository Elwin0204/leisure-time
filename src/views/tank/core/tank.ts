/**
 * @description 坦克基類
 */
import {
  Direction,
  ExplosionType,
  TANK_DESTROY_AUDIO,
  BulletType,
  ATTACK_AUDIO,
  RESOURCE_IMAGE,
  ImageBlockCoordinate,
  PLAYER_DESTROY_AUDIO,
} from './const';
import { tankMapCollision } from './collision';
import type { Map } from './map';
import { CrackAnimation } from './crackAnimation';
import { Bullet } from './bullet';
import { enemyStopTime, map, crackArray, bulletArray } from './play';
export class Tank {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  dir: Direction;
  speed: number;
  frame: number;
  hit: boolean;
  isAI: boolean;
  isShooting: boolean;
  bullet: Bullet | null;
  shootRate: number;
  isDestroyed: boolean;
  tempX: number;
  tempY: number;

  constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
    this.x = 0;
    this.y = 0;
    this.size = 32; // 坦克大小
    this.dir = Direction.UP; // 方向
    this.speed = 1; // 坦克速度
    this.frame = 0; // 控制敵方坦克切換方向的時間
    this.hit = false; // 是否碰到墻或者坦克
    this.isAI = false; // 是否自動
    this.isShooting = false; // 子彈是否在運行中
    this.bullet = null; // 子彈
    this.shootRate = 0.6; // 設計的概率
    this.isDestroyed = false; // 是否別毀滅
    this.tempX = 0;
    this.tempY = 0;
  }

  move() {
    // 如果是AI坦克，在一定時間或者碰撞後切換方法
    if (this.isAI && enemyStopTime > 0) {
      return;
    }

    this.tempX = this.x;
    this.tempY = this.y;

    if (this.isAI) {
      this.frame++;
      if (this.frame % 100 === 0 || this.hit) {
        this.dir = parseInt(`${Math.random() * 4}`);
        this.hit = false;
        this.frame = 0;
      }
    }
    if (this.dir === Direction.UP) {
      this.tempY -= this.speed;
    } else if (this.dir === Direction.DOWN) {
      this.tempY += this.speed;
    } else if (this.dir === Direction.RIGHT) {
      this.tempX += this.speed;
    } else if (this.dir === Direction.LEFT) {
      this.tempX -= this.speed;
    }

    this.isHit();
    if (!this.hit) {
      this.x = this.tempX;
      this.y = this.tempY;
    }
  }

  // 碰撞檢測
  isHit() {
    if (this.dir === Direction.LEFT) {
      if (this.x <= map!.offsetX) {
        this.x = map!.offsetX;
        this.hit = true;
      }
    } else if (this.dir === Direction.RIGHT) {
      if (this.x >= map!.offsetX + map!.mapWidth - this.size) {
        this.x = map!.offsetX + map!.mapWidth - this.size;
        this.hit = true;
      }
    } else if (this.dir === Direction.UP) {
      if (this.y <= map!.offsetY) {
        this.y = map!.offsetY;
        this.hit = true;
      }
    } else if (this.dir === Direction.DOWN) {
      if (this.y >= map!.offsetY + map!.mapHeigh - this.size) {
        this.y = map!.offsetY + map!.mapHeigh - this.size;
        this.hit = true;
      }
    }
    if (!this.hit) {
      // 地圖檢測
      if (tankMapCollision(this, map as Map)) {
        this.hit = true;
      }
    }
  }

  // 射擊
  shoot(type: BulletType) {
    if (this.isAI && enemyStopTime > 0) {
      return;
    }
    if (this.isShooting) {
      return false;
    }
    let tempX = this.x;
    let tempY = this.y;
    this.bullet = new Bullet(this.ctx, this, type, this.dir);
    if (this.dir === Direction.UP) {
      tempX = this.x + parseInt(`${this.size / 2}`) - parseInt(`${this.bullet.size / 2}`);
      tempY = this.y - this.bullet.size;
    } else if (this.dir === Direction.DOWN) {
      tempX = this.x + parseInt(`${this.size / 2}`) - parseInt(`${this.bullet.size / 2}`);
      tempY = this.y + this.size;
    } else if (this.dir === Direction.LEFT) {
      tempX = this.x - this.bullet.size;
      tempY = this.y + parseInt(`${this.size / 2}`) - parseInt(`${this.bullet.size / 2}`);
    } else if (this.dir === Direction.RIGHT) {
      tempX = this.x + this.size;
      tempY = this.y + parseInt(`${this.size / 2}`) - parseInt(`${this.bullet.size / 2}`);
    }
    this.bullet.x = tempX;
    this.bullet.y = tempY;
    if (!this.isAI) {
      ATTACK_AUDIO.play();
    }
    this.bullet.draw();
    // 將子彈裝進數組
    bulletArray.push(this.bullet);
    this.isShooting = true;
  }

  // 坦克被擊毀
  distroy() {
    this.isDestroyed = true;
    // 父類方法調用子類屬性
    crackArray.push(new CrackAnimation(ExplosionType.TANK, this.ctx, this));
    TANK_DESTROY_AUDIO.play();
  }
}

/**
 * @description 菜單選擇坦克
 */
export class SelectTank extends Tank {
  ys = [250, 281];
  x = 140;
  size = 27;
}

/**
 * @description 玩家坦克
 * @param context 坦克畫布
 */
export class PlayTank extends Tank {
  ctx: CanvasRenderingContext2D;
  lives: number;
  isProtected: boolean;
  protectedTime: number;
  offsetX: number; // 坦克2與坦克1的距離
  speed: number;
  constructor(context: CanvasRenderingContext2D) {
    super(context);
    this.ctx = context;
    this.lives = 3;
    this.isProtected = true;
    this.protectedTime = 500;
    this.offsetX = 0;
    this.speed = 2;
  }

  draw() {
    this.hit = false;
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      ImageBlockCoordinate.player[0] + this.offsetX + this.dir * this.size,
      ImageBlockCoordinate.player[1],
      this.size,
      this.size,
      this.x,
      this.y,
      this.size,
      this.size
    );
    if (this.isProtected) {
      const temp = parseInt(`${(500 - this.protectedTime) / 5}`) % 2;
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        ImageBlockCoordinate.protected[0],
        ImageBlockCoordinate.protected[1] + 32 * temp,
        32,
        32,
        this.x,
        this.y,
        32,
        32
      );
      this.protectedTime--;
      if (this.protectedTime <= 0) {
        this.isProtected = false;
      }
    }
  }

  distroy() {
    this.isDestroyed = true;
    crackArray.push(new CrackAnimation(ExplosionType.TANK, this.ctx, this));
    PLAYER_DESTROY_AUDIO.play();
  }

  renascenc(player: number) {
    this.lives--;
    this.dir = Direction.UP;
    this.isProtected = true;
    this.protectedTime = 500;
    this.isDestroyed = false;
    let temp = 0;
    if (player === 1) {
      temp = 129;
    } else {
      temp = 256;
    }
    this.x = temp + map!.offsetX;
    this.y = temp + map!.offsetY;
  }
}

/**
 * @description 敵方坦克1
 * @param context 坦克畫布
 */
export class EnemyOne extends Tank {
  ctx: CanvasRenderingContext2D;
  isAppear: boolean;
  times: number;
  lives: number; // 生命值
  isAI: boolean;
  speed: number; // 坦克的速度

  constructor(context: CanvasRenderingContext2D) {
    super(context);
    this.ctx = context;
    this.isAppear = false;
    this.times = 0;
    this.lives = 1;
    this.isAI = true;
    this.speed = 1.5;
  }

  draw() {
    this.times++;
    if (!this.isAppear) {
      const temp = parseInt(`${this.times / 5}`) % 7;
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        ImageBlockCoordinate.enemyBefore[0] + temp * 32,
        ImageBlockCoordinate.enemyBefore[1],
        32,
        32,
        this.x,
        this.y,
        32,
        32
      );
      if (this.times === 34) {
        this.isAppear = true;
        this.times = 0;
        this.shoot(BulletType.ENEMY);
      }
    } else {
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        ImageBlockCoordinate.enemy1[0] + this.dir * this.size,
        ImageBlockCoordinate.enemy1[1],
        32,
        32,
        this.x,
        this.y,
        32,
        32
      );
      // 以移動概率射擊
      if (this.times % 50 === 0) {
        const ra = Math.random();
        if (ra < this.shootRate) {
          this.shoot(BulletType.ENEMY);
        }
        this.times = 0;
      }
      this.move();
    }
  }
}

/**
 * @description 敵方坦克2
 * @param context 坦克畫布
 */
export class EnemyTwo extends Tank {
  ctx: CanvasRenderingContext2D;
  lives: number; // 生命值
  isAppear: boolean; // 是否
  times: number; //
  isAI: boolean; // 是不是AI
  speed: number; // 坦克的速度

  constructor(context: CanvasRenderingContext2D) {
    super(context);
    this.ctx = context;
    this.lives = 2;
    this.isAppear = false;
    this.times = 0;
    this.isAI = true;
    this.speed = 1;
  }

  draw() {
    this.times++;
    if (!this.isAppear) {
      const temp = parseInt(`${this.times / 5}`) % 7;
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        ImageBlockCoordinate.enemyBefore[0] + temp * 32,
        ImageBlockCoordinate.enemyBefore[1],
        32,
        32,
        this.x,
        this.y,
        32,
        32
      );
      if (this.times === 35) {
        this.isAppear = true;
        this.times = 0;
        this.shoot(BulletType.ENEMY);
      }
      this.times = 0;
    } else {
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        ImageBlockCoordinate.enemy2[0] + this.dir * this.size,
        ImageBlockCoordinate.enemy2[1],
        32,
        32,
        this.x,
        this.y,
        32,
        32
      );
      // 以移動概率射擊
      if (this.times % 50 === 0) {
        const ra = Math.random();
        if (ra < this.shootRate) {
          this.shoot(BulletType.ENEMY);
        }
        this.times = 0;
      }
      this.move();
    }
  }
}

/**
 * @description 敵方坦克3
 * @param context 坦克畫布
 */
export class EnemyThree extends Tank {
  ctx: CanvasRenderingContext2D;
  lives: number; // 生命值
  isAppear: boolean; // 是否
  times: number; //
  isAI: boolean; // 是不是AI
  speed: number; // 坦克的速度

  constructor(context: CanvasRenderingContext2D) {
    super(context);
    this.ctx = context;
    this.lives = 3;
    this.isAppear = false;
    this.times = 0;
    this.isAI = true;
    this.speed = 0.5;
  }

  draw() {
    this.times++;
    if (!this.isAppear) {
      const temp = parseInt(`${this.times / 5}`) % 7;
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        ImageBlockCoordinate.enemyBefore[0] + temp * 32,
        ImageBlockCoordinate.enemyBefore[1],
        32,
        32,
        this.x,
        this.y,
        32,
        32
      );
      if (this.times === 35) {
        this.isAppear = true;
        this.times = 0;
        this.shoot(BulletType.ENEMY);
      }
    } else {
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        ImageBlockCoordinate.enemy3[0] + this.dir * this.size + (3 - this.lives) * this.size * 4,
        ImageBlockCoordinate.enemy3[1],
        32,
        32,
        this.x,
        this.y,
        32,
        32
      );
      // 以移動概率射擊
      if (this.times % 50 === 0) {
        const ra = Math.random();
        if (ra < this.shootRate) {
          this.shoot(BulletType.ENEMY);
        }
        this.times = 0;
      }
      this.move();
    }
  }
}
