// seo.js

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');
    const searchTermInput = document.querySelector('input[name="search_term"]');
    const radioButtons = document.querySelectorAll('input[name="increment_option"]');
    
    // Form submission validation
    form.addEventListener('submit', function(event) {
        const searchTerm = searchTermInput.value;
        let selectedOption = null;

        // Check if any radio button is selected
        radioButtons.forEach((radio) => {
            if (radio.checked) {
                selectedOption = radio.value;
            }
        });

        // Validate if '*' is present in the search term
        if (!searchTerm.includes('*')) {
            alert("Please include '*' in your search term.");
            event.preventDefault();  // Prevent form submission
        }

        // Validate if an increment option is selected
        if (!selectedOption) {
            alert("Please select an increment option.");
            event.preventDefault();  // Prevent form submission
        }
    });
});

function copyToClipboard(text) {
	navigator.clipboard.writeText(text);
	alert('Copied to clipboard!');
}
