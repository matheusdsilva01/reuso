
    document.addEventListener('DOMContentLoaded', function () {
      // Initialize page (seed data, navbar, footer)
      initPage();

      // ---- Render Categories Grid ----
      renderCategoriesGrid();

      // ---- Render Featured Items ----
      renderFeaturedItems();
    });

    /**
     * Render the categories grid from CATEGORIES constant
     */
    function renderCategoriesGrid() {
      var grid = document.getElementById('categories-grid');
      if (!grid) return;

      var html = '';
      CATEGORIES.forEach(function (cat) {
        html +=
          '<div class="col-6 col-sm-4 col-md-3 col-lg-2">' +
            '<a href="busca.html?categoria=' + cat.id + '" class="category-card" id="category-' + cat.id + '">' +
              '<i class="bi ' + cat.icon + '"></i>' +
              '<span>' + cat.label + '</span>' +
            '</a>' +
          '</div>';
      });

      grid.innerHTML = html;
    }

    /**
     * Render the featured items section (first 6 active items)
     */
    function renderFeaturedItems() {
      var container = document.getElementById('featured-items');
      if (!container) return;

      // Get all active items
      var allItems = getCollection(STORAGE_KEYS.ITEMS);
      var activeItems = allItems.filter(function (item) {
        return item.status === 'ativo';
      });

      // Take the first 6
      var featured = activeItems.slice(0, 6);

      if (featured.length === 0) {
        container.innerHTML =
          '<div class="col-12">' +
            '<div class="empty-state">' +
              '<i class="bi bi-inbox d-block"></i>' +
              '<h5>Nenhum item disponível</h5>' +
              '<p>Seja o primeiro a cadastrar um item na plataforma!</p>' +
              '<a href="novo-item.html" class="btn btn-primary">Cadastrar Item</a>' +
            '</div>' +
          '</div>';
        return;
      }

      var html = '';
      featured.forEach(function (item) {
        html += '<div class="col-md-6 col-lg-4">' + renderItemCard(item) + '</div>';
      });

      container.innerHTML = html;
    }
  