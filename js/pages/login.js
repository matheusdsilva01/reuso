
    document.addEventListener('DOMContentLoaded', function () {
      initPage();

      // If already logged in, redirect to home
      if (isAuthenticated()) {
        window.location.href = 'index.html';
        return;
      }

      const form = document.getElementById('login-form');
      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');
      const togglePasswordBtn = document.getElementById('toggle-password');

      // Toggle password visibility
      togglePasswordBtn.addEventListener('click', function () {
        const icon = this.querySelector('i');
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          icon.classList.remove('bi-eye');
          icon.classList.add('bi-eye-slash');
        } else {
          passwordInput.type = 'password';
          icon.classList.remove('bi-eye-slash');
          icon.classList.add('bi-eye');
        }
      });

      // Form submission
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideAlert('alert-area');

        // Reset validation states
        emailInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Client-side validation
        let hasError = false;

        if (!email) {
          emailInput.classList.add('is-invalid');
          hasError = true;
        }

        if (!password) {
          passwordInput.classList.add('is-invalid');
          hasError = true;
        }

        if (hasError) {
          showAlert('alert-area', 'Preencha todos os campos.', 'warning');
          return;
        }

        if (!validateEmail(email)) {
          emailInput.classList.add('is-invalid');
          showAlert('alert-area', 'Formato de e-mail inválido.', 'warning');
          return;
        }

        // Attempt login
        const result = login(email, password);

        if (result.success) {
          showAlert('alert-area', result.message, 'success', false);

          // Disable form while redirecting
          const submitBtn = document.getElementById('login-submit-btn');
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Entrando...';

          setTimeout(function () {
            window.location.href = 'index.html';
          }, 1000);
        } else {
          showAlert('alert-area', result.message, 'danger');
        }
      });

      // Remove invalid state on input
      emailInput.addEventListener('input', function () {
        this.classList.remove('is-invalid');
      });

      passwordInput.addEventListener('input', function () {
        this.classList.remove('is-invalid');
      });
    });
  