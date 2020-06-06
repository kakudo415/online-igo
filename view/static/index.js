const closeGameFormButton1HTML = document.getElementsByClassName("back")[0];
const closeGameFormButton2HTML = document.getElementsByClassName("back")[1];
const openNewGameFormButtonHTML = document.getElementsByClassName("new-game")[0];
const openJoinGameFormButtonHTML = document.getElementsByClassName("join-game")[0];
const newGameFormHTML = document.getElementById('new-game-form');
const joinGameFormHTML = document.getElementById('join-game-form');
const newGameForm = document.forms["new-game-form"].elements;
const joinGameForm = document.forms["join-game-form"].elements;

const closeGameForm = () => {
  newGameFormHTML.style.display = "none";
  joinGameFormHTML.style.display = "none";
  closeGameFormButton1HTML.style.display = "none";
  closeGameFormButton2HTML.style.display = "none";
  openNewGameFormButtonHTML.style.display = "block";
  openJoinGameFormButtonHTML.style.display = "block";
};

const openNewGameForm = () => {
  newGameFormHTML.style.display = "block";
  joinGameFormHTML.style.display = "none";
  closeGameFormButton1HTML.style.display = "block";
  closeGameFormButton2HTML.style.display = "none";
  openNewGameFormButtonHTML.style.display = "none";
  openJoinGameFormButtonHTML.style.display = "none";
};

const openJoinGameForm = () => {
  newGameFormHTML.style.display = "none";
  joinGameFormHTML.style.display = "block";
  closeGameFormButton1HTML.style.display = "none";
  closeGameFormButton2HTML.style.display = "block";
  openNewGameFormButtonHTML.style.display = "none";
  openJoinGameFormButtonHTML.style.display = "none";
};

const submitNewGameForm = () => {
  let nickname = "";
  if (newGameForm["nickname"].value === "") {
    nickname = "通りすがりの棋士";
  } else {
    nickname = newGameForm["nickname"].value;
  }
  let message = {
    "grid-number": Number(newGameForm["igo-grid-number"].value)
  };
  const request = new Request("/", {
    method: "POST",
    body: JSON.stringify(message)
  });
  fetch(request).then((response) => {
    if (!response.ok) {
      console.error("New Game Form Fetch Failed");
      console.error(request);
      return;
    }
    return response.json();
  }).then((json) => {
    location.href = `/game/${json["game-id"]}?p=${json["password"]}`;
  });
};

const submitJoinGameForm = () => {
  if (joinGameForm["password"].value) {
    location.href = `/game/${joinGameForm["game-id"].value}?p=${joinGameForm["password"].value}`;
  } else {
    location.href = `/game/${joinGameForm["game-id"].value}`;
  }
};