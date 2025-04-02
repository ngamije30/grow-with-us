document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Feature animation on scroll
    const features = document.querySelectorAll('.feature');

    // Animate features immediately if they're above the fold
    features.forEach(feature => {
        setTimeout(() => {
            feature.classList.add('animated');
        }, 300);
    });

    // Form validation
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let valid = true;

            // Get all required inputs
            const requiredInputs = form.querySelectorAll('[required]');

            requiredInputs.forEach(input => {
                // Remove any existing error messages
                const existingError = input.parentElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }

                // Remove error class
                input.classList.remove('error');

                // Check if field is empty
                if (!input.value.trim()) {
                    valid = false;
                    input.classList.add('error');

                    // Add error message
                    const errorMessage = document.createElement('span');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'This field is required';
                    input.parentElement.appendChild(errorMessage);
                }

                // Check email format if it's an email field
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        valid = false;
                        input.classList.add('error');

                        // Add error message
                        const errorMessage = document.createElement('span');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Please enter a valid email address';
                        input.parentElement.appendChild(errorMessage);
                    }
                }

                // Check password length if it's a password field
                if (input.type === 'password' && input.value.trim()) {
                    if (input.value.length < 8) {
                        valid = false;
                        input.classList.add('error');

                        // Add error message
                        const errorMessage = document.createElement('span');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Password must be at least 8 characters long';
                        input.parentElement.appendChild(errorMessage);
                    }
                }
            });

            // Check if passwords match if there's a confirm password field
            const password = form.querySelector('input[name="password"]');
            const confirmPassword = form.querySelector('input[name="confirm_password"]');

            if (password && confirmPassword && password.value && confirmPassword.value) {
                if (password.value !== confirmPassword.value) {
                    valid = false;
                    confirmPassword.classList.add('error');

                    // Add error message
                    const errorMessage = document.createElement('span');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = 'Passwords do not match';
                    confirmPassword.parentElement.appendChild(errorMessage);
                }
            }

            // Prevent form submission if not valid
            if (!valid) {
                e.preventDefault();
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (navToggle) {
                        navToggle.textContent = '☰';
                    }
                }
            }
        });
    });
});
