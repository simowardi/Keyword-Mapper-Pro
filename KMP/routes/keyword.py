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
        # Extract parameters from the request
        keywords = request.form.get('keyword').strip().splitlines()  # Split by lines
        language = request.form.get('language','en')
        country = request.form.get('country', 'us')

        # Get selected options for prefixes
        selected_prefixes = request.form.getlist('prefixes')

        for keyword in keywords:
            if keyword:  # Ensure it's not empty
                expanded_keywords = expand_keyword(keyword.strip(), selected_prefixes)
                for kw in expanded_keywords:
                    suggestions.extend(get_google_suggestions(kw, language, country))

    return render_template('keyword_explorer.html', suggestions=suggestions)



# Keyword Filter keyword route

@keyword_bp.route('/keyword_filter', methods=['GET', 'POST'])
@login_required
def keyword_filter():
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
            return jsonify(response_data)  # Return JSON for AJAX requests
        else:
            return render_template('keyword_filter.html', **response_data)  # Render the HTML template for normal requests

    return render_template('keyword_filter.html')  # Render for GET requests



# Keyword Grouper keyword route

@keyword_bp.route('/keyword_grouper', methods=['GET', 'POST'])
@login_required
def keyword_grouper():
    """
    Endpoint to group keywords based on a minimum length and excluded words

    If the request is a POST, filters and groups the given keywords
    based on the given minimum length and excluded words, then renders
    the keyword_grouper.html template with the grouped keywords and
    keyword count.

    If the request is a GET, renders the keyword_grouper.html template
    with empty variables.

    :return: rendered keyword_grouper.html template
    """
    grouped_keywords = []
    num_keywords = 0
    num_groups = 0

    if request.method == 'POST':
        keyword_list = request.form.get('keyword_list', '').splitlines()
        min_group_length = int(request.form.get('min_group_length', 1))
        excluded_words = set(request.form.get('excluded_words', '').splitlines())

		# Group keywords based on individual words
        for keyword in keyword_list:
            # Exclude keywords based on length and excluded words
            if len(keyword.split()) >= min_group_length and not any(excluded in keyword for excluded in excluded_words):
                # Split the keyword into individual words
                words = keyword.split()
                for word in words:
                    if word not in grouped_keywords:
                        grouped_keywords[word] = []
                    grouped_keywords[word].append(keyword)

        num_keywords = len(keyword_list)
        num_groups = len(grouped_keywords)


        return render_template('keyword_grouper.html',
                               keyword_list=keyword_list,
                               min_group_length=min_group_length,
                               excluded_words=excluded_words,
                               grouped_keywords=grouped_keywords,
                               num_keywords=num_keywords,
                               num_groups=num_groups)

    return render_template('keyword_grouper.html')

@keyword_bp.route('/export_csv', methods=['POST'])
@login_required
def export_csv():
    """
    Endpoint to export grouped keywords as a CSV file
    """
    grouped_keywords = request.form.getlist('grouped_keywords')

    # Create CSV response
    def generate():
        yield 'Keyword\n'  # CSV header
        for keyword in grouped_keywords:
            yield f"{keyword}\n"

    return Response(generate(), mimetype='text/csv', headers={"Content-Disposition": "attachment;filename=grouped_keywords.csv"})



# intent analyzer keyword route

@keyword_bp.route('/keyword_intent', methods=['GET', 'POST'])
@login_required
def keyword_intent():
    intent = ""
    if request.method == 'POST':
        keyword = request.form.get('keyword')
        # Analyze the intent of the keyword
        intent = analyze_intent(keyword)

    return render_template('keyword_intent.html', intent=intent)

def analyze_intent(keyword):
    informational_keywords = [
        'what', 'how', 'define', 'explain', 'learn', 'who', 'where', 'when',
        'details', 'info', 'facts', 'history', 'meaning', 'overview', 'guide',
        'sources', 'data', 'research', 'statistics', 'examples', 'concept',
        'news', 'updates', 'trends', 'benefits', 'features', 'methods', 'process'
    ]
    
    transactional_keywords = [
        'buy', 'purchase', 'order', 'discount', 'deal', 'price', 'sale',
        'shop', 'checkout', 'payment', 'subscription', 'register', 'enroll',
        'offer', 'coupon', 'gift', 'cost', 'invoice', 'transaction', 'cart',
        'save', 'best', 'compare', 'free', 'trial', 'shipping', 'delivery', 
        'availability', 'warranty', 'return'
    ]
    
    navigational_keywords = [
        'login', 'home', 'contact', 'about', 'site', 'page', 'find', 'search',
        'navigate', 'map', 'location', 'directory', 'help', 'support', 
        'resources', 'portfolio', 'services', 'products', 'team', 'reviews',
        'testimonials', 'social', 'forum', 'blog', 'community', 'events', 
        'news', 'updates', 'profile', 'settings'
    ]
    
    local_keywords = [
        'near me', 'in', 'around', 'locations', 'nearby', 'local', 
        'address', 'city', 'region', 'district', 'village', 'town', 
        'state', 'area', 'zip code', 'suburb', 'community', 'locality', 
        'map', 'geolocation', 'directions', 'public transport', 'services', 
        'businesses', 'shops', 'restaurants', 'attractions', 'activities'
    ]
    
    comparative_keywords = [
        'vs', 'compare', 'better', 'worse', 'best', 'worst', 'similar', 
        'differences', 'advantages', 'disadvantages', 'evaluate', 
        'assess', 'contrast', 'choose', 'select', 'options', 'alternatives', 
        'preference', 'recommend', 'suggest', 'pros and cons', 'which', 
        'either', 'or', 'decision', 'choice', 'ranking', 'top', 'list', 
        'match', 'score'
    ]
    
    advice_keywords = [
        'tips', 'advice', 'suggestions', 'recommendations', 'how to', 
        'ways to', 'methods', 'strategies', 'guidance', 'counsel', 
        'insights', 'help', 'improve', 'enhance', 'boost', 'achieve', 
        'overcome', 'solve', 'manage', 'handle', 'navigate', 'address', 
        'prepare', 'plan', 'organize', 'execute', 'approach', 
        'learn', 'develop', 'cultivate', 'foster', 'nurture', 'maintain'
    ]

    # Lowercase for uniformity
    keyword_lower = keyword.lower()

    # Check for informational intent
    if any(keyword_lower.startswith(kw) for kw in informational_keywords):
        return "Informational"
    
    # Check for transactional intent
    if any(kw in keyword_lower for kw in transactional_keywords):
        return "Transactional"
    
    # Check for navigational intent
    if any(kw in keyword_lower for kw in navigational_keywords):
        return "Navigational"
    
    # Check for local intent
    if any(kw in keyword_lower for kw in local_keywords):
        return "Local"
    
    # Check for comparative intent
    if any(kw in keyword_lower for kw in comparative_keywords):
        return "Comparative"
    
    # Check for advice intent
    if any(kw in keyword_lower for kw in advice_keywords):
        return "Advice"
    
    return "Unclassified"



# seo keyword route
def generate_search_queries(query, increment_option):
    base_query = query.replace('+', ' ').replace('*', '')

    if increment_option == 'a-z':
        characters = string.ascii_lowercase
    elif increment_option == 'A-Z':
        characters = string.ascii_uppercase
    elif increment_option == '0-9':
        characters = string.digits
    else:
        characters = []

    # Create queries by adding characters in place of *
    queries = [f"{base_query}{char}" for char in characters]
    
    return queries

def fetch_google_suggestions(query):
    url = f"https://suggestqueries.google.com/complete/search?output=toolbar&hl=en&q={query}"
    response = requests.get(url)

    suggestions = []
    if response.status_code == 200:
        from xml.etree import ElementTree as ET
        root = ET.fromstring(response.content)

        for suggestion in root.findall('.//suggestion'):
            suggestions.append(suggestion.attrib['data'])

    return suggestions

@keyword_bp.route('/keyword/seokeyword', methods=['GET', 'POST'])
@login_required
def seokeyword():
    """
    Handle the SEO keyword exploration.

    This route handles both GET and POST requests for exploring SEO keywords.
    When accessed via POST, it takes a search term and an increment option from
    the form. If the search term contains '*', it generates variations of the 
    search term by replacing '*' with characters specified by the increment option,
    and fetches Google suggestions for each variation. Returns these suggestions 
    to the `seokeyword.html` template. If the search term does not contain '*',
    it returns a message indicating the search term is invalid.

    Returns:
        str: Rendered HTML template with the list of suggestions or an error message.
    """
    all_suggestions = []

    if request.method == 'POST':
        search_term = request.form.get('search_term')
        increment_option = request.form.get('increment_option')

        # If * is in the search term, generate variations
        if '*' in search_term:
            queries = generate_search_queries(search_term, increment_option)

            # For each generated query, get Google suggestions
            for query in queries:
                google_suggestions = fetch_google_suggestions(query)
                all_suggestions.append((query, google_suggestions))
        else:
            all_suggestions.append(("Invalid search term", ["No '*' found in the search term."]))

    return render_template('seokeyword.html', suggestions=all_suggestions)




