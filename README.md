# 🎓 Backend - Projeto de Extensão (Aplicativo Escolar MVP)

> Sistema backend desenvolvido com **Node.js + Express + MySQL**, para gerenciar usuários, disciplinas, tópicos e conteúdos de estudo.  
> Este projeto faz parte do MVP do aplicativo web criado como extensão universitária, com o objetivo de **auxiliar os estudos de alunos**.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** (v18+)
- **Express.js**
- **MySQL**
- **JWT (Json Web Token)** para autenticação
- **BcryptJS** para criptografia de senhas
- **dotenv** para variáveis de ambiente
- **Helmet / CORS / Morgan** para segurança e logs

---

## 🧱 Estrutura do Projeto

```database
futuro_digital/
├── src/
│ ├── controllers/ # Lógica principal das rotas
│ ├── middlewares/ # Autenticação e validações
│ ├── routes/ # Definição das rotas da API
│ ├── db.js # Conexão MySQL (pool)
│ ├── server.js # Inicialização do servidor
│ └── utils/ # Funções auxiliares
│
├── .env # Variáveis de ambiente (não subir para o Git)
├── .env.example # Exemplo de configuração
├── package.json # Dependências e scripts
└── README.md # Documentação
```

---

## ⚙️ Instalação e Configuração

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/LuisViniciusLM/projeto-cadeira-de-extens-o.git
cd projeto-cadeira-de-extens-o
```
2️⃣ Instalar dependências
```bash
npm install
```
3️⃣ Configurar o ambiente
Crie um arquivo .env na raiz do projeto (ou copie o modelo):

```bash
cp .env.example .env
```
Preencha com seus dados locais:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=escola_db
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRES=7d
```
💡 Para gerar uma chave JWT segura:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
🗄️ Banco de Dados
Crie o banco e as tabelas executando no MySQL:
```sql

CREATE DATABASE escola_db;
USE escola_db;

CREATE TABLE usuarios(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  login VARCHAR(50) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  email VARCHAR(150),
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE disciplinas(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) UNIQUE NOT NULL,
  descricao TEXT,
  criado_por INT,
  FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

CREATE TABLE subtopicos(
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  disciplina_id INT NOT NULL,
  descricao TEXT,
  criado_por INT,
  FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
  FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

CREATE TABLE conteudos(
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  tipo ENUM('materia','trabalho','atividade','prova') NOT NULL,
  descricao TEXT,
  arquivo_url VARCHAR(255),
  prazo DATE,
  subtopico_id INT NOT NULL,
  criado_por INT,
  data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subtopico_id) REFERENCES subtopicos(id),
  FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

CREATE TABLE submissoes(
  id INT AUTO_INCREMENT PRIMARY KEY,
  conteudo_id INT NOT NULL,
  usuario_id INT NOT NULL,
  arquivo_url VARCHAR(255),
  nota DECIMAL(5,2),
  data_submissao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conteudo_id) REFERENCES conteudos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE chat_mensagens(
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  mensagem TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```
▶️ Executando o Servidor
Ambiente de desenvolvimento:
```bash
node server.js
```

Servidor rodará por padrão em:

```url
http://localhost:3001
```
🔑 Rotas Principais da API
🔹 Autenticação

Método	Endpoint	Descrição
```json
POST	/api/auth/register	Cadastrar novo usuário
POST	/api/auth/login	Autenticar e gerar token
```
Body Exemplo (login):

```json

{
  "login": "admin",
  "senha": "123456"
}
```
🔹 Disciplinas
```json
Método	Endpoint	Descrição
GET	/api/disciplinas	Listar todas
POST	/api/disciplinas	Criar nova disciplina
PUT	/api/disciplinas/:id	Editar disciplina
DELETE	/api/disciplinas/:id	Remover disciplina

🔹 Subtópicos
Método	Endpoint	Descrição
GET	/api/subtopicos	Listar subtópicos
POST	/api/subtopicos	Criar subtópico
PUT	/api/subtopicos/:id	Atualizar subtópico
DELETE	/api/subtopicos/:id	Excluir subtópico

🔹 Conteúdos
Método	Endpoint	Descrição
GET	/api/conteudos	Listar todos os conteúdos
POST	/api/conteudos	Criar novo conteúdo
PUT	/api/conteudos/:id	Editar conteúdo
DELETE	/api/conteudos/:id	Remover conteúdo

🔹 Submissões
Método	Endpoint	Descrição
POST	/api/submissoes	Submeter atividade/prova
GET	/api/submissoes/:usuario_id	Listar submissões de um aluno

🔹 Chat
Método	Endpoint	Descrição
POST	/api/chat	Enviar mensagem
GET	/api/chat	Listar mensagens do chat
```
🔒 Autenticação via JWT
As rotas protegidas exigem o token JWT no cabeçalho:

```json
Authorization: Bearer <seu_token_jwt>
```
🧠 Exemplo de Fluxo Básico
1️⃣ Registrar usuário

```json
POST /api/auth/register
```
2️⃣ Fazer login e pegar token

```bash
POST /api/auth/login
3️⃣ Usar token nas rotas protegidas
```
```json
Authorization: Bearer <token>
```
4️⃣ Criar disciplinas, subtópicos e conteúdos


```bash
POST /api/disciplinas
POST /api/subtopicos
POST /api/conteudos
```
🧩 Contribuição
Faça um fork
```powershell
Crie uma branch: git checkout -b feature/nome-da-feature

Commit: git commit -m 'feat: adiciona nova funcionalidade'

Push: git push origin feature/nome-da-feature
```
Abra um Pull Request

📜 Licença
Projeto livre para fins educacionais e extensão universitária.

Desenvolvido por Pedro Arthur LuisViniciusLM e equipe 💻
© 2025 - Projeto de Extensão Acadêmica

💬 Contato
📧 Email: pedroarthurmaiadev@gmail.com
🌐 GitHub: @pxdroarth
