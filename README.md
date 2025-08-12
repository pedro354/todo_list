# 📝 Projeto Todo List

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