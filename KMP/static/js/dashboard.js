document.querySelector('.logout').addEventListener('click', function() {
  if (confirm('Are you sure you want to logout?')) {
	// Perform logout action here
	alert('Logged out successfully');
  }
});

const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Day Mode' : '🌙 Night Mode';
});


function confirmDelete() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        // If confirmed, submit the form or trigger the delete route
        fetch('/delete_account', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrf_token'), // Include CSRF token if you're using Flask-WTF
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Redirect to index.html
                window.location.href = '/index';
            } else {
                alert('Error deleting account. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    }
}

