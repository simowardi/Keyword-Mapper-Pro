from flask import Flask, Blueprint, render_template, redirect, url_for, flash, jsonify, request, Response
from models import db, User
from flask_login import login_required, current_user, LoginManager, login_user, logout_user
from datetime import datetime
import csv
import os
import time
import requests
import json
import string
from concurrent.futures import ThreadPoolExecutor
from SeoKeywordResearch import SeoKeywordResearch


keyword_bp = Blueprint('keyword', __name__)



# keyword explorer keyword route

def get_google_suggestions(keyword, language, country):
    """
    Get Google suggestions based on the given keyword, language and country.

    Parameters:
    keyword (str): The keyword to get suggestions for
    language (str): The language of the keyword
    country (str): The country to get suggestions for

    Returns:
    list: A list of suggestions for the given keyword
    """
    url = f"https://suggestqueries.google.com/complete/search?client=firefox&q={keyword}&hl={language}&gl={country}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()[1]
    return []

def expand_keyword(keyword, prefixes):
    """
    Expand a keyword by replacing '*' with characters from the selected prefixes.

    This function takes a keyword with a '*' placeholder 
    and a list of character sets (prefixes).
    It generates variations of the keyword by replacing '*' 
    with each character from the selected prefixes.

    Parameters:
    keyword (str): The input keyword containing a '*' placeholder.
    prefixes (list): A list of character sets (e.g., 'a-z', 'A-Z', '0-9') to use as prefixes.

    Returns:
    list: A list of expanded keywords with '*' replaced by each character from the selected prefixes.
          If no '*' is found in the keyword, returns the original keyword in a list.
    """
    expanded_keywords = []

    if '*' in keyword:
        parts = keyword.split('*')
        keyword_part = parts[0]
        suffix_part = parts[1] if len(parts) > 1 else ''

        # Mapping for character sets
        char_sets = {
            'a-z': 'abcdefghijklmnopqrstuvwxyz',
            'A-Z': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            '0-9': '0123456789',
            'questions': ['how', 'why', 'where', 'what', 'when', 'who', 'which', 'can', 'do', 'is', 'are'],
		}

        # Generate keywords with selected prefixes
        for prefix in prefixes:
            if prefix in char_sets:
                for char in char_sets[prefix]:
                    expanded_keywords.append(f"{keyword_part}{char}{suffix_part}")
            else:
                expanded_keywords.append(f"{keyword_part}{prefix}{suffix_part}")

        return expanded_keywords
    return [keyword]

@keyword_bp.route('/keyword_explorer', methods=['GET', 'POST'])
@login_required
def keyword_explorer():
    """
    The keyword explorer page allows users to input a keyword 
    and select language and country to generate related keywords based on Google suggestions.

    Parameters:
    keyword (str): The keyword to generate suggestions for
    language (str): The language to generate suggestions in
    country (str): The country to generate suggestions in

    Returns:
    A rendered template with suggestions
    """
    suggestions = []
    if request.method == 'POST':
        keywords = request.form.get('keyword').strip().splitlines()
        language = request.form.get('language', 'en')
        country = request.form.get('country', 'us')
        selected_prefixes = request.form.getlist('prefixes')

        for keyword in keywords:
            if keyword:
                expanded_keywords = expand_keyword(keyword.strip(), selected_prefixes)
                for kw in expanded_keywords:
                    suggestions.extend(get_google_suggestions(kw, language, country))
                    # Delay for half a second for each keyword


        # Corrected to return a JSON object instead of a string
        return jsonify({'suggestions': suggestions})

    # Render the HTML template for GET requests
    return render_template('keyword_explorer.html')




# Keyword Filter keyword route

@keyword_bp.route('/keyword_filter', methods=['GET', 'POST'])
@login_required
def keyword_filter():
    """
    The keyword filter page allows users to input a list of keywords 
    and a list of positive keywords to filter out the keywords 
    that do not contain any of the positive keywords.

    Parameters:
    keys_to_be_matched (str): The list of keywords to be filtered, separated by newlines
    keys_to_match (str): The list of positive keywords to filter with, separated by newlines

    Returns:
    A rendered template with the filtered keywords and their count
    """
    if request.method == 'POST':
        kw_list = request.form.get('keys_to_be_matched', '').splitlines()
        positive_kw = request.form.get('keys_to_match', '').splitlines()

        def matches_pattern(keyword, pattern):
            return any(word.lower() in keyword.lower() for word in pattern)

        # Find matches based on positive keywords
        matched_keywords = [keyword for keyword in kw_list if matches_pattern(keyword, positive_kw)]
        
        # Prepare the response data
        response_data = {
            'matches': '\n'.join(matched_keywords),
            'match_count': len(matched_keywords)
        }

        # Check for AJAX request
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            # Return JSON for AJAX requests
            return jsonify(response_data)
        else:
            # Render the HTML template for normal requests
            return render_template('keyword_filter.html', **response_data)
	# Render for GET requests
    return render_template('keyword_filter.html')





# Keyword Grouper keyword route

@keyword_bp.route('/keyword_grouper', methods=['GET', 'POST'])
@login_required
def keyword_grouper():
    """
    Endpoint to group keywords based on a minimum length.

    If the request is a POST, filters and groups the given keywords
    based on the given minimum length, then renders the keyword_grouper.html
    template with the grouped keywords and keyword count.

    If the request is a GET, renders the keyword_grouper.html template
    with empty variables.

    :return: rendered keyword_grouper.html template
    """
    if request.method == 'POST':
        # Handle AJAX request for keyword grouping
        keyword_list = request.form.get('keyword_list', '').splitlines()
        min_group_length = int(request.form.get('min_group_length', 1))
        
        # Create a dictionary to store the grouped keywords
        grouped_keywords = {}
        
        # Iterate through the keyword list and group them
        for keyword in keyword_list:
            keyword_parts = keyword.split()
            for i in range(len(keyword_parts), 0, -1):
                phrase = ' '.join(keyword_parts[:i])
                if phrase not in grouped_keywords:
                    grouped_keywords[phrase] = []
                grouped_keywords[phrase].append(keyword)
                if len(grouped_keywords[phrase]) >= min_group_length:
                    break
        
        # Filter out groups that don't meet the minimum length requirement
        grouped_keywords = {k: v for k, v in grouped_keywords.items() if len(v) >= min_group_length}

        num_keywords = len(keyword_list)
        num_groups = len(grouped_keywords)

        # Return JSON response
        return jsonify({
            'grouped_keywords': grouped_keywords,
            'num_groups': num_groups,
            'num_keywords': num_keywords
        })

    # Render the HTML template for GET requests
    return render_template('keyword_grouper.html', keyword_list=[], min_group_length=1, grouped_keywords={}, num_keywords=0, num_groups=0)








# seo keyword route
# Set your SerpApi key here
SERPAPI_API_KEY = 'your_serpapi_api_key'

@keyword_bp.route("/", methods=["GET", "POST"])
def index():
    data = {}
    if request.method == "POST":
        userInput = request.form.get("keyword")
        if userInput:
            # Create an instance of the SeoKeywordResearch class
            keyword_research = SeoKeywordResearch(
                query=userInput,
                api_key=SERPAPI_API_KEY,
                lang='en',
                country='us',
                domain='google.com'
            )

            # Extract data from API
            data['auto_complete'] = keyword_research.get_auto_complete()
            data['related_searches'] = keyword_research.get_related_searches()
            data['related_questions'] = keyword_research.get_related_questions(depth_limit=1)

    return render_template("index.html", data=data)




