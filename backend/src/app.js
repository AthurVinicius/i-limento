import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Importação das Rotas
import usuarioRoutes from './routes/usuarioRoutes.js';
import estabelecimentoRoutes from './routes/estabelecimentoRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Log de requisições em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rotas da API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/estabelecimentos', estabelecimentoRoutes);
app.use('/api/itens', itemRoutes);

// Rota de Teste de Status
app.get('/', (req, res) => {
  res.json({
    message: 'API i-limento rodando com sucesso!',
    status: 'online'
  });
});

// Middleware para tratamento de erro 404 (Rota não encontrada)
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Rota não encontrada' });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Erro interno no servidor'
  });
});

export default app;
