document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('keyword-filter-form');
    const statsDiv = document.getElementById('stats');
    const matchesBox = document.getElementById('matches');
    const nonMatchesBox = document.getElementById('non_matches');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting the traditional way

        const formData = new FormData(form);

        // Send form data to the Flask route via AJAX
        fetch('/keywords/keyword_filter', {
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
                <p>Positive Match: ${data.match_count} lines match</p>
                <p>Negative Match: ${data.non_match_count} lines don't match</p>`;

            // Display the results in the text areas
            matchesBox.value = data.matches;
            nonMatchesBox.value = data.non_matches;
        })
        .catch(error => {
            console.error('Error:', error);
            statsDiv.innerHTML = `<p>Error occurred: ${error.message}</p>`;
        });
    });
});

// Function to copy text from a textarea to clipboard
function copyToClipboard(elementId) {
    const textarea = document.getElementById(elementId);
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices

    try {
        document.execCommand('copy');
        alert('Copied to clipboard');
    } catch (err) {
        alert('Failed to copy text');
    }
}
