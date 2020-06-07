let banmen = new Array(19); // COLUMN ROW
let banmenSize;
let kifu = [];
let ws;
let gameControlForm = document.forms["game-control"].elements;

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
    ws.onopen = () => {
      console.log("WebSocket Open");
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
          renderBanmen()
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
    };
    resolve();
  });
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
    .then(() => renderBanmen())
    .catch((err) => {
      console.error(err);
    });
};