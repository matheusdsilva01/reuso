/* ==========================================
   REUSO — Bid/Proposal Logic Module
   ========================================== */

/**
 * Create a new bid/proposal
 * @param {object} bidData - {itemId, type, value}
 * @returns {{success: boolean, message: string}}
 */
function createBid(bidData) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'Você precisa estar logado para fazer uma proposta.' };
  }

  if (!bidData.itemId) {
    return { success: false, message: 'Item não especificado.' };
  }

  const item = getById(STORAGE_KEYS.ITEMS, bidData.itemId);
  if (!item) {
    return { success: false, message: 'Item não encontrado.' };
  }

  if (item.status !== 'ativo') {
    return { success: false, message: 'Este item não está mais aceitando propostas.' };
  }

  if (item.userId === currentUser.id) {
    return { success: false, message: 'Você não pode fazer proposta no seu próprio item.' };
  }

  // Check 1 bid per user per item
  const existingBid = getUserBidForItem(currentUser.id, bidData.itemId);
  if (existingBid) {
    return { success: false, message: 'Você já fez uma proposta neste item.' };
  }

  if (!bidData.type || !['pago', 'gratis', 'cobro'].includes(bidData.type)) {
    return { success: false, message: 'Selecione o tipo de proposta.' };
  }

  let value = 0;
  if (bidData.type === 'gratis') {
    value = 0;
  } else {
    value = parseFloat(bidData.value);
    if (isNaN(value) || value <= 0) {
      return { success: false, message: 'Informe um valor válido maior que zero.' };
    }
  }

  const bid = {
    id: generateId('bid'),
    itemId: bidData.itemId,
    userId: currentUser.id,
    type: bidData.type,
    value: value,
    createdAt: new Date().toISOString(),
  };

  createRecord(STORAGE_KEYS.BIDS, bid);
  return { success: true, message: 'Proposta enviada com sucesso!' };
}

/**
 * Get all bids for an item
 * @param {string} itemId
 * @returns {Array}
 */
function getBidsByItem(itemId) {
  return getBids().filter(b => b.itemId === itemId);
}

/**
 * Get all bids made by a user
 * @param {string} userId
 * @returns {Array}
 */
function getBidsByUser(userId) {
  return getBids().filter(b => b.userId === userId);
}

/**
 * Get a user's bid for a specific item
 * @param {string} userId
 * @param {string} itemId
 * @returns {object|null}
 */
function getUserBidForItem(userId, itemId) {
  return getBids().find(b => b.userId === userId && b.itemId === itemId) || null;
}

/**
 * Get bid count for an item
 * @param {string} itemId
 * @returns {number}
 */
function getBidCount(itemId) {
  return getBidsByItem(itemId).length;
}
