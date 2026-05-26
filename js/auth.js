/* ==========================================
   REUSO — Authentication Module
   Register, Login, Logout, Session
   ========================================== */

/**
 * Register a new user
 * @param {object} userData - User data object
 * @returns {object} {success: boolean, message: string, user?: object}
 */
function register(userData) {
  // Validate required fields
  const requiredFields = ['name', 'email', 'password', 'phone', 'city', 'state'];
  for (const field of requiredFields) {
    if (!userData[field] || userData[field].trim() === '') {
      const fieldLabels = {
        name: 'Nome',
        email: 'E-mail',
        password: 'Senha',
        phone: 'Telefone',
        city: 'Cidade',
        state: 'Estado',
      };
      return {
        success: false,
        message: `O campo "${fieldLabels[field] || field}" é obrigatório.`,
      };
    }
  }

  // Validate email format
  if (!validateEmail(userData.email)) {
    return {
      success: false,
      message: 'Formato de e-mail inválido.',
    };
  }

  // Validate PJ-specific required fields
  if (userData.type === 'pj') {
    if (!userData.cnpj || userData.cnpj.trim() === '') {
      return {
        success: false,
        message: 'O campo "CNPJ" é obrigatório para empresas.',
      };
    }
    if (!validateCNPJ(userData.cnpj)) {
      return {
        success: false,
        message: 'CNPJ inválido. Deve conter 14 dígitos.',
      };
    }
    if (!userData.companyName || userData.companyName.trim() === '') {
      return {
        success: false,
        message: 'O campo "Razão Social" é obrigatório para empresas.',
      };
    }
  }

  // Check email uniqueness
  const users = getCollection(STORAGE_KEYS.USERS);
  const emailExists = users.some(
    (u) => u.email.toLowerCase() === userData.email.toLowerCase()
  );
  if (emailExists) {
    return {
      success: false,
      message: 'Este e-mail já está cadastrado. Tente fazer login.',
    };
  }

  // Build user object
  const newUser = {
    type: userData.type || 'pf',
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password, // stored as-is for MVP
    phone: userData.phone.trim(),
    cpf: userData.cpf ? userData.cpf.trim() : '',
    cnpj: userData.cnpj ? userData.cnpj.trim() : '',
    companyName: userData.companyName ? userData.companyName.trim() : '',
    address: {
      cep: userData.cep ? userData.cep.trim() : '',
      city: userData.city.trim(),
      state: userData.state.trim(),
    },
    createdAt: new Date().toISOString(),
  };

  // Create record (generateId is handled inside createRecord)
  const createdUser = createRecord(STORAGE_KEYS.USERS, newUser);

  return {
    success: true,
    message: 'Conta criada com sucesso! Faça login para continuar.',
    user: createdUser,
  };
}

/**
 * Login a user with email and password
 * @param {string} email
 * @param {string} password
 * @returns {object} {success: boolean, message: string}
 */
function login(email, password) {
  if (!email || !password) {
    return {
      success: false,
      message: 'Preencha e-mail e senha.',
    };
  }

  const users = getCollection(STORAGE_KEYS.USERS);
  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!user) {
    return {
      success: false,
      message: 'E-mail não encontrado. Verifique ou crie uma conta.',
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      message: 'Senha incorreta. Tente novamente.',
    };
  }

  // Create session
  setSession({
    userId: user.id,
    loggedInAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: `Bem-vindo(a) de volta, ${user.name}!`,
  };
}

/**
 * Logout the current user and redirect to index
 */
function logout() {
  clearSession();
  window.location.href = 'index.html';
}

/**
 * Get the currently authenticated user object
 * @returns {object|null} Full user object or null
 */
function getCurrentUser() {
  const session = getSession();
  if (!session || !session.userId) return null;

  const user = getById(STORAGE_KEYS.USERS, session.userId);
  return user || null;
}

/**
 * Check if a user is currently authenticated
 * @returns {boolean}
 */
function isAuthenticated() {
  return !!getCurrentUser();
}

/**
 * Require authentication — redirect to login if not logged in
 * Call at the start of protected pages.
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/**
 * Update user profile fields
 * @param {string} userId - The user's ID
 * @param {object} updatedFields - Fields to update
 * @returns {object|null} Updated user or null
 */
function updateUserProfile(userId, updatedFields) {
  return updateRecord(STORAGE_KEYS.USERS, userId, updatedFields);
}
