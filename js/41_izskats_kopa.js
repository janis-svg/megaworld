// 41_izskats_kopa.js - Gaišākas naktis, sakopts ekrāns telefonā
// ---------- 1. naktis gaišākas: mēness gaisma, lai var redzēt bez brillēm ----------
const _drawSky41=drawSky;drawSky=function(k){_drawSky41(k);const kk=Math.min(1,k/.68);if(kk<=0)return;
 hemi.intensity+=.38*kk;amb.intensity+=.22*kk;sun.intensity+=.25*kk;scene.fog.color.lerp(hx('#2b3550'),.45*kk);};
// ---------- 2. laikapstākļi: lietus un migla pēc dienas un stundas (visiem kopīgajā spēlē vienādi, jo diena un stunda ir kopīga) ----------
Object.assign(T.lv,{wx_rain:'🌧️ Sāk līt',wx_fog:'🌫️ Uznāk migla',wx_clear:'🌤️ Laiks noskaidrojas'});Object.assign(T.en,{wx_rain:'🌧️ It starts to rain',wx_fog:'🌫️ Fog is rolling in',wx_clear:'🌤️ The weather clears up'});
const wxRnd=(d,s)=>{let x=(d*374761393+s*668265263)>>>0;x=Math.imul(x^(x>>>13),1274126177)>>>0;return((x^(x>>>16))>>>0)/4294967296;};
// dienas plāns: lietus 40% dienu (2-4 h), migla 35% rītu (4:30-9:00); pirmā diena vienmēr skaidra
function wxPlan(d){if(d<=1)return{r0:-1,r1:-1,f:false};const r=wxRnd(d,1)<.4,s=9+Math.floor(wxRnd(d,2)*9),len=2+Math.floor(wxRnd(d,3)*3);return{r0:r?s:-1,r1:r?s+len:-1,f:wxRnd(d,4)<.35};}
let wxR=0,wxF=0,wxSay='',wxT0=performance.now();
function wxTarget(){if(!active)return[0,0];const p=wxPlan(day),h=hour,rain=h>=p.r0&&h<p.r1?1:0,fog=p.f&&h>=4.5&&h<9?1:0;return[rain,Math.max(fog,rain*.45)];}
const RAIN_N=TOUCH?500:900;let rainM=null;
function rainMesh(){const pos=new Float32Array(RAIN_N*6);for(let i=0;i<RAIN_N;i++){const x=(Math.random()-.5)*44,y=Math.random()*22,z=(Math.random()-.5)*44;pos.set([x,y,z,x+.05,y-.7,z],i*6);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const m=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xaec6e0,transparent:true,opacity:0,depthWrite:false,fog:false}));m.frustumCulled=false;m.material.userData.keep=true;scene.add(m);return m;}
function wxFrame(dt){const[tr,tf]=wxTarget();wxR+=(tr-wxR)*Math.min(1,dt*.5);wxF+=(tf-wxF)*Math.min(1,dt*.35);
 const msg=tr?'wx_rain':tf>.9?'wx_fog':'';if(active&&msg!==wxSay){if(msg)say(t(msg),3);else if(wxSay)say(t('wx_clear'),3);wxSay=msg;}
 if(wxR>.02){if(!rainM)rainM=rainMesh();rainM.visible=true;rainM.material.opacity=.55*wxR;const P=rainM.geometry.attributes.position,a=P.array,cx=camera.position.x,cz=camera.position.z,fall=dt*26;
  rainM.position.set(0,0,0);for(let i=0;i<RAIN_N;i++){const o=i*6;let y=a[o+1]-fall;let x=a[o],z=a[o+2];
   if(y<0||Math.abs(x-cx)>22||Math.abs(z-cz)>22){x=cx+(Math.random()-.5)*44;z=cz+(Math.random()-.5)*44;y=14+Math.random()*10;}
   a[o]=x;a[o+1]=y;a[o+2]=z;a[o+3]=x+.05;a[o+4]=y-.7;a[o+5]=z;}P.needsUpdate=true;}
 else if(rainM)rainM.visible=false;}
// render brīdī uz laiku tuvina miglu un aptumšo sauli, pēc tam atjauno (lai nejauktu lidmašīnu, helikopteru un torņu miglas iestatījumus)
{const _render41=renderer.render.bind(renderer);renderer.render=function(s,c){const now=performance.now(),dt=Math.min(.1,(now-wxT0)/1000);wxT0=now;wxFrame(dt);
 const f=scene.fog,n0=f.near,f0=f.far,si=sun.intensity,hi=hemi.intensity,k=Math.max(wxF,wxR*.6);
 if(k>.01){f.far=f0*(1-.55*k);f.near=Math.min(n0,f.far*.25);sun.intensity=si*(1-.55*k);hemi.intensity=hi*(1-.15*k);}
 _render41(s,c);f.near=n0;f.far=f0;sun.intensity=si;hemi.intensity=hi;};}
