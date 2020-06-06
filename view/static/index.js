const closeGameFormButton1HTML = document.getElementsByClassName("back")[0];
const closeGameFormButton2HTML = document.getElementsByClassName("back")[1];
const openNewGameFormButtonHTML = document.getElementsByClassName("new-game")[0];
const openJoinGameFormButtonHTML = document.getElementsByClassName("join-game")[0];
const newGameFormHTML = document.getElementById('new-game-form');
const joinGameFormHTML = document.getElementById('join-game-form');
const newGameForm = document.forms["new-game-form"].elements;

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
    "grid-number": Number(newGameForm["igo-grid-number"].value),
    "nickname": nickname
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
    passwordMax = "";
    if (json["password-as-black"].length > 0) {
      passwordMax = json["password-as-black"];
    }
    if (json["password-as-white"].length > 0) {
      passwordMax = json["password-as-white"];
    }
    if (json["password-as-master"].length > 0) {
      passwordMax = json["password-as-master"];
    }
    location.href = `/game/${json["game-id"]}?p=${passwordMax}`;
  });
};