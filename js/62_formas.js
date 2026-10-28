// 62_formas.js - Karā visiem armijas formas (ne krekli): sarkanajiem tuksneša raksts, zaļajiem meža raksts, uz abām rokām spilgta armijas apsēja, cimdi.
// Boti: plankumains raksts, josta, uzšuves; galvā ķivere, ik ceturtajam Rambo apsējs; pakāpe (pēc nogalinātajiem) maina galvassegu un uzšuves.
// Cilvēki (spēlētājs, draugi): pikseļu raksts un taktiskā veste ar karodziņu, vestes krāsa mainās ar pakāpi (36. un 44. faila zīmes paliek).
// Tikai tekstūras un esošo kluču ģeometrija, bez jauniem mesh (telefonam).
const UPAL=[{b:'#a8916a',c:['#7d6646','#5f4d33','#c4ae80','#8a5a44']},{b:'#5a6a3a',c:['#424f2a','#76713f','#2f361d','#869060']}],UBAND=['#ff1f1f','#1fd43a'];
function camoDraw(g,side,pix){const P=UPAL[side];g.fillStyle=P.b;g.fillRect(0,0,64,64);let s=side*977+(pix?131:71);const R=()=>{s=(s*16807)%2147483647;return s/2147483647;};
 if(pix){for(let y=0;y<64;y+=4)for(let x=0;x<64;x+=4)if(R()<.45){g.fillStyle=P.c[Math.floor(R()*4)];g.fillRect(x,y,4,4);}}
 else for(let i=0;i<40;i++){g.fillStyle=P.c[i%4];g.beginPath();g.ellipse(R()*64,R()*64,3+R()*8,2+R()*5,R()*3,0,6.283);g.fill();}}
const UTX=new Map();function utx(key,fn){let t=UTX.get(key);if(!t){t=cvTex(fn);UTX.set(key,t);}return t;}
const uTier=r=>r>=7?3:r>=4?2:r>=2?1:0;
// pakāpes zīmes uz krūtīm: 1-3 uzšuves, virsniekiem zvaigznes
function insig(g,r,x,y){if(r>=1&&r<=3){g.strokeStyle='#ffd54f';g.lineWidth=2;for(let i=0;i<r;i++){g.beginPath();g.moveTo(x,y+i*4);g.lineTo(x+5,y+3+i*4);g.lineTo(x+10,y+i*4);g.stroke();}}
 else if(r>=4){g.fillStyle=r>=6?'#ffc107':'#cfd8dc';const n=Math.min(3,r>=8?3:r>=7?3:r-3);for(let i=0;i<n;i++){g.save();g.translate(x+2+i*5,y+3);g.rotate(.785);g.fillRect(-1.6,-1.6,3.2,3.2);g.restore();}if(r>=7){g.fillStyle='#ffc107';g.fillRect(x-2,y-6,16,2);}}}
const torsoTx=(side,r,hum)=>utx('t'+side+r+hum,g=>{camoDraw(g,side,hum);
 if(hum){g.fillStyle=['#4b5320','#6b5a3a','#263238','#151515'][uTier(r)];g.fillRect(8,6,48,46);g.fillStyle='rgba(0,0,0,.35)';for(const x of [12,27,42])g.fillRect(x,34,10,13);
  g.fillStyle='rgba(255,255,255,.12)';g.fillRect(8,6,48,2);g.fillStyle='#fff';g.fillRect(39,9,12,9);g.fillStyle=UBAND[side];g.fillRect(40,10,10,7);if(uTier(r)===3){g.fillStyle='#ffc107';g.fillRect(8,50,48,2);}insig(g,r,14,12);}
 else{g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=2;g.strokeRect(9,16,15,12);g.strokeRect(40,16,15,12);insig(g,r,11,8);}
 g.fillStyle='#2b2a22';g.fillRect(0,52,64,7);g.fillStyle='#9e9a6e';g.fillRect(28,52,8,7);});
const vestTx=(side,r)=>utx('v'+side+r,g=>{g.fillStyle=['#4b5320','#6b5a3a','#263238','#151515'][uTier(r)];g.fillRect(0,0,64,64);g.fillStyle='rgba(0,0,0,.35)';for(const x of [6,24,42])g.fillRect(x,30,14,26);
 g.fillStyle='#fff';g.fillRect(44,5,14,10);g.fillStyle=UBAND[side];g.fillRect(45,6,12,8);insig(g,r,8,8);if(uTier(r)===3){g.fillStyle='#ffc107';g.fillRect(0,0,64,3);}});
const armTx=(side,hum)=>utx('a'+side+hum,g=>{camoDraw(g,side,hum);g.fillStyle='#fff';g.fillRect(0,5,64,20);g.fillStyle=UBAND[side];g.fillRect(0,7,64,16);g.fillStyle='#1c1c1c';g.fillRect(0,52,64,12);});
const legTx=(side,hum)=>utx('l'+side+hum,g=>{camoDraw(g,side,hum);g.fillStyle=hum?'#2e2e2a':'rgba(0,0,0,.2)';g.fillRect(0,25,64,hum?8:3);g.fillStyle='#161616';g.fillRect(0,48,64,16);g.fillStyle='#3a3a3a';for(let y=50;y<62;y+=4)g.fillRect(24,y,16,1);});
const helmTx=side=>utx('h'+side,g=>{camoDraw(g,side,false);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,46,64,6);});
const bandTx=()=>utx('rb',g=>{g.fillStyle='#2b1c12';g.fillRect(0,0,64,64);g.fillStyle='#c62828';g.fillRect(0,30,64,30);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,30,64,3);});
const offTx=side=>utx('o'+side,g=>{g.fillStyle=side?'#1e3320':'#3a2620';g.fillRect(0,0,64,64);g.fillStyle='#ffc107';g.fillRect(0,40,64,8);});
// galvassega uz esošā matu/ķiveres kluča (bērns [2])
function botHead(h,side,kind){const tm=(c,map)=>{const m=mat(c,.85);if(map)m.map=map;return m;};
 const old=h.material;(Array.isArray(old)?old:[old]).forEach(m=>m.dispose());h.geometry.dispose();h.rotation.z=0;
 if(kind==='rambo'){h.geometry=new THREE.BoxGeometry(.49,.16,.47);const sd=tm(0xffffff,bandTx()),tp=tm(0x2b1c12);h.material=[sd,sd,tp,tp,sd,sd];h.position.y=1.95;}
 else if(kind==='cap'){h.geometry=new THREE.BoxGeometry(.53,.15,.51);h.material=tm(0xffffff,helmTx(side));h.position.y=2.03;}
 else if(kind==='beret'){h.geometry=new THREE.BoxGeometry(.5,.1,.48);h.material=tm(side?0x1b5e20:0x8e1b1b);h.position.y=2.02;h.rotation.z=.18;}
 else if(kind==='off'){h.geometry=new THREE.BoxGeometry(.56,.16,.56);h.material=tm(0xffffff,offTx(side));h.position.y=2.06;}
 else{h.geometry=new THREE.BoxGeometry(.55,.22,.53);h.material=tm(0xffffff,helmTx(side));h.position.y=2.03;}}
function dressBot(g,side,r,nid){const ch=g.children;if(!ch[6])return;const set=(o,tx)=>{const m=o&&o.material;if(!m||Array.isArray(m))return;m.map=tx;m.color.setHex(0xffffff);m.needsUpdate=true;};
 set(ch[0],torsoTx(side,r,false));set(ch[5],armTx(side,false));set(ch[6],armTx(side,false));set(ch[3],legTx(side,false));set(ch[4],legTx(side,false));
 const T=uTier(r);botHead(ch[2],side,nid%4===0?'rambo':['helm','cap','beret','off'][T]);g.userData.wr=r;}
const armySide=col=>col===0xd32f2f?0:col===0x2e7d32?1:-1;
const BRT=[0,1,2,4,6,9,12,16,20];
function botRank(b){const s=typeof WS!=='undefined'&&WS.get('B'+b.nid),k=s?s.k:0;let r=0;for(let i=0;i<BRT.length;i++)if(k>=BRT[i])r=i;return r;}
const _newBot62=newBot;newBot=function(Tm,x,z,name,I,helmet){const b=_newBot62(Tm,x,z,name,I,helmet);const s=isWar()?ARMY.indexOf(Tm):-1;if(s>=0&&!b.trader)try{dressBot(b.g,s,0,b.nid);}catch(e){}return b;};
// cilvēki: spēlētājs ([0] rumpis, [1] krūtis=veste, [4,5] kājas, [8,9] rokas) un draugi ([0] rumpis ar vesti, [3,4] kājas, [5,6] rokas)
const _dressMesh62=dressMesh;dressMesh=function(m,a,isP){_dressMesh62(m,a,isP);if(!m||!a)return;const ch=m.children,ud=m.userData,war=a[5]&&String(a[5])[0]==='s';
 const idx=isP?{t:0,v:1,l:[4,5],a:[8,9]}:{t:0,l:[3,4],a:[5,6]},all=[idx.t,...idx.l,...idx.a].concat(isP?[idx.v]:[]);
 if(!war){if(ud.wbase){all.forEach((i,k)=>{const q=ch[i]&&ch[i].material;if(!q)return;q.map=ud.wbase[k][0];q.color.setHex(ud.wbase[k][1]);q.needsUpdate=true;});ud.wbase=null;_dressMesh62(m,a,isP);}return;}
 if(!ud.wbase)ud.wbase=all.map(i=>{const q=ch[i]&&ch[i].material;return q?[q.map,q.color.getHex()]:[null,0xffffff];});
 const side=+String(a[5]).slice(1)?1:0,r=a[4]?+String(a[4]).slice(1)||0:0;
 const set=(i,tx)=>{const q=ch[i]&&ch[i].material;if(!q||Array.isArray(q))return;q.map=tx;q.color.setHex(0xffffff);q.needsUpdate=true;};
 set(idx.t,torsoTx(side,r,true));if(isP)set(idx.v,vestTx(side,r));idx.l.forEach(i=>set(i,legTx(side,true)));idx.a.forEach(i=>set(i,armTx(side,true)));};
// pakāpes maiņa botiem (saimnieks) un draugu ekrānā (ziņa brk)
const BRK=new Map();let brkT=0,brkNetT=0;
const _netExtraEv262=netExtraEv2;netExtraEv2=function(e){if(e.e==='brk'){BRK.clear();for(const[id,r]of e.L||[])BRK.set(id,r);return;}_netExtraEv262(e);};
const _updateFx62=updateFx;updateFx=function(dt){_updateFx62(dt);if(!isWar())return;brkT-=dt;if(brkT>0)return;brkT=1.5;
 if(NET.role==='guest'){for(const[id,o]of netBot){if(o.snp)continue;const s=armySide(o.col),r=BRK.get(id)||0;if(s<0||o.wr===r)continue;o.wr=r;try{dressBot(o.g,s,r,id);}catch(e){}}return;}
 const L=[];for(const b of humans){if(b.dead||b.snp||b.trader)continue;const s=ARMY.indexOf(b.team);if(s<0)continue;const r=botRank(b);if(r)L.push([b.nid,r]);if((b.g.userData.wr??-1)!==r)try{dressBot(b.g,s,r,b.nid);}catch(e){}}
 if(NET.role==='host'&&NET.guests.size){brkNetT-=1.5;if(brkNetT<=0){brkNetT=3;netQ.push({e:'brk',L});}}};
