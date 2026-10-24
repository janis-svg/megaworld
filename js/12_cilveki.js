// 12_cilveki.js - Boti, komandas, bandas, kari, nocietinājumi, pavēles
// ---------- cilvēki (boti), komandas un bandas ----------
const NAMES=['Andris','Kristaps','Laura','Ilze','Edgars','Rihards','Marta','Dace','Toms','Elīna','Roberts','Anna','Mārtiņš','Līga','Oskars','Zane','Raitis','Agnese','Kārlis','Inese','Gatis','Sanita','Valters','Krišs','Emīls','Paula'];
const TCOL=[0xd4ac0d,0xc0392b,0x8e44ad,0xe67e22,0x16a085,0xd35490,0xdfe6e9,0x8d6e63,0x7cb342,0x2d3436,0x00acc1,0xf06292,0x6d4c41,0x9ccc65];
function buildBot(col,helmet){
 const g=new THREE.Group(),uni=[];
 const b=cube(.7,.8,.38,col,.9);b.position.y=1.1;g.add(b);uni.push(b.material);
 const h=cube(.46,.46,.44,[0xe0b48f,0xc69c6d,0x8d5524,0xf1c27d][Math.floor(Math.random()*4)],.8);h.position.y=1.75;g.add(h);
 const hel=helmet?cube(.52,.2,.5,0x39482b,.8):cube(.48,.12,.46,[0x2b1c12,0x6b4423,0xd8b25a,0x111111][Math.floor(Math.random()*4)],.9);hel.position.y=2.0;g.add(hel);
 for(const sx of [-.18,.18]){const l=cube(.26,.68,.28,0x2b3322,.9);l.position.set(sx,.4,0);g.add(l);}
 for(const sx of [-.48,.48]){const a=cube(.2,.62,.24,col,.9);a.position.set(sx,1.1,0);g.add(a);uni.push(a.material);}
 const gn=cube(.1,.14,.6,0x222a33,.4);gn.position.set(.3,1.1,-.4);g.add(gn);
 return{g,uni,gn};
}
function newTeam(col,isP){const Tm={id:++teamId,color:col,members:[],enemies:new Set(),base:null,plan:[],size:1,blocks:30,isPlayer:!!isP,askT:0,alarm:null};teams.push(Tm);return Tm;}
function leader(Tm){const n=Tm.members.length;return n?Tm.members[0].name+(n>1?' (+'+(n-1)+')':''):'?';}
function teamSize(Tm){return Tm.members.length+(Tm.isPlayer?1:0);}
function strI(I,hp){let s=hp*.4+I.armor*.4+I.meds*8;for(const w of GUNS)if(I.has[w])s+=WP[w].val+I.ammo[w]*WP[w].av;return s;}
function teamStr(Tm){let s=0;for(const m of Tm.members)s+=strI(m.I,m.hp);if(Tm.isPlayer&&inv)s+=strI(inv,health);return s;}
function relabel(b){delLabel(b.lab);const foe=PT&&PT.enemies.has(b.team);b.lab=mkLabel((b.team.isPlayer?'★ ':foe?'⚔️ ':b.team.offer>gtime?'🤝 ':'')+b.name,b.team.color);b.bar.f.material.color.setHex(b.team.isPlayer?0x2ecc71:foe?0xe74c3c:0xf1c40f);b.gn.visible=GUNS.some(w=>b.I.has[w]);}
function dropTeam(Tm){const i=teams.indexOf(Tm);if(i>=0)teams.splice(i,1);for(const o of teams)o.enemies.delete(Tm);}
function setTeam(b,Tm){const o=b.team;if(o===Tm)return;if(o){const i=o.members.indexOf(b);if(i>=0)o.members.splice(i,1);if(!o.members.length&&!o.isPlayer)dropTeam(o);}b.team=Tm;Tm.members.push(b);b.uni.forEach(m=>m.color.setHex(Tm.color));relabel(b);b.bi=null;b.co=null;b.gx=null;}
function newBot(Tm,x,z,name,I,helmet){
 const{g,uni,gn}=buildBot(Tm.color,helmet);g.position.set(x,0,z);scene.add(g);
 const b={g,uni,gn,name,I,hp:100,team:null,role:'gather',cmd:'follow',cd:Math.random(),th:Math.random()*.4,st:{},slot:0,wps:[],gx:null,gz:null,tg:null,w:'hands',ft:10+Math.random()*10,bt:0,follow:false,dead:false};
 b.bar=mkBar(.9,0xf1c40f);humans.push(b);setTeam(b,Tm);return b;
}
function botInv(rich){const I=newInv(),r=n=>Math.floor(Math.random()*n);
 if(rich||Math.random()<.75){I.has.pistol=true;I.ammo.pistol=8+r(20);}
 if(rich||Math.random()<.18){I.has.m16=true;I.ammo.m16=10+r(25);}
 if(Math.random()<(rich?.4:.08)){I.has.shot=true;I.ammo.shot=4+r(8);}
 if((rich&&Math.random()<.6)||Math.random()<.04){I.has.rpg=true;I.ammo.rpg=1+r(2);}
 if(rich||Math.random()<.2)I.armor=50;if(Math.random()<.4)I.meds=1;return I;}
function roadPoint(x,z,r){for(let k=0;k<14;k++){const along=Math.random()<.5,rc=(Math.floor(Math.random()*8)-4)*40+20,v=(Math.random()*2-1)*(CITY-6);const px=along?rc+(Math.random()-.5)*4:v,pz=along?v:rc+(Math.random()-.5)*4;if(Math.hypot(px-x,pz-z)<r)return[px,pz];}return[Math.max(-CITY,Math.min(CITY,x+(Math.random()-.5)*20)),Math.max(-CITY,Math.min(CITY,z+(Math.random()-.5)*20))];}
function assignRoles(Tm){const ms=[...Tm.members].sort(()=>Math.random()-.5),nb=ms.length===1?(Math.random()<.5?1:0):Math.max(1,Math.round(ms.length*.5));ms.forEach((m,i)=>{m.role=i<nb?'build':'gather';m.bi=null;m.co=null;});}
// nocietinājums: 2 klučus augsta siena ar durvīm, robi 3. rindā, stūros torņi 4 klučus augsti.
// botu bandas katru dienu apbūvē vēl vienu ārējo gredzenu (līdz +2), spēlētāja komanda būvē pēc komandas lieluma
function makePlan(Tm){
 const n=teamSize(Tm);let s=n>=6?4:n>=3?3:2;if(!Tm.isPlayer)s+=Math.min(2,day-1);
 const bx=Math.round(Tm.base.x),bz=Math.round(Tm.base.z);Tm.size=s;Tm.inner=Tm.inner?Math.min(Tm.inner,s):s;Tm.plan=[];
 for(let l=0;l<4;l++)for(let dx=-s;dx<=s;dx++)for(let dz=-s;dz<=s;dz++){
  if(Math.max(Math.abs(dx),Math.abs(dz))!==s)continue;
  const door=dx===0&&dz===s,corner=Math.abs(dx)===s&&Math.abs(dz)===s;
  if(door&&l>0)continue;
  if(l===2&&!corner&&((dx+dz)&1))continue;
  if(l===3&&!corner)continue;
  const x=bx+dx,z=bz+dz;if(colTop(x,z)>l)continue;
  Tm.plan.push({x,z,l,door});
 }
}
function spawnBots(){
 const nm=[...NAMES].sort(()=>Math.random()-.5);let ni=0,ci=0;
 const K=newTeam(TCOL[ci++]);K.friendly=true;const KI=newInv();KI.has.pistol=true;KI.ammo.pistol=10;newBot(K,3,-6,'Kaspars',KI,true).role='gather';
 for(const n of [1,1,1,1,1,2,2,2,3,3,4]){
  const Tm=newTeam(TCOL[ci++%TCOL.length]);let x=0,z=0;
  for(let k=0;k<40;k++){[x,z]=roadPoint(0,0,1e9);if(Math.hypot(x,z)>(n===1?30:60))break;}
  Tm.blocks=40+15*n;const rich=Math.random()<.28;
  for(let i=0;i<n;i++)newBot(Tm,x+(Math.random()-.5)*3,z+(Math.random()-.5)*3,nm[ni++%nm.length],botInv(rich),Math.random()<.4);
  Tm.base={x:Math.round(x),z:Math.round(z)};makePlan(Tm);assignRoles(Tm);
 }
 // ~10% cilvēku ir draudzīgi vientuļnieki: kamēr vieni, paši nāk piedāvāt draudzību
 const solos=teams.filter(x=>!x.isPlayer&&!x.friendly&&x.members.length===1).sort(()=>Math.random()-.5);
 solos.slice(0,Math.max(1,Math.round((humans.length-1)*.1))).forEach(x=>{x.friendly=true;x.pal=true;});
}
function war(A,B){
 if(A===B||A.enemies.has(B))return;A.enemies.add(B);B.enemies.add(A);
 if(A.isPlayer||B.isPlayer){const O=A.isPlayer?B:A;O.members.forEach(relabel);say(tf('atk',{n:leader(O)}));sfx('bang');}
 else{const p=A.members[0]&&A.members[0].g.position;if(p&&Math.hypot(p.x-player.position.x,p.z-player.position.z)<50)say(tf('war',{a:leader(A),b:leader(B)}));}
}
function mergeTeams(sm,big){const a=leader(sm),b=leader(big),p=sm.members[0]&&sm.members[0].g.position,near=p&&Math.hypot(p.x-player.position.x,p.z-player.position.z)<50;[...sm.members].forEach(m=>setTeam(m,big));assignRoles(big);if(big.base)makePlan(big);if(near)say(tf('merge',{a,b}));}
function askJoin(b){
 const Tm=b.team;if(Tm.isPlayer||PT.enemies.has(Tm))return;
 if(gtime<Tm.askT){say(tf('rc',{n:b.name}));return;}
 if(PT.members.length+Tm.members.length>9){say(t('full'));return;}
 const my=teamStr(PT),th=teamStr(Tm);
 if(Tm.offer>gtime)Tm.friendly=true;
 if(!Tm.friendly&&th>my*1.25){Tm.askT=gtime+25;if(Math.random()<.5){war(Tm,PT);say(tf('ra',{n:b.name}));}else say(tf('rf',{n:b.name}));return;}
 if(!Tm.friendly&&th>my*.8&&Math.random()<.4){Tm.askT=gtime+25;say(tf('rf',{n:b.name}));return;}
 const n=leader(Tm);[...Tm.members].forEach(m=>{setTeam(m,PT);m.cmd='follow';});
 PT.members.forEach((m,i)=>m.slot=i*6.283/Math.max(3,PT.members.length));
 say(tf('jn',{n}));sfx('pick');renderTeam();
}
function teamTick(){
 // vājāki cilvēki dienā paši atnāk un piedāvā pievienoties
 for(const Tm of teams)if(Tm.offer&&Tm.offer<gtime){Tm.offer=0;Tm.members.forEach(relabel);}
 if(active&&hour>=7.5&&hour<19&&gtime>offerAt&&!teams.some(x=>x.offer>gtime)){
  let best=null,bd=60;const my=teamStr(PT);
  for(const Tm of teams){if(Tm.isPlayer||PT.enemies.has(Tm)||!Tm.members.length||PT.members.length+Tm.members.length>9)continue;if(!Tm.friendly&&teamStr(Tm)>my*.9)continue;
   // draudzīgie vientuļnieki nāk arī no tālienes un tiek izvēlēti pirmie
   const pal=Tm.pal&&Tm.members.length===1;
   for(const m of Tm.members){const d=Math.hypot(m.g.position.x-player.position.x,m.g.position.z-player.position.z)-(pal?120:0);if(d<bd){bd=d;best=Tm;}}}
  if(best){const pal=best.pal&&best.members.length===1;best.offer=gtime+(pal?70:25);best.offSaid=false;best.members.forEach(relabel);offerAt=gtime+45;}else offerAt=gtime+10;
 }
 for(const Tm of teams){Tm.rp=(Tm.rp||30)-2;if(Tm.rp<=0){Tm.rp=30;if(Tm.base&&!Tm.plan.length&&(!Tm.isPlayer||PT.members.some(m=>m.cmd==='build')))makePlan(Tm);}}
 const pos=Tm=>{const a=Tm.members.map(m=>m.g.position);if(Tm.isPlayer&&active)a.push(player.position);return a;};
 for(let i=0;i<teams.length;i++)for(let j=i+1;j<teams.length;j++){
  const A=teams[i],B=teams[j];if(A.enemies.has(B))continue;const k=A.id+'-'+B.id;if((pairCd.get(k)||0)>gtime)continue;
  const pa=pos(A),pb=pos(B);if(!pa.length||!pb.length)continue;let md=1e9;for(const p of pa)for(const q of pb)md=Math.min(md,Math.hypot(p.x-q.x,p.z-q.z));if(md>20)continue;
  pairCd.set(k,gtime+40);
  if(A.isPlayer||B.isPlayer){const O=A.isPlayer?B:A;if(O.friendly)continue;if(O.members.length>teamSize(PT)&&teamStr(O)>teamStr(PT)*1.1&&Math.random()<.45)war(O,PT);continue;}
  if(A.friendly||B.friendly)continue;
  const big=A.members.length>=B.members.length?A:B,sm=big===A?B:A,sb=teamStr(big),ss=teamStr(sm);
  if(big.members.length+sm.members.length<=10&&Math.random()<.4){if(ss>sb*1.2)war(big,sm);else{mergeTeams(sm,big);return;}}
  else if(big.members.length>sm.members.length&&sb>ss*1.1&&Math.random()<.5)war(big,sm);
 }
}
const valid=e=>e.m?!e.m.userData.dead:e.pl?active:!e.b.dead;
function nearestThreat(b){
 // mērķis: tuvs un ievainots (visi šauj pa vienu), uzbrucējs komandai priekšā
 const p=b.g.position,Tm=b.team,mr=hour>=19||hour<7?30:24,al=Tm.alarm&&Tm.alarm.until>gtime?Tm.alarm.T:null;let e=null,es=1e9,ed=0,foes=0;
 for(const z of zombies){const u=z.userData;if(u.rise>0||u.dead||u.flee>0)continue;const d=Math.hypot(z.position.x-p.x,z.position.z-p.z);if(d<mr){const s=d+u.hp/u.max*6;if(s<es){es=s;ed=d;e={p:z.position,y:0,m:z};}}}
 for(const h of HL){if(h.team===Tm||!Tm.enemies.has(h.team))continue;const d=Math.hypot(h.p.x-p.x,h.p.z-p.z),lim=h.team===al?50:26;if(d<lim){if(d<20)foes++;const s=d+(h.pl?health:h.b.hp)/100*6-(h.team===al?6:0);if(s<es){es=s;ed=d;e=h;}}}
 return e?{e,ed,foes}:null;
}
function bestW(b,e,d){const I=b.I,big=e.m&&e.m.userData.kind==='zw';
 if(I.has.rpg&&I.ammo.rpg>0&&big)return'rpg';
 if(I.has.shot&&I.ammo.shot>0&&d<9)return'shot';
 if(I.has.m16&&I.ammo.m16>0)return'm16';
 if(I.has.pistol&&I.ammo.pistol>0)return'pistol';
 if(I.has.shot&&I.ammo.shot>0)return'shot';
 if(I.has.rpg&&I.ammo.rpg>0&&e.m)return'rpg';
 return'hands';}
// ceļš: no sava nocietinājuma iziet / ieiet pa durvīm (durvis vienmēr ir +z pusē), tālākos gabalos pa ielām
function goal(b,x,z,road){
 if(b.gx!=null&&Math.hypot(b.gx-x,b.gz-z)<1.5)return;b.gx=x;b.gz=z;
 const p=b.g.position,Tm=b.team;let pre=[],post=[];
 if(Tm.base&&Tm.plan&&Tm.inner){const bx=Math.round(Tm.base.x),bz=Math.round(Tm.base.z),S=Tm.size+.5,ins=(X,Z)=>Math.abs(X-bx)<S&&Math.abs(Z-bz)<S,pi=ins(p.x,p.z),ti=ins(x,z),out=[bx,bz+Tm.size+1.8],ctr=[bx,bz];
  if(pi&&!ti)pre=[ctr,out];else if(!pi&&ti)post=[out,ctr];}
 const from=pre.length?{x:pre[pre.length-1][0],z:pre[pre.length-1][1]}:p,to=post.length?post[0]:[x,z];
 const mid=road&&Math.hypot(to[0]-from.x,to[1]-from.z)>25?roadPath(from,to[0],to[1]):[];
 b.wps=[...pre,...mid,...post];
}
function roadPath(p,x,z){const rc=v=>Math.round((v-20)/40)*40+20,ax=rc(p.x),az=rc(p.z),bx=rc(x),bz=rc(z),out=[];let lx=p.x,lz=p.z;
 for(const q of [[ax,az],[bx,az],[bx,bz]]){if(Math.hypot(q[0]-lx,q[1]-lz)>2){out.push(q);lx=q[0];lz=q[1];}}return out;}
function openCont(o,b){o.open=true;taken.add(o.id);if(o.mesh)o.mesh.position[o.ax||'x']+=o.sgn*.4;o.loot.forEach(k=>giveLoot(k,b.I,b.team));o.loot=[];sfxAt('drawer',o.x,o.z,20);relabel(b);}
function botThink(b){
 const p=b.g.position,Tm=b.team,I=b.I;
 if(b.hp<55&&I.meds>0){I.meds--;b.hp=Math.min(100,b.hp+40);}
 const th=nearestThreat(b);b.tg=th?th.e:null;
 if(th){const d=th.ed;b.w=bestW(b,th.e,d);const W=WP[b.w];
  // atkāpjas nocietinājumā, ja ievainots, pārspēts vai bez ložām pret bruņotu cilvēku
  let mates=0;for(const o of Tm.members)if(o!==b&&Math.hypot(o.g.position.x-p.x,o.g.position.z-p.z)<20)mates++;if(Tm.isPlayer&&active&&Math.hypot(player.position.x-p.x,player.position.z-p.z)<20)mates++;
  const followP=Tm.isPlayer&&b.cmd==='follow';
  if(Tm.base&&Tm.inner&&!followP&&(b.hp<35||th.foes>mates+2||(b.w==='hands'&&!th.e.m&&d<20))){const inn=Math.max(0,Tm.inner-1);if(Math.abs(p.x-Tm.base.x)>inn+.5||Math.abs(p.z-Tm.base.z)>inn+.5)goal(b,Tm.base.x+(Math.random()-.5)*inn,Tm.base.z+(Math.random()-.5)*inn,true);else b.gx=null;b.follow=false;return;}
  if(followP&&b.hp<35){b.follow=true;b.gx=null;return;}
  // naktī pret monstriem: paliek nocietinājumā un šauj caur savām sienām, nedzenas pakaļ
  if((hour>=21||hour<7)&&th.e.m&&Tm.base&&Tm.inner&&!followP){const inn=Math.max(0,Tm.inner-1);if(Math.abs(p.x-Tm.base.x)>inn+.6||Math.abs(p.z-Tm.base.z)>inn+.6)goal(b,Tm.base.x+(Math.random()-.5)*inn,Tm.base.z+(Math.random()-.5)*inn,true);else b.gx=null;b.follow=false;return;}
  b.follow=false;
  if(b.w==='hands'||d>W.rng*.75)goal(b,th.e.p.x,th.e.p.z);
  else if(d<(th.e.m?6:4)){const ax=p.x-th.e.p.x,az=p.z-th.e.p.z,l=Math.hypot(ax,az)||1;goal(b,p.x+ax/l*4,p.z+az/l*4);}
  else b.gx=null;
  return;}
 const night=hour>=21||hour<7;
 if(Tm.offer>gtime&&active&&!night){const d=Math.hypot(player.position.x-p.x,player.position.z-p.z);b.follow=false;if(d>2.6)goal(b,player.position.x,player.position.z,true);else b.gx=null;if(d<8&&!Tm.offSaid){Tm.offSaid=true;say(tf('offer',{n:leader(Tm)}));sfx('pick');}return;}
 if(Tm.isPlayer&&(b.cmd==='follow'||(night&&!Tm.base))){b.gx=null;b.follow=true;return;}
 b.follow=false;
 let role=Tm.isPlayer?b.cmd:b.role;
 if(role==='build'&&!Tm.isPlayer&&!GUNS.some(w=>I.has[w]&&I.ammo[w]>0)&&!night)role='gather';
 if(night&&Tm.base){
  if(role==='build'&&Tm.plan.length&&buildThink(b))return; // labo sienas arī naktī
  const s=Math.max(.5,(Tm.inner||Tm.size)-1);if(Math.abs(p.x-Tm.base.x)>s+.6||Math.abs(p.z-Tm.base.z)>s+.6)goal(b,Tm.base.x+(Math.random()-.5)*s,Tm.base.z+(Math.random()-.5)*s,true);else b.gx=null;return;}
 if(role==='build'&&buildThink(b))return;
 gatherThink(b);
}
function buildThink(b){
 const Tm=b.team;
 if(!Tm.base){Tm.base={x:Math.round(b.g.position.x),z:Math.round(b.g.position.z)};makePlan(Tm);}
 if(Tm.blocks<1)return false;
 let it=b.bi;if(!it||it.done||!Tm.plan.includes(it)){
  // tuvākais klucis, ko var likt tagad (apakšējā rinda jau ir)
  const p=b.g.position;let bd=1e9;it=null;
  for(const q of Tm.plan){if(q.res&&q.res!==b&&!q.res.dead&&q.res.team===Tm)continue;const ct=colTop(q.x,q.z),d=Math.hypot(q.x-p.x,q.z-p.z)+(ct===q.l?0:50);if(d<bd){bd=d;it=q;}}
  if(it)it.res=b;b.bi=it;}
 if(!it){if(b.gx==null||Math.random()<.1)goal(b,Tm.base.x+(Math.random()-.5)*Tm.size*1.4,Tm.base.z+(Math.random()-.5)*Tm.size*1.4,true);return true;}
 const dx=Tm.base.x-it.x,dz=Tm.base.z-it.z,l=Math.hypot(dx,dz)||1;let sx=it.x+dx/l*1.15,sz=it.z+dz/l*1.15;
 if(wallAt(sx,sz,.5)){sx=it.x-dx/l*1.15;sz=it.z-dz/l*1.15;}
 const reach=Math.hypot(b.g.position.x-it.x,b.g.position.z-it.z);
 if(reach>3.2&&Math.hypot(b.g.position.x-sx,b.g.position.z-sz)>1.2){goal(b,sx,sz,true);return true;}
 b.gx=null;b.bt-=.4;if(b.bt>0)return true;b.bt=.6;
 const ct=colTop(it.x,it.z),hh=it.door?2:1;
 const fin=()=>{it.done=true;const i=Tm.plan.indexOf(it);if(i>=0)Tm.plan.splice(i,1);b.bi=null;};
 if(ct>it.l){fin();return true;}
 if(ct<it.l){it.tries=(it.tries||0)+1;if(it.tries>6){fin();return true;}const i=Tm.plan.indexOf(it);Tm.plan.push(Tm.plan.splice(i,1)[0]);it.res=null;b.bi=null;return true;}
 if(!canPlace(it.x,it.z,hh)){it.tries=(it.tries||0)+1;if(it.tries>5)fin();return true;}
 const cost=it.door?4:1;if(Tm.blocks<cost)return false;
 placeBlock(it.x,it.z,Tm,it.door);Tm.blocks-=cost;fin();if(Tm.isPlayer)renderInv();return true;
}
function gatherThink(b){
 const p=b.g.position,Tm=b.team,I=b.I;
 let best=null,bd=14;
 for(const ch of chunks.values())for(const it of ch.items){const d=Math.hypot(it.x-p.x,it.z-p.z);if(d<bd){bd=d;best={it,ch};}}
 for(const dp of drops){const d=Math.hypot(dp.x-p.x,dp.z-p.z);if(d<bd){bd=d;best={dp};}}
 if(best){const q=best.it||best.dp;if(bd<1.6){if(best.it)takeItem(best.ch,best.it,b);else takeDrop(best.dp,b);relabel(b);if(Tm.isPlayer)renderInv();}else goal(b,q.x,q.z);return;}
 let o=b.co;if(o&&(o.open||!o.ch||chunks.get(o.ch.key)!==o.ch))o=b.co=null;
 if(!o){let od=55;for(const ch of chunks.values())for(const c of ch.inter){if(c.type==='door'||c.open||(c.res&&c.res!==b&&!c.res.dead))continue;if(Math.hypot(c.x-player.position.x,c.z-player.position.z)<5)continue;const d=Math.hypot(c.x-p.x,c.z-p.z);if(d<od){od=d;o=c;}}if(o){o.res=b;b.co=o;}}
 if(o){if(Math.hypot(o.x-p.x,o.z-p.z)<1.5){openCont(o,b);b.co=null;if(Tm.isPlayer)renderInv();}else goal(b,o.x,o.z,true);return;}
 b.ft-=.4;if(b.ft<=0){b.ft=16+Math.random()*10;if(Math.hypot(p.x-player.position.x,p.z-player.position.z)>110&&Math.random()<.45){rollLoot(Math.random,1).forEach(k=>giveLoot(k,I,Tm));relabel(b);}}
 if(b.gx==null||Math.hypot(b.gx-p.x,b.gz-p.z)<2){const[x,z]=roadPoint(p.x,p.z,70);goal(b,x,z,true);}
}
function botFire(b,tp,w,human){const W=WP[w],p=b.g.position;b.I.ammo[w]--;b.cd=W.brate*(human?1.3:1)*(.8+Math.random()*.5);const base=Math.atan2(tp.x-p.x,tp.z-p.z);
 for(let k=0;k<W.pel;k++){const a=base+(Math.random()-.5)*(W.sp*2+(human?.2:.07));spawnBullet(p.x+Math.sin(a)*.8,1.2,p.z+Math.cos(a)*.8,Math.sin(a),Math.cos(a),W,b.team,false);}
 sfxAt(W.rocket?'rocket':'ally',p.x,p.z,35);}
function botMove(b,dt,i){
 const g=b.g,p=g.position;let tx=null,tz=null,sp=3.6;
 if(b.tg&&!valid(b.tg))b.tg=null;
 if(b.follow&&!b.tg&&active){tx=player.position.x+Math.cos(b.slot)*3;tz=player.position.z+Math.sin(b.slot)*3;const d=Math.hypot(tx-p.x,tz-p.z);if(d>45){p.x=tx;p.z=tz;}sp=d>6?7:4.5;if(d<.8)tx=null;}
 else if(b.gx!=null){if(b.wps.length){const w=b.wps[0];tx=w[0];tz=w[1];if(Math.hypot(tx-p.x,tz-p.z)<1.5)b.wps.shift();}else{tx=b.gx;tz=b.gz;if(Math.hypot(tx-p.x,tz-p.z)<.6)tx=null;}sp=b.tg?4.6:3.6;}
 let mv=false;
 if(tx!==null){const d=stepTo(p,tx,tz,sp,dt,.35,b.team,b.st);mv=d>.3;if(!b.tg)g.rotation.y=Math.atan2(-(tx-p.x),-(tz-p.z));}
 else pushOut(p,.35,0,b.team);
 b.cd-=dt;
 if(b.tg){const e=b.tg,dx=e.p.x-p.x,dz=e.p.z-p.z,d=Math.hypot(dx,dz);g.rotation.y=Math.atan2(-dx,-dz);
  if(b.cd<=0){const w=b.w;
   if(w==='hands'){if(d<1.8&&(e.y||0)<1.4&&!blockedLine(p,e.p,.8)){b.cd=1;e.m?dmgMonster(e.m,12,false):hurt(e,12,b.team,false);}}
   else if(d<WP[w].rng&&b.I.ammo[w]>0){const bl=blockedLine(p,e.p,1.2,b.team);
    if(!bl)botFire(b,e.p,w,!e.m);else if(bl===2&&b.I.has.rpg&&b.I.ammo.rpg>0)botFire(b,e.p,'rpg',!e.m);else{b.st.side=Math.random()<.5?1:-1;b.st.sideT=.8;b.cd=.5;}}
   else if(b.I.ammo[w]<=0)b.w=bestW(b,e,d);}}
 const sw=mv?Math.sin(clock.elapsedTime*10+i)*.5:0;g.children[3].rotation.x=sw;g.children[4].rotation.x=-sw;
 const pdist=Math.hypot(p.x-player.position.x,p.z-player.position.z),vis=pdist<40;g.visible=pdist<85;
 b.lab.visible=b.bar.bg.visible=b.bar.f.visible=vis;if(vis){setBar(b.bar,p.x,2.45,p.z,b.hp/100);b.lab.position.set(p.x,2.8,p.z);}
}
function updateBots(dt){for(let i=humans.length-1;i>=0;i--){const b=humans[i];if(!b||b.dead)continue;b.th-=dt;if(b.th<=0){b.th=.4;botThink(b);}if(!b.dead)botMove(b,dt,i);}}
function hurt(h,dmg,src,pl){if(h.pl)damagePlayer(dmg,src);else hurtBot(h.b,dmg,src,pl);}
function hurtBot(b,dmg,src,pl){
 if(b.dead)return;const a=Math.min(b.I.armor,dmg*.6);b.I.armor-=a;b.hp-=dmg-a;
 const p=b.g.position;if(Math.hypot(p.x-player.position.x,p.z-player.position.z)<25)popup('-'+Math.round(dmg)+' HP',p.clone().add(new THREE.Vector3(0,2.3,0)));
 if(src&&src!==b.team){war(b.team,src);b.team.alarm={T:src,until:gtime+15};}
 if(b.hp<=0)killBot(b,src);
}
function scatter(parts,pw){parts.forEach(part=>{part.userData.vx=(Math.random()-.5)*2.5*pw;part.userData.vz=(Math.random()-.5)*2.5*pw;part.userData.vy=(.6+Math.random()*1.8)*pw;part.userData.rx=(Math.random()-.5)*10;part.userData.rz=(Math.random()-.5)*10;part.position.y+=.1;});}
function killBot(b,src){
 if(b.dead)return;b.dead=true;const i=humans.indexOf(b);if(i>=0)humans.splice(i,1);const Tm=b.team,j=Tm.members.indexOf(b);if(j>=0)Tm.members.splice(j,1);
 delBar(b.bar);delLabel(b.lab);
 const I=b.I,p=b.g.position;
 if(GUNS.some(w=>I.has[w]||I.ammo[w]>0)||I.meds||I.armor>0){const m=itemMesh('bag');m.position.set(p.x,.4,p.z);scene.add(m);drops.push({m,x:p.x,z:p.z,I});}
 scatter(b.g.children,1);b.g.userData.corpseParts=b.g.children;corpses.push({group:b.g,life:14});
 if(src===PT){score+=25;$('score').textContent=score;}
 if(Tm.isPlayer){say(t('allydown'));sfx('hurt');PT.members.forEach((m,k)=>m.slot=k*6.283/Math.max(3,PT.members.length));renderTeam();}
 else if(Math.hypot(p.x-player.position.x,p.z-player.position.z)<40)say(tf('kb',{n:b.name}));
 if(!Tm.members.length&&!Tm.isPlayer)dropTeam(Tm);
}
function damagePlayer(dmg,src){
 if(invul>0||!active)return;const a=Math.min(inv.armor,dmg*.6);inv.armor-=a;dmg-=a;
 health=Math.max(0,health-dmg);updateHealth();flashHurt();sfx('hurt');
 popup('-'+Math.round(dmg)+' HP',player.position.clone().add(new THREE.Vector3(0,2,0)));
 if(src&&src!==PT){war(PT,src);PT.alarm={T:src,until:gtime+15};}
 if(health<=0)gameOver();
}
// komandas pavēles (sekot / būvēt / vākt)
function wIcon(m){const w=[...GUNS].reverse().find(k=>m.I.has[k]&&m.I.ammo[k]>0);return w?WP[w].ic+' '+m.I.ammo[w]:'✊';}
function renderTeam(){
 const el=$('team');if(!PT||el.style.display!=='block')return;const ms=PT.members;
 const btn=(i,c,on)=>'<button class="corner'+(on?' on':'')+'" data-i="'+i+'" data-c="'+c+'">'+t('c_'+c).split(' ')[0]+'</button>';
 const row=(i,cmd)=>btn(i,'follow',cmd==='follow')+btn(i,'build',cmd==='build')+btn(i,'gather',cmd==='gather');
 let h='<button class="corner" data-x="1" style="float:right;margin:0">✖</button><b>👥 '+t('teamt')+' ('+ms.length+'/9)</b> · 🧱 '+PT.blocks;
 if(!ms.length)h+='<br>'+t('noteam');
 else{h+='<div class="row"><span>'+t('all')+': '+t('c_follow')+' · '+t('c_build')+' · '+t('c_gather')+'</span></div><div class="row"><span>'+t('all')+'</span>'+row('all','')+'</div>';
  ms.forEach((m,i)=>{h+='<div class="row"><span>'+m.name+' ❤️'+Math.ceil(m.hp)+' '+wIcon(m)+'</span>'+row(i,m.cmd)+'</div>';});}
 el.innerHTML=h;el.querySelector('button[data-x]').onpointerdown=e=>{e.stopPropagation();e.preventDefault();el.style.display='none';};el.querySelectorAll('button[data-c]').forEach(b=>b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();setCmd(b.dataset.i,b.dataset.c);});
}
function setCmd(i,c){
 const ms=i==='all'?PT.members:[PT.members[+i]];if(!ms[0])return;
 if(c==='build'){if(!PT.base||Math.hypot(PT.base.x-player.position.x,PT.base.z-player.position.z)>8){PT.base={x:Math.round(player.position.x),z:Math.round(player.position.z)};PT.inner=0;makePlan(PT);}else if(!PT.plan.length)makePlan(PT);}
 ms.forEach(m=>{m.cmd=c;m.gx=null;m.bi=null;m.co=null;});say(tf('cmdset',{c:t('c_'+c)}));renderTeam();
}
