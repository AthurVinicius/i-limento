import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Usuario from '../models/Usuario.js';
import Estabelecimento from '../models/Estabelecimento.js';
import Item from '../models/Item.js';

// Conectar ao Banco de Dados
await connectDB();

const seedData = async () => {
  try {
    // 1. Limpar coleções existentes
    await Item.deleteMany({});
    await Estabelecimento.deleteMany({});
    await Usuario.deleteMany({});
    console.log('Coleções limpas!');

    // 2. Criar Usuários (Dono e Cliente)
    // OBS: O pre('save') do Usuario vai encriptar a senha automaticamente
    const usuarioDono = await Usuario.create({
      nome: 'Luigi Rossi',
      email: 'luigi@pizza.com',
      senha: 'password123',
      tipo: 'dono',
      telefone: '(11) 98888-7777',
      enderecos: [
        {
          logradouro: 'Av. Paulista',
          numero: '1200',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100',
          principal: true
        }
      ]
    });

    const usuarioCliente = await Usuario.create({
      nome: 'Maria Silva',
      email: 'maria@cliente.com',
      senha: 'password123',
      tipo: 'cliente',
      telefone: '(11) 97777-6666',
      enderecos: [
        {
          logradouro: 'Rua Pamplona',
          numero: '1000',
          bairro: 'Jardim Paulista',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01405-001',
          principal: true
        }
      ]
    });

    console.log('Usuários semeados com sucesso!');

    // 3. Criar Estabelecimentos
    const pizzaria = await Estabelecimento.create({
      nome: 'Bella Italia Pizzaria',
      donoId: usuarioDono._id,
      endereco: {
        logradouro: 'Av. Paulista',
        numero: '1200',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
        coordenadas: {
          type: 'Point',
          coordinates: [-46.6565, -23.5615] // [longitude, latitude]
        }
      },
      categorias: ['Pizza', 'Italiana'],
      contato: {
        telefone: '(11) 98888-7777',
        whatsapp: '(11) 98888-7777',
        email: 'contato@bellaitalia.com'
      },
      descricao: 'Pizzas artesanais assadas no forno a lenha com ingredientes importados de Nápoles.',
      imagemUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      status: 'aberto'
    });

    const burger = await Estabelecimento.create({
      nome: 'Burger Craft',
      donoId: usuarioDono._id,
      endereco: {
        logradouro: 'Rua Augusta',
        numero: '450',
        bairro: 'Consolação',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01304-001',
        coordenadas: {
          type: 'Point',
          coordinates: [-46.6521, -23.5512]
        }
      },
      categorias: ['Lanches', 'Hambúrguer'],
      contato: {
        telefone: '(11) 97777-6666',
        whatsapp: '(11) 97777-6666',
        email: 'contato@burgercraft.com'
      },
      descricao: 'Hambúrgueres grelhados no fogo forte, blends especiais e batatas crocantes artesanais.',
      imagemUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      status: 'aberto'
    });

    console.log('Estabelecimentos semeados com sucesso!');

    // 4. Criar Itens do Cardápio (Menu)
    await Item.create([
      {
        nome: 'Pizza Margherita',
        preco: 48.9,
        estabelecimentoId: pizzaria._id,
        categoria: 'Pizza',
        descricao: 'Molho de tomate fresco, mozzarella fior di latte, manjericão fresco e fios de azeite extra virgem.',
        imagens: ['https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&auto=format&fit=crop&q=60']
      },
      {
        nome: 'Pizza Calabresa Gourmet',
        preco: 52.0,
        estabelecimentoId: pizzaria._id,
        categoria: 'Pizza',
        descricao: 'Molho de tomate, calabresa defumada artesanal de alta qualidade, cebola roxa e azeitona preta.',
        imagens: ['https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=300&auto=format&fit=crop&q=60']
      },
      {
        nome: 'Smash Bacon Burger',
        preco: 32.9,
        estabelecimentoId: burger._id,
        categoria: 'Lanches',
        descricao: 'Dois smash burgers de 80g, queijo cheddar derretido, bacon fatiado crocante e molho artesanal da casa.',
        imagens: ['https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=60']
      },
      {
        nome: 'Double Cheddar Monster',
        preco: 39.9,
        estabelecimentoId: burger._id,
        categoria: 'Lanches',
        descricao: 'Dois hambúrgueres grelhados de 150g, muito cheddar cremoso e cebola caramelizada.',
        imagens: ['https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&auto=format&fit=crop&q=60']
      },
      {
        nome: 'Batata Rústica da Casa',
        preco: 18.0,
        estabelecimentoId: burger._id,
        categoria: 'Acompanhamentos',
        descricao: 'Batatas rústicas fritas na hora, temperadas com páprica defumada e alecrim. Acompanha maionese verde de alho.',
        imagens: ['https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=60']
      }
    ]);

    console.log('Itens de cardápio semeados com sucesso!');
    console.log('Semeadura completa! Banco de dados pronto para testes.');
    process.exit(0);
  } catch (error) {
    console.error(`Erro ao semear o banco de dados: ${error.message}`);
    process.exit(1);
  }
};

await seedData();
