document.querySelector('.logout').addEventListener('click', function() {
  if (confirm('Are you sure you want to logout?')) {
	// Perform logout action here
	alert('Logged out successfully');
  }
});

// Theme toggle between dark mode and light mode
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Day Mode' : '🌙 Night Mode';
});

// Scroll animations for sections and anchor links 
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll animations for sections
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });
});

