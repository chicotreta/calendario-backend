const { Pool } = require('pg');
require('dotenv').config();

// Cria um "pool" de conexões. Isso é mais eficiente do que criar uma nova conexão a cada requisição.
const pool = new Pool({
  // Ele vai procurar por uma variável de ambiente chamada DATABASE_URL para saber onde se conectar.
  connectionString: process.env.DATABASE_URL,
  // Esta configuração é necessária para a conexão com bancos de dados na nuvem como Neon e Render.
  ssl: {
    rejectUnauthorized: false
  }
});

// Exportamos um objeto com uma função 'query' para que outros arquivos (como o index.js) possam usá-la para fazer perguntas ao banco de dados.
module.exports = {
  query: (text, params) => pool.query(text, params),
};
