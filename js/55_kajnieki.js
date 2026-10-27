// 55_kajnieki.js - Kājnieki karā: M16 vai AK ar 50 lodēm jau no sākuma (atdzimšanā to dod 37. fails), un boti cīnās gudrāk:
// nepieskrien pretiniekam taisni barā, bet tuvojas no sāniem un apstājas šaušanas attālumā, trāpīti meklē aizsegu, ievainoti atkāpjas, neskrien cits citam virsū.
// ---------- komplekts spēles sākumā ----------
const _start55=start;start=function(){_start55();if(!isWar()||NET.role==='guest')return;const w=warKit(inv);selectW(w);updateAmmo();renderInv();renderW();
 for(const G of NET.guests.values())if(G.ready){warKit(G.I);netMe(G);}};
const _netWelcome55=netWelcome;netWelcome=function(G){_netWelcome55(G);if(isWar()&&G.I){warKit(G.I);netMe(G);}};
// ---------- aizsegs: vieta aiz šķēršļa, no kuras pretinieks ir redzams (var šaut) vai neredzams (atkāpjoties) ----------
function coverSpot(p,e,r,shoot,team){const ux=e.x-p.x,uz=e.z-p.z,l=Math.hypot(ux,uz)||1,dx=ux/l,dz=uz/l;let best=null,bd=1e9;const seen=new Set();
 eachOb(p.x,p.z,r,o=>{if(seen.has(o)||o.dead||o.off||o.hx>6||o.hz>6||(o.y1!==undefined&&o.y1<.9))return false;seen.add(o);const w=Math.max(o.hx,o.hz)+.9;
  for(const s of shoot?[-1,1]:[0]){const x=o.x-dx*w+(-dz)*s*(Math.min(o.hx,o.hz)+.9),z=o.z-dz*w+dx*s*(Math.min(o.hx,o.hz)+.9),d=Math.hypot(x-p.x,z-p.z);if(d>r||d>=bd)continue;
   if(overlapAt(x,z,.35,0,team))continue;const bl=!!blockedLine({x,z},e,1.2,team);if(shoot?bl:!bl)continue;bd=d;best={x,z};}return false;});return best;}
// ---------- gudrāka cīņa ----------
const AIK=b=>isWar()&&ARMY.includes(b.team)&&!b.dead&&!b.inside&&!b.jet&&!b.heli&&!b.tankV&&!b.para&&!b.ord&&!b.jetGoal&&!b.heliGoal&&!b.tankGoal&&!b.gen&&!b.pil&&!b.trader&&!b.carry;
const _botThink55=botThink;botThink=function(b){_botThink55(b);if(!AIK(b))return;const e=b.tg;if(!e||e.m||!e.p)return;
 const p=b.g.position,dx=e.p.x-p.x,dz=e.p.z-p.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d,W=WP[b.w]||WP.m16;
 if(b.flk===undefined)b.flk=(Math.random()<.5?-1:1)*(4+Math.random()*7);if(b.lhp===undefined)b.lhp=b.hp;
 const hit=b.hp<b.lhp-4;b.lhp=b.hp;
 // turas aizsegā līdz noteiktam laikam (no turienes šauj)
 if(b.covT>gtime&&b.cov){goal(b,b.cov.x,b.cov.z,false);return;}
 // ievainots: atkāpjas aiz aizsega prom no pretinieka
 if(b.hp<40&&d<35){const c=coverSpot(p,e.p,12,false,b.team);if(c){b.cov=c;b.covT=gtime+4;goal(b,c.x,c.z,false);}else goal(b,p.x-ux*10+(-uz)*b.flk*.4,p.z-uz*10+ux*b.flk*.4,false);return;}
 // trāpīts: iet aiz tuvākā aizsega, no kura var šaut
 if(hit&&d>8){const c=coverSpot(p,e.p,9,true,b.team);if(c){b.cov=c;b.covT=gtime+3+Math.random()*2;goal(b,c.x,c.z,false);return;}}
 // tuvošanās: ne taisni uz mērķi, bet no sāniem; apstājas ~60% no ieroča tāluma
 if(b.gx!=null&&b.w!=='hands'&&d>W.rng*.75){const k=Math.min(1,(d-W.rng*.6)/25),tx=e.p.x-ux*W.rng*.6+(-uz)*b.flk*k,tz=e.p.z-uz*W.rng*.6+ux*b.flk*k;goal(b,tx,tz,false);}};
// ---------- neskrien cits citam virsū ----------
const _botMove55=botMove;botMove=function(b,dt,i){_botMove55(b,dt,i);if(!isWar()||b.inside||b.dead)return;const p=b.g.position;
 for(const o of humans){if(o===b||o.dead||o.inside||o.team!==b.team)continue;const dx=p.x-o.g.position.x,dz=p.z-o.g.position.z,d2=dx*dx+dz*dz;
  if(d2<2.6&&d2>1e-4){const d=Math.sqrt(d2),k=Math.min(.2,(1.6-d)*dt*2.5);p.x+=dx/d*k;p.z+=dz/d*k;}}};
