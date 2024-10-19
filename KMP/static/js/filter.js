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


const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', function() {
  document.body.classList.toggle('dark-mode');
  this.innerHTML = document.body.classList.contains('dark-mode') ? '☀️ Day Mode' : '🌙 Night Mode';
});
