// 64_pagriezt_palidziba.js - 📱 poga pirms ⚙️ pagriež ekrānu (pilnekrāns + orientācijas fiksēšana), spēles sākumā viens ekrāns ar pogu skaidrojumu
Object.assign(T.lv,{rot_no:'📱 Šis telefons neļauj pagriezt ekrānu no spēles. Pagriez telefonu pats.',hl_t:'🎮 Pogas',hl_go:'Tālāk ▶',
 hl_foot:'🚶 Kājām',hl_heli:'🚁 Helikopters',hl_jet:'✈️ Lidmašīna',hl_tank:'🛡️ Tanks',
 hl_f:[['🕹️','iet (kloķis)'],['👆','pagriezties (velc ar pirkstu)'],['⬆','lēkt'],['⚔️','šaut / sist'],['🔄','mainīt ieroci'],['🤚','iekāpt tehnikā, paņemt, atvērt'],['📣','pavēles komandai']],
 hl_h:[['⬆','uz augšu'],['⬇','uz leju'],['🔫','ložmetējs'],['🚀','raķete (lido uz ◯ mērķīti)'],['🎆','mānekļi pret raķetēm'],['🛬','nosēsties'],['⛽','degviela']],
 hl_j:[['🕹️','pagrieziens, augstums'],['⚔️','raķete'],['🎆','mānekļi pret raķetēm'],['🪂','katapultēties']],
 hl_k:[['🕹️','braukt'],['⚔️','šaut ar lielgabalu'],['🎆','mānekļi pret raķetēm'],['⬇️','izkāpt']]});
Object.assign(T.en,{rot_no:'📱 This phone does not let the game rotate the screen. Turn the phone yourself.',hl_t:'🎮 Buttons',hl_go:'Next ▶',
 hl_foot:'🚶 On foot',hl_heli:'🚁 Helicopter',hl_jet:'✈️ Jet',hl_tank:'🛡️ Tank',
 hl_f:[['🕹️','walk (stick)'],['👆','turn (drag with finger)'],['⬆','jump'],['⚔️','shoot / hit'],['🔄','switch weapon'],['🤚','enter vehicle, pick up, open'],['📣','orders to your team']],
 hl_h:[['⬆','up'],['⬇','down'],['🔫','machine gun'],['🚀','rocket (flies to the ◯ sight)'],['🎆','flares against rockets'],['🛬','land'],['⛽','fuel']],
 hl_j:[['🕹️','turn, height'],['⚔️','rocket'],['🎆','flares against rockets'],['🪂','eject']],
 hl_k:[['🕹️','drive'],['⚔️','fire the cannon'],['🎆','flares against rockets'],['⬇️','get out']]});
// ekrāna pagriešana: Android Chrome atļauj fiksēt orientāciju tikai pilnekrānā
{const b=document.createElement('button');b.className='corner';b.id='rotb';b.textContent='📱';$('cfg').before(b);
 const land=()=>innerWidth>innerHeight,paint=()=>b.classList.toggle('land',land());paint();addEventListener('resize',paint);
 b.onclick=async e=>{e.currentTarget.blur();const D=document.documentElement,so=screen.orientation;
  try{if(document.fullscreenElement&&land()){if(so&&so.unlock)so.unlock();await document.exitFullscreen();return;}
   if(!document.fullscreenElement&&D.requestFullscreen)await D.requestFullscreen({navigationUI:'hide'});
   if(!so||!so.lock)throw 0;await so.lock(land()?'portrait-primary':'landscape-primary');}
  catch(x){if(!land()&&document.fullscreenElement)document.exitFullscreen().catch(()=>{});say(t('rot_no'),3.5);}};}
// pogu skaidrojums vienreiz katrā atvēršanā (tikai telefonā); vienam spēlējot spēle stāv, kamēr nav nospiests Tālāk
const hlEl=document.createElement('div');hlEl.id='hlp';document.body.appendChild(hlEl);let hlShown64=false;
function hlShow(){const col=(k,L)=>'<div class="hc"><b>'+t(k)+'</b>'+L.map(r=>'<div><span>'+r[0]+'</span>'+r[1]+'</div>').join('')+'</div>';
 hlEl.innerHTML='<div class="card panel"><h2>'+t('hl_t')+'</h2><div class="hg">'+col('hl_foot',t('hl_f'))+col('hl_heli',t('hl_h'))+col('hl_jet',t('hl_j'))+col('hl_tank',t('hl_k'))+'</div><button id="hlgo">'+t('hl_go')+'</button></div>';
 const solo=!NET.role;if(solo)active=false;hlEl.style.display='flex';
 $('hlgo').onclick=e=>{e.preventDefault();hlEl.style.display='none';if(solo){active=true;clock.getDelta();}};}
const _start64=start;start=function(){_start64.apply(this,arguments);if(TOUCH&&!hlShown64&&active){hlShown64=true;hlShow();}};
