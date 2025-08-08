# 📝 Projeto Todo List

![Badge Status](https://img.shields.io/badge/Status-Done-green)

Projeto fullstack desenvolvido com Node.js, Express.js e PostgreSQL, seguindo o modelo SPA com rotas controladas no backend. A renderização das views é feita de forma dinâmica com EJS, e toda a aplicação utiliza arquitetura RESTful com separação clara entre controllers, models e views.

O sistema permite cadastro de usuários, criação de tarefas e subtarefas vinculadas, controle de autenticação e mensagens de feedback. O banco de dados foi modelado e integrado com transações seguras (BEGIN, COMMIT, ROLLBACK) para garantir integridade nas operações mais sensíveis.

Estilização responsiva e leve com animações suaves na tela de login, e código organizado para facilitar manutenção e escalabilidade.

---

## 🚀 Tecnologias

- Node.js
- Express.js
- PostgreSQL
- EJS
- HTML/CSS + JavaScript
- Sass
- pg (driver do PostgreSQL)

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/en/) instalado
- [PostgreSQL](https://www.postgresql.org/download/) instalado e rodando

> 💡 O projeto usa PostgreSQL como banco de dados relacional. Você pode usar o script `database/syncDatabase.js` para criar as tabelas automaticamente após configurar o `.env`.

---

## 📦 Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/pedro354/todo_list.git
cd todo_list

# Instale as dependências
npm install
```

### 🔐 Configure o arquivo `.env` com as credenciais do banco de dados:

```env
DATABASE_URL="postgres://seu_usuario:sua_senha@localhost:5432/db_todolist"
```

### ⛓️ Sincronize as tabelas no banco:

```bash
node database/syncDatabase.js
```

---

## 🧪 Testes Manuais

- [x] Criar tarefa
- [x] Editar tarefa
- [x] Marcar tarefa como concluída
- [x] Deletar tarefa
- [x] Subtarefas funcionando
- [x] Autenticação por email e senha
- [x] Validação de mensagens de erro e sucesso
- [x] Tarefas por usuário logado

---

## 🌐 Deploy

🚧 Em andamento! A versão online será disponibilizada em breve.

<!-- TODO: Adicionar link do deploy quando finalizado -->

---

## 📁 Organização de Pastas

- `routes/` → Rotas da aplicação (views e APIs separadas)
- `controllers/` → Lógica de controle
- `models/` → Acesso e manipulação do banco de dados
- `views/` → Templates EJS
- `public/` → Estilos, scripts e imagens
- `database/` → Scripts para estrutura e sincronização do banco

---

## 💬 Comentários Finais

Projeto desenvolvido como prática de arquitetura MVC + banco de dados relacional, com foco em organização, clareza de código e reusabilidade.

---
![GitHub](https://img.shields.io/badge/Made%20by-Pedro%20Silva-blue)

> Feito com café ☕, código 💻 e força de vontade 💪 por Pedro