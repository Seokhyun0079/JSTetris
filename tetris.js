const makeTetrisBoard = () => {
  makeTetirsBorardHtml();
  maekTetirsNext();
  let randomBlock = new Block();
  /**
   * キー入力イベント
   */
  document.addEventListener("keydown", (event) => {
    event.preventDefault();
    if (event.key == "ArrowRight") {
      randomBlock.moveSide(event.key);
    }
    if (event.key == "ArrowLeft") {
      randomBlock.moveSide(event.key);
    }
    if (event.key === "ArrowUp") {
      if (randomBlock.direction % 1 == 0) {
        randomBlock.blockRightDirectionChange();
      } else {
        randomBlock.blockLeftDirectionChange();
      }
    }
    if (event.key == "1") {
      randomBlock.block = testShape;
      randomBlock.x = 0;
      randomBlock.y = 0;
    }
    /*
    一時停止テスト用
    */
    if (event.key == "2") {
      randomBlock.runable = false;
    }
    /*
    一時停止解除テスト用
    */
    if (event.key == "3") {
      randomBlock.runable = true;
    }
  });

  window.setInterval(() => {
    randomBlock.claerPrevLine();
    randomBlock.moveBlock();
  }, 100);
};
/**
 *ボードを作る。
 */
const makeTetirsBorardHtml = () => {
  let tetrisBoard = document.getElementById(tetrisBoardId);
  let tetrisBoardTable = document.createElement("table");
  tetrisBoardTable.setAttribute("class", boardSpace);
  tetrisBoard.appendChild(tetrisBoardTable);
  for (let i = 0; i < tetrisBoardMaxRow; i++) {
    let tr = document.createElement("tr");
    tr.id = rowIdPrefix + i;
    tr.setAttribute("class", trStyleDefaultClass);
    tetrisBoardTable.appendChild(tr);
    for (let j = 0; j < tetrisBoardMaxCol; j++) {
      let td = document.createElement("td");
      td.id = colIdPrefix + j;
      td.setAttribute("class", tdStyleDefaultClass);
      tr.appendChild(td);
    }
  }
};

/**
 *次のブロックを作る。
 */
const maekTetirsNext = () => {
  let tetrisBoard = document.getElementById(tetrisBoardId);
  let tetrisBoardTable = document.createElement("table");
  tetrisBoardTable.setAttribute("class", nextBlockSpace);
  tetrisBoard.appendChild(tetrisBoardTable);
  for (let i = 0; i < 10; i++) {
    let tr = document.createElement("tr");
    tr.id = nextRowIdPrefix + i;
    tr.setAttribute("class", trStyleDefaultClass);
    tetrisBoardTable.appendChild(tr);
    for (let j = 0; j < 10; j++) {
      let td = document.createElement("td");
      td.id = nextColIdPrefix + j;
      td.setAttribute("class", tdStyleDefaultClass);
      tr.appendChild(td);
    }
  }
};

window.addEventListener("DOMContentLoaded", makeTetrisBoard);
