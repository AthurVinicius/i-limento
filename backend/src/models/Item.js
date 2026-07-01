import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, adicione o nome do item'],
    trim: true
  },
  preco: {
    type: Number,
    required: [true, 'Por favor, adicione o preço do item'],
    min: [0, 'O preço não pode ser negativo']
  },
  estabelecimentoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Estabelecimento',
    required: [true, 'O item deve estar associado a um estabelecimento']
  },
  categoria: {
    type: String,
    required: [true, 'Por favor, informe a categoria do item (Ex: Bebidas, Sobremesas, Lanches)'],
    trim: true
  },
  descricao: {
    type: String,
    trim: true
  },
  imagens: {
    type: [String],
    default: []
  },
  disponivel: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexar estabelecimentoId para busca rápida de cardápio por restaurante
ItemSchema.index({ estabelecimentoId: 1 });

const Item = mongoose.model('Item', ItemSchema);
export default Item;
