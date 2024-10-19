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

