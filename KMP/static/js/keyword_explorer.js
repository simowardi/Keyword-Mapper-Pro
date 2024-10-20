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
        event.preventDefault(); // Prevent default form submission

        // Show the loader (if there is one in the HTML)
        $('.loader').show();

        $.ajax({
            url: '/keyword/keyword_explorer',  // Ensure the route is correct
            type: 'POST',
            data: $(this).serialize(), // Serialize form data
            success: function(response) {
                // Hide the loader
                $('.loader').hide();

                // Clear the previous results
                $('#resultKeywords').val(''); 

                // Extract the suggestions from the JSON response
                let suggestions = response.suggestions || [];

                // Check if there are any suggestions and display them
                if (suggestions.length > 0) {
                    // Append each suggested keyword to the textarea
                    suggestions.forEach(function(keyword) {
                        $('#resultKeywords').val(function(i, text) {
                            return text + keyword + "\n"; // Append each keyword on a new line
                        });
                    });

                    // Update the keyword count
                    $('#suggestedKeywordCount').text(`${suggestions.length} keywords suggested`);
                } else {
                    $('#resultKeywords').val('No suggestions found.');
                    $('#suggestedKeywordCount').text('0 keywords suggested');
                }
            },
			success: function(response) {
				console.log(response); // Log the response to ensure it's JSON
				// Rest of the success function...
			}
			
            error: function() {
                // Hide the loader in case of error
                $('.loader').hide();
                alert('An error occurred while processing your request.');
            }
        });
    });
});
