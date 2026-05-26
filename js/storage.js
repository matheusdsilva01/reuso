/* ==========================================
   REUSO — Storage Layer
   CRUD abstraction over localStorage
   ========================================== */

const STORAGE_KEYS = {
  USERS: 'reuso_users',
  ITEMS: 'reuso_items',
  BIDS: 'reuso_bids',
  SESSION: 'reuso_session',
  SEEDED: 'reuso_seeded',
};

/* --- Generic CRUD --- */

/**
 * Get a collection (array) from localStorage
 * @param {string} key
 * @returns {Array}
 */
function getCollection(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return [];
  }
}

/**
 * Save a collection (array) to localStorage
 * @param {string} key
 * @param {Array} data
 */
function setCollection(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
  }
}

/**
 * Get a single item by ID from a collection
 * @param {string} key - collection key
 * @param {string} id - item ID
 * @returns {object|null}
 */
function getById(key, id) {
  const collection = getCollection(key);
  return collection.find(item => item.id === id) || null;
}

/**
 * Create (add) an item to a collection
 * @param {string} key - collection key
 * @param {object} item - the item to add
 * @returns {object} the created item
 */
function createRecord(key, item) {
  const collection = getCollection(key);
  if (!item.id) {
    const prefix = key.replace('reuso_', '').replace(/s$/, '');
    item.id = generateId(prefix);
  }
  collection.push(item);
  setCollection(key, collection);
  return item;
}

/**
 * Update fields of an item in a collection
 * @param {string} key - collection key
 * @param {string} id - item ID
 * @param {object} updatedFields - fields to update
 * @returns {object|null} updated item or null
 */
function updateRecord(key, id, updatedFields) {
  const collection = getCollection(key);
  const index = collection.findIndex(item => item.id === id);
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...updatedFields };
  setCollection(key, collection);
  return collection[index];
}

/**
 * Remove an item from a collection
 * @param {string} key - collection key
 * @param {string} id - item ID
 * @returns {boolean}
 */
function removeRecord(key, id) {
  const collection = getCollection(key);
  const filtered = collection.filter(item => item.id !== id);
  if (filtered.length === collection.length) return false;
  setCollection(key, filtered);
  return true;
}

/* --- Typed Getters --- */

function getUsers() {
  return getCollection(STORAGE_KEYS.USERS);
}

function getItems() {
  return getCollection(STORAGE_KEYS.ITEMS);
}

function getBids() {
  return getCollection(STORAGE_KEYS.BIDS);
}

/* --- Session Management --- */

function getSession() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function setSession(data) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

/* --- Seed & Reset --- */

/**
 * Check if data has been seeded
 * @returns {boolean}
 */
function isSeeded() {
  return localStorage.getItem(STORAGE_KEYS.SEEDED) === 'true';
}

/**
 * Reset all data — clear everything and re-seed
 */
function resetData() {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.ITEMS);
  localStorage.removeItem(STORAGE_KEYS.BIDS);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  localStorage.removeItem(STORAGE_KEYS.SEEDED);

  if (typeof seedData === 'function') {
    seedData();
  }
}

/* --- Expiration Check --- */

/**
 * Check and update expired items (lazy check)
 * Scans all active items and updates status if expired
 */
function checkAndUpdateExpiredItems() {
  const items = getItems();
  let updated = false;

  items.forEach((item, index) => {
    if (item.status === 'ativo' && isExpired(item.expiresAt)) {
      items[index].status = 'expirado';
      updated = true;
    }
  });

  if (updated) {
    setCollection(STORAGE_KEYS.ITEMS, items);
  }
}
