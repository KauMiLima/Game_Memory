const board = document.getElementById("game-board");
const startBtn = document.getElementById("start-btn");
const timerDisplay = document.getElementById("timer");
const modal = document.getElementById("modal");
const finalMessage = document.getElementById("final-message");

let seconds = 0;
let timerInterval;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;

const icons = ["👾", "🕹️", "👻", "💎", "🍒", "⚡", "⭐", "🔥"];
const gameIcons = [...icons, ...icons];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  board.innerHTML = "";
  const shuffled = shuffle(gameIcons);
  board.style.touchAction = "manipulation";
  shuffled.forEach((icon) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
            <div class="card-inner">
                <div class="card-back">?</div>
                <div class="card-front">${icon}</div>
            </div>
        `;
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains("visible"))
    return;

  if (navigator.vibrate) navigator.vibrate(15);
  this.classList.add("visible");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch =
    firstCard.querySelector(".card-front").innerText ===
    secondCard.querySelector(".card-front").innerText;

  if (isMatch) {
    matchesFound++;

    // EFEITO DE CONFETES AO ACERTAR PAR
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#00d2ff", "#ff00ff"],
    });

    if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
    if (matchesFound === icons.length) endGame();
    resetTurn();
  } else {
    unflipCards();
  }
}

function unflipCards() {
  lockBoard = true;

  // Seu ajuste de tempo: 200ms
  setTimeout(() => {
    if (navigator.vibrate) navigator.vibrate(200);

    firstCard.classList.add("shake");
    secondCard.classList.add("shake");

    setTimeout(() => {
      firstCard.classList.remove("visible", "shake");
      secondCard.classList.remove("visible", "shake");
      resetTurn();
    }, 500); // Tempo para o usuário ver o erro
  }, 200);
}

function resetTurn() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startGame() {
  seconds = 0;
  matchesFound = 0;
  timerDisplay.innerText = seconds;
  createBoard();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.innerText = seconds;
  }, 1000);

  startBtn.innerText = "RESET";
}

function endGame() {
  clearInterval(timerInterval);

  // EFEITO DE CELEBRAÇÃO AO GANHAR
  const end = Date.now() + 3000;
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#00d2ff", "#ff00ff"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#00d2ff", "#ff00ff"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);

  setTimeout(() => {
    modal.classList.remove("hidden");
    finalMessage.innerText = `TEMPO: ${seconds}s`;
  }, 200);
}

function resetGame() {
  modal.classList.add("hidden");
  startGame();
}

startBtn.addEventListener("click", startGame);
