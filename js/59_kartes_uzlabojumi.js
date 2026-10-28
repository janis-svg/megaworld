// 59_kartes_uzlabojumi.js - Karšu uzlabojumi karā.
// Kaujas lauks: kalns centrā (punkts B) ar betona ligzdu augšā, augsta zāle (tajā boti tevi neredz tālāk par 9 m, kamēr nešauj).
// Pilsēta: divas metro pārejas (E) no savas puses uz pretinieku pusi pa flangiem, smilšu maisi uz augsto māju jumtiem.
// Ozolnieki: Iecavas upe ar diviem tiltiem (cilvēki un tehnika iet pa tiltiem), skola pa pusei sagrauta (var iet iekšā, klases un gaitenis).
// Visās kartēs: dūmu granāta (💨), aiz dūmiem un tajos boti neredz. Misija "Pilots" Ozolniekos: pilots nolaidies mežaparkā.
Object.assign(T.lv,{wsmk:'Dūmu granāta',smk_full:'💨 Līdzi var nest tikai 2 dūmu granātas',tun_go:'🚇 Metro pāreja uz otru pusi',tun_in:'🚇 Tu izgāji pa metro pāreju'});
Object.assign(T.en,{wsmk:'Smoke grenade',smk_full:'💨 You can carry only 2 smoke grenades',tun_go:'🚇 Metro passage to the other side',tun_in:'🚇 You came out of the metro passage'});
// ---------- Ozolnieki: upe, tilti, skola ----------
Object.assign(FB,{
 riv(ch,p){const g=ch.group,b=new THREE.Mesh(new THREE.CircleGeometry(p.r+1.4,20),mat(0x6b5b3c,1));b.rotation.x=-Math.PI/2;b.position.set(p.x,.018,p.z);g.add(b);
  const w=new THREE.Mesh(new THREE.CircleGeometry(p.r,20),new THREE.MeshStandardMaterial({color:0x2f6680,roughness:.2,metalness:.35}));w.rotation.x=-Math.PI/2;w.position.set(p.x,.03,p.z);g.add(w);
  const k=p.r*.72;for(const[hx,hz]of[[p.r*.95,k*.6],[k*.6,p.r*.95],[k,k]])ch.obs.push({x:p.x,z:p.z,hx,hz,y0:0,y1:3,win:true});},
 bridge(ch,p){const g=ch.group,c=Math.cos(p.a),s=Math.sin(p.a);const d=vadd(g,8,.4,24,0x9e9a90,p.x,.2,p.z,.9);d.rotation.y=p.a;
  for(const o of[-1,1]){const r=vadd(g,.25,.9,24,0x6d6a62,p.x+c*o*4,.75,p.z-s*o*4,.8);r.rotation.y=p.a;for(let i=-2;i<=2;i++)vadd(g,.3,1.1,.3,0x5b5852,p.x+c*o*4+s*i*5.5,.55,p.z-s*o*4+c*i*5.5,.8);}},
 // skola: rietumu spārns vesels, austrumu spārnam iebrucis jumts un augšstāvi, iekšā gaitenis un klases ar durvju ailām
 school(ch,p){const g=ch.group,R=rng(4242),wi=p.w*.45,wr=p.w-wi,xi=p.x-p.w/2+wi/2,xr=p.x+p.w/2-wr/2,z0=p.z-p.d/2,z1=p.z+p.d/2,c=0xdedcd6,ob=(x,z,hx,hz,y1)=>ch.obs.push({x,z,hx,hz,y0:0,y1});
  vadd(g,wi,p.h,p.d,c,xi,p.h/2,p.z,.9).castShadow=true;vadd(g,wi+.4,.35,p.d+.4,0x8d9196,xi,p.h+.17,p.z,.8);
  for(let f=0;f<3;f++)for(const s of[-1,1]){const y=1.5+f*3.2;ozWin(g,wi*.92,'x',xi,p.z,y,s*(p.d/2+.02));ozWin(g,wi*.92,'x',xi,p.z,y-1,s*(p.d/2+.03),f===2?0x3f9a4a:0xc4643a);}
  vadd(g,8,6,6,0xd8cfa8,p.x-p.w/2-4,3,p.z+2,.9);ob(xi,p.z,wi/2,p.d/2,p.h);ob(p.x-p.w/2-4,p.z+2,4,3,6);
  // ārsienas ar logu caurumiem un ieejām
  const wallX=(xa,xb,z,hmin,hmax,gap)=>{let x=xa;while(x<xb-.3){const len=Math.min(xb-x,2.4+R()*1.6),h=hmin+R()*(hmax-hmin),cx=x+len/2;vadd(g,len,h,.4,c,cx,h/2,z,.95).castShadow=true;
    vadd(g,len,.5,.42,R()<.5?0xc4643a:0x3f9a4a,cx,Math.min(h-.3,1.1),z,.8);ob(cx,z,len/2,.2,h);x+=len+gap;}};
  const wallZ=(x,za,zb,h,door)=>{const m=(za+zb)/2;for(const[a,b]of door?[[za,m-.8],[m+.8,zb]]:[[za,zb]]){const L=b-a;if(L<.3)continue;vadd(g,.4,h,L,c,x,h/2,(a+b)/2,.95);ob(x,(a+b)/2,.2,L/2,h);}};
  wallX(xi+wi/2,p.x+p.w/2,z0,3.2,6.4,1.3);wallX(xi+wi/2,p.x+p.w/2,z1,2.6,6.8,1.5);wallZ(p.x+p.w/2,z0,z1,4.2,true);
  // gaitenis gar dienvidu sienu, klases ziemeļu pusē
  const zc=z0+3;wallX(xi+wi/2+.2,p.x+p.w/2-.2,zc,2.9,3.1,1.5);
  for(let x=xi+wi/2+5.8;x<p.x+p.w/2-1;x+=5.8){vadd(g,.3,3,z1-zc,c,x,1.5,(zc+z1)/2,.95);ob(x,(zc+z1)/2,.15,(z1-zc)/2,3);}
  for(let i=0;i<10;i++){const s=.7+R()*1.6;vadd(g,s,s*.5,s,[0x8c867a,0x6f685c,0xc8c2b4][i%3],xr+(R()-.5)*wr*.9,s*.25,p.z+(R()-.5)*p.d*.8,1);}
  const f=new THREE.Mesh(new THREE.PlaneGeometry(wr,p.d),mat(0x3a3530,1));f.rotation.x=-Math.PI/2;f.position.set(xr,.02,p.z);g.add(f);
  for(let i=0;i<5;i++){const bx=xr+(R()-.5)*wr*.8,q=vadd(g,1.4+R()*2,.15,.3,0x5d5040,bx,4+R()*2,R()<.5?z0+.2:z1-.2,.9);q.rotation.z=(R()-.5)*1.2;}}});
// upi šķērso tikai pa tiltiem: ja mērķis ir otrā krastā, vispirms uz tuvāko tiltu
const ozUV=(x,z)=>{const a=x-WB[0].x,b=z-WB[0].z;return[(a+b)/(2*OZS),(b-a)/(2*OZS)];};
function riverWay(px,pz,tx,tz){if(WMAP!=='ozo'||!isWar())return null;const[pu,pv]=ozUV(px,pz),[tu,tv]=ozUV(tx,tz),sp=Math.sign(pu-ozRiv(pv)),st=Math.sign(tu-ozRiv(tv));
 if(sp===st||!sp||!st)return null;let b=OZBR[0],bd=1e9;for(const v of OZBR){const d=Math.abs(pv-v)+Math.abs(tv-v);if(d<bd){bd=d;b=v;}}
 const ru=ozRiv(b);if(Math.abs(pv-b)>2.5||Math.abs(pu-ru)>13)return ozP(ru+sp*13,b);return ozP(ru-sp*13,b);}
const _stepTo59=stepTo;stepTo=function(p,tx,tz,sp,dt,rad,team,st,y){const r=riverWay(p.x,p.z,tx,tz);if(r){tx=r[0];tz=r[1];}return _stepTo59(p,tx,tz,sp,dt,rad,team,st,y);};
// misija "Pilots": Ozolniekos pilots nolaidies mežaparkā pie Bulderberga kalna
if(typeof MSET!=='undefined'&&MSET.rescue){const _r59=MSET.rescue;MSET.rescue=function(){_r59();if(WMAP==='ozo'&&MS&&MS.pil&&MS.pil.g){const[x,z]=ozP(226,62);MS.pil.g.position.set(x,0,z);MS.pil.gx=null;}};}
// ---------- Kaujas lauks: kalns un augsta zāle ----------
const TGR=[];
function fieldExtras(){const g=new THREE.Group(),n0=WOB.length;
 // kalns: pakāpieni pa 0,3 m (cilvēks uzkāpj, tehnika apbrauc), augšā betona ligzda ar spraugām
 for(let k=0;k<6;k++){const s=9-1.15*k,y1=.3*(k+1);vadd(g,2*s,y1,2*s,[0x6d5a3a,0x6a6a3c,0x5f7a3a][k%3],0,y1/2,0,1);WOB.push({x:0,z:0,hx:s,hz:s,y0:0,y1});}
 const t=3.25,Y=1.8;for(const[sx,sz]of[[-1,-1],[1,1],[-1,1],[1,-1]]){for(const ax of[0,1]){const x=ax?sx*(t-.3):sx*(t-1.3),z=ax?sz*(t-1.3):sz*(t-.3),hx=ax?.3:1.1,hz=ax?1.1:.3;
   vadd(g,hx*2,1.1,hz*2,0xa9a69c,x,Y+.55,z,.9);WOB.push({x,z,hx,hz,y0:Y,y1:Y+1.1});}}
 g.updateMatrixWorld(true);mergeInto(g);scene.add(g);WG.push(g);for(let i=n0;i<WOB.length;i++)addOb(WOB[i]);
 // augstā zāle simetriski abām pusēm
 TGR.length=0;for(const[x,z,r]of[[-50,-100,12],[-120,30,13],[-30,62,10],[-150,-60,12],[-62,-18,9]])TGR.push({x,z,r},{x:-x,z:-z,r});
 const geo=new THREE.PlaneGeometry(1,1.5);geo.translate(0,.75,0);const m=new THREE.MeshLambertMaterial({color:0x8f9a4e,side:THREE.DoubleSide});
 let n=0;for(const G of TGR)n+=Math.round(G.r*G.r*1.1);const im=new THREE.InstancedMesh(geo,m,n*2),M=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),S=new THREE.Vector3(),P=new THREE.Vector3(),cl=new THREE.Color();let i=0;const R=rng(77);
 for(const G of TGR)for(let k=0;k<Math.round(G.r*G.r*1.1);k++){const a=R()*6.283,d=Math.sqrt(R())*G.r,x=G.x+Math.cos(a)*d,z=G.z+Math.sin(a)*d,h=.8+R()*.5,ry=R()*3;
  for(const o of[0,Math.PI/2]){e.set(0,ry+o,(R()-.5)*.2);q.setFromEuler(e);S.set(.9,h,1);P.set(x,0,z);M.compose(P,q,S);im.setMatrixAt(i,M);cl.setHex([0x8f9a4e,0x9fa65a,0x7d8a44][k%3]);im.setColorAt(i,cl);i++;}}
 im.count=i;const gg=new THREE.Group();gg.add(im);scene.add(gg);WG.push(gg);}
const inGrass=(x,z)=>TGR.some(G=>Math.hypot(x-G.x,z-G.z)<G.r);
// ---------- pilsēta: metro pārejas un smilšu maisi uz jumtiem ----------
// pārejas: no sarkano puses uz zaļo pusi kreisajā flangā un otrādi labajā (simetriski)
let TUNS=[];const TUND=[[[-140,0,'x'],[0,140,'z']],[[140,0,'x'],[0,-140,'z']]];
function cityExtras(){const g=new THREE.Group(),n0=WOB.length;TUNS=[];
 for(const pair of TUND){const E=pair.map(([x,z,ax])=>{const sg=(ax==='x'?x:z)>0?-1:1,kx=ax==='x'?x+sg*-4.2:x,kz=ax==='x'?z:z+sg*-4.2,fx=ax==='x'?x+sg*-1.8:x,fz=ax==='x'?z:z+sg*-1.8;
   vadd(g,ax==='x'?2.6:3.6,2.4,ax==='x'?3.6:2.6,0x2b3a4a,kx,1.2,kz,.7);vadd(g,ax==='x'?2.8:3.8,.2,ax==='x'?3.8:2.8,0xc62828,kx,2.5,kz,.6);
   vcyl(g,.06,.06,3.6,0x333333,fx,1.8,fz,null,5);const sgn=vadd(g,.9,.9,.9,0x1565c0,fx,3.9,fz,.5);sgn.material.emissive=new THREE.Color(0x0d47a1);
   WOB.push({x:kx,z:kz,hx:ax==='x'?1.3:1.8,hz:ax==='x'?1.8:1.3,y0:0,y1:2.6});return{x:fx,z:fz};});
  TUNS.push(E);}
 g.updateMatrixWorld(true);mergeInto(g);scene.add(g);WG.push(g);for(let i=n0;i<WOB.length;i++)addOb(WOB[i]);}
function tunAt(x,z){for(const P of TUNS)for(let i=0;i<2;i++)if(Math.hypot(x-P[i].x,z-P[i].z)<2.6)return{to:P[1-i]};return null;}
const _nearInter59=nearInter;nearInter=function(){const o=_nearInter59();if(o&&o.type!=='burn')return o;if(!isWar()||!TUNS.length||inTank||pY>1)return o;const u=tunAt(player.position.x,player.position.z);return u?{type:'tun',u}:o;};
const _updateHint59=updateHint;updateHint=function(){const o=nearInter();if(o&&o.type==='tun'){const h=$('hint');h.textContent=(TOUCH?'':'E / ')+t('tun_go');h.style.display='block';setAct('🚇');return;}_updateHint59();};
const _interact59=interact;interact=function(){if(active&&NET.role!=='guest'){const o=nearInter();if(o&&o.type==='tun'){player.position.set(o.u.to.x+.5,0,o.u.to.z+.5);pY=0;vy=0;say(t('tun_in'),2);sfx('door');return;}}_interact59();};
const _guestAct59=guestAct;guestAct=function(G){if(!G.dead&&TUNS.length&&!G.gtk){const u=tunAt(G.pos.x,G.pos.z);if(u){G.pos.x=u.to.x+.5;G.pos.z=u.to.z+.5;netTo(G,{t:'tp',x:G.pos.x,z:G.pos.z});netTo(G,{t:'msg',s:t('tun_in'),d:2});return;}}_guestAct59(G);};
// boti izmanto pāreju, ja tā ceļu saīsina vismaz par 50 m
const _botThink59=botThink;botThink=function(b){_botThink59(b);if(!TUNS.length||!isWar()||b.dead||b.inside||b.gx==null||nearestThreat(b))return;const p=b.g.position,dd=Math.hypot(b.gx-p.x,b.gz-p.z);
 for(const P of TUNS)for(let i=0;i<2;i++){const a=P[i],o=P[1-i],da=Math.hypot(a.x-p.x,a.z-p.z);if(da>45)continue;if(da+Math.hypot(b.gx-o.x,b.gz-o.z)+50>dd)continue;
  if(da<2.2){p.x=o.x+(Math.random()-.5);p.z=o.z+(Math.random()-.5);b.st={};const gx=b.gx,gz=b.gz;b.gx=null;goal(b,gx,gz,false);return;}b.wps=[];b.gx=a.x;b.gz=a.z;return;}};
// smilšu maisu parapets uz jumtiem ar kāpnēm (aizsegs snaiperim un Javelin šāvējam)
const _setupRoof59=setupRoof;setupRoof=function(ch,b){const had=!!b.lad;_setupRoof59(ch,b);if(had||!b.lad)return;const g=new THREE.Group(),h=b.h,L=[];
 for(const[sx,sz]of[[-1,-1],[1,1],[-1,1],[1,-1]]){const x=b.x+sx*(b.hx-.7),z=b.z+sz*(b.hz-.7);L.push({x:x-sx*1.2,z,hx:1.2,hz:.35},{x,z:z-sz*1.2,hx:.35,hz:1.2});}
 for(const o of L){vadd(g,o.hx*2,.9,o.hz*2,0x9e8a5a,o.x,h+.45,o.z,1);const q={x:o.x,z:o.z,hx:o.hx,hz:o.hz,y0:h,y1:h+.9};addOb(q);ch.obs.push(q);b.obs.push(q);}
 g.updateMatrixWorld(true);mergeInto(g);b.g.add(g);};
const _buildBases59=buildBases;buildBases=function(){_buildBases59();TGR.length=0;TUNS=[];if(!isWar())return;if(WMAP==='field')fieldExtras();else if(WMAP==='city')cityExtras();};
// ---------- dūmu granāta ----------
WP.smk={ic:'💨',dmg:0,rate:1,max:2,give:1,add:1,pel:1,sp:0,life:1,brate:2,rng:16,val:15,av:2};WL.push('smk');
const _giveLoot59=giveLoot;giveLoot=function(k,I,Tm){if(I&&I.ammo&&I.ammo.smk===undefined){I.ammo.smk=0;I.has.smk=false;}
 if(k==='smk'){if(I.ammo.smk>=2)return t('smk_full');I.has.smk=true;I.ammo.smk++;return WP.smk.ic+' '+t('wsmk');}return _giveLoot59(k,I,Tm);};
if(typeof inv!=='undefined'&&inv&&inv.ammo&&inv.ammo.smk===undefined){inv.ammo.smk=0;inv.has.smk=false;}
function smkMesh(){const m=new THREE.Group();vcyl(m,.08,.08,.3,0x6d6d6d,0,0,0,null,8);vcyl(m,.085,.085,.06,0x9e9e9e,0,.12,0,null,8);vadd(m,.03,.08,.12,0xbdbdbd,.06,.18,0,.5);return m;}
const _itemMesh59=itemMesh;itemMesh=function(type){if(type==='smk')return smkMesh();return _itemMesh59(type);};
const _selectW59=selectW;selectW=function(w){const gs=player&&player.userData.guns;if(gs&&!gs.smk&&gs.pistol){const b=smkMesh();b.position.copy(gs.pistol.position);b.rotation.x=-1.3;b.visible=false;gs.pistol.parent.add(b);gs.smk=b;}_selectW59(w);};
WDROP.push('smk');WKILL.push('smk');
const _armoryGive59=armoryGive;armoryGive=function(I){_armoryGive59(I);giveLoot('smk',I,null);giveLoot('smk',I,null);};
const SMK=[],SMKF=[];let plShotT=-99;
function smokeAt(x,z){const g=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:0xd0d0cc,transparent:true,opacity:.0,depthWrite:false});
 for(let i=0;i<14;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),m);const a=i/14*6.283,d=i<4?0:2+Math.random()*3;s.position.set(Math.cos(a)*d,1+Math.random()*1.8,Math.sin(a)*d);s.scale.setScalar(2.2+Math.random()*1.2);g.add(s);}
 g.position.set(x,0,z);scene.add(g);SMK.push({x,z,t0:gtime,end:gtime+15,g,m});sfxAt('door',x,z,30);}
function smokeTick(dt){for(let i=SMK.length-1;i>=0;i--){const s=SMK[i],a=gtime-s.t0,left=s.end-gtime;if(left<=0){scene.remove(s.g);freeObj(s.g);SMK.splice(i,1);continue;}
  s.m.opacity=Math.min(.78,a/1.2*.78)*Math.min(1,left/2.5);s.g.scale.setScalar(.4+Math.min(1,a/1.5)*.8);s.g.rotation.y+=dt*.1;}
 for(let i=SMKF.length-1;i>=0;i--){const q=SMKF[i];q.vy-=20*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.z+=q.vz*dt;q.m.position.set(q.x,q.y,q.z);q.m.rotation.x+=dt*8;
  if(q.y<=.15||(q.y<2.5&&wallAt(q.x,q.z,q.y,null))){scene.remove(q.m);freeObj(q.m);SMKF.splice(i,1);smokeAt(q.x,q.z);if(NET.role==='host')netQ.push({e:'smk',x:r2(q.x),z:r2(q.z)});}}}
function smkThrow(x,y,z,a,pit){const el=Math.max(.2,Math.min(1.1,(pit||0)+.5)),v=17,m=smkMesh();m.position.set(x,y,z);scene.add(m);
 SMKF.push({m,x,y,z,vx:-Math.sin(a)*v*Math.cos(el),vy:v*Math.sin(el),vz:-Math.cos(a)*v*Math.cos(el)});sfxAt('door',x,z,30);}
const _shoot59=shoot;shoot=function(w){if(w!=='smk'){if(w!=='hands')plShotT=gtime;return _shoot59(w);}if(!(inv.ammo.smk>0))return;attackWait=1;inv.ammo.smk--;if(!inv.ammo.smk){inv.has.smk=false;cur='hands';autoGun();}
 smkThrow(player.position.x,pY+1.6,player.position.z,yaw,pitch);updateAmmo();renderInv();renderW();};
const _guestHit59=guestHit;guestHit=function(){if(cur==='smk'&&!NET.meDead&&!buildMode&&inv.ammo.smk>0){attackWait=1;inv.ammo.smk--;if(!inv.ammo.smk){inv.has.smk=false;cur='hands';autoGun();}netSend({t:'fire',w:'smk',a:r2(yaw),p:r2(pitch)});updateAmmo();renderW();return;}_guestHit59();};
const _guestFire59=guestFire;guestFire=function(G,d){if(d.w!=='smk'){G.shT=gtime;return _guestFire59(G,d);}if(G.dead||!(G.I.ammo.smk>0))return;G.I.ammo.smk--;if(!G.I.ammo.smk)G.I.has.smk=false;smkThrow(G.pos.x,(G.y||0)+1.6,G.pos.z,+d.a||0,+d.p||0);netMe(G);};
const _netExtraEv259=netExtraEv2;netExtraEv2=function(e){if(e.e==='smk'){smokeAt(e.x,e.z);return;}_netExtraEv259(e);};
const _botFire59=botFire;botFire=function(b,tp,w,human){b.shT=gtime;return _botFire59(b,tp,w,human);};
const _updateFx59=updateFx;updateFx=function(dt){_updateFx59(dt);if(SMK.length||SMKF.length)smokeTick(dt);};
// ---------- maskēšanās: augstā zāle un dūmi ----------
function smokeCut(ax,az,bx,bz){for(const s of SMK){if(gtime-s.t0<.8)continue;const dx=bx-ax,dz=bz-az,l2=dx*dx+dz*dz||1,k=Math.max(0,Math.min(1,((s.x-ax)*dx+(s.z-az)*dz)/l2));if(Math.hypot(ax+dx*k-s.x,az+dz*k-s.z)<5.5)return true;}return false;}
function hiddenFrom(p,h){const d=Math.hypot(h.p.x-p.x,h.p.z-p.z);if(d<5)return false;if(smokeCut(p.x,p.z,h.p.x,h.p.z))return true;if(d<9||(h.y||0)>.6||!inGrass(h.p.x,h.p.z))return false;
 const st=h.pl?plShotT:h.b?h.b.shT:h.gst?h.gst.shT:null;return!(st!=null&&gtime-st<2.5);}
const _nearestThreat59=nearestThreat;nearestThreat=function(b){if(!isWar()||(!SMK.length&&!TGR.length))return _nearestThreat59(b);const p=b.g.position,hid=[];
 for(let i=HL.length-1;i>=0;i--){const h=HL[i];if(h.team===b.team)continue;if(hiddenFrom(p,h)){hid.push(h);HL.splice(i,1);}}
 try{return _nearestThreat59(b);}finally{for(const h of hid)HL.push(h);}};
const _warTeardown59=warTeardown;warTeardown=function(){_warTeardown59();TGR.length=0;TUNS=[];for(const s of SMK){scene.remove(s.g);freeObj(s.g);}SMK.length=0;};
