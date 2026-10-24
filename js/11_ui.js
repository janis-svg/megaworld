// 11_ui.js - Inventārs, ieroču josla, mijiedarbība (E / rokas poga)
// ---------- inventārs, ieroču josla ----------
function renderInv(){
 if(!inv)return;let h='<button class="corner" id="invx" style="float:right;margin:0 0 0 12px">✖</button><b>🎒 '+t('inv')+'</b>';
 for(const w of GUNS)h+='<br>'+(/^[A-Z0-9]+$/.test(WP[w].ic)?'':WP[w].ic+' ')+t('w'+w)+': '+(inv.has[w]?inv.ammo[w]+' / '+WP[w].max:'- ('+inv.ammo[w]+')');
 h+='<br>🛡️ '+t('armor')+': '+Math.ceil(inv.armor)+'<br>🧱 '+t('blocks')+': '+(PT?PT.blocks:0)+'<br>➕ '+t('med2')+': '+inv.meds+' <button class="corner" id="usemed">'+t('use')+'</button>';
 $('inv').innerHTML=h;$('usemed').onclick=useMed;$('invx').onclick=e=>{e.stopPropagation();$('inv').style.display='none';};renderW();
}
function renderW(){
 if(!inv)return;
 if(TOUCH){const ic=s=>s.length>2?'<span style="font-size:20px;font-weight:800">'+s+'</span>':s;
  $('atk').innerHTML=inTank?'💣<small>'+inTank.shells+'</small>':buildMode?(bTool==='door'?'🚪':'🧱')+'<small>'+PT.blocks+'</small>':ic(WP[cur].ic)+(cur==='hands'?'':'<small>'+inv.ammo[cur]+'</small>');
  const nx=(()=>{let i=WL.indexOf(cur);for(let k=0;k<5;k++){i=(i+1)%5;if(WL[i]==='hands'||inv.has[WL[i]])return WL[i];}return cur;})();
  $('wsw').innerHTML=buildMode?(bTool==='door'?'🧱':'🚪'):(nx===cur?'🔄':'🔄<small style="font-size:10px">'+WP[nx].ic+'</small>');
  $('bmb').textContent=buildMode?'✖':'🔨';document.documentElement.classList.toggle('build',buildMode);}
 const wb=$('wbar'),bb=$('bbar');wb.style.display=active&&!buildMode?'flex':'none';bb.style.display=active&&buildMode?'flex':'none';
 if(buildMode){bb.innerHTML=[['blk',t('bblk')+' '+PT.blocks],['door',t('bdoor')],['rem',t('brem')],['x',t('bexit')]].map(([k,l])=>'<button class="slot'+(k===bTool?' on':'')+'" data-b="'+k+'">'+l+'</button>').join('');
  bb.querySelectorAll('button').forEach(e=>e.onpointerdown=ev=>{ev.stopPropagation();ev.preventDefault();const k=e.dataset.b;if(k==='rem')buildAct(true);else if(k==='x')toggleBuild();else{bTool=k;renderW();}});return;}
 wb.innerHTML=WL.map((w,i)=>{const has=w==='hands'||inv.has[w];return '<button class="slot'+(w===cur?' on':'')+(has?'':' off')+'" data-w="'+w+'">'+(i+1)+' '+WP[w].ic+(w==='hands'?'':' '+inv.ammo[w])+'</button>';}).join('');
 wb.querySelectorAll('button').forEach(e=>e.onpointerdown=ev=>{ev.stopPropagation();ev.preventDefault();selectW(e.dataset.w);});
}
function selectW(w){if(w!=='hands'&&!inv.has[w])return;cur=w;const gs=player.userData.guns;for(const k in gs)gs[k].visible=k===w&&!buildMode;renderW();updateAmmo();}
function nextW(){if(!active||buildMode)return;let i=WL.indexOf(cur);for(let k=0;k<5;k++){i=(i+1)%5;const w=WL[i];if(w==='hands'||inv.has[w]){selectW(w);return;}}}
function useMed(){if(!active||inv.meds<1||health>=100)return;inv.meds--;health=Math.min(100,health+40);updateHealth();renderInv();sfx('heal');say(t('healed'));}
function nearInter(){
 let best=null,bd=1e9;const px=player.position.x,pz=player.position.z;
 if(inTank)return{type:'exit'};
 for(const tk of tanks){const d=Math.hypot(tk.g.position.x-px,tk.g.position.z-pz);if(d<3.6&&d<bd&&pY<1.5){bd=d;best={type:'tank',t:tk};}}
 for(const ch of chunks.values())for(const o of ch.inter){const d=Math.hypot(o.x-px,o.z-pz);if(d<o.r&&d<bd){bd=d;best=o;}}
 if(pY<1.5)for(const b of humans){if(b.team===PT||PT.enemies.has(b.team))continue;const d=Math.hypot(b.g.position.x-px,b.g.position.z-pz);if(d<2.6&&d<bd){bd=d;best={type:'bot',b};}}
 return best;
}
let actIc='';
function setAct(ic){if(ic===actIc)return;actIc=ic;const a=$('act');a.textContent=ic||'🤚';a.classList.toggle('on',!!ic);}
function updateHint(){const o=nearInter(),h=$('hint'),key=TOUCH?'':'E / ';if(!o){h.style.display='none';setAct('');return;}
 if(o.type==='exit'){h.textContent=key+t('tank_out')+' · 💣 '+inTank.shells;h.style.display='block';setAct('⬇️');return;}
 if(o.type==='tank'){h.textContent=key+(o.t.dead?'🚜 '+t('tank_dead'):tf('tank_in',{n:o.t.shells}));h.style.display='block';setAct(o.t.dead?'':'🚜');return;}
 if(o.type==='bot'){const Tm=o.b.team,n=Tm.members.length,off=Tm.offer>gtime,strong=!off&&!Tm.friendly&&teamStr(Tm)>teamStr(PT)*1.25;
  h.textContent=key+'🤝 '+t('recruit')+': '+o.b.name+(n>1?' (+'+(n-1)+')':'')+(off?' · '+t('wants'):strong?' · '+t('strong'):'');h.style.display='block';setAct('🤝');return;}
 const k=o.type==='door'?(o.open?'hd0':'hd1'):(o.open?'hem':(o.type==='shelf'?'hsh':'hdr'));
 h.textContent=key+(o.type==='door'?'🚪 ':'📦 ')+t(k);h.style.display='block';setAct(o.type==='door'?'🚪':o.open?'':'📦');}
function interact(){
 if(!active)return;const o=nearInter();if(!o)return;
 if(o.type==='exit'){exitTank();return;}
 if(o.type==='tank'){enterTank(o.t);return;}
 if(o.type==='bot'){askJoin(o.b);return;}
 if(o.type==='door'){o.open=!o.open;o.piv.rotation.y=o.open?-Math.PI/2:0;o.dob.off=o.open;sfx('door');return;}
 if(o.open)return;
 o.open=true;taken.add(o.id);if(o.mesh)o.mesh.position[o.ax||'x']+=o.sgn*.4;sfx('drawer');
 if(!o.loot.length){say(t('empty'));return;}
 const parts=o.loot.map(k=>giveLoot(k,inv,PT));
 o.loot=[];say(t('found')+' '+parts.join(', '));autoGun();updateAmmo();renderInv();updateHealth();setTimeout(()=>sfx('pick'),150);
}
function clampP(p){return fp?Math.max(-1.3,Math.min(1.3,p)):Math.max(-.65,Math.min(.45,p));}
function toggleView(){fp=!fp;pitch=clampP(pitch);$('view').textContent=fp?'👁':'🧍';}
function toggleInv(){const b=$('inv');b.style.display=b.style.display==='block'?'none':'block';if(b.style.display==='block')$('team').style.display='none';}
function toggleTeam(){const el=$('team'),on=el.style.display!=='block';el.style.display=on?'block':'none';if(on){$('inv').style.display='none';renderTeam();}}
