# Guia de Configuração e Conexão do Workspace (GitHub, Vercel & Supabase)

Siga os passos abaixo no terminal do seu Mac para autenticar e vincular este workspace às suas contas de produção.

---

## 1. Acesse o diretório do projeto no seu Terminal
Abra o aplicativo **Terminal** no seu Mac e cole o comando abaixo:
```bash
cd "/Users/laramunique.a/.gemini/antigravity/scratch"
```

---

## 2. Instalar as dependências do projeto
Instale as dependências locais (incluindo as bibliotecas necessárias para o projeto funcionar):
```bash
npm install
```

---

## 3. Conectar à Vercel e puxar as variáveis do Supabase (Produção)
Como o projeto já está em produção na Vercel, podemos puxar todas as credenciais do banco de dados e do Supabase diretamente de lá.

1. **Faça login na Vercel:**
   ```bash
   npx vercel login
   ```
   *(Siga as instruções na tela para fazer login pelo seu navegador).*

2. **Vincule a pasta local ao projeto da Vercel:**
   ```bash
   npx vercel link
   ```
   *(O terminal perguntará se deseja vincular a este projeto. Responda `Y` (Yes), selecione sua organização e escolha o nome do projeto existente).*

3. **Puxe as variáveis de ambiente em produção para o arquivo local `.env`:**
   ```bash
   npx vercel env pull .env
   ```
   *(Isso criará automaticamente o arquivo `.env` com todas as chaves do Supabase, Banco de Dados, JWT, Stripe, etc., configuradas exatamente como na produção).*

---

## 4. Conectar ao GitHub e habilitar commits
Para podermos fazer commits e subir as alterações automaticamente para o GitHub:

1. **Faça login no GitHub CLI:**
   ```bash
   gh auth login
   ```
   - Escolha **GitHub.com**.
   - Escolha **HTTPS**.
   - Digite **Y** para autenticar o Git com suas credenciais do GitHub.
   - Escolha **Login with a web browser** (isso abrirá o navegador e lhe dará um código de 8 dígitos para colar na página).

2. **Vincule o repositório do GitHub:**
   - **Caso o repositório já exista no seu GitHub:**
     Substitua a URL abaixo pela URL do seu repositório existente:
     ```bash
     git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
     ```
   - **Caso queira criar um novo repositório no seu GitHub para este projeto:**
     Execute o comando abaixo para criar e já enviar os arquivos (ele criará um repositório privado chamado `ea-lumina`):
     ```bash
     git add .
     git commit -m "Initial commit from Antigravity"
     gh repo create ea-lumina --private --source=. --remote=origin --push
     ```

---

## 5. Conectar ao Supabase CLI (Opcional - para migrações de banco de dados)
Para gerenciar o banco de dados diretamente por aqui via comandos do Supabase:
```bash
npx supabase login
```
*(Siga as instruções para autorizar o acesso no navegador).*

---

*Após concluir estes passos, o seu workspace estará 100% conectado com o GitHub, Vercel e Supabase! Se tiver qualquer dúvida ou erro em algum passo, me envie aqui!*
