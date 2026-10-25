// 03_pamati.js - mat, cube, say, veselība, valoda, init (aina, gaisma, spēlētājs)
const mat=(c,r=.88)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:.05});
function cube(w,h,d,c,r){let m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c,r));m.castShadow=true;m.receiveShadow=true;return m;}
function say(s,dur){const m=$('msg');m.textContent=s;m.classList.add('show');msgWait=dur||Math.max(1.8,s.length/20);}
function updateHealth(){
 $('hptext').textContent=Math.ceil(health)+' / 100';
 $('fill').style.width=health+'%';
 $('fill').style.background=health>60?'linear-gradient(90deg,#2ecc71,#27ae60)':health>25?'linear-gradient(90deg,#f39c12,#e67e22)':'linear-gradient(90deg,#e74c3c,#c0392b)';
 $('hpstate').textContent=(health>60?t('ok'):health>25?t('warn'):t('crit'))+(inv&&inv.armor>0?' · 🛡️ '+Math.ceil(inv.armor):'');
 $('afill').style.width=(inv?inv.armor:0)+'%';
}
function applyLang(){
 document.querySelectorAll('[data-k]').forEach(e=>{e.innerHTML=t(e.dataset.k);});
 const n=$('nickname');if(n.value==='Spēlētājs'||n.value==='Player')n.value=t('pl');
 $('lang').textContent=L==='lv'?'EN':'LV';document.documentElement.lang=L;updateHealth();renderInv();renderTeam();clkM=-1;if(scene)updateClock();
}
function flashHurt(){
 const f=$('hurtFlash');f.style.opacity='1';setTimeout(()=>f.style.opacity='0',160);
}
function init(){
 scene=new THREE.Scene();scene.fog=new THREE.Fog(0x8d8e92,25,78);
 camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,250);
 renderer=new THREE.WebGLRenderer({antialias:!TOUCH,powerPreference:'high-performance'});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,TOUCH?1.25:1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=TOUCH?THREE.PCFShadowMap:THREE.PCFSoftShadowMap;document.body.appendChild(renderer.domElement);
 hemi=new THREE.HemisphereLight(0xb9c6d8,0x3b4a30,1.3);scene.add(hemi);
 sun=new THREE.DirectionalLight(0xffc58a,2.0);sun.position.set(-25,40,15);sun.castShadow=true;sun.shadow.mapSize.set(TOUCH?1024:2048,TOUCH?1024:2048);sun.shadow.camera.left=-60;sun.shadow.camera.right=60;sun.shadow.camera.top=60;sun.shadow.camera.bottom=-60;sun.shadow.bias=-0.0005;scene.add(sun);scene.add(sun.target);
 amb=new THREE.AmbientLight(0x8090a0,.4);scene.add(amb);
 skyline=new THREE.Group();
 for(let i=0;i<30;i++){const a=i/30*6.283+Math.random()*.2,r=140+Math.random()*30,w=10+Math.random()*10,h=35+Math.random()*50;
  const mt=new THREE.MeshBasicMaterial({color:new THREE.Color().setHSL(.6,.1,.36+Math.random()*.07),fog:false});
  const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,w*.8),mt);b.position.set(Math.cos(a)*r,h/2-2,Math.sin(a)*r);skyline.add(b);
  const t=new THREE.Mesh(new THREE.BoxGeometry(w*.4,h*.2,w*.4),mt);t.position.set(b.position.x+(Math.random()-.5)*w*.3,h*1.1-2,b.position.z);skyline.add(t);}
 // apvāršņa mājas: viens zīmējums 60 vietā
 skyline.updateMatrixWorld(true);{const list=[...skyline.children],G=mergeMeshes(list,true);list.forEach(o=>{skyline.remove(o);o.geometry.dispose();o.material.dispose();});skyline.add(new THREE.Mesh(G,new THREE.MeshBasicMaterial({vertexColors:true,fog:false})));}
 scene.add(skyline);drawSky(0);scene.background=skyTex;
 floor=new THREE.Mesh(new THREE.PlaneGeometry(600,600),new THREE.MeshStandardMaterial({color:0x44603a,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.05;floor.receiveShadow=true;scene.add(floor);
 grid=new THREE.GridHelper(120,60,0x2f5229,0x4a7a42);grid.visible=false;scene.add(grid);
 player=new THREE.Group();
 const torso=cube(.7,.8,.36,0x2c5f8a,.75);torso.position.y=1.1;player.add(torso);
 const chest=cube(.72,.32,.38,0x3a7ab8,.7);chest.position.y=1.35;player.add(chest);
 const head=cube(.46,.46,.44,0xe0b48f,.8);head.position.y=1.75;player.add(head);
 const hair=cube(.48,.12,.46,0x2b1c12,.9);hair.position.y=2.0;player.add(hair);
 const leg1=cube(.26,.68,.28,0x1f2d42,.9);leg1.position.set(-.18,.4,0);player.add(leg1);
 const leg2=cube(.26,.68,.28,0x1f2d42,.9);leg2.position.set(.18,.4,0);player.add(leg2);
 const boot1=cube(.28,.14,.34,0x111820,.9);boot1.position.set(-.18,.07,.02);player.add(boot1);
 const boot2=cube(.28,.14,.34,0x111820,.9);boot2.position.set(.18,.07,.02);player.add(boot2);
 const arm1=cube(.2,.62,.24,0xe0b48f,.8);arm1.position.set(-.48,1.1,0);player.add(arm1);
 const arm2=cube(.2,.62,.24,0xe0b48f,.8);arm2.position.set(.48,1.1,0);player.add(arm2);
 // ieroči rokā (redzams tikai izvēlētais)
 const guns={pistol:cube(.1,.15,.34,0x222a33,.4),m16:cube(.09,.15,.85,0x1d2228,.4),shot:cube(.1,.13,.9,0x4a3020,.6),rpg:new THREE.Mesh(new THREE.BoxGeometry(.18,.18,1.05),mat(0x4b5d3a,.7))};
 for(const k in guns){const g=guns[k],f=k==='pistol'?.1:.3;g.position.set(0,-.34-f*.964,-f*.267);g.rotation.x=-1.3;g.visible=false;g.castShadow=true;arm2.add(g);}
 player.userData={leg1,leg2,arm1,arm2,boot1,boot2,guns};scene.add(player);
 clock=new THREE.Clock();
 window.addEventListener('resize',resize);
 renderer.domElement.addEventListener('click',()=>{if(active&&!TOUCH)renderer.domElement.requestPointerLock?.();});
 document.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement){yaw-=e.movementX*.0022;pitch=clampP(pitch-e.movementY*.0018);}});
}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const CS=40;
