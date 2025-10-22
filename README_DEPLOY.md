# Guia rápido de deploy

## Pré-visualização local
```bash
# Dentro da pasta do projeto
npm run start
# abre em http://localhost:3000
```

> Se não tiver Node, instale: https://nodejs.org

## Deploy com Docker (Nginx)
```bash
docker build -t meu-site .
docker run --rm -p 8080:80 meu-site
# abra http://localhost:8080
```

## Netlify
1. Crie um site novo no Netlify apontando para este repositório/pasta.
2. O arquivo `netlify.toml` já publica a raiz do projeto.

## Vercel
1. `vercel` e siga os passos.
2. O `vercel.json` já configura deploy estático.

## GitHub Pages (opcional)
- Publique o conteúdo desta pasta na branch `gh-pages` ou ative o Pages para a branch principal.
