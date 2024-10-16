document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('keyword-form');
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');

    form.addEventListener('submit', function(e) {
        const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
        if (checkedBoxes.length === 0) {
            e.preventDefault();
            alert('Please select at least one source (Google or YouTube)');
        }
    });
});