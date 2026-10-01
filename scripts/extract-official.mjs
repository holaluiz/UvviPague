import {readFile,writeFile} from 'node:fs/promises';
const html=await readFile('qa/official-home.html','utf8');
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&quot;','"');
const links=[...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(m=>({href:new URL(decode(m[1]),'https://www.uvvipague.com.br/').href,text:m[2].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}));
const images=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]).filter(s=>/logo|uvvi|Logo/i.test(s)).map(s=>s.slice(0,900));
await writeFile('qa/official-links.json',JSON.stringify(links,null,2));console.log(JSON.stringify({links,images,header:html.match(/<header\b[\s\S]*?<\/header>/)?.[0]?.slice(0,8500)},null,2));
