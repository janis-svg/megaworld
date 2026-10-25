// 33_kopa_sakums.js - "Spēlēt kopā ar draugiem": 60 sekunžu gaidīšana, kamēr draugi pievienojas, tad spēle sākas visiem vienlaikus no viena punkta
Object.assign(T.lv,{lob_btn:'🌐 Spēlēt kopā ar draugiem',lob_title:'🌐 Gaidām draugus',lob_send:'Nosūti šo saiti draugiem:',lob_in:'Pievienojušies',lob_go:'▶ Sākt tagad',lob_more:'+30 s',lob_left:'Spēle sāksies pēc {n} s',lob_start:'▶ Spēle sākas! Visi sāk no viena punkta.',lob_wait:'⏳ Gaidām draugus: spēle sāksies pēc {n} s'});
Object.assign(T.en,{lob_btn:'🌐 Play with friends',lob_title:'🌐 Waiting for friends',lob_send:'Send this link to your friends:',lob_in:'Joined',lob_go:'▶ Start now',lob_more:'+30 s',lob_left:'The game starts in {n} s',lob_start:'▶ The game starts! Everyone starts from the same place.',lob_wait:'⏳ Waiting for friends: the game starts in {n} s'});
const lobEl=document.createElement('div');lobEl.id='lobby';lobEl.className='panel';document.body.appendChild(lobEl);
const lobG=document.createElement('div');lobG.id='lobbyg';lobG.className='panel';document.body.appendChild(lobG);
let lobEnd=0,lobTimer=null;
{const b=document.createElement('button');b.id='lobbyb';$('start').after(b);b.dataset.k='lob_btn';b.textContent=t('lob_btn');b.onclick=e=>{e.preventDefault();lobbyBegin();};
 if(/[?&]join=/.test(location.search))b.style.display='none';}
function lobbyBegin(){start();if(!NET.role)netHost();lobEnd=Date.now()+60000;lobEl.style.display='block';clearInterval(lobTimer);lobTimer=setInterval(lobbyTick,250);lobbyRender();}
function lobbyRender(){const left=Math.max(0,Math.ceil((lobEnd-Date.now())/1000)),ready=[...NET.guests.values()].filter(G=>G.ready);
 lobEl.innerHTML='<b>'+t('lob_title')+'</b><div class="lbig">⏳ '+left+'</div>'+(NET.status?'<p>'+NET.status+'</p>':'<small>'+t('lob_send')+'</small><input id="loblink" readonly value="'+joinLink()+'"><div><button class="corner" data-a="copy">'+t('mp_copy')+'</button>'+(navigator.share?'<button class="corner" data-a="share">'+t('mp_share')+'</button>':'')+'</div>')+
  '<div class="lppl"><b>'+t('lob_in')+' ('+(1+ready.length)+'/'+(MAXG+1)+')</b><br>★ '+$('nickname').value+ready.map(G=>'<br>★ '+G.name).join('')+'</div><div><button class="corner" data-a="go">'+t('lob_go')+'</button><button class="corner" data-a="more">'+t('lob_more')+'</button></div>';
 lobEl.querySelectorAll('button').forEach(b=>b.onpointerdown=e=>{e.stopPropagation();e.preventDefault();const a=b.dataset.a;
  if(a==='copy'){const i=$('loblink');i.select();try{navigator.clipboard.writeText(i.value);}catch(err){document.execCommand('copy');}say(t('mp_copied'),2);}
  else if(a==='share')navigator.share({title:'MegaWorld',text:t('mp_sharetext'),url:joinLink()}).catch(()=>{});
  else if(a==='go')lobEnd=Date.now();else if(a==='more'){lobEnd+=30000;lobbyRender();}});}
let lobLast=-1;
function lobbyTick(){const left=Math.max(0,Math.ceil((lobEnd-Date.now())/1000));
 if(left!==lobLast){lobLast=left;const keep=document.activeElement&&document.activeElement.id==='loblink';if(!keep)lobbyRender();for(const G of NET.guests.values())if(G.ready)netTo(G,{t:'lob',s:left});}
 if(left<=0){clearInterval(lobTimer);lobTimer=null;lobEl.style.display='none';lobbyStart();}}
// spēle sākas no jauna visiem kopā: tā pati pasaule, viens sākuma brīdis
function lobbyStart(){start();
 if(isWar())for(const G of NET.guests.values()){if(!G.ready||G.side===undefined)continue;const T=ARMY[G.side];if(!T||T===PT)continue;G.team=T;const B=WB[G.side];G.pos.set(B.x+2,0,B.z+4);netTo(G,{t:'tp',x:G.pos.x,z:G.pos.z});}
 sayAll(t('lob_start'),4);for(const G of NET.guests.values())if(G.ready)netTo(G,{t:'lob',s:0});}
// draugam: josla ar atlikušo laiku
const _netGuestMsg19=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='lob'){if(d.s>0){lobG.textContent=tf('lob_wait',{n:d.s});lobG.style.display='block';}else lobG.style.display='none';return;}_netGuestMsg19(d);};
// karā armijā jau ir 30, tāpēc nozīmīte "Komanda no 5" nepienākas
const _badge19=badge;badge=function(id){if(isWar()&&id==='team')return;_badge19(id);};
// 60 s gaidīšana sākas arī tad, ja kopīgo spēli sāk ar 🌐 pogu spēles laikā
Object.assign(T.lv,{mp_recon:'⏳ Atjauno savienojumu ar serveri...',mp_retry:'Draugs vēl nav sasniedzams, mēģina vēlreiz...'});Object.assign(T.en,{mp_recon:'⏳ Reconnecting to the server...',mp_retry:'Your friend is not reachable yet, trying again...'});
let lobActive=false;
const _netHost20=netHost;netHost=function(){const was=NET.role;_netHost20();if(!was&&NET.role==='host'&&!lobActive)lobbyTimer();};
function lobbyTimer(){lobActive=true;lobEnd=Date.now()+60000;lobEl.style.display='block';$('mp').style.display='none';clearInterval(lobTimer);lobTimer=setInterval(lobbyTick,250);lobbyRender();}
lobbyBegin=function(){lobActive=true;start();if(!NET.role)netHost();lobbyTimer();};
const _lobbyStart20=lobbyStart;lobbyStart=function(){lobActive=false;_lobbyStart20();};
// kamēr nav savienojuma, saites vietā rāda statusu; kad savienojums atjaunojies, saite atkal redzama
setInterval(()=>{if(lobEl.style.display==='block'&&!(document.activeElement&&document.activeElement.id==='loblink'))lobbyRender();},1000);
// karā, kamēr gaidām draugus, karš vēl nesākas: boti stāv, tehnikā nekāpj, lidmašīnas un helikopteri nepaceļas
Object.assign(T.lv,{lob_nowar:'⏳ Karš vēl nav sācies: tehnikā varēs kāpt pēc {n} s'});Object.assign(T.en,{lob_nowar:'⏳ The war has not started yet: vehicles are available in {n} s'});
const warWait=()=>isWar()&&lobActive&&NET.role==='host';
const lobLeft=()=>Math.max(0,Math.ceil((lobEnd-Date.now())/1000));
const _updateBots33w=updateBots;updateBots=function(dt){if(warWait())return;_updateBots33w(dt);};
const _warTick33w=warTick;warTick=function(dt){if(warWait())return;_warTick33w(dt);};
const _updateFx33w=updateFx;updateFx=function(dt){if(warWait()){botJetT=botHeliT=5;}_updateFx33w(dt);};
for(const fn of ['enterTank','enterJet','enterHeli']){const o=window[fn];window[fn]=function(...a){if(warWait()){say(tf('lob_nowar',{n:lobLeft()}),2);return;}return o.apply(this,a);};}
const _guestAct33w=guestAct;guestAct=function(G){if(warWait()&&!G.dead&&(tanks.some(t=>!t.dead&&Math.hypot(t.g.position.x-G.pos.x,t.g.position.z-G.pos.z)<4.5))){netTo(G,{t:'msg',s:tf('lob_nowar',{n:lobLeft()}),d:2});return;}_guestAct33w(G);};
const _netHostMsg33w=netHostMsg;netHostMsg=function(G,d){if(d&&warWait()&&(d.t==='jet'||d.t==='heli')){netTo(G,{t:'msg',s:tf('lob_nowar',{n:lobLeft()}),d:2});return;}_netHostMsg33w(G,d);};
