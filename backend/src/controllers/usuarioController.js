import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Auxiliar para gerar o token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Cadastrar novo usuário
// @route   POST /api/usuarios/registro
// @access  Público
export const registrarUsuario = async (req, res) => {
  const { nome, email, senha, tipo, telefone, enderecos } = req.body;

  try {
    // Verificar se o usuário já existe
    const usuarioExiste = await Usuario.findOne({ email });

    if (usuarioExiste) {
      return res.status(400).json({ success: false, error: 'E-mail já cadastrado' });
    }

    // Criar o usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      tipo,
      telefone,
      enderecos: enderecos || []
    });

    res.status(201).json({
      success: true,
      token: generateToken(usuario._id),
      data: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        telefone: usuario.telefone,
        enderecos: usuario.enderecos
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Autenticar usuário & obter token
// @route   POST /api/usuarios/login
// @access  Público
export const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Buscar o usuário e carregar a senha explicitamente (select: false por padrão)
    const usuario = await Usuario.findOne({ email }).select('+senha');

    if (!usuario) {
      return res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }

    // Verificar se a senha confere
    const senhaCorreta = await usuario.matchSenha(senha);

    if (!senhaCorreta) {
      return res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(usuario._id),
      data: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        telefone: usuario.telefone,
        enderecos: usuario.enderecos
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obter perfil do usuário logado
// @route   GET /api/usuarios/perfil
// @access  Privado
export const obterPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    res.status(200).json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
