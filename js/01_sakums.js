// 01_sakums.js - Globālie mainīgie, telefona noteikšana
const $=id=>document.getElementById(id);
const TOUCH=matchMedia('(pointer:coarse)').matches||/[?&]mobile/.test(location.search);
if(TOUCH)document.documentElement.classList.add('touch');
let scene,camera,renderer,clock,player,active=false,health=100,score=0,coins=0,yaw=0,pitch=0,vy=0,onGround=true,attackWait=0,hurtWait=0,msgWait=0,jx=0,jy=0,L='lv',fp=false,muted=false,AC=null,floor,grid,sun,skyline,hemi,amb,skyC,skyTex,skyT=0;
// jaunais: diennakts, ieroči, būvēšana, cilvēki un bandas
let spawnedS=0,sT=0,offerAt=40,pY=0,hour=8,day=1,lastH=8,gtime=0,spawnedZ=0,spawnedW=0,madeZW=0,zT=0,wT=0,mergeT=0,teamT=0,teamUI=0,buildMode=false,bTool='blk',ghost=null,mouseDown=false,cur='hands',inv=null,PT=null,invul=0,teamId=0,clkM=-1;
const keys={},zombies=[],corpses=[],bullets=[],chunks=new Map(),taken=new Set(),humans=[],teams=[],blocks=new Map(),doors=[],drops=[],fxs=[],OG=new Map(),pairCd=new Map(),HL=[],nc=[0,0,0,0],camR=new THREE.Vector3(1,0,0);
const CITY=160,EDGE=240,PRES={dead:false};
