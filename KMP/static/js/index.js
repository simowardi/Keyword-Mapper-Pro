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


<script>
    setTimeout(() => {
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';
    }, 35000);

    document.getElementById('close').onclick = () => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    };

    document.getElementById('popupForm').onsubmit = (event) => {
        event.preventDefault(); // Prevent form submission for demonstration
        alert('Thank you for subscribing!');
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    };
</script>