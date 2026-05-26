/* ==========================================
   REUSO — Mock Data & Seed
   Initial data for demonstration
   ========================================== */

/* --- Constants --- */

const CATEGORIES = [
  { id: 'roupas', label: 'Roupas', icon: 'bi-bag' },
  { id: 'livros', label: 'Livros', icon: 'bi-book' },
  { id: 'eletronicos', label: 'Eletrônicos', icon: 'bi-laptop' },
  { id: 'moveis', label: 'Móveis', icon: 'bi-lamp' },
  { id: 'utensilios', label: 'Utensílios', icon: 'bi-cup-hot' },
  { id: 'maquinas', label: 'Máquinas', icon: 'bi-gear' },
  { id: 'madeira', label: 'Madeira', icon: 'bi-tree' },
  { id: 'entulho', label: 'Entulho', icon: 'bi-bricks' },
  { id: 'sucata', label: 'Sucata', icon: 'bi-wrench' },
  { id: 'materiais_construcao', label: 'Mat. Construção', icon: 'bi-building' },
  { id: 'outros', label: 'Outros', icon: 'bi-three-dots' },
];

const DURATIONS = [
  { id: '24h', label: '24 horas', ms: 24 * 60 * 60 * 1000 },
  { id: '1w', label: '1 semana', ms: 7 * 24 * 60 * 60 * 1000 },
  { id: '15d', label: '15 dias', ms: 15 * 24 * 60 * 60 * 1000 },
  { id: '1m', label: '1 mês', ms: 30 * 24 * 60 * 60 * 1000 },
];

const STATES_CITIES = {
  'SP': {
    name: 'São Paulo',
    cities: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André'],
  },
  'MG': {
    name: 'Minas Gerais',
    cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Betim'],
  },
  'RJ': {
    name: 'Rio de Janeiro',
    cities: ['Rio de Janeiro', 'Niterói', 'São Gonçalo', 'Duque de Caxias'],
  },
  'PR': {
    name: 'Paraná',
    cities: ['Curitiba', 'Londrina', 'Maringá'],
  },
  'RS': {
    name: 'Rio Grande do Sul',
    cities: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
  },
};

/* --- Mock Data --- */

const MOCK_USERS = [
  {
    id: 'usr_001',
    type: 'pf',
    name: 'Marcos Silva',
    email: 'marcos@email.com',
    password: 'senha123',
    phone: '(11) 99999-0001',
    cpf: '',
    cnpj: '',
    companyName: '',
    address: { cep: '01001-000', city: 'São Paulo', state: 'SP' },
    createdAt: '2026-05-01T10:00:00Z',
  },
  {
    id: 'usr_002',
    type: 'pf',
    name: 'Maria Oliveira',
    email: 'maria@email.com',
    password: 'senha123',
    phone: '(11) 98888-0002',
    cpf: '',
    cnpj: '',
    companyName: '',
    address: { cep: '07000-000', city: 'Guarulhos', state: 'SP' },
    createdAt: '2026-05-02T10:00:00Z',
  },
  {
    id: 'usr_003',
    type: 'pj',
    name: 'DeBoa Ltda',
    email: 'contato@deboa.com',
    password: 'senha123',
    phone: '(11) 3333-0003',
    cpf: '',
    cnpj: '12.345.678/0001-01',
    companyName: 'DeBoa Coleta e Reciclagem Ltda',
    address: { cep: '01310-100', city: 'São Paulo', state: 'SP' },
    createdAt: '2026-05-01T08:00:00Z',
  },
  {
    id: 'usr_004',
    type: 'pj',
    name: 'VaiComAsOutras Ltda',
    email: 'contato@vaicomasoutras.com',
    password: 'senha123',
    phone: '(11) 3333-0004',
    cpf: '',
    cnpj: '98.765.432/0001-02',
    companyName: 'VaiComAsOutras Reciclagem Ltda',
    address: { cep: '01310-200', city: 'São Paulo', state: 'SP' },
    createdAt: '2026-05-01T09:00:00Z',
  },
  {
    id: 'usr_005',
    type: 'pj',
    name: 'MelhorUso Ltda',
    email: 'contato@melhoruso.org',
    password: 'senha123',
    phone: '(11) 3333-0005',
    cpf: '',
    cnpj: '11.222.333/0001-03',
    companyName: 'MelhorUso Projetos Sociais Ltda',
    address: { cep: '01310-300', city: 'São Paulo', state: 'SP' },
    createdAt: '2026-05-01T07:00:00Z',
  },
  {
    id: 'usr_006',
    type: 'pf',
    name: 'Carlos Mendes',
    email: 'carlos@email.com',
    password: 'senha123',
    phone: '(31) 99777-0006',
    cpf: '',
    cnpj: '',
    companyName: '',
    address: { cep: '30130-000', city: 'Belo Horizonte', state: 'MG' },
    createdAt: '2026-05-03T10:00:00Z',
  },
];

// Helper to get dates relative to now
function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const MOCK_ITEMS = [
  {
    id: 'item_001',
    userId: 'usr_001',
    title: '100m² de Telha Romana',
    description: 'Telhas romanas em bom estado, retiradas de telhado recentemente renovado. Aproximadamente 100 metros quadrados de telhas, sem trincas significativas. Ideais para coberturas residenciais. Estão empilhadas no quintal e precisam ser retiradas.',
    category: 'materiais_construcao',
    volume: 'Aproximadamente 100m² de telhas (~500 peças)',
    photos: [],
    address: { city: 'São Paulo', state: 'SP' },
    duration: '15d',
    expiresAt: daysFromNow(8),
    status: 'ativo',
    acceptedBidId: null,
    createdAt: daysAgo(7),
  },
  {
    id: 'item_002',
    userId: 'usr_001',
    title: 'Sofá 3 Lugares Cinza',
    description: 'Sofá de 3 lugares, tecido cinza, em condições razoáveis. Possui alguns sinais de uso mas estrutura firme. Preciso liberar espaço na sala após reforma.',
    category: 'moveis',
    volume: '1 sofá (2,10m x 0,90m x 0,85m)',
    photos: [],
    address: { city: 'São Paulo', state: 'SP' },
    duration: '1m',
    expiresAt: daysFromNow(20),
    status: 'ativo',
    acceptedBidId: null,
    createdAt: daysAgo(10),
  },
  {
    id: 'item_003',
    userId: 'usr_006',
    title: 'Lote de 50 Livros Variados',
    description: 'Coleção de 50 livros variados incluindo romances, ficção científica, autoajuda e didáticos. Todos em bom estado de conservação. Estou desapegando para liberar espaço na estante.',
    category: 'livros',
    volume: '50 livros (aproximadamente 2 caixas)',
    photos: [],
    address: { city: 'Belo Horizonte', state: 'MG' },
    duration: '1m',
    expiresAt: daysFromNow(15),
    status: 'ativo',
    acceptedBidId: null,
    createdAt: daysAgo(15),
  },
  {
    id: 'item_004',
    userId: 'usr_002',
    title: 'Monitor LCD 22 polegadas',
    description: 'Monitor LCD Samsung 22 polegadas, modelo antigo mas funcionando perfeitamente. Conexão VGA e DVI. Sem pixels mortos. Inclui cabo de energia.',
    category: 'eletronicos',
    volume: '1 monitor + cabos',
    photos: [],
    address: { city: 'Guarulhos', state: 'SP' },
    duration: '15d',
    expiresAt: daysFromNow(5),
    status: 'ativo',
    acceptedBidId: null,
    createdAt: daysAgo(10),
  },
  {
    id: 'item_005',
    userId: 'usr_006',
    title: 'Roupas Infantis (Lote 30 peças)',
    description: 'Lote de 30 peças de roupas infantis (2 a 4 anos), incluindo camisetas, bermudas, vestidos e pijamas. Todas em bom estado, apenas sem uso. Marcas variadas.',
    category: 'roupas',
    volume: '30 peças (1 sacola grande)',
    photos: [],
    address: { city: 'Belo Horizonte', state: 'MG' },
    duration: '1w',
    expiresAt: daysFromNow(3),
    status: 'ativo',
    acceptedBidId: null,
    createdAt: daysAgo(4),
  },
  {
    id: 'item_006',
    userId: 'usr_001',
    title: 'Máquina de Lavar Brastemp Antiga',
    description: 'Máquina de lavar Brastemp 10kg, modelo antigo (2015). Funciona mas faz barulho no centrifugar. Pode ser usada para peças ou conserto. Preciso do espaço na lavanderia.',
    category: 'maquinas',
    volume: '1 máquina de lavar',
    photos: [],
    address: { city: 'São Paulo', state: 'SP' },
    duration: '15d',
    expiresAt: daysFromNow(10),
    status: 'ativo',
    acceptedBidId: null,
    createdAt: daysAgo(5),
  },
  {
    id: 'item_007',
    userId: 'usr_002',
    title: 'Restos de Madeira de Obra',
    description: 'Sobras de madeira de uma reforma: tábuas, caibros, ripas e compensados. Algumas peças em bom estado, outras para lenha. Aproximadamente 2m³ de material.',
    category: 'madeira',
    volume: 'Aproximadamente 2m³',
    photos: [],
    address: { city: 'Guarulhos', state: 'SP' },
    duration: '1w',
    expiresAt: daysFromNow(2),
    status: 'ativo',
    acceptedBidId: null,
    createdAt: daysAgo(5),
  },
  {
    id: 'item_008',
    userId: 'usr_006',
    title: 'Entulho de Reforma Residencial',
    description: 'Entulho proveniente de reforma de banheiro e cozinha. Contém restos de azulejos, argamassa, tijolos quebrados e concreto. Aproximadamente 3m³. Precisa de caçamba ou caminhão.',
    category: 'entulho',
    volume: 'Aproximadamente 3m³',
    photos: [],
    address: { city: 'Belo Horizonte', state: 'MG' },
    duration: '1w',
    expiresAt: daysAgo(1),
    status: 'ativo',
    acceptedBidId: null,
    createdAt: daysAgo(8),
  },
  {
    id: 'item_009',
    userId: 'usr_002',
    title: 'Utensílios de Cozinha Variados',
    description: 'Conjunto de utensílios de cozinha: panelas, frigideiras, talheres, pratos, copos e formas. Tudo usado mas em bom estado. Ideal para quem está montando casa.',
    category: 'utensilios',
    volume: '2 caixas médias',
    photos: [],
    address: { city: 'Guarulhos', state: 'SP' },
    duration: '15d',
    expiresAt: daysFromNow(12),
    status: 'ativo',
    acceptedBidId: null,
    createdAt: daysAgo(3),
  },
  {
    id: 'item_010',
    userId: 'usr_006',
    title: 'Sucata de Ferro — Portão Antigo',
    description: 'Portão de ferro antigo desmontado, com grade decorativa. Peso estimado de 80kg. Serve como sucata de ferro ou para projetos artísticos/decoração rústica.',
    category: 'sucata',
    volume: '1 portão desmontado (~80kg)',
    photos: [],
    address: { city: 'Belo Horizonte', state: 'MG' },
    duration: '1m',
    expiresAt: daysFromNow(22),
    status: 'ativo',
    acceptedBidId: null,
    createdAt: daysAgo(8),
  },
];

const MOCK_BIDS = [
  // Cenário das telhas (item_001) — 4 propostas
  {
    id: 'bid_001',
    itemId: 'item_001',
    userId: 'usr_002',
    type: 'pago',
    value: 200.00,
    createdAt: daysAgo(5),
  },
  {
    id: 'bid_002',
    itemId: 'item_001',
    userId: 'usr_003',
    type: 'cobro',
    value: 200.00,
    createdAt: daysAgo(5),
  },
  {
    id: 'bid_003',
    itemId: 'item_001',
    userId: 'usr_004',
    type: 'cobro',
    value: 200.00,
    createdAt: daysAgo(4),
  },
  {
    id: 'bid_004',
    itemId: 'item_001',
    userId: 'usr_005',
    type: 'gratis',
    value: 0,
    createdAt: daysAgo(4),
  },
  // Propostas extras em outros itens
  {
    id: 'bid_005',
    itemId: 'item_002',
    userId: 'usr_002',
    type: 'pago',
    value: 150.00,
    createdAt: daysAgo(8),
  },
  {
    id: 'bid_006',
    itemId: 'item_002',
    userId: 'usr_006',
    type: 'gratis',
    value: 0,
    createdAt: daysAgo(7),
  },
  {
    id: 'bid_007',
    itemId: 'item_003',
    userId: 'usr_002',
    type: 'pago',
    value: 50.00,
    createdAt: daysAgo(10),
  },
  {
    id: 'bid_008',
    itemId: 'item_005',
    userId: 'usr_001',
    type: 'gratis',
    value: 0,
    createdAt: daysAgo(2),
  },
  {
    id: 'bid_009',
    itemId: 'item_008',
    userId: 'usr_003',
    type: 'cobro',
    value: 350.00,
    createdAt: daysAgo(6),
  },
  {
    id: 'bid_010',
    itemId: 'item_010',
    userId: 'usr_003',
    type: 'pago',
    value: 120.00,
    createdAt: daysAgo(5),
  },
];

/* --- Generate placeholder photos for mock items --- */
function generateMockPhotos() {
  const photoMap = {
    'item_001': ['Telhas Romanas', '#fecaca'],
    'item_002': ['Sofá 3 Lugares', '#dbeafe'],
    'item_003': ['Lote de Livros', '#fef3c7'],
    'item_004': ['Monitor LCD', '#e0e7ff'],
    'item_005': ['Roupas Infantis', '#fce7f3'],
    'item_006': ['Máquina de Lavar', '#d1fae5'],
    'item_007': ['Madeira de Obra', '#fed7aa'],
    'item_008': ['Entulho', '#e5e7eb'],
    'item_009': ['Utensílios', '#ddd6fe'],
    'item_010': ['Portão de Ferro', '#ccfbf1'],
  };

  MOCK_ITEMS.forEach(item => {
    const [text, color] = photoMap[item.id] || ['Item', '#d1fae5'];
    item.photos = [generatePlaceholderImage(text, color)];
  });
}

/* --- Seed Function --- */

/**
 * Seed the localStorage with mock data (only on first visit)
 */
function seedData() {
  if (isSeeded()) return;

  // Generate placeholder photos
  generateMockPhotos();

  // Save mock data
  setCollection(STORAGE_KEYS.USERS, MOCK_USERS);
  setCollection(STORAGE_KEYS.ITEMS, MOCK_ITEMS);
  setCollection(STORAGE_KEYS.BIDS, MOCK_BIDS);

  // Mark as seeded
  localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
}
