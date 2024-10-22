// Handle logout button click event and confirmation
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



// Sidebar toggle for collapsed sidebar
document.addEventListener('DOMContentLoaded', function () {
	// Check if sidebar state is saved in localStorage
	const sidebar = document.querySelector('.sidebar');
	const isCollapsed = localStorage.getItem('sidebar-collapsed');
	// Apply the saved state on page load
	if (isCollapsed === 'true') {
	  sidebar.classList.add('collapsed');
	}
	// Add event listener to the toggle button
	document.querySelector('.sidebar-toggle').addEventListener('click', function() {
	  sidebar.classList.toggle('collapsed');
	  // Save the sidebar state in localStorage
	  const collapsed = sidebar.classList.contains('collapsed');
	  localStorage.setItem('sidebar-collapsed', collapsed);
	});
  });
 
// Toggle mobile menu visibility
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', function() {
    menu.classList.toggle('active'); // Toggle the active class to show/hide the menu
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

