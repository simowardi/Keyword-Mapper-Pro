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
    // Add the logic to delete the account here
    alert("Your account has been deleted."); // Placeholder alert
  }
}
