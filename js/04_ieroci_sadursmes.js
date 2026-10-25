// 04_ieroci_sadursmes.js - Ieroči (WP), laupījums, šķēršļu režģis, sadursmes, kustība
// ---------- ieroči ----------
const WP={hands:{ic:'✊',dmg:25},
 pistol:{ic:'🔫',dmg:50,rate:.3,max:100,give:12,add:15,pel:1,sp:.015,life:1.3,brate:1.0,rng:24,val:15,av:.8},
 m16:{ic:'M16',dmg:34,rate:.11,max:60,give:20,add:20,pel:1,sp:.035,life:1.4,brate:.4,rng:26,val:30,av:1,auto:true},
 shot:{ic:'💥',dmg:24,rate:.8,max:30,give:6,add:6,pel:6,sp:.13,life:.45,brate:1.3,rng:10,val:22,av:2.5},
 rpg:{ic:'🚀',dmg:260,rate:1.4,max:8,give:2,add:2,pel:1,sp:0,life:2.2,brate:3.2,rng:30,val:45,av:12,rocket:true},
 // pērk pie tirgotājiem: 🐔 burvja burvestība pārvērš pretinieku vistā, 🌳 un 🌸 sēklas iestāda koku vai puķi
 poly:{ic:'🐔',spell:true,rate:.8,max:20,rng:22,val:20,av:5},grow:{ic:'🌳',spell:true,rate:.35,max:40,rng:3,val:5,av:1},flow:{ic:'🌸',spell:true,rate:.25,max:40,rng:3,val:2,av:.5}};
const WL=['hands','pistol','m16','shot','rpg','poly','grow','flow'],GUNS=['pistol','m16','shot','rpg'];
const newInv=()=>({has:{pistol:false,m16:false,shot:false,rpg:false,poly:false,grow:false,flow:false,jav:false},ammo:{pistol:0,m16:0,shot:0,rpg:0,poly:0,grow:0,flow:0,jav:0},meds:0,armor:0,matches:0,coins:0,hbelt:0,fuel:0});
function rollLoot(R,p){if(R()>p)return[];const q=R();return q<.14?['pistol','a_pistol']:q<.23?['m16','a_m16']:q<.29?['shot','a_shot']:q<.34?['rpg','a_rpg']:q<.48?['a_pistol']:q<.56?['a_m16']:q<.61?['a_shot']:q<.66?['a_rpg']:q<.74?['med']:q<.82?['armor']:q<.87?['blk']:q<.9?['match']:q<.98?['coin']:['win_i'];}
// mežā: būvmateriāli (kluči, logi, durvis) un sērkociņi
function pickForest(R){const q=R();return q<.35?'blk':q<.55?'win_i':q<.7?'door_i':q<.88?'match':pickWeapon(R);}
function pickGround(R){const q=R();return q<.35?'a_pistol':q<.5?'a_m16':q<.6?'a_shot':q<.65?'a_rpg':q<.8?'armor':'blk';}
function pickWeapon(R){const q=R();return q<.45?'pistol':q<.75?'m16':q<.92?'shot':'rpg';}
function giveLoot(k,I,Tm){
 if(k==='gun')k='pistol';if(k==='ammo')k='a_pistol';
 if(GUNS.includes(k)){I.has[k]=true;I.ammo[k]=Math.min(WP[k].max,I.ammo[k]+WP[k].give);return WP[k].ic+' '+t('w'+k);}
 if(k.startsWith('a_')){const w=k.slice(2);I.ammo[w]=Math.min(WP[w].max,I.ammo[w]+WP[w].add);return '+'+WP[w].add+' '+t('bul')+' ('+t('w'+w)+')';}
 if(k==='med'){I.meds++;return '+1 '+t('med2');}
 if(k==='armor'){I.armor=Math.min(100,I.armor+50);return '🛡️ +50';}
 if(k==='blk'){if(Tm)Tm.blocks+=10;return '+10 🧱';}
 if(k==='coin'){if(Tm)Tm.coins=(Tm.coins||0)+10;return '+10 🪙';}
 if(k==='door_i'){if(Tm)Tm.doorI=(Tm.doorI||0)+1;return '+1 🚪';}
 if(k==='win_i'){if(Tm)Tm.winI=(Tm.winI||0)+2;return '+2 🪟';}
 if(k==='match'){I.matches=(I.matches||0)+10;return '+10 🔥 '+t('matches');}
 return '';
}
function updateAmmo(){$('ammo').textContent=cur==='hands'?'-':inv.ammo[cur];}
// ---------- šķēršļu režģis (ātrākas sadursmes) ----------
const GS=4,gkey=(i,j)=>(i+3000)*8000+(j+3000);
function addOb(o){o.cells=[];const i0=Math.floor((o.x-o.hx)/GS),i1=Math.floor((o.x+o.hx)/GS),j0=Math.floor((o.z-o.hz)/GS),j1=Math.floor((o.z+o.hz)/GS);for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const k=gkey(i,j);let a=OG.get(k);if(!a){a=[];OG.set(k,a);}a.push(o);o.cells.push(k);}}
function remOb(o){if(!o.cells)return;for(const k of o.cells){const a=OG.get(k);if(a){const i=a.indexOf(o);if(i>=0)a.splice(i,1);if(!a.length)OG.delete(k);}}o.cells=null;}
function eachOb(x,z,r,fn){const i0=Math.floor((x-r)/GS),i1=Math.floor((x+r)/GS),j0=Math.floor((z-r)/GS),j1=Math.floor((z+r)/GS);for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const a=OG.get(gkey(i,j));if(a)for(const o of a)if(fn(o))return true;}return false;}
function solid(o,y,team){if(o.off||o.dead)return false;if(o.y1!==undefined){if(o.door&&o.team===team)return false;if(y>=o.y1-.3||y+1.7<=o.y0)return false;}return true;}
// team: savas komandas kluči laiž cauri savas komandas lodes (šaujamlūkas)
function wallAt(x,z,y,team){let r=0;eachOb(x,z,0,o=>{if(o.off||o.dead||Math.abs(x-o.x)>=o.hx||Math.abs(z-o.z)>=o.hz)return false;if(o.y1===undefined){r=1;return true;}if(o.win||(team&&o.team===team))return false;if(y>=o.y0&&y<o.y1){r=2;return true;}return false;});return r;}
function inWall(x,z){return wallAt(x,z,1)>0;}
function blockedLine(a,b,y=1,team){const n=Math.max(8,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/1.2));for(let k=1;k<n;k++){const r=wallAt(a.x+(b.x-a.x)*k/n,a.z+(b.z-a.z)*k/n,y,team);if(r)return r;}return 0;}
// divas reizes pēc kārtas: stūrī starp divām sienām pirmā izstumšana var iegrūst otrā sienā
function pushOut(p,rad,y=0,team){for(let it=0;it<2;it++)eachOb(p.x,p.z,rad+.2,o=>{if(!solid(o,y,team))return false;const px=p.x-o.x,pz=p.z-o.z,rx=o.hx+rad,rz=o.hz+rad;if(Math.abs(px)<rx&&Math.abs(pz)<rz){if(rx-Math.abs(px)<rz-Math.abs(pz))p.x=o.x+(px<0?-rx:rx);else p.z=o.z+(pz<0?-rz:rz);}return false;});}
function overlapAt(x,z,rad,y=0,team){return eachOb(x,z,rad+.2,o=>solid(o,y,team)&&Math.abs(x-o.x)<o.hx+rad*.7&&Math.abs(z-o.z)<o.hz+rad*.7);}
// ja tomēr iesprūdis sienā: atrod tuvāko brīvo vietu apkārt
function unstick(p,rad,y=0,team){if(!overlapAt(p.x,p.z,rad,y,team))return false;for(let r=.4;r<=4;r+=.3)for(let k=0;k<16;k++){const a=k/16*6.283,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;if(!overlapAt(x,z,rad,y,team)){p.x=x;p.z=z;return true;}}return false;}
function groundAt(x,z,y,rad){let g=0;eachOb(x,z,rad+.2,o=>{if(o.y1!==undefined&&!o.dead&&o.y1<=y+.35&&o.y1>g&&Math.abs(x-o.x)<o.hx+rad*.6&&Math.abs(z-o.z)<o.hz+rad*.6)g=o.y1;return false;});return g;}
function clampW(p){p.x=Math.max(-EDGE+2,Math.min(EDGE-2,p.x));p.z=Math.max(-EDGE+2,Math.min(EDGE-2,p.z));}
function stepTo(p,tx,tz,sp,dt,rad,team,st,y=0){let dx=tx-p.x,dz=tz-p.z;const d=Math.hypot(dx,dz);if(d<.05)return 0;dx/=d;dz/=d;
 if(st.sideT>0){st.sideT-=dt;const sx=-dz*st.side,sz=dx*st.side;dx=dx*.25+sx;dz=dz*.25+sz;const n=Math.hypot(dx,dz)||1;dx/=n;dz/=n;}
 const m=Math.min(d,sp*dt);p.x+=dx*m;p.z+=dz*m;pushOut(p,rad,y,team);clampW(p);
 st.ct=(st.ct||0)+dt;if(st.ct>1){if(st.lx!==undefined&&Math.hypot(p.x-st.lx,p.z-st.lz)<sp*.25&&d>1.5){st.side=st.stuck>2?-st.side||1:Math.random()<.5?1:-1;st.sideT=.9+Math.min(2,(st.stuck||0)*.4);st.stuck=(st.stuck||0)+1;}else st.stuck=0;st.ct=0;st.lx=p.x;st.lz=p.z;}
 return d;}
