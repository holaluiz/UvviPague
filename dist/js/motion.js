import {createInteractions} from './interactions.js';
import {initSmoothScroll} from './smooth-scroll.js';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function initMotion(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');const mobile=matchMedia('(max-width: 760px)');
 const hero=document.querySelector('.hero-scroll'),scene=document.querySelector('.hero-scene'),app=document.querySelector('.app-scroll'),journey=document.querySelector('.journey'),payment=document.querySelector('.payment-section');
 const cards=[...document.querySelectorAll('.debt-card')];const steps=[...document.querySelectorAll('.app-step')];const screen=document.querySelector('#phone-screen');
 const installmentGrid=document.querySelector('.installment-grid');for(let i=1;i<=12;i++){const item=document.createElement('span');item.textContent=String(i).padStart(2,'0');installmentGrid.append(item)}
 const installments=[...installmentGrid.children];let vehicle=null,frame=0,current=0,target=0,appStep=0,lastScroll=-1;let visible=true;let vehicleProgress=-1;let manualApp=false;
 const statuses=['Tudo começa com a sua placa','Identificando veículo','Suas pendências, organizadas','Tudo na palma da sua mão','Regularização: caminho livre'];
 const scenePhone=document.createElement('div');scenePhone.className='scene-phone';scenePhone.setAttribute('aria-hidden','true');scenePhone.innerHTML='<span>uvvipague</span><strong>✓</strong><small>Tudo em dia.</small>';scene.append(scenePhone);
 function showAppStep(index,manual=false){if(manual)manualApp=true;if(index===appStep&&screen.dataset.ready)return;appStep=index;screen.dataset.ready='true';steps.forEach((s,i)=>{s.classList.toggle('active',i===index);s.setAttribute('aria-pressed',String(i===index))});
 if(index===0)screen.innerHTML='<p>Seu veículo</p><h3>Tudo em um<br>só lugar.</h3><div class="phone-plate"><span>BRASIL</span><strong class="phone-plate-text"></strong></div><div class="phone-row"><span>IPVA 2026</span><i>✓</i></div><div class="phone-row"><span>Licenciamento</span><i>✓</i></div><div class="phone-row"><span>Multas</span><i>✓</i></div><div class="phone-cta">Consultar débitos</div>';
 if(index===1)screen.innerHTML='<p>Mais flexibilidade</p><h3>Do seu jeito.<br>No seu tempo.</h3><div class="phone-total">12<small>x</small></div><div class="phone-row"><span>IPVA</span><i>✓</i></div><div class="phone-row"><span>Multas</span><i>✓</i></div><div class="phone-row"><span>Licenciamento</span><i>✓</i></div><div class="phone-cta">Escolha o parcelamento</div>';
 if(index===2)screen.innerHTML='<p>Você no controle</p><h3>O próximo passo?<br>A gente lembra.</h3><div class="phone-notification"><span class="check-circle">✓</span><br><strong>Seus documentos</strong><small>Receba avisos quando for hora de renovar seus documentos</small></div><div class="phone-row"><span>Notificações</span><i>✓</i></div><div class="phone-cta">Tudo na palma da sua mão</div>';
 const plate=screen.querySelector('.phone-plate-text');if(plate)plate.textContent=document.querySelector('#plate').value||'ABC1D23';if(document.querySelector('#phone-page'))document.querySelector('#phone-page').textContent=`0${index+1} / 03`;if(!reduced.matches)screen.animate([{opacity:.2,transform:'translateX(18px)'},{opacity:1,transform:'translateX(0)'}],{duration:400,easing:'cubic-bezier(.2,.8,.2,1)'});}
 showAppStep(0);steps.forEach((s,i)=>s.addEventListener('click',()=>{manualApp=true;showAppStep(i)}));
 ['wheel','touchmove'].forEach(name=>addEventListener(name,event=>{if(event.target.closest?.('.phone'))return;manualApp=false},{passive:true}));
 addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)&&!event.target.matches('input'))manualApp=false});
 const progress=(el,start=.85,end=.2)=>{const r=el.getBoundingClientRect();return clamp((innerHeight*start-r.top)/(r.height+innerHeight*(start-end)))};
 function draw(time){frame=0;if(document.hidden)return;const scrolling=smooth.tick(time);const interactive=controls.tick(time);const focused=document.body.classList.contains('form-focused');const h=hero.getBoundingClientRect();target=controls.state.manualHero??(reduced.matches?1:mobile.matches?clamp((innerHeight*.72-scene.getBoundingClientRect().top)/(scene.offsetHeight*.75)):clamp(-h.top/Math.max(1,hero.offsetHeight-innerHeight)));current=reduced.matches?target:current+(target-current)*controls.state.damping;
 if(Math.abs(target-current)<.0007)current=target;
 const effective=focused?Math.min(current,.35):current;const isMobile=mobile.matches;const merge=clamp((effective-.52)/.36);const phase=Math.min(4,Math.floor(current*4.999));
 document.querySelector('#scene-status').textContent=statuses[phase];document.querySelector('.scene-count').innerHTML=`0${phase+1} <span>/ 05</span>`;document.querySelector('.scene-progress i').style.transform=`scaleX(${.05+current*.95})`;
 document.querySelectorAll('[data-chapter]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===phase)));
 scene.dataset.phase=phase;document.querySelector('.scene-caption').textContent=['CONSULTAR.','IDENTIFICAR.','ORGANIZAR.','PARCELAR.','CONTINUAR.'][phase];document.querySelector('.scan-line').style.opacity=String(Math.sin(clamp((effective-.12)/.4)*Math.PI));document.querySelector('.scan-line').style.transform=`translateY(${effective*210}px)`;
 cards.forEach((card,i)=>{
  if(isMobile){
   const driftX=[6,-8,8,-6][i]*effective;
   const driftY=[8,-6,-6,-8][i]*effective;
   const fadeOut=clamp(1-merge*2.2);
   const cardScale=1-merge*0.35;
   card.style.transform=`translate(${driftX}px,${driftY}px) rotate(${[-3,3,-2,2][i]*(1-effective)}deg) scale(${cardScale})`;
   card.style.opacity=String(i===3?(effective>0.3?clamp((effective-0.3)*3.5)*fadeOut:0):fadeOut);
   card.inert=fadeOut<0.15;
   card.style.pointerEvents=fadeOut<0.15?'none':'auto';
  }else{
   const x=[18,-24,35,-22][i]*effective+merge*[140,-65,150,-45][i];
   const y=[22,0,-18,-32][i]*effective+merge*[85,35,-95,-50][i];
   card.style.transform=`translate(${x}px,${y}px) rotate(${[-5,5,-3,3][i]*(1-effective)}deg) scale(${1-merge*.32})`;
   card.style.opacity=String(i===3?clamp(effective*3)*(1-merge):1-merge);
   card.inert=merge>.7||(i===3&&effective<.05);
   card.style.pointerEvents=merge>.7?'none':'auto';
  }
 });
 const plateTag=document.querySelector('.plate-tag');
 if(plateTag){
  if(isMobile){
   const plateFade=clamp(1-merge*2.0);
   plateTag.style.opacity=String(plateFade);
   plateTag.style.pointerEvents=plateFade<0.15?'none':'auto';
  }else{
   plateTag.style.opacity='1';
   plateTag.style.pointerEvents='auto';
  }
 }
 const phoneIn=isMobile?clamp((merge-0.2)/0.8):merge;
 scenePhone.style.opacity=String(phoneIn);scenePhone.style.transform=`translateY(${(1-phoneIn)*20}px) rotate(${(1-phoneIn)*5}deg)`;
 document.querySelector('.scene-number').style.transform=`translateY(${-effective*15}px)`;
 document.querySelector('.vehicle-fallback img').style.transform=reduced.matches?'none':`perspective(800px) translateX(${effective*7+controls.state.orbit*25}px) rotateY(${controls.state.orbit*17}deg) rotateZ(${controls.state.orbit*-2}deg)`;
 if(vehicle&&visible&&(Math.abs(vehicleProgress-effective)>.0005||focused||vehicleProgress<0||interactive)){vehicle.render(effective,focused,controls.state.orbit);vehicleProgress=effective;}
 const pay=progress(payment);if(!controls.state.manualPayment){const n=Math.max(1,Math.round(clamp(pay*2.1)*12));if(n!==controls.state.installments)controls.setInstallments(n)}installments.forEach((el,i)=>{const amount=reduced.matches?1:clamp(pay*2.8-i*.048);const selected=i<controls.state.installments;el.classList.toggle('installment-active',selected);el.style.transform=`translate(${(1-amount)*-80}px,${(1-amount)*-50}px) rotate(${(1-amount)*-15}deg) scale(${selected?1:.85})`;el.style.opacity=selected?'1':'.22'});
 const ar=app.getBoundingClientRect();const ap=mobile.matches?clamp((innerHeight*.8-ar.top)/ar.height):clamp(-ar.top/Math.max(1,app.offsetHeight-innerHeight));
 if(lastScroll!==scrollY){if(!reduced.matches&&!manualApp)showAppStep(Math.min(2,Math.floor(ap*3)));lastScroll=scrollY;}
 document.querySelector('.phone').style.transform=reduced.matches?'none':`rotate(${-5+ap*7}deg) rotateX(${controls.state.tiltX}deg) rotateY(${controls.state.tiltY}deg) translateY(${-ap*9}px)`;
 const jp=reduced.matches?1:progress(journey,.55,.2);document.querySelector('.journey-fill').style.transform=`scaleY(${jp})`;document.querySelector('.journey-car').style.transform=`translateY(${jp*(journey.offsetHeight-90)}px)`;document.querySelector('#journey-status').textContent=['CONSULTAR','ESCOLHER','PAGAR','REGULARIZADO'][Math.min(3,Math.floor(jp*4))];
 if(!reduced.matches){document.querySelectorAll('.solution').forEach((el,i)=>{if(el.matches(':hover'))return;const p=clamp(progress(el,1.1,.3)*3);el.style.transform=`translateY(${(1-p)*i*14}px) rotate(${(1-p)*(i-1.5)*2}deg)`});document.querySelectorAll('.testimonial').forEach((el,i)=>{const p=clamp(progress(el,1,.1)*2);el.style.transform=`scale(${.96+p*.04}) translateY(${(1-p)*(i-1)*12}px)`})}
 document.querySelectorAll('.journey-step').forEach((el,i)=>el.classList.toggle('journey-current',Math.min(2,Math.floor(jp*3))===i));
 document.querySelector('.reading-progress').style.transform=`scaleX(${scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)})`;
 let active='inicio';document.querySelectorAll('.journey-navigation a').forEach(a=>{if(document.getElementById(a.dataset.section).getBoundingClientRect().top<innerHeight*.55)active=a.dataset.section});document.querySelectorAll('.journey-navigation a').forEach(a=>{if(a.dataset.section===active)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')});
 document.querySelector('.bridge-pulse').style.transform=`translateX(${progress(document.querySelector('.journey-bridge'),1,.1)*100}vw)`;
 if((scrolling||((current!==target||interactive)&&!reduced.matches))&&!frame)frame=requestAnimationFrame(draw);
 }
 const refresh=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(draw)};
 const controls=createInteractions({refresh,showAppStep,getAppStep:()=>appStep,reduced});
 const smooth=initSmoothScroll(refresh);
 const observe=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;scene.classList.toggle('scene-visible',visible);if(visible){vehicleProgress=-1;refresh()}},{rootMargin:'100px'});observe.observe(scene);
 ['scroll','resize','motionrefresh'].forEach(name=>addEventListener(name,refresh,{passive:true}));document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('document-hidden',document.hidden);if(document.hidden){cancelAnimationFrame(frame);frame=0}else refresh()});reduced.addEventListener('change',refresh);mobile.addEventListener('change',refresh);
 document.querySelectorAll('.solution').forEach(el=>{el.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();el.style.transform=`rotateX(${-(e.clientY-r.top-r.height/2)/r.height*4}deg) rotateY(${(e.clientX-r.left-r.width/2)/r.width*4}deg)`});el.addEventListener('pointerleave',()=>{el.style.transform='none'})});
 refresh();return {refresh,setVehicle(v){vehicle=v;vehicleProgress=-1;refresh();}};
}
