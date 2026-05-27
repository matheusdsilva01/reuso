
    let photos = []; // array of base64 strings

    document.addEventListener('DOMContentLoaded', function() {
      initPage();
      if (!requireAuth()) return;

      const currentUser = getCurrentUser();

      // Populate category dropdown
      const catSelect = document.getElementById('item-category');
      CATEGORIES.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.label;
        catSelect.appendChild(opt);
      });

      // Populate duration dropdown
      const durSelect = document.getElementById('item-duration');
      DURATIONS.forEach(dur => {
        const opt = document.createElement('option');
        opt.value = dur.id;
        opt.textContent = dur.label;
        durSelect.appendChild(opt);
      });

      // Populate state dropdown and pre-fill from user profile
      const stateSelect = document.getElementById('item-state');
      for (const [code, data] of Object.entries(STATES_CITIES)) {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = data.name;
        stateSelect.appendChild(opt);
      }

      // Pre-fill address from user
      if (currentUser && currentUser.address) {
        stateSelect.value = currentUser.address.state || '';
        if (stateSelect.value) {
          populateCities(stateSelect.value, currentUser.address.city);
        }
      }

      // State change -> populate cities
      stateSelect.addEventListener('change', function() {
        populateCities(this.value);
      });

      // Description char counter
      document.getElementById('item-description').addEventListener('input', function() {
        document.getElementById('desc-count').textContent = this.value.length;
      });

      // Photo upload
      document.getElementById('photo-upload-area').addEventListener('click', function() {
        document.getElementById('item-photos').click();
      });

      document.getElementById('item-photos').addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        if (photos.length + files.length > 5) {
          showAlert('alert-area', 'Máximo de 5 fotos. Remova alguma antes de adicionar mais.', 'warning');
          return;
        }

        files.forEach(file => {
          if (!file.type.startsWith('image/')) return;
          const reader = new FileReader();
          reader.onload = function(ev) {
            photos.push(ev.target.result);
            renderPhotoPreview();
          };
          reader.readAsDataURL(file);
        });

        // Reset input so same file can be selected again
        this.value = '';
      });

      // Form submit
      document.getElementById('new-item-form').addEventListener('submit', function(e) {
        e.preventDefault();

        if (photos.length === 0) {
          showAlert('alert-area', 'Adicione pelo menos 1 foto do item.', 'danger');
          return;
        }

        const itemData = {
          title: document.getElementById('item-title').value,
          category: document.getElementById('item-category').value,
          description: document.getElementById('item-description').value,
          volume: document.getElementById('item-volume').value,
          photos: photos,
          address: {
            state: document.getElementById('item-state').value,
            city: document.getElementById('item-city').value,
          },
          duration: document.getElementById('item-duration').value,
        };

        const result = createItem(itemData);
        if (result.success) {
          showAlert('alert-area', 'Item publicado com sucesso! Redirecionando...', 'success', false);
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 1500);
        } else {
          showAlert('alert-area', result.message, 'danger');
        }
      });
    });

    function populateCities(stateCode, preselect) {
      const citySelect = document.getElementById('item-city');
      citySelect.innerHTML = '<option value="">Selecione...</option>';
      const stateData = STATES_CITIES[stateCode];
      if (stateData) {
        stateData.cities.forEach(city => {
          const opt = document.createElement('option');
          opt.value = city;
          opt.textContent = city;
          citySelect.appendChild(opt);
        });
        if (preselect) citySelect.value = preselect;
      }
    }

    function renderPhotoPreview() {
      const container = document.getElementById('photo-preview');
      container.innerHTML = photos.map((src, index) => `
        <div class="photo-preview-item">
          <img src="${src}" alt="Foto ${index + 1}">
          <button type="button" class="photo-preview-remove" onclick="removePhoto(${index})" title="Remover">
            <i class="bi bi-x"></i>
          </button>
        </div>
      `).join('');
    }

    function removePhoto(index) {
      photos.splice(index, 1);
      renderPhotoPreview();
    }
  