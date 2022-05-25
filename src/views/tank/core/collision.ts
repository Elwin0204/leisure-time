import type { Bullet } from './bullet';
import type { Tank } from './tank';
import type { Prop } from './prop';
import { Map } from './map';
import { Direction, MapBlock } from './const';
import { map, GamePlay } from './play';

/**
 * @description 檢測2個物體是否碰撞
 * @param object1 物體1
 * @param object2 物體2
 * @param overlap 允許重疊的大小
 * @returns {Boolean} 如果碰撞了, 返回true
 */
export function checkIntersect(
  object1: Bullet | Tank | Prop,
  object2: Bullet | Tank | Prop,
  overlap: number
): boolean {
  //    x-轴                      x-轴
  //  A1------>B1 C1              A2------>B2 C2
  //  +--------+   ^              +--------+   ^
  //  | object1|   | y-轴         | object2|   | y-轴
  //  |        |   |              |        |   |
  //  +--------+  D1              +--------+  D2
  //
  //overlap是重叠的区域值
  const A1 = object1.x + overlap;
  const B1 = object1.x + object1.size - overlap;
  const C1 = object1.y + overlap;
  const D1 = object1.y + object1.size - overlap;

  const A2 = object2.x + overlap;
  const B2 = object2.x + object2.size - overlap;
  const C2 = object2.y + overlap;
  const D2 = object2.y + object2.size - overlap;

  // 假如在x軸重疊
  if ((A1 >= A2 && A1 <= B2) || (B1 >= A2 && B1 <= B2)) {
    // 判斷y軸重疊
    if ((C1 >= C2 && C1 <= D2) || (D1 >= C2 && D1 <= D2)) {
      return true;
    }
  }
  return false;
}

/**
 * @description 坦克與地圖塊碰撞
 * @param tank 坦克對象
 * @param mapobj 地圖對象
 * @returns {Boolean} 如果碰撞, 返回true
 */
export function tankMapCollision(tank: Tank, mapobj: Map): boolean {
  // 移動檢測, 記錄最後一次的移動方向, 根據方向判斷+-overlap
  let tileNum = 0; // 需要檢測的tile數
  let rowIndex = 0; // map中的行索引
  let colIndex = 0; // map中的列索引
  const overlap = 3; // 允許重疊的大小

  // 根據tank的x、y計算map中的row和col
  if (tank.dir === Direction.UP) {
    rowIndex = parseInt(`${(tank.tempY + overlap - mapobj.offsetY) / mapobj.tileSize}`);
    colIndex = parseInt(`${(tank.tempX + overlap - mapobj.offsetX) / mapobj.tileSize}`);
  } else if (tank.dir === Direction.DOWN) {
    rowIndex = parseInt(`${(tank.tempY - overlap - mapobj.offsetY + tank.size) / mapobj.tileSize}`);
    colIndex = parseInt(`${(tank.tempX + overlap - mapobj.offsetX) / mapobj.tileSize}`);
  } else if (tank.dir === Direction.LEFT) {
    rowIndex = parseInt(`${(tank.tempY + overlap - mapobj.offsetY) / mapobj.tileSize}`);
    colIndex = parseInt(`${(tank.tempX + overlap - mapobj.offsetX) / mapobj.tileSize}`);
  } else if (tank.dir === Direction.RIGHT) {
    rowIndex = parseInt(`${(tank.tempY + overlap - mapobj.offsetY) / mapobj.tileSize}`);
    colIndex = parseInt(`${(tank.tempX - overlap - mapobj.offsetX + tank.size) / mapobj.tileSize}`);
  }
  if (
    rowIndex >= mapobj.hTileCount ||
    rowIndex < 0 ||
    colIndex >= mapobj.wTileCount ||
    colIndex < 0
  ) {
    return true;
  }
  if (tank.dir === Direction.UP || tank.dir === Direction.DOWN) {
    // 去除重疊部分
    const tempWidth = parseInt(
      `${tank.tempX - map!.offsetX - colIndex * mapobj.tileSize + tank.size - overlap}`
    );
    if (tempWidth % mapobj.tileSize === 0) {
      tileNum = parseInt(`${tempWidth / mapobj.tileSize}`);
    } else {
      tileNum = parseInt(`${tempWidth / mapobj.tileSize}`) + 1;
    }
    for (let i = 0; i < tileNum && colIndex + i < mapobj.wTileCount; i++) {
      const mapContent = mapobj.mapLevel[rowIndex][colIndex + i];
      if (
        mapContent === MapBlock.WALL ||
        mapContent === MapBlock.WATER ||
        mapContent === MapBlock.HOME ||
        mapContent === MapBlock.ANOTHERHOME
      ) {
        if (tank.dir === Direction.UP) {
          tank.y = mapobj.offsetY + rowIndex * mapobj.tileSize + mapobj.tileSize - overlap;
        } else if (tank.dir === Direction.DOWN) {
          tank.y = mapobj.offsetY + rowIndex * mapobj.tileSize - tank.size + overlap;
        }
        return true;
      }
    }
  } else {
    const tempHeight = parseInt(
      `${tank.tempY - map!.offsetY - rowIndex * mapobj.tileSize - overlap}`
    );
    if (tempHeight % mapobj.tileSize === 0) {
      tileNum = parseInt(`${tempHeight / mapobj.tileSize}`);
    } else {
      tileNum = parseInt(`${tempHeight / mapobj.tileSize}`) + 1;
    }
    for (let i = 0; i < tileNum && rowIndex + i < mapobj.hTileCount; i++) {
      const mapContent = mapobj.mapLevel[rowIndex + i][colIndex];
      if (
        mapContent === MapBlock.WALL ||
        mapContent === MapBlock.GRID ||
        mapContent === MapBlock.WATER ||
        mapContent === MapBlock.HOME ||
        mapContent === MapBlock.ANOTHERHOME
      ) {
        if (tank.dir === Direction.LEFT) {
          tank.x = mapobj.offsetX + colIndex * mapobj.tileSize + mapobj.tileSize - overlap;
        } else if (tank.dir === Direction.RIGHT) {
          tank.x = mapobj.offsetX + colIndex * mapobj.tileSize - tank.size + overlap;
        }
        return true;
      }
    }
  }
  return false;
}

/**
 * @description 子彈與地圖塊的碰撞
 * @param {Bullet} bullet 子彈對象
 * @param {Map} mapobj 地圖對象
 */
export function bulletMapCollision(bullet: Bullet, mapobj: Map): boolean {
  let tileNum = 0; // 需要檢測的tile數
  let rowIndex = 0; // map中的行索引
  let colIndex = 0; // map中的列索引
  const mapChangeIndex = []; // map中需要更新的索引數組
  let result = false; // 是否碰撞
  // 根据bullet的x、y计算出map中的row和col
  if (bullet.dir === Direction.UP) {
    rowIndex = parseInt(`${(bullet.y - mapobj.offsetY) / mapobj.tileSize}`);
    colIndex = parseInt(`${(bullet.x - mapobj.offsetX) / mapobj.tileSize}`);
  } else if (bullet.dir === Direction.DOWN) {
    rowIndex = parseInt(`${(bullet.y - mapobj.offsetY + bullet.size) / mapobj.tileSize}`);
    colIndex = parseInt(`${(bullet.x - mapobj.offsetX) / mapobj.tileSize}`);
  } else if (bullet.dir === Direction.LEFT) {
    rowIndex = parseInt(`${(bullet.y - mapobj.offsetY) / mapobj.tileSize}`);
    colIndex = parseInt(`${(bullet.x - mapobj.offsetX) / mapobj.tileSize}`);
  } else if (bullet.dir === Direction.RIGHT) {
    rowIndex = parseInt(`${(bullet.y - mapobj.offsetY) / mapobj.tileSize}`);
    colIndex = parseInt(`${(bullet.x - mapobj.offsetX + bullet.size) / mapobj.tileSize}`);
  }
  if (
    rowIndex >= mapobj.hTileCount ||
    rowIndex < 0 ||
    colIndex >= mapobj.wTileCount ||
    colIndex < 0
  ) {
    return true;
  }
  if (bullet.dir === Direction.UP || bullet.dir === Direction.DOWN) {
    const tempWidth = parseInt(
      `${bullet.x - map!.offsetX - colIndex * mapobj.tileSize + bullet.size}`
    );
    if (tempWidth % mapobj.tileSize === 0) {
      tileNum = parseInt(`${tempWidth / mapobj.tileSize}`);
    } else {
      tileNum = parseInt(`${tempWidth / mapobj.tileSize}`) + 1;
    }
    for (let i = 0; i < tileNum && colIndex + i < mapobj.wTileCount; i++) {
      const mapContent = mapobj.mapLevel[rowIndex][colIndex + i];
      if (
        mapContent === MapBlock.WALL ||
        mapContent === MapBlock.GRID ||
        mapContent === MapBlock.HOME ||
        mapContent === MapBlock.ANOTHERHOME
      ) {
        result = true;
        if (mapContent === MapBlock.WALL) {
          // 墻被打掉
          mapChangeIndex.push([rowIndex, colIndex + i]);
        } else if (mapContent === MapBlock.GRID) {
          // qs???
        } else {
          GamePlay.setIsGameOver(true);
          break;
        }
      }
    }
  } else {
    const tempHeight = parseInt(
      `${bullet.y - map!.offsetY - rowIndex * mapobj.tileSize + bullet.size}`
    );
    if (tempHeight % mapobj.tileSize === 0) {
      tileNum = parseInt(`${tempHeight / mapobj.tileSize}`);
    } else {
      tileNum = parseInt(`${tempHeight / mapobj.tileSize}`) + 1;
    }
    for (let i = 0; i < tileNum && rowIndex + i < mapobj.hTileCount; i++) {
      const mapContent = mapobj.mapLevel[rowIndex + i][colIndex];
      if (
        mapContent === MapBlock.WALL ||
        mapContent === MapBlock.GRID ||
        mapContent === MapBlock.HOME ||
        mapContent === MapBlock.ANOTHERHOME
      ) {
        result = true;
        if (mapContent === MapBlock.WALL) {
          // 墻被打掉
          mapChangeIndex.push([rowIndex + i, colIndex]);
        } else if (mapContent === MapBlock.GRID) {
          // qs???
        } else {
          GamePlay.setIsGameOver(true);
          break;
        }
      }
    }
  }
  // 更新地圖
  map!.updateMap(mapChangeIndex, 0);
  return result;
}
