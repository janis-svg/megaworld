// 66_pogas.js - Telefonā 🔫 (rādās kā ūdens pistole) aizstāts ar zīmētu pistoli/ložmetēju, lidmašīnā ⚔️ poga rāda raķetes,
// helikopterā ⬆/⬇ vienā stabiņā virs šaušanas, nāve helikopterā/izpletnī vienmēr noved pie normālas nāves, draugs helikopterā/lidmašīnā nesaņem bojājumus (kā saimnieks)
const GI_PST='<i class="gi"><svg viewBox="0 0 32 32"><path d="M2.5 8.5h26v6.5h-3v1.5H15.5l-1.4 3h-3L8.6 28.5H3.4L6.6 15H2.5z" fill="#eef2f5" stroke="#1b2228" stroke-width="1.5" stroke-linejoin="round"/><path d="M11.4 16.8a2.2 2.2 0 0 0 3.6 1.4" fill="none" stroke="#1b2228" stroke-width="1.3"/><path d="M5 11h21" stroke="#9aa6b0" stroke-width="1.2"/></svg></i>';
const GI_MG='<i class="gi"><svg viewBox="0 0 40 26"><path d="M1 9h21V6.5h4V9h13v3.5H26v3h-4.5l-1.6 3.5h-3.4v-3.5h-3l-2.3 9H6l2.3-9H1z" fill="#eef2f5" stroke="#1b2228" stroke-width="1.4" stroke-linejoin="round"/><rect x="14.5" y="15.5" width="6.5" height="6" rx="1" fill="#c9a640" stroke="#1b2228" stroke-width="1.2"/><path d="M30 12.5l-3 9M30 12.5l3 9" stroke="#1b2228" stroke-width="1.4"/><path d="M27 10.6h11" stroke="#9aa6b0" stroke-width="1.1"/></svg></i>';
// palīdzības ekrānā (64. fails) ložmetējs ar to pašu zīmējumu
for(const l of ['lv','en'])for(const r of T[l].hl_h)if(r[0]==='🔫')r[0]=GI_MG;
const _renderW66=renderW;renderW=function(){_renderW66();if(!TOUCH)return;const a=$('atk'),w=$('wsw'),veh=!!heliMode||!!inTank;
 if(jetMode){const J=jetMode;a.innerHTML='🚀<small>'+((J.rk||0)+(J.aa||0))+'</small>';}
 if(a.innerHTML.indexOf('🔫')>=0)a.innerHTML=a.innerHTML.replace('🔫',veh?GI_MG:GI_PST);
 if(w.innerHTML.indexOf('🔫')>=0)w.innerHTML=w.innerHTML.replace('🔫',veh?GI_MG:GI_PST);};
const _damageGuest66=damageGuest;damageGuest=function(G,d,s,p){if(G&&(G.inHeli||G.inJet))return;_damageGuest66(G,d,s,p);};
let jet66=null;
const _updateFx66=updateFx;updateFx=function(dt){_updateFx66(dt);const j=!!jetMode;if(j!==jet66){jet66=j;document.documentElement.classList.toggle('jfly',j);renderW();}
 // nāve tehnikā vai izpletnī: notīra helikoptera/izpletņa stāvokli, lai neiestrēgst ar 0 dzīvībām
 if(health<=0&&(heliMode||paraMode)){if(heliMode)exitHeli();paraMode=false;if(chuteM)chuteM.visible=false;if(active&&NET.role!=='guest')gameOver();}};
