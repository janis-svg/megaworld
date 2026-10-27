// 47_manekli.js - Siltuma mānekļi visai tehnikai (tanks, bruņmašīna, helikopters, lidmašīna): katrai jaunai tehnikai 2, klāt nenāk un spēlē nav atrodami.
// Kad uz tavu tehniku lido pašvadāma raķete (Javelin, lidmašīnas raķete, tanka pretgaisa šāviņš), ekrāns mirgo un pīkst (jo tuvāk, jo ātrāk),
// ♻️ poga kļūst par 🎆 (datorā G). Mānekļi deg 3 s: raķete, kas tajā laikā pietuvojas 45 m, uzsprāgst mānekļos. Tehnika paliek dzīva,
// bet jo tuvāk raķete uzsprāga, jo vairāk dzīvības zaudē. Boti tehnikā izmet mānekļus 60% gadījumu; šāvējs to redz. Karā par tīru izvairīšanos zvaigzne.
Object.assign(T.lv,{fl_warn:'🚨 RAĶETE! Spied 🎆',fl_warnk:'🚨 RAĶETE! Spied G',fl_out:'🎆 Mānekļu vairs nav',fl_save:'🎆 Taupi mānekļus: uz tevi raķete nelido',fl_ok:'🎆 Raķete novirzīta! Tehnika vesela',
 fl_dmg:'🎆 Raķete novirzīta, bet uzsprāga tuvu: tehnika bojāta',fl_bot:'🎆 Mērķis izmeta mānekļus!',fl_have:'🎆 Mānekļi pret raķetēm: {n}',st_dodge:'izvairījies'});
Object.assign(T.en,{fl_warn:'🚨 MISSILE! Press 🎆',fl_warnk:'🚨 MISSILE! Press G',fl_out:'🎆 No flares left',fl_save:'🎆 Save your flares: no missile is coming',fl_ok:'🎆 Missile fooled! Vehicle unharmed',
 fl_dmg:'🎆 Missile fooled, but it blew up close: vehicle damaged',fl_bot:'🎆 The target dropped flares!',fl_have:'🎆 Flares against missiles: {n}',st_dodge:'dodged'});
const FLN=2,FLR=45,FLB=3,FLW=130; // mānekļi tehnikā, attālums, kurā raķete tos pamana, degšanas laiks, brīdinājuma attālums
const flN=v=>v.fl===undefined?FLN:v.fl;
const flKind=v=>v.isHeli?'heli':JETS.includes(v)?'jet':'tank';
function flAlive(v){const k=flKind(v);return k==='heli'?v.st!=='gone':k==='jet'?v.st==='fly':!v.dead;}
function flPos(v){const k=flKind(v);return k==='heli'?{x:v.x,y:v.y+1.5,z:v.z}:k==='jet'?{x:v.x,y:v.y,z:v.z}:{x:v.g.position.x,y:1.5,z:v.g.position.z};}
// kas sēž tehnikā: 'P' (saimnieks), draugs (ar .pos) vai bots (ar .g)
function flOcc(v){return flKind(v)==='tank'?(v===inTank?'P':v.driver||null):v.pilot||null;}
// ---------- mānekļu izskats: 6 spoži punkti krīt un izplešas, aiz tiem dūmi ----------
const FLPT=[];
SFX.flare=()=>{noise(.45,.22,4200);tone(1400,.35,'square',.04,500);};
function flFx(x,y,z){for(let i=0;i<6;i++){const a=i/6*Math.PI*2+Math.random()*.5;FLPT.push({x,y,z,vx:Math.sin(a)*7,vy:2+Math.random()*3,vz:Math.cos(a)*7,t:1.8});}sfxAt('flare',x,z,90);}
function flFxTick(dt){for(let i=FLPT.length-1;i>=0;i--){const f=FLPT[i];f.t-=dt;if(f.t<=0){FLPT.splice(i,1);continue;}f.vy-=7*dt;f.vx*=1-dt*.8;f.vz*=1-dt*.8;f.x+=f.vx*dt;f.y=Math.max(.2,f.y+f.vy*dt);f.z+=f.vz*dt;
  part(PT_FLASH,f.x,f.y,f.z,.9+f.t*.3,.2,0,0,0,0,true);if(Math.random()<dt*14)part(PT_SMOKE,f.x,f.y,f.z,.7,1.2,0,.5,0,1.4,false,0xdedede);}}
// ---------- saimnieks: raķetes, kas lido uz tehniku ----------
function flThreats(){const L=[];
 for(const j of JV)if(j.tg&&j.tg.kind!=='mon')L.push({o:j,v:j.tg.ref,x:j.x,y:j.y,z:j.z,own:j.own??-1});
 for(const r of JR)if(r.tj||r.gv)L.push({o:r,v:r.tj||r.gv,x:r.x,y:r.y,z:r.z,own:ownId(r.owner)});
 for(const s of AAS)if(s.J)L.push({o:s,v:s.J,x:s.m.position.x,y:s.m.position.y,z:s.m.position.z,own:0});
 return L;}
function flDeploy(v){if(flN(v)<=0)return false;v.fl=flN(v)-1;v.flT=gtime+FLB;const p=flPos(v);flFx(p.x,p.y,p.z);
 if(NET.role==='host'&&NET.guests.size)netQ.push({e:'flr',x:r2(p.x),y:r2(p.y),z:r2(p.z)});return true;}
// raķete uzsprāgst mānekļos; tehnika dzīva, bet zaudē dzīvību pēc attāluma (nekad nenogalina)
function flHurt(v,frac){if(frac<=0)return;const k=flKind(v),r1=x=>Math.round(x*10)/10;
 if(k==='heli'){const mx=v.m.hp||100;v.hp=Math.max(mx*.1,v.hp-mx*frac);}
 else if(k==='jet'){const mx=v.m.hp||2;v.hp=r1(Math.max(mx*.1,v.hp-mx*frac));}
 else{const mx=v.kind==='apc'?1:2,hp=v.hp===undefined?mx:v.hp;v.hp=Math.max(mx*.1,hp-mx*frac);}}
function flTell(who,s){if(who==='P'||who===0)say(s,2.2);else{const G=typeof who==='number'?NET.guests.get(who):who;if(G&&G.pos)netTo(G,{t:'msg',s,d:2.2});}}
function flFool(th,d){const o=th.o,v=th.v;o.fooled=true;explosionFx(th.x,th.y,th.z,2.5,0xffb74d);sfxAt('boom',th.x,th.z,80);
 const frac=d<10?.5:d<20?.3:d<32?.15:0,P=flOcc(v);flHurt(v,frac);
 if(P==='P'||(P&&P.pos)){flTell(P,t(frac?'fl_dmg':'fl_ok'));if(frac){if(P==='P')flashHurt();}else if(isWar())giveStars(P==='P'?0:P.id,1,['dodge']);}
 const occ=P==='P'?0:P&&P.pos?P.id:-1;if(th.own>=0&&th.own!==occ)flTell(th.own,t('fl_bot'));}
function flRemoveFooled(){for(const A of [JV,JR,AAS])for(let i=A.length-1;i>=0;i--)if(A[i].fooled){scene.remove(A[i].m);A.splice(i,1);}}
const FLTH=new Map();let flNetT=0;
function flHostTick(dt){FLTH.clear();
 for(const t2 of tanks)if(t2.dead){t2.fl=undefined;t2.flT=0;}
 for(const th of flThreats()){const v=th.v;if(!v||!flAlive(v))continue;const p=flPos(v),d=Math.hypot(th.x-p.x,th.y-p.y,th.z-p.z);
  if((v.flT||0)>gtime&&d<FLR){flFool(th,d);continue;}
  const P=flOcc(v);
  if(P&&P.g&&flN(v)>0){if(th.o.bfl===undefined){th.o.bfl=Math.random()<.6;th.o.bfd=8+Math.random()*32;}if(th.o.bfl&&d<th.o.bfd&&flDeploy(v)){flFool(th,d);continue;}}
  if(d<FLW&&(!FLTH.has(v)||d<FLTH.get(v)))FLTH.set(v,d);}
 flRemoveFooled();
 // draugiem tehnikā: mānekļu skaits un tuvākās raķetes attālums
 if(NET.role==='host'&&NET.guests.size&&(flNetT-=dt)<=0){let hot=false;
  for(const G of NET.guests.values()){const v=G.inJet||G.inHeli;if(!v||!G.ready)continue;const d=FLTH.get(v);if(d!==undefined)hot=true;netTo(G,{t:'mlw',n:flN(v),d:d===undefined?0:r2(d)});}
  flNetT=hot?.1:.4;}}
function flPressHost(v,who){if(!v)return;if(flN(v)<=0){flTell(who,t('fl_out'));return;}if(!FLTH.has(v)){flTell(who,t('fl_save'));return;}flDeploy(v);}
// ---------- spēlētājs: brīdinājums, poga ♻️ -> 🎆, taustiņš G ----------
const mlwEl=document.createElement('div');mlwEl.id='mlw';document.body.appendChild(mlwEl);
const flBtn=$('rmb'),FLG={n:FLN,d:0,t:-9};let flPh=0,flOn=false,flVeh=null,flHaveT=null;
const flMyVeh=()=>inTank||jetMode||heliMode||null;
function flLocal(){const v=flMyVeh();if(!v)return null;if(NET.role==='guest')return{n:FLG.n,d:gtime-FLG.t<.6?FLG.d:0};const d=FLTH.get(v);return{n:flN(v),d:d===undefined?0:d};}
function flPress(){if(!active)return;const v=flMyVeh();if(!v)return;if(NET.role==='guest'){if(FLG.n<=0){say(t('fl_out'),1.5);return;}netSend({t:'flr'});return;}flPressHost(v,'P');}
const _buildAct47=buildAct;buildAct=function(rem){if(rem&&flMyVeh())return;_buildAct47(rem);};
flBtn.addEventListener('pointerdown',e=>{if(!flMyVeh())return;e.preventDefault();flPress();});
document.addEventListener('keydown',e=>{if(e.code==='KeyG'&&!e.repeat&&active&&document.activeElement.tagName!=='INPUT')flPress();});
function flUiTick(dt){const s=active?flLocal():null,H=document.documentElement;
 H.classList.toggle('vfl',!!(s&&s.n>0));
 if(s&&s.n>0)flBtn.innerHTML='🎆<small>'+s.n+'</small>';else if(flBtn.textContent!=='♻️')flBtn.textContent='♻️';
 const v=flMyVeh();if(v!==flVeh){flVeh=v;clearTimeout(flHaveT);if(v)flHaveT=setTimeout(()=>{const q=flLocal();if(q&&q.n>0)say(tf('fl_have',{n:q.n})+(TOUCH?'':' (G)'),2.5);},3000);}
 const warn=!!(s&&s.d>0);H.classList.toggle('mlw',warn&&s.n>0);
 if(!warn){if(flOn){flOn=false;mlwEl.style.opacity='0';}return;}
 if(!flOn){flOn=true;flPh=0;vib([80,60,80]);mlwEl.textContent=s.n>0?t(TOUCH?'fl_warn':'fl_warnk'):t('fl_out');}
 // mirgo jo ātrāk, jo tuvāk raķete
 const hz=2+(1-Math.min(1,s.d/FLW))*9,ph=flPh;flPh+=dt*hz;mlwEl.style.opacity=(flPh%1)<.5?'1':'.15';if(Math.floor(flPh)!==Math.floor(ph))tone(1250,.05,'square',.06);}
// ---------- kopīgā spēle ----------
const _netHostMsg47=netHostMsg;netHostMsg=function(G,d){if(d&&G.ready&&d.t==='flr'){if(!G.dead)flPressHost(G.inJet||G.inHeli,G);return;}_netHostMsg47(G,d);};
const _netGuestMsg47=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='mlw'){FLG.n=+d.n||0;FLG.d=+d.d||0;FLG.t=gtime;return;}_netGuestMsg47(d);};
const _netExtraEv47=netExtraEv2;netExtraEv2=function(e){if(e.e==='flr'){flFx(e.x,e.y,e.z);return;}_netExtraEv47(e);};
const _updateFx47=updateFx;updateFx=function(dt){_updateFx47(dt);if(NET.role!=='guest')flHostTick(dt);else if(!flMyVeh())FLG.n=FLN;flFxTick(dt);flUiTick(dt);};
