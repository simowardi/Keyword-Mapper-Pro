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



// Handle the keyword grouping process
$(document).ready(function() {
    $('#keywordForm').on('submit', function(event) {
        event.preventDefault();

        $.ajax({
            url: "/keyword/keyword_grouper",
            type: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                // Clear previous results
                $('.grouped-results-container').empty();

                if (response.num_groups > 0) {
                    // Populate the grouped results
                    $.each(response.grouped_keywords, function(phrase, keywords) {
                        $('.grouped-results-container').append(
                            `<div class="keyword-group">
                                <strong>${phrase} (${keywords.length})</strong>
                                <ul>${keywords.map(kw => `<li>${kw}</li>`).join('')}</ul>
                            </div>`
                        );
                    });
                } else {
                    // Display a message when no groups are found
                    $('.grouped-results-container').append('<p>No groups found that meet the minimum length requirement.</p>');
                }

                // Update counts
                $('#matchCount').text(`${response.num_groups} groups found`);
                $('#keywordCount').text(`${response.num_keywords} keywords`);
            },
            error: function() {
                alert('An error occurred while processing your request.');
            }
        });
    });
});