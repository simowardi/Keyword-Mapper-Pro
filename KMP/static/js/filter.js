document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('keyword-filter-form');
    const statsDiv = document.getElementById('stats');
    const outputDiv = document.getElementById('output');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        // Send form data via AJAX to Flask route
        fetch('/keyword_filter', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Update the UI with the returned data
            statsDiv.innerHTML = `<h3>Filter Results</h3>
                <p>Positive Match: ${data.match_count} lines match</p>
                <p>Negative Match: ${data.non_match_count} lines don't match</p>`;
            outputDiv.innerHTML = `<h3>Matches</h3><pre>${data.matches}</pre>
                <h3>Non-Matches</h3><pre>${data.non_matches}</pre>`;
        })
        .catch(error => console.error('Error:', error));
    });
});
