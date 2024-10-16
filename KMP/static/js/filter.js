function filterText() {
	const inputText = document.getElementById('inputText').value;
	const keywords = document.getElementById('keywords').value.split('\n').filter(k => k.trim() !== '');
	const positiveKeywords = document.getElementById('positiveKeywords').value.split('\n').filter(k => k.trim() !== '');
	const negativeKeywords = document.getElementById('negativeKeywords').value.split('\n').filter(k => k.trim() !== '');
	const caseSensitive = document.getElementById('caseSensitive').checked;
	const wholeWord = document.getElementById('wholeWord').checked;
	const highlightOnly = document.getElementById('highlightOnly').checked;
	const extractContext = document.getElementById('extractContext').checked;
	const filterMode = document.getElementById('filterMode').value;
	const contextSize = parseInt(document.getElementById('contextSize').value);
	const regexMode = document.getElementById('regexMode').checked;
	const outputFormat = document.getElementById('outputFormat').value;
  
	let filteredText = '';
	let positiveMatches = 0;
	let negativeMatches = 0;
	let context = [];
  
	const createRegex = (keyword) => {
	  if (regexMode) {
		return new RegExp(keyword, caseSensitive ? 'g' : 'gi');
	  } else {
		let flags = caseSensitive ? 'g' : 'gi';
		return new RegExp(wholeWord ? `\\b${keyword}\\b` : keyword, flags);
	  }
	};
  
	const lines = inputText.split('\n');
  
	lines.forEach(line => {
	  let lineMatchesKeyword = keywords.some(keyword => createRegex(keyword).test(line));
	  let lineMatchesPositive = positiveKeywords.some(keyword => createRegex(keyword).test(line));
	  let lineMatchesNegative = negativeKeywords.some(keyword => createRegex(keyword).test(line));
	  
	  let includeLine = false;
  
	  switch (filterMode) {
		case 'includeAll':
		  includeLine = lineMatchesKeyword && lineMatchesPositive && !lineMatchesNegative;
		  break;
		case 'excludeAll':
		  includeLine = !(lineMatchesKeyword || lineMatchesNegative) || lineMatchesPositive;
		  break;
		case 'includeAny':
		  includeLine = (lineMatchesKeyword || lineMatchesPositive) && !lineMatchesNegative;
		  break;
		case 'excludeAny':
		  includeLine = !lineMatchesKeyword && !lineMatchesNegative;
		  break;
	  }
  
	  if (includeLine || highlightOnly) {
		if (highlightOnly) {
		  [...keywords, ...positiveKeywords].forEach(keyword => {
			const regex = createRegex(keyword);
			line = line.replace(regex, match => `<mark style="background-color: #90EE90;">${match}</mark>`);
		  });
		  negativeKeywords.forEach(keyword => {
			const regex = createRegex(keyword);
			line = line.replace(regex, match => `<mark style="background-color: #FF6961;">${match}</mark>`);
		  });
		}
		filteredText += line + '\n';
	  }
  
	  if (lineMatchesKeyword || lineMatchesPositive) {
		positiveMatches++;
	  } else {
		negativeMatches++;
	  }
  
	  if (extractContext && (lineMatchesKeyword || lineMatchesPositive || lineMatchesNegative)) {
		[...keywords, ...positiveKeywords, ...negativeKeywords].forEach(keyword => {
		  const regex = createRegex(keyword);
		  let match;
		  while ((match = regex.exec(line)) !== null) {
			const start = Math.max(0, match.index - contextSize);
			const end = Math.min(line.length, match.index + match[0].length + contextSize);
			context.push({
			  keyword: keyword,
			  context: line.slice(start, end)
			});
		  }
		});
	  }
	});
  
	let statsOutput = `<h3>Filter Results</h3>
	  <p>Total keywords: ${keywords.length + positiveKeywords.length + negativeKeywords.length}</p>
	  <p>Positive Match: ${positiveMatches} lines match</p>
	  <p>Negative Match: ${negativeMatches} lines don't match</p>`;
  
	document.getElementById('stats').innerHTML = statsOutput;
  
	let output = `<h3>Filtered Text</h3>`;
	
	switch (outputFormat) {
	  case 'text':
		output += `<pre>${filteredText}</pre>`;
		break;
	  case 'html':
		output += `<div>${filteredText}</div>`;
		break;
	  case 'markdown':
		output += `<pre>${filteredText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
		break;
	}
  
	if (extractContext && context.length > 0) {
	  output += '<h3>Keyword Context:</h3><ul>';
	  context.forEach(item => {
		output += `<li><strong>${item.keyword}</strong>: ${item.context}</li>`;
	  });
	  output += '</ul>';
	}
  
	document.getElementById('output').innerHTML = output;
  }
  
  function toggleAdvanced() {
	const advancedOptions = document.getElementById('advancedOptions');
	const showAdvanced = document.querySelector('.show-advanced');
	if (advancedOptions.style.display === 'none' || advancedOptions.style.display === '') {
	  advancedOptions.style.display = 'block';
	  showAdvanced.textContent = 'Hide Advanced Options';
	} else {
	  advancedOptions.style.display = 'none';
	  showAdvanced.textContent = 'Show Advanced Options';
	}
  }
  