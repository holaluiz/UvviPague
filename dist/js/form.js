export function initForm(){
 const form=document.querySelector('#consultar');const plate=document.querySelector('#plate');const email=document.querySelector('#email');const phone=document.querySelector('#phone');
 const api={plate,onPlate:null};
 const normalize=value=>value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,7);
 const validPlate=value=>/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(normalize(value));
 const validate=field=>{let message='';if(field===plate&&!validPlate(plate.value))message='Informe uma placa válida, como ABC1D23 ou ABC1234.';if(field===email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))message='Informe um email válido.';if(field===phone&&!/^[1-9]{2}[0-9]{8,9}$/.test(phone.value.replace(/\D/g,'')))message='Informe o DDD e seu número de telefone.';document.getElementById(field.id+'-error').textContent=message;field.setAttribute('aria-invalid',String(!!message));return !message;};
 plate.addEventListener('input',()=>{plate.value=normalize(plate.value);const value=plate.value||'ABC1D23';document.querySelector('#scene-plate').textContent=value;document.querySelectorAll('.phone-plate-text').forEach(el=>el.textContent=value);document.querySelector('.vehicle-fallback strong').textContent=value;api.onPlate?.(value);if(plate.hasAttribute('aria-invalid'))validate(plate);});
 phone.addEventListener('input',()=>{const n=phone.value.replace(/\D/g,'').slice(0,11);phone.value=n.length>6?`(${n.slice(0,2)}) ${n.slice(2,n.length===11?7:6)}-${n.slice(n.length===11?7:6)}`:n.length>2?`(${n.slice(0,2)}) ${n.slice(2)}`:n;if(phone.hasAttribute('aria-invalid'))validate(phone);});
 email.addEventListener('input',()=>{if(email.hasAttribute('aria-invalid'))validate(email)});
 [plate,email,phone].forEach(field=>field.addEventListener('blur',()=>{if(field.value)validate(field)}));
 form.addEventListener('focusin',()=>{document.body.classList.add('form-focused');window.dispatchEvent(new Event('motionrefresh'))});
 form.addEventListener('focusout',()=>{queueMicrotask(()=>{if(!form.contains(document.activeElement)){document.body.classList.remove('form-focused');window.dispatchEvent(new Event('motionrefresh'))}})});
 form.addEventListener('submit',event=>{event.preventDefault();const invalid=[plate,email,phone].filter(field=>!validate(field));if(invalid.length){invalid[0].focus();return}const result=form.querySelector('.form-result');result.hidden=false;result.textContent='Nenhum dado foi enviado. Continue no site oficial para consultar seus débitos. ';const link=document.createElement('a');link.href='https://www.uvvipague.com.br/#consultar-debitos';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Ir para a consulta oficial ↗';result.append(link);});
 return api;
}
