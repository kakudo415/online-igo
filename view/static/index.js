const closeGameFormButtonHTML = document.getElementsByClassName("back")[0];
const openNewGameFormButtonHTML = document.getElementsByClassName("new-game")[0];
const openJoinGameFormButtonHTML = document.getElementsByClassName("join-game")[0];
const newGameFormHTML = document.getElementById('new-game-form');
const joinGameFormHTML = document.getElementById('join-game-form');

const closeGameForm = () => {
  closeGameFormButtonHTML.style.display = "none";
  openNewGameFormButtonHTML.style.display = "block";
  openJoinGameFormButtonHTML.style.display = "block";
};

const openNewGameForm = () => {
  joinGameFormHTML.style.display = "none";
  newGameFormHTML.style.display = "block";
  closeGameFormButtonHTML.style.display = "block";
  openNewGameFormButtonHTML.style.display = "none";
  openJoinGameFormButtonHTML.style.display = "none";
};

const openJoinGameForm = () => {
  newGameFormHTML.style.display = "none";
  joinGameFormHTML.style.display = "block";
  closeGameFormButtonHTML.style.display = "block";
  openNewGameFormButtonHTML.style.display = "none";
  openJoinGameFormButtonHTML.style.display = "none";
};