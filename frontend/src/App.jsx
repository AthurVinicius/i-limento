import React, { useState, useEffect } from 'react';
import './App.css';

// ==========================================
// MOCK DATA (Para Fallback se a API estiver Offline)
// ==========================================
const MOCK_USUARIOS = [
  { id: 'u1', nome: 'Admin I-Limento', email: 'admin@ilimento.com', tipo: 'admin' },
  { id: 'u2', nome: 'Luigi Rossi', email: 'luigi@pizza.com', tipo: 'dono' },
  { id: 'u3', nome: 'Maria Silva', email: 'maria@cliente.com', tipo: 'cliente' }
];

const MOCK_ESTABELECIMENTOS = [
  {
    id: 'e1',
    nome: 'Bella Italia Pizzaria',
    donoId: 'u2',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1200',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100'
    },
    categorias: ['Pizza', 'Italiana'],
    contato: { telefone: '(11) 98888-7777', whatsapp: '(11) 98888-7777', email: 'contato@bellaitalia.com' },
    descricao: 'Pizzas artesanais assadas no forno a lenha com ingredientes importados.',
    imagemUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    status: 'aberto'
  },
  {
    id: 'e2',
    nome: 'Burger Craft',
    donoId: 'u2',
    endereco: {
      logradouro: 'Rua Augusta',
      numero: '450',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01304-001'
    },
    categorias: ['Lanches', 'Hambúrguer'],
    contato: { telefone: '(11) 97777-6666', whatsapp: '(11) 97777-6666', email: 'contato@burgercraft.com' },
    descricao: 'Hambúrgueres grelhados no fogo forte, blends especiais e batatas crocantes.',
    imagemUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    status: 'aberto'
  },
  {
    id: 'e3',
    nome: 'Sushiman Premium',
    donoId: 'u2',
    endereco: {
      logradouro: 'Alameda Lorena',
      numero: '800',
      bairro: 'Jardins',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01424-001'
    },
    categorias: ['Japonesa', 'Sushi'],
    contato: { telefone: '(11) 96666-5555', email: 'contato@sushiman.com' },
    descricao: 'Combinados premium de salmão, atum e iguarias orientais frescas preparadas na hora.',
    imagemUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    status: 'aberto'
  },
  {
    id: 'e4',
    nome: 'Doce Vida Confeitaria',
    donoId: 'u2',
    endereco: {
      logradouro: 'Rua Pamplona',
      numero: '1000',
      bairro: 'Jardim Paulista',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01405-001'
    },
    categorias: ['Sobremesas', 'Doces'],
    contato: { telefone: '(11) 95555-4444', email: 'contato@docevida.com' },
    descricao: 'Tortas finas, bolos artesanais, brigadeiros gourmet e cafés especiais.',
    imagemUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    status: 'fechado'
  }
];

const MOCK_ITENS = [
  { id: 'i1', nome: 'Pizza Margherita', preco: 48.9, estabelecimentoId: 'e1', categoria: 'Pizza', descricao: 'Molho de tomate fresco, mozzarella fior di latte, manjericão fresco e azeite.', imagens: ['https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&auto=format&fit=crop&q=60'] },
  { id: 'i2', nome: 'Pizza Calabresa Gourmet', preco: 52.0, estabelecimentoId: 'e1', categoria: 'Pizza', descricao: 'Molho de tomate, calabresa defumada artesanal, cebola roxa e azeitona preta.', imagens: ['https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=300&auto=format&fit=crop&q=60'] },
  { id: 'i3', nome: 'Focaccia Romana', preco: 25.0, estabelecimentoId: 'e1', categoria: 'Entradas', descricao: 'Massa crocante com sal grosso, alecrim fresco e fios de azeite.', imagens: [] },
  
  { id: 'i4', nome: 'Smash Bacon Burger', preco: 32.9, estabelecimentoId: 'e2', categoria: 'Lanches', descricao: 'Dois smash burgers de 80g, queijo cheddar derretido, bastante bacon e molho especial.', imagens: ['https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=60'] },
  { id: 'i5', nome: 'Double Cheddar Monster', preco: 39.9, estabelecimentoId: 'e2', categoria: 'Lanches', descricao: 'Dois hambúrgueres grelhados de 150g, muito cheddar cremoso e cebola caramelizada.', imagens: ['https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&auto=format&fit=crop&q=60'] },
  { id: 'i6', nome: 'Batata Rústica da Casa', preco: 18.0, estabelecimentoId: 'e2', categoria: 'Acompanhamentos', descricao: 'Batatas rústicas fritas na hora, temperadas com páprica e alecrim, acompanha maionese de alho.', imagens: ['https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&auto=format&fit=crop&q=60'] },
  
  { id: 'i7', nome: 'Combinado Osaka (20 Peças)', preco: 79.9, estabelecimentoId: 'e3', categoria: 'Combinados', descricao: '6 sushis salmão, 4 sushis atum, 4 uramakis, 6 hossomakis.', imagens: ['https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300&auto=format&fit=crop&q=60'] },
  { id: 'i8', nome: 'Temaki Salmão Completo', preco: 28.0, estabelecimentoId: 'e3', categoria: 'Temakis', descricao: 'Cone de alga crocante recheado com arroz, salmão em cubos, cream cheese e cebolinha.', imagens: ['https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&auto=format&fit=crop&q=60'] },
  
  { id: 'i9', nome: 'Fatia de Red Velvet', preco: 22.0, estabelecimentoId: 'e4', categoria: 'Bolos', descricao: 'Bolo aveludado vermelho recheado e coberto com creme à base de cream cheese.', imagens: ['https://images.unsplash.com/photo-1616260828576-9542a44491ad?w=300&auto=format&fit=crop&q=60'] },
  { id: 'i10', nome: 'Petit Gâteau Clássico', preco: 24.5, estabelecimentoId: 'e4', categoria: 'Tortas', descricao: 'Pequeno bolo de chocolate com casca crocante e recheio cremoso quente, servido com sorvete de baunilha.', imagens: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=60'] }
];

const API_BASE = 'http://localhost:5000/api';

function App() {
  // ==========================================
  // ESTADOS DO APLICATIVO
  // ==========================================
  const [currentPage, setCurrentPage] = useState('home'); // home, login, detail, dashboard
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [isApiOnline, setIsApiOnline] = useState(false);
  
  // Banco de Dados Local (com fallback inicial nos mocks)
  const [usuarios, setUsuarios] = useState(() => JSON.parse(localStorage.getItem('ilimento_usuarios')) || MOCK_USUARIOS);
  const [estabelecimentos, setEstabelecimentos] = useState(() => JSON.parse(localStorage.getItem('ilimento_estabelecimentos')) || MOCK_ESTABELECIMENTOS);
  const [itens, setItens] = useState(() => JSON.parse(localStorage.getItem('ilimento_itens')) || MOCK_ITENS);
  
  // Filtros e buscas
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [menuItens, setMenuItens] = useState([]);
  
  // Carrinho de Compras
  const [cart, setCart] = useState([]);
  
  // Formulários e Modais
  const [authMode, setAuthMode] = useState('login'); // login, registro
  const [authForm, setAuthForm] = useState({ nome: '', email: '', senha: '', tipo: 'cliente', telefone: '' });
  
  const [showEstModal, setShowEstModal] = useState(false);
  const [estForm, setEstForm] = useState({ id: '', nome: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: 'SP', cep: '', contatoTelefone: '', descricao: '', categorias: '', imagemUrl: '', status: 'fechado' });
  
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemForm, setItemForm] = useState({ id: '', nome: '', preco: '', categoria: '', descricao: '', imagemUrl: '', disponivel: true });
  
  const [dashActiveTab, setDashActiveTab] = useState('restaurantes'); // restaurantes, novo_item
  const [notification, setNotification] = useState(null);

  // ==========================================
  // EFEITOS
  // ==========================================
  // Salvar no LocalStorage sempre que os estados mudarem
  useEffect(() => {
    localStorage.setItem('ilimento_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('ilimento_estabelecimentos', JSON.stringify(estabelecimentos));
  }, [estabelecimentos]);

  useEffect(() => {
    localStorage.setItem('ilimento_itens', JSON.stringify(itens));
  }, [itens]);

  // Checar se a API do Backend está respondendo
  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch(`${API_BASE.replace('/api', '')}/`);
        const data = await response.json();
        if (data.status === 'online') {
          setIsApiOnline(true);
          showToast('Conectado à API do Servidor (MongoDB ativo)', 'success');
          // Carregar dados iniciais da API
          fetchDataFromApi();
        }
      } catch (error) {
        setIsApiOnline(false);
        showToast('Usando Banco de Dados Local (Modo Demonstrativo)', 'info');
      }
    };
    testApi();
  }, []);

  // Monitorar alterações nos itens de cardápio do restaurante selecionado
  useEffect(() => {
    if (selectedEstablishment) {
      if (isApiOnline) {
        fetchItensFromApi(selectedEstablishment.id || selectedEstablishment._id);
      } else {
        const list = itens.filter(item => item.estabelecimentoId === selectedEstablishment.id);
        setMenuItens(list);
      }
    }
  }, [selectedEstablishment, itens, isApiOnline]);

  // Carregar token e usuário do LocalStorage ao montar
  useEffect(() => {
    const savedToken = localStorage.getItem('ilimento_token');
    const savedUser = localStorage.getItem('ilimento_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ==========================================
  // FUNÇÕES AUXILIARES E COMPARTILHADAS
  // ==========================================
  const showToast = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchDataFromApi = async () => {
    try {
      const res = await fetch(`${API_BASE}/estabelecimentos`);
      const data = await res.json();
      if (data.success) {
        // Mapeia _id para id para manter compatibilidade
        const mapped = data.data.map(item => ({ ...item, id: item._id }));
        setEstabelecimentos(mapped);
      }
    } catch (err) {
      console.error("Erro ao puxar estabelecimentos da API:", err);
    }
  };

  const fetchItensFromApi = async (estId) => {
    try {
      const res = await fetch(`${API_BASE}/estabelecimentos/${estId}/itens`);
      const data = await res.json();
      if (data.success) {
        const mapped = data.data.map(item => ({ ...item, id: item._id }));
        setMenuItens(mapped);
      }
    } catch (err) {
      console.error("Erro ao puxar itens da API:", err);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // ==========================================
  // SISTEMA DE ROTAS E NAVEGAÇÃO
  // ==========================================
  const navigateTo = (page, param = null) => {
    setCurrentPage(page);
    if (page === 'detail' && param) {
      setSelectedEstablishment(param);
    } else if (page === 'home') {
      setSelectedEstablishment(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // LÓGICA DE USUÁRIO (AUTH)
  // ==========================================
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (isApiOnline) {
        try {
          const res = await fetch(`${API_BASE}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: authForm.email, senha: authForm.senha })
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.data);
            setToken(data.token);
            localStorage.setItem('ilimento_token', data.token);
            localStorage.setItem('ilimento_user', JSON.stringify(data.data));
            showToast(`Bem-vindo, ${data.data.nome}!`, 'success');
            navigateTo('home');
          } else {
            showToast(data.error || 'Erro ao realizar login', 'error');
          }
        } catch (err) {
          showToast('Erro na conexão com o servidor', 'error');
        }
      } else {
        // Lógica de Fallback do LocalStorage
        const found = usuarios.find(u => u.email === authForm.email);
        if (found) {
          setUser(found);
          setToken('mock-jwt-token-key');
          localStorage.setItem('ilimento_token', 'mock-jwt-token-key');
          localStorage.setItem('ilimento_user', JSON.stringify(found));
          showToast(`Bem-vindo (Modo Local), ${found.nome}!`, 'success');
          navigateTo('home');
        } else {
          showToast('Usuário não encontrado. Cadastre-se ou use: maria@cliente.com ou luigi@pizza.com', 'error');
        }
      }
    } else {
      // Registro
      if (isApiOnline) {
        try {
          const res = await fetch(`${API_BASE}/usuarios/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nome: authForm.nome,
              email: authForm.email,
              senha: authForm.senha,
              tipo: authForm.tipo,
              telefone: authForm.telefone
            })
          });
          const data = await res.json();
          if (data.success) {
            setUser(data.data);
            setToken(data.token);
            localStorage.setItem('ilimento_token', data.token);
            localStorage.setItem('ilimento_user', JSON.stringify(data.data));
            showToast('Cadastro realizado com sucesso!', 'success');
            navigateTo('home');
          } else {
            showToast(data.error || 'Erro no cadastro', 'error');
          }
        } catch (err) {
          showToast('Erro de rede', 'error');
        }
      } else {
        // Fallback Local
        if (usuarios.some(u => u.email === authForm.email)) {
          showToast('Este e-mail já existe', 'error');
          return;
        }
        const newU = {
          id: 'u_' + Date.now(),
          nome: authForm.nome,
          email: authForm.email,
          tipo: authForm.tipo,
          telefone: authForm.telefone
        };
        setUsuarios([...usuarios, newU]);
        setUser(newU);
        setToken('mock-jwt-token-key');
        localStorage.setItem('ilimento_token', 'mock-jwt-token-key');
        localStorage.setItem('ilimento_user', JSON.stringify(newU));
        showToast('Conta criada com sucesso (Modo Local)!', 'success');
        navigateTo('home');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('ilimento_token');
    localStorage.removeItem('ilimento_user');
    setCart([]);
    showToast('Sessão encerrada', 'info');
    navigateTo('home');
  };

  // ==========================================
  // CARRINHO DE COMPRAS
  // ==========================================
  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
    showToast(`${item.nome} adicionado ao pedido!`, 'success');
  };

  const updateCartQty = (itemId, change) => {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;
    const newQty = item.qty + change;
    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== itemId));
    } else {
      setCart(cart.map(i => i.id === itemId ? { ...i, qty: newQty } : i));
    }
  };

  const checkout = () => {
    if (!user) {
      showToast('Por favor, faça login para finalizar o pedido', 'warning');
      navigateTo('login');
      return;
    }
    showToast('Pedido simulado realizado com sucesso! Aguarde o preparo.', 'success');
    setCart([]);
  };

  // ==========================================
  // OPERAÇÕES DO ESTABELECIMENTO (Dono)
  // ==========================================
  const handleEstSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nome: estForm.nome,
      endereco: {
        logradouro: estForm.logradouro,
        numero: estForm.numero,
        bairro: estForm.bairro,
        cidade: estForm.cidade,
        estado: estForm.estado,
        cep: estForm.cep
      },
      categorias: estForm.categorias.split(',').map(s => s.trim()).filter(Boolean),
      contato: { telefone: estForm.contatoTelefone },
      descricao: estForm.descricao,
      imagemUrl: estForm.imagemUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
      status: estForm.status
    };

    if (isApiOnline) {
      try {
        const method = estForm.id ? 'PUT' : 'POST';
        const url = estForm.id ? `${API_BASE}/estabelecimentos/${estForm.id}` : `${API_BASE}/estabelecimentos`;
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast(estForm.id ? 'Estabelecimento atualizado!' : 'Estabelecimento criado!', 'success');
          fetchDataFromApi();
          setShowEstModal(false);
        } else {
          showToast(data.error, 'error');
        }
      } catch (err) {
        showToast('Erro ao enviar dados para a API', 'error');
      }
    } else {
      // Local
      if (estForm.id) {
        setEstabelecimentos(estabelecimentos.map(est => est.id === estForm.id ? { ...est, ...payload, donoId: user.id } : est));
        showToast('Estabelecimento atualizado (Modo Local)!', 'success');
      } else {
        const newE = {
          ...payload,
          id: 'e_' + Date.now(),
          donoId: user.id
        };
        setEstabelecimentos([...estabelecimentos, newE]);
        showToast('Estabelecimento cadastrado (Modo Local)!', 'success');
      }
      setShowEstModal(false);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEstablishment) return;
    const estId = selectedEstablishment.id || selectedEstablishment._id;

    const payload = {
      nome: itemForm.nome,
      preco: parseFloat(itemForm.preco),
      categoria: itemForm.categoria,
      descricao: itemForm.descricao,
      imagens: itemForm.imagemUrl ? [itemForm.imagemUrl] : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'],
      disponivel: itemForm.disponivel
    };

    if (isApiOnline) {
      try {
        const method = itemForm.id ? 'PUT' : 'POST';
        const url = itemForm.id ? `${API_BASE}/itens/${itemForm.id}` : `${API_BASE}/estabelecimentos/${estId}/itens`;
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast(itemForm.id ? 'Item atualizado!' : 'Item adicionado ao cardápio!', 'success');
          fetchItensFromApi(estId);
          setShowItemModal(false);
        } else {
          showToast(data.error, 'error');
        }
      } catch (err) {
        showToast('Erro ao comunicar com a API', 'error');
      }
    } else {
      // Local
      if (itemForm.id) {
        setItens(itens.map(it => it.id === itemForm.id ? { ...it, ...payload } : it));
        showToast('Item atualizado (Modo Local)!', 'success');
      } else {
        const newI = {
          ...payload,
          id: 'i_' + Date.now(),
          estabelecimentoId: estId
        };
        setItens([...itens, newI]);
        showToast('Item adicionado ao cardápio (Modo Local)!', 'success');
      }
      setShowItemModal(false);
    }
  };

  const openEditEst = (est) => {
    setEstForm({
      id: est.id || est._id,
      nome: est.nome,
      logradouro: est.endereco.logradouro,
      numero: est.endereco.numero,
      bairro: est.endereco.bairro,
      cidade: est.endereco.cidade,
      estado: est.endereco.estado,
      cep: est.endereco.cep,
      contatoTelefone: est.contato.telefone,
      descricao: est.descricao || '',
      categorias: est.categorias.join(', '),
      imagemUrl: est.imagemUrl || '',
      status: est.status || 'fechado'
    });
    setShowEstModal(true);
  };

  const openNewEst = () => {
    setEstForm({ id: '', nome: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: 'SP', cep: '', contatoTelefone: '', descricao: '', categorias: '', imagemUrl: '', status: 'fechado' });
    setShowEstModal(true);
  };

  const openEditItem = (item) => {
    setItemForm({
      id: item.id || item._id,
      nome: item.nome,
      preco: item.preco,
      categoria: item.categoria,
      descricao: item.descricao || '',
      imagemUrl: item.imagens && item.imagens[0] ? item.imagens[0] : '',
      disponivel: item.disponivel !== false
    });
    setShowItemModal(true);
  };

  const openNewItem = () => {
    setItemForm({ id: '', nome: '', preco: '', categoria: 'Lanches', descricao: '', imagemUrl: '', disponivel: true });
    setShowItemModal(true);
  };

  const handleExcluirEst = async (estId) => {
    if (!window.confirm('Tem certeza que deseja excluir este estabelecimento?')) return;
    if (isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/estabelecimentos/${estId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          showToast('Estabelecimento excluído', 'success');
          fetchDataFromApi();
        } else {
          showToast(data.error, 'error');
        }
      } catch (err) {
        showToast('Erro de rede', 'error');
      }
    } else {
      setEstabelecimentos(estabelecimentos.filter(e => e.id !== estId));
      setItens(itens.filter(i => i.estabelecimentoId !== estId));
      showToast('Estabelecimento excluído (Modo Local)', 'success');
    }
  };

  const handleExcluirItem = async (itemId) => {
    if (!window.confirm('Tem certeza que deseja remover este item do cardápio?')) return;
    const estId = selectedEstablishment.id || selectedEstablishment._id;

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/itens/${itemId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          showToast('Item excluído', 'success');
          fetchItensFromApi(estId);
        } else {
          showToast(data.error, 'error');
        }
      } catch (err) {
        showToast('Erro de rede', 'error');
      }
    } else {
      setItens(itens.filter(i => i.id !== itemId));
      showToast('Item excluído (Modo Local)', 'success');
    }
  };

  // ==========================================
  // FILTRAGEM
  // ==========================================
  const categoriasUnicas = ['Todos', ...new Set(estabelecimentos.flatMap(e => e.categorias))];

  const filteredEstabelecimentos = estabelecimentos.filter(e => {
    const matchSearch = e.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (e.descricao && e.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = activeCategory === 'Todos' || e.categorias.includes(activeCategory);
    return matchSearch && matchCategory;
  });

  const isDono = user && (user.tipo === 'dono' || user.tipo === 'admin');

  // ==========================================
  // RENDERIZADOR
  // ==========================================
  return (
    <div className="app-container">
      {/* Toast Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.type === 'success' && (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
          )}
          {notification.type === 'error' && (
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Navbar principal */}
      <header className="navbar">
        <div className="logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ff5a36'}}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          i-<span>limento</span>
        </div>

        <div className="nav-links">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('home')}>Restaurantes</button>
          
          {user ? (
            <>
              {isDono && (
                <button className="btn btn-outline btn-sm" onClick={() => navigateTo('dashboard')}>
                  Meu Painel
                </button>
              )}
              <div className="user-badge">
                <span className="role-tag">{user.tipo}</span>
                <span>{user.nome.split(' ')[0]}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => { setAuthMode('login'); navigateTo('login'); }}>
              Entrar
            </button>
          )}
        </div>
      </header>

      {/* ROTA: Home (Lista de Estabelecimentos) */}
      {currentPage === 'home' && (
        <>
          <section className="hero">
            <div className="hero-content">
              <h1>Seu prato favorito a um <mark>clique</mark> de distância</h1>
              <p>Os melhores estabelecimentos locais da sua cidade, com os ingredientes que você adora.</p>
              
              <div className="search-container">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Buscar restaurante ou especialidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button">Buscar</button>
              </div>
            </div>
          </section>

          <main className="main-content">
            <div className="filters-bar">
              {categoriasUnicas.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 className="section-title">Parceiros em Destaque</h2>
            {filteredEstabelecimentos.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                Nenhum estabelecimento encontrado nesta categoria.
              </p>
            ) : (
              <div className="grid">
                {filteredEstabelecimentos.map(est => (
                  <div key={est.id || est._id} className="card" onClick={() => navigateTo('detail', est)} style={{ cursor: 'pointer' }}>
                    <div className="card-img-wrapper">
                      <img src={est.imagemUrl} alt={est.nome} className="card-img" />
                      <span className={`card-status ${est.status === 'aberto' ? 'status-open' : 'status-closed'}`}>
                        {est.status === 'aberto' ? 'Aberto' : 'Fechado'}
                      </span>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{est.nome}</h3>
                      <p className="card-desc">{est.descricao || 'Nenhuma descrição disponível.'}</p>
                      
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        📍 {est.endereco.logradouro}, {est.endereco.numero} - {est.endereco.bairro}
                      </p>

                      <div className="card-footer">
                        <div className="card-tags">
                          {est.categorias.map(cat => (
                            <span key={cat} className="tag">{cat}</span>
                          ))}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600}}>
                          Ver Cardápio &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* ROTA: Login / Registro */}
      {currentPage === 'login' && (
        <main className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>{authMode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
              <p>{authMode === 'login' ? 'Acesse sua conta para fazer pedidos' : 'Faça parte do i-limento hoje'}</p>
            </div>

            <form onSubmit={handleAuthSubmit}>
              {authMode === 'registro' && (
                <div className="form-group">
                  <label className="form-label">Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Seu nome"
                    value={authForm.nome}
                    onChange={(e) => setAuthForm({ ...authForm, nome: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="exemplo@email.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Mínimo 6 caracteres"
                  value={authForm.senha}
                  onChange={(e) => setAuthForm({ ...authForm, senha: e.target.value })}
                  required
                />
              </div>

              {authMode === 'registro' && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="(11) 99999-9999"
                      value={authForm.telefone}
                      onChange={(e) => setAuthForm({ ...authForm, telefone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tipo de Perfil</label>
                    <select 
                      className="form-select"
                      value={authForm.tipo}
                      onChange={(e) => setAuthForm({ ...authForm, tipo: e.target.value })}
                    >
                      <option value="cliente">Cliente (Consumidor)</option>
                      <option value="dono">Dono de Restaurante</option>
                    </select>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}>
                {authMode === 'login' ? 'Entrar no Sistema' : 'Finalizar Cadastro'}
              </button>
            </form>

            <div className="auth-toggle">
              {authMode === 'login' ? (
                <>Não tem uma conta? <span onClick={() => setAuthMode('registro')}>Cadastre-se</span></>
              ) : (
                <>Já possui conta? <span onClick={() => setAuthMode('login')}>Entrar</span></>
              )}
            </div>
            
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              <p><strong>Contas de Demonstração (Modo Local):</strong></p>
              <p>Dono: <code>luigi@pizza.com</code> (qualquer senha)</p>
              <p>Cliente: <code>maria@cliente.com</code> (qualquer senha)</p>
            </div>
          </div>
        </main>
      )}

      {/* ROTA: Detalhe do Estabelecimento (Cardápio) */}
      {currentPage === 'detail' && selectedEstablishment && (
        <main className="main-content">
          <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('home')} style={{ marginBottom: '1.5rem' }}>
            &larr; Voltar para Restaurantes
          </button>

          <div className="detail-header">
            <img src={selectedEstablishment.imagemUrl} alt={selectedEstablishment.nome} className="detail-header-img" />
            <div className="detail-header-info">
              <h2>{selectedEstablishment.nome}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{selectedEstablishment.descricao || 'Nenhuma descrição fornecida.'}</p>
              
              <div className="detail-meta">
                <span>📍 {selectedEstablishment.endereco.logradouro}, {selectedEstablishment.endereco.numero} - {selectedEstablishment.endereco.bairro}</span>
                <span>📞 {selectedEstablishment.contato.telefone}</span>
                <span className={`role-tag ${selectedEstablishment.status === 'aberto' ? 'status-open' : 'status-closed'}`} style={{ color: 'inherit', background: 'none', border: '1px solid currentColor' }}>
                  {selectedEstablishment.status === 'aberto' ? 'Aberto Agora' : 'Fechado'}
                </span>
              </div>

              <div className="card-tags">
                {selectedEstablishment.categorias.map(cat => (
                  <span key={cat} className="tag">{cat}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="menu-container">
            {/* Lista do Cardápio */}
            <div className="menu-list">
              <h3 className="section-title">Cardápio do Dia</h3>
              
              {menuItens.length === 0 ? (
                <div className="menu-category-section" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                  <p>Nenhum item cadastrado neste estabelecimento.</p>
                  {isDono && (
                    <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigateTo('dashboard')}>
                      Ir ao Painel para Adicionar Itens
                    </button>
                  )}
                </div>
              ) : (
                <div className="menu-category-section">
                  <div className="menu-items-list">
                    {menuItens.map(item => (
                      <div key={item.id || item._id} className="menu-item-row">
                        {item.imagens && item.imagens[0] && (
                          <img src={item.imagens[0]} alt={item.nome} className="menu-item-img" />
                        )}
                        <div className="menu-item-info">
                          <div className="menu-item-name">{item.nome}</div>
                          <div className="menu-item-desc">{item.descricao || 'Sem descrição.'}</div>
                          <div className="menu-item-price">{formatCurrency(item.preco)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {item.disponivel !== false ? (
                            <button className="btn btn-primary btn-sm" onClick={() => addToCart(item)}>
                              + Adicionar
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--error)', fontWeight: 600 }}>Indisponível</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Carrinho de Compras lateral */}
            <aside className="cart-card">
              <div className="cart-title">
                <span>Meu Pedido</span>
                <span className="role-tag" style={{ color: 'var(--primary)' }}>
                  {cart.reduce((sum, item) => sum + item.qty, 0)} itens
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="cart-empty">
                  <p>🛒 Seu carrinho está vazio</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Adicione itens do cardápio para começar.</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                          <div style={{ fontWeight: 600 }}>{item.nome}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {formatCurrency(item.preco)} cada
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem' }} onClick={() => updateCartQty(item.id, -1)}>-</button>
                          <span>{item.qty}</span>
                          <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem' }} onClick={() => updateCartQty(item.id, 1)}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-totals">
                    <div className="cart-total-row">
                      <span>Total:</span>
                      <span>{formatCurrency(cart.reduce((sum, item) => sum + (item.preco * item.qty), 0))}</span>
                    </div>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} onClick={checkout}>
                    Finalizar Pedido
                  </button>
                </>
              )}
            </aside>
          </div>
        </main>
      )}

      {/* ROTA: Dashboard (Dono de Estabelecimentos) */}
      {currentPage === 'dashboard' && isDono && (
        <main className="main-content">
          <div className="dashboard-grid">
            <aside className="dashboard-sidebar">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--secondary)' }}>Painel de Controle</h3>
              
              <button 
                className={`sidebar-btn ${dashActiveTab === 'restaurantes' ? 'active' : ''}`}
                onClick={() => setDashActiveTab('restaurantes')}
              >
                Meus Restaurantes
              </button>
              
              <button 
                className="btn btn-primary btn-sm" 
                style={{ marginTop: '1.5rem' }}
                onClick={openNewEst}
              >
                + Novo Restaurante
              </button>
            </aside>

            <div className="dashboard-content">
              {dashActiveTab === 'restaurantes' && (
                <div>
                  <h3 className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Meus Estabelecimentos</span>
                  </h3>

                  {estabelecimentos.filter(e => e.donoId === user.id || isApiOnline).length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>Você ainda não cadastrou nenhum estabelecimento.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {estabelecimentos
                        .filter(e => e.donoId === user.id || isApiOnline)
                        .map(est => (
                          <div key={est.id || est._id} style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <img src={est.imagemUrl} alt={est.nome} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                            
                            <div style={{ flex: 1, minWidth: '200px' }}>
                              <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{est.nome}</h4>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {est.endereco.logradouro}, {est.endereco.numero}</p>
                              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <span className={`role-tag ${est.status === 'aberto' ? 'status-open' : 'status-closed'}`}>{est.status}</span>
                                {est.categorias.map(c => <span key={c} className="tag">{c}</span>)}
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedEstablishment(est); navigateTo('detail', est); }}>
                                Cardápio ({itens.filter(i => i.estabelecimentoId === (est.id || est._id)).length})
                              </button>
                              
                              <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedEstablishment(est); openNewItem(); }}>
                                + Add Item
                              </button>

                              <button className="btn btn-secondary btn-sm" style={{ color: 'blue' }} onClick={() => openEditEst(est)}>
                                Editar
                              </button>

                              <button className="btn btn-danger btn-sm" onClick={() => handleExcluirEst(est.id || est._id)}>
                                Excluir
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Lista de gerenciamento de itens se um restaurante estiver aberto */}
                  {selectedEstablishment && (
                    <div style={{ marginTop: '3rem', borderTop: '2px solid var(--border)', paddingTop: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Cardápio de: {selectedEstablishment.nome}</h3>
                        <button className="btn btn-primary btn-sm" onClick={openNewItem}>+ Adicionar Item ao Cardápio</button>
                      </div>

                      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                          <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                            <th style={{ padding: '0.8rem' }}>Nome</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {menuItens.map(item => (
                            <tr key={item.id || item._id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '0.8rem', fontWeight: 600 }}>{item.nome}</td>
                              <td>{item.categoria}</td>
                              <td>{formatCurrency(item.preco)}</td>
                              <td>
                                <span className={`role-tag ${item.disponivel !== false ? 'status-open' : 'status-closed'}`}>
                                  {item.disponivel !== false ? 'Disponível' : 'Indisponível'}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button className="btn btn-secondary btn-sm" style={{ marginRight: '0.5rem' }} onClick={() => openEditItem(item)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleExcluirItem(item.id || item._id)}>Remover</button>
                              </td>
                            </tr>
                          ))}
                          {menuItens.length === 0 && (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                Nenhum item cadastrado no cardápio deste restaurante ainda.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* MODAL: Criar/Editar Estabelecimento */}
      {showEstModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{estForm.id ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}</h3>
              <button className="close-btn" onClick={() => setShowEstModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleEstSubmit}>
              <div className="form-group">
                <label className="form-label">Nome do Estabelecimento</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={estForm.nome}
                  onChange={(e) => setEstForm({ ...estForm, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Rua/Logradouro</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={estForm.logradouro}
                    onChange={(e) => setEstForm({ ...estForm, logradouro: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Número</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={estForm.numero}
                    onChange={(e) => setEstForm({ ...estForm, numero: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Bairro</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={estForm.bairro}
                    onChange={(e) => setEstForm({ ...estForm, bairro: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cidade</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={estForm.cidade}
                    onChange={(e) => setEstForm({ ...estForm, cidade: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">CEP</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="00000-000"
                    value={estForm.cep}
                    onChange={(e) => setEstForm({ ...estForm, cep: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone de Contato</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="(11) 99999-9999"
                    value={estForm.contatoTelefone}
                    onChange={(e) => setEstForm({ ...estForm, contatoTelefone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Categorias (separadas por vírgula)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Pizza, Italiana, Lanches"
                  value={estForm.categorias}
                  onChange={(e) => setEstForm({ ...estForm, categorias: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL da Imagem de Capa</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="http://..."
                  value={estForm.imagemUrl}
                  onChange={(e) => setEstForm({ ...estForm, imagemUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea 
                  className="form-input" 
                  style={{ height: '80px', resize: 'vertical' }}
                  value={estForm.descricao}
                  onChange={(e) => setEstForm({ ...estForm, descricao: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status de Funcionamento</label>
                <select 
                  className="form-select"
                  value={estForm.status}
                  onChange={(e) => setEstForm({ ...estForm, status: e.target.value })}
                >
                  <option value="aberto">Aberto</option>
                  <option value="fechado">Fechado</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEstModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Criar/Editar Item do Cardápio */}
      {showItemModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{itemForm.id ? 'Editar Item do Cardápio' : 'Novo Item do Cardápio'}</h3>
              <button className="close-btn" onClick={() => setShowItemModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleItemSubmit}>
              <div className="form-group">
                <label className="form-label">Nome do Item</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={itemForm.nome}
                  onChange={(e) => setItemForm({ ...itemForm, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Preço (R$)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    placeholder="29.90"
                    value={itemForm.preco}
                    onChange={(e) => setItemForm({ ...itemForm, preco: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Entradas, Lanches, Sobremesas"
                    value={itemForm.categoria}
                    onChange={(e) => setItemForm({ ...itemForm, categoria: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">URL da Imagem do Prato</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="http://..."
                  value={itemForm.imagemUrl}
                  onChange={(e) => setItemForm({ ...itemForm, imagemUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição dos Ingredientes / Prato</label>
                <textarea 
                  className="form-input" 
                  style={{ height: '80px', resize: 'vertical' }}
                  value={itemForm.descricao}
                  onChange={(e) => setItemForm({ ...itemForm, descricao: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
                <input 
                  type="checkbox" 
                  id="disponivel"
                  checked={itemForm.disponivel}
                  onChange={(e) => setItemForm({ ...itemForm, disponivel: e.target.checked })}
                />
                <label htmlFor="disponivel" style={{ fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer' }}>Item disponível para venda</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowItemModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer do app */}
      <footer style={{ backgroundColor: 'var(--secondary)', color: 'white', padding: '3rem 2rem', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div className="logo" style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ff5a36'}}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              i-limento
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '300px' }}>
              Conectando você aos melhores restaurantes locais. Alimentação de qualidade, rápida e fácil.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Tecnologias</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>React (Vite)</p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Node.js (Express)</p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>MongoDB (Mongoose)</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Banco de Dados</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Status: <span style={{ color: isApiOnline ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>{isApiOnline ? 'MongoDB (Online)' : 'LocalStorage (Mock)'}</span>
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #1e293b', fontSize: '0.8rem', color: '#64748b' }}>
          &copy; {new Date().getFullYear()} i-limento. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

export default App;
