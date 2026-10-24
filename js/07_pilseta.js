// 07_pilseta.js - Mājas, mašīnas, mežs, pilsētas gabali (chunk), apvienošana ātrumam
function bashDoor(z,o,dt){
 z.userData.da=(z.userData.da||0)-dt;
 if(z.userData.da>0||Math.hypot(o.x-z.position.x,o.z-z.position.z)>1.9)return;
 z.userData.da=.9;o.hp-=20;
 const near=Math.hypot(o.x-player.position.x,o.z-player.position.z)<35;
 if(near)sfx('bang');
 o.dm.material.color.setHex(o.hp>60?0x5a3d22:o.hp>30?0x4a2a18:0x2e170d);
 if(o.hp<=0){o.dob.off=true;o.piv.visible=false;o.r=0;o.open=true;if(near)say(t('doorbroke'));}
}
function cont(ch,o){o.id=ch.key+'k'+(ch.cn++);o.ch=ch;if(o.mesh)o.mesh.userData.dyn=true;if(taken.has(o.id)){o.open=true;o.loot=[];if(o.mesh)o.mesh.position[o.ax||'x']+=o.sgn*.4;}ch.inter.push(o);}
function furnish(ch,R,ax,backZ){
 const lo=()=>rollLoot(R,.4);
 const body=cube(1.1,.9,.5,0x6e4a2a,.9);body.position.set(ax,.45,backZ+.25);ch.group.add(body);ch.obs.push({x:ax,z:backZ+.25,hx:.55,hz:.25});
 const d1=cube(.9,.26,.06,0x9a7040,.7);d1.position.set(ax,.62,backZ+.53);ch.group.add(d1);
 const d2=cube(.9,.26,.06,0x8a6238,.7);d2.position.set(ax,.3,backZ+.53);ch.group.add(d2);
 cont(ch,{type:'drawer',x:ax,z:backZ+1.0,r:1.4,open:false,mesh:d1,sgn:1,ax:'z',loot:lo()});
 for(const yy of [1.35,1.85]){const bd=cube(1.6,.08,.35,0x7a5632,.9);bd.position.set(ax,yy,backZ+.2);ch.group.add(bd);
  for(let i=0;i<3;i++){const pb=cube(.18,.24,.18,[0xc0392b,0x2980b9,0xf1c40f,0x27ae60][(i+(yy>1.5?1:0))%4],.7);pb.position.set(ax-.5+i*.5,yy+.16,backZ+.2);ch.group.add(pb);}}
 cont(ch,{type:'shelf',x:ax+.9,z:backZ+1.2,r:1.3,open:false,loot:lo()});
 const bed=cube(1.1,.45,1.9,0x5b6b7c,1);bed.position.set(ax-1,.22,backZ+3);ch.group.add(bed);ch.obs.push({x:ax-1,z:backZ+3,hx:.55,hz:.95});
}
function makeTower(ch,x,z,R,low){
 const w=(low?7:8)+R()*(low?3:5),d=(low?7:8)+R()*(low?3:5),h=low?4.4+R()*2.5:14+R()*26,H0=3.2,t=.4,g=2;
 if(!FAC)FAC=mkFacade();
 const tx=FAC.clone();tx.needsUpdate=true;tx.repeat.set(w/5,(h-H0)/5);
 const up=new THREE.Mesh(new THREE.BoxGeometry(w,h-H0,d),new THREE.MeshStandardMaterial({map:tx,roughness:1}));
 up.position.set(x,H0+(h-H0)/2,z);up.castShadow=true;up.receiveShadow=true;ch.group.add(up);
 const t2=FAC.clone();t2.needsUpdate=true;t2.repeat.set(1,.7);const wm=new THREE.MeshStandardMaterial({map:t2,roughness:1});
 const wall=(sx,sy,sz,px,py,pz,ob)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),wm);m.position.set(px,py,pz);m.castShadow=true;m.receiveShadow=true;ch.group.add(m);if(ob)ch.obs.push({x:px,z:pz,hx:sx/2,hz:sz/2});};
 const fz=z+d/2-t/2,bz=z-d/2+t/2,sl=(w-g)/2,pl=d*.55;
 wall(w,H0,t,x,H0/2,bz,1);wall(t,H0,d,x-w/2+t/2,H0/2,z,1);wall(t,H0,d,x+w/2-t/2,H0/2,z,1);
 wall(sl,H0,t,x-g/2-sl/2,H0/2,fz,1);wall(sl,H0,t,x+g/2+sl/2,H0/2,fz,1);wall(g,H0-2.4,t,x,2.4+(H0-2.4)/2,fz,0);
 wall(t,H0,pl,x,H0/2,z-d/2+t+pl/2,1);
 const piv=new THREE.Group();piv.position.set(x-g/2,0,fz);piv.userData.dyn=true;
 const dm=cube(g,2.4,.1,0x4a3a2c,.9);dm.position.set(g/2,1.2,0);piv.add(dm);ch.group.add(piv);
 const dob={x:x,z:fz,hx:g/2,hz:.15};ch.obs.push(dob);
 ch.inter.push({type:'door',id:ch.key+'d'+(ch.dn=(ch.dn||0)+1),x:x,z:fz+.2,r:2.4,open:false,piv,dob,dm,hp:100,apt:true});
 const backZ=z-d/2+t;furnish(ch,R,x-w/4,backZ);furnish(ch,R,x+w/4,backZ);
 for(let i=0;i<3;i++){const bw=w*(.25+R()*.3),bd=d*(.25+R()*.3),bh=1.5+R()*(low?1.5:5);const b=cube(bw,bh,bd,0x666a62,1);b.position.set(x+(R()-.5)*(w-bw),h+bh/2,z+(R()-.5)*(d-bd));ch.group.add(b);}
 for(let i=0;i<3;i++){const v=cube(1.5+R()*2,1+R(),1.5+R()*2,0x2f6b2f,1);v.castShadow=false;v.position.set(x+(R()-.5)*w*.8,h+.4,z+(R()-.5)*d*.8);ch.group.add(v);}
 for(let i=0;i<4;i++){const f=R()<.5,vh=2+R()*Math.min(8,h-H0-1),s2=R()<.5?1:-1;const v=cube(f?.5+R()*.8:.15,vh,f?.15:.5+R()*.8,0x2c6a30,1);v.castShadow=false;
  v.position.set(f?x+(R()-.5)*w*.8:x+s2*(w/2+.08),H0+vh/2+R()*(h-H0-vh)*.8,f?z+s2*(d/2+.08):z+(R()-.5)*d*.8);ch.group.add(v);}
}
function makeCar(ch,x,z,alongX,R){
 const g=new THREE.Group(),c=[0x6b4a32,0x5c4a3c,0x4a4f4d,0x7a5538][Math.floor(R()*4)];
 const wh=cube(3.4,.4,1.9,0x111111,1);wh.position.y=.2;
 const body=cube(4.2,.8,1.8,c,1);body.position.y=.7;
 const cab=cube(2.2,.7,1.7,c,1);cab.position.set(-.2,1.45,0);
 const win=cube(2.25,.35,1.76,0x151a1c,.3);win.position.set(-.2,1.5,0);
 const veg=cube(1.4,.15,.8,0x2f6b2f,1);veg.castShadow=false;veg.position.set(.5,1.15,.3);
 g.add(wh,body,cab,win,veg);g.position.set(x,0,z);if(!alongX)g.rotation.y=Math.PI/2;ch.group.add(g);
 ch.obs.push(alongX?{x,z,hx:2.1,hz:.95}:{x,z,hx:.95,hz:2.1});
}
function makeBus(ch,x,z,alongX){
 const g=new THREE.Group();
 const body=cube(10,2.4,2.5,0x8a6a35,1);body.position.y=1.5;
 const win=cube(10.05,.7,2.55,0x151a1c,.3);win.position.y=2.1;
 const veg=cube(3,.2,1.5,0x2f6b2f,1);veg.castShadow=false;veg.position.set(1,2.8,0);
 const wh=cube(8,.5,2.3,0x111111,1);wh.position.y=.25;
 g.add(wh,body,win,veg);g.position.set(x,0,z);if(!alongX)g.rotation.y=Math.PI/2;ch.group.add(g);
 ch.obs.push(alongX?{x,z,hx:5.05,hz:1.3}:{x,z,hx:1.3,hz:5.05});
}
function makeLamp(ch,x,z,R){
 const g=new THREE.Group();
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.08,.11,5,6),mat(0x3a3a38,1));pole.position.y=2.5;
 const arm=cube(1.4,.08,.08,0x3a3a38,1);arm.position.set(.6,5,0);
 const head=cube(.5,.15,.25,0x2a2a2a,1);head.position.set(1.2,4.95,0);
 g.add(pole,arm,head);g.position.set(x,0,z);g.rotation.z=(R()-.5)*.25;g.rotation.y=R()*6.28;ch.group.add(g);
 ch.obs.push({x,z,hx:.2,hz:.2});
}
function makeBillboard(ch,x,z,R){
 if(!BB){const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');g.fillStyle='#5b6360';g.fillRect(0,0,512,256);
  for(let i=0;i<200;i++){g.fillStyle='rgba(30,50,30,.25)';g.fillRect(Math.random()*512,Math.random()*256,3+Math.random()*20,3+Math.random()*12);}
  g.fillStyle='#c8cfc8';g.font='bold 46px Arial';g.fillText('Welcome to',50,100);g.fillText('a new world...',110,170);BB=new THREE.CanvasTexture(c);}
 const dk=mat(0x3a3f3c,1),g=new THREE.Group();
 const board=new THREE.Mesh(new THREE.BoxGeometry(8,3.5,.3),[dk,dk,dk,dk,new THREE.MeshStandardMaterial({map:BB,roughness:1}),dk]);board.position.y=5.5;board.castShadow=true;
 for(const px of [-3.3,3.3]){const po=cube(.3,5,.3,0x3a2a1c,1);po.position.set(px,2.5,-.2);g.add(po);}
 const vine=cube(1.2,2.2,.15,0x2c6a30,1);vine.castShadow=false;vine.position.set(-3,5,.2);g.add(board,vine);
 g.position.set(x,0,z);g.rotation.y=R()<.5?Math.PI/2:-Math.PI/2;ch.group.add(g);
 ch.obs.push({x,z:z-3.3,hx:.3,hz:.3},{x,z:z+3.3,hx:.3,hz:.3});
}
// mežs aiz pilsētas (koki kā instanced mesh, lai spēle nebremzē)
function genWild(ch,R,ox,oz,deep,free,key){
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(CS,CS),new THREE.MeshStandardMaterial({color:0x2f4a2a,roughness:1}));gr.rotation.x=-Math.PI/2;gr.position.set(ox+20,.005,oz+20);gr.receiveShadow=true;ch.group.add(gr);
 if(!deep&&R()<.3)makeHut(ch,ox+20,oz+20,R,false,key);
 const pts=[],n=deep?60:42;
 for(let i=0;i<n;i++){const x=ox+R()*CS,z=oz+R()*CS;if(!free(x,z))continue;const s=.8+R()*.7;pts.push([x,z,s]);ch.obs.push({x,z,hx:.3*s,hz:.3*s});}
 const tr=new THREE.InstancedMesh(new THREE.CylinderGeometry(.28,.38,2.2,6),mat(0x5a3f28,.95),Math.max(1,pts.length)),co=new THREE.InstancedMesh(new THREE.ConeGeometry(1.5,1.8,7),mat(0x173f22,.9),Math.max(1,pts.length*2));
 tr.count=pts.length;co.count=pts.length*2;
 const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),P=new THREE.Vector3();
 pts.forEach(([x,z,s],i)=>{S.set(s,s,s);P.set(x,1.1*s,z);M.compose(P,Q,S);tr.setMatrixAt(i,M);for(let j=0;j<2;j++){const k=1-j*.27;S.set(s*k,s,s*k);P.set(x,(2.5+j)*s,z);M.compose(P,Q,S);co.setMatrixAt(i*2+j,M);}});
 tr.castShadow=co.castShadow=true;tr.receiveShadow=co.receiveShadow=true;ch.group.add(tr,co);
 for(let i=0;i<8;i++){const x=ox+R()*CS,z=oz+R()*CS;if(!free(x,z))continue;const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.6+R()*.7,0),mat(0x234a22,1));b.position.set(x,.3,z);b.scale.y=.7;ch.group.add(b);}
 for(let i=0;i<4;i++){const x=ox+R()*CS,z=oz+R()*CS;if(!free(x,z))continue;const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.3+R()*.6,0),mat(0x6b7280,.95));r.position.set(x,.25,z);r.rotation.set(R()*3,R()*3,R()*3);r.castShadow=true;ch.group.add(r);}
 if(!deep&&R()<.45){const x=ox+R()*CS,z=oz+R()*CS;if(free(x,z))makeItem(ch,R()<.45?pickWeapon(R):pickGround(R),x,z,key+'f');}
 if(!deep)for(let i=0;i<4;i++){const x=ox+R()*CS,z=oz+R()*CS;if(R()<.6&&free(x,z))makeItem(ch,pickForest(R),x,z,key+'r'+i);} // meža resursi
}
function genChunk(cx,cz){
 const key=cx+','+cz,R=rng(Math.imul(cx,73856093)^Math.imul(cz,19349663)),ch={group:new THREE.Group(),obs:[],items:[],inter:[],cn:0,key};
 const ox=cx*CS,oz=cz*CS,P=()=>[ox+R()*CS,oz+R()*CS],ns=(x,z)=>Math.hypot(x,z)<14||Math.hypot(x-10,z+14)<12;
 const free=(x,z)=>!ch.obs.some(o=>Math.abs(x-o.x)<o.hx+.8&&Math.abs(z-o.z)<o.hz+.8);
 const zc=Math.max(Math.abs(ox+20),Math.abs(oz+20));
 if(zc>CITY){genWild(ch,R,ox,oz,zc>EDGE,free,key);}
 else{
 if(!AM){AM=new THREE.MeshStandardMaterial({color:0x2b2e30,roughness:.95});PM=new THREE.MeshStandardMaterial({color:0x2a3a4a,roughness:.05,metalness:.5,emissive:0x1a2a3a});AM.userData.keep=PM.userData.keep=true;}
 const rd=(w,d)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),AM);m.rotation.x=-Math.PI/2;m.position.set(ox+20,.01,oz+20);m.receiveShadow=true;ch.group.add(m);};
 rd(CS,8);rd(8,CS);
 for(let i=0;i<3;i++){const hz=R()<.5,px=hz?ox+R()*CS:ox+17+R()*6,pz=hz?oz+17+R()*6:oz+R()*CS;const pd=new THREE.Mesh(new THREE.CircleGeometry(1+R()*2,14),PM);pd.rotation.x=-Math.PI/2;pd.scale.set(1,.6,1);pd.position.set(px,.02,pz);ch.group.add(pd);}
 for(let q=0;q<4;q++){
  const qx=ox+(q&1?24:0)+8,qz=oz+(q&2?24:0)+8,r=R();
  if(ns(qx,qz))continue;
  if(r<.1)makeHut(ch,qx,qz,R,false,key);
  else if(r<.5)makeTower(ch,qx,qz,R,false);
  else if(r<.68)makeTower(ch,qx,qz,R,true);
 }
 const start=cx===0&&cz===0;
 if(start)makeHut(ch,10,-14,R,true,key);
 for(let i=0;i<2;i++){const hz=R()<.5,a=R()*CS,bn=17.5+R()*5,x=hz?ox+a:ox+bn,z=hz?oz+bn:oz+a;if(!ns(x,z))makeCar(ch,x,z,hz,R);}
 if(R()<.2){const hz=R()<.5,a=5+R()*30,bn=18+R()*4,x=hz?ox+a:ox+bn,z=hz?oz+bn:oz+a;if(!ns(x,z))makeBus(ch,x,z,hz);}
 for(let i=0;i<2;i++){const hz=R()<.5,a=R()*CS,e=R()<.5?15.4:24.6,x=hz?ox+a:ox+e,z=hz?oz+e:oz+a;if(!ns(x,z))makeLamp(ch,x,z,R);}
 if(R()<.2){const bx=ox+14.8,bz=oz+(R()<.5?4+R()*8:28+R()*8);if(!ns(bx,bz)&&free(bx,bz))makeBillboard(ch,bx,bz,R);}
 for(let i=0;i<4;i++){const[x,z]=P();if(ns(x,z)||!free(x,z))continue;tree(ch.group,x,z);ch.obs.push({x,z,hx:.3,hz:.3});}
 for(let i=0;i<6;i++){const[x,z]=P();if(!free(x,z))continue;const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.6+R()*.7,0),mat(0x2f5f2c,1));b.position.set(x,.3,z);b.scale.y=.7;ch.group.add(b);}
 for(let i=0;i<3;i++){const[x,z]=P();if(!free(x,z))continue;const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.3+R()*.5,0),mat(0x6b7280,.95));r.position.set(x,.25,z);r.rotation.set(R()*3,R()*3,R()*3);r.castShadow=true;ch.group.add(r);}
 if(R()<.5){const[x,z]=P();if(free(x,z))makeItem(ch,pickGround(R),x,z,key+'g');}
 if(R()<.25){const[x,z]=P();if(free(x,z))makeItem(ch,'med',x,z,key+'e');}
 if(R()<.25){const[x,z]=P();if(free(x,z))makeItem(ch,pickWeapon(R),x,z,key+'w');}
 if(R()<.12){const[x,z]=P();if(free(x,z))makeItem(ch,pickWeapon(R),x,z,key+'v');}
 }
 for(const o of ch.obs)addOb(o);
 mergeChunk(ch);
 scene.add(ch.group);chunks.set(key,ch);
}
// ātrumam: nekustīgās detaļas ar vienādu materiālu apvieno vienā ģeometrijā (simtiem zīmējumu vietā daži desmiti)
function mergeChunk(ch){
 if(/nomerge/.test(location.search))return;
 const g=ch.group;g.updateMatrixWorld(true);
 const skip=new Set();g.traverse(o=>{if(o.userData.dyn)o.traverse(c=>skip.add(c));});
 const groups=new Map();
 g.traverse(o=>{
  if(!o.isMesh||o.isInstancedMesh||skip.has(o)||Array.isArray(o.material))return;
  const m=o.material;if(m.transparent||!o.geometry.attributes.normal)return;
  const k=(m.map?m.map.uuid:'-')+'|'+m.color.getHex()+'|'+m.roughness+'|'+m.metalness+'|'+m.emissive.getHex()+'|'+o.castShadow;
  let e=groups.get(k);if(!e){e={m,list:[],cast:o.castShadow};groups.set(k,e);}e.list.push(o);
 });
 for(const e of groups.values()){
  if(e.list.length<2)continue;
  const G=mergeMeshes(e.list,false);
  for(const o of e.list){o.parent.remove(o);o.geometry.dispose();if(o.material!==e.m&&!o.material.userData.keep)o.material.dispose();}
  const mesh=new THREE.Mesh(G,e.m);mesh.castShadow=e.cast;mesh.receiveShadow=true;g.add(mesh);
 }
}
// apvieno vairāku meshu ģeometriju vienā (pēc pasaules matricām); ar withColor ieliek katra mesha krāsu virsotnēs
function mergeMeshes(list,withColor){
 const v=new THREE.Vector3(),nm=new THREE.Matrix3();
 let nv=0,ni=0;for(const o of list){const gg=o.geometry;nv+=gg.attributes.position.count;ni+=gg.index?gg.index.count:gg.attributes.position.count;}
 const P=new Float32Array(nv*3),N=new Float32Array(nv*3),U=new Float32Array(nv*2),C=withColor?new Float32Array(nv*3):null,I=nv>65000?new Uint32Array(ni):new Uint16Array(ni);let vo=0,io=0;
 for(const o of list){const gg=o.geometry,pa=gg.attributes.position,na=gg.attributes.normal,ua=gg.attributes.uv,M=o.matrixWorld,col=withColor?o.material.color:null;nm.getNormalMatrix(M);
  for(let i=0;i<pa.count;i++){const j=(vo+i)*3;v.fromBufferAttribute(pa,i).applyMatrix4(M);P[j]=v.x;P[j+1]=v.y;P[j+2]=v.z;v.fromBufferAttribute(na,i).applyMatrix3(nm).normalize();N[j]=v.x;N[j+1]=v.y;N[j+2]=v.z;if(ua){U[(vo+i)*2]=ua.getX(i);U[(vo+i)*2+1]=ua.getY(i);}if(C){C[j]=col.r;C[j+1]=col.g;C[j+2]=col.b;}}
  if(gg.index){for(let i=0;i<gg.index.count;i++)I[io+i]=gg.index.getX(i)+vo;io+=gg.index.count;}else{for(let i=0;i<pa.count;i++)I[io+i]=vo+i;io+=pa.count;}
  vo+=pa.count;}
 const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.BufferAttribute(P,3));G.setAttribute('normal',new THREE.BufferAttribute(N,3));G.setAttribute('uv',new THREE.BufferAttribute(U,2));if(C)G.setAttribute('color',new THREE.BufferAttribute(C,3));G.setIndex(new THREE.BufferAttribute(I,1));G.computeBoundingSphere();
 return G;
}
function updateChunks(){
 const pcx=Math.floor(player.position.x/CS),pcz=Math.floor(player.position.z/CS);
 for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){if(!chunks.has((pcx+dx)+','+(pcz+dz)))genChunk(pcx+dx,pcz+dz);}
 // kopīgajā spēlē saimnieks tur ielādētu pasauli arī ap pārējiem spēlētājiem (sadursmēm un laupījumam)
 const cs=[[pcx,pcz,3]];if(typeof netGuestCenters==='function')for(const c of netGuestCenters()){const gx=Math.floor(c.x/CS),gz=Math.floor(c.z/CS);cs.push([gx,gz,2]);for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){if(!chunks.has((gx+dx)+','+(gz+dz)))genChunk(gx+dx,gz+dz);}}
 for(const[k,ch]of chunks){const[cx,cz]=k.split(',').map(Number);if(cs.every(([x,z,r])=>Math.abs(cx-x)>r||Math.abs(cz-z)>r)){ch.obs.forEach(o=>remOb(o));scene.remove(ch.group);ch.group.traverse(o=>{if(o.isMesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.userData.keep)return;if(m.map)m.map.dispose();m.dispose();});}});chunks.delete(k);}}
}
