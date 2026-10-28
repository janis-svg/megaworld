// 63_hud.js - Telefona HUD: helikopterā un lidmašīnā ⬇ poga (klase hfly) (61. fails to slēpa karā), karā nav pulksteņa, mazās ikonas zem ⚙️, Mērķi un ⛽ blakus ⚙️, tehnikā nav garās joslas
const topr63=document.createElement('div');topr63.id='topr';document.body.appendChild(topr63);
const fuel63=document.createElement('div');fuel63.id='fuelc';fuel63.className='panel';topr63.appendChild(fuel63);
let war63=null,hfly63=null,fuelV63=-1;
const _updateHint63=updateHint;updateHint=function(){_updateHint63();if(TOUCH&&(heliMode||jetMode||inTank))$('hint').style.display='none';};
const _updateFx63=updateFx;updateFx=function(dt){_updateFx63(dt);const D=document.documentElement,w=isWar(),hf=!!heliMode||!!jetMode;
 if(w!==war63){war63=w;D.classList.toggle('war',w);if(TOUCH){if(w)topr63.appendChild(qEl);else if(qEl.parentNode===topr63)document.body.appendChild(qEl);}}
 if(hf!==hfly63){hfly63=hf;D.classList.toggle('hfly',hf);fuel63.style.display=heliMode&&TOUCH?'block':'none';}
 if(heliMode&&TOUCH){const f=Math.round(heliMode.fuel||0);if(f!==fuelV63){fuelV63=f;fuel63.textContent='⛽ '+f;fuel63.classList.toggle('low',f<15);}}};
