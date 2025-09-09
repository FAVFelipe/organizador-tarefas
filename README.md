# Organizador de Tarefas e Notas Pessoais
### Aplicação web fullstack para organizar tarefas e anotações
### Tecnologias: React, Vite, TypeScript, TailwindCSS, shadcn/ui, Supabase
#
# Este script serve como guia de instalação e execução local.

# 1) Clone este repositório
git clone https://github.com/seu-usuario/organizador-tarefas-notas.git
cd organizador-tarefas-notas

# 2) Instale as dependências do projeto
npm install

# 3) Configure as variáveis de ambiente
### Copie o arquivo de exemplo e edite com suas credenciais do Supabase
cp .env.example .env
# -> Abra o arquivo .env no editor e preencha com:
### SUPABASE_URL=...
### SUPABASE_ANON_KEY=...

# 4) Inicie o servidor de desenvolvimento
npm run dev

# 5) Abra no navegador:
http://localhost:5173

# Deploy em produção
### Frontend: subir para Vercel (https://vercel.com/)
### Backend (banco e autenticação): já gerenciado pelo Supabase
# 
# Passos:
- Subir o repositório para o GitHub
- Importar na Vercel
- Definir as variáveis de ambiente (.env) no painel da Vercel
- Publicar e acessar o link gerado


# Demonstração

<img width="609" height="551" alt="image" src="https://github.com/user-attachments/assets/c300b9fc-77ba-43ba-b521-665d28a10401" />
<img width="933" height="540" alt="image" src="https://github.com/user-attachments/assets/5b99562d-0dd6-404c-850a-788bcd31776e" />
