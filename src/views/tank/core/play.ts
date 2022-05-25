/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/**
 * @description 遊戲邏輯部分
 */
import {
  Direction,
  ENEMY_LOCATION,
  GameState,
  BulletType,
  ImageBlockCoordinate,
  MapBlock,
  PLAYER_DESTROY_AUDIO,
  RESOURCE_IMAGE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from './const';
import type { Bullet } from './bullet';
import { Tank, PlayTank, EnemyOne, EnemyTwo, EnemyThree } from './tank';
import type { CrackAnimation } from './crackAnimation';
import { Menu } from './menu';
import { Map } from './map';
import { Stage } from './stage';
import { Keyboard } from './keyboard';
import { Prop } from './prop';

export let ctx: CanvasRenderingContext2D | null = null; // 2d畫布
export let wallCtx: CanvasRenderingContext2D | null = null; // 地圖畫布
export let grassCtx: CanvasRenderingContext2D | null = null; // 菜地畫布
export let tankCtx: CanvasRenderingContext2D | null = null; // 坦克畫布
export let overCtx: CanvasRenderingContext2D | null = null; // 結束畫布
export let menu: Menu | null = null; // 菜單
export let stage: Stage | null = null; // 舞台
export let map: Map | null = null; // 地圖
export let player1: PlayTank | null = null; // 玩家1
export let player2: PlayTank | null = null; // 玩家2
export let prop: Prop | null = null;
export let enemyArray: Array<EnemyOne | EnemyTwo | EnemyThree> = []; // 敵方坦克
export let bulletArray: Array<Bullet> = []; // 子彈數組
export let keys: Array<Keyboard> = []; // 記錄按下的按鍵
export let crackArray: Array<CrackAnimation> = []; // 爆炸數組
export let gameState: GameState = GameState.GAME_STATE_MENU;
export let level = 1;
export let maxEnemy = 20;
export let maxAppearEnemy = 5;
export let appearEnemy = 0;
export let mainframe = 0;
export let isGameOver = false;
export let overX = 176;
export let overY = 384;
export let enemyStopTime = 0;
export let homeProtectTime = -1;
export let propTime = 300;

export class GamePlay {
  static initScreen() {
    const canvas = document.querySelector('#JS_StageCanvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.setAttribute('width', `${SCREEN_WIDTH}`);
    canvas.setAttribute('height', `${SCREEN_HEIGHT}`);
    const wallCanvas = document.querySelector('#JS_WallCanvas') as HTMLCanvasElement;
    wallCtx = wallCanvas.getContext('2d') as CanvasRenderingContext2D;
    wallCanvas.setAttribute('width', `${SCREEN_WIDTH}`);
    wallCanvas.setAttribute('height', `${SCREEN_HEIGHT}`);
    const grassCanvas = document.querySelector('#JS_GrassCanvas') as HTMLCanvasElement;
    grassCtx = grassCanvas.getContext('2d') as CanvasRenderingContext2D;
    grassCanvas.setAttribute('width', `${SCREEN_WIDTH}`);
    grassCanvas.setAttribute('height', `${SCREEN_HEIGHT}`);
    const tankCanvas = document.querySelector('#JS_TankCanvas') as HTMLCanvasElement;
    tankCtx = tankCanvas.getContext('2d') as CanvasRenderingContext2D;
    tankCanvas.setAttribute('width', `${SCREEN_WIDTH}`);
    tankCanvas.setAttribute('height', `${SCREEN_HEIGHT}`);
    const overCanvas = document.querySelector('#JS_OverCanvas') as HTMLCanvasElement;
    overCtx = overCanvas.getContext('2d') as CanvasRenderingContext2D;
    overCanvas.setAttribute('width', `${SCREEN_WIDTH}`);
    overCanvas.setAttribute('height', `${SCREEN_HEIGHT}`);
    const canvasGroup = document.querySelector('#JS_CanvasGroup') as HTMLCanvasElement;
    canvasGroup.style.width = `${SCREEN_WIDTH}px`;
    canvasGroup.style.height = `${SCREEN_HEIGHT}px`;
    canvasGroup.style.backgroundColor = '#000';
  }

  static initGlobalVariable() {
    menu = new Menu(ctx as CanvasRenderingContext2D);
    stage = new Stage(ctx as CanvasRenderingContext2D, level);
    map = new Map(wallCtx as CanvasRenderingContext2D, grassCtx as CanvasRenderingContext2D);
    player1 = new PlayTank(tankCtx as CanvasRenderingContext2D);
    player1.x = 129 + map.offsetX;
    player1.y = 385 + map.offsetY;
    player2 = new PlayTank(tankCtx as CanvasRenderingContext2D);
    player2.offsetX = 128; // player2的圖片x與圖片1相距128
    player2.x = 256 + map.offsetX;
    player2.y = 385 + map.offsetY;
    appearEnemy = 0; // 已出現的地方坦克
    enemyArray = []; // 地方坦克
    bulletArray = []; // 子彈數組
    keys = []; // 記錄按下的按鍵
    crackArray = []; // 爆炸數組
    isGameOver = false;
    overX = 176;
    overY = 384;
    overCtx!.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    enemyStopTime = 0;
    homeProtectTime = -1;
    propTime = 1000;
  }

  static initMap() {
    map!.setMapLevel(level);
    map!.draw();
    GamePlay.drawLives();
  }

  static drawLives() {
    map!.drawLives(player1!.lives, 1);
    map!.drawLives(player2!.lives, 2);
  }

  static drawBullet() {
    if (Array.isArray(bulletArray) && bulletArray.length > 0) {
      for (let i = 0; i < bulletArray.length; i++) {
        const bulletObj = bulletArray[i];
        if (bulletObj.isDestroyed) {
          bulletObj.owner.isShooting = false;
          bulletArray = bulletArray.filter((item, index) => index !== i);
          i--;
        } else {
          bulletObj.draw();
        }
      }
    }
  }

  static keyEvent() {
    if (keys.includes(Keyboard.W)) {
      player1!.dir = Direction.UP;
      player1!.hit = false;
      player1!.move();
    } else if (keys.includes(Keyboard.S)) {
      player1!.dir = Direction.DOWN;
      player1!.hit = false;
      player1!.move();
    } else if (keys.includes(Keyboard.A)) {
      player1!.dir = Direction.LEFT;
      player1!.hit = false;
      player1!.move();
    } else if (keys.includes(Keyboard.D)) {
      player1!.dir = Direction.RIGHT;
      player1!.hit = false;
      player1!.move();
    }

    if (keys.includes(Keyboard.UP)) {
      player2!.dir = Direction.UP;
      player2!.hit = false;
      player2!.move();
    } else if (keys.includes(Keyboard.DOWN)) {
      player2!.dir = Direction.DOWN;
      player2!.hit = false;
      player2!.move();
    } else if (keys.includes(Keyboard.LEFT)) {
      player2!.dir = Direction.LEFT;
      player2!.hit = false;
      player2!.move();
    } else if (keys.includes(Keyboard.RIGHT)) {
      player2!.dir = Direction.RIGHT;
      player2!.hit = false;
      player2!.move();
    }
  }

  static addEnemyTank() {
    if (!Array.isArray(enemyArray) || enemyArray.length >= maxAppearEnemy || maxEnemy === 0) {
      return;
    }
    appearEnemy++;
    const rand = parseInt(`${Math.random() * 3}`);
    let obj: EnemyOne | EnemyTwo | EnemyThree = new EnemyOne(tankCtx as CanvasRenderingContext2D);
    if (rand === 0) {
      obj = new EnemyOne(tankCtx as CanvasRenderingContext2D);
    } else if (rand === 1) {
      obj = new EnemyTwo(tankCtx as CanvasRenderingContext2D);
    } else if (rand === 2) {
      obj = new EnemyThree(tankCtx as CanvasRenderingContext2D);
    }
    obj.x = ENEMY_LOCATION[parseInt(`${Math.random() * 3}`)] + map!.offsetX;
    obj.y = map!.offsetY;
    obj.dir = Direction.DOWN;
    enemyArray.push(obj);
    // 更新地圖右側坦克數
    map!.clearEnemyNum(maxEnemy, appearEnemy);
  }

  static drawEnemyTanks() {
    if (Array.isArray(enemyArray) && enemyArray.length > 0) {
      for (let i = 0; i < enemyArray.length; i++) {
        const enemyObj = enemyArray[i];
        if (enemyObj.isDestroyed) {
          enemyArray = enemyArray.filter((item, index) => index !== i);
          i--;
        } else {
          enemyObj.draw();
        }
      }
    }
    if (enemyStopTime > 0) {
      enemyStopTime--;
    }
  }

  static drawCrack() {
    if (crackArray != null && crackArray.length > 0) {
      for (let i = 0; i < crackArray.length; i++) {
        const crackObj = crackArray[i];
        if (crackObj.isOver) {
          crackArray = crackArray.filter((item, index) => index !== i);
          i--;
          if (crackObj.owner == player1) {
            player1.renascenc(1);
          } else if (crackObj.owner == player2) {
            player2.renascenc(2);
          }
        } else {
          crackObj.draw();
        }
      }
    }
  }

  static drawProp() {
    const rand = Math.random();
    if (rand < 0.4 && prop == null) {
      prop = new Prop(overCtx as CanvasRenderingContext2D);
      prop.init();
    }
    if (prop != null) {
      prop.draw();
      if (prop.isDestroyed) {
        prop = null;
        propTime = 1000;
      }
    }
  }

  static homeNoProtected() {
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
    map!.updateMap(mapChangeIndex, MapBlock.WALL);
  }

  static drawAll() {
    tankCtx!.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    if (player1!.lives > 0) {
      player1!.draw();
    }
    if (player2!.lives > 0) {
      player2!.draw();
    }
    GamePlay.drawLives();
    if (appearEnemy < maxEnemy) {
      if (mainframe % 100 === 0) {
        GamePlay.addEnemyTank();
        mainframe = 0;
      }
      mainframe++;
    }
    GamePlay.drawEnemyTanks();
    GamePlay.drawBullet();
    GamePlay.drawCrack();
    GamePlay.keyEvent();
    if (propTime <= 0) {
      GamePlay.drawProp();
    } else {
      propTime--;
    }
    if (homeProtectTime > 0) {
      homeProtectTime--;
    } else if (homeProtectTime === 0) {
      homeProtectTime = -1;
      GamePlay.homeNoProtected();
    }
  }

  static nextLevel() {
    level++;
    if (level === 22) {
      level = 1;
    }
    GamePlay.initGlobalVariable();
    // 只有一個玩家
    if (menu!.playNum === 1) {
      player2!.lives = 0;
    }
    stage!.init(level);
    gameState = GameState.GAME_STATE_INIT;
  }

  static prevLevel() {
    level--;
    if (level === 0) {
      level = 21;
    }
    GamePlay.initGlobalVariable();
    // 只有一個玩家
    if (menu!.playNum === 1) {
      player2!.lives = 0;
    }
    stage!.init(level);
    gameState = GameState.GAME_STATE_INIT;
  }

  static gameOver() {
    overCtx!.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    overCtx!.drawImage(
      RESOURCE_IMAGE,
      ImageBlockCoordinate.over[0],
      ImageBlockCoordinate.over[1],
      64,
      32,
      overX + map!.offsetX,
      overY + map!.offsetY,
      64,
      32
    );
    overY -= 2;
    if (overY <= parseInt(`${map!.mapHeigh / 2}`)) {
      GamePlay.initGlobalVariable();
      // 只有一個玩家
      if (menu!.playNum === 1) {
        player2!.lives = 0;
      }
      gameState = GameState.GAME_STATE_MENU;
    }
  }

  static gameLoop() {
    switch (gameState) {
      case GameState.GAME_STATE_MENU:
        menu!.draw();
        break;
      case GameState.GAME_STATE_INIT:
        stage!.draw();
        if (stage!.isReady === true) {
          gameState = GameState.GAME_STATE_START;
        }
        break;
      case GameState.GAME_STATE_START:
        GamePlay.drawAll();
        if (isGameOver || (player1!.lives <= 0 && player2!.lives <= 0)) {
          gameState = GameState.GAME_STATE_OVER;
          map!.homeHit();
          PLAYER_DESTROY_AUDIO.play();
        }
        if (appearEnemy === maxEnemy && enemyArray.length === 0) {
          gameState = GameState.GAME_STATE_WIN;
        }
        break;
      case GameState.GAME_STATE_WIN:
        GamePlay.nextLevel();
        break;
      case GameState.GAME_STATE_OVER:
        GamePlay.gameOver();
        break;
      default:
        break;
    }
  }

  static handleKeydown(e: KeyboardEventInit) {
    switch (gameState) {
      case GameState.GAME_STATE_MENU:
        if (e.keyCode === Keyboard.ENTER) {
          gameState = GameState.GAME_STATE_INIT;
          if (menu!.playNum === 1) {
            player2!.lives = 0;
          }
        } else {
          let n = 0;
          if (e.keyCode === Keyboard.DOWN) {
            n = 1;
          } else if (e.keyCode === Keyboard.UP) {
            n = -1;
          }
          menu!.next(n);
        }
        break;
      case GameState.GAME_STATE_START:
        if (!keys.includes(e.keyCode as Keyboard)) {
          keys.push(e.keyCode as Keyboard);
        }
        // 射擊
        if (e.keyCode === Keyboard.SPACE && player1!.lives > 0) {
          player1!.shoot(BulletType.PLAYER);
        } else if (e.keyCode === Keyboard.ENTER && player2!.lives > 0) {
          player2!.shoot(BulletType.ENEMY);
        } else if (e.keyCode === Keyboard.N) {
          GamePlay.nextLevel();
        } else if (e.keyCode === Keyboard.P) {
          GamePlay.prevLevel();
        }
        break;
      default:
        break;
    }
  }

  static handleKeyup(e: KeyboardEventInit) {
    keys = keys.filter((item) => item !== e.keyCode);
  }

  static setEnemyStopTime(value: number) {
    enemyStopTime = value;
  }

  static setHomeProtectTime(value: number) {
    homeProtectTime = value;
  }
  static setIsGameOver(value: boolean) {
    isGameOver = value;
  }
}
