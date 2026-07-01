import Item from '../models/Item.js';
import Estabelecimento from '../models/Estabelecimento.js';

// @desc    Obter itens (cardápio) de um estabelecimento
// @route   GET /api/estabelecimentos/:estabelecimentoId/itens
// @access  Público
export const obterItensPorEstabelecimento = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const { categoria } = req.query;

    const query = { estabelecimentoId };
    if (categoria) {
      query.categoria = categoria;
    }

    const itens = await Item.find(query);
    res.status(200).json({ success: true, count: itens.length, data: itens });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Criar novo item no cardápio de um estabelecimento
// @route   POST /api/estabelecimentos/:estabelecimentoId/itens
// @access  Privado (Dono/Admin)
export const criarItem = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;

    // Verificar se o estabelecimento existe
    const estabelecimento = await Estabelecimento.findById(estabelecimentoId);
    if (!estabelecimento) {
      return res.status(404).json({ success: false, error: 'Estabelecimento não encontrado' });
    }

    // Verificar se o usuário logado é dono do estabelecimento
    if (estabelecimento.donoId.toString() !== req.usuario.id && req.usuario.tipo !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Você não tem permissão para adicionar itens a este estabelecimento'
      });
    }

    // Adicionar estabelecimentoId ao body e criar item
    req.body.estabelecimentoId = estabelecimentoId;
    const item = await Item.create(req.body);

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Atualizar item de cardápio
// @route   PUT /api/itens/:id
// @access  Privado (Dono/Admin)
export const atualizarItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item não encontrado' });
    }

    // Verificar se pertence a um estabelecimento do usuário dono
    const estabelecimento = await Estabelecimento.findById(item.estabelecimentoId);
    if (estabelecimento.donoId.toString() !== req.usuario.id && req.usuario.tipo !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Você não tem permissão para alterar itens deste estabelecimento'
      });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Deletar item de cardápio
// @route   DELETE /api/itens/:id
// @access  Privado (Dono/Admin)
export const deletarItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item não encontrado' });
    }

    // Verificar se pertence a um estabelecimento do usuário dono
    const estabelecimento = await Estabelecimento.findById(item.estabelecimentoId);
    if (estabelecimento.donoId.toString() !== req.usuario.id && req.usuario.tipo !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Você não tem permissão para remover itens deste estabelecimento'
      });
    }

    await item.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
