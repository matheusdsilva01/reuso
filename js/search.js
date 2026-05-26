/* ==========================================
   REUSO — Search & Filter Logic
   Filtering, rendering item cards, empty states
   ========================================== */

/**
 * Filter items by multiple criteria
 * @param {object} filters - { text, category, state, city }
 * @returns {Array} filtered items (only 'ativo' status)
 */
function filterItems(filters) {
  let items = getCollection(STORAGE_KEYS.ITEMS);

  // Only show active items
  items = items.filter(function (item) {
    return item.status === 'ativo';
  });

  // Text search
  if (filters.text && filters.text.trim() !== '') {
    items = items.filter(function (item) {
      return matchesTextSearch(item, filters.text.trim());
    });
  }

  // Category filter
  if (filters.category && filters.category !== '') {
    items = items.filter(function (item) {
      return item.category === filters.category;
    });
  }

  // State filter
  if (filters.state && filters.state !== '') {
    items = items.filter(function (item) {
      return item.address && item.address.state === filters.state;
    });
  }

  // City filter
  if (filters.city && filters.city !== '') {
    items = items.filter(function (item) {
      return item.address && item.address.city === filters.city;
    });
  }

  return items;
}

/**
 * Check if item matches text search (case-insensitive, accent-insensitive)
 * @param {object} item
 * @param {string} text
 * @returns {boolean}
 */
function matchesTextSearch(item, text) {
  var normalizedText = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  var titleNormalized = (item.title || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  var descriptionNormalized = (item.description || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return (
    titleNormalized.indexOf(normalizedText) !== -1 ||
    descriptionNormalized.indexOf(normalizedText) !== -1
  );
}

/**
 * Get unique sorted states from items array
 * @param {Array} items
 * @returns {Array<string>}
 */
function getUniqueStates(items) {
  var states = [];
  items.forEach(function (item) {
    if (item.address && item.address.state && states.indexOf(item.address.state) === -1) {
      states.push(item.address.state);
    }
  });
  return states.sort();
}

/**
 * Get unique sorted cities for a given state from items array
 * @param {Array} items
 * @param {string} state
 * @returns {Array<string>}
 */
function getCitiesByState(items, state) {
  var cities = [];
  items.forEach(function (item) {
    if (
      item.address &&
      item.address.state === state &&
      item.address.city &&
      cities.indexOf(item.address.city) === -1
    ) {
      cities.push(item.address.city);
    }
  });
  return cities.sort();
}

/**
 * Count bids for a specific item
 * @param {string} itemId
 * @returns {number}
 */
function getBidCountForItem(itemId) {
  var bids = getCollection(STORAGE_KEYS.BIDS);
  return bids.filter(function (bid) {
    return bid.itemId === itemId;
  }).length;
}

/**
 * Render an item card HTML string
 * @param {object} item
 * @returns {string} HTML string
 */
function renderItemCard(item) {
  var photo =
    item.photos && item.photos.length > 0
      ? item.photos[0]
      : generatePlaceholderImage(truncateText(item.title, 20));

  var categoryLabel = getCategoryLabel(item.category);
  var cityState =
    item.address ? item.address.city + '/' + item.address.state : '—';
  var expiryText = formatDate(item.expiresAt);
  var bidCount = getBidCountForItem(item.id);
  var titleTruncated = truncateText(item.title, 40);

  return (
    '<a href="item.html?id=' + item.id + '" class="text-decoration-none">' +
      '<div class="card item-card h-100">' +
        '<img src="' + photo + '" class="card-img-top" alt="' + (item.title || 'Item').replace(/"/g, '&quot;') + '">' +
        '<div class="card-body">' +
          '<h5 class="card-title" title="' + (item.title || '').replace(/"/g, '&quot;') + '">' + titleTruncated + '</h5>' +
          '<span class="badge badge-category mb-2">' + categoryLabel + '</span>' +
          '<div class="item-meta">' +
            '<span class="item-location"><i class="bi bi-geo-alt"></i> ' + cityState + '</span>' +
            '<span class="item-expiry"><i class="bi bi-calendar"></i> ' + expiryText + '</span>' +
            '<span><i class="bi bi-chat-dots"></i> ' + bidCount + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</a>'
  );
}

/**
 * Render a grid of item cards into a container
 * @param {string} containerId
 * @param {Array} items
 */
function renderItemGrid(containerId, items) {
  var container = document.getElementById(containerId);
  if (!container) return;

  if (!items || items.length === 0) {
    renderEmptyState(containerId);
    return;
  }

  var html = '<div class="row g-4">';
  items.forEach(function (item) {
    html += '<div class="col-md-6 col-lg-4">' + renderItemCard(item) + '</div>';
  });
  html += '</div>';

  container.innerHTML = html;
}

/**
 * Render an empty state message in a container
 * @param {string} containerId
 */
function renderEmptyState(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML =
    '<div class="empty-state">' +
      '<i class="bi bi-search d-block"></i>' +
      '<h5>Nenhum item encontrado</h5>' +
      '<p>Tente ajustar os filtros ou termos de busca para encontrar o que procura.</p>' +
      '<a href="busca.html" class="btn btn-outline-primary btn-sm">Limpar Filtros</a>' +
    '</div>';
}
