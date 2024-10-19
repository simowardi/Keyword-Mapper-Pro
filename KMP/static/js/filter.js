document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('keyword-filter-form');
    const statsDiv = document.getElementById('stats');
    const matchesBox = document.getElementById('filteredResults'); // Matches output

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting the traditional way

        const formData = new FormData(form);

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

            // Display the results in the text areas
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

