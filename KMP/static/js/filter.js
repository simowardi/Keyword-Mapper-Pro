document.addEventListener('DOMContentLoaded', function() {
	var form = document.getElementById('keyword-filter-form');
	var keysToBeMatched = document.getElementById('keys_to_be_matched');
	var keysToBeMatchedCount = document.getElementById('keysToBeMatchedCount').querySelector('span');
	var matchResult = document.getElementById('matchResult');
	var dontMatchResult = document.getElementById('dontMatchResult');
	var matchCount = document.getElementById('matchCount');
	var nonMatchCount = document.getElementById('nonMatchCount');

	function updateKeywordCount() {
		var count = keysToBeMatched.value.split('\n').filter(function(line) {
			return line.trim() !== '';
		}).length;
		keysToBeMatchedCount.textContent = count;
	}

	keysToBeMatched.addEventListener('input', updateKeywordCount);
	updateKeywordCount();

	form.addEventListener('submit', function(e) {
		e.preventDefault();
		var formData = new FormData(form);
		
		fetch('/keyword_filter', {
			method: 'POST',
			body: formData
		})
		.then(response => response.json())
		.then(data => {
			matchResult.value = data.matches;
			dontMatchResult.value = data.non_matches;
			matchCount.textContent = data.match_count;
			nonMatchCount.textContent = data.non_match_count;
		})
		.catch(error => console.error('Error:', error));
	});
});