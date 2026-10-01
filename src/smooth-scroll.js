import Lenis from 'lenis';

// Uses the existing scene scheduler; never starts a second RAF loop.
export function initSmoothScroll(refresh){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let lenis=null;
 function configure(){lenis?.destroy();lenis=null;if(reduced.matches)return;
  lenis=new Lenis({autoRaf:false,autoResize:true,smoothWheel:true,syncTouch:false,lerp:.095,wheelMultiplier:1,anchors:false,prevent:node=>node.matches('dialog,input,textarea,select,[contenteditable="true"],[data-lenis-prevent]')});
  lenis.on('virtual-scroll',refresh);lenis.on('scroll',refresh);refresh();
 }
 configure();reduced.addEventListener('change',configure);
 const cancel=()=>{if(lenis?.isScrolling==='smooth')lenis.scrollTo(window.scrollY,{immediate:true})};
 document.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)&&!event.target.closest('input,textarea,select,button,[contenteditable="true"]'))cancel()});
 document.addEventListener('pointerdown',event=>{if(event.target.closest('input,textarea,select,button,[contenteditable="true"]'))cancel()},{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel()});
 document.addEventListener('click',event=>{
  if(!lenis||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const anchor=event.target.closest('a[href]');if(!anchor||anchor.target==='_blank'||anchor.hasAttribute('download'))return;
  const url=new URL(anchor.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash)return;
  let id;try{id=decodeURIComponent(url.hash.slice(1))}catch{return}const target=document.getElementById(id);if(!target)return;
  event.preventDefault();lenis.scrollTo(target,{offset:-105,onComplete:()=>{
   if(location.hash!==url.hash)history.pushState(null,'',url.hash);
   const focusTarget=target.id==='consultar'?target.querySelector('input'):target;
   const temporary=!focusTarget.hasAttribute('tabindex')&&!focusTarget.matches('input,button,a,select,textarea');
   if(temporary)focusTarget.setAttribute('tabindex','-1');focusTarget.focus({preventScroll:true});
   if(temporary)focusTarget.addEventListener('blur',()=>focusTarget.removeAttribute('tabindex'),{once:true});
  }});refresh();
 });
 return {tick(time){lenis?.raf(time);return lenis?.isScrolling==='smooth'}};
}
