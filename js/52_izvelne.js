// 52_izvelne.js - Sākuma ekrāns pa soļiem: 1) vārds + režīms, 2) izdzīvošanas iestatījumi vai kara "viens / ar draugiem", 3) kara iestatījumi.
// Ar draugiem misiju nav (tās ir tikai solo); karti un grūtību izvēlas admins, draugs ar uzaicinājuma saiti izvēlas tikai armiju pēc pievienošanās.
Object.assign(T.lv,{st_back:'← Atpakaļ',st_who:'Kā spēlēsi?',st_solo:'🎯 Viens pret botiem',st_mp:'🌐 Ar draugiem',st_solo_s:'Misijas vai parastais karš',st_mp_s:'Tu izvēlies karti, draugi tikai armiju',st_solo_t:'🎯 Viens'});
Object.assign(T.en,{st_back:'← Back',st_who:'How will you play?',st_solo:'🎯 Solo vs bots',st_mp:'🌐 With friends',st_solo_s:'Missions or classic war',st_mp_s:'You pick the map, friends only pick an army',st_solo_t:'🎯 Solo'});
let MST=viaInvite?'g':'1';
const stHd=document.createElement('div');stHd.id='stephd';stHd.innerHTML='<button class="corner" id="stback"></button><b id="sttitle"></b>';$('nickname').after(stHd);
const stWho=document.createElement('div');stWho.id='whorow';stWho.innerHTML=['solo','mp'].map(k=>'<button class="corner" data-w="'+k+'"><b></b><small></small></button>').join('');stHd.after(stWho);
$('menu').querySelector('p[data-k="intro"]').id='intro';
// ---------- laikapstākļi izdzīvošanā: mainīgs (kā līdz šim) vai visu spēli skaidrs / lietus / migla ----------
Object.assign(T.lv,{wxc_rnd:'🎲 Mainīgs',wxc_clear:'🌤️ Skaidrs',wxc_rain:'🌧️ Lietus',wxc_fog:'🌫️ Migla'});
Object.assign(T.en,{wxc_rnd:'🎲 Changing',wxc_clear:'🌤️ Clear',wxc_rain:'🌧️ Rain',wxc_fog:'🌫️ Fog'});
const WXK=['rnd','clear','rain','fog'];let WXC=LS.get('wxc','rnd');if(!WXK.includes(WXC))WXC='rnd';let WXH=null; // WXH: saimnieka izvēle draugam
const wxRow=document.createElement('div');wxRow.id='wxrow';wxRow.innerHTML=WXK.map(k=>'<button class="corner" data-k="'+k+'"></button>').join('');$('diffrow').before(wxRow);
wxRow.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.preventDefault();WXC=b.dataset.k;LS.set('wxc',WXC);wxPaint();});
function wxPaint(){wxRow.querySelectorAll('button').forEach(b=>{b.textContent=t('wxc_'+b.dataset.k);b.classList.toggle('on',b.dataset.k===WXC);});}
const wxNow=()=>NET.role==='guest'?(WXH||'rnd'):isWar()?'rnd':WXC;
const _wxTarget52=wxTarget;wxTarget=function(){const w=wxNow();if(!active||w==='rnd')return _wxTarget52();return w==='rain'?[1,.45]:w==='fog'?[0,1]:[0,0];};
const _netWelcome52=netWelcome;netWelcome=function(G){netTo(G,{t:'wxc',w:wxNow()});_netWelcome52(G);};
const _netGuestMsg52=netGuestMsg;netGuestMsg=function(d){if(d&&d.t==='wxc'){WXH=WXK.includes(d.w)?d.w:'rnd';return;}_netGuestMsg52(d);};
// kas redzams katrā solī (pārējais paslēpts; rindas pašas joprojām lemj, vai tās vispār rāda)
const STV={'1':['intro','nickname','moderow','gatech'],s:['stephd','wxrow','diffrow','start','lobbyb'],w:['stephd','whorow'],
 ws:['stephd','siderow','misrow','maprow','diffrow','start'],wm:['stephd','siderow','maprow','diffrow','lobbyb']};
const STALL=['intro','nickname','moderow','gatech','stephd','whorow','wxrow','siderow','misrow','maprow','diffrow','start','lobbyb'];
function stGo(s){if(s==='w'&&!isAdmin())s='ws';MST=s;stPaint();}
function stPaint(){const card=$('menu').querySelector('.card');card.dataset.st=MST;const v=STV[MST];
 for(const id of STALL){const e=$(id);if(e)e.classList.toggle('mhide',v?!v.includes(id):id==='stephd'||id==='whorow');}
 $('stback').textContent=t('st_back');wxPaint();
 $('sttitle').textContent=MST==='s'?t('m_surv'):MST==='w'?t('m_war'):MST==='ws'?t('m_war')+' · '+t('st_solo_t'):MST==='wm'?t('m_war')+' · '+t('st_mp'):'';
 stWho.querySelectorAll('button').forEach(b=>{b.querySelector('b').textContent=t('st_'+b.dataset.w);b.querySelector('small').textContent=t('st_'+b.dataset.w+'_s');});}
$('stback').onclick=e=>{e.preventDefault();stGo(MST==='ws'||MST==='wm'?'w':'1');};
document.querySelectorAll('#moderow button').forEach(b=>b.addEventListener('click',()=>{if(MST==='1')stGo(b.dataset.m==='war'?'w':'s');}));
stWho.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.preventDefault();stGo(b.dataset.w==='mp'?'wm':'ws');});
const _gateApply52=gateApply;gateApply=function(){_gateApply52();if(MST==='w'&&!isAdmin())MST='ws';if(MST==='wm'&&!isAdmin())MST='ws';stPaint();};
const _applyLang52=applyLang;applyLang=function(){_applyLang52();stPaint();};
stPaint();
