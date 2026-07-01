import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';

// Conectar ao Banco de Dados MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando em modo de desenvolvimento na porta ${PORT}`);
});

// Lidar com rejeições de promessas não tratadas (unhandled rejections)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erro Não Tratado: ${err.message}`);
  // Fechar servidor & sair do processo
  server.close(() => process.exit(1));
});
