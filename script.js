const HOUSE_PERCENT = 10;
let houseWallet = 0;

let maxPlayers = 4;
let currentPlayer = 0;
let time = 45;
let timer;
let roundActive = false;
let systemNumber = 0;

const players = [];
const playerDivs = document.querySelectorAll(".player");

const turnEl = document.getElementById("turnPlayer");
const timeEl = document.getElementById("time");
const myWalletEl = document.getElementById("myWallet");
const gameWalletEl = document.getElementById("gameWallet");
const houseWalletEl = document.getElementById("houseWallet");
const statusEl = document.getElementById("status");
const playBtn = document.getElementById("playBtn");

function rnd(){ return Math.floor(Math.random()*99)+1; }

function initPlayers(c){
  players.length=0;
  for(let i=0;i<c;i++){
    players.push({name:`P${i+1}`,avatar:"😀",c1:0,c2:0,my:0,game:0});
  }
}

function renderPlayers(){
  playerDivs.forEach((d,i)=>{
    if(i<maxPlayers){
      const p=players[i];
      const show=(i===currentPlayer && roundActive);
      d.style.display="block";
      d.innerHTML=`${p.avatar} ${p.name}<br>
      <div class="card">${show?p.c1:"🂠"}</div>
      <div class="card">${show?p.c2:"🂠"}</div>`;
    }else d.style.display="none";
  });
}

function highlight(){
  playerDivs.forEach((d,i)=>d.classList.toggle("active-player",i===currentPlayer));
}

function updateUI(){
  const p=players[currentPlayer];
  turnEl.innerText=currentPlayer+1;
  myWalletEl.innerText=p.my;
  gameWalletEl.innerText=p.game;
  houseWalletEl.innerText=houseWallet;
  playBtn.disabled=!roundActive || p.game < (+bet.value||0);
}

function startRound(){
  clearInterval(timer);
  roundActive=true;
  time=45; timeEl.innerText=time;
  const p=players[currentPlayer];
  p.c1=rnd(); do{p.c2=rnd()}while(p.c1===p.c2);
  document.getElementById("sys").innerText="?";
  renderPlayers(); highlight(); updateUI();
  statusEl.innerText="PLAYER TURN 🎮";
  timer=setInterval(()=>{time--;timeEl.innerText=time;if(time<=0)drop()},1000);
}

function play(){
  if(!roundActive) return;
  const betAmt=+bet.value||0;
  const p=players[currentPlayer];
  if(betAmt<=0 || p.game<betAmt) return;

  p.game-=betAmt;
  systemNumber=rnd();
  document.getElementById("sys").innerText=systemNumber;

  const min=Math.min(p.c1,p.c2), max=Math.max(p.c1,p.c2);

  if(systemNumber>min && systemNumber<max){
    const win=betAmt - Math.floor(betAmt*HOUSE_PERCENT/100);
    houseWallet -= win;
    if(houseWallet < 0) houseWallet = 0;
    p.my += win;
    statusEl.innerText=`${p.name} WON 🎉 +₹${win}`;
  }else{
    houseWallet += betAmt;
    statusEl.innerText=`${p.name} LOST ❌`;
  }

  roundActive=false; updateUI();
  setTimeout(nextPlayer,2000);
}

function drop(){
  statusEl.innerText=`${players[currentPlayer].name} DROPPED 🚫`;
  roundActive=false; updateUI();
  setTimeout(nextPlayer,2000);
}

function nextPlayer(){
  currentPlayer=(currentPlayer+1)%maxPlayers;
  startRound();
}

function setPlayers(){
  maxPlayers=+playerCount.value;
  initPlayers(maxPlayers);
  currentPlayer=0;
  renderPlayers();
  startRound();
}

function savePlayer(){
  if(playerName.value) players[currentPlayer].name=playerName.value;
  players[currentPlayer].avatar=playerAvatar.value;
  renderPlayers();
}

function addMyWallet(){
  const a=+addMy.value||0;
  if(a>0){ players[currentPlayer].my+=a; updateUI(); }
}

function addGameWallet(){
  const a=+addGame.value||0, p=players[currentPlayer];
  if(a>0 && p.my>=a){ p.my-=a; p.game+=a; updateUI(); }
}

setPlayers();
