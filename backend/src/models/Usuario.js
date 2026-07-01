import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const EnderecoSchema = new mongoose.Schema({
  logradouro: { type: String, required: true },
  numero: { type: String, required: true },
  complemento: { type: String },
  bairro: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
  cep: { type: String, required: true },
  principal: { type: Boolean, default: false }
}, { _id: true });

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Por favor, adicione um nome']
  },
  email: {
    type: String,
    required: [true, 'Por favor, adicione um e-mail'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, adicione um e-mail válido']
  },
  senha: {
    type: String,
    required: [true, 'Por favor, adicione uma senha'],
    minlength: 6,
    select: false // Não retorna a senha nas consultas por padrão
  },
  tipo: {
    type: String,
    enum: ['cliente', 'dono', 'admin'],
    default: 'cliente'
  },
  telefone: {
    type: String
  },
  enderecos: [EnderecoSchema]
}, {
  timestamps: true
});

// Criptografar a senha antes de salvar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para verificar se a senha coincide
UsuarioSchema.methods.matchSenha = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

const Usuario = mongoose.model('Usuario', UsuarioSchema);
export default Usuario;
