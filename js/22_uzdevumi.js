// 22_uzdevumi.js - Grūtības līmenis, dienas uzdevumi, nozīmītes (spēlētājiem un botiem: jo vairāk nozīmīšu, jo stiprāka dzīvība), apmācība ar Kasparu
Object.assign(T.lv,{d_easy:'😊 Viegls',d_normal:'🙂 Parasts',d_hard:'😈 Grūts',quests:'Uzdevumi',qdone:'Uzdevums izpildīts',newb:'Jauna nozīmīte',bbonus:'dzīvība stiprāka: +{n}%',badges:'Nozīmītes',ball:'Visu laiku savāktas',bbots:'Stiprākie cilvēki',bnone:'Vēl nav',
 q_kz:'Uzvari {n} zombijus',q_ks:'Uzvari {n} skeletus',q_kf:'Uzvari {n} meža cilvēkus',q_tame:'Iegūsti dzīvnieku (pieradini vai nopērc)',q_sell:'Pārdod {n} ražas tirgotājam',q_plant:'Iestādi {n} kokus vai puķes',q_coin:'Savāc {n} monētas',q_loot:'Atrodi {n} lietas atvilknēs un plauktos',
 q_build:'Uzbūvē {n} klučus',q_flower:'Noplūc {n} puķes',q_night:'Izdzīvo līdz rītam',q_recruit:'Pieņem kādu savā komandā',q_house:'Apdzīvo vai uzlabo savu māju',
 b_night:'Pirmā nakts izdzīvota',b_z10:'10 monstri uzvarēti',b_wolf:'Vilkacis uzvarēts',b_zw:'Zombvilks uzvarēts',b_cann:'Cilvēkēdājs uzvarēts',b_pet:'Pirmais mājdzīvnieks',b_live:'10 dzīvnieki saimniecībā',b_forest:'Savs mežs (20 koki)',b_house:'Sava māja',b_def:'Māja nosargāta',
 b_rich:'100 monētas',b_tank:'Brauciens ar tanku',b_d5:'5 dienas izdzīvotas',b_moon:'Pilnmēness nakts izdzīvota',b_boss:'Mēness milzis uzvarēts',b_star:'10 uzdevumi izpildīti',b_horse:'Jātnieks',b_team:'Komanda no 5',
 tut1:'👋 Sveiks! Es esmu Kaspars. Paej pa ielu ar kloķi (datorā WASD).',tut2:'📦 Blakus ir būdiņa. Ieej un atver atvilkni ar 🤚 (datorā E). Tur ir pistole!',tut3:'🔫 Tagad pamēģini uzbrukt ar lielo ⚔️ pogu (datorā klikšķis vai F).',
 tut4:'🔨 Uzbūvē klucīti: spied 🔨, tad ⚔️ (datorā B un klikšķis). Vēlreiz 🔨 izslēdz būvēšanu.',tut5:'🗺️ Minikartē redzi tirgotājus 🛒, tankus 🚜 un brīvas mājas 🏠 pilsētas malā. Apdzīvo māju, tā būs tava bāze!',
 tut6:'📋 Augšā ir dienas uzdevumi, par tiem dabū monētas un ⭐. Naktī nāk zombiji, sagatavojies! Veiksmi!',tutskip:'Izlaist'});
Object.assign(T.en,{d_easy:'😊 Easy',d_normal:'🙂 Normal',d_hard:'😈 Hard',quests:'Quests',qdone:'Quest done',newb:'New badge',bbonus:'stronger life: +{n}%',badges:'Badges',ball:'Collected all time',bbots:'Strongest people',bnone:'None yet',
 q_kz:'Defeat {n} zombies',q_ks:'Defeat {n} skeletons',q_kf:'Defeat {n} forest people',q_tame:'Get an animal (tame or buy)',q_sell:'Sell {n} produce to a trader',q_plant:'Plant {n} trees or flowers',q_coin:'Collect {n} coins',q_loot:'Find {n} things in drawers and shelves',
 q_build:'Build {n} blocks',q_flower:'Pick {n} flowers',q_night:'Survive until morning',q_recruit:'Take someone into your team',q_house:'Move into or upgrade your house',
 b_night:'First night survived',b_z10:'10 monsters defeated',b_wolf:'Werewolf defeated',b_zw:'Zombwolf defeated',b_cann:'Cannibal defeated',b_pet:'First pet',b_live:'10 farm animals',b_forest:'Own forest (20 trees)',b_house:'Own house',b_def:'House defended',
 b_rich:'100 coins',b_tank:'Tank ride',b_d5:'5 days survived',b_moon:'Full moon night survived',b_boss:'Moon giant defeated',b_star:'10 quests done',b_horse:'Rider',b_team:'Team of 5',
 tut1:'👋 Hi! I am Kaspars. Walk along the street with the joystick (WASD on a computer).',tut2:'📦 There is a hut nearby. Go in and open the drawer with 🤚 (E). There is a pistol!',tut3:'🔫 Now try to attack with the big ⚔️ button (click or F).',
 tut4:'🔨 Build a block: press 🔨, then ⚔️ (B and click). Press 🔨 again to stop building.',tut5:'🗺️ The minimap shows traders 🛒, tanks 🚜 and free houses 🏠 at the edge of the city. Move into a house, it will be your base!',
 tut6:'📋 At the top are daily quests, they give coins and ⭐. Zombies come at night, get ready! Good luck!',tutskip:'Skip'});
// pārlūka atmiņa (var nebūt pieejama, tad vienkārši neatceras)
const LS={get(k,d){try{const v=localStorage.getItem('mw_'+k);return v===null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem('mw_'+k,JSON.stringify(v));}catch(e){}}};
// ---------- grūtības līmenis (izvēlas tas, kurš sāk spēli) ----------
const DIFF={easy:{dmg:.55,mon:.6,coins:30},normal:{dmg:1,mon:1,coins:0},hard:{dmg:1.3,mon:1.35,coins:0}};
let diff=LS.get('diff','normal');if(!DIFF[diff])diff='normal';
{const row=document.createElement('div');row.id='diffrow';row.innerHTML=['easy','normal','hard'].map(k=>'<button class="corner" data-d="'+k+'"></button>').join('');$('start').before(row);
 row.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.preventDefault();diff=b.dataset.d;LS.set('diff',diff);paintDiff();});
 if(/[?&]join=/.test(location.search))row.style.display='none';}
paintDiff();
function paintDiff(){document.querySelectorAll('#diffrow button').forEach(b=>{b.textContent=t('d_'+b.dataset.d);b.classList.toggle('on',b.dataset.d===diff);});}
const _applyLang5=applyLang;applyLang=function(){_applyLang5();paintDiff();renderQuests();};
const _damagePlayer5=damagePlayer;damagePlayer=function(dmg,src,pierce){_damagePlayer5(dmg*DIFF[diff].dmg*(1-bonusP()),src,pierce);};
const _damageGuest5=damageGuest;damageGuest=function(G,dmg,src,pierce){_damageGuest5(G,dmg*DIFF[diff].dmg*(1-bonusP()),src,pierce);};
const _spawnZombie5=spawnZombie;spawnZombie=function(a){const m=DIFF[diff].mon;if(m<1&&Math.random()>m)return;_spawnZombie5(a);if(m>1&&Math.random()<m-1)_spawnZombie5(a);};
const _spawnSkeleton5=spawnSkeleton;spawnSkeleton=function(){const m=DIFF[diff].mon;if(m<1&&Math.random()>m)return;_spawnSkeleton5();if(m>1&&Math.random()<m-1)_spawnSkeleton5();};
// ---------- nozīmītes: kopīgas visai komandai (arī draugiem); katra dara dzīvību stiprāku ----------
const BADGES=[['night','🌙'],['z10','🧟'],['wolf','🐺'],['zw','👹'],['cann','👺'],['pet','🐕'],['live','🐄'],['forest','🌳'],['house','🏠'],['def','🛡️'],['rich','🪙'],['tank','🚜'],['d5','📅'],['moon','🌕'],['boss','👑'],['star','⭐'],['horse','🐴'],['team','👥']];
const BIC=Object.fromEntries(BADGES);
const QS={q:[],stars:0,b:[]};
const bonusP=()=>Math.min(.45,QS.b.length*.025);
let qst={kz:0,trees:0},qDirty=true,qT=0,coinBase=0,tameBase=0,memBase=0;
const bsay=bcastMsgOf((s,d)=>say(s,d));
function fanfare(){[523,659,784,1047].forEach((f,i)=>tone(f,.18,'triangle',.11,0,i*.1));}
function saveColl(){const c=new Set(LS.get('coll',[]));for(const b of QS.b)c.add(b);LS.set('coll',[...c]);}
function badge(id){if(NET.role==='guest'||QS.b.includes(id))return;QS.b.push(id);qDirty=true;bsay('🏅 '+t('newb')+': '+BIC[id]+' '+t('b_'+id)+' · '+tf('bbonus',{n:Math.round(bonusP()*100)}),4);fanfare();saveColl();renderBadges();}
// boti arī krāj nozīmītes: katra -5% ievainojumu (līdz -35%)
const BBIC={hunt:'🎯',beast:'🐺',n3:'🌙',farm:'🌻',def:'🛡️',war:'⚔️',rich:'🪙'};
function botBadge(b,id){if(!b||b.dead||b.trader)return;b.badges=b.badges||new Set();if(b.badges.has(id))return;b.badges.add(id);relabel(b);
 if(Math.hypot(b.g.position.x-player.position.x,b.g.position.z-player.position.z)<40)popup('🏅 '+BBIC[id],b.g.position.clone().add(new THREE.Vector3(0,2.9,0)));}
const _hurtBot5=hurtBot;hurtBot=function(b,dmg,src,pl,pierce){_hurtBot5(b,dmg*(1-Math.min(.35,(b.badges?b.badges.size:0)*.05)),src,pl,pierce);};
let labSuf='';const _mkLabel5=mkLabel;mkLabel=function(txt,col){return _mkLabel5(txt+labSuf,col);};
const _relabel5=relabel;relabel=function(b){labSuf=b.badges&&b.badges.size?' 🏅'+b.badges.size:'';try{_relabel5(b);}finally{labSuf='';}};
// ---------- dienas uzdevumi: katru rītu 3 jauni ----------
const QP=[['kz','🧟',5],['ks','💀',3],['kf','🌲',2],['tame','🐾',1],['sell','🛒',5],['plant','🌳',3],['coin','🪙',40],['loot','📦',6],['build','🧱',10],['flower','🌸',3],['night','🌙',1],['recruit','🤝',1],['house','🏠',1]];
const QIC=Object.fromEntries(QP.map(q=>[q[0],q[1]]));
function newQuests(){const pool=[...QP].sort(()=>Math.random()-.5);QS.q=pool.slice(0,3).map(([id,ic,n])=>({id,n,p:0}));qDirty=true;}
function qText(q){return t('q_'+q.id).replace('{n}',q.n);}
function qEv(id,k){if(NET.role==='guest'||!id)return;for(const q of QS.q)if(q.id===id&&q.p<q.n){q.p=Math.min(q.n,q.p+(k||1));qDirty=true;if(q.p>=q.n)qDone(q);}}
function qDone(q){const r=15+Math.floor(Math.random()*4)*5;PT.coins=(PT.coins||0)+r;coinBase+=r;QS.stars++;bsay('📋 '+t('qdone')+': '+QIC[q.id]+' '+qText(q)+' · +'+r+' 🪙 ⭐',3.5);sfx('heal');if(QS.stars>=10)badge('star');}
// notikumi, no kuriem skaitās uzdevumi un nozīmītes
const _killZombie5=killZombie;killZombie=function(z,pl,boom){const u=z.userData,was=!u.dead;_killZombie5(z,pl,boom);if(!was||boom||NET.role==='guest')return;
 if(pl){qEv({z:'kz',s:'ks',f:'kf'}[u.kind]);if(u.kind!=='f'){qst.kz++;if(qst.kz>=10)badge('z10');}if(u.kind==='w')badge('wolf');if(u.kind==='zw'&&!u.boss)badge('zw');if(u.kind==='c')badge('cann');return;}
 let best=null,bd=35;for(const b of humans){if(b.dead||!b.tg||b.tg.m!==z)continue;const d=Math.hypot(b.g.position.x-z.position.x,b.g.position.z-z.position.z);if(d<bd){bd=d;best=b;}}
 if(best){best.kills=(best.kills||0)+1;if(best.kills>=5)botBadge(best,'hunt');if(u.kind==='w'||u.kind==='zw'||u.kind==='c')botBadge(best,'beast');}};
const _killBot5=killBot;killBot=function(b,src){const was=!b.dead,p=b.g.position.clone();_killBot5(b,src);if(!was||NET.role==='guest'||!src||src===PT)return;
 let best=null,bd=35;for(const m of src.members||[]){const d=Math.hypot(m.g.position.x-p.x,m.g.position.z-p.z);if(d<bd){bd=d;best=m;}}if(best)botBadge(best,'war');};
const _castSpell5=castSpell;castSpell=function(k,px,pz,a,I,team,src){const ok=_castSpell5(k,px,pz,a,I,team,src);if(ok&&team===PT&&(k==='grow'||k==='flow')){qEv('plant');if(k==='grow'){qst.trees++;if(qst.trees>=20)badge('forest');}}return ok;};
const _sell5=sell;sell=function(k,owner){const I=owner==='P'?inv:owner.I,n0=(I.prod&&I.prod[k])||0,r=_sell5(k,owner);if(((I.prod&&I.prod[k])||0)<n0)qEv('sell');return r;};
const _giveLoot5=giveLoot;giveLoot=function(k,I,Tm){const r=_giveLoot5(k,I,Tm);if(Tm===PT&&NET.role!=='guest')qEv('loot');return r;};
let noQ=false;const _placeBlock5=placeBlock;placeBlock=function(x,z,Tm,door,win){const b=_placeBlock5(x,z,Tm,door,win);if(b&&Tm===PT&&!noQ&&NET.role!=='guest')qEv('build');return b;};
const _pickFlower5=pickFlower;pickFlower=function(p,I){_pickFlower5(p,I);qEv('flower');};
const _claimHouse5=claimHouse;claimHouse=function(H){_claimHouse5(H);qEv('house');badge('house');};
const _raidTick5=raidTick;raidTick=function(){const R=raid;_raidTick5();if(R&&!raid&&(!teams.includes(R.A)||!R.A.members.length)){if(R.D===PT)badge('def');else for(const m of R.D.members||[])botBadge(m,'def');}};
const _dawn5=dawn;dawn=function(){
 if(NET.role!=='guest'){if(active||[...NET.guests.values()].some(G=>G.ready&&!G.dead)){qEv('night');badge('night');}
  for(const b of humans){if(b.dead||b.trader)continue;b.nights=(b.nights||0)+1;if(b.nights>=3)botBadge(b,'n3');}
  for(const Tm of teams){if(Tm.farm&&Tm.base&&chickens.filter(c=>Math.hypot(c.g.position.x-Tm.base.x,c.g.position.z-Tm.base.z)<12).length>=6)Tm.members.forEach(m=>botBadge(m,'farm'));if(!Tm.isPlayer&&(Tm.coins||0)>=60)Tm.members.forEach(m=>botBadge(m,'rich'));}}
 _dawn5();
 if(NET.role!=='guest'){if(day>=6)badge('d5');newQuests();}
};
const mineP=o=>o==='P'||(o&&o.pos);
function questTick(dt){
 qT-=dt;if(qT>0)return;qT=1;
 const tame=pets.filter(p=>mineP(p.owner)).length+chickens.filter(c=>c.owned).length;if(tame>tameBase)qEv('tame',tame-tameBase);tameBase=tame;
 const co=PT.coins||0;if(co>coinBase)qEv('coin',co-coinBase);coinBase=co;
 const mem=PT.members.length;if(mem>memBase)qEv('recruit',mem-memBase);memBase=mem;
 if(mem+1+[...NET.guests.values()].filter(G=>G.ready).length>=5)badge('team');
 if(co>=100)badge('rich');if(inTank)badge('tank');if(pets.some(p=>mineP(p.owner)))badge('pet');if(chickens.filter(c=>c.owned).length>=10)badge('live');
 if(qDirty){qDirty=false;renderQuests();if(NET.role==='host'&&NET.guests.size)netQ.push({e:'qs',s:QS});}
}
const _updateFx5=updateFx;updateFx=function(dt){_updateFx5(dt);if(NET.role!=='guest'&&(active||NET.guests.size))questTick(dt);tutTick(dt);};
const _start5=start;start=function(){QS.q=[];QS.stars=0;QS.b=[];qst={kz:0,trees:0};_start5();PT.coins=(PT.coins||0)+DIFF[diff].coins;coinBase=PT.coins;tameBase=0;memBase=0;newQuests();renderQuests();renderBadges();tutBegin();};
// pogas bija piesaistītas vecajai start funkcijai: tagad izsauc jaunāko (ar visiem papildinājumiem)
if($('start').onclick===_start5)$('start').onclick=()=>start();if($('again').onclick===_start5)$('again').onclick=()=>start();
// ---------- uzdevumu lodziņš (telefonā sakļauts, uzspiežot atveras) ----------
const qEl=document.createElement('div');qEl.id='quests';qEl.className='panel';document.body.appendChild(qEl);
qEl.onpointerdown=e=>{e.stopPropagation();qEl.classList.toggle('open');};
function renderQuests(){if(!qEl)return;const done=QS.q.filter(q=>q.p>=q.n).length;
 let h='<b>📋 '+t('quests')+' '+done+'/'+QS.q.length+'</b> · ⭐ '+QS.stars+' · 🏅 '+QS.b.length;
 for(const q of QS.q)h+='<div class="ql'+(q.p>=q.n?' ok':'')+'">'+(q.p>=q.n?'✅':QIC[q.id])+' '+qText(q)+(q.n>1&&q.p<q.n?' <i>'+q.p+'/'+q.n+'</i>':'')+'</div>';
 qEl.innerHTML=h;qEl.style.display=active&&QS.q.length?'block':'none';}
// ---------- nozīmīšu logs ----------
{const b=document.createElement('button');b.className='corner';b.id='bdgb';b.textContent='🏅';$('cfg').before(b);b.onclick=e=>{const el=$('badges'),on=el.style.display!=='block';el.style.display=on?'block':'none';if(on){renderBadges();$('inv').style.display='none';$('team').style.display='none';}e.currentTarget.blur();};
 const p=document.createElement('div');p.id='badges';p.className='panel';document.body.appendChild(p);}
function renderBadges(){const el=$('badges');if(!el||el.style.display!=='block')return;const coll=new Set(LS.get('coll',[]));
 let h='<button class="corner" data-x="1" style="float:right;margin:0">✖</button><b>🏅 '+t('badges')+' '+QS.b.length+'/'+BADGES.length+'</b><br><small>🛡️ '+tf('bbonus',{n:Math.round(bonusP()*100)})+' · '+t('ball')+': '+coll.size+'/'+BADGES.length+'</small><div class="bgrid">';
 for(const [id,ic] of BADGES)h+='<div class="bdg'+(QS.b.includes(id)?' on':'')+'"><span>'+ic+'</span>'+t('b_'+id)+'</div>';
 h+='</div>';
 if(NET.role!=='guest'){const top=humans.filter(b=>b.badges&&b.badges.size).sort((a,b)=>b.badges.size-a.badges.size).slice(0,5);
  h+='<b>'+t('bbots')+'</b><br>'+(top.length?top.map(b=>b.name+' '+[...b.badges].map(k=>BBIC[k]).join('')).join('<br>'):t('bnone'));}
 el.innerHTML=h;el.querySelector('[data-x]').onpointerdown=e=>{e.stopPropagation();e.preventDefault();el.style.display='none';};}
// ---------- kopīgā spēle: uzdevumi un nozīmītes draugiem ----------
function applyQS(s){const nb=s.b.length>QS.b.length;QS.q=s.q;QS.stars=s.stars;QS.b=s.b;if(nb){fanfare();saveColl();}renderQuests();renderBadges();}
const _netWelcome5=netWelcome;netWelcome=function(G){_netWelcome5(G);netTo(G,{t:'qs',s:QS});};
const _netGuestMsg5=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='qs'){applyQS(d.s);return;}_netGuestMsg5(d);if(d&&d.t==='wel')tutBegin();};
const _netExtraEv25=netExtraEv2;netExtraEv2=function(e){if(e.e==='qs'){applyQS(e.s);return;}_netExtraEv25(e);};
// ---------- apmācība: pirmajā spēlē Kaspars parāda galveno (atkārtot: saitei pieliek ?tut) ----------
const tutEl=document.createElement('div');tutEl.id='tut';tutEl.className='panel';document.body.appendChild(tutEl);
let tut=-1,tutT=0,tut0=null,tutInv=0,tutShot=false,tutBl=0;
function invCount(){if(!inv)return 0;let s=inv.meds+inv.armor+(inv.matches||0)+((PT&&PT.coins)||0);for(const k in inv.ammo)s+=inv.ammo[k]||0;for(const k in inv.has)s+=inv.has[k]?1:0;return s;}
function tutBegin(){if(LS.get('tut',0)===1&&!/[?&]tut/.test(location.search)){tut=-1;tutEl.style.display='none';return;}tutGo(0);}
function tutGo(i){tut=i;tutT=0;tut0=player.position.clone();tutInv=invCount();tutShot=false;tutBl=PT?PT.blocks:0;
 if(i>=6){tut=-1;tutEl.style.display='none';LS.set('tut',1);return;}
 tutEl.innerHTML='<button class="corner" style="float:right;margin:0 0 0 10px">'+t('tutskip')+'</button><b>🧑 Kaspars</b> <small>'+(i+1)+'/6</small><br>'+t('tut'+(i+1));tutEl.style.display='block';
 tutEl.querySelector('button').onpointerdown=e=>{e.stopPropagation();e.preventDefault();tutGo(6);};if(i)sfx('pick');}
function tutTick(dt){if(tut<0||!active)return;tutT+=dt;
 const ok=[()=>Math.hypot(player.position.x-tut0.x,player.position.z-tut0.z)>6,()=>invCount()>tutInv,()=>tutShot,()=>PT&&PT.blocks<tutBl,()=>tutT>9,()=>tutT>9][tut];
 if(tutT>.8&&ok&&ok())tutGo(tut+1);}
const _hit5=hit;hit=function(){if(active)tutShot=true;_hit5();};
