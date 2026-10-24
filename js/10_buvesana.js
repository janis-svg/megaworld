// 10_buvesana.js - Kluči, durvis, būvēšanas režīms
// ---------- būvēšana: kluči un durvis ----------
const BG=new THREE.BoxGeometry(1,1,1),DG=new THREE.BoxGeometry(.98,2,.98);
function blockMat(){if(!BMAT){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#7a7368';g.fillRect(0,0,64,64);g.fillStyle='#5d564c';for(let y=0;y<4;y++){g.fillRect(0,y*16,64,2);const o=y%2?16:0;for(let x=0;x<3;x++)g.fillRect(o+x*32-1,y*16,2,16);}for(let i=0;i<60;i++){g.fillStyle=Math.random()<.5?'rgba(0,0,0,.12)':'rgba(255,255,255,.07)';g.fillRect(Math.random()*64,Math.random()*64,2+Math.random()*5,2+Math.random()*5);}BMAT=new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),roughness:.95});}return BMAT;}
function colTop(x,z){const c=blocks.get(x+','+z);let h=0;if(c)for(const b of c)h=Math.max(h,b.y1);return h;}
function placeBlock(x,z,Tm,door){
 const k=x+','+z;let c=blocks.get(k);if(!c){c=[];blocks.set(k,c);}const y0=colTop(x,z),hh=door?2:1;
 let m=null;if(door){m=new THREE.Mesh(DG,new THREE.MeshStandardMaterial({color:0x5a3d22,roughness:.9,transparent:true}));const s=cube(1.02,.16,1.02,Tm.color,.6);s.position.y=.7;m.add(s);m.castShadow=m.receiveShadow=true;m.position.set(x,y0+hh/2,z);scene.add(m);}
 const b={x,z,hx:.5,hz:.5,y0,y1:y0+hh,hp:door?160:100,team:Tm,door:!!door,mesh:m,key:k};c.push(b);addOb(b);if(door)doors.push(b);
 if(!door){bim();b.ii=BIM.count;blkArr[b.ii]=b;BIM.count++;setBM(b);}
 sfxAt('build',x,z,30);return b;
}
function removeBlock(b,fall){
 if(b.dead)return;b.dead=true;remOb(b);
 if(b.door){scene.remove(b.mesh);b.mesh.material.dispose();const i=doors.indexOf(b);if(i>=0)doors.splice(i,1);}
 else{const last=BIM.count-1;if(b.ii!==last){const lb=blkArr[last];lb.ii=b.ii;blkArr[b.ii]=lb;setBM(lb);}BIM.count--;blkArr.length=BIM.count;BIM.instanceMatrix.needsUpdate=true;}
 const c=blocks.get(b.key);if(c){c.splice(c.indexOf(b),1);if(fall){const h=b.y1-b.y0;for(const o of c)if(o.y0>=b.y1){o.y0-=h;o.y1-=h;if(o.door)o.mesh.position.y-=h;else setBM(o);}}if(!c.length)blocks.delete(b.key);}
}
// visi kluči ir viena InstancedMesh (viens zīmējums tūkstošiem klucīšu)
let BIM=null;const blkArr=[],_BM=new THREE.Matrix4();
function bim(){if(!BIM){BIM=new THREE.InstancedMesh(BG,blockMat(),5000);BIM.count=0;BIM.castShadow=BIM.receiveShadow=true;BIM.frustumCulled=false;scene.add(BIM);}return BIM;}
function setBM(b){_BM.makeTranslation(b.x,b.y0+.5,b.z);BIM.setMatrixAt(b.ii,_BM);BIM.instanceMatrix.needsUpdate=true;}
function damageBlock(b,d){if(b.dead)return;b.hp-=d;debris(b.x,b.y0+.5,b.z,0x7a7368,3);if(b.door){b.mesh.position.x=b.x+(Math.random()-.5)*.1;setTimeout(()=>{b.mesh.position.x=b.x;},90);}if(b.hp<=0){debris(b.x,b.y0+.5,b.z,0x7a7368,8);removeBlock(b,true);sfxAt('bang',b.x,b.z,40);}}
function canPlace(x,z,hh){
 const y0=colTop(x,z);if(y0+hh>7||Math.abs(x)>EDGE-3||Math.abs(z)>EDGE-3||(BIM&&BIM.count>4990))return false;
 if(eachOb(x,z,.6,o=>o.y1===undefined&&!o.off&&Math.abs(x-o.x)<o.hx+.45&&Math.abs(z-o.z)<o.hz+.45))return false;
 const ov=(px,pz,py)=>Math.abs(px-x)<.82&&Math.abs(pz-z)<.82&&py<y0+hh&&py+1.8>y0;
 if(active&&ov(player.position.x,player.position.z,pY))return false;
 for(const b of humans)if(ov(b.g.position.x,b.g.position.z,0))return false;
 for(const m of zombies)if(ov(m.position.x,m.position.z,0))return false;
 return true;
}
function buildCell(){return[Math.round(player.position.x-Math.sin(yaw)*1.7),Math.round(player.position.z-Math.cos(yaw)*1.7)];}
function buildAct(rem){
 if(!active)return;const[x,z]=buildCell();
 if(NET.role==='guest'){netSend({t:'bld',x,z,d:bTool==='door'?1:0,r:rem?1:0});attackWait=.18;return;}
 if(rem){const c=blocks.get(x+','+z);let top=null;if(c)for(const b of c)if(!top||b.y1>top.y1)top=b;if(!top||top.team!==PT){say(t('noplace'));return;}removeBlock(top,false);PT.blocks+=top.door?4:1;sfx('build');renderInv();return;}
 const door=bTool==='door',cost=door?4:1;
 if(PT.blocks<cost){say(t('nob'));return;}
 if(!canPlace(x,z,door?2:1)){say(t('noplace'),1);return;}
 placeBlock(x,z,PT,door);PT.blocks-=cost;sfx('build');attackWait=.18;renderInv();
}
function toggleBuild(){if(!active)return;buildMode=!buildMode;say(t(buildMode?'bmode':'bmodeoff'));renderW();selectW(cur);}
function updateGhost(){
 if(!ghost){ghost=new THREE.Mesh(BG,new THREE.MeshBasicMaterial({color:0x2ecc71,transparent:true,opacity:.35,depthWrite:false}));scene.add(ghost);}
 ghost.visible=buildMode&&active;if(!ghost.visible)return;
 const[x,z]=buildCell(),hh=bTool==='door'?2:1,y0=colTop(x,z);
 ghost.scale.set(1.02,hh+.02,1.02);ghost.position.set(x,y0+hh/2,z);
 ghost.material.color.setHex(canPlace(x,z,hh)&&PT.blocks>=(hh>1?4:1)?0x2ecc71:0xe74c3c);
}
function updateDoors(){for(const d of doors){let open=false;const Tm=d.team;if(Tm===PT&&active&&Math.hypot(player.position.x-d.x,player.position.z-d.z)<1.8)open=true;if(!open)for(const m of Tm.members){if(Math.hypot(m.g.position.x-d.x,m.g.position.z-d.z)<1.8){open=true;break;}}d.mesh.material.opacity=open?.3:1;}}
