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

// ส่วนวาดตาราง
const hostCanvas = document.getElementById("hostBoard");
const hostCtx = hostCanvas.getContext("2d");
const hostSize = 5;
const hostCellSize = hostCanvas.width / hostSize;
let hostColors = {};

function drawHostBoard(players) {
  hostCtx.clearRect(0, 0, hostCanvas.width, hostCanvas.height);

  for (let i = 0; i < 25; i++) {
    const { x, y } = getHostCoord(i + 1);
    hostCtx.strokeRect(x, y, hostCellSize, hostCellSize);
    hostCtx.fillText(i + 1, x + 5, y + 15);
  }

  let legendHTML = "";
  players.forEach((p, i) => {
    const color = hostColors[p.id] || getHostColor(i);
    hostColors[p.id] = color;

    const { x, y } = getHostCoord(p.position);
    hostCtx.beginPath();
    hostCtx.arc(x + hostCellSize / 2, y + hostCellSize / 2, 10, 0, 2 * Math.PI);
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

function getHostColor(index) {
  const colors = ["red", "blue", "green", "orange", "purple", "brown", "pink", "teal", "cyan", "black"];
  return colors[index % colors.length];
}

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
