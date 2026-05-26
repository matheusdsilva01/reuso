/* ==========================================
   REUSO — Utility Functions
   ========================================== */

/**
 * Generate a unique ID with optional prefix
 * @param {string} prefix - e.g. 'usr', 'item', 'bid'
 * @returns {string}
 */
function generateId(prefix = 'id') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

/**
 * Format a number as Brazilian Real currency
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
  if (value === 0) return 'Grátis';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Format a date string to pt-BR format (dd/mm/yyyy)
 * @param {string} dateString
 * @returns {string}
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format a date string to a relative format
 * @param {string} dateString
 * @returns {string}
 */
function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 0) return 'hoje';
    if (absDays === 1) return 'ontem';
    if (absDays < 30) return `há ${absDays} dias`;
    return formatDate(dateString);
  }

  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return 'amanhã';
  if (diffDays < 30) return `em ${diffDays} dias`;
  return formatDate(dateString);
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate CPF format (XXX.XXX.XXX-XX)
 * @param {string} cpf
 * @returns {boolean}
 */
function validateCPF(cpf) {
  if (!cpf) return true; // optional
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11;
}

/**
 * Validate CNPJ format (XX.XXX.XXX/XXXX-XX)
 * @param {string} cnpj
 * @returns {boolean}
 */
function validateCNPJ(cnpj) {
  if (!cnpj) return false;
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.length === 14;
}

/**
 * Format phone number with mask
 * @param {string} phone
 * @returns {string}
 */
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
  }
  return phone;
}

/**
 * Apply phone mask to input value
 * @param {string} value
 * @returns {string}
 */
function maskPhone(value) {
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 11) cleaned = cleaned.substring(0, 11);

  if (cleaned.length > 7) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  } else if (cleaned.length > 2) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2)}`;
  } else if (cleaned.length > 0) {
    return `(${cleaned}`;
  }
  return '';
}

/**
 * Apply CPF mask to input value
 * @param {string} value
 * @returns {string}
 */
function maskCPF(value) {
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 11) cleaned = cleaned.substring(0, 11);

  if (cleaned.length > 9) {
    return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
  } else if (cleaned.length > 6) {
    return `${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6)}`;
  } else if (cleaned.length > 3) {
    return `${cleaned.substring(0, 3)}.${cleaned.substring(3)}`;
  }
  return cleaned;
}

/**
 * Apply CNPJ mask to input value
 * @param {string} value
 * @returns {string}
 */
function maskCNPJ(value) {
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 14) cleaned = cleaned.substring(0, 14);

  if (cleaned.length > 12) {
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/${cleaned.substring(8, 12)}-${cleaned.substring(12)}`;
  } else if (cleaned.length > 8) {
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/${cleaned.substring(8)}`;
  } else if (cleaned.length > 5) {
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5)}`;
  } else if (cleaned.length > 2) {
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2)}`;
  }
  return cleaned;
}

/**
 * Get CSS class for item status badge
 * @param {string} status
 * @returns {string}
 */
function getStatusBadgeClass(status) {
  const map = {
    ativo: 'badge-ativo',
    finalizado: 'badge-finalizado',
    cancelado: 'badge-cancelado',
    expirado: 'badge-expirado',
  };
  return map[status] || 'bg-secondary';
}

/**
 * Get display label for item status
 * @param {string} status
 * @returns {string}
 */
function getStatusLabel(status) {
  const map = {
    ativo: 'Ativo',
    finalizado: 'Finalizado',
    cancelado: 'Cancelado',
    expirado: 'Expirado',
  };
  return map[status] || status;
}

/**
 * Get CSS class for bid type badge
 * @param {string} type
 * @returns {string}
 */
function getBidTypeBadgeClass(type) {
  const map = {
    pago: 'badge-pago',
    gratis: 'badge-gratis',
    cobro: 'badge-cobro',
  };
  return map[type] || 'bg-secondary';
}

/**
 * Get display label for bid type
 * @param {string} type
 * @returns {string}
 */
function getBidTypeLabel(type) {
  const map = {
    pago: 'Pago pelo item',
    gratis: 'Retiro grátis',
    cobro: 'Cobro para retirar',
  };
  return map[type] || type;
}

/**
 * Get emoji/icon for bid type
 * @param {string} type
 * @returns {string}
 */
function getBidTypeIcon(type) {
  const map = {
    pago: '🟢',
    gratis: '🟡',
    cobro: '🟠',
  };
  return map[type] || '⚪';
}

/**
 * Get display label for duration
 * @param {string} duration
 * @returns {string}
 */
function getDurationLabel(duration) {
  const map = {
    '24h': '24 horas',
    '1w': '1 semana',
    '15d': '15 dias',
    '1m': '1 mês',
  };
  return map[duration] || duration;
}

/**
 * Calculate expiration date based on creation date and duration
 * @param {string} createdAt - ISO date string
 * @param {string} duration - '24h', '1w', '15d', '1m'
 * @returns {string} ISO date string
 */
function calculateExpiresAt(createdAt, duration) {
  const date = new Date(createdAt);
  const msMap = {
    '24h': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '15d': 15 * 24 * 60 * 60 * 1000,
    '1m': 30 * 24 * 60 * 60 * 1000,
  };
  date.setTime(date.getTime() + (msMap[duration] || msMap['1m']));
  return date.toISOString();
}

/**
 * Check if a date is in the past
 * @param {string} dateString
 * @returns {boolean}
 */
function isExpired(dateString) {
  return new Date(dateString) < new Date();
}

/**
 * Get a category object by its id
 * @param {string} categoryId
 * @returns {object|undefined}
 */
function getCategoryById(categoryId) {
  return CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Get category label by its id
 * @param {string} categoryId
 * @returns {string}
 */
function getCategoryLabel(categoryId) {
  const cat = getCategoryById(categoryId);
  return cat ? cat.label : categoryId;
}

/**
 * Generate a placeholder image SVG as data URI
 * @param {string} text - text to display
 * @param {string} bgColor - background color
 * @returns {string} data URI
 */
function generatePlaceholderImage(text = 'Foto', bgColor = '#d1fae5') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect fill="${bgColor}" width="400" height="300"/>
    <text fill="#047857" font-family="Inter,sans-serif" font-size="18" font-weight="600" text-anchor="middle" x="200" y="155">${text}</text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}
