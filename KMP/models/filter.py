# KMP/models/filter.py

def matches_pattern(keyword, pattern):
    """
    Check if a keyword matches a given pattern.
    Args:
        keyword (str): The keyword to check.
        pattern (str): The pattern to match against.
    Returns:
        bool: True if the keyword matches the pattern, False otherwise.
    """
    if pattern.startswith('[') and pattern.endswith(']'):
        return keyword.lower() == pattern[1:-1].lower()
    elif pattern.startswith('"') and pattern.endswith('"'):
        return pattern[1:-1].lower() in keyword.lower()
    else:
        # You could use regex here if desired
        return all(word.lower() in keyword.lower() for word in pattern.split())


def filter_keywords(positive_keyword_list, negative_keyword_list, keywords_to_match):
    """
    Filter keywords based on positive and negative keyword patterns.
    Args:
        positive_keyword_list (list): List of patterns to match against positively.
        negative_keyword_list (list): List of patterns to filter out negatively.
        keywords_to_match (list): List of keywords to be checked.
    Returns:
        tuple: A tuple containing:
            - matched_keywords (list): Keywords that match the positive patterns.
            - not_matched_keywords (list): Keywords that do not match and those filtered out.
    """
    matched_keywords = [keyword for keyword in keywords_to_match 
                        if any(matches_pattern(keyword, pattern) for pattern in positive_keyword_list)]
    
    filtered_keywords = [keyword for keyword in matched_keywords 
                         if any(matches_pattern(keyword, pattern) for pattern in negative_keyword_list)]
    
    final_matched_keywords = [keyword for keyword in matched_keywords if keyword not in filtered_keywords]
    
    not_matched_keywords = [keyword for keyword in keywords_to_match if keyword not in matched_keywords]
    not_matched_keywords.extend(filtered_keywords)

    return final_matched_keywords, not_matched_keywords