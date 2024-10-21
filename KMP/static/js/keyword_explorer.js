/**
 * Copies the text from the textarea with the given ID to the clipboard.
 * @param {string} textareaId - The ID of the textarea from which to copy the text.
 */
function copyToClipboard(textareaId) {
    const textarea = document.getElementById(textareaId);
    textarea.select();
    document.execCommand('copy');

    // Flash effect for the button
    const button = event.target;
    button.style.backgroundColor = 'green';

    // Reset the background color after half a second
    setTimeout(() => {
        button.style.backgroundColor = ''; // Reset to original
    }, 500); // Change to 500 milliseconds (half a second)
}

// Logout confirmation
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


// Count keywords based on input
document.getElementById('mainkeywords').addEventListener('input', function() {
    var keywordCount = this.value.split('\n').filter(line => line.trim() !== '').length;
    document.getElementById('keywordCount').textContent = keywordCount + ' keywords';
});



// Handle the keyword exploration process
$(document).ready(function() {
    $('#suggestionsForm').on('submit', function(event) {
        // Prevent default form submission
        event.preventDefault();

        // Collect form data
        const formData = new FormData(this); // Automatically gather all form fields

        // Send form data to the Flask route via AJAX
        fetch('{{ url_for("keyword.keyword_explorer") }}', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest' // Indicate AJAX request
            }
        })
        .then(response => {
            // Check if the response is OK (status in the range 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse JSON from the response
        })
        .then(data => {
            // Clear previous results in the text area
            $('#resultKeywords').val('');

            if (data.suggestions.length > 0) {
                // Populate the text area with the generated keywords
                const keywords = data.suggestions.join('\n'); // Join keywords with new line
                $('#resultKeywords').val(keywords); // Set the value of the text area
                $('#suggestedKeywordCount').text(`${data.suggestions.length} keywords suggested`);
                $('.results-section').show(); // Show the results section
            } else {
                $('#resultKeywords').val('No keywords found.'); // Indicate no keywords found
                $('#suggestedKeywordCount').text('0 keywords suggested');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            $('#stats').html(`<p>Error occurred: ${error.message}</p>`);
        });
    });
});