// 61_kars_bez_buvesanas.js - Karā būvēt nevar: nav 🧱/🔨 pogu, B neko nedara, draugu būvēšanas ziņas saimnieks ignorē
const _toggleBuild61=toggleBuild;toggleBuild=function(){if(isWar()){if(buildMode){buildMode=false;renderW();selectW(cur);}return;}_toggleBuild61();};
const _guestBuild61=guestBuild;guestBuild=function(G,d){if(isWar())return;return _guestBuild61(G,d);};
let warCls61=null;
const _updateFx61=updateFx;updateFx=function(dt){_updateFx61(dt);const w=isWar();if(w&&buildMode){buildMode=false;renderW();}if(w!==warCls61){warCls61=w;document.documentElement.classList.toggle('nobuild',w);}};
