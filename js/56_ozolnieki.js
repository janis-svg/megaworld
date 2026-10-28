// 56_ozolnieki.js - Trešā kara karte "Ozolnieki": ciems pēc īstās kartes, pagriezts pa diagonāli starp bāzēm.
// Sarkanā bāze (WB[0]) pie vidusskolas rietumos, zaļā bāze (WB[1]) pie Ozolnieku ezera austrumos. Pa vidu Skolas iela caur mežaparku,
// centrs ar piecstāvu mājām, OZO Halle un stadions, Rīgas iela (P100) ar apli, Eglaines iela, privātmāju kvartāli, viesnīca Agate, rūpnīcas.
// Ap 35% māju sagrautas; kara elementi: dzeloņstiepļu žogi, kontrolposteņi ar barjerām, ezīši, smilšu maisi, bunkuri, sadeguši auto un tanki, krāteri.
// Lidlauki un helikopteru laukumi paliek savās vietās (mežā). Karte nav simetriska, jo tā ir īsta vieta.
Object.assign(T.lv,{wm_ozo:'🏘️ Ozolnieki'});Object.assign(T.en,{wm_ozo:'🏘️ Ozolnieki'});
const OZS=Math.SQRT1_2,ozP=(U,V)=>[WB[0].x+OZS*(U-V),WB[0].z+OZS*(U+V)],ozA=(dU,dV)=>Math.atan2(OZS*(dU-dV),OZS*(dU+dV));
let OZPL=null,OZR=[],OZB=[],FFR=null;
const ozRiv=V=>255+5*Math.sin(V/40),OZBR=[.5,-121.3]; // upes U pēc V un tiltu V
const ozOn=()=>WMAP==='ozo'&&isWar();
// ---------- plāns (U - no skolas uz ezeru, V - uz ziemeļiem; viss vienreiz no fiksētas sēklas) ----------
function ozoPlan(){if(OZPL)return OZPL;const R=rng(5150),P=[],C=[],RS=[];OZB=[];OZR=[];
 const inMap=(x,z,r)=>Math.abs(x)<EDGE-5-r&&Math.abs(z)<EDGE-5-r,inBase=(x,z,r)=>WB.some(B=>Math.abs(x-B.x)<BR+9+r&&Math.abs(z-B.z)<BR+9+r);
 const segD=(x,z,s)=>{const dx=s[2]-s[0],dz=s[3]-s[1],l2=dx*dx+dz*dz||1,t=Math.max(0,Math.min(1,((x-s[0])*dx+(z-s[1])*dz)/l2));return Math.hypot(x-s[0]-dx*t,z-s[1]-dz*t);};
 const onRoad=(x,z,r)=>RS.some(s=>segD(x,z,s)<s[4]/2+r+1);
 // vai ceļš iet cauri taisnstūrim (ar 1 m rezervi)
 const rectRoad=(x,z,hx,hz)=>RS.some(s=>{const n=Math.ceil(Math.hypot(s[2]-s[0],s[3]-s[1])/1.5),m=s[4]/2+1;for(let k=0;k<=n;k++){const px=s[0]+(s[2]-s[0])*k/n,pz=s[1]+(s[3]-s[1])*k/n;if(Math.abs(px-x)<hx+m&&Math.abs(pz-z)<hz+m)return true;}return false;});
 const free=(x,z,hx,hz,road)=>{const r=Math.max(hx,hz);return inMap(x,z,r)&&!inBase(x,z,r)&&!nearAirfield(x,z,r+3)&&!TRENCH.some(([a,b])=>Math.hypot(x-a,z-b)<r+6)&&!C.some(c=>Math.abs(x-c[0])<hx+c[2]+1&&Math.abs(z-c[1])<hz+c[3]+1)&&(road||!rectRoad(x,z,hx,hz));};
 const claim=(x,z,hx,hz)=>C.push([x,z,hx,hz]);
 const put=(U,V,p,hx,hz,road)=>{let[x,z]=ozP(U,V);hx=hx||0;hz=hz||0;if(hx&&!free(x,z,hx,hz,road)){let ok=false;// pabīda līdz 12 m, ja traucē ceļš vai cita ēka
   for(const d of[3,6,9,12]){for(let i=0;i<8&&!ok;i++){const a=i/8*6.283,q=ozP(U+Math.cos(a)*d,V+Math.sin(a)*d);if(free(q[0],q[1],hx,hz,road)){x=q[0];z=q[1];ok=true;}}if(ok)break;}
   if(!ok){(window.OZFAIL=window.OZFAIL||[]).push([p.k,Math.round(U),Math.round(V)]);return null;}}if(hx)claim(x,z,hx,hz);const q={...p,x,z};P.push(q);return q;};
 // ceļi (asfalts / grants)
 const road=(L,w,dirt)=>{for(let i=0;i<L.length-1;i++){const[a,b]=[ozP(...L[i]),ozP(...L[i+1])];RS.push([a[0],a[1],b[0],b[1],w]);const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/5),an=Math.atan2(b[0]-a[0],b[1]-a[1]);
  for(let k=0;k<n;k++){const x=a[0]+(b[0]-a[0])*(k+.5)/n,z=a[1]+(b[1]-a[1])*(k+.5)/n;if(!inMap(x,z,0))continue;P.push({k:'aroad',x,z,a:an,w,dirt});if(!dirt&&k%2===0&&!nearAirfield(x,z,0))OZR.push([x,z]);}}};
 road([[22,0],[60,5],[95,7],[150,8],[220,2],[290,-2],[360,-6],[430,-10],[466,-12]],7);                 // Skolas iela
 road([[330,-190],[466,-12],[536,86]],9);                                                                // Rīgas iela P100
 road([[478,-14],[520,-26],[548,-12]],7);                                                                // Eglaines iela uz ezera bāzi
 road([[322,70],[365,-6],[392,-78],[404,-150]],6);road([[298,-4],[322,-60],[352,-118]],5);road([[288,-2],[282,-72]],5); // Stadiona, Meliorācijas, Parka
 road([[372,-160],[426,-40]],5);road([[95,7],[102,110]],5);road([[62,6],[63,26]],5);road([[302,0],[306,64]],5);         // Pļavu, ziemeļu ciems, skola, Agate
 road([[205,-125],[300,-118],[380,-126]],5,true);road([[215,-175],[215,175]],4,true);road([[400,8],[470,90]],5);           // Spartaka, meža ceļš, Iecavas krastmala
 // apaļais laukums Skolas / Rīgas / Eglaines krustojumā
 {const[x,z]=ozP(470,-12);P.push({k:'rbt',x,z});}
 // Iecavas upe pāri visai kartei starp mežaparku un centru, divi tilti (Skolas iela un Spartaka iela)
 for(let V=-320;V<=320;V+=4.5){if(OZBR.some(b=>Math.abs(V-b)<11))continue;const[x,z]=ozP(ozRiv(V),V);if(!inMap(x,z,-4)||nearAirfield(x,z,4))continue;claim(x,z,6,6);P.push({k:'riv',x,z,r:6.5});}
 for(const b of OZBR){const[x,z]=ozP(ozRiv(b),b);P.push({k:'bridge',x,z,a:ozA(1,0)});}
 // ezers ar jahtklubu "5 masti"
 for(const[U,V,r]of[[452,-74,18],[470,-97,17],[446,-104,15],[488,-82,14]]){const[x,z]=ozP(U,V);claim(x,z,r,r);P.push({k:'pond',x,z,r});}
 put(434,-60,{k:'pier',a:ozA(1,-1)});
 // ēkas: h<=4.5 privātmāja, citādi daudzstāvu; 35% sagrautas
 const RU=()=>R()<.35,bl=(U,V,w,d,h,c,k)=>put(U,V,{k:k||'block',w,d,h,c:c||[0xd8d2c4,0xcfc6b0,0xe2ddd2,0xc9b99a][Math.floor(R()*4)],ruin:RU(),sd:Math.floor(R()*1e6)},w/2,d/2);
 const house=(U,V)=>{const w=5+R()*2.5,d=5+R()*2.5;put(U+(R()-.5)*3,V+(R()-.5)*3,{k:'house',w,d,h:3+R()*1.4,c:[0xe9e0cf,0xd7c3a0,0xb98a64,0xcfd6dc,0xe6d27a][Math.floor(R()*5)],rc:[0x8d3b2c,0x4d4d4d,0x6b4a2b,0x355e3b][Math.floor(R()*4)],ruin:RU(),sd:Math.floor(R()*1e6)},w/2,d/2);};
 // skola un tās apkārtne pie sarkanās bāzes
 put(72,46,{k:'school',w:32,d:11,h:10.5},16,6);put(60,62,{k:'block',w:10,d:16,h:7,c:0xdcdcd8,ruin:false,sd:1},5,8);
 put(72,-46,{k:'stadium',rx:17,rz:11});put(92,30,{k:'play'});put(104,24,{k:'church'},4,5);
 for(const[U,V]of[[118,-32],[128,-48],[110,-52]])bl(U,V,13,6,8);
 for(let U=72;U<=146;U+=12)for(let V=48;V<=112;V+=12)if(R()<.8)house(U,V);
 for(let U=70;U<=150;U+=12)for(let V=-66;V>=-130;V-=12)if(R()<.8)house(U,V);
 // centrs: piecstāvu mājas uz dienvidiem no Skolas ielas
 for(const[U,V,w,d,h]of[[300,-24,9,26,13],[318,-46,26,9,13],[300,-82,9,24,13],[334,-26,9,22,13],[346,-70,22,9,13],[330,-100,9,20,10],[312,-118,20,9,10],[352,-44,9,9,13],[280,-46,9,18,10]])bl(U,V,w,d,h);
 // ziemeļu puse: viesnīca Agate, veikals top!, rūpnīcas, bibliotēka, Elvi
 bl(312,48,18,12,12,0xe8e4da);bl(286,30,9,9,5,0x9c6b4a,'bld');bl(352,16,16,10,5,0xe9e9e9,'bld');bl(396,36,10,8,5,0xd0d4d8,'bld');
 bl(414,26,14,10,6,0xa7adb3,'bld');bl(432,48,12,16,7,0x9aa3ab,'bld');bl(452,28,10,8,5,0xb8b1a5,'bld');bl(448,58,8,8,5,0xd9cdb6,'bld');bl(456,10,10,8,5,0xe1e1e1,'bld');
 // OZO Halle un stadions
 put(392,-22,{k:'hall',w:22,d:14,h:9},11,7);put(410,-50,{k:'stadium',rx:14,rz:9});put(368,-30,{k:'bld',w:8,d:7,h:5,c:0x9c5a3c},4,3.5);
 // privātmāju kvartāli: Pļavu / Spartaka, Iecavas krastmala
 for(let U=336;U<=420;U+=11)for(let V=-100;V>=-170;V-=11)if(R()<.75)house(U,V);
 for(let U=420;U<=500;U+=11)for(let V=40;V<=96;V+=11)if(R()<.7)house(U,V);
 for(let U=230;U<=280;U+=11)for(let V=-128;V>=-160;V-=11)if(R()<.5)house(U,V);
 // kara elementi: kontrolposteņi uz ceļiem, dzeloņstieples, ezīši, maisi, bunkuri, vraki, krāteri
 const post=(U,V,dU,dV)=>{const a=ozA(dU,dV),[x,z]=ozP(U,V);P.push({k:'post',x,z,a});
  // būdiņa ceļa malā un maisi otrā pusē
  const nx=-dV,nz=dU,l=Math.hypot(nx,nz)||1;put(U+nx/l*7,V+nz/l*7,{k:'booth'},1.2,1.2,true);put(U-nx/l*7.5,V-nz/l*7.5,{k:'nest',a:a},2.4,2.4,true);
  wire(U+nx/l*10,V+nz/l*10,U+nx/l*30,V+nz/l*30);wire(U-nx/l*11,V-nz/l*11,U-nx/l*30,V-nz/l*30);};
 const wire=(U1,V1,U2,V2)=>{const[a,b]=[ozP(U1,V1),ozP(U2,V2)],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L/1.8));let prev=null;
  for(let k=0;k<=n;k++){const x=a[0]+(b[0]-a[0])*k/n,z=a[1]+(b[1]-a[1])*k/n;if(!inMap(x,z,1)||inBase(x,z,0)||onRoad(x,z,0)||C.some(c=>Math.abs(x-c[0])<c[2]+.6&&Math.abs(z-c[1])<c[3]+.6)||nearAirfield(x,z,1)){prev=null;continue;}
   const q={k:'wire',x,z,nx:null,nz:null};if(prev){prev.nx=x;prev.nz=z;}P.push(q);prev=q;}};
 post(140,8,1,0);post(292,-2,1,0);post(440,-10,1,0);post(400,-130,.35,1);post(100,90,0,1);post(530,-24,1,.3);
 wire(286,-10,286,-130);wire(290,10,290,100);wire(360,-140,420,-150);wire(500,-20,520,40);wire(150,-20,150,-150);wire(150,20,150,150);wire(330,40,380,50);
 for(const[U,V]of[[145,-2],[146,16],[296,-10],[298,8],[444,-3],[436,-18],[380,-8],[230,6],[110,4]]){const[x,z]=ozP(U,V);for(let i=0;i<3;i++)P.push({k:'hog',x:x+(R()-.5)*5,z:z+(R()-.5)*5,a:R()*3});}
 for(const[U,V]of[[320,-12],[372,8],[404,-4],[118,16],[86,-18],[260,14],[454,-30],[506,-40]])put(U,V,{k:'nest',a:R()*6.28},2.4,2.4);
 for(const[U,V]of[[166,30],[262,-30],[424,12],[96,-26]])put(U,V,{k:'bunk'},2.6,2.6);
 for(const[U,V]of[[250,-6],[338,-12],[460,-40],[180,40]])put(U,V,{k:'wreck',a:R()<.5?0:Math.PI/2},2.4,2.4,true);
 for(let i=0;i<14;i++){const U=60+R()*470,V=(R()-.5)*240;put(U,V,{k:'car',a:R()<.5?0:Math.PI/2},2.2,2.2,R()<.6);}
 for(let i=0;i<34;i++){const U=40+R()*500,V=(R()-.5)*300,[x,z]=ozP(U,V);if(inMap(x,z,2)&&!inBase(x,z,0)&&!nearAirfield(x,z,2))P.push({k:'crater',x,z,r:1.3+R()*2});}
 // mežaparks starp skolu un centru (ar Jāņu pļavu un Bulderberga kalna klajumu) un meža joslas malās
 const forest=(U0,U1,V0,V1,st)=>{for(let U=U0;U<=U1;U+=st)for(let V=V0;V<=V1;V+=st){const u=U+(R()-.5)*st*.9,v=V+(R()-.5)*st*.9;
   if(Math.hypot(u-205,v+30)<17||Math.hypot(u-226,v-62)<14)continue;const[x,z]=ozP(u,v);if(!free(x,z,.6,.6))continue;P.push({k:'tree',x,z,s:.8+R()*.7});}};
 forest(152,282,-190,190,8.5);forest(40,150,-175,-136,9);forest(40,140,120,180,9);forest(300,420,-230,-178,9);forest(470,540,96,140,9);forest(520,560,-90,-40,8);
 OZPL=new Map();for(const p of P){const key=Math.floor(p.x/CS)+','+Math.floor(p.z/CS);if(!OZPL.has(key))OZPL.set(key,[]);OZPL.get(key).push(p);}
 for(const p of P)if((p.k==='block'||p.k==='school'||p.k==='hall')&&(p.ruin?p.h*.55:p.h)>7)OZB.push({x:p.x,z:p.z,hx:p.w/2,hz:p.d/2,h:p.h});
 return OZPL;}
// ---------- detaļas ----------
const ozWin=(g,len,along,x,z,y,off,c)=>{along==='x'?vadd(g,len,.85,.06,c||0x27303a,x,y,z+off,.4):vadd(g,.06,.85,len,c||0x27303a,x+off,y,z,.4);};
function ozRuinWalls(ch,p,h,c,R){const g=ch.group;for(const[sx,sz,ww,dd]of[[0,-p.d/2,p.w,.4],[0,p.d/2,p.w,.4],[-p.w/2,0,.4,p.d],[p.w/2,0,.4,p.d]]){if(R()<.18)continue;
  const parts=R()<.55?2:1;for(let q=0;q<parts;q++){const lng=ww>1?ww:dd,pl=parts===2?lng*.36:lng*(.6+R()*.4),off=parts===2?(q?1:-1)*lng*.31:(R()-.5)*(lng-pl),ph=h*(.35+R()*.65);
   const x=p.x+sx+(ww>1?off:0),z=p.z+sz+(ww>1?0:off),w=ww>1?pl:ww,d=ww>1?dd:pl;vadd(g,w,ph,d,c,x,ph/2,z,.95).castShadow=true;ch.obs.push({x,z,hx:w/2,hz:d/2,y0:0,y1:ph});}}
 for(let i=0;i<6;i++){const s=.5+R()*1.1;vadd(g,s,s*.6,s*.9,[0x7d776c,0x6a5a4a,0x8f8a80][i%3],p.x+(R()-.5)*p.w,s*.3,p.z+(R()-.5)*p.d,1);}
 const f=new THREE.Mesh(new THREE.PlaneGeometry(p.w,p.d),mat(0x2b2620,1));f.rotation.x=-Math.PI/2;f.position.set(p.x,.02,p.z);g.add(f);}
Object.assign(FB,{
 aroad(ch,p){const m=new THREE.Mesh(new THREE.PlaneGeometry(p.w,5.6),mat(p.dirt?0x7a6849:0x55585c,1));m.rotation.set(-Math.PI/2,0,p.a);m.position.set(p.x,p.dirt?.012:.014,p.z);m.receiveShadow=true;ch.group.add(m);
  if(!p.dirt&&p.w>=7){const l=new THREE.Mesh(new THREE.PlaneGeometry(.18,2.2),mat(0xd8d4c0,.8));l.rotation.set(-Math.PI/2,0,p.a);l.position.set(p.x,.018,p.z);ch.group.add(l);}},
 rbt(ch,p){const r=new THREE.Mesh(new THREE.RingGeometry(5,11,28),mat(0x55585c,1));r.rotation.x=-Math.PI/2;r.position.set(p.x,.016,p.z);ch.group.add(r);
  const c=new THREE.Mesh(new THREE.CircleGeometry(5,24),mat(0x4f7a3a,1));c.rotation.x=-Math.PI/2;c.position.set(p.x,.02,p.z);ch.group.add(c);ch.obs.push({x:p.x,z:p.z,hx:3,hz:3,y0:0,y1:.6});},
 house(ch,p){const g=ch.group,R=rng(p.sd);if(p.ruin){ozRuinWalls(ch,p,p.h,p.c,R);return;}
  vadd(g,p.w,p.h,p.d,p.c,p.x,p.h/2,p.z,.9).castShadow=true;const r=new THREE.Mesh(new THREE.ConeGeometry(.7072,1,4),mat(p.rc,.8));r.rotation.y=Math.PI/4;r.scale.set(p.w*1.1,2.1,p.d*1.1);r.position.set(p.x,p.h+1.05,p.z);r.castShadow=true;g.add(r);
  for(const s of[-1,1])for(const o of[-.25,.25])vadd(g,.9,.9,.06,0x2a3440,p.x+p.w*o,p.h*.55,p.z+s*(p.d/2+.02),.3);vadd(g,.9,1.8,.06,0x5a3a22,p.x,.9,p.z+p.d/2+.03,.8);
  ch.obs.push({x:p.x,z:p.z,hx:p.w/2,hz:p.d/2});},
 block(ch,p){const g=ch.group,R=rng(p.sd),ax=p.w>=p.d?'x':'z',L=Math.max(p.w,p.d),S=Math.min(p.w,p.d);
  if(!p.ruin){vadd(g,p.w,p.h,p.d,p.c,p.x,p.h/2,p.z,.9).castShadow=true;vadd(g,p.w+.3,.3,p.d+.3,0x6b6b6b,p.x,p.h+.15,p.z,.9);
   for(let f=0;f*2.7+1.4<p.h-.6;f++)for(const s of[-1,1])ozWin(g,L*.9,ax,p.x,p.z,1.4+f*2.7,s*(S/2+.02));
   for(const o of[-.3,0,.3])ax==='x'?vadd(g,1.2,2,.1,0x3b2f25,p.x+L*o,1,p.z+S/2+.05,.8):vadd(g,.1,2,1.2,0x3b2f25,p.x+S/2+.05,1,p.z+L*o,.8);
   ch.obs.push({x:p.x,z:p.z,hx:p.w/2,hz:p.d/2});return;}
  // sagrauta: viens gals vēl stāv, otrs sabrucis līdz 1-2 stāviem, drupu kaudze, apdeguši logi
  const sgn=R()<.5?-1:1,la=L*.55,lb=L-la,ca=sgn*(L/2-la/2),cb=-sgn*(L/2-lb/2),hb=2.7*(1+Math.floor(R()*2)),pa=ax==='x'?[p.x+ca,p.z]:[p.x,p.z+ca],pb=ax==='x'?[p.x+cb,p.z]:[p.x,p.z+cb];
  const wa=ax==='x'?la:S,da=ax==='x'?S:la,wb=ax==='x'?lb:S,db=ax==='x'?S:lb;
  vadd(g,wa,p.h,da,p.c,pa[0],p.h/2,pa[1],.95).castShadow=true;for(let f=0;f*2.7+1.4<p.h-.6;f++)for(const s of[-1,1])ozWin(g,la*.85,ax,pa[0],pa[1],1.4+f*2.7,s*(S/2+.02),f>2&&R()<.5?0x141210:0);
  // sabrukušajā galā var ieiet: paliekas no sienām, iekšā drupas
  ozRuinWalls(ch,{x:pb[0],z:pb[1],w:wb,d:db},hb,p.c,R);
  for(let i=0;i<9;i++){const s=.8+R()*1.8,o=(R()-.5)*lb,side=(R()<.5?-1:1)*(S/2+.6+R()*2.4);vadd(g,s,s*.55,s,[0x8c867a,0x6f685c,0x9a9488][i%3],ax==='x'?pb[0]+o:pb[0]+side,s*.27,ax==='x'?pb[1]+side:pb[1]+o,1);}
  ch.obs.push({x:pa[0],z:pa[1],hx:wa/2,hz:da/2});},
 bld(ch,p){const g=ch.group;if(p.ruin){ozRuinWalls(ch,p,p.h*.85,p.c,rng(Math.floor(Math.abs(p.x*131+p.z*17))+7));return;}vadd(g,p.w,p.h,p.d,p.c,p.x,p.h/2,p.z,.85).castShadow=true;vadd(g,p.w+.2,.25,p.d+.2,0x5c5f63,p.x,p.h+.12,p.z,.9);
  const ax=p.w>=p.d?'x':'z';for(const s of[-1,1])ozWin(g,Math.max(p.w,p.d)*.7,ax,p.x,p.z,p.h*.5,s*(Math.min(p.w,p.d)/2+.02));
  ch.obs.push({x:p.x,z:p.z,hx:p.w/2,hz:p.d/2});},
 school(ch,p){const g=ch.group;vadd(g,p.w,p.h,p.d,0xdedcd6,p.x,p.h/2,p.z,.9).castShadow=true;vadd(g,p.w+.4,.35,p.d+.4,0x8d9196,p.x,p.h+.17,p.z,.8);
  for(let f=0;f<3;f++)for(const s of[-1,1]){const y=1.5+f*3.2;ozWin(g,p.w*.94,'x',p.x,p.z,y,s*(p.d/2+.02));ozWin(g,p.w*.94,'x',p.x,p.z,y-1,s*(p.d/2+.03),f===2?0x3f9a4a:0xc4643a);}
  vadd(g,8,6,6,0xd8cfa8,p.x-p.w/2-4,3,p.z+2,.9);ch.obs.push({x:p.x,z:p.z,hx:p.w/2,hz:p.d/2},{x:p.x-p.w/2-4,z:p.z+2,hx:4,hz:3});},
 church(ch,p){const g=ch.group;vadd(g,6,4.5,8,0xece6da,p.x,2.25,p.z,.9);const r=new THREE.Mesh(new THREE.ConeGeometry(.7072,1,4),mat(0x7a3a2c,.8));r.rotation.y=Math.PI/4;r.scale.set(6.6,2.6,8.6);r.position.set(p.x,5.8,p.z);g.add(r);
  vadd(g,2.2,9,2.2,0xece6da,p.x,4.5,p.z-4.6,.9);vadd(g,.25,1.8,.25,0xd4af37,p.x,9.9,p.z-4.6,.5);vadd(g,1.1,.25,.25,0xd4af37,p.x,10.3,p.z-4.6,.5);ch.obs.push({x:p.x,z:p.z,hx:3,hz:4},{x:p.x,z:p.z-4.6,hx:1.1,hz:1.1});},
 hall(ch,p){const g=ch.group;vadd(g,p.w,p.h,p.d,0xd5d8dc,p.x,p.h/2,p.z,.85).castShadow=true;vadd(g,p.w+.3,.5,p.d+.3,0x5b7fa6,p.x,p.h+.25,p.z,.7);vadd(g,p.w*.6,1.2,.08,0x2a3440,p.x,p.h-2,p.z+p.d/2+.04,.3);
  ch.obs.push({x:p.x,z:p.z,hx:p.w/2,hz:p.d/2});},
 stadium(ch,p){const g=ch.group,el=(rx,rz,c,y)=>{const m=new THREE.Mesh(new THREE.CircleGeometry(1,40),mat(c,1));m.rotation.x=-Math.PI/2;m.scale.set(rx,rz,1);m.position.set(p.x,y,p.z);g.add(m);};
  el(p.rx,p.rz,0xb5442e,.02);el(p.rx-2.6,p.rz-2.6,0x4f8a3a,.024);for(const s of[-1,1])vadd(g,.12,1.8,.12,0xffffff,p.x+s*(p.rx-4),.9,p.z,.5);vadd(g,p.rx,1.2,2,0x8d8d86,p.x,.6,p.z-p.rz-1.6,.9);ch.obs.push({x:p.x,z:p.z-p.rz-1.6,hx:p.rx/2,hz:1,y0:0,y1:1.2});},
 play(ch,p){const g=ch.group;vadd(g,1.4,2,1.4,0xc0392b,p.x,1,p.z,.7);vadd(g,.6,.1,3,0x2e7d32,p.x+1,1,p.z+1.6,.6).rotation.x=.45;vadd(g,1.2,1.6,1.2,0xf2c94c,p.x-4,.8,p.z+1,.7);
  for(const s of[-1,1])vadd(g,.12,2.4,.12,0x8d6e63,p.x+3+s*1.2,1.2,p.z-2,.8);vadd(g,2.6,.12,.12,0x8d6e63,p.x+3,2.4,p.z-2,.8);},
 pier(ch,p){const g=ch.group,fx=Math.sin(p.a),fz=Math.cos(p.a);const m=vadd(g,1.8,.15,16,0x8a6a45,p.x+fx*8,.25,p.z+fz*8,.9);m.rotation.y=p.a;
  for(let i=0;i<5;i++)vcyl(g,.06,.06,7,0xeeeeee,p.x+fx*(4+i*2.5)+fz*1.6,3.5,p.z+fz*(4+i*2.5)-fx*1.6,null,6);},
 booth(ch,p){const g=ch.group;vadd(g,2.2,2.5,2.2,0x5f6b4e,p.x,1.25,p.z,.9);vadd(g,2.6,.2,2.6,0x3f4734,p.x,2.6,p.z,.9);for(const s of[-1,1])vadd(g,1.4,.6,.06,0x9fc4d6,p.x,1.7,p.z+s*1.12,.2);
  vcyl(g,.04,.04,3.5,0x333333,p.x+.8,4.2,p.z,null,4);vadd(g,.9,.6,.03,0xc62828,p.x+1.25,5.5,p.z,.6);ch.obs.push({x:p.x,z:p.z,hx:1.1,hz:1.1});},
 post(ch,p){const g=ch.group;for(let i=0;i<8;i++){const b=vadd(g,.9,.16,.16,i%2?0xffffff:0xc62828,p.x+Math.cos(p.a)*(i-3.5)*.9,1,p.z-Math.sin(p.a)*(i-3.5)*.9,.6);b.rotation.y=p.a+Math.PI/2;}
  for(const s of[-1,1]){const x=p.x+Math.cos(p.a)*s*4,z=p.z-Math.sin(p.a)*s*4;vadd(g,1.2,1.2,1.2,0xb0aea6,x,.6,z,.9);vadd(g,1.2,.12,1.2,0xd4c94a,x,1.2,z,.6);}
  const sg=new THREE.Mesh(new THREE.CircleGeometry(.4,16),mat(0xc62828,.6));sg.position.set(p.x+Math.cos(p.a)*4.6,2,p.z-Math.sin(p.a)*4.6);sg.rotation.y=p.a;g.add(sg);},
 wire(ch,p){const g=ch.group;vcyl(g,.05,.05,1.7,0x5d4a33,p.x,.85,p.z,null,5);
  if(p.nx!=null){const dx=p.nx-p.x,dz=p.nz-p.z,L=Math.hypot(dx,dz),a=Math.atan2(dx,dz),mx=(p.x+p.nx)/2,mz=(p.z+p.nz)/2;for(const y of[.35,.85,1.35])vadd(g,.03,.03,L,0x777777,mx,y,mz,.4).rotation.y=a;
   for(const s of[-1,1]){const d=vadd(g,.025,.025,Math.hypot(L,1),0x8a8a8a,mx,.85,mz,.4);d.rotation.set(s*.85,a,0);}}
  ch.obs.push({x:p.x,z:p.z,hx:.55,hz:.55,y0:0,y1:1.7,win:true});},
 car(ch,p){const g=ch.group,a=Math.abs(Math.sin(p.a))>.5,w=a?4:1.8,d=a?1.8:4;vadd(g,w,.8,d,[0x3b2e26,0x2d2d2d,0x4a3a2a][Math.floor(Math.abs(p.x*7))%3],p.x,.55,p.z,.9);
  vadd(g,a?2:1.6,.6,a?1.6:2,0x1f1b18,p.x,1.25,p.z,.9);ch.obs.push({x:p.x,z:p.z,hx:w/2,hz:d/2,y0:0,y1:1.5});}});
// ---------- plāna izvēle, ceļi laupījumam, bāzes ar dzeloņstieplēm un posteņiem ----------
const _fieldPlan56=fieldPlan;fieldPlan=function(){if(WMAP==='ozo'){const r=ozoPlan();FROAD=OZR;return r;}const r=_fieldPlan56();if(!FFR)FFR=FROAD;FROAD=FFR;return r;};
function ozoBaseMods(){const g=new THREE.Group(),n0=WOB.length;
 for(const B of WB){const R=BR,d=B.d;for(const side of[0,1]){const at=(u,w)=>side?[B.x+d*w,B.z+u]:[B.x+u,B.z+d*w];
   for(let u=-R-2;u<=R+2;u+=1.8){if(Math.abs(u)<10)continue;const[x,z]=at(u,R+3.5);vcyl(g,.05,.05,1.7,0x5d4a33,x,.85,z,null,5);for(const y of[.35,.85,1.35])vadd(g,side?.03:1.8,.03,side?1.8:.03,0x777777,x+(side?0:.9),y,z+(side?.9:0),.4);WOB.push({x,z,hx:.55,hz:.55,y0:0,y1:1.7,win:true});}
   const[bx,bz]=at(13,R+6);vadd(g,2.2,2.5,2.2,0x5f6b4e,bx,1.25,bz,.9);vadd(g,2.6,.2,2.6,0x3f4734,bx,2.6,bz,.9);WOB.push({x:bx,z:bz,hx:1.1,hz:1.1});}}
 g.updateMatrixWorld(true);mergeInto(g);scene.add(g);WG.push(g);for(let i=n0;i<WOB.length;i++)addOb(WOB[i]);}
const _buildBases56=buildBases;buildBases=function(){_buildBases56();if(WMAP==='ozo'){fieldBaseMods();ozoBaseMods();}};
// augstās mājas: lidmašīnas un raķetes tajās ietriecas
const ozBox=(x,z,y,m)=>ozOn()&&OZB.some(b=>Math.abs(x-b.x)<b.hx+m&&Math.abs(z-b.z)<b.hz+m&&y<b.h+(m?1.5:0));
const _jetHits56=jetHits;jetHits=function(x,z,y){return ozBox(x,z,y,1)||_jetHits56(x,z,y);};
const _bldHit56=bldHit;bldHit=function(x,z,y){return ozBox(x,z,y,0)||_bldHit56(x,z,y);};
const _maxHAhead56=maxHAhead;maxHAhead=function(x,z,a,dist){let m=_maxHAhead56(x,z,a,dist);if(ozOn())for(let k=1;k<=4;k++){const px=x-Math.sin(a)*dist*k/4,pz=z-Math.cos(a)*dist*k/4;for(const b of OZB)if(Math.abs(px-b.x)<b.hx+3&&Math.abs(pz-b.z)<b.hz+3)m=Math.max(m,b.h);}return m;};
// ---------- minikarte ----------
const _warMapBg56=warMapBg;warMapBg=function(g,X,Y,sc,W){if(WMAP!=='ozo')return _warMapBg56(g,X,Y,sc,W);g.fillStyle='#2b3a26';g.fillRect(0,0,W,W);g.fillStyle='#55703a';g.fillRect(X(-EDGE),Y(-EDGE),2*EDGE*sc,2*EDGE*sc);
 const L=ozoPlan(),box=(p,c)=>{g.fillStyle=c;g.fillRect(X(p.x-p.w/2),Y(p.z-p.d/2),Math.max(2,p.w*sc),Math.max(2,p.d*sc));};
 for(const A of L.values())for(const p of A){const x=X(p.x),y=Y(p.z);
  if(p.k==='tree'){g.fillStyle='#23422a';g.fillRect(x-2.2*sc,y-2.2*sc,4.4*sc,4.4*sc);}
  else if(p.k==='pond'||p.k==='riv'){g.fillStyle='#2e6d8c';g.beginPath();g.arc(x,y,p.r*sc,0,6.283);g.fill();}}
 for(const A of L.values())for(const p of A){const x=X(p.x),y=Y(p.z);
  if(p.k==='aroad'){g.fillStyle=p.dirt?'#7a6849':'#8d9094';g.beginPath();g.arc(x,y,Math.max(1,p.w*.5*sc),0,6.283);g.fill();}
  else if(p.k==='bridge'){g.fillStyle='#b9b4a8';g.beginPath();g.arc(x,y,Math.max(2,5*sc),0,6.283);g.fill();}
  else if(p.k==='stadium'){g.fillStyle='#b5442e';g.beginPath();g.ellipse(x,y,p.rx*sc,p.rz*sc,0,0,6.283);g.fill();}}
 for(const A of L.values())for(const p of A){
  if(p.k==='house'||p.k==='block'||p.k==='bld')box(p,p.ruin?'#5d564c':'#c9c2b4');else if(p.k==='school')box(p,'#e0a070');else if(p.k==='hall')box(p,'#9fb6d1');
  else if(p.k==='wire'){g.fillStyle='#cfcfcf';g.fillRect(X(p.x)-.7,Y(p.z)-.7,1.4,1.4);}else if(p.k==='post'||p.k==='booth'){g.fillStyle='#ffd23f';g.fillRect(X(p.x)-2,Y(p.z)-2,4,4);}}};
paintMap();
