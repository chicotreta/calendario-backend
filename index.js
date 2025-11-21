const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ROTA 1: Listar todos os eventos (GET /api/events)
app.get('/api/events', async (req, res) => {
  try {
    // Este comando busca os dados no banco de dados e renomeia as colunas para o formato que o seu front-end espera (ex: dt_inicio vira dtInicio)
    const { rows } = await db.query('SELECT id, title, dt_inicio AS "dtInicio", dt_fim AS "dtFim", tipo, sub_tipo AS "subTipo", local, cor, obs, valor FROM events ORDER BY "dtInicio" ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ROTA 2: Criar um novo evento (POST /api/events)
app.post('/api/events', async (req, res) => {
  const { title, dtInicio, dtFim, tipo, subTipo, local, cor, obs, valor } = req.body;
  try {
    // Este comando insere os dados recebidos do front-end no banco de dados
    const { rows } = await db.query(
      'INSERT INTO events (title, dt_inicio, dt_fim, tipo, sub_tipo, local, cor, obs, valor) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [title, dtInicio, dtFim, tipo, subTipo, local, cor, obs, valor]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});
    
// Inicia o servidor para que ele possa ouvir as requisições
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
