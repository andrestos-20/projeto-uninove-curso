# Projeto UniNove - PowerBI Academy Melhorado

Este repositório contém o código-fonte para o projeto de uma plataforma educacional, focada em cursos da PowerBI Academy, desenvolvida para a UniNove. O objetivo é oferecer uma experiência de aprendizado aprimorada e funcionalidades robustas para gerenciamento de cursos, usuários e administradores.

## Visão Geral

O projeto é uma aplicação web full-stack, construída com tecnologias modernas para garantir escalabilidade, performance e uma ótima experiência de usuário.

## Tecnologias Utilizadas

*   **Frontend**: React, Vite, TypeScript, Radix UI, Tailwind CSS
*   **Backend**: Node.js, tRPC, Express
*   **Banco de Dados**: MySQL (com Drizzle ORM)
*   **Autenticação**: JWT (jose)
*   **Armazenamento de Arquivos**: AWS S3
*   **Gerenciamento de Pacotes**: pnpm

## Estrutura do Projeto

O projeto está organizado em módulos que separam as responsabilidades do frontend, backend e gerenciamento de dados:

*   `src/`: Contém os arquivos do frontend (componentes React, lógica de UI, etc.).
*   `server/`: Contém os arquivos do backend (endpoints da API, lógica de negócio, etc.).
*   `db/`: Contém os arquivos de configuração do banco de dados e esquemas (Drizzle ORM).
*   `public/`: Ativos estáticos como `logo.png`.

## Como Configurar e Rodar Localmente

Para configurar e executar o projeto em seu ambiente de desenvolvimento local, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

*   Node.js (versão 18 ou superior)
*   pnpm (gerenciador de pacotes)
*   MySQL (ou um banco de dados compatível com Drizzle ORM)
*   Git

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/andrestos-20/projeto-uninove-curso.git
    cd projeto-uninove-curso
    ```

2.  **Instale as dependências:**
    ```bash
    pnpm install
    ```

3.  **Configuração do Banco de Dados:**
    *   Crie um banco de dados MySQL.
    *   Configure as variáveis de ambiente para o banco de dados (veja a seção `.env` abaixo).
    *   Execute as migrações do banco de dados:
        ```bash
        pnpm run db:push
        ```

4.  **Variáveis de Ambiente (`.env`):**
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (exemplo):

    ```env
    DATABASE_URL="mysql://user:password@host:port/database"
    AWS_ACCESS_KEY_ID="your_aws_access_key_id"
    AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
    AWS_REGION="your_aws_region"
    AWS_BUCKET_NAME="your_aws_bucket_name"
    JWT_SECRET="your_jwt_secret"
    ```

    *Substitua os valores pelos seus próprios dados.*

### Executando o Projeto

Para iniciar o servidor de desenvolvimento (frontend e backend):

```bash
pnpm run dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou a porta configurada pelo Vite).

## Deployment

Para preparar o projeto para produção, utilize o script de build:

```bash
pnpm run build
```

Isso gerará os arquivos otimizados para o frontend e backend no diretório `dist/`. Para iniciar o servidor de produção:

```bash
pnpm run start
```

Para mais detalhes sobre as opções de deploy, consulte a documentação das tecnologias utilizadas (Vite, Node.js, Drizzle ORM, AWS S3).
