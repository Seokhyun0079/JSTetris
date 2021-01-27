const shape1 = [
  [tdStyleBlockClass, tdStyleBlockClass, tdStyleBlockClass],
  [false, tdStyleBlockClass],
];
const shape2 = [
  [tdStyleBlockClass, tdStyleBlockClass],
  [tdStyleBlockClass, tdStyleBlockClass],
];
const shape3 = [
  [tdStyleBlockClass, tdStyleBlockClass],
  [tdStyleBlockClass, false],
  [tdStyleBlockClass, false],
];
const shape4 = [
  [tdStyleBlockClass],
  [tdStyleBlockClass],
  [tdStyleBlockClass],
  [tdStyleBlockClass],
];

const shape5 = [
  [tdStyleBlockClass, tdStyleBlockClass],
  [false, tdStyleBlockClass],
  [false, tdStyleBlockClass],
];
/**
 * テスト用ブロック
 */
const testShape = [
  [
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
    tdStyleBlockClass,
  ],
];

const shapeList = [shape1, shape2, shape3, shape4, shape5];

class Block {
  constructor() {
    /**
     * ランダムにブロックを生成する。
     */
    this.block = shapeList[Math.round(Math.random() * 10) % shapeList.length];
    this.nextBlock =
      shapeList[Math.round(Math.random() * 10) % shapeList.length];
    this.x = tetrisBoardMaxCol / 2 - 1;
    this.y = 0;
    this.runable = true;
    this.direction = 0;
    this.drawNextBlock();
  }

  moveBlock() {
    this.firstLineCheck();
    /**
     * 動作を一時的に止める必要がある場合は
     * runalbeをfalseにする。
     */
    if (this.runable) {
      let conflictFlag = this.conflictCheck();
      let clearLines = this.getClearLines();
      let endPoint = this.blockFalling(
        this.getBlockBottomStartPoints(this.block)
      );
      this.blockFallingPointDraw(endPoint);
      if (clearLines) {
        this.runable = false;
        this.clearLines(clearLines);
        this.lineDown(clearLines);
        this.runable = true;
      }
      this.drawBlock(conflictFlag);
      if (conflictFlag) this.init();
      else this.dropDown();
    }
  }
  /**
   *  最初の行に停止ブロックが存在＝GAMEOVER判定
   */
  firstLineCheck() {
    let tr = document.getElementById(rowIdPrefix + 0);
    for (let i = 0; i < tetrisBoardMaxCol; i++) {
      let styleClass = tr.childNodes[i].className;
      if (styleClass === tdStyleStopBlockClass) {
        this.runable = false;
      }
    }
  }
  /**
   *  落下予想地点を元に予想落下地点を描く
   */
  blockFallingPointDraw(endPoint) {
    for (let i = 0; i < this.block.length; i++) {
      let tr = document.getElementById(rowIdPrefix + (endPoint + i));
      for (let j = 0; j < this.block[i].length; j++) {
        let td = tr.childNodes[j + this.x];
        if (this.block[i][j] && td.className != tdStyleStopBlockClass)
          td.setAttribute("class", whiteBlockStyle);
      }
    }
  }

  /**
   * ブロックの方向転換
   */
  blockLeftDirectionChange() {
    let newBlcokRow = [];
    for (let i = 0; i < this.block[0].length; i++) {
      let newBlockCol = [];
      for (let j = 0; j < this.block.length; j++) {
        newBlockCol.push(this.block[j][i]);
      }
      newBlcokRow.push(newBlockCol);
    }
    this.block = newBlcokRow;
    this.direction = (this.direction + 1) % 3;
  }
  /**
   * ブロックの方向転換
   */
  blockRightDirectionChange() {
    let newBlcokRow = [];
    for (let i = this.block[0].length - 1; i > -1; i--) {
      let newBlockCol = [];
      for (let j = 0; j < this.block.length; j++) {
        newBlockCol.push(this.block[j][i]);
      }
      newBlcokRow.push(newBlockCol);
    }
    if (
      this.sideBlockConflictCehck(
        this.getBlockRightStartPoints(newBlcokRow),
        this.direction % 1 == 0 ? 1 : -1
      ) !== 0
    ) {
      this.block = newBlcokRow;
      this.direction = (this.direction + 1) % 3;
    }
  }
  /**
   * ブロックを左右に動かせる。
   * @param {*} key 入力キー
   */
  moveSide(key) {
    if (
      key == "ArrowRight" &&
      this.x + this.block[0].length < tetrisBoardMaxCol
    ) {
      let blockStartPoint = this.getBlockRightStartPoints(this.block);
      this.x = this.x + this.sideBlockConflictCehck(blockStartPoint, +1);
    }
    if (key == "ArrowLeft" && this.x > 0) {
      let blockStartPoint = this.getBlockLeftStartPoints(this.block);
      this.x = this.x + this.sideBlockConflictCehck(blockStartPoint, -1);
    }
  }

  /**
   * ブロックの左の部分の形をとる。
   * @param {*} tagetBlock　対象のブロック
   */
  getBlockLeftStartPoints() {
    let blockStartPoint = [];
    for (let i = 0; i < this.block.length; i++) {
      for (let j = 0; j < this.block[i].length; j++) {
        if (this.block[i][j] === tdStyleBlockClass) {
          blockStartPoint.push(j);
          break;
        }
      }
    }
    return blockStartPoint;
  }
  /**
   * ブロックの右の部分の形をとる。
   * @param {*} tagetBlock　対象のブロック
   */
  getBlockRightStartPoints(tagetBlock) {
    let blockStartPoint = [];
    for (let i = 0; i < tagetBlock.length; i++) {
      for (let j = tagetBlock[i].length - 1; j > -1; j--) {
        if (tagetBlock[i][j] === tdStyleBlockClass) {
          blockStartPoint.push(j);
          break;
        }
      }
    }
    return blockStartPoint;
  }
  /**
   * ブロックのしたの部分の形をとる。
   * @param {*} tagetBlock　対象のブロック
   */
  getBlockBottomStartPoints(tagetBlock) {
    let blockStartPoint = [];
    for (let i = tagetBlock[0].length - 1; i > -1; i--) {
      for (let j = tagetBlock.length - 1; j > -1; j--) {
        if (tagetBlock[j][i] === tdStyleBlockClass) {
          blockStartPoint.push(j);
          break;
        }
      }
    }
    return blockStartPoint;
  }
  /**
   * ブロックの落下予想地点を計算する。
   * blockStartPoint ブロックの核列の一番下
   */
  blockFalling(blockStartPoint) {
    let result = tetrisBoardMaxRow - 1;
    for (let i = 0; i < blockStartPoint.length; i++) {
      for (let j = this.y + 1; j < tetrisBoardMaxRow; j++) {
        let td = document.getElementById(rowIdPrefix + j).childNodes[
          this.x + i
        ];
        if (
          td.className === tdStyleStopBlockClass &&
          result > j - (blockStartPoint[i] + 1)
        ) {
          result = j - (blockStartPoint[i] + 1);
          break;
        }
        if (result === tetrisBoardMaxRow - 1) {
          result = tetrisBoardMaxRow - this.block.length;
        }
      }
    }
    return result < 0 ? 0 : result;
  }
  /**
   *ブロックを左右で動かせるか判断するメソッド。
   * @param {*} blockStartPoint　ブロックが始まるポイント
   * @param {*} toMove　ブロックを動かせる方向
   */
  sideBlockConflictCehck(blockStartPoint, toMove) {
    for (let i = 0; i < blockStartPoint.length && this.x !== 0; i++) {
      let tr = document.getElementById(rowIdPrefix + (this.y + i));
      let td = tr.childNodes[this.x + blockStartPoint[i] + toMove];
      if (!td || td.className === tdStyleStopBlockClass) {
        return 0;
      }
    }
    return toMove;
  }

  /**
   * ブロックの現在位置を描く。
   * @param {*} conflictFlag 衝突フラグ
   */

  drawBlock(conflictFlag) {
    for (let i = 0; i < this.block.length; i++) {
      let tr = document.getElementById(rowIdPrefix + (this.y + i));
      for (let j = 0; j < this.block[i].length; j++) {
        let blockStyle = this.block[i][j];
        /**
         *衝突している場合はブロックを停止する。
         */
        if (conflictFlag) blockStyle = this.changeBlockStyle(blockStyle);
        /**ブロックのスタイルが存在する場合のみ上書きする */
        if (blockStyle)
          tr.childNodes[j + this.x].setAttribute("class", blockStyle);
      }
    }
  }
  /**
   * 次のブロックを画面の右側に描く
   */
  drawNextBlock() {
    for (let i = 0; i < 10; i++) {
      let tr = document.getElementById(nextRowIdPrefix + i);
      for (let j = 0; j < 10; j++) {
        let blockStyle = "tdStyleDefaultClass";
        if (i === 0 || i === 9 || j == 9 || j == 0) {
          blockStyle = redBlockStyle;
        }
        tr.childNodes[j].setAttribute("class", blockStyle);
      }
    }
    for (let i = 0; i < this.nextBlock.length; i++) {
      let tr = document.getElementById(nextRowIdPrefix + (4 + i));
      for (let j = 0; j < this.nextBlock[i].length; j++) {
        let blockStyle = this.nextBlock[i][j];
        if (blockStyle) tr.childNodes[j + 4].setAttribute("class", blockStyle);
      }
    }
  }
  /**
   * ブロックが最後の行に届いた時実行されるメソッド。
   * 新しいブロックを作り出す。
   */
  init() {
    this.y = 0;
    this.x = tetrisBoardMaxCol / 2 - 1;
    this.block = this.nextBlock;
    this.nextBlock =
      shapeList[Math.round(Math.random() * 10) % shapeList.length];
    this.drawNextBlock();
  }
  /**
   * ブロック衝突チェック
   */
  conflictCheck() {
    return this.conflictCheckToBottom() || this.conflictCheckToBlock();
  }
  /**
   * ブロックを停止ブロックへスタイルを変換する。
   */
  changeBlockStyle(blockStyle) {
    if (blockStyle === tdStyleBlockClass) return tdStyleStopBlockClass;
    else return blockStyle;
  }
  /**
   * ブロック下へ移動する。
   */
  dropDown() {
    this.y += 1;
  }
  /**
   * ブロックが一番下までたどりついているか、ないかを判断する。
   */
  conflictCheckToBottom() {
    if (this.y === tetrisBoardMaxRow - this.block.length) {
      return true;
    }
    return false;
  }
  /**
   *停止ブロックと衝突したかを確認する。
   */
  conflictCheckToBlock() {
    for (let i = 0; i < this.block.length; i++) {
      let tr = document.getElementById(rowIdPrefix + (this.y + i));
      let underTr = document.getElementById(rowIdPrefix + (this.y + i + 1));
      for (let j = 0; j < this.block[i].length; j++) {
        let blockStyle = this.block[i][j];
        let underTdStyle = underTr.childNodes[j + this.x].className;
        if (
          blockStyle === tdStyleBlockClass &&
          underTdStyle === tdStyleStopBlockClass
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 以前の行に残っているスタイルをけす。
   *
   */
  claerPrevLine() {
    if (this.y === 0) {
      return;
    }

    for (let i = 0; i < tetrisBoardMaxRow; i++) {
      let tr = document.getElementById(rowIdPrefix + i);
      for (let j = 0; j < tr.childNodes.length; j++) {
        if (tr.childNodes[j].className !== tdStyleStopBlockClass) {
          tr.childNodes[j].setAttribute("class", tdStyleDefaultClass);
        }
      }
    }
  }

  /**
   * 行全体が停止ブロックである行を検索する。
   */

  getClearLines() {
    let clearLines = [];
    for (let i = 0; i < tetrisBoardMaxRow; i++) {
      let clearLineFlag = true;
      let tr = document.getElementById(rowIdPrefix + i);
      for (let j = 0; j < tetrisBoardMaxCol; j++) {
        let blockStyle = tr.childNodes[j].className;
        if (blockStyle !== tdStyleStopBlockClass) {
          clearLineFlag = false;
        }
      }
      if (clearLineFlag) clearLines.push(i);
    }
    return clearLines;
  }

  /**
   * 行全体が停止ブロックだった場合、その行を消す。
   * @param {*} lineNumbers 消える行番号
   */

  clearLines(lineNumbers) {
    for (let i = 0; i < lineNumbers.length; i++) {
      let tr = document.getElementById(rowIdPrefix + lineNumbers[i]);
      var start = new Date().getTime();
      while (new Date().getTime() < start + 1000);
      for (let j = 0; j < tetrisBoardMaxCol; j++) {
        tr.childNodes[j].setAttribute("class", tdStyleDefaultClass);
      }
    }
  }
  /**
   * 行全体が停止ブロックだった場合、消える行数分下に移動させる。
   * @param {*} lineNumbers 消える行番号
   */
  lineDown(lineNumbers) {
    for (let i = 0; i < lineNumbers.length; i++) {
      for (let j = lineNumbers[i]; j > 0; j--) {
        let tr = document.getElementById(rowIdPrefix + j);
        let overTr = document.getElementById(rowIdPrefix + (j - 1));
        for (let k = 0; k < tetrisBoardMaxCol; k++) {
          let from = overTr.childNodes[k];
          tr.childNodes[k].setAttribute("class", from.className);
        }
      }
    }
  }
}
