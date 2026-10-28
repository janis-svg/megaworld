// 60_snaiperis.js - Karā katrai armijai viens snaiperis maskēšanās tērpā: meklē slēpni (zāle, segums, skats uz kontrolpunktu),
// tup tajā un no tālienes šauj pa pretiniekiem. Maina vietu pēc katra novāktā, pēc 3 šāvieniem, ja ievainots vai pamanīts. Otrais ierocis: pistole. Ja pretinieks pienāk tuvu, cīnās kā parasts kareivis.
// Pretinieki viņu pamana tikai ar acīm (tuvu vai skatoties uz šāviena uzliesmojumu), tad 20 s viņš mirgo to kartē.
// Viņa šāviens noņem ~60 dzīvības (spēlētājam vajag 2 trāpījumus), pretinieki viņu slēpnī neredz, kamēr nav tuvu.
Object.assign(T.lv,{snp_new:'🔭 Tavai armijai ir snaiperis: {n}. Viņš slēpjas un šauj no tālienes.',r_snp:'📻 {n}: redzu pretinieka snaiperi! Skaties kartē 🔭'});
Object.assign(T.en,{snp_new:'🔭 Your army has a sniper: {n}. He hides and shoots from afar.',r_snp:'📻 {n}: I see the enemy sniper! Check the map 🔭'});
// maskēšanās raksts (zaļi brūni plankumi, krāsa nāk no materiāla)
const CAMO_TX=cvTex((g)=>{g.fillStyle='#6f7d47';g.fillRect(0,0,64,64);const C=['#4b5a2c','#8b7b4b','#38402a','#5e6b35','#9a8d5c'];
 for(let i=0;i<46;i++){g.fillStyle=C[i%C.length];const x=Math.random()*64,y=Math.random()*64,w=4+Math.random()*12,h=3+Math.random()*8;g.beginPath();g.ellipse(x,y,w/2,h/2,Math.random()*3,0,6.283);g.fill();}
 g.fillStyle='rgba(30,40,20,.5)';for(let i=0;i<70;i++)g.fillRect(Math.random()*64,Math.random()*64,2,4);});
function snpDress(g,col){const ch=g.children,tint=new THREE.Color(0xffffff).lerp(new THREE.Color(col),.28);
 for(const i of [0,2,3,4,5,6]){const m=ch[i]&&ch[i].material;if(!m||Array.isArray(m))continue;m.map=CAMO_TX;m.color.copy(i===0||i>4?tint:new THREE.Color(0xffffff));m.needsUpdate=true;}
 const gn=ch[7];if(gn)gn.scale.z=1.9;}
const SNPN=new Set();let snpT=0,snpNetT=0;
const snpOn=b=>b&&b.snp&&!b.dead&&isWar()&&NET.role!=='guest';
// ---------- izvēle: katrai armijai viens (arī pēc nāves nākamais) ----------
function snpPick(){for(const T of ARMY){if(humans.some(b=>b.snp&&!b.dead&&b.team===T))continue;const B=WB[ARMY.indexOf(T)];
  const L=humans.filter(b=>b.team===T&&!b.dead&&!b.inside&&!b.trader&&!b.jet&&!b.heli&&!b.para&&!b.tankV&&!b.jetGoal&&!b.heliGoal&&!b.tankGoal&&!b.gen&&!b.pil&&!b.ord&&b.wrole!=='esc');
  if(!L.length)continue;L.sort((a,c)=>Math.hypot(a.g.position.x-B.x,a.g.position.z-B.z)-Math.hypot(c.g.position.x-B.x,c.g.position.z-B.z));snpMake(L[0]);}}
function snpMake(b){b.snp=true;b.snHide=null;b.snShots=0;b.snCd=0;b.snTg=null;b.wrole='snp';b.sq=null;b.qGoal=null;for(const S of SQ)S.mem=S.mem.filter(q=>q!==b);
 b.I.has.snip=true;b.I.ammo.snip=Math.max(b.I.ammo.snip||0,40);for(const k of ['ak','m16','shot']){b.I.has[k]=false;b.I.ammo[k]=0;}b.I.has.pistol=true;b.I.ammo.pistol=Math.max(b.I.ammo.pistol||0,30); // otrais ierocis: pistole
 snpDress(b.g,b.team.color);relabel(b);if(b.team===PT&&active)say(tf('snp_new',{n:b.name}),4);}
// ---------- slēpnis: starp savu bāzi un pretinieku, zālē vai aiz seguma, ar skatu uz kontrolpunktu ----------
function snpHide(b){const i=ARMY.indexOf(b.team),B=WB[i],E=WB[1-i],L=Math.hypot(E.x-B.x,E.z-B.z),ux=(E.x-B.x)/L,uz=(E.z-B.z)/L,old=b.snHide;let best=null,bs=-1e9;
 for(let k=0;k<44;k++){const f=.24+Math.random()*.3,s=(Math.random()-.5)*150,x=B.x+ux*L*f-uz*s,z=B.z+uz*L*f+ux*s;
  if(Math.abs(x)>EDGE-12||Math.abs(z)>EDGE-12||wallAt(x,z,1)||wallAt(x,z,.3))continue;
  if(WMAP==='ozo'){const[u,v]=ozUV(x,z);if(Math.abs(u-ozRiv(v))<10)continue;}
  if(old&&Math.hypot(x-old.x,z-old.z)<25)continue;
  let cov=0;for(let a=0;a<8;a++)if(wallAt(x+Math.cos(a*.785)*2.2,z+Math.sin(a*.785)*2.2,1))cov++;if(cov>5)continue;
  let sc=Math.min(cov,3)*1.5+Math.random()*2+(inGrass(x,z)?4:0),see=false;const P={x,z};
  for(const c of CP){const d=Math.hypot(c.x-x,c.z-z);if(d>40&&d<110&&!blockedLine(P,c,1.3)){see=true;break;}}
  if(!see&&!CP.length&&!blockedLine(P,{x:x+ux*70,z:z+uz*70},1.3))see=true;if(see)sc+=3;
  if(sc>bs){bs=sc;best=P;}}
 b.snHide=best||{x:B.x+ux*60,z:B.z+uz*60};b.snShots=0;b.snAt=0;}
// redzams mērķis: pretinieks 15-118 m, nav dūmos/zālē, skats brīvs (pārbauda tikai 4 tuvākos, telefonam)
function snpTarget(b){const p=b.g.position,Tm=b.team,C=[];
 for(const h of HL){if(h.team===Tm||!Tm.enemies.has(h.team)||(h.b&&(h.b.dead||h.b.inside)))continue;const d=Math.hypot(h.p.x-p.x,h.p.z-p.z);if(d<15||d>118)continue;if(typeof hiddenFrom==='function'&&hiddenFrom(p,h))continue;C.push([d,h]);}
 C.sort((a,c)=>a[0]-c[0]);for(const[,h]of C.slice(0,4))if(!losPoint(p.x,1.5,p.z,h.p.x,(h.y||0)+1.2,h.p.z,Tm))return h;return null;}
function snpFire(b,h){const p=b.g.position,W=WP.snip,a=Math.atan2(h.p.x-p.x,h.p.z-p.z)+(Math.random()-.5)*.028,n0=bullets.length;
 spawnBullet(p.x+Math.sin(a)*.8,1.2,p.z+Math.cos(a)*.8,Math.sin(a),Math.cos(a),W,b.team,false);
 for(let i=n0;i<bullets.length;i++){const q=bullets[i];q.dmg=95;q.vx=Math.sin(a)*75;q.vz=Math.cos(a)*75;q.life=1.65;if((h.y||0)>3)q.hy=true;} // 75 m/s: pie 30 kadriem apakšsolis 0,6 m, lode nepārlec pāri cilvēkam
 b.I.ammo.snip--;b.shT=gtime;b.snLast={k:h.b||'P',t:gtime};b.snShots++;b.snCd=gtime+3.2+Math.random()*1.5;muzzle(p.x+Math.sin(a)*.9,1.3,p.z+Math.cos(a)*.9,W);sfxAt('ally',p.x,p.z,90);}
const _botThink60=botThink;botThink=function(b){
 if(!snpOn(b)||b.jet||b.heli||b.para||b.tankV||b.tankGoal||b.jetGoal||b.heliGoal||b.aaGoal||b.ord||warWait()){if(b.snp)b.snAim=null;return _botThink60(b);}
 const p=b.g.position;b.qGoal=null;if(b.sq){for(const S of SQ)S.mem=S.mem.filter(q=>q!==b);b.sq=null;}
 if(b.snHp!=null&&b.hp<b.snHp-5)b.snHide=null;b.snHp=b.hp; // trāpīja: maina vietu
 const L=b.snLast;if(L&&gtime-L.t<4&&(L.k==='P'?!active||health<=0:L.k.dead)){b.snHide=null;b.snLast=null;} // novāca: maina vietu
 const th=nearestThreat(b);
 if((th&&th.ed<22)||!(b.I.ammo.snip>0)){b.snAim=null;b.snIn=false;return _botThink60(b);}
 if(!b.snHide||b.snShots>=3||(b.snAt&&gtime-b.snAt>50))snpHide(b);
 const H=b.snHide,d=Math.hypot(H.x-p.x,H.z-p.z);
 if(d>2){b.snIn=false;b.snAim=null;b.tg=null;b.follow=false;goal(b,H.x,H.z,false);return;}
 if(!b.snIn){b.snIn=true;b.snAt=gtime;}
 b.gx=null;b.tg=null;b.follow=false;b.w='snip';
 const h=snpTarget(b),k=h&&(h.b||'P'); // HL ieraksti katrā kadrā jauni, tāpēc salīdzina pēc cilvēka
 if(!h){b.snAim=null;b.snTg=null;b.snK=null;return;}
 if(k!==b.snK||!b.snAim){b.snK=k;b.snAim=gtime+1.3;}b.snTg=h;};
const _botMove60=botMove;botMove=function(b,dt,i){_botMove60(b,dt,i);if(!b.snp||b.dead)return;
 const g=b.g,low=b.snIn&&snpOn(b);g.scale.y=low?.72:1;if(!low)return;const h=b.snTg;
 if(h&&b.snAim){g.rotation.y=Math.atan2(-(h.p.x-g.position.x),-(h.p.z-g.position.z));if(gtime>=b.snAim&&gtime>=b.snCd&&b.I.ammo.snip>0){if(valid(h)&&!losPoint(g.position.x,1.5,g.position.z,h.p.x,(h.y||0)+1.2,h.p.z,b.team))snpFire(b,h);else{b.snAim=null;b.snTg=null;}}}
 // pretinieka snaiperis slēpnī: bez vārda un dzīvības joslas, kamēr nav tuvu vai nesen šāvis
 if(PT&&PT.enemies.has(b.team)){const near=Math.hypot(g.position.x-player.position.x,g.position.z-player.position.z)<14,shot=b.shT&&gtime-b.shT<2.5;if(!near&&!shot)b.lab.visible=b.bar.bg.visible=b.bar.f.visible=false;}};
// pretinieku boti slēpnī tupošu snaiperi neredz tālāk par 12 m, ja viņš nav šāvis pēdējās 3 s
const _nearestThreat60=nearestThreat;nearestThreat=function(b){if(!isWar())return _nearestThreat60(b);const p=b.g.position,hid=[];
 for(let i=HL.length-1;i>=0;i--){const h=HL[i],s=h.b;if(!s||!s.snp||!s.snIn||h.team===b.team)continue;if(Math.hypot(h.p.x-p.x,h.p.z-p.z)>12&&!(s.shT&&gtime-s.shT<3)){hid.push(h);HL.splice(i,1);}}
 try{return _nearestThreat60(b);}finally{for(const h of hid)HL.push(h);}};
let snpLab=false;const _mkLabel60=mkLabel;mkLabel=function(txt,col){return _mkLabel60(snpLab?txt.replace(/^(★ |⚔️ )?/,'$1🔭 '):txt,col);};
const _relabel60=relabel;relabel=function(b){snpLab=!!b.snp;try{_relabel60(b);}finally{snpLab=false;}};
const _killBot60=killBot;killBot=function(b,src){if(b&&b.snp)b.g.scale.y=1;return _killBot60(b,src);};
// ---------- pamanīšana: tikai ar redzamību (trāpījums pats par sevi snaiperi neatklāj), tad 20 s mirgo komandas kartē ----------
const SNSP=[[],[]];
function snpSeen(o,s){const a=o.g.position,b=s.g.position,d=Math.hypot(b.x-a.x,b.z-a.z);if(d>60)return false;
 const fx=-Math.sin(o.g.rotation.y),fz=-Math.cos(o.g.rotation.y),fc=((b.x-a.x)*fx+(b.z-a.z)*fz)/(d||1),shot=s.shT&&gtime-s.shT<3;
 let ok;if(!s.snIn)ok=d<45&&fc>.35;else if(d<(inGrass(b.x,b.z)?9:12))ok=true;else ok=shot&&fc>.7&&Math.random()<.35; // šāviena uzliesmojums, ja skatās uz to pusi
 return ok&&!blockedLine(a,b,1.1)&&!smokeCut(a.x,a.z,b.x,b.z);}
function snpSpotTick(){for(const s of humans){if(!s.snp||s.dead||s.inside)continue;const si=ARMY.indexOf(s.team),E=ARMY[1-si];if(!E)continue;const sp=s.g.position;
  const L=humans.filter(o=>o.team===E&&!o.dead&&!o.inside&&!o.jet&&!o.heli&&Math.hypot(o.g.position.x-sp.x,o.g.position.z-sp.z)<60).sort((a,c)=>Math.hypot(a.g.position.x-sp.x,a.g.position.z-sp.z)-Math.hypot(c.g.position.x-sp.x,c.g.position.z-sp.z)).slice(0,6);
  for(const o of L)if(snpSeen(o,s)){if(s.snIn)s.snHide=null; // atklāts: maina vietu
   const M=SNSP[1-si],m=M.find(q=>q.id===s.nid);if(m){m.x=sp.x;m.z=sp.z;m.t=gtime;}else M.push({id:s.nid,x:sp.x,z:sp.z,t:gtime});if(rcd('snp'+(1-si),20))radio(E,'r_snp',{n:o.name});break;}}
 for(const M of SNSP)for(let i=M.length-1;i>=0;i--)if(gtime-M[i].t>20)M.splice(i,1);}
// parastā izlūkošana slēpnī tupošo snaiperi neatzīmē (tikai SNSP)
const _spotTick60=spotTick;spotTick=function(){const hid=[];for(let i=HL.length-1;i>=0;i--){const h=HL[i];if(h.b&&h.b.snp&&h.b.snIn){hid.push(h);HL.splice(i,1);}}try{return _spotTick60();}finally{for(const h of hid)HL.push(h);}};
const _drawMap60=drawMap;drawMap=function(){_drawMap60();if(!isWar())return;const M=SNSP[NET.role==='guest'?MYSIDE:ARMY.indexOf(PT)];if(!M||!M.length||Math.floor(gtime*4)%2)return;
 const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R;
 for(const m of M){const x=W/2+(m.x-cx)*sc,y=W/2+(m.z-cz)*sc;g.strokeStyle='#ff1744';g.lineWidth=2;g.beginPath();g.arc(x,y,7,0,6.283);g.moveTo(x-10,y);g.lineTo(x+10,y);g.moveTo(x,y-10);g.lineTo(x,y+10);g.stroke();}};
// draugiem: kuri boti ir snaiperi (tērps)
const _netExtraEv260=netExtraEv2;netExtraEv2=function(e){if(e.e==='snp'){SNPN.clear();for(const n of e.i||[])SNPN.add(n);for(let k=0;k<2;k++)SNSP[k]=(e.m&&e.m[k]||[]).map(([x,z,a])=>({x,z,t:gtime-a}));return;}_netExtraEv260(e);};
const _updateFx60=updateFx;updateFx=function(dt){_updateFx60(dt);if(!isWar()){SNPN.clear();return;}
 if(NET.role==='guest'){for(const[id,o]of netBot)if(SNPN.has(id)&&!o.snp){o.snp=1;snpDress(o.g,o.col);}return;}
 snpT-=dt;if(snpT<=0){snpT=.5;if(!warWait()){snpPick();snpSpotTick();}}
 if(NET.role==='host'&&NET.guests.size){snpNetT-=dt;if(snpNetT<=0){snpNetT=1;netQ.push({e:'snp',i:humans.filter(b=>b.snp&&!b.dead).map(b=>b.nid),m:SNSP.map(M=>M.map(m=>[Math.round(m.x),Math.round(m.z),Math.round(gtime-m.t)]))});}}};
