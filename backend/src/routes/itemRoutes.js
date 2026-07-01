import express from 'express';
import {
  atualizarItem,
  deletarItem
} from '../controllers/itemController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/:id')
  .put(protect, authorize('dono', 'admin'), atualizarItem)
  .delete(protect, authorize('dono', 'admin'), deletarItem);

export default router;
