// 68_tehnika_ui.js - Tehnikā telefonā tīrāks ekrāns: lidmašīnai ⬆/⬇ pogas augstumam, tehnikas dzīvība zem cilvēka dzīvības, lidmašīnas šaušanas pogā 🎯 gaiss-gaiss un 🚀 gaiss-zeme.
// Tēmekļa fiksēšana helikopteram un tankam: mērķis jāpiestūrē pie ⭕ un jānotur ~0,6 s, tad aplis kļūst sarkans un raķete/šāviņš iet uz mērķi. Bez fiksēšanas šauj taisni (tankam vairs nav automātiskās tēmēšanas).
Object.assign(T.lv,{lk_on:'🎯 Mērķis notverts'});Object.assign(T.en,{lk_on:'🎯 Target locked'});
// ---------- lidmašīna: ⬆ = Space (15. fails), ⬇ = 🔨 poga ----------
let jDn68=false;{const bm=$('bmb');bm.addEventListener('pointerdown',()=>{if(jetMode)jDn68=true;});['pointerup','pointercancel','pointerleave'].forEach(n=>bm.addEventListener(n,()=>{jDn68=false;}));}
const _toggleBuild68=toggleBuild;toggleBuild=function(){if(jetMode)return;_toggleBuild68();};
const _jetFly68=jetFly;jetFly=function(dt){_jetFly68(dt);const J=jetMode;if(!J||J.v<=15)return;const c=(keys.Space?1:0)-(jDn68?1:0);if(c)J.tAlt=Math.max(12,Math.min(70,J.tAlt+c*16*dt));};
// ---------- tehnikas dzīvība veselības panelī ----------
const vhp68=document.createElement('div');vhp68.id='vhp';vhp68.innerHTML='<span></span><div><i></i></div><b></b>';$('health').appendChild(vhp68);let vhpK68='';
function vehNow(){if(jetMode)return{ic:'✈️',v:jetMode,h:jetMode.hp,m:(jetMode.m&&jetMode.m.hp)||jetMode.hp};
 if(heliMode)return{ic:'🚁',v:heliMode,h:heliMode.hp,m:(heliMode.m&&heliMode.m.hp)||100};
 if(inTank){const t=inTank,M=t.mdl&&typeof TKM!=='undefined'&&TKM[t.mdl];if(t.hp===undefined)return null;return{ic:t.kind==='apc'?'🚙':'🛡️',v:t,h:t.hp,m:M?M.hp:t.kind==='apc'?1:2};}return null;}
// tehnikā veselības panelis kļūst garāks: augšējās pogas pabīda zem tā
function vhpShift(on){const top=on&&TOUCH?Math.round($('health').getBoundingClientRect().bottom+6)+'px':'';$('stats').style.top=top;$('topr').style.top=top;}
function vhpTick(){const o=vehNow();if(!o||o.h===undefined){if(vhpK68){vhpK68='';vhp68.style.display='none';vhpShift(false);}return;}
 o.v._mx=Math.max(o.v._mx||0,o.m||0,o.h);const f=Math.max(0,Math.min(1,o.h/o.v._mx)),k=o.ic+Math.round(o.h*10)+'/'+o.v._mx;if(k===vhpK68)return;vhpK68=k;
 vhp68.style.display='flex';vhp68.children[0].textContent=o.ic;vhp68.children[1].firstChild.style.width=(f*100)+'%';vhp68.children[1].firstChild.style.background=f>.5?'#4fc3f7':f>.25?'#ffb300':'#ff5252';
 vhp68.children[2].textContent=(o.v._mx>10?Math.round(o.h):Math.max(0,Math.round(o.h*10)/10))+' / '+o.v._mx;vhpShift(true);}
// ---------- lidmašīnas šaušanas poga: abu raķešu skaits ----------
const _renderW68=renderW;renderW=function(){_renderW68();if(!TOUCH)return;if(jetMode){const J=jetMode;jaInit(J);$('atk').innerHTML='🚀<small class="j2">🎯'+(J.aa||0)+' · 💥'+(J.rk||0)+'</small>';$('bmb').textContent='⬇';}};
// ---------- tēmekļa fiksēšana ----------
const LK={ref:null,k:null,p:0,on:false};const lkEl=document.createElement('div');lkEl.id='lock';document.body.appendChild(lkEl);const lkV=new THREE.Vector3();
const lkFoe=T2=>T2&&T2!==PT&&(PT.enemies.has(T2)||isWar());
function lkPos(o){if(o.k==='b')return{x:o.ref.g.position.x,y:1.2,z:o.ref.g.position.z};return flPos(o.ref);}
function lkAlive(o){return o.k==='b'?!o.ref.dead:flAlive(o.ref);}
function lkCands(){const L=[],me=heliMode?{x:heliMode.x,z:heliMode.z}:inTank?{x:inTank.g.position.x,z:inTank.g.position.z}:null,R=heliMode?130:110;if(!me)return L;
 const add=(ref,k)=>{const o={ref,k},p=lkPos(o);if(Math.hypot(p.x-me.x,p.z-me.z)<R)L.push(o);};
 for(const t of tanks)if(!t.dead&&t!==inTank&&lkFoe(t.driver?t.driver.team:t.army))add(t,'tank');
 for(const H of HELIS)if(H!==heliMode&&(H.st==='fly'?lkFoe(heliTeam(H)):H.st==='park'&&isWar()&&H.owner&&lkFoe(H.owner)))add(H,'heli');
 for(const J of JETS)if(J.st==='fly'&&J.pilot!=='P'&&lkFoe(pilotTeam(J)))add(J,'jet');
 if(inTank)for(const b of humans)if(!b.dead&&!b.inside&&lkFoe(b.team))add(b,'b');
 return L;}
// cik tuvu ekrāna vidum (0 = centrā); ārpus ekrāna vai aiz muguras = 9
function lkOff(o){const p=lkPos(o);lkV.set(p.x,p.y,p.z).project(camera);if(lkV.z>1||lkV.z<-1)return 9;return Math.hypot(lkV.x*camera.aspect,lkV.y);}
let lkSaid=false;
function lkTick(dt){const can=active&&NET.role!=='guest'&&(heliMode||(inTank&&!inTank.gst&&inTank.kind!=='apc'));
 if(!can){if(LK.ref||lkEl.style.display!=='none'){LK.ref=null;LK.on=false;LK.p=0;lkEl.style.display='none';}return;}
 if(LK.ref&&(!lkAlive(LK)||lkOff(LK)>(LK.on?.32:.2))){LK.ref=null;LK.on=false;LK.p=0;}
 if(!LK.ref){let best=null,bo=.16;for(const o of lkCands()){const f=lkOff(o);if(f<bo){bo=f;best=o;}}if(best){LK.ref=best.ref;LK.k=best.k;LK.p=0;LK.on=false;lkSaid=false;}}
 if(!LK.ref){lkEl.style.display='none';return;}
 if(!LK.on){LK.p+=dt/.6;if(LK.p>=1){LK.on=true;sfx('pick');if(!lkSaid){lkSaid=true;say(t('lk_on'),1);}}}
 const p=lkPos(LK);lkV.set(p.x,p.y,p.z).project(camera);const x=(lkV.x+1)/2*innerWidth,y=(1-lkV.y)/2*innerHeight,s=LK.on?46:80-34*LK.p;
 lkEl.style.display='block';lkEl.style.left=x+'px';lkEl.style.top=y+'px';lkEl.style.width=lkEl.style.height=s+'px';lkEl.classList.toggle('on',LK.on);}
// helikoptera raķete ar fiksētu mērķi pati lido uz to (bez fiksēšanas: kā līdz šim pa ⭕ līniju)
const _heliRocketLocal68=heliRocketLocal;heliRocketLocal=function(){const H=heliMode,n=JR.length,lk=LK.on&&LK.k!=='b'?LK.ref:null;_heliRocketLocal68();if(!lk||!H)return;for(let i=n;i<JR.length;i++){const r=JR[i];if(r.gd&&r.P==='P')r.lk=lk;}};
const _hrAim68=hrAim;hrAim=function(r){if(r.lk){if(flAlive(r.lk))return flPos(r.lk);r.lk=null;}return _hrAim68(r);};
// tanks: bez fiksēšanas automātiskās tēmēšanas nav; ar fiksēšanu tornis pagriežas tieši uz mērķi
let lkNoAssist=false;const _assistYaw68=assistYaw;assistYaw=function(rng){if(lkNoAssist)return null;return _assistYaw68(rng);};
const _fireTank68=fireTank;fireTank=function(){const t=inTank;if(!t||t.gst||t.kind==='apc'||NET.role==='guest')return _fireTank68();
 if(LK.on&&LK.ref){const p=lkPos(LK),x=t.g.position.x,z=t.g.position.z;yaw=Math.atan2(-(p.x-x),-(p.z-z));}
 lkNoAssist=true;try{return _fireTank68();}finally{lkNoAssist=false;}};
const _updateFx68=updateFx;updateFx=function(dt){_updateFx68(dt);vhpTick();lkTick(dt);};
