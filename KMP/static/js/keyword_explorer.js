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
				// Clear the previous results
				$('.grouped-results-container').empty(); // Clear previous results
			
				if (response.suggestions.length > 0) {
					// Populate the suggested keywords
					response.suggestions.forEach(function(keyword) {
						const groupHtml = `
							<div class="keyword-group">
								<button class="copy-button" onclick="copyToClipboard('${keyword}')">
									<i class="fas fa-copy"></i> Copy
								</button>
								<strong>${keyword}</strong>
							</div>
						`;
						$('.grouped-results-container').append(groupHtml);
					});
					$('#suggestedKeywordCount').text(`${response.suggestions.length} keywords suggested`);
					$('.results-section').show(); // Show the results section
				} else {
					// Display a message when no keywords are found
					$('.grouped-results-container').append('<p>No keywords found.</p>');
				}
			}
			
            error: function() {
                // Hide the loader in case of error
                $('.loader').hide();
                alert('An error occurred while processing your request.');
            }
        });
    });
});
