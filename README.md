# 📝 Projeto Todo List + Login Fake

![Badge Status](https://img.shields.io/badge/Status-Done-green)

Projeto fullstack desenvolvido com **Node.js**, **Express.js** e **PostgreSQL**, seguindo o padrão **MVC** e arquitetura **RESTful**.  
O sistema oferece **cadastro e login de usuários com JWT**, criação e gerenciamento de tarefas e subtarefas, autenticação e autorização de rotas, feedback visual ao usuário e interface responsiva estilizada com **Sass**.

---

## 📋 Funcionalidades

- Registro e login de usuários com **JWT**
- Proteção de rotas para usuários autenticados
- Criação, edição, conclusão e exclusão de tarefas
- Subtarefas vinculadas a tarefas
- Mensagens de erro e sucesso no frontend
- Exclusão completa de conta e dados associados
- Operações seguras no banco com transações (`BEGIN`, `COMMIT`, `ROLLBACK`)
- Interface responsiva e leve com animações

---

## 🚀 Tecnologias

- **Node.js** + **Express.js**
- **PostgreSQL** + **pg**
- **EJS** (renderização de views)
- **HTML/CSS** + **JavaScript**
- **Sass**
- **JWT** para autenticação
- **dotenv** para variáveis de ambiente

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/en/) instalado
- [PostgreSQL](https://www.postgresql.org/download/) instalado e rodando

---

## 📦 Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/pedro354/todo_list.git
cd todo_list

# Instale as dependências
npm install

### 🔐 Configure o arquivo `.env` com as credenciais:

```env
DATABASE_URL="postgres://seu_usuario:sua_senha@localhost:5432/db_todolist"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES="1d"
PORT=3000
```

> O **JWT\_SECRET** deve ser uma string segura.
> **JWT\_EXPIRES** define o tempo de expiração do token (ex.: `1d`, `2h`).

---

### ⛓️ Sincronize o banco de dados:

```bash
node database/syncDatabase.js
```

---

## 🔑 Autenticação e Proteção de Rotas

O sistema usa **JWT (JSON Web Token)** para autenticação.
Ao fazer login, o usuário recebe um token que deve ser enviado nas requisições às rotas protegidas.

**Como enviar o token no frontend ou via API:**

```http
Authorization: Bearer <seu_token>
```

Se o token estiver ausente ou inválido, a API retornará **401 Unauthorized**.

---

## 📡 Endpoints da API

### 🔓 Público

* **POST** `/auth/register` → Cria novo usuário
  **body:** `{ "email": "", "password": "" }`
* **POST** `/auth/login` → Autentica e retorna token
  **body:** `{ "email": "", "password": "" }`

### 🔒 Protegidos (JWT obrigatório)

* **GET** `/tasks` → Lista tarefas do usuário
* **POST** `/tasks` → Cria tarefa
  **body:** `{ "title": "", "description": "" }`
* **PUT** `/tasks/:id` → Edita tarefa
* **PATCH** `/tasks/:id/complete` → Marca como concluída
* **DELETE** `/tasks/:id` → Remove tarefa
* **POST** `/tasks/:id/subtasks` → Adiciona subtarefa
  **body:** `{ "title": "" }`
* **DELETE** `/subtasks/:id` → Remove subtarefa
* **DELETE** `/user/delete` → Exclui conta e todas as tarefas

---

## 🧪 Testes Manuais

* [x] Registro e login com JWT
* [x] Proteção de rotas funcionando
* [x] CRUD de tarefas
* [x] CRUD de subtarefas
* [x] Exclusão de conta
* [x] Mensagens de feedback
* [x] Operações seguras no banco

---

## 📁 Estrutura de Pastas

```
├── controllers/    # Lógica de controle (views e API separadas)
├── models/         # Interação com o banco
├── routes/         # Rotas de views e APIs
├── views/          # Templates EJS
├── public/         # Arquivos estáticos (CSS, JS, imagens)
├── database/       # Scripts SQL e sync
├── middleware/     # Middlewares de autenticação
└── .env            # Configurações privadas
```

---

## 🌐 Deploy

🚧 Em andamento!

<!-- TODO: Adicionar link quando pronto -->

---

## 💬 Comentários Finais

Projeto desenvolvido como prática de **Node.js + PostgreSQL + JWT** com foco em organização, segurança e escalabilidade.
Código limpo, rotas separadas e autenticação robusta garantem fácil manutenção e expansão.

---

![GitHub](https://img.shields.io/badge/Made%20by-Pedro%20Silva-blue)
