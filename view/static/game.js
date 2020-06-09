let banmen = new Array(19); // COLUMN ROW
let banmenSize;
let kifu = [];
let ws;
let kifuHTML = document.querySelector(".kifu-list");
let gameControlForm = document.forms["game-control"].elements;
let agehamaBlack = 0;
let agehamaWhite = 0;

const init = () => {
  return new Promise((resolve, reject) => {
    banmenSize = document.querySelectorAll(".row").length;
    resolve();
  });
};

const makeBanmen = () => {
  return new Promise((resolve, reject) => {
    for (i = 0; i < banmen.length; i++) {
      banmen[i] = new Array(19).fill(0);
    }
    resolve();
  });
};

const getHistory = () => {
  return new Promise((resolve, reject) => {
    fetch(`${location.origin}${location.pathname}/history`)
      .then((res) => { return res.json(); })
      .then((json) => {
        json.history.forEach((h) => {
          switch (h.te) {
            case "b":
              banmen[h.column][h.row] = 1;
              break;
            case "w":
              banmen[h.column][h.row] = 2;
              break;
            case "rm":
              banmen[h.column][h.row] = 0;
          }
          kifu.push(h);
        });
      })
      .then(() => { resolve(); })
      .catch(() => { resolve(); });
  });
};

const renderBanmen = () => {
  return new Promise((resolve, reject) => {
    for (i = 0; i < banmenSize; i++) {
      for (j = 0; j < banmenSize; j++) {
        switch (banmen[i][j]) {
          case 0:
            document.querySelector(`.me${i}-${j} > .ishi.black`).style.visibility = "hidden";
            document.querySelector(`.me${i}-${j} > .ishi.white`).style.visibility = "hidden";
            break;
          case 1:
            document.querySelector(`.me${i}-${j} > .ishi.black`).style.visibility = "visible";
            document.querySelector(`.me${i}-${j} > .ishi.white`).style.visibility = "hidden";
            break;
          case 2:
            document.querySelector(`.me${i}-${j} > .ishi.black`).style.visibility = "hidden";
            document.querySelector(`.me${i}-${j} > .ishi.white`).style.visibility = "visible";
            break;
        }
      }
    }
    resolve();
  });
};

const makeWebSocket = () => {
  return new Promise((resolve, reject) => {
    ws = new WebSocket(`wss://${location.host}${location.pathname}/ws${location.search}`);
    ws.onerror = (ev) => {
      ws.close();
      ws = new WebSocket(`ws://${location.host}${location.pathname}/ws${location.search}`);
      ws.onopen = () => {
        resolve();
      };
    };
    ws.onopen = () => {
      resolve();
    };
  });
};

const prepareWebSocket = () => {
  return new Promise((resolve, reject) => {
    console.log(`WebSocket open on ${ws.url}`);
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "action") {
        switch (msg.action.te) {
          case "b":
            banmen[msg.action.column][msg.action.row] = 1;
            break;
          case "w":
            banmen[msg.action.column][msg.action.row] = 2;
            break;
          case "rm":
            banmen[msg.action.column][msg.action.row] = 0;
        }
        kifu.push({ te: msg.action.te, row: msg.action.row, column: msg.action.column });
        renderBanmen()
          .then(() => renderKifu())
          .catch((err) => {
            console.error(err);
          });
      }
    };
    ws.onclose = (ev) => {
      setTimeout(() => {
        init()
          .then(() => makeBanmen())
          .then(() => getHistory())
          .then(() => makeWebSocket())
          .then(() => renderBanmen())
          .catch((err) => {
            console.error(err);
          });
      }, 1000);
    };
    console.log("WebSocket Ready");
    resolve();
  });
};

const renderKifu = () => {
  return new Promise((resolve, reject) => {
    kifu.forEach((v, i) => {
      if (i < kifuHTML.childElementCount) {
        return;
      }
      let kifuElm = document.createElement("div");
      let indexElm = document.createElement("div");
      indexElm.classList.add("kifu-index");
      indexElm.textContent = `${i + 1}手目`;
      let xElm = document.createElement("div");
      xElm.classList.add("kifu-zahyou");
      xElm.textContent = `${v.column + 1} `;
      let yElm = document.createElement("div");
      yElm.classList.add("kifu-zahyou");
      yElm.textContent = `${numToKanji(v.row + 1)} `;
      let teElm = document.createElement("div");
      teElm.classList.add("kifu-te");
      switch (v.te) {
        case "b":
          teElm.textContent = "黒";
          break;
        case "w":
          teElm.textContent = "白";
          break;
        case "rm":
          for (j = i; j !== 0; j--) {
            if (j !== i && v.column == kifu[j].column && v.row == kifu[j].row) {
              if (kifu[j].te == "b") {
                teElm.textContent = "黒";
                agehamaBlack++;
              }
              if (kifu[j].te == "w") {
                teElm.textContent = "白";
                agehamaWhite++;
              }
              break;
            }
          }
          teElm.textContent += "トル";
          break;
      }
      kifuElm.appendChild(indexElm);
      kifuElm.appendChild(xElm);
      kifuElm.appendChild(yElm);
      kifuElm.appendChild(teElm);
      kifuHTML.insertBefore(kifuElm, kifuHTML.firstChild);
    });
    resolve();
  });
};

const renderAgehama = () => {
  return new Promise((resolve, reject) => {
    document.querySelector("#agehama-black").value = agehamaBlack;
    document.querySelector("#agehama-white").value = agehamaWhite;
    resolve();
  });
};

const numToKanji = (num) => {
  return {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九",
    10: "十",
    11: "十一",
    12: "十二",
    13: "十三",
    14: "十四",
    15: "十五",
    16: "十六",
    17: "十七",
    18: "十八",
    19: "十九",
  }[num];
};

const chakushu = (column, row) => {
  column = Number(column);
  row = Number(row);
  msg = {
    type: "action",
    action: {
      column: column,
      row: row
    }
  };
  switch (gameControlForm["use-color"].value) {
    case "black":
      msg.action.te = "b";
      break;
    case "white":
      msg.action.te = "w";
      break;
    default:
      return;
  }
  if (banmen[column][row] > 0) {
    msg.action.te = "rm";
  }
  ws.send(JSON.stringify(msg));
  if (gameControlForm["alternately"].checked) {
    switch (gameControlForm["use-color"].value) {
      case "black":
        document.querySelector("#use-color-white").checked = true;
        break;
      case "white":
        document.querySelector("#use-color-black").checked = true;
        break;
    }
  }
};

window.onload = () => {
  init()
    .then(() => makeBanmen())
    .then(() => getHistory())
    .then(() => makeWebSocket())
    .then(() => prepareWebSocket())
    .then(() => renderBanmen())
    .then(() => renderKifu())
    .then(() => renderAgehama())
    .catch((err) => {
      console.error(err);
    });
};