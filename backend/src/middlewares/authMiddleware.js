import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Proteger rotas (verificar token)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obter o token do cabeçalho Bearer
      token = req.headers.authorization.split(' ')[1];

      // Decodificar o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar o usuário pelo ID decodificado (excluindo a senha)
      req.usuario = await Usuario.findById(decoded.id).select('-senha');
      
      if (!req.usuario) {
        return res.status(401).json({ success: false, error: 'Usuário não encontrado com este token' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, error: 'Não autorizado, token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Não autorizado, nenhum token fornecido' });
  }
};

// Autorizar perfis específicos de usuário
export const authorize = (...tipos) => {
  return (req, res, next) => {
    if (!req.usuario || !tipos.includes(req.usuario.tipo)) {
      return res.status(403).json({
        success: false,
        error: `Perfil do usuário (${req.usuario ? req.usuario.tipo : 'desconhecido'}) não tem permissão para acessar esta rota`
      });
    }
    next();
  };
};
