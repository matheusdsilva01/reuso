
    let accountType = 'pf';

    document.addEventListener('DOMContentLoaded', function() {
      initPage();

      // If already logged in, redirect
      if (isAuthenticated()) {
        window.location.href = 'index.html';
        return;
      }

      // Populate state dropdown
      const stateSelect = document.getElementById('reg-state');
      for (const [code, data] of Object.entries(STATES_CITIES)) {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = data.name;
        stateSelect.appendChild(opt);
      }

      // State change -> populate cities
      stateSelect.addEventListener('change', function() {
        const citySelect = document.getElementById('reg-city');
        citySelect.innerHTML = '<option value="">Selecione...</option>';
        const stateData = STATES_CITIES[this.value];
        if (stateData) {
          stateData.cities.forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            citySelect.appendChild(opt);
          });
        }
      });

      // Account type toggle
      document.getElementById('btn-pf').addEventListener('click', function() {
        accountType = 'pf';
        this.classList.add('active');
        document.getElementById('btn-pj').classList.remove('active');
        document.getElementById('pf-fields').style.display = 'block';
        document.getElementById('pj-fields').style.display = 'none';
      });

      document.getElementById('btn-pj').addEventListener('click', function() {
        accountType = 'pj';
        this.classList.add('active');
        document.getElementById('btn-pf').classList.remove('active');
        document.getElementById('pf-fields').style.display = 'none';
        document.getElementById('pj-fields').style.display = 'block';
      });

      // Phone mask
      document.getElementById('reg-phone').addEventListener('input', function() {
        this.value = maskPhone(this.value);
      });

      // CPF mask
      document.getElementById('reg-cpf').addEventListener('input', function() {
        this.value = maskCPF(this.value);
      });

      // CNPJ mask
      document.getElementById('reg-cnpj').addEventListener('input', function() {
        this.value = maskCNPJ(this.value);
      });

      // Form submit
      document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const passwordConfirm = document.getElementById('reg-password-confirm').value;
        const phone = document.getElementById('reg-phone').value.trim();
        const cep = document.getElementById('reg-cep').value.trim();
        const state = document.getElementById('reg-state').value;
        const city = document.getElementById('reg-city').value;
        const cpf = document.getElementById('reg-cpf').value.trim();
        const cnpj = document.getElementById('reg-cnpj').value.trim();
        const companyName = document.getElementById('reg-company').value.trim();

        // Validate passwords match
        if (password !== passwordConfirm) {
          showAlert('alert-area', 'As senhas não coincidem.', 'danger');
          return;
        }

        if (password.length < 6) {
          showAlert('alert-area', 'A senha deve ter pelo menos 6 caracteres.', 'danger');
          return;
        }

        const userData = {
          type: accountType,
          name, email, password, phone, cep, state, city,
          cpf: accountType === 'pf' ? cpf : '',
          cnpj: accountType === 'pj' ? cnpj : '',
          companyName: accountType === 'pj' ? companyName : '',
        };

        const result = register(userData);
        if (result.success) {
          showAlert('alert-area', result.message, 'success', false);
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 1500);
        } else {
          showAlert('alert-area', result.message, 'danger');
        }
      });
    });
  