// 32_labojumi.js - Labojumi pēc spēlēšanas: ložmetēji nešauj cauri sienām, trāpa tur, kur tēmē, ieročiem skaidrs darbības attālums, snaipera tēmēklis
// ---------- ieroču darbības attālums (lode lido tik tālu un tikai tur var trāpīt) ----------
// lodes ātrums 45 m/s (raķetei 28 m/s), tāpēc lidojuma laiks = attālums / ātrums; rng = cik tālu palīdz tēmēt un cik tālu šauj boti
const RANGE={pistol:50,m16:80,shot:22,rpg:70,snip:150};
for(const k in RANGE){const W=WP[k];if(!W)continue;W.life=RANGE[k]/(W.rocket?28:k==='snip'?135:45);W.rng=Math.round(RANGE[k]*.8);}
WP.snip.ic='SNP';
const MGR={apc:90,heli:80};
// ---------- ložmetēji (bruņmašīna, helikopters): siena aptur lodi; ja nav mērķa ar palīgu, trāpa tajā, kas ir tēmēšanas līnijā ----------
function losPoint(x,y,z,tx,ty,tz,team){const l=Math.hypot(tx-x,ty-y,tz-z),n=Math.ceil(l/.8);for(let k=2;k<=n;k++){const f=k/n,px=x+(tx-x)*f,py=y+(ty-y)*f,pz=z+(tz-z)*f;if(py<0)return[px,0,pz];if(wallAt(px,pz,py,team)){const b=bldAt(px,pz,0);if(b&&py>b.h+.3)continue;return[px,py,pz];}}return null;}
const _heliShot16=heliShot;heliShot=function(H,x,y,z,tx,ty,tz,team,pl){const w=losPoint(x,y,z,tx,ty,tz,team);if(w){tracer(x,y,z,w[0],w[1],w[2]);debris(w[0],Math.max(.2,w[1]),w[2],0x9e9e9e,2);return;}_heliShot16(H,x,y,z,tx,ty,tz,team,pl);};
// mērķis tēmēšanas līnijā (līdz r m): ienaidnieki, briesmoņi, helikopteri
function rayTarget(px,py,pz,a,r,team,dy){const fx=-Math.sin(a),fz=-Math.cos(a);let best=null,bd=r;
 const look=(x,y,z)=>{const dx=x-px,dz=z-pz,al=dx*fx+dz*fz;if(al<2||al>bd)return;const off=Math.abs(dx*fz-dz*fx);if(off>1.6+al*.02)return;bd=al;best={x,y,z};};
 for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0))look(z.position.x,1.2,z.position.z);}
 for(const h of HL)if(h.team!==team&&team.enemies.has(h.team))look(h.p.x,(h.y||0)+1.2,h.p.z);
 for(const H of HELIS)if(H.st==='fly'&&heliTeam(H)!==team)look(H.x,H.y+1.5,H.z);
 return best;}
// bruņmašīna: palīgs tēmē tālāk (90 m), un bez palīga šāviens iet uz to, kas ir priekšā
const _apcAim16=apcAim;apcAim=function(px,pz,a,team){const r=_apcAim16(px,pz,a,team);if(r)return r;return rayTarget(px,2.4,pz,a,MGR.apc,team);};
// arī tālāk par 70 m
apcAim=(f=>function(px,pz,a,team){let best=f(px,pz,a,team);if(best)return best;let bs=1e9;const look=(x,y,z)=>{const dx=x-px,dz=z-pz,d=Math.hypot(dx,dz);if(d>MGR.apc||d<60)return;let df=Math.atan2(-dx,-dz)-a;df=Math.abs(Math.atan2(Math.sin(df),Math.cos(df)));if(df>.35)return;if(df*40+d*.2<bs){bs=df*40+d*.2;best={x,y,z};}};
 for(const h of HL)if(h.team!==team&&team.enemies.has(h.team))look(h.p.x,(h.y||0)+1.2,h.p.z);return best;})(apcAim);
const _heliAimLocal16=heliAimLocal;heliAimLocal=function(H){const r=_heliAimLocal16(H);if(r||NET.role==='guest')return r;return rayTarget(H.x,H.y,H.z,H.a,MGR.heli,PT);};
// ---------- snaiperis: pats ieslēdz skatu no acīm, pietuvina un rāda tēmēkli ----------
const scopeEl=document.createElement('div');scopeEl.id='scope';document.body.appendChild(scopeEl);
let scopeOn=false,fpBefore=false;
function scopeTick(){const want=active&&cur==='snip'&&!inTank&&!jetMode&&!heliMode&&!paraMode;if(want===scopeOn)return;scopeOn=want;
 if(want){fpBefore=fp;fp=true;pitch=clampP(pitch);}else{fp=fpBefore;pitch=clampP(pitch);}
 scopeEl.style.display=want?'block':'none';$('cross').style.display=want?'none':'';camera.fov=want?28:75;camera.updateProjectionMatrix();}
const _updateFx18=updateFx;updateFx=function(dt){_updateFx18(dt);scopeTick();if(scopeOn&&camera.fov!==28){camera.fov=28;camera.updateProjectionMatrix();}};
// snaipera palīgs: šaurs, bet tāls (tēmē uz to, kas ir tēmēkļa vidū)
const _assistYaw16=assistYaw;assistYaw=function(rng){if(cur!=='snip')return _assistYaw16(rng);const px=player.position.x,pz=player.position.z;let best=null,bs=1e9;
 const look=(x,z)=>{const dx=x-px,dz=z-pz,d=Math.hypot(dx,dz);if(d>RANGE.snip||d<1)return;const a=Math.atan2(-dx,-dz);let df=a-yaw;df=Math.atan2(Math.sin(df),Math.cos(df));if(Math.abs(df)>(TOUCH?.12:.06))return;if(Math.abs(df)*60+d*.02<bs&&!blockedLine(player.position,{x,z},pY+1.2,PT)){bs=Math.abs(df)*60+d*.02;best=a;}};
 for(const z of zombies){const u=z.userData;if(!u.dead&&!(u.rise>0))look(z.position.x,z.position.z);}for(const b of humans)if(PT.enemies.has(b.team)&&!b.inside)look(b.g.position.x,b.g.position.z);
 if(NET.role==='guest')for(const o of netBot.values())if(o.rel===2)look(o.g.position.x,o.g.position.z);return best;};
