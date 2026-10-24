// 05_pasaule.js - Koki, būdiņa, priekšmetu modeļi, fasādes, debesis
// ---------- pasaule ----------
function tree(g,x,z){
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.28,.38,2.2,7),mat(0x6b4a2f,.95));trunk.position.set(x,1.1,z);trunk.castShadow=true;g.add(trunk);
 for(let j=0;j<2;j++){const c=new THREE.Mesh(new THREE.ConeGeometry(1.5-j*.4,1.8,8),mat(0x1e5c2e,.9));c.position.set(x,2.5+j*1,z);c.castShadow=true;g.add(c);}
}
function makeHut(ch,x,z,R,start,key){
 const g=ch.group,w=4,h=2.4,th=.25;
 const add=(sx,sz,px,pz)=>{const m=cube(sx,h,sz,0x8a6a45,.95);m.position.set(x+px,h/2,z+pz);g.add(m);ch.obs.push({x:x+px,z:z+pz,hx:sx/2,hz:sz/2});};
 add(w,th,0,-w/2);add(th,w,-w/2,0);add(th,w,w/2,0);add(1.4,th,-1.3,w/2);add(1.4,th,1.3,w/2);
 const roof=new THREE.Mesh(new THREE.ConeGeometry(3.7,1.6,4),mat(0x6b2f25,.9));roof.position.set(x,h+.8,z);roof.rotation.y=Math.PI/4;roof.castShadow=true;g.add(roof);
 const lo=()=>rollLoot(R,.55);
 const piv=new THREE.Group();piv.position.set(x-.6,0,z+w/2);piv.userData.dyn=true;
 const dm=cube(1.2,2.1,.1,0x5a3d22,.9);dm.position.set(.6,1.05,0);piv.add(dm);g.add(piv);
 const dob={x:x,z:z+w/2,hx:.6,hz:.12};ch.obs.push(dob);
 ch.inter.push({type:'door',id:ch.key+'d'+(ch.dn=(ch.dn||0)+1),x:x,z:z+w/2,r:2.2,open:false,piv,dob,dm,hp:100});
 const cont=o=>{o.id=key+'k'+(ch.cn++);o.ch=ch;if(o.mesh)o.mesh.userData.dyn=true;if(start)o.res=PRES;if(taken.has(o.id)){o.open=true;o.loot=[];if(o.mesh)o.mesh.position[o.ax||'x']+=o.sgn*.4;}ch.inter.push(o);};
 const dress=(px,sgn,loot)=>{
  const body=cube(.5,.9,1.1,0x6e4a2a,.9);body.position.set(x+px,.45,z-.4);g.add(body);ch.obs.push({x:x+px,z:z-.4,hx:.25,hz:.55});
  const d2=cube(.06,.26,.9,0x8a6238,.7);d2.position.set(x+px+sgn*.27,.3,z-.4);g.add(d2);
  const d1=cube(.06,.26,.9,0x9a7040,.7);d1.position.set(x+px+sgn*.27,.62,z-.4);g.add(d1);
  cont({type:'drawer',x:x+px+sgn*.7,z:z-.4,r:1.4,open:false,mesh:d1,sgn,loot});
 };
 dress(-1.62,1,start?['pistol','a_pistol']:lo());dress(1.62,-1,start?['med','armor']:lo());
 for(const yy of [1.05,1.6]){const bd=cube(2.2,.08,.35,0x7a5632,.9);bd.position.set(x,yy,z-w/2+.3);g.add(bd);
  for(let i=0;i<4;i++){const pb=cube(.18,.24,.18,[0xc0392b,0x2980b9,0xf1c40f,0x27ae60][(i+(yy>1.3?1:0))%4],.7);pb.position.set(x-.8+i*.5,yy+.16,z-w/2+.3);g.add(pb);}}
 cont({type:'shelf',x:x,z:z-w/2+1.1,r:1.5,open:false,loot:start?['a_pistol','blk']:lo()});
}
function itemMesh(type){
 const m=new THREE.Group();
 if(type==='pistol'||type==='gun'){const b=cube(.5,.16,.12,0x222a33,.4);const gr=cube(.12,.26,.12,0x3a2a1c,.8);gr.position.set(-.15,-.18,0);m.add(b,gr);}
 else if(type==='m16'){const b=cube(.9,.14,.1,0x1d2228,.4),mg=cube(.1,.24,.08,0x1d2228,.5),st=cube(.22,.18,.1,0x3a2a1c,.8);mg.position.set(.05,-.17,0);st.position.set(-.5,-.02,0);m.add(b,mg,st);}
 else if(type==='shot'){const b=cube(.95,.12,.1,0x2a2a2a,.4),st=cube(.3,.18,.11,0x6b4a2f,.8);st.position.set(-.5,-.03,0);m.add(b,st);}
 else if(type==='rpg'){const b=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,1.1,8),mat(0x4b5d3a,.7));b.rotation.z=Math.PI/2;const h=new THREE.Mesh(new THREE.ConeGeometry(.15,.3,8),mat(0xb5651d,.6));h.rotation.z=-Math.PI/2;h.position.x=.68;m.add(b,h);}
 else if(type==='med'){const b=cube(.42,.3,.3,0xf2f2f2,.5),c1=cube(.3,.06,.08,0xd62828,.5),c2=cube(.08,.06,.3,0xd62828,.5);c1.position.y=.16;c2.position.y=.16;m.add(b,c1,c2);}
 else if(type==='armor'){const b=cube(.5,.55,.2,0x34495e,.6);b.material.emissive.set(0x0d2a40);const s=cube(.52,.1,.22,0x5dade2,.5);s.position.y=.12;m.add(b,s);}
 else if(type==='blk'){const b=cube(.45,.45,.45,0x8a8276,.95);b.material.emissive.set(0x1a1712);m.add(b);}
 else if(type==='door_i'){const b=cube(.4,.75,.08,0x6b4423,.9),h=cube(.06,.06,.1,0xd4ac0d,.4);h.position.set(.12,0,.05);m.add(b,h);}
 else if(type==='win_i'){const b=cube(.55,.55,.06,0xa8dcff,.1);b.material.emissive.set(0x204860);const f=cube(.6,.06,.08,0x6b4423,.9),f2=f.clone();f.position.y=.29;f2.position.y=-.29;m.add(b,f,f2);}
 else if(type==='match'){const b=cube(.3,.08,.2,0xc0392b,.7);for(let i=0;i<3;i++){const s=cube(.03,.03,.28,0xf5deb3,.8);s.position.set(-.08+i*.08,.06,0);const h=cube(.05,.05,.05,0xd35400,.6);h.position.set(-.08+i*.08,.06,.15);m.add(s,h);}m.add(b);}
 else if(type==='bag'){const b=cube(.55,.38,.38,0x6b5a3a,.9),s=cube(.57,.08,.4,0x3a2a1c,.9);s.position.y=.08;m.add(b,s);}
 else{const col={a_pistol:0xd4a537,a_m16:0x8a9a3a,a_shot:0xc0392b,a_rpg:0xd35400}[type]||0xd4a537;const b=cube(.34,.22,.22,col,.35);b.material.emissive.set(0x553300);m.add(b);}
 return m;
}
function makeItem(ch,type,x,z,id){
 if(taken.has(id))return;
 const m=itemMesh(type);m.userData.dyn=true;
 m.position.set(x,.6,z);ch.group.add(m);ch.items.push({m,type,id,x,z});
}
let AM=null,PM=null,FAC=null,BB=null,BMAT=null;
function mkFacade(){
 const c=document.createElement('canvas');c.width=128;c.height=128;const g=c.getContext('2d');
 g.fillStyle='#6d7168';g.fillRect(0,0,128,128);
 for(let y=0;y<4;y++)for(let x=0;x<4;x++){g.fillStyle=Math.random()<.2?'#6d7168':'#1b1f1c';g.fillRect(x*32+6,y*32+6,20,20);}
 for(let i=0;i<120;i++){g.fillStyle=Math.random()<.5?'rgba(40,70,40,.2)':'rgba(30,30,28,.2)';g.fillRect(Math.random()*128,Math.random()*128,2+Math.random()*10,2+Math.random()*10);}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}
function mixc(a,b,k){return '#'+new THREE.Color(a).lerp(new THREE.Color(b),k).getHexString();}
function drawSky(k){
 if(!skyC){skyC=document.createElement('canvas');skyC.width=2;skyC.height=256;skyTex=new THREE.CanvasTexture(skyC);}
 const g=skyC.getContext('2d'),gr=g.createLinearGradient(0,0,0,256);
 gr.addColorStop(0,mixc('#44506a','#0b1020',k));gr.addColorStop(.5,mixc('#8a8f9c','#262b40',k));gr.addColorStop(.62,mixc('#c9a583','#4a3345',k));gr.addColorStop(1,mixc('#e8b27a','#5a3436',k));
 g.fillStyle=gr;g.fillRect(0,0,2,256);skyTex.needsUpdate=true;
 scene.fog.color.set(mixc('#8d8e92','#1c202c',k));
 hemi.intensity=1.3-.85*k;sun.intensity=2-1.5*k;sun.color.set(mixc('#ffc58a','#8294c8',k));amb.intensity=.4-.15*k;
 for(const o of skyline.children){const m=o.material;if(!m.userData.c0)m.userData.c0=m.color.clone();m.color.copy(m.userData.c0).multiplyScalar(1-.75*k);}
}
