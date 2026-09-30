const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export function initMotion(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');const mobile=matchMedia('(max-width: 760px)');
 const hero=document.querySelector('.hero-scroll'),scene=document.querySelector('.hero-scene'),app=document.querySelector('.app-scroll'),journey=document.querySelector('.journey'),payment=document.querySelector('.payment-section');
 const cards=[...document.querySelectorAll('.debt-card')];const steps=[...document.querySelectorAll('.app-step')];const screen=document.querySelector('#phone-screen');
 const installmentGrid=document.querySelector('.installment-grid');for(let i=1;i<=12;i++){const item=document.createElement('span');item.textContent=String(i).padStart(2,'0');installmentGrid.append(item)}
 const installments=[...installmentGrid.children];let vehicle=null,frame=0,current=0,target=0,appStep=0,lastScroll=-1;let visible=true;let vehicleProgress=-1;let manualApp=false;
 const statuses=['Tudo começa com a sua placa','Identificando veículo','Suas pendências, organizadas','Tudo na palma da sua mão','Regularização: caminho livre'];
 const scenePhone=document.createElement('div');scenePhone.className='scene-phone';scenePhone.setAttribute('aria-hidden','true');scenePhone.innerHTML='<span>uvvipague</span><strong>✓</strong><small>Tudo em dia.</small>';scene.append(scenePhone);
 function showAppStep(index){if(index===appStep&&screen.dataset.ready)return;appStep=index;screen.dataset.ready='true';steps.forEach((s,i)=>{s.classList.toggle('active',i===index);s.setAttribute('aria-pressed',String(i===index))});
 if(index===0)screen.innerHTML='<p>Seu veículo</p><h3>Tudo em um<br>só lugar.</h3><div class="phone-plate"><span>BRASIL</span><strong class="phone-plate-text"></strong></div><div class="phone-row"><span>IPVA 2026</span><i>✓</i></div><div class="phone-row"><span>Licenciamento</span><i>✓</i></div><div class="phone-row"><span>Multas</span><i>✓</i></div><div class="phone-cta">Consultar débitos</div>';
 if(index===1)screen.innerHTML='<p>Mais flexibilidade</p><h3>Do seu jeito.<br>No seu tempo.</h3><div class="phone-total">12<small>x</small></div><div class="phone-row"><span>IPVA</span><i>✓</i></div><div class="phone-row"><span>Multas</span><i>✓</i></div><div class="phone-row"><span>Licenciamento</span><i>✓</i></div><div class="phone-cta">Escolha o parcelamento</div>';
 if(index===2)screen.innerHTML='<p>Você no controle</p><h3>O próximo passo?<br>A gente lembra.</h3><div class="phone-notification"><span class="check-circle">✓</span><br><strong>Seus documentos</strong><small>Receba avisos quando for hora de renovar seus documentos</small></div><div class="phone-row"><span>Notificações</span><i>✓</i></div><div class="phone-cta">Tudo na palma da sua mão</div>';
 const plate=screen.querySelector('.phone-plate-text');if(plate)plate.textContent=document.querySelector('#plate').value||'ABC1D23';}
 showAppStep(0);steps.forEach((s,i)=>s.addEventListener('click',()=>{manualApp=true;showAppStep(i)}));
 ['wheel','touchmove'].forEach(name=>addEventListener(name,()=>{manualApp=false},{passive:true}));
 addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)&&!event.target.matches('input'))manualApp=false});
 const progress=(el,start=.85,end=.2)=>{const r=el.getBoundingClientRect();return clamp((innerHeight*start-r.top)/(r.height+innerHeight*(start-end)))};
 function draw(){frame=0;if(document.hidden)return;const focused=document.body.classList.contains('form-focused');const h=hero.getBoundingClientRect();target=reduced.matches?1:mobile.matches?clamp((innerHeight*.72-scene.getBoundingClientRect().top)/(scene.offsetHeight*.75)):clamp(-h.top/Math.max(1,hero.offsetHeight-innerHeight));current=reduced.matches?1:current+(target-current)*.12;
 if(Math.abs(target-current)<.0007)current=target;
 const effective=focused?Math.min(current,.35):current;const merge=clamp((effective-.57)/.3);const phase=Math.min(4,Math.floor(current*4.999));
 document.querySelector('#scene-status').textContent=statuses[phase];document.querySelector('.scene-count').innerHTML=`0${phase+1} <span>/ 05</span>`;document.querySelector('.scene-progress i').style.transform=`scaleX(${.05+current*.95})`;
 cards.forEach((card,i)=>{const x=[18,-24,35,-22][i]*effective;const y=[22,0,-18,-32][i]*effective;card.style.transform=`translate(${x}px,${y}px) rotate(${[-5,5,-3,3][i]*(1-effective)}deg) scale(${1-merge*.12})`;card.style.opacity=String(i===3?clamp(effective*3)*(1-merge*.9):1-merge*.92)});
 scenePhone.style.opacity=String(merge);scenePhone.style.transform=`translateY(${(1-merge)*20}px) rotate(${(1-merge)*5}deg)`;
 document.querySelector('.scene-number').style.transform=`translateY(${-effective*15}px)`;
 document.querySelector('.vehicle-fallback img').style.transform=reduced.matches?'none':`translateX(${effective*7}px) rotate(${effective*1.5}deg)`;
 if(vehicle&&visible&&(Math.abs(vehicleProgress-effective)>.0005||focused||vehicleProgress<0)){vehicle.render(effective,focused);vehicleProgress=effective;}
 const pay=progress(payment);installments.forEach((el,i)=>{const amount=reduced.matches?1:clamp(pay*2.8-i*.048);el.style.transform=`translate(${(1-amount)*-40}px,${(1-amount)*-28}px) scale(${.82+amount*.18})`;el.style.opacity=String(.2+amount*.8)});
 const ar=app.getBoundingClientRect();const ap=mobile.matches?clamp((innerHeight*.8-ar.top)/ar.height):clamp(-ar.top/Math.max(1,app.offsetHeight-innerHeight));
 if(lastScroll!==scrollY){if(!reduced.matches&&!manualApp)showAppStep(Math.min(2,Math.floor(ap*3)));lastScroll=scrollY;}
 document.querySelector('.phone').style.transform=reduced.matches?'none':`rotate(${-5+ap*7}deg) translateY(${-ap*9}px)`;
 const jp=reduced.matches?1:progress(journey,.55,.2);document.querySelector('.journey-fill').style.transform=`scaleY(${jp})`;document.querySelector('.journey-car').style.transform=`translateY(${jp*(journey.offsetHeight-90)}px)`;document.querySelector('#journey-status').textContent=['CONSULTAR','ESCOLHER','PAGAR','REGULARIZADO'][Math.min(3,Math.floor(jp*4))];
 if(!reduced.matches){document.querySelectorAll('.solution').forEach((el,i)=>{if(el.matches(':hover'))return;const p=clamp(progress(el,1.1,.3)*3);el.style.transform=`translateY(${(1-p)*i*14}px) rotate(${(1-p)*(i-1.5)*2}deg)`});document.querySelectorAll('.testimonial').forEach((el,i)=>{const p=clamp(progress(el,1,.1)*2);el.style.transform=`scale(${.96+p*.04}) translateY(${(1-p)*(i-1)*12}px)`})}
 if(current!==target&&!reduced.matches)frame=requestAnimationFrame(draw);
 }
 const refresh=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(draw)};
 const observe=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){vehicleProgress=-1;refresh()}},{rootMargin:'100px'});observe.observe(scene);
 ['scroll','resize','motionrefresh'].forEach(name=>addEventListener(name,refresh,{passive:true}));document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else refresh()});reduced.addEventListener('change',refresh);mobile.addEventListener('change',refresh);
 document.querySelectorAll('.solution').forEach(el=>{el.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const r=el.getBoundingClientRect();el.style.transform=`rotateX(${-(e.clientY-r.top-r.height/2)/r.height*4}deg) rotateY(${(e.clientX-r.left-r.width/2)/r.width*4}deg)`});el.addEventListener('pointerleave',()=>{el.style.transform='none'})});
 refresh();return {refresh,setVehicle(v){vehicle=v;vehicleProgress=-1;refresh();}};
}
