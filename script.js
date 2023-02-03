const homeScene = document.getElementById("home");
const transitionScene = document.getElementById("transition");
const gameScene = document.getElementById("game");
const gameOverScene = document.getElementById("gameOver");
const countdown = document.getElementById("countdown");
const letterDisplay = {
  pos2: document.getElementById("pos2"),
  pos1: document.getElementById("pos1"),
  pos0: document.getElementById("pos0"),
  posN1: document.getElementById("pos-1"),
  posN2: document.getElementById("pos-2"),
};
let letters = ["", "", "", "", ""];
let scene = "home";
let timeLeft = 0;
let score = 0;
let lives = 5;
let ticks = 0;
let generated = false;
let pressing = false;
let cooldown = 0;

setInterval(tick, 50);

function tick() {
  cooldown++;
  if (scene == "transition") {
    ticks++;
    if (ticks < 15) {
      countdown.innerText = "3";
    } else if (ticks < 30) {
      countdown.innerText = "2";
    } else if (ticks < 45) {
      countdown.innerText = "1";
    } else if (ticks < 60) {
      countdown.innerText = "GO";
    } else if (60 < ticks < 61) {
      scene = "game";
      if (generated == false) {
        preloadGame();
        generated = true;
      }
      sceneDisplay();
    }
  }
  if (scene == "game") {
    time -= 4;
    if (time == 0) {
      if (lives == 1) {
        scene = "gameOver";
        document.getElementById("endScore").innerText = score;
        generated = false;
        sceneDisplay();
        generateMessage();
      } else {
        time = 100;
        lives--;
        document.getElementById("livesLeft").innerText = lives;
      }
    }
    document.getElementById("timeLeft").style.width = time + "vw";
    document.getElementById("timeLeft").style.left = (100 - time) / 2 + "vw";
  }
}
function sceneDisplay() {
  homeScene.style.opacity = 0;
  transitionScene.style.opacity = 0;
  gameScene.style.opacity = 0;
  gameOverScene.style.opacity = 0;
  switch (scene) {
    case "home":
      homeScene.style.opacity = 1;
      break;
    case "transition":
      transitionScene.style.opacity = 1;
      break;
    case "game":
      gameScene.style.opacity = 1;
      break;
    case "gameOver":
      gameOverScene.style.opacity = 1;
      break;
  }
}
function generateLetter() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let currentLetter = letters.charAt(
    Math.floor(Math.random() * letters.length)
  );
  return currentLetter;
}
function renderLetters() {
  letterDisplay.pos2.innerText = letters[0].toUpperCase();
  letterDisplay.pos1.innerText = letters[1].toUpperCase();
  letterDisplay.pos0.innerText = letters[2].toUpperCase();
  letterDisplay.posN1.innerText = letters[3].toUpperCase();
  letterDisplay.posN2.innerText = letters[4].toUpperCase();
}
function nextLetter() {
  time = 100;
  letters.shift(1, 1);
  letters.push(generateLetter());
  pos0.style.color = "#ffffff";
  renderLetters();
}
function checkAnswer(key) {
  if (key.key == letters[2]) {
    score++;
    document.getElementById("currentScore").innerText = score;
    nextLetter();
  } else if (key.key != letters[2]) {
    if (lives == 1) {
      cooldown = 0;
      scene = "gameOver";
      document.getElementById("endScore").innerText = score;
      generated = false;
      sceneDisplay();
      generateMessage();
    } else {
      pos0.style.color = "#e38682";
      time = 100;
      lives--;
      document.getElementById("livesLeft").innerText = lives;
    }
  }
}
function preloadGame() {
  lives = 5;
  time = 100;
  score = 0;
  letters = ["", "", "", "", ""];
  letters[2] = generateLetter();
  letters[3] = generateLetter();
  letters[4] = generateLetter();
  document.getElementById("currentScore").innerText = score;
  document.getElementById("livesLeft").innerText = lives;
  pos0.style.color = "#ffffff";
  renderLetters();
}
function generateMessage() {
  let options = [
    "Good Try",
    "Nice Work, You Got This",
    "Keep Trying",
    "Don't Give Up",
  ];
  document.getElementById("motivation").innerText =
    options[Math.floor(Math.random() * options.length)];
}
document.addEventListener("keypress", function (key) {
  if (pressing == false) {
    if (scene == "home" || (scene == "gameOver" && cooldown > 30)) {
      scene = "transition";
      ticks = 0;
      sceneDisplay();
    }
    if (scene == "game") {
      checkAnswer(key);
    }
    pressing = true;
  }
});
document.addEventListener("keyup", function () {
  pressing = false;
});

sceneDisplay();
