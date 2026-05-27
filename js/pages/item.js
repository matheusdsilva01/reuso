
    let currentItem = null;

    document.addEventListener('DOMContentLoaded', function() {
      initPage();

      const params = new URLSearchParams(window.location.search);
      const itemId = params.get('id');

      if (!itemId) {
        renderNotFound();
        return;
      }

      currentItem = getItemById(itemId);
      if (!currentItem) {
        renderNotFound();
        return;
      }

      document.title = `${currentItem.title} — Reuso`;
      renderItemDetail(currentItem);
      setupProposalModal();
    });

    function renderNotFound() {
      document.getElementById('item-detail').innerHTML = `
        <div class="empty-state">
          <i class="bi bi-emoji-frown"></i>
          <h5>Item não encontrado</h5>
          <p>O item que você está procurando não existe ou foi removido.</p>
          <a href="busca.html" class="btn btn-primary"><i class="bi bi-search me-1"></i> Buscar Itens</a>
        </div>
      `;
    }

    function renderItemDetail(item) {
      const owner = getById(STORAGE_KEYS.USERS, item.userId);
      const bidCount = getBidCount(item.id);
      const catLabel = getCategoryLabel(item.category);
      const statusLabel = getStatusLabel(item.status);
      const statusClass = getStatusBadgeClass(item.status);

      const currentUser = getCurrentUser();
      const isOwner = currentUser && currentUser.id === item.userId;
      const hasBid = currentUser ? getUserBidForItem(currentUser.id, item.id) : null;

      // CTA section
      let ctaHtml = '';
      if (item.status !== 'ativo') {
        ctaHtml = `<div class="alert alert-secondary"><i class="bi bi-info-circle me-1"></i> Este item não está mais aceitando propostas. Status: <strong>${statusLabel}</strong></div>`;
      } else if (!currentUser) {
        ctaHtml = `
          <div class="card border-0 shadow-sm p-3 text-center">
            <p class="mb-2"><i class="bi bi-lock me-1"></i> Faça login para dar uma proposta</p>
            <a href="login.html" class="btn btn-primary"><i class="bi bi-box-arrow-in-right me-1"></i> Entrar</a>
          </div>`;
      } else if (isOwner) {
        ctaHtml = `<div class="alert alert-info"><i class="bi bi-info-circle me-1"></i> Este é o seu item. Gerencie-o no <a href="dashboard.html" class="fw-semibold">Dashboard</a>.</div>`;
      } else if (hasBid) {
        ctaHtml = `<div class="alert alert-success"><i class="bi bi-check-circle me-1"></i> Você já fez uma proposta neste item. Tipo: <strong>${getBidTypeLabel(hasBid.type)}</strong>${hasBid.type !== 'gratis' ? ' — ' + formatCurrency(hasBid.value) : ''}</div>`;
      } else {
        ctaHtml = `<button class="btn btn-primary btn-lg w-100" data-bs-toggle="modal" data-bs-target="#proposalModal"><i class="bi bi-chat-dots me-1"></i> Fazer Proposta</button>`;
      }

      const photoSrc = item.photos && item.photos.length > 0 ? item.photos[0] : generatePlaceholderImage(item.title, '#d1fae5');

      document.getElementById('item-detail').innerHTML = `
        <nav aria-label="breadcrumb" class="mb-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="index.html">Home</a></li>
            <li class="breadcrumb-item"><a href="busca.html">Buscar</a></li>
            <li class="breadcrumb-item active" aria-current="page">${truncateText(item.title, 30)}</li>
          </ol>
        </nav>

        <div class="row g-4">
          <div class="col-md-6">
            <img src="${photoSrc}" alt="${item.title}" class="item-detail-img w-100" id="main-photo">
            ${item.photos && item.photos.length > 1 ? `
              <div class="d-flex gap-2 mt-2 flex-wrap">
                ${item.photos.map((p, i) => `
                  <img src="${p}" alt="Foto ${i+1}" class="rounded" style="width:72px;height:72px;object-fit:cover;cursor:pointer;border:2px solid ${i===0 ? 'var(--reuso-primary)' : 'var(--reuso-border-light)'};" onclick="document.getElementById('main-photo').src='${p}'; this.parentElement.querySelectorAll('img').forEach(el=>el.style.borderColor='var(--reuso-border-light)'); this.style.borderColor='var(--reuso-primary)';">
                `).join('')}
              </div>
            ` : ''}
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-2 mb-2 flex-wrap">
              <span class="badge badge-category">${catLabel}</span>
              <span class="badge ${statusClass}">${statusLabel}</span>
              ${owner && owner.type === 'pj' ? '<span class="badge badge-pj">Empresa</span>' : '<span class="badge badge-pf">Pessoa Física</span>'}
            </div>
            <h1 class="item-detail-title">${item.title}</h1>
            <p class="item-detail-description">${item.description}</p>

            <ul class="item-detail-info">
              <li>
                <span class="info-label"><i class="bi bi-box-seam me-1"></i> Volume</span>
                <span class="info-value">${item.volume}</span>
              </li>
              <li>
                <span class="info-label"><i class="bi bi-geo-alt me-1"></i> Local</span>
                <span class="info-value">${item.address.city}/${item.address.state}</span>
              </li>
              <li>
                <span class="info-label"><i class="bi bi-calendar-plus me-1"></i> Publicado</span>
                <span class="info-value">${formatDate(item.createdAt)}</span>
              </li>
              <li>
                <span class="info-label"><i class="bi bi-calendar-x me-1"></i> Expira</span>
                <span class="info-value">${formatDate(item.expiresAt)}</span>
              </li>
              <li>
                <span class="info-label"><i class="bi bi-person me-1"></i> Anunciante</span>
                <span class="info-value">${owner ? owner.name : 'Desconhecido'}</span>
              </li>
              <li>
                <span class="info-label"><i class="bi bi-chat-dots me-1"></i> Propostas</span>
                <span class="info-value">${bidCount} proposta${bidCount !== 1 ? 's' : ''}</span>
              </li>
            </ul>

            <div class="mt-3">
              ${ctaHtml}
            </div>
          </div>
        </div>
      `;
    }

    function setupProposalModal() {
      const radios = document.querySelectorAll('input[name="bid-type"]');
      const valueGroup = document.getElementById('bid-value-group');

      radios.forEach(radio => {
        radio.addEventListener('change', function() {
          if (this.value === 'gratis') {
            valueGroup.style.display = 'none';
            document.getElementById('bid-value').value = '';
          } else {
            valueGroup.style.display = 'block';
          }
        });
      });

      document.getElementById('btn-submit-bid').addEventListener('click', function() {
        const selectedType = document.querySelector('input[name="bid-type"]:checked');
        if (!selectedType) {
          alert('Selecione o tipo de proposta.');
          return;
        }

        const bidData = {
          itemId: currentItem.id,
          type: selectedType.value,
          value: document.getElementById('bid-value').value,
        };

        const result = createBid(bidData);
        if (result.success) {
          const modal = bootstrap.Modal.getInstance(document.getElementById('proposalModal'));
          modal.hide();
          showAlert('alert-area', result.message, 'success');
          // Refresh the item detail to show updated state
          currentItem = getItemById(currentItem.id);
          renderItemDetail(currentItem);
        } else {
          alert(result.message);
        }
      });
    }
  