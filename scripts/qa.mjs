import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
if(process.argv.includes('--visual')){await import('./visual-qa.mjs');process.exit(0)}
await mkdir('qa',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:900}});
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.waitForTimeout(1000);
await page.screenshot({path:'qa/desktop.png'});
for(const [w,h] of [[1440,900],[1920,1080],[1280,800],[390,844],[393,852],[430,932]]){
 await page.setViewportSize({width:w,height:h});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(250);
 const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,canvasReady:document.querySelector('#vehicle').classList.contains('ready')}));
 if(layout.scrollWidth>w)throw new Error(`Overflow at ${w}: ${layout.scrollWidth}`);
 results.push({viewport:[w,h],...layout});
 if(w===390){await page.screenshot({path:'qa/mobile.png',fullPage:true});}
 for(const y of [500,1100,2400,5000,2400,700,0]){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(90);}
}
await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
await page.locator('.submit').click();if(await page.locator('[aria-invalid="true"]').count()!==3)throw new Error('Expected 3 invalid form fields');
await page.locator('#plate').fill('abc1d23');await page.locator('#email').fill('pessoa@example.com');await page.locator('#phone').fill('11987654321');await page.locator('.submit').click();
if(!(await page.locator('.form-result').innerText()).includes('Nenhum dado foi enviado'))throw new Error('Missing integration notice');
if(await page.locator('#scene-plate').innerText()!=='ABC1D23')throw new Error('Plate sync failed');
await page.locator('#plate').fill('xyz9876');if(await page.locator('#scene-plate').innerText()!=='XYZ9876')throw new Error('Legacy plate sync failed');
await page.locator('#plate').fill('');await page.locator('#email').fill('');await page.locator('#phone').fill('');
for(const button of await page.locator('.faq-item h3 button').all()){await button.click();if(await button.getAttribute('aria-expanded')!=='true')throw new Error('FAQ failed to open');await button.click();}
await page.locator('[data-app-step="1"]').click();await page.waitForTimeout(180);if(!(await page.locator('#phone-screen').innerText()).includes('12'))throw new Error('App step switch failed');
await page.locator('.selectable button').first().click();if(await page.locator('.selectable button').first().getAttribute('aria-pressed')!=='false')throw new Error('Selection failed');
await page.locator('.header nav button').click();if(!(await page.locator('#notice').isVisible()))throw new Error('Missing link dialog failed');await page.keyboard.press('Escape');
await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);await page.screenshot({path:'qa/reduced.png'});
if(await page.locator('.app-sticky').evaluate(e=>getComputedStyle(e).position)!=='static')throw new Error('Reduced motion sticky not disabled');
await page.emulateMedia({reducedMotion:'no-preference'});
await page.reload({waitUntil:'networkidle'});await page.waitForTimeout(300);await page.screenshot({path:'qa/full-desktop.png',fullPage:true});
const noGL=await browser.newPage();await noGL.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type.includes('webgl'))return null;return original.call(this,type,...args)}});await noGL.goto('http://127.0.0.1:4173');await noGL.waitForTimeout(900);if(!(await noGL.locator('.vehicle-fallback').isVisible()))throw new Error('WebGL fallback failed');if(!(await noGL.locator('.submit').isVisible()))throw new Error('WebGL fallback hides form');await noGL.close();
await writeFile('qa/results.json',JSON.stringify({results,errors,checks:['form validation','plate sync','FAQ all ten items','app steps','debt selection','modal and Escape','reverse scroll','reduced motion','WebGL fallback']},null,2));
console.log(JSON.stringify({results,errors}));await browser.close();if(errors.length)process.exitCode=1;
