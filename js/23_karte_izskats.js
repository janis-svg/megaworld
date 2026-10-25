// 23_karte_izskats.js - Minikarte stūrī (uzspiežot pietuvina) un tēla izskats: krāsa, cepure, mugursoma (par monētām; draugi to redz)
Object.assign(T.lv,{look:'Izskats',lcol:'Krāsa',lhat:'Cepure',lbag:'Mugurā',wear:'Uzvilkt',worn:'Uzvilkts',
 l_c0:'Standarta',l_c1:'Sarkana',l_c2:'Zaļa',l_c3:'Dzeltena',l_c4:'Violeta',l_c5:'Rozā',l_c6:'Melna',l_c7:'Oranža',l_h0:'Bez cepures',l_cap:'Kepons',l_cowboy:'Kovboja cepure',l_wizard:'Burvja cepure',l_crown:'Kronis',l_b0:'Nekas',l_bag:'Mugursoma',l_cape:'Supervaroņa apmetnis'});
Object.assign(T.en,{look:'Look',lcol:'Colour',lhat:'Hat',lbag:'On the back',wear:'Wear',worn:'Wearing',
 l_c0:'Default',l_c1:'Red',l_c2:'Green',l_c3:'Yellow',l_c4:'Purple',l_c5:'Pink',l_c6:'Black',l_c7:'Orange',l_h0:'No hat',l_cap:'Cap',l_cowboy:'Cowboy hat',l_wizard:'Wizard hat',l_crown:'Crown',l_b0:'Nothing',l_bag:'Backpack',l_cape:'Superhero cape'});
// ---------- minikarte ----------
// karti var aizvērt (✖): tad paliek tikai 🗺️ poga, ar kuru to atver atkal
const mmW=document.createElement('div');mmW.id='mmwrap';document.body.appendChild(mmW);
const mm=document.createElement('canvas');mm.id='mmap';mmW.appendChild(mm);let mmZoom=0,mmT=0,mmOff=!!LS.get('mmoff',false);
const mmX=document.createElement('button');mmX.id='mmx';mmX.textContent='✖';mmW.appendChild(mmX);
const mmO=document.createElement('button');mmO.id='mmo';mmO.className='corner';mmO.textContent='🗺️';mmW.appendChild(mmO);
function mmShow(){mm.style.display=mmX.style.display=mmOff?'none':'block';mmO.style.display=mmOff?'block':'none';}mmShow();
mmX.onpointerdown=e=>{e.stopPropagation();e.preventDefault();mmOff=true;LS.set('mmoff',true);mmShow();};
mmO.onpointerdown=e=>{e.stopPropagation();e.preventDefault();mmOff=false;LS.set('mmoff',false);mmShow();mmT=0;};
mm.onpointerdown=e=>{e.stopPropagation();e.preventDefault();mmZoom=1-mmZoom;mmT=0;};
const hex=c=>'#'+new THREE.Color(c).getHexString();
function drawMap(){
 const S=TOUCH?116:170;if(mm.width!==S*2){mm.width=mm.height=S*2;mm.style.width=mm.style.height=S+'px';}
 const g=mm.getContext('2d'),W=mm.width,R=mmZoom?70:EDGE,cx=mmZoom?player.position.x:0,cz=mmZoom?player.position.z:0,sc=W/2/R;
 const X=x=>W/2+(x-cx)*sc,Y=z=>W/2+(z-cz)*sc,emo=(s,x,z,k)=>{g.font=Math.round(W*(k||.075))+'px serif';g.fillText(s,X(x),Y(z));};
 g.fillStyle='#1f3a22';g.fillRect(0,0,W,W);g.fillStyle='#4a5258';g.fillRect(X(-CITY),Y(-CITY),2*CITY*sc,2*CITY*sc);
 g.strokeStyle='#2b2e30';g.lineWidth=Math.max(1.5,8*sc);g.beginPath();for(let k=-4;k<4;k++){const r=k*40+20;g.moveTo(X(r),Y(-CITY));g.lineTo(X(r),Y(CITY));g.moveTo(X(-CITY),Y(r));g.lineTo(X(CITY),Y(r));}g.stroke();
 g.textAlign='center';g.textBaseline='middle';
 for(const H of HOUSES){const mine=H.on==='★'&&!H.free;if(mine)continue;g.fillStyle=H.free||H.col==null?'#e8e8e8':hex(H.col);const s=Math.max(3,6*sc);g.fillRect(X(H.x)-s/2,Y(H.z)-s/2,s,s);}
 if(!(typeof isWar==='function'&&isWar()))for(const d of TRADER_DEF)emo('🛒',d[1],d[2]);
 if(typeof TRAVEL!=='undefined'&&TRAVEL.on)emo('🐪',TRAVEL.x,TRAVEL.z,.09);
 const tk=NET.role==='guest'?[...netTk.values()].filter(o=>!o.dead).map(o=>o.g.position):tanks.filter(x=>!x.dead).map(x=>x.g.position);for(const p of tk)emo('🚜',p.x,p.z,.06);
 const myH=HOUSES.find(H=>H.on==='★'&&!H.free);if(myH)emo('🏠',myH.x,myH.z,.1);
 const boss=NET.role==='guest'?[...netMon.values()].filter(o=>o.z.userData.max>=1500).map(o=>o.z.position):zombies.filter(z=>z.userData.boss&&!z.userData.dead).map(z=>z.position);for(const p of boss)emo('👹',p.x,p.z,.1);
 const dot=(x,z,c,r)=>{g.fillStyle=c;g.beginPath();g.arc(X(x),Y(z),r,0,6.283);g.fill();g.strokeStyle='#fff';g.lineWidth=1.5;g.stroke();};
 if(NET.role==='guest'){for(const o of netBot.values())if(o.rel===1)dot(o.g.position.x,o.g.position.z,'#5dade2',3);for(const [id,o] of netPl)if(!o.dead)dot(o.g.position.x,o.g.position.z,'#ffd54f',5);}
 else{for(const m of PT.members)dot(m.g.position.x,m.g.position.z,'#5dade2',3);for(const G of NET.guests.values())if(G.ready&&!G.dead)dot(G.pos.x,G.pos.z,hex(G.col),5);}
 const px=X(player.position.x),pz=Y(player.position.z),a=yaw;g.save();g.translate(px,pz);g.rotate(-a);g.fillStyle='#ffeb3b';g.strokeStyle='#000';g.lineWidth=2;g.beginPath();g.moveTo(0,-W*.045);g.lineTo(W*.03,W*.03);g.lineTo(-W*.03,W*.03);g.closePath();g.fill();g.stroke();g.restore();
}
// ---------- tēla izskats ----------
const LOOKS={col:[['c0',0,0],['c1',0xc0392b,5],['c2',0x27ae60,5],['c3',0xf1c40f,5],['c4',0x8e44ad,5],['c5',0xff7aa2,5],['c6',0x2d2d2d,5],['c7',0xff8f00,5]],
 hat:[['h0',0,0],['cap',0xd32f2f,15],['cowboy',0x8d6e63,25],['wizard',0x5e35b1,30],['crown',0xffc107,50]],bag:[['b0',0,0],['bag',0x6d4c41,20],['cape',0xc62828,35]]};
const LKEY={col:'c',hat:'h',bag:'b'},LPRICE={};for(const s in LOOKS)for(const [k,,p] of LOOKS[s])LPRICE[k]=p;
let LOOK=LS.get('look',null);if(!LOOK||!LOOK.own)LOOK={own:['c0','h0','b0'],c:'c0',h:'h0',b:'b0'};
const apOf=new Map(); // spēlētāja id -> [krāsa, cepure, mugura]
function lookArr(){return[LOOK.c,LOOK.h,LOOK.b];}
function dressMesh(m,a,isP){if(!m||!a)return;const ud=m.userData;const parts=isP?[m.children[0],m.children[1]]:[m.children[0],m.children[5],m.children[6]];
 if(ud.baseCol===undefined)ud.baseCol=parts.map(p=>p.material.color.getHex());
 const c=(LOOKS.col.find(x=>x[0]===a[0])||[])[1];parts.forEach((p,i)=>p.material.color.setHex(a[0]!=='c0'&&c!==undefined?(i&&isP?new THREE.Color(c).lerp(new THREE.Color(0xffffff),.2).getHex():c):ud.baseCol[i]));
 if(ud.acc){m.remove(ud.acc);freeObj(ud.acc);}const acc=new THREE.Group();ud.acc=acc;m.add(acc);
 const hc=(LOOKS.hat.find(x=>x[0]===a[1])||[])[1];
 if(a[1]==='cap'){const t1=cube(.5,.12,.48,hc,.8);t1.position.y=2.08;const v=cube(.32,.04,.22,hc,.8);v.position.set(0,2.04,-.33);acc.add(t1,v);}
 else if(a[1]==='cowboy'){const br=cube(.95,.05,.95,hc,.9);br.position.y=2.06;const tp=cube(.46,.28,.44,hc,.9);tp.position.y=2.22;acc.add(br,tp);}
 else if(a[1]==='wizard'){const w=new THREE.Mesh(new THREE.ConeGeometry(.33,.8,8),mat(hc,.8));w.position.y=2.42;acc.add(w);}
 else if(a[1]==='crown'){const cr=cube(.5,.16,.48,hc,.3);cr.material.metalness=.7;cr.position.y=2.12;acc.add(cr);for(const [x,z] of [[-.2,-.19],[.2,-.19],[-.2,.19],[.2,.19]]){const s=cube(.09,.14,.09,hc,.3);s.position.set(x,2.27,z);acc.add(s);}}
 const bc=(LOOKS.bag.find(x=>x[0]===a[2])||[])[1];
 if(a[2]==='bag'){const b=cube(.5,.56,.22,bc,.9);b.position.set(0,1.12,.3);acc.add(b);}
 else if(a[2]==='cape'){const cp=cube(.68,1.05,.05,bc,.8);cp.position.set(0,1.02,.22);cp.rotation.x=.12;acc.add(cp);}
 ud.apk=a.join();}
function wearLook(){LS.set('look',LOOK);dressMesh(player,lookArr(),true);
 if(NET.role==='guest')netSend({t:'ap',a:lookArr()});else{apOf.set(0,lookArr());if(NET.role==='host')netQ.push({e:'ap',id:0,a:lookArr()});}renderLook();}
function lookPick(k){const s=Object.keys(LOOKS).find(s=>LOOKS[s].some(x=>x[0]===k));if(!s)return;
 if(LOOK.own.includes(k)){LOOK[LKEY[s]]=k;wearLook();return;}const p=LPRICE[k];
 if(NET.role==='guest'){netSend({t:'lbuy',k});return;}
 if((PT.coins||0)<p){say(t('nocoins'),1.5);return;}PT.coins-=p;LOOK.own.push(k);LOOK[LKEY[s]]=k;sfx('pick');wearLook();renderInv();}
{const b=document.createElement('button');b.className='corner';b.id='lookb';b.textContent='👕';$('cfg').before(b);b.onclick=e=>{const el=$('look'),on=el.style.display!=='block';el.style.display=on?'block':'none';if(on){renderLook();$('inv').style.display='none';$('team').style.display='none';$('badges').style.display='none';}e.currentTarget.blur();};
 const p=document.createElement('div');p.id='look';p.className='panel';document.body.appendChild(p);}
function renderLook(){const el=$('look');if(!el||el.style.display!=='block')return;
 let h='<button class="corner" data-x="1" style="float:right;margin:0">✖</button><b>👕 '+t('look')+'</b> · 🪙 '+((PT&&PT.coins)||0);
 for(const s of ['col','hat','bag']){h+='<div style="margin-top:6px"><b>'+t('l'+s)+'</b></div>';
  for(const [k,c,p] of LOOKS[s]){const own=LOOK.own.includes(k),on=LOOK[LKEY[s]]===k;h+='<div class="row"><span>'+(s==='col'&&k!=='c0'?'<i class="sw" style="background:'+hex(c)+'"></i>':'')+t('l_'+k)+(own?'':' · '+p+' 🪙')+'</span><button class="corner'+(on?' on':'')+'" data-k="'+k+'">'+(on?t('worn'):own?t('wear'):t('buy'))+'</button></div>';}}
 el.innerHTML=h;el.querySelectorAll('button').forEach(b=>b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();if(b.dataset.x){el.style.display='none';return;}lookPick(b.dataset.k);});}
// spēles sākumā uzvelk savu izskatu
const _start6=start;start=function(){_start6();dressMesh(player,lookArr(),true);apOf.clear();apOf.set(0,lookArr());};
// ---------- kopīgā spēle: izskats redzams visiem ----------
const _netHostMsg6=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='ap'&&Array.isArray(d.a)){G.ap=d.a.slice(0,3).map(String);apOf.set(G.id,G.ap);dressMesh(G.mesh,G.ap,false);netQ.push({e:'ap',id:G.id,a:G.ap,o:G.id});return;}
 if(d&&G.ready&&d.t==='lbuy'){const p=LPRICE[d.k];if(p===undefined)return;if((PT.coins||0)<p){netTo(G,{t:'msg',s:t('nocoins'),d:1.5});return;}PT.coins-=p;netTo(G,{t:'lok',k:d.k});netMe(G);return;}
 _netHostMsg6(G,d);};
const _netWelcome6=netWelcome;netWelcome=function(G){_netWelcome6(G);netTo(G,{t:'aps',L:[...apOf]});};
const _netGuestMsg6=netGuestMsg;netGuestMsg=function(d){
 if(d&&d.t==='aps'){apOf.clear();for(const [id,a] of d.L)apOf.set(id,a);return;}
 if(d&&d.t==='lok'){const s=Object.keys(LOOKS).find(s=>LOOKS[s].some(x=>x[0]===d.k));if(s&&!LOOK.own.includes(d.k)){LOOK.own.push(d.k);LOOK[LKEY[s]]=d.k;sfx('pick');wearLook();}return;}
 _netGuestMsg6(d);if(d&&d.t==='wel'){player.userData.baseCol=undefined;dressMesh(player,lookArr(),true);netSend({t:'ap',a:lookArr()});}};
const _netExtraEv26=netExtraEv2;netExtraEv2=function(e){if(e.e==='ap'){apOf.set(e.id,e.a);return;}_netExtraEv26(e);};
// draugu tēli: uzvelk viņu izskatu, kad tas mainās; karte atjaunojas 4x sekundē
const _updateFx6=updateFx;updateFx=function(dt){_updateFx6(dt);
 if(NET.role==='guest'){for(const [id,o] of netPl){const a=apOf.get(id);if(a&&o.g.userData.apk!==a.join())dressMesh(o.g,a,false);}}
 mmT-=dt;if(mmT<=0){mmT=.25;mmW.style.display=active?'block':'none';if(active&&!mmOff)drawMap();}};
