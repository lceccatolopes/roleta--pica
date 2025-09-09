/**************
 * UTILIDADES *
 **************/
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const clamp = (v, mi, ma) => Math.max(mi, Math.min(ma, v));
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const easeOutCubic = (t, b, c, d) => { t/=d; t--; return c*(t*t*t + 1) + b; };

const STORAGE_KEY = "hist_personagens_v1";

/****************
 * DADOS GRANDES *
 ****************/
// 50 raças
const RACAS = [
"Humano","Elfo da Floresta","Elfo Sombrio","Anão","Orc","Goblin","Troll","Gigante","Fada","Ninfa",
"Sereiano","Dragão-humano","Demônio","Anjo","Vampiro","Lobisomem","Elemental de Fogo","Elemental de Água","Elemental de Terra","Elemental de Ar",
"Golem","Súcubo/Íncubo","Meio-Dragão","Meio-Demônio","Meio-Anjo","Centauro","Minotauro","Kitsune","Tengu","Espírito Antigo",
"Fantasma","Zumbi Consciente","Planta-Humana","Ciborgue","Autômato","Alienígena","Súcubo Dracônico","Fênix-Humana","Tritão do Abismo","Salamandra",
"Krakenídeo","Serpente-Humana","Licantropo Felino","Dragão Ancião","Arcanista Élfico","Feyndar","Homúnculo","Necromante Vivo","Espírito Guardião","Ser Celestial"
];

// 50 poderes
const PODERES = [
"Manipulação de Fogo","Manipulação de Água","Manipulação de Terra","Manipulação de Ar","Controle de Gelo","Controle de Raios","Telecinese","Telepatia","Controle de Sombras","Manipulação de Luz",
"Invocação de Criaturas","Necromancia","Magia de Sangue","Transmutação","Magia de Cura","Criação de Portais","Ilusionismo","Invisibilidade","Manipulação de Gravidade","Magia de Tempo",
"Explosões de Energia","Super Força","Super Velocidade","Magia da Natureza","Controle de Metais","Controle de Veneno","Armas Místicas Infinitas","Manipulação de Ossos","Magia Musical","Controle de Emoções",
"Aura de Medo","Magia de Cristais","Invocação de Armas","Magia de Runas","Energia Espiritual","Magia de Sonhos","Magia de Realidade","Regeneração Avançada","Magia de Caos","Controle de Som",
"Magia Celestial","Magia Infernal","Controle de Areia","Fúria Bestial","Cópia de Poderes","Barreira Absoluta","Armadura Viva","Magia Lunar","Magia Solar","Expansão de Domínio"
];

// 20 origens
const ORIGENS = [
"Vilarejo simples","Reino poderoso","Cidade capital","Ruínas antigas","Floresta mística","Deserto amaldiçoado","Ilhas flutuantes","Submundo demoníaco","Céu celestial","Outro planeta",
"Outro universo","Tribo bárbara","Academia mágica","Castelo ancestral","Montanhas congeladas","Vulcão ativo","Selva hostil","Cidade subterrânea","Caverna cristalina","Laboratório secreto"
];

// 20 personalidades
const PERSONALIDADES = [
"Corajoso","Covarde","Gentil","Cruel","Sarcástico","Misterioso","Sábio","Brincalhão","Sério","Impulsivo",
"Estrategista","Paciente","Agressivo","Carismático","Sombrio","Protetor","Manipulador","Obcecado","Tranquilo","Louco"
];

// 15 motivações
const MOTIVACOES = [
"Vingança","Riqueza","Glória","Sobrevivência","Amor","Justiça","Poder absoluto","Exploração","Paz mundial","Caos absoluto",
"Liberdade","Conhecimento","Fé","Herança familiar","Redenção"
];

// 10 escalas
const ESCALA_PODER = ["Civil","Soldado","Elite","Mestre","Herói","Lenda","Ancestral","Semideus","Divino","Cósmico"];

// demais categorias
const ALTURAS = ["Baixo","Médio","Alto","Gigante","Colossal"];
const DURABILIDADES = ["Frágil","Resistente","Muito resistente","Tanque","Quase indestrutível"];
const FORCAS = ["Muito fraco","Normal","Forte","Muito forte","Sobre-humano","Titânico"];
const VELOCIDADES = ["Lento","Normal","Rápido","Muito rápido","Relâmpago"];

// ordem padrão (pode embaralhar em Opções)
let CATEGORIAS = [
  { key: "Raça", options: RACAS },
  { key: "Altura", options: ALTURAS },
  { key: "Durabilidade", options: DURABILIDADES },
  { key: "Força", options: FORCAS },
  { key: "Velocidade", options: VELOCIDADES },
  { key: "Poder", options: PODERES },
  { key: "Origem", options: ORIGENS },
  { key: "Personalidade", options: PERSONALIDADES },
  { key: "Motivação", options: MOTIVACOES },
  { key: "Escala de Poder", options: ESCALA_PODER },
];

/*******************
 * ESTADO DA APP   *
 *******************/
let history = loadHistory();      // personagens salvos
let currentIndex = 0;             // índice da categoria atual
let fichaAtual = {};              // ficha em construção
let spinning = false;             // está girando?
let autoMode = false;             // gira sequência sozinho?

/*******************
 * ELEMENTOS       *
 *******************/
const wheel = $("#wheel");
const wctx  = wheel.getContext("2d");
const confettiCanvas = $("#confetti");
const cctx = confettiCanvas.getContext("2d");

const categoriaTitulo = $("#categoria-titulo");
const fichaList = $("#ficha-list");
const finalCard = $("#final-card");
const btnSpin = $("#btn-spin");
const btnReset = $("#btn-reset");
const autoToggle = $("#autoToggle");

const tabButtons = $$(".tab");
const viewRoleta = $("#view-roleta");
const viewHistorico = $("#view-historico");
const viewOpcoes = $("#view-opcoes");

const histGrid = $("#hist-grid");
const btnExport = $("#btn-export");
const btnClear = $("#btn-clear");
const fileImport = $("#file-import");

const ordemList = $("#ordem-list");
const btnShuffle = $("#btn-shuffle");

const themeSelect = $("#themeSelect");
const btnShare = $("#btn-share");
const btnNew = $("#btn-new");

const sfxSpin = $("#sfx-spin");
const sfxDing = $("#sfx-ding");

/*******************
 * NAVEGAÇÃO       *
 *******************/
tabButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    tabButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const route = btn.dataset.route;
    showRoute(route);
  });
});
function showRoute(route){
  [viewRoleta, viewHistorico, viewOpcoes].forEach(v=>v.classList.remove("active"));
  if(route==="roleta"){ viewRoleta.classList.add("active"); }
  if(route==="historico"){ viewHistorico.classList.add("active"); renderHistorico(); }
  if(route==="opcoes"){ viewOpcoes.classList.add("active"); renderOpcoes(); }
}
// ===== Tema =====
const THEME_KEY = "roleta_theme_v1";
function applyTheme(theme){
  document.body.classList.remove("theme-medieval","theme-neon");
  if(theme === "medieval") document.body.classList.add("theme-medieval");
  if(theme === "neon") document.body.classList.add("theme-neon");
  localStorage.setItem(THEME_KEY, theme);
  themeSelect.value = theme;
}
themeSelect.addEventListener("change", e => applyTheme(e.target.value));
applyTheme(localStorage.getItem(THEME_KEY) || "default");

/*******************
 * DESENHO DA ROLETA
 *******************/
let angle = 0; // ângulo atual (graus)
function drawWheel(options){
  const size = wheel.width;
  const cx = size/2, cy = size/2;
  const outer = size/2 - 10;
  const inner = 60;
  const n = options.length;
  const step = 360 / n;

  // fundo
  wctx.clearRect(0,0,size,size);

  // glow externo
  const grd = wctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
  grd.addColorStop(0, "#0f1c3b");
  grd.addColorStop(1, "#0a1227");
  wctx.fillStyle = grd;
  wctx.beginPath();
  wctx.arc(cx, cy, outer, 0, Math.PI*2);
  wctx.fill();

  // setores
  for(let i=0;i<n;i++){
    const start = (angle + i*step) * Math.PI/180;
    const end   = (angle + (i+1)*step) * Math.PI/180;

    wctx.beginPath();
    wctx.moveTo(cx, cy);
    wctx.arc(cx, cy, outer, start, end);
    wctx.closePath();

    wctx.fillStyle = i%2===0 ? "#7c3aed" : "#22c55e";
    wctx.fill();
    wctx.lineWidth = 2;
    wctx.strokeStyle = "#0b1020";
    wctx.stroke();

    // texto
    const mid = (start + end)/2;
    const tx = cx + Math.cos(mid) * (outer - 50);
    const ty = cy + Math.sin(mid) * (outer - 50);
    const label = options[i];

    wctx.save();
    wctx.translate(tx, ty);
    wctx.rotate(mid);
    wctx.fillStyle = "#0b1020";
    wctx.font = "14px sans-serif";
    const tw = wctx.measureText(label).width;
    wctx.fillText(label, -tw/2, 4);
    wctx.restore();
  }

  // aro
  wctx.beginPath();
  wctx.arc(cx, cy, outer, 0, Math.PI*2);
  wctx.lineWidth = 6;
  wctx.strokeStyle = "#0d1530";
  wctx.stroke();

  // miolo
  const radial = wctx.createRadialGradient(cx, cy, 0, cx, cy, inner);
  radial.addColorStop(0, "#ffd54a");
  radial.addColorStop(1, "#a970ff");
  wctx.beginPath();
  wctx.arc(cx, cy, inner, 0, Math.PI*2);
  wctx.fillStyle = radial;
  wctx.fill();

  // brilho no miolo
  wctx.beginPath();
  wctx.arc(cx-12, cy-12, 10, 0, Math.PI*2);
  wctx.fillStyle = "#ffffff99";
  wctx.fill();
}

/*******************
 * ANIMAÇÃO SPIN   *
 *******************/
function spinOnce(options, onEnd){
  if (spinning) return;
  spinning = true;
  btnSpin.disabled = true;

  // 🔊 SOM: iniciar som de giro
  try { if (sfxSpin) { sfxSpin.currentTime = 0; sfxSpin.play(); } } catch {}

  const n = options.length;
  const step = 360 / n;

  // rotação total entre 3 e 6 voltas + deslocamento aleatório
  const total = rand(3,6)*360 + rand(0,359);
  const startTime = performance.now();
  const dur = rand(1800, 2600);

  function frame(now){
    const t = clamp(now - startTime, 0, dur);
    const eased = easeOutCubic(t, 0, total, dur);
    // atualiza ângulo (não deixa crescer infinito)
    angle = (angle + (eased - (angle % 360))) % 360;

    drawWheel(options);

    if (t >= dur) {
      // ângulo final
      angle = (angle + total) % 360;
      drawWheel(options);

      // índice selecionado: pointer está no topo ( -90° )
      // ajuste: transformar ângulo para posição relativa ao topo
      const pos = (angle + 90) % 360; // o que está sob o ponteiro
      // índice “visual” (onde parou)
      const indexVisual = Math.floor((360 - pos) / step) % n;

      // índice “real” com pesos (se houver)
      const cat = CATEGORIAS[currentIndex];
      const pesosDaCat = PESOS[cat.key];
      const indexPeso = pesosDaCat ? weightedIndex(cat.options, pesosDaCat) : indexVisual;

      // usamos o indexPeso como resultado final,
      // mas mantemos a animação visual como está (indexVisual)
      const index = indexPeso;

      // 🔔 SOM: parar som de giro e tocar ding
      try { if (sfxSpin) { sfxSpin.pause(); sfxSpin.currentTime = 0; } } catch {}
      try { if (sfxDing) { sfxDing.currentTime = 0; sfxDing.play(); } } catch {}

      spinning = false;
      btnSpin.disabled = false;
      onEnd(index);
      return;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}


/*******************
 * FICHA E FLUXO   *
 *******************/
function renderFicha(){
  fichaList.innerHTML = "";
  CATEGORIAS.forEach((cat, i)=>{
    const li = document.createElement("li");
    if(i===currentIndex) li.classList.add("live");
    const left = document.createElement("span"); left.textContent = cat.key;
    const right = document.createElement("span");
    right.textContent = fichaAtual[cat.key] ?? (i<currentIndex ? "—" : "…");
    li.append(left,right);
    fichaList.appendChild(li);
  });
}

function startCategory(){
  finalCard.classList.add("hidden");
  const cat = CATEGORIAS[currentIndex];
  categoriaTitulo.textContent = `Roleta — ${cat.key}`;
  drawWheel(cat.options);
  renderFicha();
}

function nextCategory(){
  if(currentIndex < CATEGORIAS.length - 1){
    currentIndex++;
    startCategory();
    if(autoMode) setTimeout(()=>btnSpin.click(), 500);
  } else {
    // terminou personagem
    showFinalCard();
    saveToHistory({ ...fichaAtual, __createdAt: Date.now() });
    fireConfetti();
    // prepara próxima rodada
    fichaAtual = {};
    currentIndex = 0;
    startCategory();
  }
}

function showFinalCard(){
  finalCard.innerHTML = `<h3>✅ Personagem Gerado</h3>` +
    `<ul class="ficha">` +
    CATEGORIAS.map(c=>`<li><span>${c.key}</span><span>${fichaAtual[c.key]}</span></li>`).join("") +
    `</ul>`;
  finalCard.classList.remove("hidden");
}

/*******************
 * HISTÓRICO       *
 *******************/
function loadHistory(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch{ return []; }
}
function saveHistory(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
function saveToHistory(char){
  history = [char, ...history];
  saveHistory();
}
function renderHistorico(){
  histGrid.innerHTML = "";
  if(history.length === 0){
    histGrid.innerHTML = `<p class="hint">Nenhum personagem salvo ainda. Gere alguns na página da Roleta.</p>`;
    return;
  }
  history.forEach((char, i)=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>Personagem #${history.length - i}</h4>
      <time>${new Date(char.__createdAt).toLocaleString()}</time>
      <ul>
        ${Object.entries(char).filter(([k])=>!k.startsWith("__")).map(([k,v])=>`<li><strong>${k}:</strong> ${v}</li>`).join("")}
      </ul>
    `;
    histGrid.appendChild(card);
  });
}
btnExport.addEventListener("click", ()=>{
  const blob = new Blob([JSON.stringify(history, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `historico_personagens_${Date.now()}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});
btnClear.addEventListener("click", ()=>{
  if(confirm("Tem certeza que deseja limpar TODO o histórico?")){
    history = []; saveHistory(); renderHistorico();
  }
});
fileImport.addEventListener("change", (e)=>{
  const f = e.target.files?.[0]; if(!f) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(Array.isArray(data)){ history = data; saveHistory(); renderHistorico(); }
      else alert("Arquivo inválido.");
    }catch{ alert("Falha ao ler JSON."); }
  };
  reader.readAsText(f);
});

/*******************
 * OPÇÕES          *
 *******************/
function renderOpcoes(){
  ordemList.innerHTML = CATEGORIAS.map(c=>`<li>${c.key}</li>`).join("");
}
btnShuffle.addEventListener("click", ()=>{
  for(let i=CATEGORIAS.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [CATEGORIAS[i], CATEGORIAS[j]] = [CATEGORIAS[j], CATEGORIAS[i]];
  }
  renderOpcoes();
  // se estiver na roleta, recomeça a sequência
  if(viewRoleta.classList.contains("active")){
    currentIndex = 0; fichaAtual = {}; startCategory();
  }
});

/*******************
 * CONTROLES       *
 *******************/
btnSpin.addEventListener("click", ()=>{
  if(spinning) return;
  const cat = CATEGORIAS[currentIndex];
  spinOnce(cat.options, (idx)=>{
    const val = cat.options[idx];
    fichaAtual[cat.key] = val;
    renderFicha();
    setTimeout(nextCategory, 650);
  });
});
btnReset.addEventListener("click", ()=>{
  if(spinning) return;
  fichaAtual = {}; currentIndex = 0; startCategory();
  finalCard.classList.add("hidden");
});
autoToggle.addEventListener("change", (e)=>{ autoMode = e.target.checked; });

btnShare.addEventListener("click", async ()=>{
  // se tiver um cartão final mostrando o último, usa ele; senão, usa fichaAtual
  const base = Object.keys(fichaAtual).length ? fichaAtual : history[0];
  if(!base){ alert("Gere um personagem primeiro."); return; }

  const linhas = CATEGORIAS.map(c => `${c.key}: ${base[c.key] ?? "-"}`).join("\n");
  const texto = `🎲 Meu Personagem:\n${linhas}\n— Gerado na Roleta Épica`;

  if(navigator.share){
    try{ await navigator.share({ title: "Roleta Épica", text: texto }); }
    catch{}
  } else {
    await navigator.clipboard.writeText(texto);
    alert("Ficha copiada! Cole onde quiser (WhatsApp, etc.)");
  }
});

btnNew.addEventListener("click", ()=>{
  if(spinning) return;
  fichaAtual = {}; currentIndex = 0; startCategory();
  finalCard.classList.add("hidden");
  if(autoMode) setTimeout(()=>btnSpin.click(), 400);
});

/*******************
 * CONFETTI         *
 *******************/
function fireConfetti(){
  const W = confettiCanvas.width = window.innerWidth;
  const H = confettiCanvas.height = window.innerHeight;
  const N = 160;
  const parts = Array.from({length:N}).map(()=>({
    x: Math.random()*W, y: -20, r: rand(4,8),
    c: ["#ffd54a","#7c3aed","#22c55e","#38bdf8","#ef4444"][rand(0,4)],
    vx: (Math.random()-.5)*2, vy: rand(2,5), a: Math.random()*360, va: rand(-6,6)
  }));
  let t0 = performance.now(), dur = 2200;

  function frame(now){
    const t = now - t0;
    cctx.clearRect(0,0,W,H);
    parts.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.a += p.va;
      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.a * Math.PI/180);
      cctx.fillStyle = p.c;
      cctx.fillRect(-p.r/2, -p.r/2, p.r, p.r);
      cctx.restore();
    });
    if(t < dur) requestAnimationFrame(frame);
    else cctx.clearRect(0,0,W,H);
  }
  requestAnimationFrame(frame);
}

/*******************
 * BOOT            *
 *******************/
function boot(){
  // rota inicial
  showRoute("roleta");
  // inicializa roleta
  startCategory();
  // primeira render do histórico/ops para já existir estrutura ao trocar
  renderHistorico();
  renderOpcoes();
}

boot();




