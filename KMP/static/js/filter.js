document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('keyword-filter-form'); // Ensure you have a form element
    const statsDiv = document.getElementById('stats'); // This needs to exist in your HTML
    const matchesBox = document.getElementById('filteredResults'); // Matches output

    document.querySelector('.filter-btn').addEventListener('click', function() {
        const kwList = document.getElementById('keys_to_be_matched').value.split('\n');
        const positiveKw = document.getElementById('keys_to_match').value.split('\n');

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
            statsDiv.innerHTML = `<h3>Filter Results</h3>
                <p>Positive Match: ${data.match_count} lines match</p>`;

            // Display the results in the text area
            matchesBox.value = data.matches;
        })
        .catch(error => {
            console.error('Error:', error);
            statsDiv.innerHTML = `<p>Error occurred: ${error.message}</p>`;
        });
    });
});


// Function to copy text from a textarea to the clipboard
function copyToClipboard(textareaId) {
    const textarea = document.getElementById(textareaId);
    textarea.select();
    document.execCommand('copy');

    // Flash effect
    const button = event.target;
    button.style.backgroundColor = 'green';
    setTimeout(() => {
        button.style.backgroundColor = ''; // Reset to original
    }, 1000);
}


function toggleNightMode() {
	// Toggle night mode functionality
	document.body.classList.toggle('night-mode');
}

