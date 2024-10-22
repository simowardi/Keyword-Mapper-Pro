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



// Handle the keyword filtering process
// Handle the keyword filtering process

$(document).ready(function() {
    const kwListTextarea = $('#keys_to_be_matched');
    const positiveKwTextarea = $('#keys_to_match');
    const matchesBox = $('#filteredResults');
    const keywordCountDiv = $('#keywordCount');
    const matchCountDiv = $('#matchCount');

    // Update the keyword count whenever the keyword list changes
    kwListTextarea.on('input', function() {
        const keywords = kwListTextarea.val().split('\n').filter(kw => kw.trim() !== '');
        keywordCountDiv.text(`${keywords.length} keywords`);
    });

    // Handle the filtering process
    $('.filter-btn').on('click', function() {
        const kwList = kwListTextarea.val().split('\n').filter(kw => kw.trim() !== '');
        const positiveKw = positiveKwTextarea.val().split('\n').filter(kw => kw.trim() !== '');

        const formData = {
            keys_to_be_matched: kwList.join('\n'),
            keys_to_match: positiveKw.join('\n')
        };

        // Send form data to the Flask route via AJAX
        $.ajax({
            url: '/keyword/keyword_filter',
            type: 'POST',
            data: formData,
            success: function(data) {
                // Update the stats and output sections with the results
                matchCountDiv.text(`${data.match_count} keywords match`);
                matchesBox.val(data.matches);
            },
            error: function(error) {
                console.error('Error:', error);
                $('#stats').html(`<p>Error occurred: ${error.message}</p>`);
            }
        });
    });
});