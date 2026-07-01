import mongoose from 'mongoose';

const EnderecoEstabelecimentoSchema = new mongoose.Schema({
  logradouro: { type: String, required: true },
  numero: { type: String, required: true },
  complemento: { type: String },
  bairro: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
  cep: { type: String, required: true },
  coordenadas: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false
    }
  }
});

// Indexar as coordenadas para consultas geoespaciais
EnderecoEstabelecimentoSchema.index({ coordenadas: '2dsphere' });

const EstabelecimentoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, adicione o nome do estabelecimento'],
    trim: true
  },
  donoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'O estabelecimento deve ter um usuário dono associado']
  },
  endereco: {
    type: EnderecoEstabelecimentoSchema,
    required: [true, 'Por favor, adicione o endereço do estabelecimento']
  },
  categorias: {
    type: [String],
    default: []
  },
  contato: {
    telefone: { type: String, required: true },
    whatsapp: { type: String },
    email: { type: String }
  },
  descricao: {
    type: String,
    trim: true
  },
  imagemUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['aberto', 'fechado'],
    default: 'fechado'
  }
}, {
  timestamps: true
});

const Estabelecimento = mongoose.model('Estabelecimento', EstabelecimentoSchema);
export default Estabelecimento;
