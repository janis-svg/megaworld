// 57_kauja.js - Kara kaujas dzīvīgums: botu tehnika atrod bāzes vārtus (agrāk slīdēja gar žogu un palika bāzē),
// tanki mērķtiecīgi medī pretinieka tehniku.
// ---------- tehnikas ceļš caur bāzes vārtiem ----------
// vārti ir abās bāzes pusēs, kas skatās uz centru; u = pa vārtu platumu, w = attālums no bāzes centra uz āru.
// Ceļš iet līkločiem starp betona blokiem (lauka un Ozolnieku kartē), pilsētā tas pats ceļš vienkārši ir brīvs.
const GWP=[[0,-6],[0,1.5],[3.2,6],[-3.2,11],[0,18]]; // w pieskaita BR
const gwXY=(B,side,u,w)=>side?[B.x+B.d*(BR+w),B.z+u]:[B.x+u,B.z+B.d*(BR+w)];
const gwUW=(B,side,x,z)=>side?[z-B.z,B.d*(x-B.x)-BR]:[x-B.x,B.d*(z-B.z)-BR];
const inBase=(B,x,z,m)=>Math.abs(x-B.x)<BR+m&&Math.abs(z-B.z)<BR+m;
function gateWay(px,pz,tx,tz){if(!isWar())return null;
 for(const B of WB){const inP=inBase(B,px,pz,1),inT=inBase(B,tx,tz,1);
  // pašreizējais vārtu koridors (ja tehnika jau tajā)
  let side=-1;for(const s of[0,1]){const[u,w]=gwUW(B,s,px,pz);if(Math.abs(u)<12&&w>-8&&w<19){side=s;break;}}
  if(inP&&!inT){if(side<0){let bd=1e9;for(const s of[0,1]){const[x,z]=gwXY(B,s,0,18),d=Math.hypot(x-tx,z-tz);if(d<bd){bd=d;side=s;}}}
   const[,w]=gwUW(B,side,px,pz);const q=GWP.find(q=>q[1]>w+1)||GWP[GWP.length-1];return gwXY(B,side,q[0],q[1]);}
  if(inT&&!inP){if(side<0){let bd=1e9;for(const s of[0,1]){const[x,z]=gwXY(B,s,0,18),d=Math.hypot(x-px,z-pz);if(d<bd){bd=d;side=s;}}}
   const[,w]=gwUW(B,side,px,pz);if(w<-5)return null;const q=[...GWP].reverse().find(q=>q[1]<w-1)||GWP[0];return gwXY(B,side,q[0],q[1]);}
  if(!inP&&!inT&&side>=0){const[,w]=gwUW(B,side,px,pz);if(w<17){const q=GWP.find(q=>q[1]>w+1);if(q)return gwXY(B,side,q[0],q[1]);}}}
 return null;}
const _stepTo57=stepTo;stepTo=function(p,tx,tz,sp,dt,rad,team,st,y){if(rad>=1.5&&st&&isWar()){const g=gateWay(p.x,p.z,tx,tz);if(g){tx=g[0];tz=g[1];}}
 return _stepTo57(p,tx,tz,sp,dt,rad,team,st,y);};
// ---------- krītošu lidmašīnu nevar notriekt vēlreiz (agrāk katrs trāpījums krītošai deva zvaigznes un ziņu no jauna) ----------
const _shootDown57=shootDown;shootDown=function(J,team){if(J.st==='fall'&&!J.pilot)return;_shootDown57(J,team);};
