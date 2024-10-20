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

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('suggestionsForm');
    const resultsSection = document.querySelector('.results-section');
    const filteredResults = document.getElementById('filteredResults');
    const suggestedKeywordCount = document.getElementById('suggestedKeywordCount');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            filteredResults.value = data.suggestions.join('\n');
            suggestedKeywordCount.textContent = `${data.suggestions.length} keywords suggested`;
            resultsSection.style.display = 'flex'; // Show results section
        })
        .catch(error => {
            console.error('Error:', error);
            resultsSection.style.display = 'none'; // Hide results section on error
        });
    });
});