// 29_kars.js - Spēles režīms "Karš": sarkanā (spēlētāji + 30 boti) pret zaļo (30 boti) armiju, bāzes stūros ar lidmašīnām, tankiem un bruņmašīnām,
// karogs (aiznes uz savu bāzi un notur 2 diennaktis), bez briesmoņiem, ieroči un lodes parādās visā kartē.
// Abos režīmos: bruņmašīna, helikoptera 2 raķetes, kaujas bruņas (+50% dzīvība), atpazīstamas ēkas (AES, TV tornis, stadions, rūpnīca)
Object.assign(T.lv,{m_surv:'🧟 Izdzīvošana',m_war:'⚔️ Karš',red:'Sarkanā armija',green:'Zaļā armija',w_start:'⚔️ Karš! Tu esi {a} armijā. Iznīcini pretiniekus vai nozodz viņu karogu, aiznes uz savu bāzi un noturi 2 diennaktis.',in_red:'sarkanajā',in_green:'zaļajā',
 w_take:'🚩 {n} paņēma {f} karogu!',w_drop:'🚩 Nomests {f} karogs!',w_ret:'🚩 Atgriezts {f} karogs',w_cap:'🚩 Atnests {f} karogs uz {a} bāzi! Noturiet to 2 diennaktis.',g_red:'sarkano',g_green:'zaļo',w_hold:'🚩 Noturiet vēl {n} h',
 w_win:'🏆 Uzvara! Sarkanā armija uzvarēja!',w_lose:'💀 Zaudējums. Zaļā armija uzvarēja.',w_new:'Jauna spēle',w_wait:'Gaidām, kad saimnieks sāks jaunu spēli',w_arm:'🎖️ Bāzes noliktava: paņemt ieročus',w_armok:'🎖️ Paņemti ieroči, lodes un bruņas',w_armcd:'🎖️ Noliktava atkal būs pēc {n} s',
 w_veh:'🔧 Rīts: iznīcinātā tehnika atjaunota bāzēs',w_fl_home:'🚩 Karogi mājās',w_fl_my:'🚩 Mūsu karogs nozagts!',w_fl_their:'🚩 Zaļo karogs pie mums: vēl {n} h',w_fl_lost:'🚩 Zaļie tur mūsu karogu: vēl {n} h',
 apc:'🚙 Bruņmašīna (ložmetējs pret helikopteriem un kājniekiem)',apc_in:'🚙 Kāpt bruņmašīnā (🔫 {n})',busy:'Aizņemts',shop_harmor:'🦺 Kaujas bruņas (dzīvība +50%)',harmor:'🦺 Kaujas bruņas: dzīvība +50%',
 lm_aes:'Atomelektrostacija',lm_tv:'TV tornis',lm_stad:'Stadions',lm_fab:'Rūpnīca',h_rk:'🚀 {n}'});
Object.assign(T.en,{m_surv:'🧟 Survival',m_war:'⚔️ War',red:'Red army',green:'Green army',w_start:'⚔️ War! You are in the {a} army. Destroy the enemy or steal their flag, bring it to your base and hold it for 2 days.',in_red:'red',in_green:'green',
 w_take:'🚩 {n} took the {f} flag!',w_drop:'🚩 Dropped: the {f} flag!',w_ret:'🚩 Returned: the {f} flag',w_cap:'🚩 The {f} flag is at the {a} base! Hold it for 2 days.',g_red:'red',g_green:'green',w_hold:'🚩 Hold for {n} h more',
 w_win:'🏆 Victory! The red army won!',w_lose:'💀 Defeat. The green army won.',w_new:'New game',w_wait:'Waiting for the host to start a new game',w_arm:'🎖️ Base armoury: take weapons',w_armok:'🎖️ Took weapons, ammo and armour',w_armcd:'🎖️ The armoury is ready again in {n} s',
 w_veh:'🔧 Morning: destroyed vehicles are back at the bases',w_fl_home:'🚩 Flags at home',w_fl_my:'🚩 Our flag was stolen!',w_fl_their:'🚩 Green flag is with us: {n} h left',w_fl_lost:'🚩 Greens hold our flag: {n} h left',
 apc:'🚙 Armoured car (machine gun against helicopters and infantry)',apc_in:'🚙 Get in the armoured car (🔫 {n})',busy:'Busy',shop_harmor:'🦺 Combat armour (life +50%)',harmor:'🦺 Combat armour: life +50%',
 lm_aes:'Nuclear power plant',lm_tv:'TV tower',lm_stad:'Stadium',lm_fab:'Factory',h_rk:'🚀 {n}'});
let MYSIDE=LS.get('side',0)?1:0;
let MODE=LS.get('mode','surv');if(MODE!=='war')MODE='surv';const isWar=()=>MODE==='war';
{const row=document.createElement('div');row.id='moderow';row.innerHTML=['surv','war'].map(k=>'<button class="corner" data-m="'+k+'"></button>').join('');$('diffrow').before(row);
 row.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.preventDefault();MODE=b.dataset.m;LS.set('mode',MODE);paintMode();});if(/[?&]join=/.test(location.search))row.style.display='none';}
function paintMode(){document.querySelectorAll('#moderow button').forEach(b=>{b.textContent=t('m_'+b.dataset.m);b.classList.toggle('on',b.dataset.m===MODE);});}paintMode();
const _applyLang13=applyLang;applyLang=function(){_applyLang13();paintMode();};
// ---------- atpazīstamas ēkas (abos režīmos, vienādas visiem) ----------
const LMS=[{x:-88,z:-88,k:'aes',ic:'☢️'},{x:88,z:88,k:'tv',ic:'📡'},{x:-88,z:72,k:'stad',ic:'🏟️'},{x:72,z:-88,k:'fab',ic:'🏭'}];
function landmarkAtQ(x,z){return LMS.find(l=>l.x===x&&l.z===z);}
function makeLandmark(ch,L,R,key){const g=ch.group,x=L.x,z=L.z,ob=(px,pz,hx,hz)=>ch.obs.push({x:px,z:pz,hx,hz});
 if(L.k==='aes'){const r=cube(6,7,10,0xb0b4b8,.9);r.position.set(x-4,3.5,z);g.add(r);const d=new THREE.Mesh(new THREE.SphereGeometry(3,16,8,0,6.283,0,Math.PI/2),mat(0xd0d4d8,.8));d.position.set(x-4,7,z);g.add(d);ob(x-4,z,3,5);
  const ct=new THREE.Mesh(new THREE.CylinderGeometry(3,4,20,18),mat(0xcfd2d4,1));ct.position.set(x+4,10,z-1);ct.castShadow=true;g.add(ct);ob(x+4,z-1,3.6,3.6);
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(3.05,3.05,1,18),mat(0xc62828,.8));rim.position.set(x+4,19.3,z-1);g.add(rim);
  for(let i=0;i<3;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(2.4+i*.6,10,8),new THREE.MeshStandardMaterial({color:0xf5f5f5,transparent:true,opacity:.45,roughness:1}));s.position.set(x+4+i*.8,21.5+i*2.2,z-1);s.userData.dyn=true;g.add(s);}
  const sg=cube(1.6,1.6,.1,0xffd600,.6);sg.position.set(x-4,4,z-5.06);g.add(sg);const sy=cube(.5,.5,.12,0x111111,.6);sy.position.set(x-4,4,z-5.08);g.add(sy);return{h:22};}
 if(L.k==='tv'){for(let i=0;i<9;i++){const s=cube(1.2-i*.07,5,1.2-i*.07,i%2?0xffffff:0xd32f2f,.7);s.position.set(x,2.5+i*5,z);g.add(s);}const p=new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.6,1.4,14),mat(0x90a4ae,.6));p.position.set(x,32,z);g.add(p);
  const an=cube(.2,8,.2,0x444444,.5);an.position.set(x,49,z);g.add(an);const lamp=cube(.4,.4,.4,0xff1744,.3);lamp.material.emissive.set(0xff1744);lamp.position.set(x,53,z);g.add(lamp);const hb=cube(6,3,6,0x78909c,.9);hb.position.set(x+5,1.5,z+5);g.add(hb);ob(x,z,.8,.8);ob(x+5,z+5,3,3);return{h:50};}
 if(L.k==='stad'){const f=new THREE.Mesh(new THREE.PlaneGeometry(12,12),mat(0x43a047,1));f.rotation.x=-Math.PI/2;f.position.set(x,.04,z);g.add(f);
  for(const [px,pz,w,d] of [[0,-7,15,1.6],[0,7,15,1.6],[-7,-4,1.6,6.5],[-7,4,1.6,6.5],[7,-4,1.6,6.5],[7,4,1.6,6.5]]){const s=cube(w,4,d,0x9e9e9e,.9);s.position.set(x+px,2,z+pz);g.add(s);ob(x+px,z+pz,w/2,d/2);
   const seat=cube(w,.4,d,[0xe53935,0x1e88e5,0xfdd835][Math.abs(px+pz)%3],.8);seat.position.set(x+px,4.2,z+pz);g.add(seat);}
  for(const gz of [-5,5]){const gl=cube(3,1.6,.1,0xffffff,.5);gl.position.set(x,.8,z+gz);g.add(gl);}return{h:5};}
 const b=cube(12,6,8,0x8d6e63,.95);b.position.set(x,3,z-2);g.add(b);ob(x,z-2,6,4);const rf=cube(12.4,.4,8.4,0x5d4037,.9);rf.position.set(x,6.2,z-2);g.add(rf);
 for(const cx of [-3,3]){const c=new THREE.Mesh(new THREE.CylinderGeometry(.8,1.1,16,12),mat(0x795548,.9));c.position.set(x+cx,8,z+4);g.add(c);ob(x+cx,z+4,1.1,1.1);const st=new THREE.Mesh(new THREE.CylinderGeometry(.82,.82,1.2,12),mat(0xffffff,.8));st.position.set(x+cx,14.5,z+4);g.add(st);}return{h:16};}
// ---------- bāzes stūros (koki tur neaug abos režīmos) ----------
const WB=[{x:-198,z:-198,d:1},{x:198,z:198,d:-1}],BR=38; // bāzes centrs un žoga attālums no centra
const _nearAirfield13=nearAirfield;nearAirfield=function(x,z,m){return _nearAirfield13(x,z,m)||WB.some(b=>Math.abs(x-b.x)<BR+6+(m||0)&&Math.abs(z-b.z)<BR+6+(m||0));};
let WG=[],WOB=[],FL=[],ARMY=[],winner=null,dropT=0,warT=0,warNetT=0,armCd=0;
function sandbag(g,x,z,w,d){const s=cube(w,1.1,d,0x9e8a5a,1);s.position.set(x,.55,z);g.add(s);WOB.push({x,z,hx:w/2,hz:d/2,y0:0,y1:1.1});}
// dzeloņstiepļu žogs: stabi ik 4 m, 3 stieples un spirāle augšā; vārti uz kartes centra pusi, pie vārtiem smilšu maisi
function wireFence(g,B){const R=BR,gate=7,post=0x5d4037,wire=0x9e9e9e;
 const seg=(x1,z1,x2,z2)=>{const len=Math.hypot(x2-x1,z2-z1),n=Math.max(1,Math.round(len/4)),ax=Math.abs(x2-x1)>Math.abs(z2-z1);
  for(let k=0;k<=n;k++){const x=x1+(x2-x1)*k/n,z=z1+(z2-z1)*k/n,p=cube(.14,1.8,.14,post,1);p.position.set(x,.9,z);g.add(p);}
  for(const y of [.45,.95,1.45]){const w=cube(ax?len:.03,.03,ax?.03:len,wire,.5);w.position.set((x1+x2)/2,y,(z1+z2)/2);w.castShadow=false;g.add(w);}
  for(let k=0;k<n*3;k++){const x=x1+(x2-x1)*(k+.5)/(n*3),z=z1+(z2-z1)*(k+.5)/(n*3),c=new THREE.Mesh(new THREE.TorusGeometry(.28,.025,4,10),mat(wire,.5));c.position.set(x,1.95,z);c.rotation.y=ax?0:Math.PI/2;c.castShadow=false;g.add(c);}
  WOB.push({x:(x1+x2)/2,z:(z1+z2)/2,hx:ax?len/2:.15,hz:ax?.15:len/2,y0:0,y1:2.1,win:true});};
 const inX=B.d>0?1:-1; // vārti ir pusēs, kas skatās uz kartes centru
 for(const sgn of [-1,1]){
  if(sgn===inX){seg(B.x-R,B.z+sgn*R,B.x-gate,B.z+sgn*R);seg(B.x+gate,B.z+sgn*R,B.x+R,B.z+sgn*R);sandbag(g,B.x-gate-1.2,B.z+sgn*(R-2),2.4,1);sandbag(g,B.x+gate+1.2,B.z+sgn*(R-2),2.4,1);}else seg(B.x-R,B.z+sgn*R,B.x+R,B.z+sgn*R);
  if(sgn===inX){seg(B.x+sgn*R,B.z-R,B.x+sgn*R,B.z-gate);seg(B.x+sgn*R,B.z+gate,B.x+sgn*R,B.z+R);sandbag(g,B.x+sgn*(R-2),B.z-gate-1.2,1,2.4);sandbag(g,B.x+sgn*(R-2),B.z+gate+1.2,1,2.4);}else seg(B.x+sgn*R,B.z-R,B.x+sgn*R,B.z+R);}}
// novērošanas tornis: 4 kājas, kāpnes, platforma 6 m augstumā ar margām un jumtu; uz platformas var stāvēt (tā ir kā klucis)
const TOWERS=[];
function watchTower(g0,x,z){const g=new THREE.Group(),n0=WOB.length,w=0x6d4c41,H=6;
 for(const [a,b] of [[-1.5,-1.5],[1.5,-1.5],[-1.5,1.5],[1.5,1.5]]){const l=cube(.25,H+2.6,.25,w,1);l.position.set(x+a,(H+2.6)/2,z+b);g.add(l);WOB.push({x:x+a,z:z+b,hx:.15,hz:.15,y0:0,y1:H});}
 for(const y of [2,4]){for(const s of [-1.5,1.5]){const c=cube(3.2,.12,.12,w,1);c.position.set(x,y,z+s);g.add(c);const c2=cube(.12,.12,3.2,w,1);c2.position.set(x+s,y,z);g.add(c2);}}
 const pl=cube(3.8,.25,3.8,0x795548,1);pl.position.set(x,H-.12,z);g.add(pl);WOB.push({x,z,hx:1.9,hz:1.9,y0:H-.25,y1:H});
 for(const s of [-1.85,1.85]){const r=cube(3.8,.1,.1,w,1);r.position.set(x,H+1,z+s);g.add(r);const r2=cube(.1,.1,3.8,w,1);r2.position.set(x+s,H+1,z);g.add(r2);
  const sb=cube(3.8,.5,.15,0x9e8a5a,1);sb.position.set(x,H+.25,z+s);g.add(sb);}
 const roof=new THREE.Mesh(new THREE.ConeGeometry(3,1.2,4),mat(0x3e463c,.9));roof.position.set(x,H+3.1,z);roof.rotation.y=Math.PI/4;g.add(roof);
 const lx=x+2.1;for(let k=0;k<2;k++){const s=cube(.08,H+.6,.08,w,1);s.position.set(lx,(H+.6)/2,z-.4+k*.8);g.add(s);}for(let y=.5;y<H;y+=.5){const r=cube(.08,.06,.8,w,1);r.position.set(lx,y,z);g.add(r);}
 g.updateMatrixWorld(true);mergeInto(g);scene.add(g);WG.push(g);TOWERS.push({x,z,lx,lz:z,h:H,g,obs:WOB.slice(n0),rifle:true,i:TOWERS.length});}
function buildBases(){TOWERS.length=0;for(const g of WG){scene.remove(g);freeObj(g);}WG=[];for(const o of WOB)remOb(o);WOB=[];
 WB.forEach((B,i)=>{const g=new THREE.Group(),col=i?0x2e7d32:0xc62828;const pad=new THREE.Mesh(new THREE.PlaneGeometry(BR*2,BR*2),mat(0x5d5a4e,1));pad.rotation.x=-Math.PI/2;pad.position.set(B.x,.025,B.z);pad.receiveShadow=true;g.add(pad);
  wireFence(g,B);
  const hq=cube(8,4,6,0x556b2f,.9);hq.position.set(B.x+10,2,B.z-10*B.d);g.add(hq);WOB.push({x:B.x+10,z:B.z-10*B.d,hx:4,hz:3});const hr=cube(8.6,.4,6.6,col,.8);hr.position.set(B.x+10,4.2,B.z-10*B.d);g.add(hr);
  const cr=cube(2.4,1.4,1.6,0x6d4c41,.9);cr.position.set(B.x-8,.7,B.z);g.add(cr);const cl=cube(2.5,.15,1.7,col,.7);cl.position.set(B.x-8,1.45,B.z);g.add(cl);WOB.push({x:B.x-8,z:B.z,hx:1.2,hz:.8});
  for(const [tx,tz] of [[-1,-1],[1,1],[-1,1],[1,-1]])watchTower(g,B.x+tx*(BR-5),B.z+tz*(BR-5));
  g.updateMatrixWorld(true);mergeInto(g);scene.add(g);WG.push(g);});
 for(const o of WOB)addOb(o);}
function armoryNear(x,z,T){if(!isWar())return false;const i=T?ARMY.indexOf(T):MYSIDE,B=WB[i<0?MYSIDE:i];return Math.hypot(x-(B.x-8),z-B.z)<2.6;}
function armoryGive(I){for(const w of ['pistol','m16','shot','rpg','a_m16','a_m16','a_shot','a_rpg','jav'])giveLoot(w,I,null);I.meds=Math.max(I.meds,2);I.armor=Math.max(I.armor,50);I.hbelt=(I.hbelt||0)+1;I.fuel=(I.fuel||0)+1;}
// ---------- karogi ----------
function flagMesh(col){const g=new THREE.Group(),p=cube(.1,3.2,.1,0xdddddd,.4);p.position.y=1.6;g.add(p);const c=cube(1.3,.8,.05,col,.6);c.material.emissive=new THREE.Color(col).multiplyScalar(.35);c.position.set(.68,2.75,0);g.add(c);g.userData.cloth=c;scene.add(g);return g;}
function armyName(T){return T===ARMY[0]?t('g_red'):t('g_green');}
const fsay2=bcastMsgOf((k,o,d)=>say(o?tf(k,o):t(k),d||3.5));
function carrierPos(c){return c==='P'?(active?player.position:null):c&&c.pos?(c.dead||!NET.guests.has(c.id)?null:c.pos):c&&c.g?(c.dead?null:c.g.position):null;}
function carrierArmy(c){return c==='P'?PT:c&&c.pos?GT(c):c&&c.team;}
function carrierName(c){return c==='P'?$('nickname').value:c&&c.name?c.name:'?';}
function onFoot(c){return c==='P'?!inTank&&!jetMode&&!heliMode&&!paraMode:c&&c.pos?!c.inJet&&!c.inHeli:c&&!c.inside;}
function flagTick(dt){for(const F of FL){const other=F.team===ARMY[0]?ARMY[1]:ARMY[0];
  if(F.carrier){const p=carrierPos(F.carrier);if(!p){F.carrier=null;fsay2('w_drop',{f:armyName(F.team)});}else{F.x=p.x;F.z=p.z;const home=FL.find(q=>q.team===other).home;
    if(Math.hypot(F.x-home[0],F.z-home[1])<14&&(typeof carrierAlt!=='function'||carrierAlt(F.carrier)<3)){F.carrier=null;F.x=home[0]+3;F.z=home[1]+3;F.held=other;F.holdH=0;fsay2('w_cap',{f:armyName(F.team),a:armyName(other)},5);}}continue;}
  const atHome=Math.hypot(F.x-F.home[0],F.z-F.home[1])<2;
  const touch=[];if(active&&pY<1.5)touch.push('P');for(const G of NET.guests.values())if(G.ready&&!G.dead&&G.y<1.5)touch.push(G);for(const b of humans)if(!b.dead&&!b.inside&&(b.team===ARMY[0]||b.team===ARMY[1]))touch.push(b);
  for(const c of touch){const p=carrierPos(c);if(!p||!onFoot(c)||Math.hypot(p.x-F.x,p.z-F.z)>2.2)continue;const A=carrierArmy(c);
   if(A===other&&F.held!==other){F.carrier=c;F.held=null;F.holdH=0;fsay2('w_take',{n:carrierName(c),f:armyName(F.team)});break;}
   if(A===F.team&&!atHome){F.x=F.home[0];F.z=F.home[1];F.held=null;F.holdH=0;fsay2('w_ret',{f:armyName(F.team)});break;}}
  if(F.held){F.holdH+=dt*24/600;if(F.holdH>=48)warWin(F.held);}}}
function flagDraw(){for(const F of FL){if(!F.g)F.g=flagMesh(F.col);const lift=F.cid!==undefined?F.cid!==-2:!!F.carrier;F.g.position.set(F.x,lift?1.8:0,F.z);F.g.userData.cloth.rotation.y=Math.sin(clock.elapsedTime*3)*.3;}}
// ---------- uzvara ----------
const winEl=document.createElement('div');winEl.id='warwin';winEl.className='panel';document.body.appendChild(winEl);
function showWin(w){winEl.innerHTML='<h1>'+t((w==='red')===(MYSIDE===0)?'w_win':'w_lose')+'</h1>'+(NET.role==='guest'?'<p>'+t('w_wait')+'</p>':'<button id="warnew">'+t('w_new')+'</button>');winEl.style.display='block';fanfare();
 const b=$('warnew');if(b)b.onclick=()=>{winEl.style.display='none';start();};}
function warWin(T){if(winner)return;winner=T===ARMY[0]?'red':'green';showWin(winner);if(NET.role==='host')netQ.push({e:'win',w:winner});}
// ---------- bruņmašīna (kā tanks: vada tas, kurš uzaicināja) ----------
function apcMesh(){const g=new THREE.Group(),c=0x5b6b3a;const hull=cube(2.6,1.2,5.2,c,.8);hull.position.y=1.1;g.add(hull);const nose=cube(2.4,.8,1.2,c,.8);nose.position.set(0,1.2,-3);nose.rotation.x=.5;g.add(nose);
 for(const x of [-1.35,1.35])for(const z of [-1.9,-.65,.65,1.9]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.35,12),mat(0x1a1a1a,.9));w.rotation.z=Math.PI/2;w.position.set(x,.5,z);g.add(w);}
 const tur=new THREE.Group();tur.position.set(0,1.9,.3);g.add(tur);const tt=cube(1.1,.6,1.3,c,.7);tt.position.y=.3;tur.add(tt);const br=cube(.14,.14,1.8,0x222222,.5);br.position.set(0,.4,-1.4);tur.add(br);
 const st=cube(.5,.5,.05,0xc0392b,.6);st.position.set(0,1.2,2.62);g.add(st);g.userData.tur=tur;g.userData.hull=hull;return g;}
function addApc(x,z,a){const g=apcMesh();g.position.set(x,0,z);g.rotation.y=a||0;scene.add(g);const t={g,shells:1,dead:false,kind:'apc',ammo:300,hp:1,ob:{x,z,hx:1.6,hz:2.8}};addOb(t.ob);tanks.push(t);return t;}
function addTank(x,z,a){const g=tankMesh();g.position.set(x,0,z);g.rotation.y=a||0;scene.add(g);const t={g,shells:10,dead:false,kind:'tank',hp:2,ob:{x,z,hx:1.8,hz:1.8}};addOb(t.ob);tanks.push(t);return t;}
const _spawnTanks13=spawnTanks;spawnTanks=function(){_spawnTanks13();for(const t of tanks){t.kind='tank';t.hp=2;}for(let i=0;i<2;i++){let x=0,z=0;for(let k=0;k<30;k++){[x,z]=roadPoint(0,0,1e9);if(Math.hypot(x,z)>40)break;}addApc(x,z,Math.random()*6.283);}};
const _destroyTank13=destroyTank;destroyTank=function(t,team,n){if(t.dead)return;if(n&&(t.hp||1)>n){t.hp-=n;explosionFx(t.g.position.x,1.6,t.g.position.z,2,0xff9e40);sfxAt('boom',t.g.position.x,t.g.position.z,80);return;}
 const d=t.driver;if(d){t.driver=null;d.tankV=null;d.inside=false;killBot(d,team||null);}_destroyTank13(t,team);t.ammo=0;};
const _enterTank13=enterTank;enterTank=function(tk){if(tk.driver){say(t('busy'),1);return;}_enterTank13(tk);};
const _fireTank13=fireTank;fireTank=function(){const t=inTank;if(!t||t.kind!=='apc')return _fireTank13();if(attackWait>0)return;if(!(t.ammo>0)){say(T[L].heli_noammo,1.5);return;}attackWait=.12;t.ammo--;
 const px=player.position.x,pz=player.position.z,tg=apcAim(px,pz,yaw,PT);const tx=tg?tg.x:px-Math.sin(yaw)*40,ty=tg?tg.y:1,tz=tg?tg.z:pz-Math.cos(yaw)*40;if(tg)yaw+=Math.atan2(Math.sin(Math.atan2(-(tx-px),-(tz-pz))-yaw),Math.cos(Math.atan2(-(tx-px),-(tz-pz))-yaw))*.3;
 mgShot(px-Math.sin(yaw)*1.5,2.4,pz-Math.cos(yaw)*1.5,tx+(Math.random()-.5),ty,tz+(Math.random()-.5),PT,true,20);if(Math.random()<.6)tone(150,.05,'square',.06,90);renderW();};
function apcAim(px,pz,a,team){let best=null,bs=1e9;const look=(x,y,z,kb)=>{const dx=x-px,dz=z-pz,d=Math.hypot(dx,dz);if(d>70||d<2)return;let df=Math.atan2(-dx,-dz)-a;df=Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));if(df>.6)return;const s=df*40+d*.2-kb;if(s<bs){bs=s;best={x,y,z};}};
 for(const H of HELIS)if(H.st==='fly'&&heliTeam(H)!==team)look(H.x,H.y+1.5,H.z,15);if(typeof JETS!=='undefined')for(const J of JETS)if((J.st==='fly'||J.st==='fall')&&J.y<35&&pilotTeam(J)!==team)look(J.x,J.y,J.z,10);
 for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0))look(z.position.x,1.2,z.position.z,0);}for(const h of HL)if(h.team!==team&&team.enemies.has(h.team))look(h.p.x,(h.y||0)+1.2,h.p.z,0);return best;}
function mgShot(x,y,z,tx,ty,tz,team,pl,dmg){if(typeof JETS!=='undefined')for(const J of JETS)if((J.st==='fly'||J.st==='fall')&&pilotTeam(J)!==team&&Math.hypot(J.x-tx,J.y-ty,J.z-tz)<4){tracer(x,y,z,tx,ty,tz);if(Math.random()<.08)jetDamage(J,1,team,pl);return;}heliShot({m:{dmg}},x,y,z,tx,ty,tz,team,pl);}
const _move13=move;move=function(dt){const x0=player.position.x,z0=player.position.z;_move13(dt);if(inTank&&inTank.kind==='apc'){player.position.x+=(player.position.x-x0)*.6;player.position.z+=(player.position.z-z0)*.6;pushOut(player.position,1.7,0,PT);clampW(player.position);}};
const _renderW13=renderW;renderW=function(){_renderW13();if(!TOUCH)return;if(inTank&&inTank.kind==='apc')$('atk').innerHTML='🔫<small>'+(inTank.ammo||0)+'</small>';if(typeof heliMode!=='undefined'&&heliMode)$('wsw').innerHTML='🚀<small>'+(heliMode.rk||0)+'</small>';};
const _updateHint13=updateHint;updateHint=function(){const o=nearInter(),h=$('hint');
 if(o&&o.type==='tank'&&o.t.kind==='apc'&&!o.t.dead){h.textContent=(TOUCH?'':'E / ')+tf('apc_in',{n:o.t.ammo||0});h.style.display='block';setAct('🚙');return;}
 if(o&&o.type==='armory'){h.textContent=(TOUCH?'':'E / ')+t('w_arm');h.style.display='block';setAct('🎖️');return;}_updateHint13();};
// ---------- helikoptera raķetes (2): pret tehniku (bruņmašīnai 1, tankam 2) vai pa zemi ----------
const _spawnHeli13=spawnHeli;spawnHeli=function(i){const H=_spawnHeli13(i);H.rk=2;return H;};
function heliRocketTarget(H,team){const fx=-Math.sin(H.a),fz=-Math.cos(H.a);let best=null,bs=1e9;const look=(x,z,y)=>{const dx=x-H.x,dz=z-H.z,d=Math.hypot(dx,dz);if(d>85)return;const df=d<2?0:Math.acos(Math.max(-1,Math.min(1,(dx*fx+dz*fz)/d)));if(df>.6)return;if(df*40+d*.2<bs){bs=df*40+d*.2;best={x,y,z};}};
 for(const t of tanks)if(!t.dead&&t!==inTank&&(!t.driver||t.driver.team!==team))look(t.g.position.x,t.g.position.z,1.2);
 if(team!==PT&&inTank&&team.enemies.has(PT))look(inTank.g.position.x,inTank.g.position.z,1.2);
 for(const Q of HELIS)if(Q!==H&&Q.st==='park'&&Q.owner!==team)look(Q.x,Q.z,Q.y+1);
 return best||{x:H.x+fx*25,y:0,z:H.z+fz*25};}
function heliRocket(H,team,pl,tp){if(!(H.rk>0))return;H.rk--;tp=tp||heliRocketTarget(H,team);spawnJetRocket(H.x-Math.sin(H.a)*2,H.y+1,H.z-Math.cos(H.a)*2,tp.x,tp.y,tp.z,team,pl,H.pilot,null,.8);JR[JR.length-1].th=1;}
function heliRocketLocal(){const H=heliMode;if(!H||!(H.rk>0)||H.y<2)return;const tp=heliRocketTarget(H,PT);if(NET.role==='guest'){H.rk--;netSend({t:'hrk',id:H.id,a:[r2(tp.x),r2(tp.y),r2(tp.z)]});}else heliRocket(H,PT,true,tp);renderW();}
{const w=$('wsw');w.addEventListener('pointerdown',()=>{if(typeof heliMode!=='undefined'&&heliMode)heliRocketLocal();});}
document.addEventListener('keydown',e=>{if(e.code==='KeyR'&&!e.repeat&&typeof heliMode!=='undefined'&&heliMode)heliRocketLocal();});
const _nextW13=nextW;nextW=function(){if(typeof heliMode!=='undefined'&&heliMode)return;_nextW13();};
const _updateHint13b=updateHint;updateHint=function(){_updateHint13b();if(typeof heliMode!=='undefined'&&heliMode){const h=$('hint');h.textContent+=' · '+tf('h_rk',{n:heliMode.rk||0})+(TOUCH?' (🔄)':' (R)');}};
// ---------- kaujas bruņas: cits izskats un dzīvība +50% ----------
SHOPS.weapons.push(['harmor',70]);
const _giveLoot13=giveLoot;giveLoot=function(k,I,Tm){if(k==='harmor'){I.heavy=true;I.armor=100;return t('harmor');}return _giveLoot13(k,I,Tm);};
const _rollLoot13=rollLoot;rollLoot=function(R,p){const r=_rollLoot13(R,p);if(r.length&&R()<.04)return['harmor'];return r;};
const _itemMesh13=itemMesh;itemMesh=function(type){if(type!=='harmor')return _itemMesh13(type);const m=new THREE.Group(),b=cube(.5,.55,.24,0x4b5320,.7),h=cube(.32,.2,.3,0x4b5320,.7);h.position.y=.42;m.add(b,h);return m;};
const _damagePlayer13=damagePlayer;damagePlayer=function(d,s,p){_damagePlayer13(inv&&inv.heavy?d/1.5:d,s,p);};
const _damageGuest13=damageGuest;damageGuest=function(G,d,s,p){_damageGuest13(G,G.I.heavy?d/1.5:d,s,p);if(G.dead)G.I.heavy=false;};
const _hurtBot13=hurtBot;hurtBot=function(b,d,s,pl,pi){if(b.tankV)return;_hurtBot13(b,b.heavy?d/1.5:d,s,pl,pi);};
const _gameOver13=gameOver;gameOver=function(){if(inv)inv.heavy=false;_gameOver13();};
const _updateHealth13=updateHealth;updateHealth=function(){_updateHealth13();if(inv&&inv.heavy)$('hpstate').textContent+=' · 🦺 +50%';};
const _lookArr13=lookArr;lookArr=function(){return[..._lookArr13().slice(0,3),inv&&inv.heavy?'hv':''];};
const _dressMesh13=dressMesh;dressMesh=function(m,a,isP){_dressMesh13(m,a,isP);if(!m||!a||a[3]!=='hv')return;const acc=m.userData.acc,c=0x4b5320;
 const v=cube(.78,.62,.44,c,.8);v.position.y=1.18;const hl=cube(.54,.22,.52,c,.7);hl.position.y=2.03;const vz=cube(.5,.06,.12,0x222222,.5);vz.position.set(0,1.78,-.24);acc.add(v,hl,vz);m.userData.apk=a.join();};
let lastHv=false;
// ---------- karš: sākums ----------
const SLOTS0=SLOTS.slice();
function warSlots(){SLOTS.length=0;if(!isWar()){SLOTS.push(...SLOTS0);return;}for(const B of WB)for(let k=0;k<4;k++)SLOTS.push([B.x-15+k*10,B.z+20*B.d]);}
function clearNonTraders(){for(const b of [...humans]){if(b.trader)continue;scene.remove(b.g);freeObj(b.g);delBar(b.bar);delLabel(b.lab);const i=humans.indexOf(b);humans.splice(i,1);}
 for(let i=teams.length-1;i>=0;i--){const T=teams[i];T.members=T.members.filter(m=>humans.includes(m));if(!T.isPlayer&&!T.traderT&&!T.members.length)teams.splice(i,1);}}
function warSetup(){winner=null;winEl.style.display='none';buildBases();
 clearNonTraders();for(const z of [...zombies])removeMonster(z);for(const c of [...chickens])if(!c.owned)removeChicken(c);
 const hs=MYSIDE;PT.color=hs?0x2e7d32:0xd32f2f;PT.base={x:WB[hs].x,z:WB[hs].z};PT.inner=0;PT.plan=[];
 const G=newTeam(hs?0xd32f2f:0x2e7d32);G.noOffer=true;G.base={x:WB[1-hs].x,z:WB[1-hs].z};G.inner=0;G.plan=[];G.blocks=0;ARMY=hs?[G,PT]:[PT,G];war(PT,G);for(const g of NET.guests.values())g.team=g.side===undefined?PT:ARMY[g.side];
 const nm=[...NAMES].sort(()=>Math.random()-.5);let ni=0;
 ARMY.forEach((T,ai)=>{const B=WB[ai];for(let i=0;i<30;i++){const I=botInv(true);if(Math.random()<.25){I.has.jav=true;I.ammo.jav=2;}I.ammo.m16=Math.max(I.ammo.m16,40);I.has.m16=true;
  const heavy=Math.random()<.25,b=newBot(T,B.x+(Math.random()-.5)*40,B.z+(Math.random()-.5)*40,nm[ni++%nm.length],I,heavy);b.heavy=heavy;b.wrole=T===PT&&i<4?'esc':['att','def','hunt'][i%3];b.cmd=b.wrole==='esc'?'follow':'gather';b.role='gather';}});
 for(const t of tanks){scene.remove(t.g);freeObj(t.g);remOb(t.ob);}tanks.length=0;inTank=null;
 WB.forEach((B,ai)=>{const a=B.d>0?Math.PI:0;for(let k=0;k<2;k++){const t=addTank(B.x-12+k*8,B.z-18*B.d,a);t.home={x:t.g.position.x,z:t.g.position.z,a};t.army=ARMY[ai];const c=addApc(B.x+6+k*7,B.z-18*B.d,a);c.home={x:c.g.position.x,z:c.g.position.z,a};c.army=ARMY[ai];}});
 for(const J of JETS){J.a=WB[J.slot<4?0:1].d>0?Math.PI:0;J.g.rotation.y=J.a;J.army=ARMY[J.slot<4?0:1];}
 FL=WB.map((B,i)=>({team:ARMY[i],col:i?0x2e7d32:0xd32f2f,home:[B.x,B.z],x:B.x,z:B.z,carrier:null,held:null,holdH:0,g:FL[i]&&FL[i].g}));
 player.position.set(WB[hs].x+2,0,WB[hs].z+4);armCd=0;dropT=3;
 newQuests();renderQuests();renderTeam();updatePpl();say(tf('w_start',{a:t(MYSIDE?'in_green':'in_red')}),7);if(NET.role==='host')netQ.push({e:'tkk',L:tanks.map(t=>t.kind)});}
function warTeardown(){for(const g of WG){scene.remove(g);freeObj(g);}WG=[];for(const o of WOB)remOb(o);WOB=[];for(const F of FL)if(F.g){scene.remove(F.g);freeObj(F.g);}FL=[];ARMY=[];winner=null;winEl.style.display='none';}
const _start13=start;start=function(){warSlots();if(!isWar())warTeardown();_start13();if(isWar())warSetup();else if(NET.role==='host')netQ.push({e:'tkk',L:tanks.map(t=>t.kind)});};
// briesmoņu karā nav
for(const fn of ['spawnZombie','spawnSkeleton','spawnCannibal','spawnWolf','spawnForestMan','spawnBoss','startRaid','settleTick']){const o=window[fn];if(typeof o!=='function')continue;window[fn]=function(...a){if(isWar())return;return o.apply(this,a);};}
{const o=respawnForest;respawnForest=function(){if(isWar())return;o();};const o2=transformForest;transformForest=function(){return isWar()?0:o2();};}
const _onHour13=onHour;onHour=function(h){if(isWar()&&(h===19||h===21||h===22||h===23))return;_onHour13(h);};
const _newQuests13=newQuests;newQuests=function(){_newQuests13();if(isWar()){const bad=['kz','ks','kf','night','house','recruit'];const pool=QP.filter(q=>!bad.includes(q[0])).sort(()=>Math.random()-.5);QS.q=pool.slice(0,3).map(([id,ic,n])=>({id,n,p:0}));qDirty=true;}};
// rītā iznīcinātā tehnika atjaunojas bāzēs (boti nē)
const _dawn13=dawn;dawn=function(){_dawn13();if(!isWar()||NET.role==='guest')return;let n=0;
 for(const t of tanks)if(t.home&&t.dead&&!t.driver){t.dead=false;t.hp=t.kind==='apc'?1:2;t.shells=10;t.ammo=300;t.g.userData.hull.material.color.setHex(t.kind==='apc'?0x5b6b3a:0x4b5320);t.g.position.set(t.home.x,0,t.home.z);t.g.rotation.y=t.home.a;t.ob.x=t.home.x;t.ob.z=t.home.z;remOb(t.ob);addOb(t.ob);n++;}
 for(const H of HELIS)if(H.st==='gone')H.rs=1;else H.rk=2;for(const J of JETS){J.army=ARMY[J.slot<4?0:1];if(J.st==='park'){J.a=WB[J.slot<4?0:1].d>0?Math.PI:0;J.g.rotation.y=J.a;}}if(n)fsay2('w_veh');taken.clear();};
const _destroyHeli13=destroyHeli;destroyHeli=function(H,team){_destroyHeli13(H,team);if(isWar())H.rs=1e9;};
// ---------- karā boti: uzbrūk, sargā karogu, medī; brauc ar tankiem, lido ----------
function enemyArmy(T){return T===ARMY[0]?ARMY[1]:ARMY[0];}
const _botThink13=botThink;botThink=function(b){
 if(!isWar()||b.trader||b.jet||b.para||b.heli||b.tankV||b.jetGoal||b.heliGoal||(ARMY.indexOf(b.team)<0))return _botThink13(b);
 if(b.tankGoal){const t=b.tankGoal;if(t.dead||t.driver||t===inTank||t.res!==b){b.tankGoal=null;}else{const p=b.g.position;if(Math.hypot(p.x-t.g.position.x,p.z-t.g.position.z)<3.5){botTankBoard(b,t);return;}b.tg=null;b.follow=false;goal(b,t.g.position.x+2.5,t.g.position.z,false);return;}}
 if(nearestThreat(b)||b.wrole==='esc')return _botThink13(b);
 const p=b.g.position,E=enemyArmy(b.team),myF=FL.find(F=>F.team===b.team),thF=FL.find(F=>F.team===E);let tx,tz;
 if(thF&&thF.carrier===b){tx=myF.home[0];tz=myF.home[1];}
 else if(myF&&(myF.carrier||Math.hypot(myF.x-myF.home[0],myF.z-myF.home[1])>2)&&(b.wrole!=='att'||Math.hypot(myF.x-p.x,myF.z-p.z)<60)){tx=myF.x;tz=myF.z;}
 else if(b.wrole==='att'&&thF&&!thF.carrier){tx=thF.x;tz=thF.z;}
 else if(b.wrole==='def'){if(!b.gx||Math.random()<.05){const a=Math.random()*6.283,r=6+Math.random()*16;tx=myF.home[0]+Math.cos(a)*r;tz=myF.home[1]+Math.sin(a)*r;}else return;}
 else{let best=null,bd=1e9;for(const h of HL){if(h.team!==E)continue;const d=Math.hypot(h.p.x-p.x,h.p.z-p.z);if(d<bd){bd=d;best=h.p;}}if(best){tx=best.x;tz=best.z;}else{tx=thF?thF.home[0]:0;tz=thF?thF.home[1]:0;}}
 b.follow=false;b.tg=null;const far=Math.hypot(tx-p.x,tz-p.z)>70;if(Math.hypot(tx-p.x,tz-p.z)>2)goal(b,tx+(Math.random()-.5)*3,tz+(Math.random()-.5)*3,far);else b.gx=null;};
function botTankBoard(b,t){b.tankGoal=null;t.res=null;b.tankV=t;b.inside=true;b.tg=null;b.gx=null;b.follow=false;t.driver=b;remOb(t.ob);t.st={};t.fcd=2;}
function botTankDrive(t,b,dt){const p=t.g.position,T=b.team;let best=null,bd=t.kind==='apc'?70:90;
 for(const h of HL){if(h.team===T||!T.enemies.has(h.team))continue;const d=Math.hypot(h.p.x-p.x,h.p.z-p.z);if(d<bd){bd=d;best={x:h.p.x,y:(h.y||0)+1.2,z:h.p.z};}}
 if(t.kind==='apc')for(const H of HELIS)if(H.st==='fly'&&heliTeam(H)&&T.enemies.has(heliTeam(H))){const d=Math.hypot(H.x-p.x,H.z-p.z);if(d<bd){bd=d;best={x:H.x,y:H.y+1.5,z:H.z};}}
 for(const q of tanks)if(q!==t&&!q.dead&&((q.driver&&T.enemies.has(q.driver.team))||(q===inTank&&T.enemies.has(PT)))){const d=Math.hypot(q.g.position.x-p.x,q.g.position.z-p.z)-15;if(d<bd){bd=d;best={x:q.g.position.x,y:1.2,z:q.g.position.z};}}
 const E=enemyArmy(T),F=FL.find(q=>q.team===E),goalP=best||t.supp||(F?{x:F.home[0],z:F.home[1]}:{x:0,z:0}),dist=Math.hypot(goalP.x-p.x,goalP.z-p.z);
 const ox=p.x,oz=p.z;if(dist>(best?(t.kind==='apc'?18:25):6))stepTo(p,goalP.x,goalP.z,t.kind==='apc'?7:4.5,dt,1.7,T,t.st);if(Math.hypot(p.x-ox,p.z-oz)>.01){let df=Math.atan2(-(p.x-ox),-(p.z-oz))-t.g.rotation.y;df=Math.atan2(Math.sin(df),Math.cos(df));t.g.rotation.y+=df*Math.min(1,dt*3);}
 if(best){t.g.userData.tur.rotation.y=Math.atan2(-(best.x-p.x),-(best.z-p.z))-t.g.rotation.y;t.fcd-=dt;
  if(t.kind==='apc'){if(t.fcd<=0&&t.ammo>0&&bd<60){t.fcd=.18;t.ammo--;mgShot(p.x,2.4,p.z,best.x+(Math.random()-.5)*1.6,best.y,best.z+(Math.random()-.5)*1.6,T,false,14);sfxAt('shoot',p.x,p.z,40);}}
  else if(t.fcd<=0&&t.shells>0&&bd<55&&!blockedLine(p,best,1.9,T)){t.fcd=3.5;t.shells--;botShell(p.x,p.z,best.x,best.z,T);}}
 b.g.position.set(p.x,0,p.z);b.g.visible=false;b.lab.visible=b.bar.bg.visible=b.bar.f.visible=false;}
const BSH=[];
function botShell(x,z,tx,tz,T){const d=Math.hypot(tx-x,tz-z)||1,m=new THREE.Mesh(RGEO,new THREE.MeshBasicMaterial({color:0x222222}));m.scale.setScalar(1.5);m.position.set(x,1.9,z);scene.add(m);BSH.push({m,vx:(tx-x)/d*40,vz:(tz-z)/d*40,life:d/40+.05,T});sfxAt('boom',x,z,70);}
function warVehPick(){for(const T of ARMY){const mine=humans.filter(b=>b.team===T&&!b.dead&&!b.inside&&b.wrole!=='esc'&&!b.jetGoal&&!b.heliGoal&&!b.tankGoal&&!b.para);if(!mine.length)continue;const B=WB[ARMY.indexOf(T)];
  const near=(x,z,r)=>{let best=null,bd=r;for(const b of mine){const d=Math.hypot(b.g.position.x-x,b.g.position.z-z);if(d<bd){bd=d;best=b;}}return best;};
  if(JETS.filter(J=>J.pilot&&J.pilot.team===T).length+humans.filter(b=>b.team===T&&b.jetGoal).length<2){const J=JETS.find(J=>J.st==='park'&&!J.res&&Math.hypot(J.x-B.x,J.z-B.z)<60);if(J){const b=near(J.x,J.z,150);if(b){b.jetGoal=J;J.res=b;}}}
  if(HELIS.filter(H=>H.pilot&&H.pilot.team===T).length+humans.filter(b=>b.team===T&&b.heliGoal).length<1){for(const H of HELIS){if(H.st!=='park'||H.res)continue;const b=near(H.x,H.z,320);if(b){b.heliGoal=H;H.res=b;break;}}}
  if(tanks.filter(t=>t.driver&&t.driver.team===T).length+humans.filter(b=>b.team===T&&b.tankGoal).length<3){const t=tanks.find(t=>!t.dead&&!t.driver&&!t.res&&t!==inTank&&t.army===T);if(t){const b=near(t.g.position.x,t.g.position.z,120);if(b){b.tankGoal=t;t.res=b;}}}}}
const _botJetPick13=botJetPick;botJetPick=function(){if(isWar())return;_botJetPick13();};
const _botHeliPick13=botHeliPick;botHeliPick=function(){if(isWar())return;_botHeliPick13();};
// Javelin tēmē arī uz botu vadītiem tankiem; boti ar Javelin šauj uz ienaidnieku tankiem
const _javTarget13=javTarget;javTarget=function(px,pz,a,team,cone){const r=_javTarget13(px,pz,a,team,cone);if(r&&r.kind!=='mon')return r;let best=r,bs=1e9;
 for(const t of tanks){if(t.dead||!t.driver||t.driver.team===team||(team!==PT&&!team.enemies.has(t.driver.team)))continue;const dx=t.g.position.x-px,dz=t.g.position.z-pz,d=Math.hypot(dx,dz);if(d>160||d<4)continue;let df=Math.atan2(-dx,-dz)-a;df=Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));if(df>cone)continue;if(df*50+d*.2<bs){bs=df*50+d*.2;best={ref:t,kind:'tank'};}}return best;};
function warAA(){for(const b of humans){if(b.dead||b.inside||!(b.I.ammo.jav>0)||ARMY.indexOf(b.team)<0||Math.random()>.3)continue;const p=b.g.position;let tg=null,bd=90;
  for(const t of tanks)if(!t.dead&&((t.driver&&b.team.enemies.has(t.driver.team))||(t===inTank&&b.team.enemies.has(PT)))){const d=Math.hypot(t.g.position.x-p.x,t.g.position.z-p.z);if(d<bd){bd=d;tg=t.g.position;}}
  if(tg){b.I.ammo.jav--;javelinFire(p.x,1.6,p.z,Math.atan2(-(tg.x-p.x),-(tg.z-p.z)),b.team,false);}}}
// tanka šāviņš (spēlētāja) iznīcina arī ienaidnieku tehniku
const _tankBoom13=tankBoom;tankBoom=function(p){_tankBoom13(p);for(const t of tanks)if(t!==inTank&&!t.dead&&Math.hypot(t.g.position.x-p.x,t.g.position.z-p.z)<4)destroyTank(t,PT);};
// ---------- piegādes kastes ar ieročiem, lodēm un degvielu visā kartē ----------
const WDROP=['a_pistol','a_m16','a_m16','a_shot','a_rpg','m16','shot','rpg','a_jav','jav','hbelt','fuel','fuel','med','armor','harmor'];
function crateMesh(){const g=new THREE.Group(),b=cube(.7,.5,.5,0x556b2f,.8),s=cube(.72,.08,.52,0xd4a537,.5);s.position.y=.1;g.add(b,s);return g;}
function dropMeshFor(k){return String(k).startsWith('w:')?crateMesh():k==='coin'?coinMesh():prodMesh(k);}
const _prodMesh13=prodMesh;prodMesh=function(k){if(String(k).startsWith('w:'))return crateMesh();return _prodMesh13(k);};
const _takeDrop13=takeDrop;takeDrop=function(d,who){if(!d.kind||!String(d.kind).startsWith('w:'))return _takeDrop13(d,who);const i=drops.indexOf(d);if(i<0)return;scene.remove(d.m);freeObj(d.m);drops.splice(i,1);
 const k=d.kind.slice(2),I=who?who.I:inv,tm=who?who.team:PT,s=giveLoot(k,I,tm);if(!who){say('📦 '+s,1.5);sfx('pick');autoGun();updateAmmo();renderInv();updateHealth();}else if(who.pos)netTo(who,{t:'msg',s:'📦 '+s,d:1.5});return s;};
function dropTick(dt){dropT-=dt;if(dropT>0)return;dropT=14;if(drops.filter(d=>String(d.kind).startsWith('w:')).length>=30)return;for(let i=0;i<3;i++){const [x,z]=roadPoint(0,0,1e9);dropItem(x+(Math.random()-.5)*4,z+(Math.random()-.5)*4,'w:'+WDROP[Math.floor(Math.random()*WDROP.length)]);}}
// ---------- saimnieka cikls ----------
function warTick(dt){
 for(const t of tanks)if(t.driver){if(t.driver.dead||t.dead){t.driver.tankV=null;t.driver=null;}else botTankDrive(t,t.driver,dt);}
 for(let i=BSH.length-1;i>=0;i--){const s=BSH[i],p=s.m.position;s.life-=dt;p.x+=s.vx*dt;p.z+=s.vz*dt;if(s.life<=0||wallAt(p.x,p.z,1.9)){scene.remove(s.m);BSH.splice(i,1);jetBoom(p.x,p.z,s.T,false,.8,.8);}}
 flagTick(dt);dropTick(dt);
 warT-=dt;if(warT<=0){warT=1.5;warVehPick();warAA();if(!winner&&ARMY.length===2){if(!ARMY[1].members.length&&!(active&&PT===ARMY[1])&&![...NET.guests.values()].some(G=>G.ready&&!G.dead&&GT(G)===ARMY[1]))warWin(ARMY[0]);else if(!ARMY[0].members.length&&!(active&&PT===ARMY[0])&&![...NET.guests.values()].some(G=>G.ready&&!G.dead&&GT(G)===ARMY[0]))warWin(ARMY[1]);}}
 // bota helikopteris ar raķetēm šauj uz ienaidnieku tehniku
 for(const H of HELIS)if(H.st==='fly'&&H.pilot&&H.pilot.g&&H.rk>0){H.rkT=(H.rkT||0)-dt;if(H.rkT<=0){H.rkT=2;const tp=heliRocketTarget(H,H.pilot.team);if(tp.y>0)heliRocket(H,H.pilot.team,false,tp);}}
 if(NET.role==='host'&&NET.guests.size){warNetT-=dt;if(warNetT<=0){warNetT=.4;const cid=c=>c==='P'?0:c&&c.pos?c.id:c?-1:-2;
  const msg={t:'wf',F:FL.map(F=>[r2(F.x),r2(F.z),cid(F.carrier),F.held?1:0,Math.round(F.holdH)]),n:ARMY.map(T=>T.members.length),A:tanks.map(t=>t.ammo||0)};for(const G of NET.guests.values())if(G.ready)netTo(G,msg);}}}
// ---------- informācija uz ekrāna ----------
const wbar=document.createElement('div');wbar.id='warbar';wbar.className='panel';document.body.appendChild(wbar);
function warHud(){if(!isWar()||!active){wbar.style.display='none';return;}wbar.style.display='block';const F0=FL[MYSIDE],F1=FL[1-MYSIDE];let s=t('w_fl_home');
 if(F0&&(F0.carrier||F0.cid>-2))s=t('w_fl_my');if(F0&&F0.held)s=tf('w_fl_lost',{n:Math.max(0,48-Math.round(F0.holdH))});if(F1&&F1.held)s=tf('w_fl_their',{n:Math.max(0,48-Math.round(F1.holdH))});
 const n=NET.role==='guest'?(warN||[0,0]):[ARMY[0]?ARMY[0].members.length:0,ARMY[1]?ARMY[1].members.length:0];wbar.textContent='🔴 '+n[0]+' · 🟢 '+n[1]+' · '+s;}
let warN=null,hudT=0;
const _updateFx13=updateFx;updateFx=function(dt){_updateFx13(dt);const host=NET.role!=='guest'&&(active||NET.guests.size);if(isWar()&&host)warTick(dt);
 if(isWar())flagDraw();hudT-=dt;if(hudT<=0){hudT=.5;warHud();const hv=!!(inv&&inv.heavy);if(hv!==lastHv){lastHv=hv;wearLook();updateHealth();}
  if(NET.role==='guest')for(const [i,o] of netTk){const k=TKK[i]||'tank';if((k==='apc')!==!!o.apc){scene.remove(o.g);freeObj(o.g);o.g=k==='apc'?apcMesh():tankMesh();scene.add(o.g);o.apc=k==='apc';o.dead=false;}}}
 if(inTank&&inTank.kind==='apc'&&mouseDown&&!TOUCH)fireTank();};
// armory un helikoptera raķete draugam
const _nearInter13=nearInter;nearInter=function(){const o=_nearInter13();if((!o||o.type==='burn')&&armoryNear(player.position.x,player.position.z,NET.role==='guest'?null:PT))return{type:'armory'};return o;};
const _interact13=interact;interact=function(){if(active){const o=nearInter();if(o&&o.type==='armory'){if(NET.role==='guest'){netSend({t:'arm'});return;}if(gtime<armCd){say(tf('w_armcd',{n:Math.ceil(armCd-gtime)}),1.5);return;}armCd=gtime+45;armoryGive(inv);autoGun();updateAmmo();renderInv();updateHealth();say(t('w_armok'),2);sfx('pick');return;}}_interact13();};
const _netHostMsg13=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='arm'){if(!armoryNear(G.pos.x,G.pos.z,GT(G)))return;if(gtime<(G.armCd||0)){netTo(G,{t:'msg',s:tf('w_armcd',{n:Math.ceil(G.armCd-gtime)}),d:1.5});return;}G.armCd=gtime+45;armoryGive(G.I);netTo(G,{t:'msg',s:t('w_armok'),d:2});netMe(G);return;}
 if(d&&G.ready&&d.t==='hrk'){const H=HELIS.find(q=>q.id===d.id);if(H&&H.pilot===G&&H.rk>0&&Array.isArray(d.a)){const a=d.a.map(Number);heliRocket(H,GT(G),true,{x:a[0],y:a[1],z:a[2]});}return;}
 _netHostMsg13(G,d);};
// draugam: režīms pirms pasaules, karogi, uzvara, bruņmašīnas
let TKK=[];
const _netWelcome13=netWelcome;netWelcome=function(G){netTo(G,{t:'mode',m:MODE});_netWelcome13(G);netTo(G,{t:'tkk',L:tanks.map(t=>t.kind||'tank')});if(winner)netTo(G,{t:'win',w:winner});};
const _netGuestMsg13=netGuestMsg;netGuestMsg=function(d){
 if(d&&d.t==='mode'){MODE=d.m==='war'?'war':'surv';if(isWar()){if(!WG.length)buildBases();if(!FL.length)FL=WB.map((B,i)=>({col:i?0x2e7d32:0xd32f2f,home:[B.x,B.z],x:B.x,z:B.z,cid:-2,holdH:0}));}else warTeardown();return;}
 if(d&&d.t==='wf'){d.F.forEach((f,i)=>{const F=FL[i];if(!F)return;F.x=f[0];F.z=f[1];F.cid=f[2];F.held=f[3]?1:null;F.holdH=f[4];if(F.cid===NET.myId){F.x=player.position.x;F.z=player.position.z;}});warN=d.n;if(d.A)d.A.forEach((a,i)=>{if(tanks[i])tanks[i].ammo=a;});return;}
 if(d&&d.t==='tkk'){TKK=d.L;return;}
 if(d&&d.t==='win'){winner=d.w;showWin(d.w);return;}
 _netGuestMsg13(d);if(d&&d.t==='wel'&&isWar())for(const o of WOB){remOb(o);addOb(o);}};
const _netExtraEv213=netExtraEv2;netExtraEv2=function(e){if(e.e==='win'){winner=e.w;showWin(e.w);return;}if(e.e==='tkk'){TKK=e.L;return;}_netExtraEv213(e);};
// cik cilvēku katrā armijā
const _updatePpl13=updatePpl;updatePpl=function(){_updatePpl13();if(isWar()&&ARMY.length===2){const hu=i=>(PT===ARMY[i]?1:0)+[...NET.guests.values()].filter(G=>G.ready&&GT(G)===ARMY[i]).length;$('ppl').textContent='🔴 '+(ARMY[0].members.length+hu(0))+' · 🟢 '+(ARMY[1].members.length+hu(1))+'  🪙 '+(PT.coins||0);}};
// minikartē: atpazīstamās ēkas, bāzes, karogi (mirgo, ja nav mājās)
const _drawMap13=drawMap;drawMap=function(){_drawMap13();const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R,X=x=>W/2+(x-cx)*sc,Y=z=>W/2+(z-cz)*sc;
 g.textAlign='center';g.textBaseline='middle';g.font=Math.round(W*.08)+'px serif';for(const L of LMS)g.fillText(L.ic,X(L.x),Y(L.z));
 if(!isWar())return;WB.forEach((B,i)=>{g.fillStyle=i?'rgba(46,125,50,.55)':'rgba(211,47,47,.55)';g.fillRect(X(B.x-BR),Y(B.z-BR),BR*2*sc,BR*2*sc);});
 const blink=Math.floor(clock.elapsedTime*3)%2===0;FL.forEach((F,i)=>{const home=Math.hypot(F.x-F.home[0],F.z-F.home[1])<2;if(!home&&!blink)return;g.font=Math.round(W*(home?.08:.11))+'px serif';g.fillText(i?'🏳️':'🚩',X(F.x),Y(F.z));});};

// ---------- kāpšana novērošanas tornī: no augšas redz tālāk, un minikartē parādās ienaidnieki ----------
Object.assign(T.lv,{tw_up:'🪜 Uzkāpt tornī',tw_down:'🪜 Nokāpt no torņa'});Object.assign(T.en,{tw_up:'🪜 Climb the tower',tw_down:'🪜 Climb down'});
let towerFog=null;
function towerAt(){const p=player.position;for(const T of TOWERS){if(pY>T.h-.6&&Math.abs(p.x-T.x)<2&&Math.abs(p.z-T.z)<2)return{T,up:true};if(pY<1.5&&Math.hypot(p.x-(T.lx+.6),p.z-T.lz)<1.6)return{T,up:false};}return null;}
const onTower=()=>{const a=towerAt();return!!(a&&a.up);};
const _nearInter14=nearInter;nearInter=function(){const o=_nearInter14();if(o&&o.type!=='burn')return o;const a=TOWERS.length&&towerAt();if(a)return{type:'tower',a};return o;};
const _updateHint14=updateHint;updateHint=function(){const o=nearInter();if(o&&o.type==='tower'){const h=$('hint');h.textContent=(TOUCH?'':'E / ')+t(o.a.up?'tw_down':'tw_up');h.style.display='block';setAct('🪜');return;}_updateHint14();};
const _interact14=interact;interact=function(){if(active){const o=nearInter();if(o&&o.type==='tower'){const T=o.a.T;if(o.a.up){player.position.set(T.lx+.8,0,T.lz);pY=0;}else{player.position.set(T.x,T.h,T.z);pY=T.h;}vy=0;onGround=true;sfx('drawer');return;}}_interact14();};
const _updateFx14=updateFx;updateFx=function(dt){_updateFx14(dt);const up=TOWERS.length&&onTower();if(up&&towerFog===null){towerFog=scene.fog.far;scene.fog.far=150;}else if(!up&&towerFog!==null){scene.fog.far=towerFog;towerFog=null;}};
const _drawMap14=drawMap;drawMap=function(){_drawMap14();if(!TOWERS.length||!onTower())return;const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R;g.fillStyle='#ff1744';
 const P=NET.role==='guest'?[...netBot.values()].filter(o=>o.rel===2).map(o=>o.g.position).concat([...netMon.values()].map(o=>o.z.position)):humans.filter(b=>!b.dead&&PT.enemies.has(b.team)).map(b=>b.g.position).concat(zombies.filter(z=>!z.userData.dead).map(z=>z.position));
 for(const p of P)if(Math.hypot(p.x-player.position.x,p.z-player.position.z)<130){g.beginPath();g.arc(W/2+(p.x-cx)*sc,W/2+(p.z-cz)*sc,3,0,6.283);g.fill();}};
// no torņa šauj lejup (un boti var trāpīt tornī stāvošajam): šādām lodēm augstumu nepārbauda
const _shoot14=shoot;shoot=function(w){const n0=bullets.length;_shoot14(w);if(pY>3)for(let i=n0;i<bullets.length;i++)bullets[i].hy=true;};
const _botFire14=botFire;botFire=function(b,tp,w,human){const n0=bullets.length;_botFire14(b,tp,w,human);if(human&&tp&&tp.y>3)for(let i=n0;i<bullets.length;i++)bullets[i].hy=true;};
const _guestFire14=guestFire;guestFire=function(G,d){const n0=bullets.length;_guestFire14(G,d);if(G.y>3)for(let i=n0;i<bullets.length;i++)bullets[i].hy=true;};
