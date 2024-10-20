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


document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('night-mode');
    
    // Update button text based on the mode
    if (document.body.classList.contains('night-mode')) {
        this.textContent = '🌞 Day Mode'; // Change to Day Mode
    } else {
        this.textContent = '🌓 Night Mode'; // Change to Night Mode
    }
});