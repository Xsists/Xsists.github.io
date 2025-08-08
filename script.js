let player = { name: "", position: 1, finished: false };
let questionsUsed = [];
let currentQuestion = null;
let questionSet = [
  { q: "อนุพันธ์ของ x^2", a: "2x" },
  { q: "อนุพันธ์ของ x^3", a: "3x^2" },
  { q: "อนุพันธ์ของ sin(x)", a: "cos(x)" },
  { q: "อนุพันธ์ของ cos(x)", a: "-sin(x)" },
  { q: "อนุพันธ์ของ e^x", a: "e^x" },
  { q: "อนุพันธ์ของ ln(x)", a: "1/x" }
];

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const size = 5;
const cellSize = canvas.width / size;

function startGame() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) return alert("กรุณาใส่ชื่อ");
  player.name = name;
  player.id = Date.now().toString();
  db.ref("players/" + player.id).set(player);
  db.ref("logs/" + player.id).remove();
  document.getElementById("gameArea").style.display = "block";
  drawBoard();
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 25; i++) {
    const { x, y } = getCoordinates(i + 1);
    ctx.strokeRect(x, y, cellSize, cellSize);
    ctx.fillText(i + 1, x + 5, y + 15);
  }

  const { x, y } = getCoordinates(player.position);
  ctx.beginPath();
  ctx.arc(x + cellSize / 2, y + cellSize / 2, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.stroke();
}

function getCoordinates(pos) {
  let row = Math.floor((pos - 1) / size);
  let col = (pos - 1) % size;
  if (row % 2 !== 0) col = size - col - 1;
  return { x: col * cellSize, y: (size - row - 1) * cellSize };
}

function askQuestion() {
  if (player.finished) return;

  // สุ่มคำถาม
  if (questionsUsed.length === questionSet.length) questionsUsed = [];
  const available = questionSet.filter(q => !questionsUsed.includes(q.q));
  currentQuestion = available[Math.floor(Math.random() * available.length)];
  questionsUsed.push(currentQuestion.q);

  // แสดงคำถาม
  document.getElementById("questionText").textContent = "✏️ " + currentQuestion.q;
  renderChoices(currentQuestion);
  document.getElementById("questionModal").classList.add("show");
}


function renderChoices(question) {
  const container = document.getElementById("choiceContainer") || document.createElement("div");
  container.id = "choiceContainer";
  container.innerHTML = "";

  const choices = [question.a];
  while (choices.length < 4) {
    const other = questionSet[Math.floor(Math.random() * questionSet.length)].a;
    if (!choices.includes(other)) choices.push(other);
  }
  shuffleArray(choices);

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.className = "choice-btn";
    btn.onclick = () => checkAnswer(choice);
    container.appendChild(btn);
  });

  const modalContent = document.querySelector(".modal-content");
  modalContent.appendChild(container);
}

function checkAnswer(selected) {
  document.getElementById("questionModal").classList.remove("show");
  if (selected === currentQuestion.a) {
    rollDice();
  } else {
    alert("❌ คำตอบผิด!");
    log(player.id, "ตอบผิด: " + currentQuestion.q);
  }

  // ด้านใน checkAnswer() หรือก่อน rollDice()
  db.ref("gameStatus").once("value").then((snap) => {
    const status = snap.val();
    if (status === "stopped") {
      alert("⛔ เกมนี้ถูกหยุดโดยผู้ดูแล");
      return;
    } else {
      rollDice(); // ดำเนินการต่อ
    }
  });
}


function rollDice() {
  let dice = Math.floor(Math.random() * 6) + 1;
  player.position += dice;
  if (player.position > 25) player.position = 1;
  document.getElementById("diceResult").textContent = "ลูกเต๋า: " + dice;
  log(player.id, `ได้ ${dice}, ไปช่อง ${player.position}`);
  if (player.position === 25) {
    player.finished = true;
    db.ref("winner").set(player.name);
    alert("🏆 คุณชนะแล้ว!");
  }
  db.ref("players/" + player.id).set(player);
  drawBoard();
}

function log(id, msg) {
  db.ref("logs/" + id).push(msg);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

db.ref("winner").on("value", snap => {
  const winner = snap.val();
  if (winner && !player.finished) {
    alert("🏁 เกมจบแล้ว! ผู้ชนะคือ " + winner);
    player.finished = true;
    document.querySelector("button").disabled = true;
  }
});

