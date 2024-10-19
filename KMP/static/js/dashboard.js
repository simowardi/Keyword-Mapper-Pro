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


/**
 * Confirms whether the user wants to delete their account and if so, 
 * submits a POST request to /delete_account
 * to trigger the deletion process.
 */
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

// Function to get CSRF token from cookies (if using Flask-WTF)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie string begins with the name we want
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

