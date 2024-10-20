/**
 * Copies the text from the given string to the clipboard.
 * @param {string} text - The text to copy to the clipboard.
 */
function copyToClipboard(text) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea); // Remove the textarea

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



// Handle the keyword grouping process

$(document).ready(function() {
    $('#keywordForm').on('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        $.ajax({
            url: "/keyword/keyword_grouper", // The target URL for the AJAX request
            type: 'POST',
            data: $(this).serialize(), // Serialize the form data
            success: function(response) {
                // Clear previous results
                $('.grouped-results-container').empty();

                // Populate the grouped results
                $.each(response.grouped_keywords, function(phrase, keywords) {
                    $('.grouped-results-container').append(
                        `<div class="keyword-group">
                            <strong>${phrase} (${keywords.length})</strong>
                            <ul>${keywords.map(kw => `<li>${kw}</li>`).join('')}</ul>
                        </div>`
                    );
                });

                // Update counts
                $('#matchCount').text(`${response.num_groups} groups found`);
                $('#keywordCount').text(`${response.num_keywords} keywords`);
            },
            error: function() {
                alert('An error occurred while processing your request.'); // Error handling
            }
        });
    });
});
