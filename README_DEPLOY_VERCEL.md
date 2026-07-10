# Deploy FortixSeg na Vercel

## Arquivos obrigatorios na raiz
- index.html
- styles.css
- script.js
- package.json
- api/checkout-preference.js
- data/courses.json
- assets/

## Variaveis na Vercel
Adicionar em Project > Settings > Environment Variables:

MERCADO_PAGO_ACCESS_TOKEN=seu_token_de_teste
MERCADO_PAGO_USE_SANDBOX=true
PUBLIC_BASE_URL=https://seu-projeto.vercel.app

Depois de adicionar as variaveis, fazer Redeploy.

## Teste da API
Abrir:
https://seu-projeto.vercel.app/api/checkout-preference

Se aparecer Metodo nao permitido, a rota existe. Se aparecer 404, a pasta api nao subiu certo.

## Importante
Nao use vercel.json com functions.runtime ou builds.use. Este projeto funciona com a deteccao automatica da Vercel para /api.
