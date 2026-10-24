// 20_saimnieciba.js - Raža un tirgus: āboli, olas, piens, sēnes, puķes; govis un cūkas; augi aug; suņa būda; cenas mainās
const PROD=['apple','egg','milk','mush','flower'],PRODIC={apple:'🍎',egg:'🥚',milk:'🥛',mush:'🍄',flower:'🌸'},SELL={apple:3,egg:2,milk:6,mush:5,flower:4};
const LIVE={chicken:{p:'egg',t:70},pig:{p:'mush',t:110},cow:{p:'milk',t:90}},LIVEK=['chicken','pig','cow'];
const prices={},doghouses=[];let growT=0;
// ---------- cenas: ko daudz pērk, tas kļūst dārgāks; ko daudz pārdod, par to maksā mazāk; katru rītu atgriežas ----------
function priceOf(k,kind){const it=(SHOPS[kind]||[]).find(s=>s[0]===k);return it?Math.max(1,Math.round(it[1]*(prices[k]||1))):0;}
function bumpPrice(k){prices[k]=Math.min(2,(prices[k]||1)*1.12);}
function sellPrice(k){return Math.max(1,Math.round((SELL[k]||1)*(prices['s_'+k]||1)));}
function trendIc(k){const m=prices[k]||1;return m>1.05?' ⬆':m<.95?' ⬇':'';}
function resetPrices(){for(const k in prices)delete prices[k];}
function sell(k,owner){const I=owner==='P'?inv:owner.I;I.prod=I.prod||{};if(!(I.prod[k]>0))return t('none');const p=sellPrice(k);I.prod[k]--;PT.coins=(PT.coins||0)+p;prices['s_'+k]=Math.max(.4,(prices['s_'+k]||1)*.93);sfx('pick');return t('sold')+' '+PRODIC[k]+' +'+p+' 🪙';}
const _dawn=dawn;dawn=function(){_dawn();for(const k in prices)prices[k]=1+(prices[k]-1)*.5;};
// ---------- modeļi ----------
function prodMesh(k){const g=new THREE.Group();
 if(k==='apple'){const a=cube(.25,.25,.25,0xd32f2f,.6),s=cube(.04,.1,.04,0x5d4037,1);s.position.y=.17;g.add(a,s);}
 else if(k==='egg'){const e=cube(.16,.22,.16,0xfff8e1,.5);g.add(e);}
 else if(k==='milk'){const b=cube(.18,.32,.18,0xfafafa,.4),c=cube(.1,.08,.1,0x1e88e5,.5);c.position.y=.2;g.add(b,c);}
 else if(k==='mush'){const s=cube(.08,.18,.08,0xefebe9,.8),c=cube(.26,.1,.26,0xc62828,.7);c.position.y=.12;g.add(s,c);}
 else{const st=cube(.04,.3,.04,0x388e3c,1),pe=cube(.2,.1,.2,0xe91e63,.8);pe.position.y=.18;g.add(st,pe);}
 return g;}
function bigLiveMesh(k){const g=new THREE.Group(),legs=[],cow=k==='cow',col=cow?0xf5f5f5:0xf8bbd0;
 const b=cube(cow?.8:.6,cow?.7:.5,cow?1.4:.9,col,1);b.position.y=cow?.9:.55;g.add(b);
 if(cow)for(let i=0;i<3;i++){const s=cube(.3,.3,.02,0x212121,1);s.position.set((i-1)*.25,.95,i%2?.71:-.71);s.rotation.y=i;g.add(s);}
 const h=cube(cow?.45:.4,cow?.42:.36,cow?.5:.36,col,1);h.position.set(0,cow?1.15:.65,cow?-.85:-.6);g.add(h);
 const sn=cube(cow?.3:.2,cow?.18:.14,.12,cow?0xffccbc:0xf48fb1,1);sn.position.set(0,cow?1.05:.6,cow?-1.12:-.82);g.add(sn);
 if(cow)for(const x of [-.2,.2]){const hn=cube(.06,.16,.06,0xd7ccc8,1);hn.position.set(x,1.42,-.85);g.add(hn);}
 for(const [x,z] of cow?[[-.28,-.5],[.28,-.5],[-.28,.5],[.28,.5]]:[[-.2,-.3],[.2,-.3],[-.2,.3],[.2,.3]]){const l=cube(.16,cow?.6:.32,.16,cow?0xeeeeee:0xf48fb1,1);l.position.set(x,cow?.3:.16,z);g.add(l);legs.push(l);}
 g.userData.legs=legs;scene.add(g);return g;}
// ---------- augi aug: koks vienas spēles dienas laikā, puķe dažās stundās ----------
function growPlant(p){const now=day*24+hour,gr=Math.max(0,Math.min(1,(now-p.born)/(p.k==='tree'?24:5)));p.gr=gr;p.g.scale.setScalar(.25+.75*gr);}
function flowerNear(px,pz){let best=null,bd=1.6;for(const p of plants)if(p.k==='flower'&&p.gr>=1&&!p.burnt){const d=Math.hypot(p.x-px,p.z-pz);if(d<bd){bd=d;best=p;}}return best;}
function pickFlower(p,I){I.prod=I.prod||{};I.prod.flower=(I.prod.flower||0)+1;p.born=day*24+hour;growPlant(p);if(NET.role==='host')netQ.push({e:'regrow',id:p.id,b:r2(p.born)});sfxAt('pick',p.x,p.z,25);}
// ---------- suņa būda: naktī suns sargā pie būdas un rej arī tad, ja tevis tur nav ----------
function placeDoghouse(x,z,owner){if(doghouses.some(d=>Math.hypot(d.x-x,d.z-z)<1))return;
 const g=new THREE.Group(),b=cube(1.2,.9,1.4,0x8d6e63,1);b.position.y=.45;g.add(b);const r=new THREE.Mesh(new THREE.ConeGeometry(1.05,.7,4),mat(0xb71c1c,.8));r.position.y=1.25;r.rotation.y=Math.PI/4;g.add(r);
 const d=cube(.5,.5,.04,0x2b1b10,1);d.position.set(0,.3,.71);g.add(d);g.position.set(x,0,z);scene.add(g);
 const ob={x,z,hx:.6,hz:.7};addOb(ob);const dh={x,z,owner,g,ob};doghouses.push(dh);
 if(NET.role==='host'&&NET.guests.size)netQ.push({e:'dh',x,z});return dh;}
function doghouseOf(owner){return doghouses.find(d=>d.owner===owner);}
function clearDoghouses(){for(const d of doghouses){scene.remove(d.g);freeObj(d.g);remOb(d.ob);}doghouses.length=0;}
// augšana tiek pārrēķināta reizi sekundē (arī draugiem, jo laiks ir kopīgs)
const _updateFx3=updateFx;updateFx=function(dt){_updateFx3(dt);growT-=dt;if(growT<=0){growT=1;for(const p of plants)if(p.gr<1)growPlant(p);}};
// ---------- rīcības poga: noplūkt ziedošu puķi ----------
const _nearInter3=nearInter;nearInter=function(){const o=_nearInter3();if(!o||o.type==='burn'){const f=flowerNear(player.position.x,player.position.z);if(f)return{type:'pick',p:f};}return o;};
const _updateHint3=updateHint;updateHint=function(){const o=nearInter();if(o&&o.type==='pick'){const h=$('hint');h.textContent=(TOUCH?'':'E / ')+t('pick');h.style.display='block';setAct('🌸');return;}_updateHint3();};
const _interact3=interact;interact=function(){if(active&&NET.role!=='guest'){const o=nearInter();if(o&&o.type==='pick'){pickFlower(o.p,inv);say('🌸 +1',1.2);renderInv();return;}}_interact3();};
// ---------- inventārs: raža un ābola ēšana ----------
function eatApple(){if(!active)return;if(NET.role==='guest'){netSend({t:'eat'});return;}inv.prod=inv.prod||{};if(!(inv.prod.apple>0)||health>=100)return;inv.prod.apple--;health=Math.min(100,health+15);updateHealth();renderInv();sfx('heal');say('🍎 +15',1.2);}
const _renderInv3=renderInv;renderInv=function(){_renderInv3();if(!inv)return;const pr=inv.prod||{},el=$('inv'),line=document.createElement('div');
 line.innerHTML='🌾 '+t('produce')+': '+PROD.map(k=>PRODIC[k]+' '+(pr[k]||0)).join(' · ')+(pr.apple>0?' <button class="corner" id="eatap">'+t('eat')+'</button>':'');el.appendChild(line);const b=$('eatap');if(b)b.onclick=e=>{e.stopPropagation();eatApple();};};
// ---------- kopīgā spēle ----------
const _guestAct3=guestAct;guestAct=function(G){if(!G.dead){const f=flowerNear(G.pos.x,G.pos.z);if(f){pickFlower(f,G.I);netTo(G,{t:'msg',s:'🌸 +1',d:1.2});netMe(G);return;}}_guestAct3(G);};
const _netHostMsg3=netHostMsg;netHostMsg=function(G,d){
 if(d&&G.ready&&d.t==='sell'){netTo(G,{t:'msg',s:sell(d.k,G),d:1.5});netMe(G);return;}
 if(d&&G.ready&&d.t==='eat'){G.I.prod=G.I.prod||{};if(G.I.prod.apple>0&&G.hp<100){G.I.prod.apple--;G.hp=Math.min(100,G.hp+15);netTo(G,{t:'msg',s:'🍎 +15',d:1.2});}netMe(G);return;}
 _netHostMsg3(G,d);};
const _netExtraEv2=netExtraEv2;netExtraEv2=function(e){if(e.e==='regrow'){const p=plants.find(q=>q.id===e.id);if(p){p.born=e.b;growPlant(p);}return;}_netExtraEv2(e);};
// pēc pirkuma vai pārdošanas drauga veikala logs atjaunojas
const _netGuestMsg3=netGuestMsg;netGuestMsg=function(d){_netGuestMsg3(d);if(d&&d.t==='me'&&$('shop').style.display==='block')renderShop($('shop').dataset.kind);};
