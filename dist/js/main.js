const header=document.querySelector('.header');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});
const dialog=document.querySelector('#notice');
document.addEventListener('click',e=>{const button=e.target.closest('[data-unavailable]');if(button){document.querySelector('#notice-text').textContent=button.dataset.unavailable;dialog.showModal();}});
dialog.querySelectorAll('.dialog-close,.dialog-confirm').forEach(b=>b.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
import {initForm} from './form.js';
import {initMotion} from './motion.js';
const form=initForm();
const motion=initMotion();
const faqButtons=document.querySelectorAll('.faq-item h3 button');
faqButtons.forEach(button=>button.addEventListener('click',()=>{
 const item=button.closest('.faq-item');const open=button.getAttribute('aria-expanded')!=='true';
 button.setAttribute('aria-expanded',String(open));item.classList.toggle('open',open);document.getElementById(button.getAttribute('aria-controls')).inert=!open;
 document.body.classList.toggle('faq-open',!!document.querySelector('.faq-item.open'));
}));
document.querySelectorAll('.selectable button').forEach(button=>button.addEventListener('click',()=>{
 const active=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(active));button.textContent=(active?'✓ ':'')+button.textContent.replace('✓ ','');
}));
document.querySelector('#coupon').addEventListener('click',async()=>{const status=document.querySelector('#coupon-status');try{await navigator.clipboard.writeText('DESCONTO20');status.textContent='Código copiado!'}catch{status.textContent='Use o código DESCONTO20';}setTimeout(()=>{status.textContent=''},4000)});
const startVehicle=async()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;try{const {createVehicle}=await import('./vehicle.js');const vehicle=await createVehicle(document.querySelector('#vehicle'));if(!vehicle)return;vehicle.setPlate(form.plate.value);motion.setVehicle(vehicle);form.onPlate=value=>{vehicle.setPlate(value);motion.refresh()};}catch{document.querySelector('#vehicle-stage').classList.add('fallback');}};
if('requestIdleCallback' in window)requestIdleCallback(startVehicle,{timeout:700});else setTimeout(startVehicle,150);
