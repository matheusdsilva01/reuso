
    document.addEventListener('DOMContentLoaded', function () {
      // Initialize page (seed data, navbar, footer)
      initPage();

      // Populate dropdowns
      populateCategoryDropdown();
      populateStateDropdown();

      // Read URL params and apply initial filters
      applyUrlParams();

      // Attach events
      attachSearchEvents();

      // Initial search
      executeSearch();
    });

    /**
     * Populate the category dropdown from CATEGORIES constant
     */
    function populateCategoryDropdown() {
      var select = document.getElementById('filter-category');
      if (!select) return;

      CATEGORIES.forEach(function (cat) {
        var option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.label;
        select.appendChild(option);
      });
    }

    /**
     * Populate the state dropdown from STATES_CITIES constant
     */
    function populateStateDropdown() {
      var select = document.getElementById('filter-state');
      if (!select) return;

      var stateKeys = Object.keys(STATES_CITIES).sort();
      stateKeys.forEach(function (stateCode) {
        var option = document.createElement('option');
        option.value = stateCode;
        option.textContent = STATES_CITIES[stateCode].name + ' (' + stateCode + ')';
        select.appendChild(option);
      });
    }

    /**
     * Populate the city dropdown based on selected state
     */
    function populateCityDropdown(stateCode) {
      var select = document.getElementById('filter-city');
      if (!select) return;

      // Reset
      select.innerHTML = '<option value="">Todas</option>';

      if (!stateCode || !STATES_CITIES[stateCode]) {
        select.disabled = true;
        return;
      }

      select.disabled = false;
      var cities = STATES_CITIES[stateCode].cities;
      cities.forEach(function (city) {
        var option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        select.appendChild(option);
      });
    }

    /**
     * Read URL parameters and apply to filter fields
     */
    function applyUrlParams() {
      var params = new URLSearchParams(window.location.search);

      var categoria = params.get('categoria');
      var estado = params.get('estado');
      var texto = params.get('texto');
      var cidade = params.get('cidade');

      if (categoria) {
        document.getElementById('filter-category').value = categoria;
      }

      if (estado) {
        document.getElementById('filter-state').value = estado;
        populateCityDropdown(estado);
        if (cidade) {
          document.getElementById('filter-city').value = cidade;
        }
      }

      if (texto) {
        document.getElementById('search-text').value = texto;
      }
    }

    /**
     * Attach event listeners for search interactions
     */
    function attachSearchEvents() {
      // Search button
      document.getElementById('btn-buscar').addEventListener('click', executeSearch);

      // Clear button
      document.getElementById('btn-limpar').addEventListener('click', clearFilters);

      // Enter key on text field
      document.getElementById('search-text').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeSearch();
        }
      });

      // State change → populate cities
      document.getElementById('filter-state').addEventListener('change', function () {
        var stateCode = this.value;
        populateCityDropdown(stateCode);
      });
    }

    /**
     * Execute the search with current filter values
     */
    function executeSearch() {
      var filters = {
        text: document.getElementById('search-text').value,
        category: document.getElementById('filter-category').value,
        state: document.getElementById('filter-state').value,
        city: document.getElementById('filter-city').value,
      };

      var results = filterItems(filters);

      // Update results count
      var countEl = document.getElementById('results-count');
      if (countEl) {
        if (results.length === 0) {
          countEl.textContent = 'Nenhum item encontrado';
        } else if (results.length === 1) {
          countEl.textContent = '1 item encontrado';
        } else {
          countEl.textContent = results.length + ' itens encontrados';
        }
      }

      // Render results
      renderItemGrid('results-grid', results);
    }

    /**
     * Clear all filters and re-render
     */
    function clearFilters() {
      document.getElementById('search-text').value = '';
      document.getElementById('filter-category').value = '';
      document.getElementById('filter-state').value = '';

      var citySelect = document.getElementById('filter-city');
      citySelect.innerHTML = '<option value="">Todas</option>';
      citySelect.disabled = true;

      // Remove URL params
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      executeSearch();
    }
  