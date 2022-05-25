/* eslint-disable camelcase */
/**
 * @description 定義靜態變量
 */
export const SCREEN_WIDTH = 512; // 屏幕寬
export const SCREEN_HEIGHT = 448; // 屏幕高

/**
 * @description 圖片資源
 */
import GIF_Menu from '@/views/tank/resource/images/menu.gif';
import GIF_TankAll from '@/views/tank/resource/images/tankAll.gif';
const MENU_IMAGE = new Image();
MENU_IMAGE.src = GIF_Menu;
const RESOURCE_IMAGE = new Image();
RESOURCE_IMAGE.src = GIF_TankAll;
export { MENU_IMAGE, RESOURCE_IMAGE };

/**
 * @description 圖塊位置坐標
 */
export const ImageBlockCoordinate = {
  selectTank: [128, 96],
  stageLevel: [396, 96],
  num: [256, 96],
  map: [0, 96],
  home: [256, 0],
  score: [0, 112],
  player: [0, 0],
  protected: [160, 96],
  enemyBefore: [256, 32],
  enemy1: [0, 32],
  enemy2: [128, 32],
  enemy3: [0, 64],
  bullet: [80, 96],
  tankBomb: [0, 160],
  bulletBomb: [320, 0],
  over: [384, 64],
  prop: [256, 110],
};

/**
 * @description 聲音資源
 */
import MP3_Start from '@/views/tank/resource/audio/start.mp3';
import MP3_BulletCrack from '@/views/tank/resource/audio/bulletCrack.mp3';
import MP3_TankCrack from '@/views/tank/resource/audio/tankCrack.mp3';
import MP3_PlayerCrack from '@/views/tank/resource/audio/playerCrack.mp3';
import MP3_Move from '@/views/tank/resource/audio/move.mp3';
import MP3_Attack from '@/views/tank/resource/audio/attack.mp3';
import MP3_Prop from '@/views/tank/resource/audio/prop.mp3';
export const START_AUDIO = new Audio(MP3_Start);
export const BULLET_DESTROY_AUDIO = new Audio(MP3_BulletCrack);
export const TANK_DESTROY_AUDIO = new Audio(MP3_TankCrack);
export const PLAYER_DESTROY_AUDIO = new Audio(MP3_PlayerCrack);
export const MOVE_AUDIO = new Audio(MP3_Move);
export const ATTACK_AUDIO = new Audio(MP3_Attack);
export const PROP_AUDIO = new Audio(MP3_Prop);

/**
 * @description 遊戲狀態
 */
export enum GameState {
  GAME_STATE_MENU = 0,
  GAME_STATE_INIT = 1,
  GAME_STATE_START = 2,
  GAME_STATE_OVER = 3,
  GAME_STATE_WIN = 4,
}

/**
 * @description 地圖塊
 */
export enum MapBlock {
  WALL = 1,
  GRID = 2,
  GRASS = 3,
  WATER = 4,
  ICE = 5,
  HOME = 9,
  ANOTHERHOME = 8,
}

/**
 * @description 坦克及子彈的四個方向
 */
export enum Direction {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3,
}

/**
 * @description stage dir
 */
export enum StageDir {
  CLOSE = 1,
  OPEN = -1,
}

/**
 * @description
 */
export const ENEMY_LOCATION = [192, 0, 384];

/**
 * @description 子彈類型
 */
export enum BulletType {
  PLAYER = 1,
  ENEMY = 2,
}

/**
 * @description 爆炸類型
 */
export enum ExplosionType {
  TANK = 'tank',
  BULLET = 'bullet',
}
