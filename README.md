# UvviPague

Landing page estática modular, com Three.js apenas para a cena decorativa do veículo. HTML semântico, CSS responsivo, fonte Manrope local e JavaScript sem framework. A pasta original estava vazia.

## Executar

```sh
npm install
npm run dev
```

Acesse http://127.0.0.1:4173. `npm run build` gera o módulo Three.js; `node scripts/assemble.mjs` atualiza as seções estáticas a partir de `src/sections.html`. `npm run check` verifica a sintaxe. `npm test` executa o QA com Chrome instalado.

## Estrutura

- `dist/index.html`: cabeçalho, hero, formulário e conteúdo HTML final.
- `src/sections.html`: parcelamento, app, mídia, processo, soluções, depoimentos, FAQ, CTA e rodapé.
- `scripts/assemble.mjs`: monta seções, perguntas do FAQ e links estaduais no HTML final.
- `src/vehicle.js`: veículo procedural, iluminação e gerenciamento do WebGL.
- `dist/js/motion.js`: único agendador de animação, scroll reversível, interface do app e microinterações.
- `dist/js/form.js`: validação local, máscaras e sincronização da placa. Não faz requisições nem persiste dados.
- `dist/styles.css`, `dist/sections.css`: tokens, layout, responsividade e reduced motion.

## Pendências para lançamento comercial

A copy entregue na conversa foi preservada. Depoimentos, promoção e certificações textuais vieram do usuário; não houve verificação independente dessas afirmações.

1. Integrar consulta real: nenhum endpoint, contrato de API ou credencial foi fornecido. O envio válido informa explicitamente que a consulta não está conectada e que nada foi enviado. Não apresenta débitos ou pagamentos fictícios.
2. Informar URLs de login, blog, matérias, lojas de aplicativos, recursos, acompanhamento e número oficial de WhatsApp. Os controles atuais explicam a indisponibilidade em um diálogo acessível. Substituí-los por links reais quando fornecidos.
3. Fornecer documentos legais (termos, privacidade e cookies).
4. Fornecer respostas oficiais do FAQ. Três respostas reaproveitam literalmente a copy fornecida; sete exibem aviso de resposta ainda indisponível. Nenhum prazo, vínculo jurídico ou regra de cancelamento foi inventado.
5. Fornecer arquivos oficiais de logo, fotografias e selos. Atualmente há marca tipográfica, nomes dos certificados e avatares com iniciais; não há fotografias artificiais de clientes.
6. Atualizar canonical e Open Graph ao definir o domínio oficial. A publicação Sites é privada para revisão.

## Validação

O script de QA cobre 1440×900, 1920×1080, 1280×800, 390×844, 393×852 e 430×932; overflow, scroll de ida e volta, formulário, placa antiga/Mercosul, FAQ, seleção de débitos ilustrativa, telas do app, modal, reduced motion e fallback sem WebGL. Os resultados e capturas ficam em `qa/` (não publicados).

Scroll nativo, sem interceptar roda ou touch. Animações são calculadas apenas em eventos e durante a curta interpolação; o canvas deixa de renderizar fora da viewport e a aba oculta suspende o agendador. Sem trackers, armazenamento de dados pessoais ou fontes externas.

Renderizadores WebGL por software usam automaticamente a imagem equivalente, mantendo a narrativa em HTML/CSS, para evitar a compilação/renderização lenta que foi identificada no ambiente de teste. A cena 3D foi inspecionada visualmente antes da ativação dessa proteção. Medições headless não substituem testes em aparelhos físicos e GPU real.
