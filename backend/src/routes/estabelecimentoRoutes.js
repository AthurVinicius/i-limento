import express from 'express';
import {
  obterEstabelecimentos,
  obterEstabelecimentoPorId,
  criarEstabelecimento,
  atualizarEstabelecimento,
  deletarEstabelecimento
} from '../controllers/estabelecimentoController.js';
import {
  obterItensPorEstabelecimento,
  criarItem
} from '../controllers/itemController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas principais de estabelecimentos
router.route('/')
  .get(obterEstabelecimentos)
  .post(protect, authorize('dono', 'admin'), criarEstabelecimento);

router.route('/:id')
  .get(obterEstabelecimentoPorId)
  .put(protect, authorize('dono', 'admin'), atualizarEstabelecimento)
  .delete(protect, authorize('dono', 'admin'), deletarEstabelecimento);

// Rotas aninhadas de itens (cardápio do estabelecimento)
router.route('/:estabelecimentoId/itens')
  .get(obterItensPorEstabelecimento)
  .post(protect, authorize('dono', 'admin'), criarItem);

export default router;
