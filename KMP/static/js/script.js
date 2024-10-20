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



// Handle the keyword filtering process

document.addEventListener('DOMContentLoaded', function() {
    const kwListTextarea = document.getElementById('keys_to_be_matched');
    const positiveKwTextarea = document.getElementById('keys_to_match');
    const matchesBox = document.getElementById('filteredResults');
    const keywordCountDiv = document.getElementById('keywordCount');
    const matchCountDiv = document.getElementById('matchCount');

    // Update the keyword count whenever the keyword list changes
    kwListTextarea.addEventListener('input', function() {
        const keywords = kwListTextarea.value.split('\n').filter(kw => kw.trim() !== '');
        keywordCountDiv.textContent = `${keywords.length} keywords`;
    });

    // Handle the filtering process
    document.querySelector('.filter-btn').addEventListener('click', function() {
        const kwList = kwListTextarea.value.split('\n').filter(kw => kw.trim() !== '');
        const positiveKw = positiveKwTextarea.value.split('\n').filter(kw => kw.trim() !== '');

        const formData = new FormData();
        formData.append('keys_to_be_matched', kwList.join('\n'));
        formData.append('keys_to_match', positiveKw.join('\n'));

        // Send form data to the Flask route via AJAX
        fetch('/keyword/keyword_filter', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest' // Indicate AJAX request
            }
        })
        .then(response => response.json())
        .then(data => {
            // Update the stats and output sections with the results
            matchCountDiv.textContent = `${data.match_count} keywords match`;
            matchesBox.value = data.matches;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('stats').innerHTML = `<p>Error occurred: ${error.message}</p>`;
        });
    });
});





// Handle the keyword exploration process

document.getElementById('suggestionsForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    var formData = new FormData(this); // Gather form data

    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(html => {
        // Update the results section with the new content
        document.querySelector('.results-section').innerHTML = html;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


document.getElementById('mainkeywords').addEventListener('input', function() {
	var keywordCount = this.value.split('\n').filter(line => line.trim() !== '').length;
	document.getElementById('keywordCount').textContent = keywordCount + ' keywords';
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





// handle the keyword intent analyzer




