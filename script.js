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
const RACAS = ["Humano","Elfo da Floresta","Elfo Sombrio","Anão","Orc","Goblin","Troll","Gigante","Fada","Ninfa","Sereiano","Dragão-humano","Demônio","Anjo","Vampiro","Lobisomem","Elemental de Fogo","Elemental de Água","Elemental de Terra","Elemental de Ar","Golem","Súcubo/Íncubo","Meio-Dragão","Meio-Demônio","Meio-Anjo","Centauro","Minotauro","Kitsune","Tengu","Espírito Antigo","Fantasma","Zumbi Consciente","Planta-Humana","Ciborgue","Autômato","Alienígena","Súcubo Dracônico","Fênix-Humana","Tritão do Abismo","Salamandra","Krakenídeo","Serpente-Humana","Licantropo Felino","Dragão Ancião","Arcanista Élfico","Feyndar","Homúnculo","Necromante Vivo","Espírito Guardião","Ser Celestial"];
const PODERES = ["Manipulação de Fogo","Manipulação de Água","Manipulação de Terra","Manipulação de Ar","Controle de Gelo","Controle de Raios","Telecinese","Telepatia","Controle de Sombras","Manipulação de Luz","Invocação de Criaturas","Necromancia","Magia de Sangue","Transmutação","Magia de Cura","Criação de Portais","Ilusionismo","Invisibilidade","Manipulação de Gravidade","Magia de Tempo","Explosões de Energia","Super Força","Super Velocidade","Magia da Natureza","Controle de Metais","Controle de Veneno","Armas Místicas Infinitas","Manipulação de Ossos","Magia Musical","Controle de Emoções","Aura de Medo","Magia de Cristais","Invocação de Armas","Magia de Runas","Energia Espiritual","Magia de Sonhos","Magia de Realidade","Regeneração Avançada","Magia de Caos","Controle de Som","Magia Celestial","Magia Infernal","Controle de Areia","Fúria Bestial","Cópia de Poderes","Barreira Absoluta","Armadura Viva","Magia Lunar","Magia Solar","Expansão de Domínio"];
const ORIGENS = ["Vilarejo simples","Reino poderoso","Cidade capital","Ruínas antigas","Floresta mística","Deserto amaldiçoado","Ilhas flutuantes","Submundo demoníaco","Céu celestial","Outro planeta","Outro universo","Tribo bárbara","Academia mágica","Castelo ancestral","Montanhas congeladas","Vulcão ativo","Selva hostil","Cidade subterrânea","Caverna cristalina","Laboratório secreto"];
const PERSONALIDADES = ["Corajoso","Covarde","Gentil","Cruel","Sarcástico","Misterioso","Sábio","Brincalhão","Sério","Impulsivo","Estrategista","Paciente","Agressivo","Carismático","Sombrio","Protetor","Manipulador","Obcecado","Tranquilo","Louco"];
const MOTIVACOES = ["Vingança","Riqueza","Glória","Sobrevivência","Amor","Justiça","Poder absoluto","Exploração","Paz mundial","Caos absoluto","Liberdade","Conhecimento","Fé","Herança familiar","Redenção"];
const ESCALA_PODER = ["Civil","Soldado","Elite","Mestre","Herói","Lenda","Ancestral","Semideus","Divino","Cósmico"];
const ALTURAS = ["Baixo","Médio","Alto","Gigante","Colossal"];
const DURABILIDADES = ["Frágil","Resistente","Muito resistente","Tanque","Quase indestrutível"];
const FORCAS = ["Muito fraco","Normal","Forte","Muito forte","Sobre-humano","Titânico"];
const VELOCIDADES = ["Lento","Normal","Rápido","Muito rápido","Relâmpago"];

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
let history = loadHistory();
let currentIndex = 0;
let fichaAtual = {};
let spinning = false;
let autoMode = false;

/*******************
 * ELEMENTOS       *
 *******************/
const wheel = $("#wheel");
const wctx = wheel.getContext("2d");
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
const viewTorneio = $("#view-torneio");

const histGrid = $("#hist-grid");
const btnExport = $("#btn-export");
const btnClear = $("#btn-clear");
const fileImport = $("#file-import");

const ordemList = $("#ordem-list");
const btnShuffle = $("#btn-shuffle");

const btnGenerateTournament = $("#btn-generate-tournament");
const btnNextMatch = $("#btn-next-match");
const bracketDiv = $("#tournament-bracket");
const resultDiv = $("#tournament-result");

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
  [viewRoleta, viewHistorico, viewOpcoes, viewTorneio].forEach(v=>v?.classList.remove("active"));
  if(route==="roleta") viewRoleta.classList.add("active");
  if(route==="torneio") viewTorneio.classList.add("active");
  if(route==="historico"){ viewHistorico.classList.add("active"); renderHistorico(); }
  if(route==="opcoes"){ viewOpcoes.classList.add("active"); renderOpcoes(); }
}

/*******************
 * HISTÓRICO        *
 *******************/
function loadHistory(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }catch{return []} }
function saveHistory(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); }
function saveToHistory(char){ history = [char, ...history]; saveHistory(); }
function renderHistorico(){
  histGrid.innerHTML = "";
  if(history.length===0){
    histGrid.innerHTML = `<p class="hint">Nenhum personagem salvo ainda.</p>`;
    return;
  }
  history.forEach((char,i)=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h4>${char.__tournament ? "Campeão do Torneio" : "Personagem"} #${history.length-i}</h4>
      <time>${new Date(char.__createdAt).toLocaleString()}</time>
      <ul>${Object.entries(char).filter(([k])=>!k.startsWith("__")).map(([k,v])=>`<li><strong>${k}:</strong> ${v}</li>`).join("")}</ul>`;
    histGrid.appendChild(card);
  });
}

/*******************
 * ROLETA NORMAL    *
 *******************/
function drawWheel(options){
  const size = wheel.width, cx = size/2, cy = size/2, outer = size/2-10, inner = 60, n = options.length, step = 360/n;
  wctx.clearRect(0,0,size,size);
  const grd = wctx.createRadialGradient(cx,cy,inner,cx,cy,outer); grd.addColorStop(0,"#0f1c3b"); grd.addColorStop(1,"#0a1227");
  wctx.fillStyle=grd; wctx.beginPath(); wctx.arc(cx,cy,outer,0,Math.PI*2); wctx.fill();
  for(let i=0;i<n;i++){
    const start=(angle+i*step)*Math.PI/180, end=(angle+(i+1)*step)*Math.PI/180;
    wctx.beginPath(); wctx.moveTo(cx,cy); wctx.arc(cx,cy,outer,start,end); wctx.closePath();
    wctx.fillStyle=i%2===0?"#7c3aed":"#22c55e"; wctx.fill(); wctx.lineWidth=2; wctx.strokeStyle="#0b1020"; wctx.stroke();
    const mid=(start+end)/2, tx=cx+Math.cos(mid)*(outer-50), ty=cy+Math.sin(mid)*(outer-50);
    wctx.save(); wctx.translate(tx,ty); wctx.rotate(mid); wctx.fillStyle="#0b1020"; wctx.font="14px sans-serif";
    const tw=wctx.measureText(options[i]).width; wctx.fillText(options[i],-tw/2,4); wctx.restore();
  }
  wctx.beginPath(); wctx.arc(cx,cy,outer,0,Math.PI*2); wctx.lineWidth=6; wctx.strokeStyle="#0d1530"; wctx.stroke();
  const radial=wctx.createRadialGradient(cx,cy,0,cx,cy,inner); radial.addColorStop(0,"#ffd54a"); radial.addColorStop(1,"#a970ff");
  wctx.beginPath(); wctx.arc(cx,cy,inner,0,Math.PI*2); wctx.fillStyle=radial; wctx.fill();
}

let angle=0;
function spinOnce(options,onEnd){
  if(spinning) return; spinning=true; btnSpin.disabled=true;
  const n=options.length, step=360/n, total=rand(3,6)*360+rand(0,359), startTime=performance.now(), dur=rand(1800,2600);
  function frame(now){
    const t=clamp(now-startTime,0,dur), eased=easeOutCubic(t,0,total,dur);
    angle=(angle+(eased-(angle%360)))%360; drawWheel(options);
    if(t>=dur){ angle=(angle+total)%360; drawWheel(options);
      const pos=(angle+90)%360, index=Math.floor((360-pos)/step)%n; spinning=false; btnSpin.disabled=false; onEnd(index); return;}
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function renderFicha(){
  fichaList.innerHTML=""; CATEGORIAS.forEach((c,i)=>{const li=document.createElement("li"); if(i===currentIndex) li.classList.add("live");
    li.innerHTML=`<span>${c.key}</span><span>${fichaAtual[c.key]??(i<currentIndex?"—":"…")}</span>`; fichaList.appendChild(li);});
}
function startCategory(){ finalCard.classList.add("hidden"); const cat=CATEGORIAS[currentIndex]; categoriaTitulo.textContent=`Roleta — ${cat.key}`; drawWheel(cat.options); renderFicha(); }
function nextCategory(){ if(currentIndex<CATEGORIAS.length-1){ currentIndex++; startCategory(); if(autoMode) setTimeout(()=>btnSpin.click(),500);}
  else{ showFinalCard(); saveToHistory({...fichaAtual,__createdAt:Date.now()}); fireConfetti(); fichaAtual={}; currentIndex=0; startCategory(); }}
function showFinalCard(){ finalCard.innerHTML=`<h3>✅ Personagem Gerado</h3><ul class="ficha">${CATEGORIAS.map(c=>`<li><span>${c.key}</span><span>${fichaAtual[c.key]}</span></li>`).join("")}</ul>`;
  finalCard.classList.remove("hidden"); }

/*******************
 * MODO TORNEIO     *
 *******************/
const TOURNAMENT_SIZE=8; let tournamentPlayers=[], currentMatch=0;

function generateCharacter(){
  const char={}; CATEGORIAS.forEach(c=>char[c.key]=c.options[rand(0,c.options.length-1)]);
  char.__createdAt=Date.now(); return char;
}

function startTournament(){
  tournamentPlayers=Array.from({length:TOURNAMENT_SIZE},generateCharacter);
  currentMatch=0; renderBracket(); resultDiv.innerHTML=""; btnNextMatch.disabled=false;
}

function renderBracket(){
  bracketDiv.innerHTML=""; for(let i=0;i<tournamentPlayers.length;i+=2){
    const p1=tournamentPlayers[i], p2=tournamentPlayers[i+1];
    const div=document.createElement("div"); div.className="match";
    div.innerHTML=`<strong>${p1["Raça"]}</strong> vs <strong>${p2["Raça"]}</strong>`; bracketDiv.appendChild(div);
  }
}

function nextMatch(){
  if(currentMatch>=tournamentPlayers.length/2){ 
    tournamentPlayers=tournamentPlayers.filter((_,i)=>i%2===0); 
    currentMatch=0; 
    if(tournamentPlayers.length===1){ endTournament(); return; }
    renderBracket(); return;
  }
  const i=currentMatch*2, p1=tournamentPlayers[i], p2=tournamentPlayers[i+1];
  const winner=Math.random()<0.5?p1:p2; tournamentPlayers[i]=winner;
  resultDiv.innerHTML=`<p>🏅 ${p1["Raça"]} vs ${p2["Raça"]} → <strong>${winner["Raça"]}</strong> venceu!</p>`;
  currentMatch++;
}

function endTournament(){
  const champion=tournamentPlayers[0]; champion.__tournament=true; saveToHistory(champion);
  resultDiv.innerHTML=`<h3>🏆 CAMPEÃO DO TORNEIO: ${champion["Raça"]}</h3>`; fireConfetti(); btnNextMatch.disabled=true;
}

/*******************
 * CONTROLES        *
 *******************/
btnSpin.addEventListener("click",()=>{ if(spinning) return; const cat=CATEGORIAS[currentIndex];
  spinOnce(cat.options,idx=>{ fichaAtual[cat.key]=cat.options[idx]; renderFicha(); setTimeout(nextCategory,650); }); });
btnReset.addEventListener("click",()=>{ if(spinning) return; fichaAtual={}; currentIndex=0; startCategory(); finalCard.classList.add("hidden"); });
autoToggle.addEventListener("change",e=>autoMode=e.target.checked);
btnGenerateTournament.addEventListener("click",startTournament);
btnNextMatch.addEventListener("click",nextMatch);

btnExport.addEventListener("click",()=>{ const blob=new Blob([JSON.stringify(history,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`historico_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);});
btnClear.addEventListener("click",()=>{ if(confirm("Limpar histórico?")){ history=[]; saveHistory(); renderHistorico(); }});
fileImport.addEventListener("change",e=>{const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{try{const d=JSON.parse(r.result); if(Array.isArray(d)){history=d; saveHistory(); renderHistorico();}else alert("Arquivo inválido.");}catch{alert("Erro lendo arquivo.");}}; r.readAsText(f);});

btnShuffle.addEventListener("click",()=>{ for(let i=CATEGORIAS.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [CATEGORIAS[i],CATEGORIAS[j]]=[CATEGORIAS[j],CATEGORIAS[i]];}
  renderOpcoes(); if(viewRoleta.classList.contains("active")){currentIndex=0; fichaAtual={}; startCategory();}});
function renderOpcoes(){ ordemList.innerHTML=CATEGORIAS.map(c=>`<li>${c.key}</li>`).join(""); }

/*******************
 * CONFETTI         *
 *******************/
function fireConfetti(){
  const W=confettiCanvas.width=window.innerWidth,H=confettiCanvas.height=window.innerHeight,N=160;
  const parts=Array.from({length:N}).map(()=>({x:Math.random()*W,y:-20,r:rand(4,8),c:["#ffd54a","#7c3aed","#22c55e","#38bdf8","#ef4444"][rand(0,4)],vx:(Math.random()-.5)*2,vy:rand(2,5),a:Math.random()*360,va:rand(-6,6)}));
  let t0=performance.now(),dur=2200;
  function frame(now){const t=now-t0; cctx.clearRect(0,0,W,H); parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.a+=p.va;cctx.save();cctx.translate(p.x,p.y);cctx.rotate(p.a*Math.PI/180);cctx.fillStyle=p.c;cctx.fillRect(-p.r/2,-p.r/2,p.r,p.r);cctx.restore();}); if(t<dur)requestAnimationFrame(frame); else
