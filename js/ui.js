/* ==========================================
   REUSO — UI Components
   Navbar, Footer, Alerts, Loading, Init
   ========================================== */

/**
 * Render the dynamic navbar
 * @param {string} containerId - ID of the container element
 */
function renderNavbar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const session = getSession();
  let currentUser = null;
  if (session && session.userId) {
    currentUser = getById('reuso_users', session.userId);
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const isActive = (page) => currentPage === page ? 'active' : '';

  let navItems = '';
  let rightNav = '';

  if (currentUser) {
    navItems = `
      <li class="nav-item">
        <a class="nav-link ${isActive('index.html')}" href="index.html"><i class="bi bi-house"></i> Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${isActive('busca.html')}" href="busca.html"><i class="bi bi-search"></i> Buscar</a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${isActive('novo-item.html')}" href="novo-item.html"><i class="bi bi-plus-circle"></i> Novo Item</a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${isActive('dashboard.html')}" href="dashboard.html"><i class="bi bi-grid-1x2"></i> Dashboard</a>
      </li>
    `;
    rightNav = `
      <ul class="navbar-nav ms-auto">
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle"></i> ${truncateText(currentUser.name, 20)}
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="dashboard.html"><i class="bi bi-grid-1x2 me-2"></i>Dashboard</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#" onclick="logout(); return false;"><i class="bi bi-box-arrow-right me-2"></i>Sair</a></li>
          </ul>
        </li>
      </ul>
    `;
  } else {
    navItems = `
      <li class="nav-item">
        <a class="nav-link ${isActive('index.html')}" href="index.html"><i class="bi bi-house"></i> Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link ${isActive('busca.html')}" href="busca.html"><i class="bi bi-search"></i> Buscar</a>
      </li>
    `;
    rightNav = `
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link ${isActive('login.html')}" href="login.html"><i class="bi bi-box-arrow-in-right"></i> Entrar</a>
        </li>
        <li class="nav-item">
          <a class="btn btn-primary btn-sm ms-2" href="cadastro.html"><i class="bi bi-person-plus"></i> Cadastre-se</a>
        </li>
      </ul>
    `;
  }

  container.innerHTML = `
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container">
        <a class="navbar-brand" href="index.html">
          <i class="bi bi-recycle"></i> Reuso
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain" aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarMain">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            ${navItems}
          </ul>
          ${rightNav}
        </div>
      </div>
    </nav>
    <div style="height: 68px;"></div>
  `;
}

/**
 * Render the footer
 * @param {string} containerId - ID of the container element
 */
function renderFooter(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-3 mb-md-0">
            <div class="footer-brand mb-2">
              <i class="bi bi-recycle"></i> Reuso
            </div>
            <p class="mb-0" style="font-size: 0.9rem;">
              Dê um novo destino para o que você não usa mais. 
              Plataforma de reaproveitamento consciente.
            </p>
          </div>
          <div class="col-md-4 mb-3 mb-md-0">
            <h6>Links Rápidos</h6>
            <ul class="list-unstyled" style="font-size: 0.9rem;">
              <li class="mb-1"><a href="index.html">Home</a></li>
              <li class="mb-1"><a href="busca.html">Buscar Itens</a></li>
              <li class="mb-1"><a href="cadastro.html">Criar Conta</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h6>Sobre o Projeto</h6>
            <p style="font-size: 0.85rem;">
              MVP de demonstração. Dados armazenados localmente no navegador.
            </p>
            <button class="btn btn-outline-light btn-sm" onclick="handleResetData()">
              <i class="bi bi-arrow-clockwise me-1"></i> Resetar Dados
            </button>
          </div>
        </div>
        <div class="footer-bottom text-center">
          <span>© 2026 Reuso — Todos os direitos reservados</span>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Show a Bootstrap alert
 * @param {string} containerId - ID of the container for the alert
 * @param {string} message - Alert message
 * @param {string} type - 'success', 'danger', 'warning', 'info'
 * @param {boolean} autoDismiss - Auto-dismiss after 5 seconds
 */
function showAlert(containerId, message, type = 'info', autoDismiss = true) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const icons = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
  };

  const alertId = 'alert-' + Date.now();

  container.innerHTML = `
    <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show d-flex align-items-center animate-fade-in" role="alert">
      <i class="bi ${icons[type] || icons.info} me-2"></i>
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>
  `;

  if (autoDismiss) {
    setTimeout(() => {
      const alertEl = document.getElementById(alertId);
      if (alertEl) {
        alertEl.classList.remove('show');
        setTimeout(() => alertEl.remove(), 300);
      }
    }, 5000);
  }
}

/**
 * Hide/clear all alerts in a container
 * @param {string} containerId
 */
function hideAlert(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
}

/**
 * Show a loading spinner
 * @param {string} containerId
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-reuso-primary" role="status" style="color: var(--reuso-primary);">
        <span class="visually-hidden">Carregando...</span>
      </div>
      <p class="mt-2 text-muted">Carregando...</p>
    </div>
  `;
}

/**
 * Hide loading spinner
 * @param {string} containerId
 */
function hideLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
}

/**
 * Handle reset data button click
 */
function handleResetData() {
  if (confirm('Tem certeza que deseja resetar todos os dados? Isso irá restaurar os dados de demonstração originais.')) {
    resetData();
    window.location.href = 'index.html';
  }
}

/**
 * Initialize a page — call this in every page's DOMContentLoaded
 * Seeds data if first visit, renders navbar and footer
 */
function initPage() {
  // Seed data if first visit
  if (typeof seedData === 'function') {
    seedData();
  }

  // Check expired items
  if (typeof checkAndUpdateExpiredItems === 'function') {
    checkAndUpdateExpiredItems();
  }

  // Render navbar
  renderNavbar('navbar-container');

  // Render footer
  renderFooter('footer-container');
}
