/**
 * Copies the text from the textarea with the given ID to the clipboard.
 * @param {string} textareaId - The ID of the textarea from which to copy the text.
 */
function copyToClipboard(textareaId) {
    const textarea = document.getElementById(textareaId);
    textarea.select();
    document.execCommand('copy');

    // Flash effect
    const button = event.target;
    button.style.backgroundColor = 'green';

    // Reset the background color after half a second
    setTimeout(() => {
        button.style.backgroundColor = ''; // Reset to original
    }, 500); // Change to 500 milliseconds (half a second)
}


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


// handle the geting the keywords 
document.getElementById('mainkeywords').addEventListener('input', function() {
	var keywordCount = this.value.split('\n').filter(line => line.trim() !== '').length;
	document.getElementById('keywordCount').textContent = keywordCount + ' keywords';
});


// Handle the keyword exploration process

$(document).ready(function() {
    $('#suggestionsForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the navigation default form submission

        $.ajax({
            url: '{{ url_for("keyword.keyword_explorer") }}',
            type: 'POST',
            data: $(this).serialize(), // Serialize the form data
            success: function(response) {
                // Display the suggested keywords in the results section
                $('#filteredResults').val(response.suggestions.join('\n'));
                $('#suggestedKeywordCount').text(`${response.suggestions.length} keywords suggested`);
                $('.results-section').show(); // Show the results section
            },
            error: function() {
                alert('An error occurred while processing your request.'); // Error handling
            }
        });
    });
});