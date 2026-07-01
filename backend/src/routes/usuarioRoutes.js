import express from 'express';
import {
  registrarUsuario,
  loginUsuario,
  obterPerfil
} from '../controllers/usuarioController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/perfil', protect, obterPerfil);

export default router;
