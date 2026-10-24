// 06_laiks.js - Diennakts, pulkstenis, nakts sākums un rīts
// ---------- diennakts: 5 min diena + 5 min nakts ----------
function darkAt(h){const N=.68;return h>=7&&h<18?0:h>=18&&h<20?N*(h-18)/2:h>=5&&h<7?N*(1-(h-5)/2):N;}
function updateTime(dt){
 hour+=dt*24/600;if(hour>=24)hour-=24;
 const hi=Math.floor(hour);if(hi!==lastH){lastH=hi;onHour(hi);}
 skyT-=dt;if(skyT<=0){skyT=.5;drawSky(darkAt(hour));}
 if(hour>=22||hour<5){
  zT-=dt;if(zT<=0&&spawnedZ<30){zT=3.2;spawnZombie(Math.random()<.3);spawnedZ++;}
  wT-=dt;if(wT<=0&&spawnedW<10){wT=9;spawnWolf();spawnedW++;}
  sT-=dt;if(sT<=0&&spawnedS<10){sT=8;spawnSkeleton();spawnedS++;}
  if(!spawnedC&&hour>=23){spawnedC=1;spawnCannibal();}
 }
 mergeT-=dt;if(mergeT<=0){mergeT=1.5;tryMerge();}
 updateClock();
}
function onHour(h){
 if(h===19){say(t('m19'));sfx('bell');}
 else if(h===21)say(t('m21'));
 else if(h===22){spawnedZ=0;spawnedW=0;spawnedS=0;spawnedC=0;madeZW=0;zT=.5;wT=3;sT=5;say(t('m22'));sfx('howl');}
 else if(h===6)say(t('m6'));
 else if(h===7)dawn();
}
function dawn(){
 day++;say(t('m7'));
 for(const z of [...zombies]){const u=z.userData;if(u.dead)continue;if(u.kind==='w')u.flee=7;else if(u.kind==='c')u.sink=2.5;else if(u.rise>0)removeMonster(z);else if(u.kind==='s')u.crumble=Math.random()*2;else u.boom=Math.random()*2.5;}
 for(const b of humans)b.hp=Math.min(100,b.hp+30);
 for(const Tm of teams){if(!Tm.isPlayer){assignRoles(Tm);Tm.blocks+=25+10*Tm.members.length;}if(Tm.base)makePlan(Tm);}
}
function updateClock(){
 const m=Math.floor(hour*60);if(m===clkM)return;clkM=m;
 const h=Math.floor(hour),mm=m%60,ph=hour>=7&&hour<19?0:hour>=19&&hour<22?1:hour>=22||hour<5?2:3;
 $('ctime').textContent=['☀️','🌆','🌙','🌅'][ph]+' '+String(h).padStart(2,'0')+':'+String(mm).padStart(2,'0');
 $('cphase').textContent=tf('dayn',{n:day})+' · '+t('ph'+ph)+(nc[0]+nc[1]+nc[2]+nc[3]+nc[4]?'  🧟'+nc[0]+' 💀'+nc[3]+' 🐺'+nc[1]+(nc[2]?' 👹'+nc[2]:'')+(nc[4]?' 👺'+nc[4]:''):'');
 $('clock').classList.toggle('night',ph===2);
}
