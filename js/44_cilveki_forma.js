// 44_cilveki_forma.js - Izteiktāki cilvēki (seja, krekls ar kabatām un jostu, bikses ar zābakiem; tekstūras, ne jauni kluči, lai telefons nepalēninās)
// un karā visiem vienas armijas cilvēkiem armijas forma, kas mainās ar pakāpi (kareivis -> seržants -> virsnieks -> ģenerālis)
function cvTex(draw,w,h){const c=document.createElement('canvas');c.width=w||64;c.height=h||64;draw(c.getContext('2d'),c.width,c.height);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearMipmapLinearFilter;return t;}
// seja: balts fons (galvas krāsa nāk no materiāla), acis, uzacis, deguns, mute
const FACE_TX=cvTex((g)=>{g.fillStyle='#fff';g.fillRect(0,0,64,64);
 g.fillStyle='#f4f4f4';g.fillRect(12,27,15,9);g.fillRect(37,27,15,9);g.fillStyle='#1b1b1b';g.fillRect(18,28,7,8);g.fillRect(41,28,7,8);g.fillStyle='#fff';g.fillRect(19,29,2,2);g.fillRect(42,29,2,2);
 g.fillStyle='#3a2a20';g.fillRect(11,21,16,4);g.fillRect(37,21,16,4);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(29,33,6,10);
 g.fillStyle='#6b2f2f';g.fillRect(23,47,18,4);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(0,58,64,6);});
// krekls/forma: apkakle, pogas, divas krūšu kabatas, josta ar sprādzi (pelēktoņos, krāsa nāk no materiāla)
const SHIRT_TX=cvTex((g)=>{g.fillStyle='#fff';g.fillRect(0,0,64,64);g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.moveTo(22,0);g.lineTo(32,12);g.lineTo(42,0);g.fill();
 g.fillStyle='rgba(0,0,0,.28)';for(let y=16;y<50;y+=8)g.fillRect(31,y,3,3);g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=2;g.strokeRect(9,17,15,12);g.strokeRect(40,17,15,12);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(9,17,15,4);g.fillRect(40,17,15,4);
 g.fillStyle='#2a2a2a';g.fillRect(0,54,64,8);g.fillStyle='#c9b25a';g.fillRect(28,54,8,8);g.fillStyle='rgba(0,0,0,.12)';g.fillRect(0,0,3,64);g.fillRect(61,0,3,64);});
// piedurkne ar aproci
const SLEEVE_TX=cvTex((g)=>{g.fillStyle='#fff';g.fillRect(0,0,64,64);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,52,64,12);g.fillStyle='rgba(0,0,0,.1)';g.fillRect(0,0,64,6);});
// bikses: ceļgala vīle, apakšā tumši zābaki ar šņorēm
const PANTS_TX=cvTex((g)=>{g.fillStyle='#fff';g.fillRect(0,0,64,64);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,26,64,3);g.fillStyle='#161616';g.fillRect(0,48,64,16);g.fillStyle='#3a3a3a';for(let y=50;y<62;y+=4)g.fillRect(24,y,16,1);});
// galvas kastē seja tikai priekšpusē (-z), pārējās puses ņem tīru tekstūras stūri
function faceUV(geo){const uv=geo.attributes.uv;for(let i=0;i<20;i++)uv.setXY(i,.03,.97);uv.needsUpdate=true;}
function mapOn(mesh,tx){const m=mesh&&mesh.material;if(!m||Array.isArray(m))return;m.map=tx;m.needsUpdate=true;}
function detailHuman(g,o){if(!g||g.userData.det)return;g.userData.det=1;const ch=g.children;
 const head=ch[o.head];if(head){faceUV(head.geometry);mapOn(head,FACE_TX);}
 if(ch[o.torso])mapOn(ch[o.torso],SHIRT_TX);for(const i of o.arms||[])mapOn(ch[i],SLEEVE_TX);for(const i of o.legs||[])mapOn(ch[i],PANTS_TX);}
// boti: [0] krekls, [1] galva, [3,4] kājas, [5,6] rokas
const _buildBot44=buildBot;buildBot=function(col,helmet){const r=_buildBot44(col,helmet);try{detailHuman(r.g,{torso:0,head:1,legs:[3,4],arms:[5,6]});}catch(e){}return r;};
// draugi: [0] krekls, [1] galva, [3,4] kājas, [5,6] rokas
const _avatarMesh44=avatarMesh;avatarMesh=function(col){const g=_avatarMesh44(col);try{detailHuman(g,{torso:0,head:1,legs:[3,4],arms:[5,6]});}catch(e){}return g;};
// spēlētājs: [0] krekls, [2] galva, [4,5] kājas (rokas ir ādas krāsā, tām tekstūru neliek)
try{detailHuman(player,{torso:0,head:2,legs:[4,5]});}catch(e){}
// ---------- karā armijas forma visiem cilvēkiem, mainās ar pakāpi ----------
const ARMY_COL=[0xd32f2f,0x2e7d32];
// pakāpes formas: 0-1 kareivis (armijas krāsa + ķivere), 2-3 seržants (tumšāka + veste), 4-5 virsnieks (tumša jaka), 6-7 augstākais virsnieks, 8 ģenerālis (parādes forma)
function uniformOf(side,r){const base=new THREE.Color(ARMY_COL[side]);
 if(r>=8)return{t:new THREE.Color(0x1a1a24),c:base.clone().lerp(new THREE.Color(0xffffff),.1)};
 if(r>=6)return{t:base.clone().multiplyScalar(.45),c:new THREE.Color(0xffc107)};
 if(r>=4)return{t:base.clone().multiplyScalar(.6),c:base.clone().multiplyScalar(.9)};
 if(r>=2)return{t:base.clone().multiplyScalar(.78),c:new THREE.Color(0x4b5320)};
 return{t:base,c:base.clone().multiplyScalar(.82)};}
const _lookArr44=lookArr;lookArr=function(){const a=_lookArr44();while(a.length<5)a.push('');a[5]=isWar()?'s'+MYSIDE:'';return a;};
const _dressMesh44=dressMesh;dressMesh=function(m,a,isP){_dressMesh44(m,a,isP);if(!m||!a||!a[5]||String(a[5])[0]!=='s')return;
 const side=+String(a[5]).slice(1)?1:0,r=a[4]?+String(a[4]).slice(1)||0:0,U=uniformOf(side,r),ch=m.children;
 const set=(o,c)=>{if(o&&o.material&&o.material.color)o.material.color.copy(c);};
 if(isP){set(ch[0],U.t);set(ch[1],U.c);}else{set(ch[0],U.t);set(ch[5],U.t);set(ch[6],U.t);}
 const acc=m.userData.acc;if(!acc)return;
 // kareivim ķivere (ja nav savas cepures un pakāpes cepures)
 if(r<2&&(a[1]==='h0'||!a[1])){const h=cube(.54,.2,.52,0x39482b,.8);h.position.y=2.05;acc.add(h);}
 // seržantam un augstāk: veste priekšā
 if(r>=2&&r<8){const v=cube(.74,.5,.06,r>=4?0x263238:0x4b5320,.9);v.position.set(0,1.2,-.2);acc.add(v);}
 m.userData.apk=a.join();};
// pēc kara un pēc pakāpes maiņas formu uzvelk no jauna
let wearSide44=-2;
const _updateFx44=updateFx;updateFx=function(dt){_updateFx44(dt);const s=isWar()&&active?MYSIDE:-1;if(s!==wearSide44&&player){wearSide44=s;try{wearLook();}catch(e){}}};
