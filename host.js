// ===== Login host =====
function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === "admin" && p === "addmin") {
    document.getElementById("dashboard").style.display = "block";
    loadDashboard();
  } else {
    alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  }
}


// ==== โหลดผู้เล่นทั้งหมดแบบ realtime ====
function loadDashboard() {
  const playerList = document.getElementById("playerList");
  const logList = document.getElementById("logList");

  db.ref("players").on("value", (snapshot) => {
    playerList.innerHTML = "";
    const playersTemp = [];

    snapshot.forEach((child) => {
      const p = child.val();
      playersTemp.push(p);
      const li = document.createElement("li");
      li.textContent = `${p.name} - ช่อง ${p.position} ${p.finished ? "(จบแล้ว)" : ""}`;
      playerList.appendChild(li);
    });

    drawHostBoard(playersTemp);
  });

  db.ref("logs").on("value", (snapshot) => {
    logList.innerHTML = "";
    snapshot.forEach((child) => {
      const playerId = child.key;
      child.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `[${playerId}] ${entry.val()}`;
        logList.appendChild(li);
      });
    });
  });
}


// ===== วาดกระดาน Host =====
const hostCanvas = document.getElementById("hostBoard");
const hostCtx = hostCanvas.getContext("2d");
const hostSize = 5;
const hostCellSize = hostCanvas.width / hostSize;
let hostColors = {};

const hostBoardImg = new Image();
hostBoardImg.src = "assets/snakes_board.png";     // ปรับ path ให้ตรงโปรเจ็กต์
hostBoardImg.onload = () => drawHostBoard([]);

// ===== Function ในกระดาน Host =====
function drawHostBoard(players) {
  hostCtx.clearRect(0, 0, hostCanvas.width, hostCanvas.height);
  if (hostBoardImg.complete) {
    hostCtx.drawImage(hostBoardImg, 0, 0, hostCanvas.width, hostCanvas.height);
  }
  
  let legendHTML = "";
  players.forEach((p, i) => {
    const color = hostColors[p.id] || getHostColor(i);
    hostColors[p.id] = color;
    
    const { x, y } = getHostCoord(p.position);
    hostCtx.beginPath();
    hostCtx.arc(x + hostCellSize/2, y + hostCellSize/2, 10, 0, Math.PI*2);
    hostCtx.fillStyle = color;
    hostCtx.fill();
    hostCtx.stroke();
    
    legendHTML += `<div class="legend-item" style="border-left: 15px solid ${color};">
    ${p.name} (ช่อง ${p.position})
    </div>`;
  });
  
  document.getElementById("legend").innerHTML = legendHTML;
}

function getHostCoord(pos) {
  let row = Math.floor((pos - 1) / hostSize);
  let col = (pos - 1) % hostSize;
  if (row % 2 !== 0) col = hostSize - col - 1;
  return { x: col * hostCellSize, y: (hostSize - row - 1) * hostCellSize };
}
function getHostColor(i) {
  const colors = ["red","blue","green","orange","purple","brown","pink","teal","cyan","black"];
  return colors[i % colors.length];
}


// ===== ปุ่มควบคุม =====
function stopGame() {
  db.ref("gameStatus").set("stopped");
  alert("⛔ เกมถูกหยุดแล้ว");
}
function resetGame() {
  if (confirm("แน่ใจหรือไม่ว่าต้องการรีเซตเกมทั้งหมด?")) {
    db.ref("players").remove();
    db.ref("logs").remove();
    db.ref("winner").remove();
    db.ref("gameStatus").set("playing");
    alert("✅ รีเซตเกมเรียบร้อยแล้ว");
  }
}

// ===== แจ้งเตือนเมื่อมีผู้ชนะ =====
db.ref("winner").on("value", snap => {
  const name = snap.val();
  if (name) alert(`🏁 เกมจบแล้ว ผู้ชนะคือ 🏆${name}`);
});



