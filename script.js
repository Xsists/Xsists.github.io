let player = { name: "", position: 1, finished: false };


// =======================
// คำถามแบบรูปภาพ (10 ข้อ)
// =======================
let questionsUsed = new Set();
let currentQuestion = null;
const questionSet = [
  {
    id: 1,
    qImg: "assets/questions/q1.png",
    choices: [
      { img: "assets/choices/q1_a.png", correct: false, alt: "q1 A" },
      { img: "assets/choices/q1_b.png", correct: true,  alt: "q1 B" }, // ← ถูก
      { img: "assets/choices/q1_c.png", correct: false, alt: "q1 C" },
      { img: "assets/choices/q1_d.png", correct: false, alt: "q1 D" }
    ]
  },
  {
    id: 2,
    qImg: "assets/questions/q2.png",
    choices: [
      { img: "assets/choices/q2_a.png", correct: false, alt: "q2 A"  },
      { img: "assets/choices/q2_b.png", correct: false, alt: "q2 B"  },
      { img: "assets/choices/q2_c.png", correct: true,  alt: "q2 C"  }, // ← ถูก
      { img: "assets/choices/q2_d.png", correct: false, alt: "q2 D"  }
    ]
  },
  {
    id: 3,
    qImg: "assets/questions/q3.png",
    choices: [
      { img: "assets/choices/q3_a.png", correct: true,  alt: "q3 A"  }, // ← ถูก
      { img: "assets/choices/q3_b.png", correct: false, alt: "q3 B"  },
      { img: "assets/choices/q3_c.png", correct: false, alt: "q3 C"  },
      { img: "assets/choices/q3_d.png", correct: false, alt: "q3 D"  }
    ]
  }
  ,
  {
    id: 4,
    qImg: "assets/questions/q4.png",
    choices: [
      { img: "assets/choices/q4_a.png", correct: false, alt: "q4 A" },
      { img: "assets/choices/q4_b.png", correct: false, alt: "q4 B" },
      { img: "assets/choices/q4_c.png", correct: false, alt: "q4 C" },
      { img: "assets/choices/q4_d.png", correct: true,  alt: "q4 D" }
    ]
  },
  {
    id: 5,
    qImg: "assets/questions/q5.png",
    choices: [
      { img: "assets/choices/q5_a.png", correct: false, alt: "q5 A" },
      { img: "assets/choices/q5_b.png", correct: true,  alt: "q5 B" },
      { img: "assets/choices/q5_c.png", correct: false, alt: "q5 C" },
      { img: "assets/choices/q5_d.png", correct: false, alt: "q5 D" }
    ]
  },
  {
    id: 6,
    qImg: "assets/questions/q6.png",
    choices: [
      { img: "assets/choices/q6_a.png", correct: false, alt: "q6 A" },
      { img: "assets/choices/q6_b.png", correct: false, alt: "q6 B" },
      { img: "assets/choices/q6_c.png", correct: true,  alt: "q6 C" },
      { img: "assets/choices/q6_d.png", correct: false, alt: "q6 D" }
    ]
  },
  {
    id: 7,
    qImg: "assets/questions/q7.png",
    choices: [
      { img: "assets/choices/q7_a.png", correct: true,  alt: "q7 A" },
      { img: "assets/choices/q7_b.png", correct: false, alt: "q7 B" },
      { img: "assets/choices/q7_c.png", correct: false, alt: "q7 C" },
      { img: "assets/choices/q7_d.png", correct: false, alt: "q7 D" }
    ]
  },
  {
    id: 8,
    qImg: "assets/questions/q8.png",
    choices: [
      { img: "assets/choices/q8_a.png", correct: false, alt: "q8 A" },
      { img: "assets/choices/q8_b.png", correct: false, alt: "q8 B" },
      { img: "assets/choices/q8_c.png", correct: false, alt: "q8 C" },
      { img: "assets/choices/q8_d.png", correct: true,  alt: "q8 D" }
    ]
  },
  {
    id: 9,
    qImg: "assets/questions/q9.png",
    choices: [
      { img: "assets/choices/q9_a.png", correct: false, alt: "q9 A" },
      { img: "assets/choices/q9_b.png", correct: true,  alt: "q9 B" },
      { img: "assets/choices/q9_c.png", correct: false, alt: "q9 C" },
      { img: "assets/choices/q9_d.png", correct: false, alt: "q9 D" }
    ]
  },
  {
    id: 10,
    qImg: "assets/questions/q10.png",
    choices: [
      { img: "assets/choices/q10_a.png", correct: false, alt: "q10 A" },
      { img: "assets/choices/q10_b.png", correct: false, alt: "q10 B" },
      { img: "assets/choices/q10_c.png", correct: true,  alt: "q10 C" },
      { img: "assets/choices/q10_d.png", correct: false, alt: "q10 D" }
    ]
  }
];


// ===== โหลดรูปไว =====
function preloadImages(){
  const urls = [];
  questionSet.forEach(q => {
    urls.push(q.qImg);
    q.choices.forEach(c => urls.push(c.img));
  });
  urls.forEach(u => { const im = new Image(); im.src = u; });
}
// เรียกครั้งเดียวตอนเริ่มหน้า
preloadImages();


// ===== วาดกระดาน =====
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const size = 5;
const cellSize = canvas.width / size;
// ใช้ภาพกระดานเป็นพื้นหลัง
const boardImg = new Image();
boardImg.src = "assets/snakes_board.png";   // ปรับ path ให้ตรงโปรเจกต์
boardImg.onload = () => drawBoard();        // โหลดเสร็จให้วาดทันที

function startGame() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) return alert("กรุณาใส่ชื่อ");
  player.name = name;
  player.id = Date.now().toString();
  db.ref("players/" + player.id).set(player);
  db.ref("logs/" + player.id).remove();
  document.getElementById("gameArea").style.display = "block";
  const localLog = document.getElementById('localLog');
  if (localLog) localLog.innerHTML = "";
  appendLocalLog(`เริ่มเกมในชื่อ ${player.name}`);
  drawBoard();
}

function drawBoard() {
  document.getElementById('posText').textContent = player.position;

  // วาดพื้นหลังเป็นรูปกระดาน
  if (boardImg.complete) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(boardImg, 0, 0, canvas.width, canvas.height);
  }

  // วาดผู้เล่น (หมากสีน้ำเงิน)
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


// ===== ฟังก์ชันสุ่ม/แสดงคำถาม =====
function askQuestion(){
  if (player.finished) return;

  if (questionsUsed.size === questionSet.length) questionsUsed.clear();
  const pool = questionSet.filter(q => !questionsUsed.has(q.id));
  currentQuestion = pool[Math.floor(Math.random() * pool.length)];
  questionsUsed.add(currentQuestion.id);

  const qImg = document.getElementById('questionImg');
  qImg.src = currentQuestion.qImg;
  qImg.alt = `question-${currentQuestion.id}`;

  renderChoices(currentQuestion);
  document.getElementById('questionModal').classList.add('show');
}

// ===== ฟังก์ชันสุ่ม/แสดงช้อยส์ =====
function renderChoices(question){
  const container = document.getElementById('choiceContainer');
  container.innerHTML = '';

  // สุ่มเรียงช้อยส์ก่อนแสดง
  const picks = [...question.choices];
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }

  picks.forEach((c) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<img src="${c.img}" alt="${c.alt || 'choice'}">`;
    btn.onclick = () => checkAnswer(c.correct);
    container.appendChild(btn);
  });
}


// ===== ฟังก์ชันสุ่ม/แสดงช้อยส์ =====
function renderChoices(question){
  const container = document.getElementById('choiceContainer');
  container.innerHTML = '';

  const picks = [...question.choices];
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }

  picks.forEach((c) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<img src="${c.img}" alt="${c.alt || 'choice'}">`;
    btn.addEventListener('click', () => {
      // ส่ง boolean ชัดเจน
      checkAnswer(!!c.correct);
    });
    container.appendChild(btn);
  });
}


// ===== เช็คคำตอบ =====
function checkAnswer(isCorrect){
  document.getElementById('questionModal').classList.remove('show');

  // ❌ ตอบผิด → ถอยกลับ 1 ช่อง แล้วบันทึก/วาดใหม่
  if (!isCorrect){
    const old = player.position;
    player.position = applySnakesLadders(Math.max(1, old - 1));          // ไม่ให้น้อยกว่า 1
    log(player.id, `ตอบผิด: Q${currentQuestion?.id || ''} → ถอย ${old} → ${player.position}`);
    alert('❌ คำตอบผิด! ถอยกลับ 1 ช่อง');

    // อัปเดตขึ้น Firebase + วาดกระดานใหม่ (Host จะเห็น realtime)
    db.ref("players/" + player.id).set(player);
    drawBoard();
    return;
  }
  

  // ✅ ตอบถูก → (เหมือนเดิม) เช็กสถานะเกมก่อนทอย
  db.ref('gameStatus').once('value')
    .then((snap) => {
      const status = snap.val() || 'playing';
      if (status === 'stopped') {
        alert('⛔ เกมนี้ถูกหยุดโดยผู้ดูแล');
        return;
      }
      rollDice();
    })
    .catch(() => {
      console.error(err);
      alert("⚠️ ไม่สามารถอ่านสถานะเกมได้ (gameStatus) — โปรดตรวจสอบสิทธิ์ Rules");
    });

  if (player.finished) return;
}

  
  
// 🐍 งู: หยุดที่หัวแล้วไหลลง
const SNAKES = { 13: 2, 22: 12, 24: 15 };
// 🪜 บันได: หยุดที่ฐานแล้วขึ้นไป
const LADDERS = { 4: 14, 11: 21 };

function applySnakesLadders(pos) {
  if (SNAKES[pos]) {
    const to = SNAKES[pos];
    alert(`🐍 เจองู! จากช่อง ${pos} ย้อนกลับไปช่อง ${to}`);
    log(player.id, `งู: ${pos} → ${to}`);
    return to;
  }
  if (LADDERS[pos]) {
    const to = LADDERS[pos];
    alert(`🪜 เจอบันได! จากช่อง ${pos} ขึ้นไปช่อง ${to}`);
    log(player.id, `บันได: ${pos} → ${to}`);
    return to;
  }
  return pos;
}


// ===== ทอย =====
function rollDice() {
  const dice = Math.floor(Math.random() * 6) + 1;
  let nextPos = player.position + dice;

  // ถึงหรือเกิน 25 ⇒ ผู้เล่นคนนี้ชนะ และหยุดที่ 25 (แต่เกมยังเล่นต่อได้)
  if (nextPos >= 25 && !player.finished) {
    player.position = 25;
    player.finished = true;

    // ตั้งผู้ชนะ: ให้แค่คนแรกเท่านั้น (transaction)
    db.ref("winner").transaction(w => w || player.name);

    // แจ้งเตือนฝั่งผู้ชนะเองทันที
    alert(`🏁 เกมจบแล้ว ผู้ชนะคือ 🏆${player.name}`);

    log(player.id, `ถึง/เกิน 25 (ได้ ${dice}) → เข้าเส้นชัยที่ 25`);
    document.getElementById("diceResult").textContent = "ลูกเต๋า: " + dice;

    db.ref("players/" + player.id).set(player);
    drawBoard();
    return; // ผู้ชนะหยุดรอที่ 25
  }

  // ยังไม่ถึง 25 ⇒ ดำเนินเกมตามปกติ (เช็วงู/บันไดได้ถ้าคุณใช้)
  const before = nextPos;
  player.position = applySnakesLadders(nextPos);

  document.getElementById("diceResult").textContent = "ลูกเต๋า: " + dice;
  log(player.id, `ได้ ${dice}, ไปช่อง ${before}${before !== player.position ? " → " + player.position : ""}`);

  db.ref("players/" + player.id).set(player);
  drawBoard();
}


// ===== ฟัง winner realtime =====
db.ref("winner").on("value", snap => {
  const name = snap.val();
  if (name && !player.finished) {
    alert(`🏁 เกมจบแล้ว ผู้ชนะคือ 🏆${name}`);
  }
});



function appendLocalLog(text){
  const box = document.getElementById('localLog');
  if (!box) return;
  const row = document.createElement('div');
  const ts  = new Date().toLocaleTimeString();
  row.className = 'log-row';
  row.textContent = `[${ts}] ${text}`;
  box.appendChild(row);
  // เลื่อนลงล่างสุดอัตโนมัติ
  box.scrollTop = box.scrollHeight;
}


// ===== log ขึ้น firebase =====
function log(id, msg) {
  // บันทึกขึ้น Firebase (เหมือนเดิม)
  db.ref("logs/" + id).push(msg);
  // แสดงในกล่อง Log ภายในเครื่อง
  appendLocalLog(msg);
}



function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
