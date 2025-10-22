FROM node:lts-alpine

WORKDIR /app

# Instala o pnpm globalmente
RUN npm install -g pnpm

# Copia os arquivos do projeto
COPY . .

# Instala as dependências usando pnpm
RUN pnpm install --frozen-lockfile

# Constrói o projeto (frontend e backend)
RUN pnpm run build

# Expõe a porta que a aplicação irá usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["pnpm", "run", "start"]
