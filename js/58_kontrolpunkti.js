// 58_kontrolpunkti.js - Parastajā karā (ne misijās): 3 kontrolpunkti katrā kartē, ieņemtie punkti krāj punktus (uzvar pirmais līdz 300),
// mača garums pēc admina izvēles (10 / 20 min / bez laika), botu pastiprinājumi viļņos ik pēc 30 s, gaisa piegāde kartes vidū, kad kauja apklust,
// sērijas: 5 pēc kārtas = izlūkošanas drons (pretinieki kartē 20 s), 10 pēc kārtas = artilērijas trieciens. Par to paziņo visiem, un minikartes rāmis iekrāsojas.
Object.assign(T.lv,{cp_take:'⭕ Mēs ieņēmām punktu {n}!',cp_lost:'⚠️ Pretinieki ieņēma punktu {n}!',cp_neu:'⚪ Punkts {n} vairs nav mūsu',
 ml_0:'♾️ Bez laika',ml_10:'⏱️ 10 min',ml_20:'⏱️ 20 min',w_time:'⏱️ Laiks beidzies! Punkti {a}:{b}',w_score:'🏁 {n} sasniedza {s} punktus!',w_ot:'⏱️ Neizšķirts! Papildlaiks 1 minūte',
 rf_wave:'📻 Pastiprinājums: bāzē ieradās {n} karavīri',q_drop:'📻 Gaisa piegāde pie punkta {n}! 🪂',
 sk_n:'🔥 Sērija: {n} (5 = drons, 10 = artilērija)',sk_drone_me:'🛸 {k} pēc kārtas! Drons 20 s rāda visus pretiniekus kartē',sk_drone_my:'🛸 {n} izsauca izlūkošanas dronu! Pretinieki redzami kartē 20 s',
 sk_drone_foe:'🛸 Pretinieku drons! {n} un viņa armija tevi redz 20 s',sk_art_my:'💥 {n}: artilērijas trieciens pa pretinieku pulku!',sk_art_foe:'⚠️ Artilērija! Bēdz no sarkanā apļa kartē!',
 ws_v:'tehnika',ws_c:'punkti'});
Object.assign(T.en,{cp_take:'⭕ We captured point {n}!',cp_lost:'⚠️ The enemy captured point {n}!',cp_neu:'⚪ Point {n} is no longer ours',
 ml_0:'♾️ No limit',ml_10:'⏱️ 10 min',ml_20:'⏱️ 20 min',w_time:'⏱️ Time is up! Score {a}:{b}',w_score:'🏁 {n} reached {s} points!',w_ot:'⏱️ Draw! 1 minute of overtime',
 rf_wave:'📻 Reinforcements: {n} soldiers arrived at base',q_drop:'📻 Air drop near point {n}! 🪂',
 sk_n:'🔥 Streak: {n} (5 = drone, 10 = artillery)',sk_drone_me:'🛸 {k} in a row! The drone shows all enemies on the map for 20 s',sk_drone_my:'🛸 {n} called a recon drone! Enemies are on the map for 20 s',
 sk_drone_foe:'🛸 Enemy drone! {n} and their army can see you for 20 s',sk_art_my:'💥 {n}: artillery strike on an enemy group!',sk_art_foe:'⚠️ Artillery! Run from the red circle on the map!',
 ws_v:'vehicles',ws_c:'points'});
const CPON=()=>isWar()&&!misOn();
// ---------- punktu vietas: katrā kartē simetriski pret abām bāzēm ----------
const CPR=12,CPWIN=300;
const CPN={city:[['A','☢️ AES',-74,-74],['B','🏟️ Stadions',-72,56],['C','📡 TV tornis',74,74]],
 field:[['A','🏚️ Rietumu ciems',-80,80],['B','✚ Krustojums',0,0],['C','🏚️ Austrumu ciems',80,-80]]};
function cpDefs(){if(WMAP==='ozo')return[['A','🌳 Jāņu pļava',...ozP(205,-30)],['B','🌉 Tilts',...ozP(281,-2)],['C','🏟️ OZO Halle',...ozP(366,-6)]];return CPN[WMAP]||CPN.city;}
let CP=[],CPS=[0,0],cpNetT=0,cpTick=0,mEnd=null,MLEN=+LS.get('mlen',20);if(![0,10,20].includes(MLEN))MLEN=20;
let CPG=null,cpMap='';
function cpBuild(){if(CPG){scene.remove(CPG);freeObj(CPG);CPG=null;}CP=[];cpMap='';if(!CPON())return;cpMap=WMAP;CPG=new THREE.Group();
 for(const[id,n,x,z]of cpDefs()){const g=new THREE.Group();g.position.set(x,0,z);
  const ring=new THREE.Mesh(new THREE.RingGeometry(CPR-.7,CPR,48),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.55,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;g.add(ring);
  const pole=cube(.16,7,.16,0xdddddd,.4);pole.position.y=3.5;g.add(pole);const cloth=cube(2.2,1.3,.06,0xeeeeee,.6);cloth.position.set(1.1,1.2,0);g.add(cloth);
  const cv=document.createElement('canvas');cv.width=cv.height=64;const c2=cv.getContext('2d');c2.fillStyle='rgba(0,0,0,.55)';c2.beginPath();c2.arc(32,32,30,0,6.283);c2.fill();c2.fillStyle='#fff';c2.font='bold 40px sans-serif';c2.textAlign='center';c2.textBaseline='middle';c2.fillText(id,32,34);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false}));sp.scale.set(2.4,2.4,1);sp.position.y=8.6;g.add(sp);
  CPG.add(g);CP.push({id,n,x,z,p:0,o:-1,g,ring,cloth,cnt:[0,0]});}
 scene.add(CPG);}
const cpCol=o=>o===0?0xe53935:o===1?0x43a047:0xeeeeee;
function cpDraw(){for(const c of CP){const k=c.p<0?0:c.p>0?1:-1,col=Math.abs(c.p)<.02?0xeeeeee:cpCol(k);c.cloth.material.color.setHex(col);c.cloth.position.y=1.2+Math.abs(c.p)*5;
  const fight=c.cnt[0]>0&&c.cnt[1]>0;c.ring.material.color.setHex(fight?(Math.floor(clock.elapsedTime*4)%2?0xffb300:0xffffff):cpCol(c.o));c.cloth.rotation.y=Math.sin(clock.elapsedTime*3+c.x)*.25;}}
// kas stāv punktā: boti (arī tankos), es un draugi uz zemes
function cpWho(c){const r=[[],[]],add=(T,x,z,w)=>{const i=ARMY.indexOf(T);if(i>=0&&Math.hypot(x-c.x,z-c.z)<CPR)r[i].push(w);};
 for(const b of humans)if(!b.dead&&!b.jet&&!b.heli&&!b.para&&!b.trader)add(b.team,b.g.position.x,b.g.position.z,b);
 if(active&&pY<3&&!jetMode&&!heliMode&&!paraMode&&health>0)add(PT,player.position.x,player.position.z,'P');
 for(const G of NET.guests.values())if(G.ready&&!G.dead&&G.pos&&(G.y||0)<3&&!G.inJet&&!G.inHeli)add(GT(G),G.pos.x,G.pos.z,G);return r;}
function cpRadio(i,k,c){radio(ARMY[i],k,{n:c.id+' '+c.n});}
function cpStep(dt){for(const c of CP){const w=cpWho(c),n0=w[0].length,n1=w[1].length;c.cnt=[n0,n1];if(!!n0===!!n1)continue;
  const k=n0?0:1,n=n0||n1,s=k?1:-1,sp=(.08+.03*Math.min(n,5))*dt;c.p=Math.max(-1,Math.min(1,c.p+s*sp));
  if(c.o>=0&&c.o!==k&&c.p*s>=0){cpRadio(c.o,'cp_neu',c);c.o=-1;}
  if(Math.abs(c.p)>=1&&c.o!==k){c.o=k;cpRadio(k,'cp_take',c);cpRadio(1-k,'cp_lost',c);
   for(const q of w[k]){const key=keyOf(q);if(!key)continue;const side=k,nm=q==='P'?($('nickname').value||'?'):q.name;if(key[0]!=='B')wsGet(key,nm,side).c++;}}}}
function cpWinCheck(){if(winner)return;for(const i of[0,1])if(CPS[i]>=CPWIN){radio(ARMY[0],'w_score',{n:armyName(ARMY[i]),s:CPWIN});radio(ARMY[1],'w_score',{n:armyName(ARMY[i]),s:CPWIN});forceWin(ARMY[i]);return;}
 if(mEnd!=null&&gtime>=mEnd){const a=Math.floor(CPS[0]),b=Math.floor(CPS[1]),m=[ARMY[0].members.length,ARMY[1].members.length];
  const w=a!==b?(a>b?0:1):m[0]!==m[1]?(m[0]>m[1]?0:1):-1;if(w<0){mEnd=gtime+60;radio(ARMY[0],'w_ot');radio(ARMY[1],'w_ot');return;}
  radio(ARMY[0],'w_time',{a,b});radio(ARMY[1],'w_time',{a,b});forceWin(ARMY[w]);}}
// uzvara pēc punktiem vai laika: pretinieka atdzimšana vairs nenotiks (citādi 36. fails uzvaru attur)
function forceWin(T){const L=enemyArmy(T);for(let i=RESP.length-1;i>=0;i--)if(RESP[i].team===L)RESP.splice(i,1);warWin(T);}
// ---------- botu pastiprinājumi viļņos ----------
let wave0=0,qKillT=0,qDropT=0,lastWaveMsg=0;
const _killBot58=killBot;killBot=function(b,src){const n0=RESP.length,was=!b.dead;_killBot58(b,src);if(!CPON()||NET.role==='guest')return;if(was&&b.dead&&ARMY.includes(b.team))qKillT=gtime;
 for(let i=n0;i<RESP.length;i++){const r=RESP[i];r.t=wave0+Math.ceil((r.t-wave0)/30)*30;}};
const _respTick58=respTick;respTick=function(){if(!CPON())return _respTick58();const m0=ARMY.map(T=>T.members.length);_respTick58();
 ARMY.forEach((T,i)=>{const n=T.members.length-m0[i];if(n>1)radio(T,'rf_wave',{n});});};
// ---------- gaisa piegāde, kad kauja apklust ----------
function quietDrop(){const c=CP.filter(c=>c.o<0)[0]||CP[Math.floor(Math.random()*CP.length)];if(!c)return;
 for(let k=0;k<2;k++){const a=Math.random()*6.283,x=c.x+Math.cos(a)*(4+k*3),z=c.z+Math.sin(a)*(4+k*3),d=dropItem(x,z,'w:'+['jav','harmor','a_jav','snip','a_rpg'][Math.floor(Math.random()*5)]);d.air=34;d.m.position.y=34;
  const ch=new THREE.Mesh(new THREE.SphereGeometry(1.4,10,6,0,6.283,0,Math.PI/2),mat(0xff7043,.8));ch.position.y=2.2;ch.scale.y=.6;d.m.add(ch);d.chute=ch;d.q=c;}
 cpRadio(0,'q_drop',c);cpRadio(1,'q_drop',c);
 // pa trim tuvākajiem no katras armijas skrien pakaļ
 for(const T of ARMY){const L=humans.filter(b=>b.team===T&&!b.dead&&!b.inside&&!b.ord&&b.wrole!=='esc'&&!b.tankGoal&&!b.jetGoal&&!b.heliGoal).sort((a,b)=>Math.hypot(a.g.position.x-c.x,a.g.position.z-c.z)-Math.hypot(b.g.position.x-c.x,b.g.position.z-c.z)).slice(0,3);
  for(const b of L)b.qGoal={x:c.x,z:c.z,t:gtime+40};}}
const _botThink58=botThink;botThink=function(b){const q=b.qGoal;if(q&&CPON()&&!nearestThreat(b)&&!b.inside){if(gtime>q.t||Math.hypot(b.g.position.x-q.x,b.g.position.z-q.z)<3)b.qGoal=null;else{
  const d=drops.find(d=>d.q&&!d.air&&Math.hypot(d.x-b.g.position.x,d.z-b.g.position.z)<2);if(d)takeDrop(d,b);b.follow=false;b.tg=null;goal(b,q.x,q.z,false);return;}}
 _botThink58(b);};
// ---------- vienības iet caur punktiem un tos notur ----------
function cpPick(T,x,z){const i=ARMY.indexOf(T);let best=null,bd=1e9;for(const c of CP){if(c.o===i&&!c.cnt[1-i])continue;const d=Math.hypot(c.x-x,c.z-z);if(d<bd){bd=d;best=c;}}return best;}
let newSqT=0;
const _squadTick58=squadTick;squadTick=function(){if(!CPON()||NET.role==='guest')return _squadTick58();
 for(const S of SQ){if(S.role!=='att'||S.phase==='retreat')continue;const L=leaderOf(S);if(!L)continue;const i=ARMY.indexOf(S.team);
  if(!S.cpq&&S.route.length>=3){const c=cpPick(S.team,S.route[1][0],S.route[1][1]);if(c){S.route=[S.route[0],[c.x,c.z],...S.route.slice(2)];S.cpq=c;S.cpA=null;}else S.cpq=1;}
  }
 _squadTick58();
 // pie punkta vienība paliek, līdz tas ir mūsu (ne ilgāk par 45 s), tad iet uz nākamo neieņemto punktu vai pretinieku bāzi
 for(const S of SQ){const c=S.cpq&&S.cpq.id?S.cpq:null;if(!c||S.role!=='att'||S.phase==='retreat'||S.phase==='wait')continue;const L=leaderOf(S);if(!L)continue;const i=ARMY.indexOf(S.team);
  if(Math.hypot(L.g.position.x-c.x,L.g.position.z-c.z)<CPR+4&&S.cpA==null)S.cpA=gtime;
  if(c.o===i&&!c.cnt[1-i]){const nx=cpPick(S.team,c.x,c.z);if(nx&&nx!==c){S.route[1]=[nx.x,nx.z];S.cpq=nx;S.cpA=null;S.wi=1;S.phase='move';}}
  else if(S.wi>1&&S.cpA!=null&&gtime-S.cpA<45){S.wi=1;S.phase='move';}}
 // bāzē sakrājušies aizsargi dodas jaunā uzbrukumā (agrāk tikai tad, kad visas vienības bija zudušas)
 if(gtime>newSqT)for(const T of ARMY){const D=SQ.find(q=>q.team===T&&q.role==='def');if(!D||D.mem.length<(T.plan2==='cietoksnis'?18:12))continue;newSqT=gtime+20;
  const m=D.mem.splice(0,D.mem.length-6);m.forEach(b=>b.sq=null);const S=makeSquad(T,m,'att',['A','C','M'][Math.floor(Math.random()*3)],5);radio(T,'r_new',{n:S.name});}
 // tehnika: medī pretinieku tehniku līdz 160 m, citādi brauc uz punktu
 for(const t of tanks){const d=t.driver;if(!d||!d.g||t.dead)continue;const p=t.g.position;let bv=null,bd=160;
  for(const q of tanks){if(q===t||q.dead)continue;const own=q.driver?(q.driver.team||(q.driver.pos?GT(q.driver):null)):q===inTank?PT:null;if(!own||!d.team.enemies.has(own))continue;const dd=Math.hypot(q.g.position.x-p.x,q.g.position.z-p.z);if(dd<bd){bd=dd;bv=q;}}
  if(bv){const q=bv.g.position,l=Math.max(1,bd);t.supp={x:q.x+(p.x-q.x)/l*35,z:q.z+(p.z-q.z)/l*35};continue;}
  if(!t.supp){const c=cpPick(d.team,p.x,p.z);if(c)t.supp={x:c.x,z:c.z};}}
 // helikopteri uzbrūk pretinieku tehnikai
 for(const H of HELIS){const b=H.pilot;if(!b||!b.g||H.st!=='fly')continue;let bv=null,bd=220;
  for(const q of tanks){if(q.dead)continue;const own=q.driver?(q.driver.team||(q.driver.pos?GT(q.driver):null)):q===inTank?PT:null;if(!own||!b.team.enemies.has(own))continue;const dd=Math.hypot(q.g.position.x-H.x,q.g.position.z-H.z);if(dd<bd){bd=dd;bv=q;}}
  if(bv){H.wp=[bv.g.position.x+(H.x-bv.g.position.x)*.4,bv.g.position.z+(H.z-bv.g.position.z)*.4];H.wpT=4;}}};
// ---------- sērijas ----------
const STK=new Map(),DRONE=[0,0],ART=[];
function toHuman(sh,s,d){if(sh===0)say(s,d);else{const G=NET.guests.get(sh);if(G)netTo(G,{t:'msg',s,d});}}
function teamMsg(T,k,o,ex){const s=tf(k,o);if(T===PT&&ex!==0)say(s,4);for(const G of NET.guests.values())if(G.ready&&GT(G)===T&&G.id!==ex)netTo(G,{t:'msg',s,d:4});}
function humanName(sh){return sh===0?($('nickname').value||'?'):(NET.guests.get(sh)||{}).name||'?';}
const _wsKill58=wsKill;wsKill=function(victim,vKey,vName,vSide){const K=_wsKill58(victim,vKey,vName,vSide);if(!isWar()||NET.role==='guest')return K;
 if(vKey==='P')STK.set('0',0);else if(vKey[0]==='G')STK.set(vKey.slice(1),0);
 if(K!=null&&CPON()){const n=(STK.get(String(K))||0)+1;STK.set(String(K),n);
  if(n%10===0)streakArt(K,n);else if(n%5===0)streakDrone(K,n);else toHuman(K,tf('sk_n',{n}),2);}return K;};
function streakDrone(sh,k){const T=shooterTeam(sh);if(!T)return;const i=ARMY.indexOf(T);DRONE[i]=gtime+20;const n=humanName(sh);
 toHuman(sh,tf('sk_drone_me',{k}),4);teamMsg(T,'sk_drone_my',{n},sh);radio(ARMY[1-i],'sk_drone_foe',{n});sfx('pick');}
function droneTick(){for(const i of[0,1]){if(gtime>DRONE[i])continue;const T=ARMY[i];
  for(const h of HL){if(!h.team||h.team===T||!T.enemies.has(h.team))continue;mark(T,h.p.x,h.p.z,'s',h.b?'d'+h.b.nid:h.gst?'dg'+h.gst.id:'dp');}
  for(const t of tanks){if(t.dead)continue;const own=t.driver?(t.driver.team||(t.driver.pos?GT(t.driver):null)):t===inTank?PT:null;if(own&&T.enemies.has(own))mark(T,t.g.position.x,t.g.position.z,'t',tanks.indexOf(t));}}}
function streakArt(sh,k){const T=shooterTeam(sh);if(!T)return;const E=enemyArmy(T),i=ARMY.indexOf(T);let best=null,bn=0;
 for(const h of HL){if(h.team!==E)continue;let n=0;for(const o of HL)if(o.team===E&&Math.hypot(o.p.x-h.p.x,o.p.z-h.p.z)<14)n++;if(n>bn){bn=n;best=h.p;}}
 if(!best){streakDrone(sh,k);return;}const n=humanName(sh);ART.push({x:best.x,z:best.z,t:gtime+4,end:gtime+8,T,sh,nx:0,i});
 teamMsg(T,'sk_art_my',{n});radio(E,'sk_art_foe');}
function artTick(){for(let k=ART.length-1;k>=0;k--){const a=ART[k];if(gtime>a.end){ART.splice(k,1);continue;}if(gtime<a.t||gtime<a.nx)continue;a.nx=gtime+.5;
  const r=Math.random()*12,an=Math.random()*6.283,x=a.x+Math.cos(an)*r,z=a.z+Math.sin(an)*r,s0=SHOOTER;SHOOTER=a.sh;try{jetBoom(x,z,a.T,true,1.1,1);}finally{SHOOTER=s0;}}}
// ---------- tehnika un punkti beigu tabulā ----------
const _vehStars58=vehStars;vehStars=function(kind,owner){if(isWar()&&HITPL&&SHOOTER>=0&&NET.role!=='guest'){const ST=shooterTeam(SHOOTER),h=humanKey(SHOOTER);if(ST&&owner&&owner!==ST&&ST.enemies.has(owner)&&h)wsGet(h[0],h[1],h[2]).v++;}_vehStars58(kind,owner);};
// ---------- cikls (saimnieks) un tīkls ----------
let cpGuest=null; // draugam: [o,p,s0,s1,laiks,drons0,drons1,artilērija]
const _warSetup58=warSetup;warSetup=function(){_warSetup58();CPS=[0,0];STK.clear();DRONE[0]=DRONE[1]=0;ART.length=0;wave0=gtime;qKillT=gtime;qDropT=gtime;newSqT=gtime+30;mEnd=CPON()&&MLEN?gtime+MLEN*60:null;cpBuild();};
const _updateFx58=updateFx;updateFx=function(dt){_updateFx58(dt);
 if(!isWar()){if(CPG)cpBuild();return;}if(CPON()&&cpMap!==WMAP&&NET.role==='guest')cpBuild();if(!CP.length)return;cpDraw();if(NET.role==='guest')return;
 if(!active&&!NET.guests.size)return;cpTick-=dt;if(cpTick<=0){cpTick=.5;cpStep(.5);
  for(const c of CP)if(c.o>=0)CPS[c.o]+=.5/3;cpWinCheck();droneTick();
  if(!winner&&gtime-qKillT>20&&gtime-qDropT>45){qDropT=gtime;quietDrop();}}
 artTick();
 if(NET.role==='host'&&NET.guests.size){cpNetT-=dt;if(cpNetT<=0){cpNetT=.5;const m={t:'cps',o:CP.map(c=>c.o),p:CP.map(c=>Math.round(c.p*50)),c:CP.map(c=>c.cnt[0]&&c.cnt[1]?1:0),s:CPS.map(Math.floor),l:mEnd==null?-1:Math.max(0,Math.round(mEnd-gtime)),d:DRONE.map(v=>Math.max(0,Math.round(v-gtime))),a:ART.map(a=>[Math.round(a.x),Math.round(a.z),a.i])};
  for(const G of NET.guests.values())if(G.ready)netTo(G,m);}}};
const _netGuestMsg58=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='cps'){if(!CP.length)cpBuild();cpGuest=d;d.o.forEach((o,i)=>{const c=CP[i];if(c){c.o=o;c.p=d.p[i]/50;c.cnt=d.c[i]?[1,1]:[0,0];}});return;}_netGuestMsg58(d);};
// ---------- uz ekrāna: punkti, laiks un rāmis ----------
const fmtT=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
function cpHud(){const g=NET.role==='guest'?cpGuest:null,s=g?g.s:CPS.map(Math.floor),l=g?g.l:mEnd==null?-1:Math.max(0,mEnd-gtime);
 const ic=CP.map(c=>c.id+(c.cnt[0]&&c.cnt[1]?'⚔️':c.o===0?'🟥':c.o===1?'🟩':'⬜')).join(' ');
 return '🔴 '+s[0]+' · '+ic+' · '+s[1]+' 🟢 /'+CPWIN+(l>=0?' · ⏱ '+fmtT(l):'');}
const _warHud58=warHud;warHud=function(){_warHud58();if(!CP.length||!isWar()||!active)return;const base=wbar.textContent,cut=base.indexOf(' · ',base.indexOf('🟢'));
 const fl=(cut>=0?base.slice(cut+3):'').replace(t('w_fl_home'),'').replace(/^ · /,'');wbar.textContent=cpHud()+(fl?' · '+fl:'');};
function frameState(){const g=NET.role==='guest'?cpGuest:null,dr=g?g.d.map(v=>v>0):DRONE.map(v=>v>gtime),me=MYSIDE,art=g?g.a.length:ART.length;
 return art?'fr-art':dr[1-me]?'fr-foe':dr[me]?'fr-own':'';}
let frCur='';
const _drawMap58=drawMap;drawMap=function(){_drawMap58();if(!isWar()||!CP.length)return;const fs=frameState();if(fs!==frCur){mm.classList.remove('fr-art','fr-foe','fr-own');if(fs)mm.classList.add(fs);frCur=fs;}
 const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R,X=x=>W/2+(x-cx)*sc,Y=z=>W/2+(z-cz)*sc,blink=Math.floor(clock.elapsedTime*4)%2===0;
 for(const c of CP){const r=Math.max(6,CPR*sc);g.beginPath();g.arc(X(c.x),Y(c.z),r,0,6.283);g.fillStyle=c.o===0?'rgba(229,57,53,.75)':c.o===1?'rgba(67,160,71,.75)':'rgba(230,230,230,.6)';g.fill();
  g.lineWidth=2;g.strokeStyle=c.cnt[0]&&c.cnt[1]&&blink?'#ffb300':'#fff';g.stroke();g.fillStyle='#fff';g.font='bold '+Math.round(r*1.2)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(c.id,X(c.x),Y(c.z)+1);}
 const A=NET.role==='guest'?(cpGuest?cpGuest.a.map(([x,z])=>({x,z})):[]):ART;
 for(const a of A){g.beginPath();g.arc(X(a.x),Y(a.z),Math.max(8,16*sc),0,6.283);g.lineWidth=3;g.strokeStyle=blink?'#ff1744':'#ff9100';g.stroke();}};
// ---------- admins izvēlas mača garumu ----------
{const row=document.createElement('div');row.id='mlrow';row.innerHTML=[0,10,20].map(k=>'<button class="corner" data-k="'+k+'"></button>').join('');$('diffrow').before(row);
 row.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.preventDefault();MLEN=+b.dataset.k;LS.set('mlen',MLEN);paintMl();});}
function paintMl(){const row=$('mlrow');row.style.display=MODE==='war'&&(MST==='wm'||!MIS)&&isAdmin()&&!/[?&]join=/.test(location.search)?'flex':'none';row.querySelectorAll('button').forEach(b=>{b.textContent=t('ml_'+b.dataset.k);b.classList.toggle('on',+b.dataset.k===MLEN);});}
STV.ws.push('mlrow');STV.wm.push('mlrow');STALL.push('mlrow');
const _stPaint58=stPaint;stPaint=function(){_stPaint58();paintMl();};
const _paintMode58=paintMode;paintMode=function(){_paintMode58();paintMl();};
document.querySelectorAll('#misrow button').forEach(b=>b.addEventListener('click',()=>setTimeout(paintMl,0)));
paintMl();
// ---------- mērķu panelī ----------
Object.assign(T.lv,{g_cp:'⭕ Ieņem un noturi punktus A, B, C: pirmie līdz {n} punktiem uzvar'});Object.assign(T.en,{g_cp:'⭕ Capture and hold points A, B, C: first to {n} points wins'});
const _renderQuests58=renderQuests;renderQuests=function(){_renderQuests58();if(!isWar()||!CPON()||!qEl)return;const h=qEl.querySelector('b');if(h)h.insertAdjacentHTML('afterend','<div class="ql">'+tf('g_cp',{n:CPWIN})+'</div>');};
const _cpBuild58=cpBuild;cpBuild=function(){_cpBuild58();renderQuests();};
