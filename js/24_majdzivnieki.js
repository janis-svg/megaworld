// 24_majdzivnieki.js - Mājdzīvnieku vārdi un līmeņi (stiprāki aizstāvji), dzīvnieku skaņas, ceļojošais tirgotājs (zirgs, zelta vista, eksotiski dzīvnieki), jāšana ar zirgu
Object.assign(T.lv,{tr_travel:'🐪 Ceļojošais tirgotājs',shop_horse:'🐴 Zirgs (var jāt, ļoti ātrs)',shop_gold:'🐔 Zelta vista (dēj zelta olas)',shop_monkey:'🐒 Pērtiķis (savāc monētas un ražu)',shop_parrot:'🦜 Papagailis (brīdina par briesmoņiem)',
 pr_gegg:'Zelta olas',have1:'Tev jau ir tāds dzīvnieks',tvcome:'🐪 Ceļojošais tirgotājs atbrauca! Viņš ir minikartē (🐪) līdz 18:00.',tvgo:'🐪 Ceļojošais tirgotājs aizbrauca. Rīt viņš atkal būs.',
 ride:'🐴 Kāpt zirgā',unride:'🐴 Nokāpt no zirga',plvl:'{n} tagad ir ⭐{l}: stiprāks un labāks aizstāvis!',parrot:'🦜 Kraa! Briesmoņi tuvumā!',mypets:'Mani dzīvnieki',rename:'Jauns vārds:'});
Object.assign(T.en,{tr_travel:'🐪 Travelling trader',shop_horse:'🐴 Horse (you can ride it, very fast)',shop_gold:'🐔 Golden chicken (lays golden eggs)',shop_monkey:'🐒 Monkey (collects coins and produce)',shop_parrot:'🦜 Parrot (warns about monsters)',
 pr_gegg:'Golden eggs',have1:'You already have that animal',tvcome:'🐪 The travelling trader has arrived! Find him on the minimap (🐪) until 18:00.',tvgo:'🐪 The travelling trader has left. He will be back tomorrow.',
 ride:'🐴 Ride the horse',unride:'🐴 Get off the horse',plvl:'{n} is now ⭐{l}: stronger and a better guard!',parrot:'🦜 Squawk! Monsters nearby!',mypets:'My animals',rename:'New name:'});
const PETK=['dog','bear','horse','monkey','parrot'],NEWP=['horse','monkey','parrot'],PIC={dog:'🐕',bear:'🐻',horse:'🐴',monkey:'🐒',parrot:'🦜'};
const PNAMES={dog:['Reksis','Bobiks','Pūka','Džeks','Bella','Čārlijs','Lote','Rokijs','Muris','Lords'],bear:['Miķis','Brūnītis','Lāčuks'],horse:['Zibens','Vējš','Ābolītis','Spīdis'],monkey:['Banāns','Čiko','Momo'],parrot:['Kiki','Rio','Papa']};
// ---------- modeļi ----------
function horseMesh(){const g=new THREE.Group(),c=[0x6d4c41,0x3e2723,0xbcaaa4,0x212121][Math.floor(Math.random()*4)],legs=[];
 const b=cube(.7,.75,1.7,c,1);b.position.y=1.25;g.add(b);const n=cube(.34,.75,.4,c,1);n.position.set(0,1.75,-.8);n.rotation.x=-.45;g.add(n);
 const h=cube(.32,.32,.72,c,1);h.position.set(0,2.08,-1.15);g.add(h);const m=cube(.08,.55,.5,0x1b1b1b,1);m.position.set(0,1.95,-.7);m.rotation.x=-.45;g.add(m);
 const tl=cube(.12,.7,.12,0x1b1b1b,1);tl.position.set(0,1.05,.9);tl.rotation.x=.4;g.add(tl);const sd=cube(.74,.12,.6,0x8b1a1a,.8);sd.position.set(0,1.66,-.05);g.add(sd);
 for(const [x,z] of [[-.24,-.6],[.24,-.6],[-.24,.6],[.24,.6]]){const l=cube(.17,.9,.17,c,1);l.position.set(x,.45,z);g.add(l);legs.push(l);}
 g.userData.legs=legs;scene.add(g);return g;}
function monkeyMesh(){const g=new THREE.Group(),legs=[],c=0x795548;
 const b=cube(.3,.4,.26,c,1);b.position.y=.55;g.add(b);const h=cube(.28,.26,.26,c,1);h.position.set(0,.9,-.04);g.add(h);const f=cube(.2,.16,.04,0xd7b49e,1);f.position.set(0,.88,-.18);g.add(f);
 const tl=cube(.05,.05,.45,c,1);tl.position.set(0,.5,.32);tl.rotation.x=-.8;g.add(tl);g.userData.tail=tl;
 for(const x of [-.09,.09]){const l=cube(.09,.32,.09,c,1);l.position.set(x,.18,0);g.add(l);legs.push(l);}
 g.userData.legs=legs;scene.add(g);return g;}
function parrotMesh(){const g=new THREE.Group(),legs=[];
 const b=cube(.2,.3,.22,0xe53935,.8);b.position.y=0;g.add(b);const h=cube(.16,.16,.16,0xe53935,.8);h.position.set(0,.2,-.06);g.add(h);const bk=cube(.06,.07,.1,0xffca28,.6);bk.position.set(0,.18,-.18);g.add(bk);
 for(const x of [-.14,.14]){const w=cube(.05,.18,.3,0x1e88e5,.8);w.position.set(x,.02,0);g.add(w);legs.push(w);}
 const tl=cube(.08,.04,.3,0x43a047,.8);tl.position.set(0,-.1,.22);g.add(tl);
 g.userData.legs=legs;scene.add(g);return g;}
function petMesh(k){return k==='horse'?horseMesh():k==='monkey'?monkeyMesh():k==='parrot'?parrotMesh():k==='bear'?bearMesh():dogMesh();}
const _spawnPet7=spawnPet;spawnPet=function(kind,x,z,owner){if(!NEWP.includes(kind))return _spawnPet7(kind,x,z,owner);
 const g=petMesh(kind);g.position.set(x,0,z);const p={id:++petId,kind,g,owner:owner||null,hp:kind==='horse'?220:120,st:{},bark:0,cd:0,wx:x,wz:z,slot:Math.random()*6.283};pets.push(p);return p;};
// zelta vista un zelta olas
LIVE.gold={p:'gegg',t:75};LIVEK.push('gold');PROD.push('gegg');PRODIC.gegg='🌟';SELL.gegg=20;
const _liveMesh7=liveMesh;liveMesh=function(k){const g=_liveMesh7(k);if(k==='gold')g.traverse(o=>{if(o.isMesh&&o.material.color.getHex()===0xf5f5f5){o.material.color.setHex(0xffc107);o.material.emissive=new THREE.Color(0x553300);o.material.metalness=.5;}});return g;};
const _prodMesh7=prodMesh;prodMesh=function(k){if(k!=='gegg')return _prodMesh7(k);const g=new THREE.Group(),e=cube(.18,.24,.18,0xffc107,.3);e.material.emissive.set(0x664400);e.material.metalness=.6;g.add(e);return g;};
// ---------- vārdi un līmeņi: suns kļūst stiprāks un kož briesmoņiem un ienaidniekiem ----------
const PLVL=[0,4,10,20,35],DOGHP=[1,60,110,170,250];
const petOwnerId=o=>o==='P'?0:o&&o.pos?o.id:-1;
function petMaxHp(p){const l=p.lvl||1;return p.kind==='dog'?DOGHP[l-1]:p.kind==='bear'?300+50*(l-1):p.kind==='horse'?220+30*(l-1):120+20*(l-1);}
function petLab(p,pos){const txt=PIC[p.kind]+' '+p.name+' ⭐'+(p.lvl||1);if(p.labT!==txt){delLabel(p.lab);p.lab=mkLabel(txt,0x2e7d32);p.lab.scale.set(1.2,.3,1);p.labT=txt;}p.lab.position.set(pos.x,pos.y+(p.kind==='horse'?2.7:p.kind==='bear'?2.4:p.kind==='parrot'?.6:1.5),pos.z);}
function petSay(p,s){if(p.owner==='P')say(s,2.5);else if(p.owner&&p.owner.pos)netTo(p.owner,{t:'msg',s,d:2.5});}
let petT2=0;
function petsTick(dt){
 petT2-=dt;const slow=petT2<=0;if(slow)petT2=1;
 for(const p of pets){const pos=p.g.position,mine=mineP(p.owner),tm=ownerTeam(p.owner),op=ownerPos(p.owner);
  if(mine&&!p.name){const L=PNAMES[p.kind]||PNAMES.dog;p.name=L[Math.floor(Math.random()*L.length)];p.lvl=1;p.xp=0;}
  if(p.name&&!mine){delLabel(p.lab);p.lab=null;p.labT='';}
  if(mine){p.xp=(p.xp||0)+dt/60;let l=1;for(let i=0;i<PLVL.length;i++)if(p.xp>=PLVL[i])l=i+1;if(l>(p.lvl||1)){p.lvl=l;p.hp=petMaxHp(p);petSay(p,PIC[p.kind]+' '+tf('plvl',{n:p.name,l}));fanfare();}}
  if(p.lab||mine)petLab(p,pos);if(p.lab)p.lab.visible=p.g.visible;
  // suns no ⭐2: skrien virsū briesmoņiem un ienaidniekiem pie saimnieka vai būdas un kož
  if(p.kind==='dog'&&(p.lvl||1)>1&&tm&&(op||p.guard)){const c=op&&!p.guard?op:pos;let tg=null,bd=9;
   for(const z of zombies){const u=z.userData;if(u.dead||u.rise>0||u.kind==='c')continue;const d=Math.hypot(z.position.x-pos.x,z.position.z-pos.z);if(d<bd&&Math.hypot(z.position.x-c.x,z.position.z-c.z)<25){bd=d;tg={p:z.position,m:z};}}
   if(!tg)for(const b of humans)if(tm.enemies.has(b.team)&&!b.dead&&!b.inside){const d=Math.hypot(b.g.position.x-pos.x,b.g.position.z-pos.z);if(d<bd){bd=d;tg={p:b.g.position,b};}}
   if(tg){if(bd>1.4)stepTo(pos,tg.p.x,tg.p.z,6.5,dt,.3,tm,p.st);p.bt=(p.bt||0)-dt;if(bd<1.7&&p.bt<=0){p.bt=1;const dm=6+4*p.lvl;if(tg.m)dmgMonster(tg.m,dm,false);else hurtBot(tg.b,dm,tm,false);p.xp+=.3;if(Math.hypot(pos.x-player.position.x,pos.z-player.position.z)<30)tone(300,.12,'square',.07,150);}}}
  // pērtiķis savāc monētas un ražu saimniekam
  if(p.kind==='monkey'&&mine&&op){let tg=null,bd=10;for(const d of drops)if(d.kind){const dd=Math.hypot(d.x-pos.x,d.z-pos.z);if(dd<bd&&Math.hypot(d.x-op.x,d.z-op.z)<30){bd=dd;tg=d;}}
   if(tg){if(bd>.8)stepTo(pos,tg.x,tg.z,6,dt,.2,tm,p.st);else{const c0=PT.coins||0;if(p.owner==='P')takeDrop(tg);else{takeDrop(tg,{I:p.owner.I,team:PT});netMe(p.owner);}popup('🐒 '+(tg.kind==='coin'?'+'+((PT.coins||0)-c0)+' 🪙':PRODIC[tg.kind]),pos.clone().add(new THREE.Vector3(0,1.2,0)));}}}
  // papagailis lido virs saimnieka un brīdina par briesmoņiem
  if(p.kind==='parrot'){pos.y=2.3+Math.sin(clock.elapsedTime*3+p.id)*.25;if(mine&&op&&slow&&gtime>(p.warnT||0))for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0)&&u.kind!=='f'&&Math.hypot(z.position.x-op.x,z.position.z-op.z)<22){p.warnT=gtime+20;petSay(p,t('parrot'));if(p.owner==='P')animalSfx('parrot',0);break;}}}
  if(p.rider){const R=p.rider==='P'?(active?{x:player.position.x,z:player.position.z,a:yaw}:null):p.rider.pos&&!p.rider.dead&&NET.guests.has(p.rider.id)?{x:p.rider.pos.x,z:p.rider.pos.z,a:p.rider.yaw}:null;
   if(!R){p.rider=null;if(rideP===p)rideP=null;}else{pos.x=R.x;pos.z=R.z;p.g.rotation.y=R.a;}}
 }
}
const _dawn7=dawn;dawn=function(){_dawn7();if(NET.role!=='guest')for(const p of pets)if(mineP(p.owner)){p.xp=(p.xp||0)+3;p.hp=petMaxHp(p);}};
const _killPet7=killPet;killPet=function(p){delLabel(p.lab);p.lab=null;if(rideP===p)rideP=null;_killPet7(p);};
// ---------- inventārā: mani dzīvnieki ar vārdiem (✏️ pārdēvēt) ----------
function myPets(){if(NET.role==='guest')return[...netPets].filter(([id,o])=>o.oid===NET.myId).map(([id,o])=>({id,kind:o.kind,name:o.name,lvl:o.lvl}));return pets.filter(p=>p.owner==='P').map(p=>({id:p.id,kind:p.kind,name:p.name||'',lvl:p.lvl||1}));}
const _renderInv7=renderInv;renderInv=function(){_renderInv7();if(!inv)return;const L=myPets();if(!L.length)return;const el=$('inv'),d=document.createElement('div');
 d.innerHTML='<b>'+t('mypets')+'</b>'+L.map(p=>'<br>'+PIC[p.kind]+' '+p.name+' ⭐'+p.lvl+' <button class="corner" data-p="'+p.id+'">✏️</button>').join('');el.appendChild(d);
 d.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.stopPropagation();const n=(prompt(t('rename'))||'').trim().slice(0,12);if(!n)return;const id=+b.dataset.p;
  if(NET.role==='guest')netSend({t:'pname',id,n});else{const p=pets.find(q=>q.id===id);if(p)p.name=n;}renderInv();});};
// ---------- dzīvnieku skaņas ----------
const ASFX={cow:v=>{tone(150,.9,'sawtooth',.06*v,105);tone(75,.9,'sine',.07*v,60);},chicken:v=>{[0,.13,.26].forEach(d=>tone(880,.06,'square',.035*v,640,d));},gold:v=>{[0,.13,.26].forEach(d=>tone(1040,.06,'square',.035*v,760,d));},
 pig:v=>{noise(.16,.08*v,700);tone(250,.16,'square',.05*v,170);},bear:v=>{tone(70,.8,'sawtooth',.09*v,48);noise(.6,.07*v,300);},horse:v=>{tone(480,.45,'sawtooth',.05*v,900);tone(900,.4,'sawtooth',.04*v,380,.42);},
 monkey:v=>{[0,.09,.18,.27].forEach(d=>tone(700+Math.random()*400,.07,'square',.03*v,1200,d));},parrot:v=>{tone(1400,.15,'sawtooth',.045*v,900);tone(1200,.12,'sawtooth',.045*v,1700,.18);}};
let asT=0,asCd=0;
function animalSfx(k,d){if(!ASFX[k])return;try{ASFX[k](Math.max(.15,1-d/25));}catch(e){}}
function soundTick(dt){asCd-=dt;asT-=dt;if(asT>0)return;asT=.5;if(asCd>0)return;
 const L=[];if(NET.role==='guest'){for(const o of netCk.values())L.push([o.kind||'chicken',o.g.position]);for(const o of netPets.values())if(o.kind&&o.kind!=='dog')L.push([o.kind,o.g.position]);}
 else{for(const c of chickens)L.push([c.kind||'chicken',c.g.position]);for(const p of pets)if(p.kind!=='dog')L.push([p.kind,p.g.position]);}
 for(const [k,p] of L){const d=Math.hypot(p.x-player.position.x,p.z-player.position.z);if(d<25&&Math.random()<.035){animalSfx(k,d);asCd=1.2;return;}}}
// ---------- ceļojošais tirgotājs: katru dienu 9:00-18:00 kādā ielā ----------
const TRAVEL={on:false,x:0,z:0,ex:'monkey',g:null,ob:null};SHOPS.travel=[['horse',120],['gold',70],['monkey',90]];
function travelMesh(){const g=new THREE.Group();
 const base=cube(3,.4,1.8,0x6d4c41,1);base.position.y=.9;g.add(base);const top=cube(3,1.1,1.9,0xffb300,.8);top.position.y=1.85;g.add(top);
 for(let i=0;i<3;i++){const s=cube(.3,1.12,1.92,0xd32f2f,.8);s.position.set(-1+i,1.85,0);g.add(s);}
 for(const [x,z] of [[-1.1,-.95],[1.1,-.95],[-1.1,.95],[1.1,.95]]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.14,12),mat(0x3e2723,1));w.rotation.x=Math.PI/2;w.position.set(x,.42,z);g.add(w);}
 const cm=new THREE.Group(),cc=0xc8a165;const cb=cube(.8,.9,1.7,cc,1);cb.position.y=1.45;cm.add(cb);const hu=cube(.55,.45,.7,cc,1);hu.position.y=2.1;cm.add(hu);const ne=cube(.3,.9,.3,cc,1);ne.position.set(0,1.95,-.95);cm.add(ne);const he=cube(.32,.3,.55,cc,1);he.position.set(0,2.4,-1.15);cm.add(he);
 for(const [x,z] of [[-.25,-.6],[.25,-.6],[-.25,.6],[.25,.6]]){const l=cube(.16,1,.16,cc,1);l.position.set(x,.5,z);cm.add(l);}cm.position.set(-3,0,0);cm.rotation.y=Math.PI/2;g.add(cm);
 const bb=buildBot(0x6a1b9a,false);const tb=cube(.55,.3,.52,0xffffff,.8);tb.position.y=2.05;bb.g.add(tb);bb.g.position.set(0,0,1.7);g.add(bb.g);
 scene.add(g);return g;}
function travelShow(on,x,z,ex){if(TRAVEL.g){scene.remove(TRAVEL.g);freeObj(TRAVEL.g);TRAVEL.g=null;}if(TRAVEL.ob){remOb(TRAVEL.ob);TRAVEL.ob=null;}
 TRAVEL.on=on;TRAVEL.x=x;TRAVEL.z=z;TRAVEL.ex=ex||'monkey';SHOPS.travel=[['horse',120],['gold',70],[TRAVEL.ex,90]];
 if(on){TRAVEL.g=travelMesh();TRAVEL.g.position.set(x,0,z);TRAVEL.ob={x,z,hx:1.6,hz:1};addOb(TRAVEL.ob);}}
const tvsay=bcastMsgOf((k)=>say(t(k),4));
function travelArrive(){let p=null;for(let k=0;k<30;k++){const q=roadPoint(player.position.x,player.position.z,70),d=Math.hypot(q[0]-player.position.x,q[1]-player.position.z);if(d>22&&!overlapAt(q[0],q[1],2.2)){p=q;break;}}
 if(!p)return;travelShow(true,Math.round(p[0]),Math.round(p[1]),day%2?'monkey':'parrot');tvsay('tvcome');if(NET.role==='host')netQ.push({e:'tv',on:1,x:TRAVEL.x,z:TRAVEL.z,ex:TRAVEL.ex});}
function travelLeave(){if(!TRAVEL.on)return;travelShow(false,0,0);tvsay('tvgo');if(NET.role==='host')netQ.push({e:'tv',on:0});}
const _onHour7=onHour;onHour=function(h){_onHour7(h);if(NET.role==='guest')return;if(h===9)travelArrive();else if(h===18)travelLeave();};
const _start7=start;start=function(){travelShow(false,0,0);rideP=null;_start7();};
const travelNear=(x,z)=>TRAVEL.on&&Math.hypot(TRAVEL.x-x,TRAVEL.z-z)<3.6;
const _buy7=buy;buy=function(k,owner,kind){if(kind!=='travel')return _buy7(k,owner,kind);const it=SHOPS.travel.find(s=>s[0]===k);if(!it)return '';const pr=priceOf(k,kind);if((PT.coins||0)<pr)return t('nocoins');
 const pos=owner==='P'?player.position:owner.pos;if(k!=='gold'&&pets.some(p=>p.owner===owner&&p.kind===k))return t('have1');PT.coins-=pr;bumpPrice(k);
 if(k==='gold'){const c=spawnChicken(pos.x+1.2,pos.z+1.2,null,'gold');c.home=[pos.x,pos.z];c.owned=true;if(NET.role==='host')netQ.push({e:'ck',id:c.id,x:r2(c.g.position.x),z:r2(c.g.position.z)});}
 else spawnPet(k,pos.x+1.5,pos.z+1.5,owner);sfx('pick');animalSfx(k==='gold'?'gold':k,0);return t('bought')+' '+t('shop_'+k);};
const _shopAutoClose7=shopAutoClose;shopAutoClose=function(){const el=$('shop');if(el.style.display==='block'&&el.dataset.kind==='travel'){if(!TRAVEL.on||Math.hypot(TRAVEL.x-player.position.x,TRAVEL.z-player.position.z)>8)el.style.display='none';return;}_shopAutoClose7();};
// ---------- jāšana ----------
let rideP=null,rideId=null;const riding=()=>!!(rideP||rideId);
function myHorseNear(){const px=player.position.x,pz=player.position.z;
 if(NET.role==='guest'){for(const [id,o] of netPets)if(o.kind==='horse'&&o.oid===NET.myId&&Math.hypot(o.g.position.x-px,o.g.position.z-pz)<2.8)return id;return null;}
 const p=pets.find(q=>q.kind==='horse'&&q.owner==='P'&&!q.rider&&Math.hypot(q.g.position.x-px,q.g.position.z-pz)<2.8);return p?p.id:null;}
const _nearInter7=nearInter;nearInter=function(){if(inTank)return _nearInter7();if(riding())return{type:'unride'};const o=_nearInter7();
 if(!o||o.type==='burn'||(o.type==='house'&&o.H.free===false&&o.H.on!=='★')){const id=myHorseNear();if(id!==null)return{type:'ride',id};}
 if(travelNear(player.position.x,player.position.z)&&(!o||o.type==='burn'))return{type:'travel'};return o;};
const _updateHint7=updateHint;updateHint=function(){const o=nearInter();if(o&&(o.type==='ride'||o.type==='unride'||o.type==='travel')){const h=$('hint');h.textContent=(TOUCH?'':'E / ')+t(o.type==='travel'?'tr_travel':o.type);h.style.display='block';setAct(o.type==='travel'?'🛒':'🐴');return;}_updateHint7();};
const _interact7=interact;interact=function(){if(!active)return _interact7();const o=nearInter();
 if(o&&o.type==='travel'){if(NET.role==='guest')netSend({t:'act'});else renderShop('travel');return;}
 if(o&&o.type==='ride'){if(NET.role==='guest'){rideId=o.id;netSend({t:'ride',id:o.id,on:1});}else{rideP=pets.find(q=>q.id===o.id);if(rideP)rideP.rider='P';badge('horse');}animalSfx('horse',0);return;}
 if(o&&o.type==='unride'){if(NET.role==='guest'){rideId=null;netSend({t:'ride',on:0});}else{if(rideP)rideP.rider=null;rideP=null;}player.position.x+=1.2;return;}
 _interact7();};
// zirgā skrien ātrāk un sēž augstāk
const _move7=move;move=function(dt){const x0=player.position.x,z0=player.position.z;_move7(dt);if(!riding()||inTank)return;
 player.position.x+=(player.position.x-x0)*1.6;player.position.z+=(player.position.z-z0)*1.6;pushOut(player.position,.35,pY,PT);clampW(player.position);player.position.y=pY+.95;
 const u=player.userData;u.leg1.rotation.x=-.9;u.leg2.rotation.x=-.9;};
const _gameOver7=gameOver;gameOver=function(){if(rideP)rideP.rider=null;rideP=null;rideId=null;_gameOver7();};
// ---------- kopīgā spēle ----------
const _guestAct7=guestAct;guestAct=function(G){if(!G.dead&&travelNear(G.pos.x,G.pos.z)){netTo(G,{t:'shop',kind:'travel'});return;}_guestAct7(G);};
const _netHostMsg7=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='ride'){for(const p of pets)if(p.rider===G)p.rider=null;if(d.on){const p=pets.find(q=>q.id===d.id&&q.kind==='horse'&&q.owner===G);if(p){p.rider=G;badge('horse');}}return;}
 if(d&&G.ready&&d.t==='pname'){const p=pets.find(q=>q.id===d.id&&q.owner===G);if(p)p.name=String(d.n||'').slice(0,12)||p.name;return;}
 _netHostMsg7(G,d);};
const _netHostFrame7=netHostFrame;netHostFrame=function(dt){_netHostFrame7(dt);for(const p of pets)if(p.rider&&p.rider!=='P'&&p.rider.mesh)p.rider.mesh.position.y=p.rider.y+.95;};
const _netWelcome7=netWelcome;netWelcome=function(G){_netWelcome7(G);netTo(G,{t:'tv',on:TRAVEL.on?1:0,x:TRAVEL.x,z:TRAVEL.z,ex:TRAVEL.ex});};
const _netExtraEv27=netExtraEv2;netExtraEv2=function(e){if(e.e==='tv'){travelShow(!!e.on,e.x||0,e.z||0,e.ex);return;}_netExtraEv27(e);};
const _netGuestMsg7=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='tv'){travelShow(!!d.on,d.x||0,d.z||0,d.ex);return;}
 if(d&&d.t==='wel'){rideId=null;travelShow(false,0,0);}
 _netGuestMsg7(d);
 if(d&&d.t==='pe'){for(const [id,k,x,z,ry,ow,nm,lv,oid] of d.E){const o=netPets.get(id);if(!o)continue;o.kind=PETK[k]||'dog';o.oid=oid;o.name=nm;o.lvl=lv;
   if(nm){const txt=PIC[o.kind]+' '+nm+' ⭐'+lv;if(o.labT!==txt){delLabel(o.lab);o.lab=mkLabel(txt,0x2e7d32);o.lab.scale.set(1.2,.3,1);o.labT=txt;}}else if(o.lab){delLabel(o.lab);o.lab=null;o.labT='';}}
  for(const [id,x,z,ki] of d.C){const o=netCk.get(id);if(o)o.kind=LIVEK[ki||0];}}};
const _guestPets7=guestPets;guestPets=function(dt){for(const o of netPets.values())if(gtime-o.seen>1.5&&o.lab){delLabel(o.lab);o.lab=null;}_guestPets7(dt);for(const [id,o] of netPets){if(o.kind==='parrot')o.g.position.y=2.3+Math.sin(clock.elapsedTime*3+id)*.25;
 if(o.lab){const p=o.g.position;o.lab.position.set(p.x,(o.kind==='parrot'?p.y+.6:0)+(o.kind==='horse'?2.7:o.kind==='bear'?2.4:o.kind==='parrot'?0:1.5),p.z);o.lab.visible=Math.hypot(p.x-player.position.x,p.z-player.position.z)<40;}}};
const _updateFx7=updateFx;updateFx=function(dt){_updateFx7(dt);if(NET.role!=='guest'&&(active||NET.guests.size))petsTick(dt);soundTick(dt);};
