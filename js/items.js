/* ==========================================
   REUSO — Item Logic Module
   CRUD and business rules for items
   ========================================== */

/**
 * Create a new item listing
 * @param {object} itemData - { title, description, category, volume, photos, address, duration }
 * @returns {object} { success, item?, message? }
 */
function createItem(itemData) {
  // Validate required fields
  if (!itemData.title || !itemData.title.trim()) {
    return { success: false, message: 'O título é obrigatório.' };
  }

  if (!itemData.description || !itemData.description.trim()) {
    return { success: false, message: 'A descrição é obrigatória.' };
  }

  if (!itemData.category) {
    return { success: false, message: 'Selecione uma categoria.' };
  }

  if (!itemData.volume || !itemData.volume.trim()) {
    return { success: false, message: 'Informe o volume/quantidade.' };
  }

  if (!itemData.photos || itemData.photos.length === 0) {
    return { success: false, message: 'Adicione pelo menos 1 foto.' };
  }

  if (itemData.photos.length > 5) {
    return { success: false, message: 'Máximo de 5 fotos permitido.' };
  }

  if (!itemData.address || !itemData.address.city || !itemData.address.state) {
    return { success: false, message: 'Informe a cidade e o estado.' };
  }

  if (!itemData.duration) {
    return { success: false, message: 'Selecione a duração do anúncio.' };
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'Você precisa estar logado para criar um item.' };
  }

  const createdAt = new Date().toISOString();

  const item = {
    id: generateId('item'),
    userId: currentUser.id,
    title: itemData.title.trim(),
    description: itemData.description.trim(),
    category: itemData.category,
    volume: itemData.volume.trim(),
    photos: itemData.photos,
    address: {
      city: itemData.address.city,
      state: itemData.address.state,
    },
    duration: itemData.duration,
    createdAt: createdAt,
    expiresAt: calculateExpiresAt(createdAt, itemData.duration),
    status: 'ativo',
    acceptedBidId: null,
  };

  createRecord(STORAGE_KEYS.ITEMS, item);

  return { success: true, item };
}

/**
 * Get an item by ID, auto-updating expired status
 * @param {string} itemId
 * @returns {object|null}
 */
function getItemById(itemId) {
  const item = getById(STORAGE_KEYS.ITEMS, itemId);
  if (item && item.status === 'ativo' && isExpired(item.expiresAt)) {
    item.status = 'expirado';
    updateRecord(STORAGE_KEYS.ITEMS, itemId, { status: 'expirado' });
  }
  return item;
}

/**
 * Get all items belonging to a user, auto-updating expired ones
 * @param {string} userId
 * @returns {Array}
 */
function getItemsByUser(userId) {
  return getItems()
    .filter(i => i.userId === userId)
    .map(item => {
      if (item.status === 'ativo' && isExpired(item.expiresAt)) {
        item.status = 'expirado';
        updateRecord(STORAGE_KEYS.ITEMS, item.id, { status: 'expirado' });
      }
      return item;
    });
}

/**
 * Get all active (non-expired) items
 * @returns {Array}
 */
function getActiveItems() {
  checkAndUpdateExpiredItems();
  return getItems().filter(i => i.status === 'ativo');
}

/**
 * Cancel an item listing
 * @param {string} itemId
 * @param {string} userId
 * @returns {object} { success, message? }
 */
function cancelItem(itemId, userId) {
  const item = getById(STORAGE_KEYS.ITEMS, itemId);

  if (!item) {
    return { success: false, message: 'Item não encontrado.' };
  }

  if (item.userId !== userId) {
    return { success: false, message: 'Sem permissão para cancelar este item.' };
  }

  if (item.status !== 'ativo' && item.status !== 'expirado') {
    return { success: false, message: 'Este item não pode ser cancelado.' };
  }

  updateRecord(STORAGE_KEYS.ITEMS, itemId, { status: 'cancelado' });
  return { success: true };
}

/**
 * Finalize an item by accepting a bid
 * @param {string} itemId
 * @param {string} bidId
 * @param {string} userId
 * @returns {object} { success, message? }
 */
function finalizeItem(itemId, bidId, userId) {
  const item = getById(STORAGE_KEYS.ITEMS, itemId);

  if (!item) {
    return { success: false, message: 'Item não encontrado.' };
  }

  if (item.userId !== userId) {
    return { success: false, message: 'Sem permissão para finalizar este item.' };
  }

  if (item.status !== 'ativo' && item.status !== 'expirado') {
    return { success: false, message: 'Este item não pode ser finalizado.' };
  }

  updateRecord(STORAGE_KEYS.ITEMS, itemId, {
    status: 'finalizado',
    acceptedBidId: bidId,
  });

  return { success: true };
}
