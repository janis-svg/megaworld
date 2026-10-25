// 39_kods.js - Spēle zem koda: ar spēlētāja kodu var spēlēt vienam, ar admin kodu var arī sākt kopīgo spēli; ar uzaicinājuma saiti kods nav vajadzīgs
Object.assign(T.lv,{gate_t:'🔒 Ievadi kodu',gate_p:'Kodu tev iedos tas, kurš padalījās ar spēli.',gate_go:'Ienākt',gate_bad:'Nepareizs kods',gate_mp:'🔒 Kopīgo spēli var sākt tikai ar admin kodu. Pievienoties var ar drauga uzaicinājuma saiti.',gate_ch:'🔑 Cits kods',gate_adm:'🔑 Admin: vari uzaicināt draugus'});
Object.assign(T.en,{gate_t:'🔒 Enter the code',gate_p:'Ask the person who shared the game for the code.',gate_go:'Enter',gate_bad:'Wrong code',gate_mp:'🔒 Only the admin code can start a shared game. You can join with a friend\'s invite link.',gate_ch:'🔑 Other code',gate_adm:'🔑 Admin: you can invite friends'});
// kodus glabā tikai kā jaukto vērtību, nevis atklātā tekstā
function gateHash(s){let x=0x811c9dc5;for(const c of 'megaworld|'+s){x=(x^c.charCodeAt(0))>>>0;x=Math.imul(x,16777619)>>>0;}for(let i=0;i<500;i++){x=(x^(x>>>13))>>>0;x=Math.imul(x,0x5bd1e995)>>>0;x=(x^i)>>>0;}return x.toString(36);}
const GATE={q29jbt:'p',tivl4w:'a'},viaInvite=/[?&]join=/.test(location.search);
let gateLv=GATE[LS.get('gate','')]||null;
const isAdmin=()=>gateLv==='a';
const gateEl=document.createElement('div');gateEl.id='gate';document.body.appendChild(gateEl);
function gateShow(){gateEl.innerHTML='<div class="card panel"><h2>'+t('gate_t')+'</h2><p>'+t('gate_p')+'</p><input id="gatein" type="password" inputmode="numeric" autocomplete="off" maxlength="8"><button id="gatego">'+t('gate_go')+'</button><div id="gateerr"></div></div>';
 gateEl.style.display='flex';const i=$('gatein'),go=()=>{const k=GATE[gateHash(i.value.trim())];if(!k){$('gateerr').textContent=t('gate_bad');i.value='';i.focus();return;}gateLv=k;LS.set('gate',gateHash(i.value.trim()));gateEl.style.display='none';gateApply();};
 $('gatego').onclick=go;i.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')go();};setTimeout(()=>i.focus(),50);}
// kas nav admin, tam nav kopīgās spēles pogu (draugam ar uzaicinājuma saiti 🌐 paliek, lai var iziet)
function gateApply(){const a=isAdmin();for(const id of ['lobbyb'])if($(id))$(id).style.display=a&&!viaInvite?'':'none';if($('mpb'))$('mpb').style.display=a||viaInvite?'':'none';
 let n=$('gatech');if(!n){n=document.createElement('button');n.id='gatech';n.className='corner';n.onclick=e=>{e.preventDefault();gateShow();};$('start').parentNode.appendChild(n);}n.textContent=a?t('gate_adm'):t('gate_ch');n.style.display=viaInvite?'none':'';}
const _netHost26=netHost;netHost=function(){if(!isAdmin()){say(t('gate_mp'),4);return;}_netHost26();};
const _lobbyBegin26=lobbyBegin;lobbyBegin=function(){if(!isAdmin()){say(t('gate_mp'),4);start();return;}_lobbyBegin26();};
if(viaInvite)gateApply();else if(gateLv)gateApply();else{gateApply();gateShow();}
