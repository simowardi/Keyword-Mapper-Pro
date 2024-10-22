document.querySelector('.logout').addEventListener('click', function() {
  if (confirm('Are you sure you want to logout?')) {
	// Perform logout action here
	alert('Logged out successfully');
  }
});


// Theme toggle between dark mode and light mode
const themeToggle = document.querySelector('.theme-toggle');
// Check localStorage for saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '☀️ Day Mode'; // Set button text for dark mode
}
// Add event listener for theme toggle
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    // Update localStorage based on the current theme
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        this.innerHTML = '☀️ Day Mode'; // Change button text
    } else {
        localStorage.setItem('theme', 'light');
        this.innerHTML = '🌙 Night Mode'; // Change button text
    }
});


// Sidebar toggle
document.querySelector('.sidebar-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('collapsed');
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

