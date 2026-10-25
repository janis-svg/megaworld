// 31_kara_vide.js - Kara vide: bez tirgotājiem un monētām, frontes līnija ar zigzaga tranšejām pilsētas vidū, nopostītas mājas un krāteri
// ---------- tirgotāju karā nav ----------
function removeTraders(){for(const tr of traders){scene.remove(tr.stall);freeObj(tr.stall);scene.remove(tr.house);freeObj(tr.house);remOb(tr.ob);const b=tr.b;
  if(b&&!b.dead){b.dead=true;scene.remove(b.g);freeObj(b.g);delBar(b.bar);delLabel(b.lab);const i=humans.indexOf(b);if(i>=0)humans.splice(i,1);const T=b.team,j=T.members.indexOf(b);if(j>=0)T.members.splice(j,1);const k=teams.indexOf(T);if(k>=0&&!T.members.length)teams.splice(k,1);}}
 traders.length=0;$('shop').style.display='none';}
const _spawnTraders17=spawnTraders;spawnTraders=function(withBots){if(isWar()){removeTraders();return;}_spawnTraders17(withBots);};
const _dropCoins17=dropCoins;dropCoins=function(x,z,n){if(isWar())return null;return _dropCoins17(x,z,n);};
// ---------- tranšejas: zigzaga uzbērums ar smilšu maisiem abās pusēs, starp tiem eja; uzbērums aizsedz no lodēm, pāri var pārlēkt ----------
const TRENCH=[];for(let k=-4;k<4;k++){const c=k*40+20;TRENCH.push([c,-c]);}
let TRG=null;const TROB=[];
function berm(g,x,z,w,d){const e=cube(w,1.05,d,0x5d4a32,1);e.position.set(x,.52,z);g.add(e);const sb=cube(w+.05,.28,d+.05,0x9e8a5a,1);sb.position.set(x,1.17,z);g.add(sb);TROB.push({x,z,hx:w/2,hz:d/2,y0:0,y1:1.3});}
function buildTrenches(){clearTrenches();const g=new THREE.Group();
 for(const [cx,cz] of TRENCH){const W=2.4;
  for(let s=-2;s<2;s++){const x=cx+s*4,z=cz-s*4; // pakāpieni pa diagonāli: 4 m gar x, tad 4 m gar z
   berm(g,x+2,z-W/2,4.4,.6);berm(g,x+2,z+W/2,4.4,.6);
   const fl=cube(4,.05,W-.6,0x3e2f22,1);fl.position.set(x+2,.03,z);fl.receiveShadow=true;g.add(fl);
   for(const px of [x+.3,x+3.7]){const p=cube(.12,1.6,.12,0x4e342e,1);p.position.set(px,.8,z-W/2-.8);g.add(p);}
   const wr=cube(4,.03,.03,0x9e9e9e,.5);wr.position.set(x+2,1.2,z-W/2-.8);g.add(wr);const wr2=wr.clone();wr2.position.y=.7;g.add(wr2);}
  const nest=cube(1.6,.5,1.6,0x9e8a5a,1);nest.position.set(cx+9,1.4,cz-9);g.add(nest);}
 g.updateMatrixWorld(true);mergeInto(g);scene.add(g);TRG=g;for(const o of TROB)addOb(o);}
function clearTrenches(){if(TRG){scene.remove(TRG);freeObj(TRG);TRG=null;}for(const o of TROB)remOb(o);TROB.length=0;}
// ---------- nopostītas mājas un krāteri (vienādi visiem, jo atkarīgi tikai no vietas) ----------
const hashStr=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h|0;};
function warRuin(ch,b){const R=rng(hashStr(b.id)),tall=b.kind==='tall';if(R()>(tall?.3:b.kind==='lm'?0:.5))return;
 if(b.g.parent)b.g.parent.remove(b.g);freeObj(b.g);for(const o of b.obs){remOb(o);o.dead=true;}for(const o of b.inter){o.r=0;o.open=true;o.loot=[];}b.burnt=true;b.ruin=true;
 const g=new THREE.Group(),col=tall?0x8a8d8f:[0x8d5a44,0x9e9a92,0x7d6b5a][Math.floor(R()*3)];
 const fl=cube(b.hx*2,.12,b.hz*2,0x2b2724,1);fl.position.set(b.x,.06,b.z);fl.castShadow=false;g.add(fl);
 const n=tall?6:4;for(let i=0;i<n;i++){const side=Math.floor(R()*4),along=(R()-.5)*1.6,ln=1.5+R()*(tall?5:3),h=.8+R()*(tall?7:3),ax=side<2;
  const x=ax?b.x+along*b.hx:b.x+(side===2?-1:1)*b.hx,z=ax?b.z+(side===0?-1:1)*b.hz:b.z+along*b.hz,w=ax?Math.min(ln,b.hx*2):.35,d=ax?.35:Math.min(ln,b.hz*2);
  const s=cube(w,h,d,col,1);s.position.set(x,h/2,z);g.add(s);const o={x,z,hx:w/2,hz:d/2,y0:0,y1:h};addOb(o);ch.obs.push(o);
  if(h>1.6&&R()<.6){const top=cube(w*.6,.4,d*.6,col,1);top.position.set(x+(R()-.5)*w*.3,h+.15,z+(R()-.5)*d*.3);top.rotation.z=(R()-.5)*.6;g.add(top);}}
 for(let i=0;i<(tall?14:8);i++){const s=.4+R()*(tall?1.6:.9),c=cube(s,s*.6,s,[0x6d6d6d,0x5d4037,0x424242,col][Math.floor(R()*4)],1);c.position.set(b.x+(R()-.5)*b.hx*1.6,s*.3,b.z+(R()-.5)*b.hz*1.6);c.rotation.set(R(),R()*3,R());g.add(c);}
 if(R()<.5){const sm=cube(.3,.3,.3,0x333333,1);sm.position.set(b.x,.2,b.z);g.add(sm);}
 g.updateMatrixWorld(true);mergeInto(g);ch.group.add(g);}
function warCraters(ch){const R=rng(hashStr(ch.key+'k'));const n=1+Math.floor(R()*3),[cx,cz]=ch.key.split(',').map(Number);
 for(let i=0;i<n;i++){const x=cx*CS+R()*CS,z=cz*CS+R()*CS,r=1.2+R()*1.8;const c=new THREE.Mesh(new THREE.CircleGeometry(r,14),new THREE.MeshStandardMaterial({color:0x1f1b18,roughness:1}));c.rotation.x=-Math.PI/2;c.position.set(x,.025,z);ch.group.add(c);
  for(let k=0;k<5;k++){const a=k*1.25+R(),q=cube(.3+R()*.4,.15,.3+R()*.4,0x4e4034,1);q.position.set(x+Math.cos(a)*r,.08,z+Math.sin(a)*r);ch.group.add(q);}}}
function warChunk(ch){if(!ch||ch.warDone)return;ch.warDone=true;for(const b of ch.blds||[])if(!b.burnt)warRuin(ch,b);const [cx,cz]=ch.key.split(',').map(Number);if(Math.max(Math.abs(cx*CS+20),Math.abs(cz*CS+20))<=CITY)warCraters(ch);}
const _genChunk17=genChunk;genChunk=function(cx,cz){_genChunk17(cx,cz);if(isWar())warChunk(chunks.get(cx+','+cz));};
// ---------- kara sākumā / beigās ----------
const _warSetup17=warSetup;warSetup=function(){_warSetup17();removeTraders();for(const d of [...drops])if(d.kind==='coin'){scene.remove(d.m);freeObj(d.m);drops.splice(drops.indexOf(d),1);}PT.coins=0;
 buildTrenches();for(const ch of chunks.values())warChunk(ch);};
const _warTeardown17=warTeardown;warTeardown=function(){_warTeardown17();clearTrenches();};
const _netGuestMsg17=netGuestMsg;netGuestMsg=function(d){_netGuestMsg17(d);if(d&&d.t==='mode'){if(isWar()){buildTrenches();removeTraders();}else clearTrenches();}if(d&&d.t==='wel'&&isWar()){for(const o of TROB){remOb(o);addOb(o);}removeTraders();}};
// minikartē: frontes līnija ar tranšejām
const _drawMap17=drawMap;drawMap=function(){_drawMap17();if(!isWar())return;const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R,X=x=>W/2+(x-cx)*sc,Y=z=>W/2+(z-cz)*sc;
 g.strokeStyle='#8d6e63';g.lineWidth=Math.max(2,3*sc);for(const [x,z] of TRENCH){g.beginPath();g.moveTo(X(x-8),Y(z+8));g.lineTo(X(x+8),Y(z-8));g.stroke();}};
