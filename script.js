const $ = (id) => document.getElementById(id);
const lockScreen = $("lock-screen");
const homeScreen = $("home-screen");
const appWindow = $("app-window");
const appTitle = $("app-title");
const appContent = $("app-content");
let currentApp = "";
let playing = false;

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
  $("status-time").textContent = time;
  $("lock-time").textContent = time;
  $("lock-date").textContent = now.toLocaleDateString("ko-KR", { weekday: "long", month: "long", day: "numeric" });
}
updateClock();
setInterval(updateClock, 1000);

$("unlock-button").addEventListener("click", () => {
  lockScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
});

document.querySelectorAll("[data-app]").forEach(button => {
  button.addEventListener("click", () => openApp(button.dataset.app));
});

$("back-button").addEventListener("click", closeApp);

function openApp(name) {
  currentApp = name;
  const titles = { messages:"Messages", photos:"Photos", notes:"Notes", calendar:"Calendar", music:"Music", weather:"Weather", phone:"Phone", settings:"Settings" };
  appTitle.textContent = titles[name] || name;
  appContent.innerHTML = appTemplates[name]();
  homeScreen.classList.add("hidden");
  appWindow.classList.remove("hidden");
  bindAppActions(name);
}
function closeApp() {
  appWindow.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  currentApp = "";
}

const appTemplates = {
  messages: () => `
    <p class="muted">MESSAGES</p><h2>Messages</h2>
    <div class="list-row"><div class="avatar">J</div><div><b>Jamie</b><div class="muted">오늘 뭐 해? ☁️</div></div></div>
    <div class="list-row"><div class="avatar">M</div><div><b>Min</b><div class="muted">사진 너무 예쁘다!</div></div></div>
    <div class="card" id="chat-area"><b>Jamie</b><div class="bubble">안녕! 오늘 하루 어땠어?</div><div class="bubble mine">좋았어 :) 너는?</div><div class="bubble">나도 좋았어! ♡</div></div>
    <div class="chat-input"><input id="message-input" placeholder="iMessage"><button class="primary" id="send-message">전송</button></div>`,
  photos: () => `<p class="muted">YOUR LIBRARY</p><h2>Photos</h2><div class="photo-grid"><div class="photo-tile">☁️</div><div class="photo-tile">🌷</div><div class="photo-tile">🌿</div><div class="photo-tile">🌙</div><div class="photo-tile">🫧</div><div class="photo-tile">🕊️</div></div><p class="muted">샘플 이미지 타일이야. 나중에 네 사진으로 바꿀 수 있어.</p>`,
  notes: () => `<p class="muted">ICLOUD NOTES · DEMO</p><h2>Notes</h2><div class="card"><b>오늘의 메모</b><p class="muted">여기에 자유롭게 메모해 봐.</p><textarea id="note-text" placeholder="무엇이든 적어 봐..."></textarea><button class="primary" id="save-note" style="margin-top:10px">메모 저장</button><p class="muted" id="note-status"></p></div>`,
  calendar: () => `<p class="muted">YOUR SCHEDULE</p><h2>Calendar</h2><div class="card center"><p class="muted">NOVEMBER</p><div class="big-number">07</div><b>Saturday</b><p class="muted">오늘은 어떤 계획이 있어?</p></div><div class="card"><b>Upcoming</b><div class="list-row">♡　친구 만나기 <span class="muted">3:00 PM</span></div><div class="list-row">☁　나만의 시간 <span class="muted">7:00 PM</span></div></div>`,
  music: () => `<p class="muted">NOW PLAYING</p><h2>Music</h2><div class="track-art">♫</div><div class="center"><b>Little Moments</b><p class="muted">Your demo playlist</p><button class="player-button" id="play-button">▶</button><p class="muted" id="play-status">재생 버튼을 눌러 봐</p></div>`,
  weather: () => `<p class="muted">LOCAL WEATHER · SAMPLE</p><h2>Weather</h2><div class="card center"><div style="font-size:58px">☀️</div><div class="big-number">22°</div><b>맑음</b><p class="muted">가상의 날씨 정보</p></div><div class="card">오늘은 산책하기 좋은 날처럼 느껴져요.</div>`,
  phone: () => `<p class="muted">FAVOURITES</p><h2>Phone</h2><div class="list-row"><div class="avatar">J</div><div><b>Jamie</b><div class="muted">Mobile</div></div></div><div class="list-row"><div class="avatar">M</div><div><b>Min</b><div class="muted">Mobile</div></div></div><div class="center"><p class="muted" id="dial-number">가상 키패드</p><div class="keypad">${["1","2","3","4","5","6","7","8","9","*","0","#"].map(n=>`<button class="dial-key">${n}</button>`).join("")}</div><p class="muted">실제 전화는 연결되지 않아.</p></div>`,
  settings: () => `<p class="muted">PREFERENCES</p><h2>Settings</h2><div class="card"><div class="setting-row"><span>비행기 모드</span><button class="toggle">끔</button></div><div class="setting-row"><span>다크 모드</span><button class="toggle" id="dark-toggle">끔</button></div><div class="setting-row"><span>배경화면</span><button id="wallpaper-toggle">변경</button></div><div class="setting-row"><span>기기 이름</span><b>My iPhone</b></div></div><p class="muted">이 설정은 이 가상 화면 안에서만 작동해.</p>`
};

function bindAppActions(name) {
  if (name === "messages") {
    $("send-message").addEventListener("click", () => {
      const input = $("message-input");
      const value = input.value.trim();
      if (!value) return;
      const bubble = document.createElement("div");
      bubble.className = "bubble mine";
      bubble.textContent = value;
      $("chat-area").appendChild(bubble);
      input.value = "";
    });
  }
  if (name === "notes") {
    const saved = localStorage.getItem("virtualIphoneNote") || "";
    $("note-text").value = saved;
    $("save-note").addEventListener("click", () => {
      localStorage.setItem("virtualIphoneNote", $("note-text").value);
      $("note-status").textContent = "저장했어 ✓";
    });
  }
  if (name === "music") {
    $("play-button").addEventListener("click", () => {
      playing = !playing;
      $("play-button").textContent = playing ? "Ⅱ" : "▶";
      $("play-status").textContent = playing ? "데모 재생 중 (실제 음악은 없음)" : "일시정지";
    });
  }
  if (name === "phone") {
    let number = "";
    document.querySelectorAll(".dial-key").forEach(key => key.addEventListener("click", () => {
      number += key.textContent;
      $("dial-number").textContent = number;
    }));
  }
  if (name === "settings") {
    document.querySelectorAll(".toggle").forEach(btn => btn.addEventListener("click", () => {
      btn.textContent = btn.textContent === "끔" ? "켬" : "끔";
    }));
    $("dark-toggle").addEventListener("click", () => {
      appContent.style.background = $("dark-toggle").textContent === "켬" ? "#252630" : "#f7f7fa";
      appContent.style.color = $("dark-toggle").textContent === "켬" ? "#fff" : "#202127";
    });
    $("wallpaper-toggle").addEventListener("click", () => {
      const wallpaper = document.querySelector(".wallpaper");
      wallpaper.style.background = wallpaper.dataset.alt === "yes"
        ? "radial-gradient(ellipse at 25% 20%, #fff 0, transparent 35%), linear-gradient(145deg,#e8eaf0,#d8dce6 55%,#f1edf0)"
        : "radial-gradient(ellipse at 70% 25%, #fff 0, transparent 28%), linear-gradient(145deg,#d7e4e1,#d6d8eb 55%,#f3e4e5)";
      wallpaper.dataset.alt = wallpaper.dataset.alt === "yes" ? "no" : "yes";
    });
  }
}
