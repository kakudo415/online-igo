let banmen = new Array(19); // COLUMN ROW

const init = () => {
  for (i = 0; i < banmen.length; i++) {
    banmen[i] = new Array(19).fill(0);
  }
};

const chakushu = (column, row) => {
  column = Number(column);
  row = Number(row);
  if (banmen[column][row] === 0) {
    banmen[column][row] = 1;
    document.querySelector(`.me${column}-${row} > .ishi.black`).style.visibility = "visible";
  } else if (banmen[column][row] === 1) {
    banmen[column][row] = 2;
    document.querySelector(`.me${column}-${row} > .ishi.black`).style.visibility = "hidden";
    document.querySelector(`.me${column}-${row} > .ishi.white`).style.visibility = "visible";
  } else {
    banmen[column][row] = 0;
    document.querySelector(`.me${column}-${row} > .ishi.black`).style.visibility = "hidden";
    document.querySelector(`.me${column}-${row} > .ishi.white`).style.visibility = "hidden";
  }
  // if (banmen[column][row] === 1 || banmen[column][row] === 2) {
  //   banmen[column][row] = 0;
  //   document.querySelector(`.me${column}-${row} > .ishi.black`).style.visibility = "hidden";
  //   document.querySelector(`.me${column}-${row} > .ishi.white`).style.visibility = "hidden";
  // } else {
  //   banmen[column][row] = 1;
  //   // document.querySelector(`.me${column}-${row} > .ishi.black`).style.visibility = "visible";
  //   document.querySelector(`.me${column}-${row} > .ishi.white`).style.visibility = "visible";
  // }
};

window.onload = init;