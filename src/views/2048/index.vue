<script lang="tsx">
import { defineComponent, computed, ref, onBeforeMount, onMounted, Ref } from 'vue'
import { IMode, IModes, ICoordinate } from '@/typings/game2048.d.ts'
import { Nullable } from '@/typings/common.d.ts'
export default defineComponent({
  name: 'Game2048',
  setup () {
    const generatePanel = (mode: IMode): number[][] => {
      return Array.from(new Array(mode), () => new Array(mode).fill(0))
    }
    const initOneCell = () => {
      while (true) {
        const r = Math.floor(Math.random() * currentMode);
        const c = Math.floor(Math.random() * currentMode);
        if (panelArray.value[r][c] === 0) {
          panelArray.value[r][c] = Math.random() > 0.5 ? 4 : 2;
          break;
        }
      }
    }
    const initCell = (currentMode: IMode) => {
      panelArray.value = generatePanel(currentMode);
      initOneCell();
      initOneCell();
    }
    const score: Ref<number> = ref(0);
    const isWin: Ref<boolean> = ref(false);
    const isGameOver: Ref<boolean> = ref(false);
    let currentMode: IMode = IMode.Easy;
    let borderSpacing = '16.8px';
    let cellSize = '138px';
    const modes: IModes[] = [{
      title: 'Easy',
      value: IMode.Easy
    },{
      title: 'Nomal',
      value: IMode.Nomal
    },{
      title: 'Hard',
      value: IMode.Hard
    }];
    const panelArray: Ref<number[][]> = ref(generatePanel(currentMode));

    const resizeCell = (mode: IMode) => {
      switch (mode) {
        case 3:
          borderSpacing = '16.8px';
          cellSize = '138px';
          break;
        case 4:
          borderSpacing = '14.4px';
          cellSize = '102px';
          break;
        case 5:
          borderSpacing = '13.3px';
          cellSize = '80px';
          break;
        default:
          break;
      }
    }
    
    const changeMode = (evt: MouseEvent) => {
      if (evt.target.dataset.mode) {
        currentMode = Number(evt.target.dataset.mode);
        initCell(currentMode);
        resizeCell(currentMode);
      }
    }
    const findNotZero = (currentRow: number, currentCol: number, start: number, keyCode: string): Nullable<ICoordinate> => {
      if (keyCode === 'ArrowLeft') {
        for (let c=start; c < currentMode; c++) {
          if (panelArray.value[currentRow][c] !== 0) {
            return {r: currentRow, c}
          }
        }
      } else if (keyCode === 'ArrowRight') {
        for (let c=start; c >= 0; c--) {
          if (panelArray.value[currentRow][c] !== 0) {
            return {r: currentRow, c}
          }
        }
      } else if (keyCode === 'ArrowUp') {
        for (let r=start; r < currentMode; r++) {
          if (panelArray.value[r][currentCol] !== 0) {
            return {r, c: currentCol}
          }
        }
      } else if (keyCode === 'ArrowDown') {
        for (let r=start; r >= 0; r--) {
          if (panelArray.value[r][currentCol] !== 0) {
            return {r, c: currentCol}
          }
        }
      }
      return null;
    }
    const handleArrowLeft = (keyCode: string) => {
      let coordinate = null;
      for (let r=0; r < currentMode; r++) {
        for (let c=0; c < currentMode; c++) {
          coordinate = findNotZero(r, c, c+1, keyCode);
          if (!coordinate) break;
          const { r: nextR, c: nextC }  = coordinate;
          if (panelArray.value[r][c] === 0) {
            panelArray.value[r][c] = panelArray.value[nextR][nextC];
            panelArray.value[nextR][nextC] = 0;
            c--;  // find next target is equal to the insteaded value or not
          } else if (panelArray.value[r][c] === panelArray.value[nextR][nextC]) {
            panelArray.value[r][c] = panelArray.value[r][c] * 2;
            panelArray.value[nextR][nextC] = 0;
            score.value += panelArray.value[r][c];
          }
        }
      }
    }
    const handleArrowRight = (keyCode: string) => {
      let coordinate = null;
      for (let r=0; r < currentMode; r++) {
        for (let c=currentMode-1; c >= 0; c--) {
          coordinate = findNotZero(r, c, c-1, keyCode);
          if (!coordinate) break;
          const { r: nextR, c: nextC }  = coordinate;
          if (panelArray.value[r][c] === 0) {
            panelArray.value[r][c] = panelArray.value[nextR][nextC];
            panelArray.value[nextR][nextC] = 0;
            c++;  // find next target is equal to the insteaded value or not
          } else if (panelArray.value[r][c] === panelArray.value[nextR][nextC]) {
            panelArray.value[r][c] = panelArray.value[r][c] * 2;
            panelArray.value[nextR][nextC] = 0;
            score.value += panelArray.value[r][c];
          }
        }
      }
    }
    const handleArrowUp = (keyCode: string) => {
      let coordinate = null;
      for (let c=0; c < currentMode; c++) {
        for (let r=0; r < currentMode; r++) {
          coordinate = findNotZero(r, c, r+1, keyCode);
          if (!coordinate) break;
          const { r: nextR, c: nextC }  = coordinate;
          if (panelArray.value[r][c] === 0) {
            panelArray.value[r][c] = panelArray.value[nextR][nextC];
            panelArray.value[nextR][nextC] = 0;
            r--;  // find next target is equal to the insteaded value or not
          } else if (panelArray.value[r][c] === panelArray.value[nextR][nextC]) {
            panelArray.value[r][c] = panelArray.value[r][c] * 2;
            panelArray.value[nextR][nextC] = 0;
            score.value += panelArray.value[r][c];
          }
        }
      }
    }
    const handleArrowDown = (keyCode: string) => {
      let coordinate = null;
      for (let c=0; c < currentMode; c++) {
        for (let r=currentMode-1; r >= 0; r--) {
          coordinate = findNotZero(r, c, r-1, keyCode);
          if (!coordinate) break;
          const { r: nextR, c: nextC }  = coordinate;
          if (panelArray.value[r][c] === 0) {
            panelArray.value[r][c] = panelArray.value[nextR][nextC];
            panelArray.value[nextR][nextC] = 0;
            r++;  // find next target is equal to the insteaded value or not
          } else if (panelArray.value[r][c] === panelArray.value[nextR][nextC]) {
            panelArray.value[r][c] = panelArray.value[r][c] * 2;
            panelArray.value[nextR][nextC] = 0;
            score.value += panelArray.value[r][c];
          }
        }
      }
    }
    const handleWin = (): boolean => {
      for (let r=0; r < currentMode; r++) {
        for (let c=0; c < currentMode; c++) {
          if (currentMode === 3 && panelArray.value[r][c] === 1024) {
            isWin.value = true;
            return true;
          };
          if (currentMode === 4 && panelArray.value[r][c] === 2048) {
            isWin.value = true;
            return true;
          };
          if (currentMode === 5 && panelArray.value[r][c] === 4096) {
            isWin.value = true;
            return true;
          };
        }
      }
      return false;
    }
    const handleGameOver = (): boolean => {
      for (let r=0; r < currentMode; r++) {
        for (let c=0; c < currentMode; c++) {
          if (panelArray.value[r][c] === 0) return false;
          if (c < currentMode-1 && panelArray.value[r][c] === panelArray.value[r][c+1]) return false;
          if (r < currentMode-1 && panelArray.value[r][c] === panelArray.value[r+1][c]) return false;
        }
      }
      isGameOver.value = true;
      return true;
    }
    const handleKeyDown = (evt: KeyboardEvent) => {
      const panelArrayBefore = JSON.parse(JSON.stringify(panelArray.value));
      const keyCode = evt.code;
      switch (keyCode) {
        case 'ArrowUp':
          handleArrowUp('ArrowUp');
          break;
        case 'ArrowDown':
          handleArrowDown('ArrowDown');
          break;
        case 'ArrowLeft':
          handleArrowLeft('ArrowLeft')
          break;
        case 'ArrowRight':
          handleArrowRight('ArrowRight')
          break;
        default:
          break;
      }
      if (handleWin()) return;
      if (handleGameOver()) return;
      const panelArrayAfter = panelArray.value;
      if (panelArrayBefore.toString() !== panelArrayAfter.toString()) {
        initOneCell();
      }
    }
    onBeforeMount(() => {
      initCell(currentMode);
    })
    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown)
    })
    return () => (
      <div class="game2048-wrapper">
        <div class="game2048">
          <div class="header">
          </div>
          <div class="content">
            <table style={{ borderSpacing: borderSpacing }}>
              <tbody>
                {
                  panelArray.value.map(row => <tr>
                    {
                      row.map(cell => <td>
                        <div
                          class={[
                            'cell',
                            `n${cell}`
                          ]}
                          style={{ width: cellSize, height: cellSize }}>{ cell }</div>
                      </td>)
                    }
                  </tr>)
                }
              </tbody>
            </table>
            <div class="right-side-wrapper">
              <div class="right-panel">
                <div class="result">
                  <div class="tips">
                    {
                      !isWin.value && !isGameOver.value ? <span><svg-icon icon-class="cartoon" icon-size="32"></svg-icon>Have Fun</span> : ''
                    }
                    {
                      isWin.value ? <span><svg-icon icon-class="win" icon-size="32"></svg-icon>You Win</span> : ''
                    }
                    {
                      isGameOver.value ? <span><svg-icon icon-class="lose" icon-size="32"></svg-icon>You Lose</span> : ''
                    }
                  </div>
                  <div class="score">score: {score.value}</div>
                </div>
                <div class="mode">
                  <h1 class="title">Mode</h1>
                  <ul onClick={ changeMode }>
                    {
                      modes.map(mode => (
                        <li data-mode={ mode.value }>{ `${mode.title}: ${mode.value}X${mode.value}`}</li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
</script>
<style lang="less" scoped>
.game2048-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  .game2048 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28px;
      span:first-child {
        color: #75c82b;
      }
      span:last-child {
        color: #FF3333;
      }
    }
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.content {
  position: relative;
  overflow: hidden;
  .right-side-wrapper {
    float: left;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    margin: 0 12px;
    font-size: 32px;
    color: #fff;
    .right-panel {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      background-color: #bbada0;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      .result {
        border-radius: 10px;
        margin: 0 0 12px;
        padding: 16px;
        .tips {
          font-size: 24px;
          color: #5cb38e;
          margin-bottom: 12px;
        }
        .score {
          color: #776e65;
          white-space: nowrap;
        }
      }
      .mode {
        .title {
          font-size: 32px;
          text-align: center;
        }
        ul {
          padding: 0 16px;
          li {
            border-radius: 10px;
            padding: 12px 20px;
            margin: 12px 0;
            background-color: #ede0c8;
            cursor: pointer;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
table {
  float: left;
  margin-right: 260px;
  table-layout : fixed;
  border: 0;
  border-collapse: separate;
  background-color: #bbada0;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  cellpadding: 0;
  td {
    padding: 0;
  }
  .cell {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    border-radius: 6px;
    font-size: 60px;
    background-color: #ccc0b3;
    transition: all .3s ease;
  }
  .n2 {
    background-color: #eee3da;
  }

  .n4 {
    background-color: #ede0c8;;
  }

  .n8 {
    background-color: #f2b179;
  }

  .n16 {
    background-color: #f59563;
  }

  .n32 {
    background-color: #f67c5f;
  }

  .n64 {
    background-color: #f65e3b;
  }

  .n128 {
    background-color: #edcf72;
  }

  .n256 {
    background-color: #edcc61;
  }

  .n512 {
    background-color: #9c0;
  }

  .n1024 {
    background-color: #33b5e5;
  }

  .n2048 {
    background-color: #09c;
  }

  .n4096 {
    background-color: #a6c;
  }

  .n8192 {
    background-color: #93c;
  }

  .n2,
  .n4 {
    color: #776e65;
  }
}
</style>