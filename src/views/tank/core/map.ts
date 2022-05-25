/**
 * @description 地圖
 */
import { Num } from './num';
import MAP_LEVEL from './level';
import { deepClone } from './util';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  MapBlock,
  RESOURCE_IMAGE,
  ImageBlockCoordinate,
} from './const';
export class Map {
  level: number;
  mapLevel: Array<Array<MapBlock>>;
  wallCtx: CanvasRenderingContext2D;
  grassCtx: CanvasRenderingContext2D;
  offsetX: number;
  offsetY: number;
  wTileCount: number;
  hTileCount: number;
  tileSize: number;
  homeSize: number;
  num: Num;
  mapWidth: number;
  mapHeigh: number;
  constructor(wCtx: CanvasRenderingContext2D, gCtx: CanvasRenderingContext2D) {
    this.level = 1;
    this.mapLevel = [];
    this.wallCtx = wCtx;
    this.grassCtx = gCtx;
    this.offsetX = 32;
    this.offsetY = 16;
    this.wTileCount = 26;
    this.hTileCount = 26;
    this.tileSize = 16;
    this.homeSize = 32;
    this.num = new Num(this.wallCtx);
    this.mapWidth = 416;
    this.mapHeigh = 416;
  }

  // 設置地圖等級
  setMapLevel(level: number) {
    this.level = level;
    const tempMap = MAP_LEVEL[this.level - 1];
    this.mapLevel = new Array<Array<MapBlock>>();
    this.mapLevel = deepClone(tempMap);
  }

  // 繪製地圖
  draw() {
    this.wallCtx.fillStyle = '#7f7f7f';
    this.wallCtx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    this.wallCtx.fillStyle = '#000';
    this.wallCtx.fillRect(this.offsetX, this.offsetY, this.mapWidth, this.mapHeigh);

    this.grassCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    for (let i = 0; i < this.hTileCount; i++) {
      for (let j = 0; j < this.wTileCount; j++) {
        if (
          this.mapLevel[i][j] === MapBlock.WALL ||
          this.mapLevel[i][j] === MapBlock.GRID ||
          this.mapLevel[i][j] === MapBlock.WATER ||
          this.mapLevel[i][j] === MapBlock.ICE
        ) {
          this.wallCtx.drawImage(
            RESOURCE_IMAGE,
            this.tileSize * (this.mapLevel[i][j] - 1) + ImageBlockCoordinate.map[0],
            ImageBlockCoordinate.map[1],
            this.tileSize,
            this.tileSize,
            j * this.tileSize + this.offsetX,
            i * this.tileSize + this.offsetY,
            this.tileSize,
            this.tileSize
          );
        } else if (this.mapLevel[i][j] === MapBlock.GRASS) {
          this.grassCtx.drawImage(
            RESOURCE_IMAGE,
            this.tileSize * (this.mapLevel[i][j] - 1) + ImageBlockCoordinate.map[0],
            ImageBlockCoordinate.map[1],
            this.tileSize,
            this.tileSize,
            j * this.tileSize + this.offsetX,
            i * this.tileSize + this.offsetY,
            this.tileSize,
            this.tileSize
          );
        } else if (this.mapLevel[i][j] === MapBlock.HOME) {
          this.wallCtx.drawImage(
            RESOURCE_IMAGE,
            ImageBlockCoordinate.home[0],
            ImageBlockCoordinate.home[1],
            this.homeSize,
            this.homeSize,
            j * this.tileSize + this.offsetX,
            i * this.tileSize + this.offsetY,
            this.homeSize,
            this.homeSize
          );
        }
      }
    }
  }

  // 繪製固定不變的部分
  drawNoChange() {
    // player1
    this.wallCtx.drawImage(
      RESOURCE_IMAGE,
      ImageBlockCoordinate.score[0],
      ImageBlockCoordinate.score[1],
      30,
      32,
      464,
      256,
      30,
      32
    );
    // player2
    this.wallCtx.drawImage(
      RESOURCE_IMAGE,
      30 + ImageBlockCoordinate.score[0],
      ImageBlockCoordinate.score[1],
      30,
      32,
      464,
      304,
      30,
      32
    );
    // 30, 32旗幟的size, 464, 352旗幟在canvas中的位置
    this.wallCtx.drawImage(
      RESOURCE_IMAGE,
      60 + ImageBlockCoordinate.score[0],
      ImageBlockCoordinate.score[1],
      30,
      32,
      464,
      352,
      32,
      30
    );
  }

  // 畫關卡數
  drawLevel() {
    this.num.draw(this.level, 464, 384);
  }

  // 畫右側敵方坦克數
  drawEnemyNum(enemyNum: number) {
    const x = 464;
    const y = 34;
    const enemySize = 16;
    for (let i = 1; i < enemyNum; i++) {
      let tempX = x;
      const tempY = y + parseInt(`${(i + 1) / 2}`) * enemySize;
      if (i % 2 === 0) {
        tempX = x + enemySize;
      }
      this.wallCtx.drawImage(
        RESOURCE_IMAGE,
        92 + ImageBlockCoordinate.score[0],
        ImageBlockCoordinate.score[1],
        14,
        14,
        tempX,
        tempY,
        14,
        14
      );
    }
  }

  /**
   * @totalEnemyNum 敵方坦克總數
   * @enemyNum 已出現的敵方坦克數
   */
  clearEnemyNum(totalEnemyNum: number, enemyNum: number) {
    const x = 466;
    const y = 34 + this.offsetY;
    if (enemyNum <= 0) {
      return;
    }
    const enemySize = 16;
    this.wallCtx.fillStyle = '#7f7f7f';
    const tempX = x + (enemyNum % 2) * enemySize;
    const tempY =
      y +
      (Math.ceil(totalEnemyNum / 2) - 1) * enemySize -
      parseInt(`${(enemyNum - 1) / 2}`) * enemySize;
    this.wallCtx.fillRect(tempX, tempY, 14, 14);
  }

  /**
   * @description 畫坦克的生命數
   * @param lives 生命數
   * @param which 坦克索引: 1代表玩家1, 2代表玩家2
   */
  drawLives(lives: number, which: number) {
    const x = 482;
    let y = 272;
    if (which === 2) {
      y = 320;
    }
    this.wallCtx.fillStyle = '#7f7f7f';
    this.wallCtx.fillRect(x, y, this.num.size, this.num.size);
    this.num.draw(lives, x, y);
  }

  /**
   * @description
   * @param indexArr 需要更新的地圖索引數組， 二維數組，如[[1, 1], [2, 2]]
   * @param target 更新之後的數值
   */
  updateMap(indexArr: Array<Array<number>>, target: number) {
    if (Array.isArray(indexArr) && indexArr.length > 0) {
      const indexSize = indexArr.length;
      for (let i = 0; i < indexSize; i++) {
        const index = indexArr[i];
        this.mapLevel[index[0]][index[1]] = target;
        if (target > 0) {
          this.wallCtx.drawImage(
            RESOURCE_IMAGE,
            this.tileSize * (target - 1) + ImageBlockCoordinate.map[0],
            ImageBlockCoordinate.map[1],
            this.tileSize,
            this.tileSize,
            index[1] * this.tileSize + this.offsetX,
            index[0] * this.tileSize + this.offsetY,
            this.tileSize,
            this.tileSize
          );
        } else {
          this.wallCtx.fillStyle = '#000';
          this.wallCtx.fillRect(
            index[1] * this.tileSize + this.offsetX,
            index[0] * this.tileSize + this.offsetY,
            this.tileSize,
            this.tileSize
          );
        }
      }
    }
  }

  homeHit() {
    this.wallCtx.drawImage(
      RESOURCE_IMAGE,
      ImageBlockCoordinate.home[0] + this.homeSize,
      ImageBlockCoordinate.home[1],
      this.homeSize,
      this.homeSize,
      12 * this.tileSize + this.offsetX,
      24 * this.tileSize + this.offsetY,
      this.homeSize,
      this.homeSize
    );
  }
}
