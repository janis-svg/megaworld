// 65_botu_skaits.js - Admins parastajā karā izvēlas botu skaitu katrā armijā (10/20/30); misijās vienmēr 30, jo misijas pašas atlasa savu skaitu
Object.assign(T.lv,{bn_l:'🤖 Boti armijā:'});Object.assign(T.en,{bn_l:'🤖 Bots per army:'});
let WBN=[10,20,30].includes(LS.get('wbn',30))?LS.get('wbn',30):30;
function warBotN(){return MIS||!isAdmin()?30:WBN;}
{const row=document.createElement('div');row.id='bnrow';row.innerHTML='<small></small>'+[10,20,30].map(k=>'<button class="corner" data-k="'+k+'">'+k+'</button>').join('');$('maprow').after(row);
 row.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.preventDefault();WBN=+b.dataset.k;LS.set('wbn',WBN);paintBn();});}
function paintBn(){const row=$('bnrow');row.style.display=MODE==='war'&&(MST==='wm'||!MIS)&&isAdmin()&&!/[?&]join=/.test(location.search)?'flex':'none';row.querySelector('small').textContent=t('bn_l');row.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.k===WBN));}
STV.ws.push('bnrow');STV.wm.push('bnrow');STALL.push('bnrow');
const _stPaint65=stPaint;stPaint=function(){_stPaint65();paintBn();};
const _paintMode65=paintMode;paintMode=function(){_paintMode65();paintBn();};
document.querySelectorAll('#misrow button').forEach(b=>b.addEventListener('click',()=>setTimeout(paintBn,0)));
paintBn();
