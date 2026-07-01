import Estabelecimento from '../models/Estabelecimento.js';

// @desc    Obter todos os estabelecimentos
// @route   GET /api/estabelecimentos
// @access  Público
export const obterEstabelecimentos = async (req, res) => {
  try {
    const { categoria, busca } = req.query;
    let query = {};

    if (categoria) {
      query.categorias = { $in: [categoria] };
    }

    if (busca) {
      query.nome = { $regex: busca, $options: 'i' };
    }

    const estabelecimentos = await Estabelecimento.find(query).populate('donoId', 'nome email');
    res.status(200).json({ success: true, count: estabelecimentos.length, data: estabelecimentos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obter um único estabelecimento
// @route   GET /api/estabelecimentos/:id
// @access  Público
export const obterEstabelecimentoPorId = async (req, res) => {
  try {
    const estabelecimento = await Estabelecimento.findById(req.params.id).populate('donoId', 'nome email');

    if (!estabelecimento) {
      return res.status(404).json({ success: false, error: 'Estabelecimento não encontrado' });
    }

    res.status(200).json({ success: true, data: estabelecimento });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Criar novo estabelecimento
// @route   POST /api/estabelecimentos
// @access  Privado (Dono/Admin)
export const criarEstabelecimento = async (req, res) => {
  try {
    // Definir o dono automaticamente como o usuário logado
    req.body.donoId = req.usuario.id;

    const estabelecimento = await Estabelecimento.create(req.body);

    res.status(201).json({ success: true, data: estabelecimento });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Atualizar estabelecimento
// @route   PUT /api/estabelecimentos/:id
// @access  Privado (Dono/Admin)
export const atualizarEstabelecimento = async (req, res) => {
  try {
    let estabelecimento = await Estabelecimento.findById(req.params.id);

    if (!estabelecimento) {
      return res.status(404).json({ success: false, error: 'Estabelecimento não encontrado' });
    }

    // Verificar se o usuário logado é o dono ou admin
    if (estabelecimento.donoId.toString() !== req.usuario.id && req.usuario.tipo !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Você não tem permissão para alterar este estabelecimento'
      });
    }

    estabelecimento = await Estabelecimento.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: estabelecimento });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Deletar estabelecimento
// @route   DELETE /api/estabelecimentos/:id
// @access  Privado (Dono/Admin)
export const deletarEstabelecimento = async (req, res) => {
  try {
    const estabelecimento = await Estabelecimento.findById(req.params.id);

    if (!estabelecimento) {
      return res.status(404).json({ success: false, error: 'Estabelecimento não encontrado' });
    }

    // Verificar permissão
    if (estabelecimento.donoId.toString() !== req.usuario.id && req.usuario.tipo !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Você não tem permissão para deletar este estabelecimento'
      });
    }

    await estabelecimento.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
