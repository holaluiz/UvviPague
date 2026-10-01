import {readFile,writeFile,copyFile} from 'node:fs/promises';
const links=JSON.parse(await readFile('qa/official-links.json','utf8'));
const find=part=>{const link=links.find(l=>l.href.includes(part));if(!link)throw Error(part);return link.href.replaceAll('&','&amp;')};
const destinations=[[/blog/i,'blog.uvvipague'],[/Google Play/,'play.google'],[/App Store/,'apps.apple'],[/matéria do Valor/,'valor.globo'],[/matéria do Diário/,'www.dm.com'],[/matéria da Onda/,'ondapocos'],[/WhatsApp/,'wa.me'],[/Ficha Técnica/,'/ficha-tecnica'],[/Calculadora/,'/calculadora-ipva'],[/Tabela FIPE/,'/consultafipe'],[/privacidade/,'/politica-de-privacidade'],[/Termos de Uso/,'/termos-de-uso']];
for(const file of ['src/sections.html','dist/index.html']){
 let html=await readFile(file,'utf8');
 html=html.replace(/<button([^>]*?)data-unavailable="([^"]*)"([^>]*)>([\s\S]*?)<\/button>/g,(all,before,message,after,body)=>{
  const match=destinations.find(([re])=>re.test(message));
  return match?`<a${before.replace(/type="button"\s*/,'')}href="${find(match[1])}" target="_blank" rel="noopener noreferrer"${after}>${body}</a>`:all;
 });
 html=html.replace(/<a class="wordmark"([^>]*)>[\s\S]*?<\/a>/g,'<a class="wordmark"$1><img class="brand-logo" src="/assets/uvvipague-logo.png" width="176" height="50" alt="UvviPague"></a>');
 html=html.replace('<span class="wordmark mini">uvvi<span>pague</span></span>','<img class="card-brand-logo" src="/assets/uvvipague-logo-white.png" width="116" height="33" alt="UvviPague">');
 html=html.replace('<div class="phone-brand">uvvi<span>pague</span>','<div class="phone-brand"><img class="phone-brand-logo" src="/assets/uvvipague-logo.png" width="116" height="33" alt="UvviPague">');
 html=html.replaceAll('<a href="#sobre">Sobre</a>',`<a href="${find('/sobre-nos')}" target="_blank" rel="noopener noreferrer">Sobre</a>`);
 for(const [label,path] of [['IPVA','/ipva-2026'],['Licenciamento','/licenciamento'],['Multas','/multas']])html=html.replace(`<a href="#servicos">${label}</a>`,`<a href="${find(path)}" target="_blank" rel="noopener noreferrer">${label}</a>`);
 html=html.replace('O acesso à sua conta ainda não está conectado nesta versão.','O site oficial ainda não disponibiliza um endereço de acesso para este botão.').replace('O acompanhamento de pedidos ainda não está conectado nesta versão.','O site oficial ainda não disponibiliza um endereço para acompanhar pedidos.');
 await writeFile(file,html);
}
await copyFile('qa/official-logo-footer.png','dist/assets/uvvipague-logo-white.png');
let assembler=await readFile('scripts/assemble.mjs','utf8');
assembler=assembler.replace('<a href="#consultar">Consulte seus débitos no Detran-${s}</a>','<a href="https://www.uvvipague.com.br/detran/${s.toLowerCase()}" target="_blank" rel="noopener noreferrer">Consulte seus débitos no Detran-${s}</a>');
await writeFile('scripts/assemble.mjs',assembler);
let form=await readFile('dist/js/form.js','utf8');
form=form.replace("result.textContent='A consulta de débitos ainda não está conectada nesta versão. Nenhum dado foi enviado. Seus dados permanecem apenas nesta página.';", "result.textContent='Nenhum dado foi enviado. Continue no site oficial para consultar seus débitos. ';const link=document.createElement('a');link.href='https://www.uvvipague.com.br/#consultar-debitos';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Ir para a consulta oficial ↗';result.append(link);");
await writeFile('dist/js/form.js',form);
for(const file of ['dist/styles.css','dist/sections.css']){
 let css=await readFile(file,'utf8');css=css.replaceAll('.app-badges button','.app-badges :is(button,a)').replaceAll('.form-legal button','.form-legal :is(button,a)');await writeFile(file,css);
}
