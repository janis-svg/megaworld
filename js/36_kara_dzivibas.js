// 36_kara_dzivibas.js - Karā: nav apmācības (tikai radio sarunas), pakāpe maina tēla izskatu, katram botam 2 dzīvības (pēc pirmās nāves atgriežas bāzē)
// ---------- karā Kaspara apmācība nerādās ----------
const _tutBegin23=tutBegin;tutBegin=function(){if(isWar()){tut=-1;tutEl.style.display='none';return;}_tutBegin23();};
const _warSetup23=warSetup;warSetup=function(){_warSetup23();tut=-1;tutEl.style.display='none';RESP.length=0;for(const b of humans)if(ARMY.includes(b.team))b.lives=2;wearLook();};
// ---------- pakāpes izskats: uzšuves, zvaigznes, cepures, uzpleči, medaļas ----------
const _lookArr23=lookArr;lookArr=function(){const a=_lookArr23().slice(0,4);while(a.length<4)a.push('');a.push(isWar()?'r'+rankOf(myStars):'');return a;};
const GOLD=0xffc107,SILV=0xcfd8dc;
const _dressMesh23=dressMesh;dressMesh=function(m,a,isP){_dressMesh23(m,a,isP);if(!m||!a)return;const r=a[4]?+String(a[4]).slice(1):0;m.userData.apk=a.join();if(!(r>0))return;const acc=m.userData.acc,add=(w,h,d,c,x,y,z,ry)=>{const q=cube(w,h,d,c,.4);q.position.set(x,y,z);if(ry)q.rotation.z=ry;acc.add(q);return q;};
 // uzšuves uz piedurknēm: 1-3 strīpas
 const ch=Math.min(3,r);for(const sx of [-.48,.48])for(let i=0;i<ch;i++){add(.22,.05,.26,r>=6?GOLD:0xffeb3b,sx,1.28-i*.08,0);}
 // virsnieki: zvaigznes uz pleciem
 if(r>=4){const st=r>=8?4:r>=7?3:r-3;for(const sx of [-.3,.3])for(let i=0;i<Math.min(3,st);i++)add(.07,.03,.07,r>=6?GOLD:SILV,sx,1.52,-.1+i*.1);}
 // uzpleči un medaļas
 if(r>=6){for(const sx of [-.33,.33])add(.22,.05,.3,GOLD,sx,1.5,0);for(let i=0;i<Math.min(4,r-4);i++)add(.07,.1,.03,[0xe53935,0x1e88e5,GOLD,0x43a047][i],-.14+i*.09,1.25,-.2);}
 // cepure pēc pakāpes (ja nav savas cepures)
 if((a[1]==='h0'||!a[1])&&a[3]!=='hv'){if(r>=8){const c=add(.56,.16,.56,GOLD,0,2.08,0);c.material.metalness=.7;add(.6,.04,.25,0x212121,0,2.02,-.3);}
  else if(r>=4){add(.54,.14,.54,r>=7?0xb71c1c:0x1b5e20,0,2.07,0);add(.5,.04,.22,0x212121,0,2.01,-.3);add(.08,.08,.03,GOLD,0,2.12,-.28);}
  else if(r>=2){add(.54,.22,.52,0x4b5320,0,2.06,0);}}
 // ģenerālim zelta apmetnis (ja nav cita)
 if(r>=8&&(a[2]==='b0'||!a[2])){const cp=add(.7,1.05,.05,GOLD,0,1.02,.22);cp.rotation.x=.12;}
 // saulesbrilles kapteinim un augstāk
 if(r>=5)add(.4,.08,.03,0x111111,0,1.8,-.23);};
let lastRank=-1;
const _updateFx23=updateFx;updateFx=function(dt){_updateFx23(dt);if(isWar()&&active){const r=rankOf(myStars);if(r!==lastRank){lastRank=r;wearLook();}}};
// ---------- botiem 2 dzīvības: pēc pirmās nāves pēc ~8 s atgriežas savā bāzē ----------
const RESP=[];
const _killBot23=killBot;killBot=function(b,src){const was=!b.dead,info=was&&isWar()&&ARMY.includes(b.team)&&!b.trader&&(b.lives??2)>1?{team:b.team,name:b.name,heavy:!!b.heavy,wrole:b.wrole,sq:b.sq,cmd:b.cmd,lives:(b.lives??2)-1,t:gtime+8}:null;
 _killBot23(b,src);if(info&&NET.role!=='guest')RESP.push(info);};
function respTick(){for(let i=RESP.length-1;i>=0;i--){const r=RESP[i];if(gtime<r.t)continue;RESP.splice(i,1);if(!ARMY.includes(r.team))continue;const B=WB[ARMY.indexOf(r.team)];
  const I=botInv(true);if(Math.random()<.25){I.has.jav=true;I.ammo.jav=2;}I.has.m16=true;I.ammo.m16=Math.max(I.ammo.m16,40);
  const b=newBot(r.team,B.x+(Math.random()-.5)*20,B.z+(Math.random()-.5)*20,r.name,I,r.heavy);b.heavy=r.heavy;b.lives=r.lives;b.wrole=r.wrole;b.cmd=r.cmd||'gather';b.role='gather';
  // atdzimušais sāk bāzes aizsardzībā; kad aizsargu kļūst daudz, viņus sūta jaunā uzbrukumā
  const S=SQ.find(q=>q.team===r.team&&q.role==='def');if(S){b.sq=S;b.wrole='def';S.mem.push(b);b.fo=[((S.mem.length%3)-1)*3,-Math.floor(S.mem.length/3)*3];}else makeSquad(r.team,[b],'def');
  explosionFx(b.g.position.x,1,b.g.position.z,1,0x81c784);}}
// uzvara par visu pretinieku iznīcināšanu tikai tad, ja neviens vairs negaida atdzimšanu
const _warWin23=warWin;warWin=function(T){const L=ARMY[0]===T?ARMY[1]:ARMY[0],byFlag=FL.some(F=>(F.held===T&&F.holdH>=48)||(F.team!==T&&F.cd!=null&&F.cd<=0));if(!byFlag&&RESP.some(r=>r.team===L))return;_warWin23(T);};
const _updateFx23b=updateFx;updateFx=function(dt){_updateFx23b(dt);if(isWar()&&NET.role!=='guest')respTick();};
