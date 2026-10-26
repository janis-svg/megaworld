// 42_muzika.js - Mūzika bez failiem (dienā mierīga melodija, naktī spriedze, karā bungas), lietus troksnis, poga 🎵 iestatījumos
Object.assign(T.lv,{mus_on:'Mūzika ieslēgta',mus_off:'Mūzika izslēgta'});Object.assign(T.en,{mus_on:'Music on',mus_off:'Music off'});
let musOn=LS.get('music',true),musG=null,musNext=0,musStep=0,musMode='',rainSrc=null,rainG=null,nsBuf=null;
const MUSV={day:.05,night:.06,war:.07};
function musInit(){const a=ac();if(!a||musG)return a;musG=a.createGain();musG.gain.value=0;musG.connect(a.destination);
 const n=a.sampleRate*2;nsBuf=a.createBuffer(1,n,a.sampleRate);const c=nsBuf.getChannelData(0);for(let i=0;i<n;i++)c[i]=Math.random()*2-1;return a;}
const mf=m=>440*Math.pow(2,(m-69)/12);
function mNote(m,t,d,type,v,cut){const a=AC,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=mf(m);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.015);g.gain.exponentialRampToValueAtTime(.0008,t+d);
 if(cut){const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=cut;o.connect(f);f.connect(g);}else o.connect(g);g.connect(musG);o.start(t);o.stop(t+d+.05);}
function mHit(t,d,v,fq,type){const a=AC,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=nsBuf;f.type=type||'bandpass';f.frequency.value=fq;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);s.connect(f);f.connect(g);g.connect(musG);s.start(t,Math.random());s.stop(t+d+.05);}
function mKick(t,v){const a=AC,o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(40,t+.18);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0008,t+.3);o.connect(g);g.connect(musG);o.start(t);o.stop(t+.35);}
// dienā: C mažora pentatonika, akordi C-Am-F-G; naktī: la minors, reti toņi un zema dūkoņa; karā: bungas un basa ostinato re minorā
const PENT=[60,62,64,67,69,72,74,76],DAYB=[48,45,41,43],NIGHT=[57,60,62,64,65,69,72],WARB=[38,38,41,38,36,36,40,36];let melI=3;
function musStepPlay(mode,t,i){
 if(mode==='day'){const bar=Math.floor(i/8)%4;if(i%8===0){mNote(DAYB[bar],t,1.8,'sine',.5);mNote(DAYB[bar]+12+7,t,1.6,'triangle',.12);}
  if(Math.random()<.62){melI=Math.max(0,Math.min(PENT.length-1,melI+[-2,-1,-1,0,1,1,2][Math.floor(Math.random()*7)]));mNote(PENT[melI]+12*(Math.random()<.15?1:0),t,.55,'triangle',.22);}}
 else if(mode==='night'){if(i%16===0)mNote(33,t,4.2,'sine',.55);if(i%16===8)mNote(40,t,3,'sine',.3);
  if(i%4===2&&Math.random()<.4)mNote(NIGHT[Math.floor(Math.random()*NIGHT.length)],t,1.6,'sine',.16);if(i%8===4&&Math.random()<.3)mHit(t,.08,.1,2400,'highpass');}
 else{const s=i%16;if(s===0||s===8||s===10)mKick(t,.9);if(s===4||s===12)mHit(t,.18,.5,1800);if(s%2===1)mHit(t,.04,.08,7000,'highpass');
  if(s===14&&Math.random()<.5){mHit(t,.12,.35,500);mHit(t+.07,.12,.35,350);}if(s%2===0)mNote(WARB[(s/2)%8],t,.22,'sawtooth',.28,600);}}
function musTick(){if(!AC||!musG)return;const a=AC,want=musOn&&!muted&&active&&!document.hidden,mode=typeof isWar==='function'&&isWar()?'war':isNight()?'night':'day';
 musG.gain.setTargetAtTime(want?MUSV[mode]:0,a.currentTime,want&&mode!==musMode?1.2:.4);
 if(rainG)rainG.gain.setTargetAtTime(want||(!muted&&active)?.06*(typeof wxR==='number'?wxR:0):0,a.currentTime,.5);
 if(!want){musNext=0;return;}if(mode!==musMode){musMode=mode;musStep=0;}
 const spb=mode==='war'?60/112/2:mode==='night'?60/58/2:60/84/2;if(musNext<a.currentTime)musNext=a.currentTime+.05;
 while(musNext<a.currentTime+.3){try{musStepPlay(mode,musNext,musStep);}catch(e){}musStep++;musNext+=spb;}}
// lietus troksnis: nepārtraukts, skaļums pēc lietus stipruma (strādā arī ar izslēgtu mūziku, bet ne ar izslēgtu skaņu)
function rainInit(){if(rainSrc||!AC||!nsBuf)return;const a=AC;rainSrc=a.createBufferSource();rainSrc.buffer=nsBuf;rainSrc.loop=true;const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=1400;f.Q.value=.6;rainG=a.createGain();rainG.gain.value=0;rainSrc.connect(f);f.connect(rainG);rainG.connect(a.destination);rainSrc.start();}
setInterval(()=>{if(!active||!AC)return;musInit();rainInit();musTick();},100);
// skaņu var ieslēgt tikai pēc pieskāriena, tāpēc mūziku sagatavo ar pirmo pieskārienu
addEventListener('pointerdown',()=>{if(active)musInit();},{passive:true});
// poga 🎵 blakus 🔊 (telefonā redzama, atverot ⚙️)
{const b=document.createElement('button');b.className='corner';b.id='mus';const paint=()=>{b.textContent=musOn?'🎵':'🎵🚫';b.title=t(musOn?'mus_on':'mus_off');};paint();
 b.onclick=e=>{musOn=!musOn;LS.set('music',musOn);paint();say(t(musOn?'mus_on':'mus_off'),1.5);e.currentTarget.blur();};$('snd').after(b);}
