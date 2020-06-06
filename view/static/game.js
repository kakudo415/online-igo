let banmen = new Array(19); // COLUMN ROW
let kifu = [];
let ws;

const init = () => {
  return new Promise((resolve, reject) => { resolve() });
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
        json.forEach((kifu) => {
          switch (kifu.te) {
            case "b":
              banmen[kifu.column][kifu.row] = 1;
              break;
            case "w":
              banmen[kifu.column][kifu.row] = 2;
              break;
            case "rm":
              banmen[kifu.column][kifu.row] = 0;
          }
        });
      })
      .then(() => { resolve(); });
  });
};

const renderBanmen = () => {
  return new Promise((resolve, reject) => {
    for (i = 0; i < banmen.length; i++) {
      for (j = 0; j < banmen[i].length; j++) {
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
    ws = new WebSocket(`ws://${location.host}${location.pathname}/ws${location.search}`);
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
          renderBanmen();
        }
      };
      ws.onclose = (ev) => {
        console.log(ev);
        setTimeout(init, 1000);
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
  switch (banmen[column][row]) {
    case 0:
      msg.action.te = "b";
      break;
    case 1:
      msg.action.te = "w";
      break;
    case 2:
      msg.action.te = "rm";
      break;
  }
  ws.send(JSON.stringify(msg));
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