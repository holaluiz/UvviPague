import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
const page=await browser.newPage({viewport:{width:1440,height:900}});const requests=[];page.on('request',r=>requests.push(r.url()));
await page.addInitScript(()=>{window.metrics={cls:0,lcp:0,longTasks:[]};new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())window.metrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())window.metrics.longTasks.push(Math.round(e.duration))}).observe({type:'longtask',buffered:true})});
await page.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});await page.waitForTimeout(1500);
await page.screenshot({path:'qa/hero-final.png'});
const src=await page.locator('.final-car').getAttribute('src');if(src.startsWith('data:'))await writeFile('dist/assets/vehicle-fallback.png',Buffer.from(src.split(',')[1],'base64'));
const metrics=await page.evaluate(()=>({...window.metrics,memory:performance.memory?.usedJSHeapSize,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.transferSize,duration:r.duration}))}));
for(const id of ['parcelamento','app','midia','sobre','servicos','ajuda']){await page.locator('#'+id).evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));await page.waitForTimeout(450);await page.screenshot({path:`qa/section-${id}.png`});}
await page.locator('.final-section').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-110,behavior:'instant'}));await page.waitForTimeout(200);await page.screenshot({path:'qa/final-cta.png'});
await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.mouse.wheel(0,600);await page.waitForTimeout(800);const forward=await page.locator('#scene-status').innerText();await page.mouse.wheel(0,-600);await page.waitForTimeout(800);const reverse=await page.locator('#scene-status').innerText();
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(500);await page.screenshot({path:'qa/mobile-hero.png'});await page.locator('.hero-scene').evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));await page.waitForTimeout(500);await page.screenshot({path:'qa/mobile-scene.png'});
await page.evaluate(()=>{document.documentElement.style.fontSize='200%'});const enlarged=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
await writeFile('qa/performance.json',JSON.stringify({metrics,requests,forward,reverse,enlarged,note:'Local Chrome headless with SwiftShader software WebGL. Not a field Core Web Vitals or physical device benchmark.'},null,2));console.log(JSON.stringify({metrics,forward,reverse,enlarged,externalRequests:requests.filter(url=>!url.startsWith('http://127.0.0.1'))}));
}finally{await browser.close()}
