document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('keyword-form');
    const resultsDiv = document.getElementById('results');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            keyword: formData.get('keyword'),
            country_code: formData.get('country_code'),
            sources: formData.getAll('sources')
        };

        fetch('/fetch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            updateResults(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    function updateResults(data) {
        let html = '';
        if (data.google) {
            html += '<div id="google-results"><h2>Google Suggestions</h2><ul>';
            data.google.forEach(suggestion => {
                html += `<li>${suggestion}</li>`;
            });
            html += '</ul></div>';
        }
        if (data.youtube) {
            html += '<div id="youtube-results"><h2>YouTube Suggestions</h2><ul>';
            data.youtube.forEach(suggestion => {
                html += `<li>${suggestion}</li>`;
            });
            html += '</ul></div>';
        }
        resultsDiv.innerHTML = html;
    }
});