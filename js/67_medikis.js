// 67_medikis.js - Karā katrai armijai viens mediķis ➕: tikai M16, skrien par 15% ātrāk, parasti stāv drošā vietā dziļāk savā pusē un cīnās tur.
// 📣 ➕ Mediķis: viņš skrien pie saucēja (nešauj pa ceļam), atjauno dzīvību līdz 100 un skrien atpakaļ. Aptieciņas nav uz skaita.
Object.assign(T.lv,{o_med:'Mediķi!',med_new:'➕ Tavai armijai ir mediķis: {n}. Sauc viņu ar 📣 ➕',med_go:'➕ Mediķis {n} skrien pie tevis',med_none:'➕ Mediķa šobrīd nav',med_ok:'➕ {n} tevi izārstēja',med_far:'➕ Mediķis netika klāt'});
Object.assign(T.en,{o_med:'Medic!',med_new:'➕ Your army has a medic: {n}. Call him with 📣 ➕',med_go:'➕ Medic {n} is running to you',med_none:'➕ No medic right now',med_ok:'➕ {n} healed you',med_far:'➕ The medic could not reach you'});
ORDK.push(['med','➕',0xff5252]);ORDI.med={i:'➕',c:0xff5252};
// pārējos režīmos mediķa pavēles nav
const _cmdRender67=cmdRender;cmdRender=function(){_cmdRender67();if(!isWar()){const b=cmdP.querySelector('[data-o="med"]');if(b)b.remove();}};
const medOn=b=>b&&b.med&&!b.dead&&isWar()&&NET.role!=='guest';
let medT=0;
function medPick(){for(const T of ARMY){if(humans.some(b=>b.med&&!b.dead&&b.team===T))continue;const B=WB[ARMY.indexOf(T)];
  const L=humans.filter(b=>b.team===T&&!b.dead&&!b.inside&&!b.trader&&!b.snp&&!b.jet&&!b.heli&&!b.para&&!b.tankV&&!b.jetGoal&&!b.heliGoal&&!b.tankGoal&&!b.gen&&!b.pil&&!b.ord&&b.wrole!=='esc');
  if(!L.length)continue;L.sort((a,c)=>Math.hypot(a.g.position.x-B.x,a.g.position.z-B.z)-Math.hypot(c.g.position.x-B.x,c.g.position.z-B.z));medMake(L[0]);}}
function medMake(b){b.med=true;b.medCall=null;b.medBack=false;b.wrole='med';b.sq=null;b.qGoal=null;for(const S of SQ)S.mem=S.mem.filter(q=>q!==b);
 for(const k of Object.keys(b.I.has))if(k!=='m16'&&k!=='hands'&&WP[k]&&k!=='med'){b.I.has[k]=false;b.I.ammo[k]=0;}b.I.has.m16=true;b.I.ammo.m16=Math.max(b.I.ammo.m16||0,100);b.w='m16';
 relabel(b);if(b.team===PT&&active)say(tf('med_new',{n:b.name}),4);}
// drošā vieta: 18% ceļa no savas bāzes uz pretinieku, brīva no sienām
function medSafe(b){const i=ARMY.indexOf(b.team),B=WB[i],E=WB[1-i];let x=B.x+(E.x-B.x)*.18,z=B.z+(E.z-B.z)*.18;
 if(wallAt(x,z,1)||overlapAt(x,z,.35)){const s=freeSpot(x,z,.35,1,25);if(s){x=s[0];z=s[1];}}return{x,z};}
const _ordExec67=ordExec;ordExec=function(Tm,c,k){if(k!=='med')return _ordExec67(Tm,c,k);const cp=cmdrPos(c);if(!cp||!Tm)return;
 const tell=s=>{if(c.P)say(s,2.5);else netTo(c.G,{t:'msg',s,d:2.5});};
 const m=isWar()&&humans.find(b=>b.med&&!b.dead&&b.team===Tm&&!b.inside);if(!m){tell(t('med_none'));return;}
 pingAdd(Tm,cp.x,cp.z,'med',c.P?($('nickname').value||'?'):c.G.name);m.medCall={c,until:gtime+70};m.medBack=false;m.ord=null;m.tg=null;m.gx=null;m.th=0;tell(tf('med_go',{n:m.name}));};
function medHeal(m,c){if(c.P){health=100;updateHealth();say(tf('med_ok',{n:m.name}),3);sfx('pick');}else if(c.G&&!c.G.dead){c.G.hp=100;netMe(c.G);netTo(c.G,{t:'msg',s:tf('med_ok',{n:m.name}),d:3});}}
const _botThink67=botThink;botThink=function(b){if(!medOn(b)||b.jet||b.heli||b.para||b.tankV||warWait())return _botThink67(b);
 b.ord=null;b.qGoal=null;if(b.sq){for(const S of SQ)S.mem=S.mem.filter(q=>q!==b);b.sq=null;}b.follow=false;b.tankGoal=null;b.jetGoal=null;b.heliGoal=null;
 const p=b.g.position,M=b.medCall;
 if(M){const cp=cmdrPos(M.c),dead=M.c.P?!active||health<=0:!cp;
  if(dead||gtime>M.until){if(!dead&&M.c.P)say(t('med_far'),2.5);b.medCall=null;b.medBack=true;}
  else{const d=Math.hypot(cp.x-p.x,cp.z-p.z),low=M.c.P?pY<2.5&&!heliMode&&!jetMode&&!inTank:!M.c.G.inHeli&&!M.c.G.inJet&&!M.c.G.gtk;
   if(d<2.6&&low){medHeal(b,M.c);b.medCall=null;b.medBack=true;b.gx=null;}else{b.tg=null;goal(b,cp.x,cp.z,d>120);}return;}}
 const S=b.medSafe||(b.medSafe=medSafe(b)),ds=Math.hypot(S.x-p.x,S.z-p.z);
 if(b.medBack){if(ds<6)b.medBack=false;else{b.tg=null;goal(b,S.x,S.z,ds>40);return;}}
 // drošajā vietā cīnās kā parasts kareivis, bet tālu prom neiet
 const th=nearestThreat(b);if(th&&th.ed<40&&ds<30)return _botThink67(b);
 if(ds>4)goal(b,S.x,S.z,ds>40);else{b.gx=null;b.tg=th&&th.ed<60?th.e:null;if(b.tg)b.w=bestW(b,th.e,th.ed);}};
// +15% ātrums: pēc parastā soļa pieliek vēl 15% no nobīdes, ja tur nav šķēršļa; izsaukts un atpakaļceļā skrien (7 m/s kā sekotāji, +15%)
const _botMove67=botMove;botMove=function(b,dt,i){if(!b.med||!isWar())return _botMove67(b,dt,i);const p=b.g.position,x0=p.x,z0=p.z;_botMove67(b,dt,i);
 const k=(b.medCall||b.medBack)&&!b.tg?7*1.15/3.6-1:.15,nx=p.x+(p.x-x0)*k,nz=p.z+(p.z-z0)*k;if((p.x!==x0||p.z!==z0)&&Math.hypot(p.x-x0,p.z-z0)<1&&!overlapAt(nx,nz,.35)&&!wallAt(nx,nz,.3)){p.x=nx;p.z=nz;}};
let medLab=false;const _mkLabel67=mkLabel;mkLabel=function(txt,col){return _mkLabel67(medLab?txt.replace(/^(★ |⚔️ )?/,'$1➕ '):txt,col);};
const _relabel67=relabel;relabel=function(b){medLab=!!b.med;try{_relabel67(b);}finally{medLab=false;}};
const _updateFx67=updateFx;updateFx=function(dt){_updateFx67(dt);if(!isWar()||NET.role==='guest'||!active&&!(NET.role==='host'&&NET.guests.size))return;medT-=dt;if(medT<=0){medT=.5;medPick();}};
const _killBot67=killBot;killBot=function(b,src){if(b&&b.med){b.wrole='att';b.medCall=null;}return _killBot67(b,src);};
