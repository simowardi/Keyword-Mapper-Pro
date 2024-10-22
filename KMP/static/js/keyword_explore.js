/**
 * Copies the text from the textarea with the given ID to the clipboard.
 * @param {string} textareaId - The ID of the textarea from which to copy the text.
 */
function copyToClipboard(textareaId) {
    const textarea = document.getElementById(textareaId);
    textarea.select();
    document.execCommand('copy');

    // Flash effect for the button
    const button = event.target;
    button.style.backgroundColor = 'green';

    // Reset the background color after half a second
    setTimeout(() => {
        button.style.backgroundColor = ''; // Reset to original
    }, 500); // Change to 500 milliseconds (half a second)
}



// Count keywords based on input
document.getElementById('mainkeywords').addEventListener('input', function() {
    var keywordCount = this.value.split('\n').filter(line => line.trim() !== '').length;
    document.getElementById('keywordCount').textContent = keywordCount + ' keywords';
});


// handle textarea clear
$(document).ready(function() {
    // Handle clear textarea button click
    $('#clearButton').on('click', function() {
        $('#resultKeywords').val(''); // Clear the textarea
        $('#suggestedKeywordCount').text('0 keywords suggested'); // Reset the count
    });
});


// Handle the keyword exploration process
// Handle the keyword exploration process
$(document).ready(function() {
    let isStopped = false; // Flag to track if the process is stopped
    let index = 0; // Index for suggestions

    $('#suggestionsForm').on('submit', function(event) {
        // Prevent default form submission
        event.preventDefault();
        // Serialize form data
        var formData = $(this).serialize();

        // Clear previous results
        $('#resultKeywords').val('');
        $('#suggestedKeywordCount').text('0 keywords suggested');
        $('.results-section').show();

        $.ajax({
            url: "/keyword/keyword_explorer",
            type: "POST",
            data: formData,
            success: function(response) {
                if (response.suggestions && response.suggestions.length > 0) {
                    let suggestions = response.suggestions;
                    index = 0; // Reset index
                    isStopped = false; // Reset stop flag

                    function displayNextSuggestion() {
                        if (index < suggestions.length && !isStopped) {
                            // Append the next suggestion
                            var currentText = $('#resultKeywords').val();
                            $('#resultKeywords').val(currentText + suggestions[index] + '\n');
                            $('#suggestedKeywordCount').text((index + 1) + ' keywords suggested');
                            index++;

                            // Call this function again after 250ms
                            setTimeout(displayNextSuggestion, 250);
                        }
                    }

                    displayNextSuggestion(); // Start displaying suggestions
                } else {
                    $('#resultKeywords').val('No keywords found.');
                    $('#suggestedKeywordCount').text('0 keywords suggested');
                }
            },
            error: function(error) {
                console.log("Error:", error);
            }
        });
    });

    // Handle stop button click
    $('#stopButton').on('click', function() {
        isStopped = true; // Set the stop flag to true
    });
});