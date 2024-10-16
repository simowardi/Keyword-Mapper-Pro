from flask import Flask, Blueprint, render_template, redirect, url_for, flash, request, Response
from models import db, User
from flask_login import login_required, current_user, LoginManager, login_user, logout_user
from datetime import datetime
import csv
import requests
import json
import string
from concurrent.futures import ThreadPoolExecutor

keyword_bp = Blueprint('keyword', __name__)


@keyword_bp.route('/keyword_filter', methods=['GET', 'POST'])
@login_required
def keyword_filter():
    """
    Endpoint to filter keywords based on positive and negative matches

    If the request is a POST, filters the given keyword list based on the given
    positive and negative keywords, then renders the keyword_filter.html template
    with the filtered keywords and keyword count.

    If the request is a GET, renders the keyword_filter.html template with empty
    variables.

    :return: rendered keyword_filter.html template
    """
    if request.method == 'POST':
        positive_keywords = request.form.get('positive_keywords', '').splitlines()
        negative_keywords = request.form.get('negative_keywords', '').splitlines()
        keyword_list = request.form.get('keyword_list', '').splitlines()

        matched_keywords = [keyword for keyword in keyword_list if any(pos in keyword for pos in positive_keywords)]
        not_matched_keywords = [keyword for keyword in keyword_list if not any(pos in keyword for pos in positive_keywords)]

        return render_template('keyword_filter.html',
                               positive_keywords=positive_keywords,
                               negative_keywords=negative_keywords,
                               keyword_list=keyword_list,
                               matched_keywords=matched_keywords,
                               not_matched_keywords=not_matched_keywords)

    return render_template('keyword_filter.html')


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

        # Filter and group keywords
        for keyword in keyword_list:
            if len(keyword.split()) >= min_group_length and not any(excluded in keyword for excluded in excluded_words):
                grouped_keywords.append(keyword)

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


@keyword_bp.route('/keyword_explorer', methods=['GET', 'POST'])
@login_required
def keyword_explorer():
    suggestions = []
    if request.method == 'POST':
        keyword = request.form.get('keyword')
        language = request.form.get('language')
        country = request.form.get('country')
        depth = request.form.get('depth')

        # Get selected options for prefixes
        selected_prefixes = request.form.getlist('prefixes')

        # Process the keyword to expand based on selected prefixes
        expanded_keywords = expand_keyword(keyword, selected_prefixes)

        for kw in expanded_keywords:
            suggestions.extend(get_google_suggestions(kw, language, country, depth))

    return render_template('keyword_explorer.html', suggestions=suggestions)

def expand_keyword(keyword, prefixes):
    expanded_keywords = []
    if '*' in keyword:
        parts = keyword.split('*')
        base_prefix = parts[0]
        base_suffix = parts[1] if len(parts) > 1 else ''

        # Mapping for character sets
        char_sets = {
            'a-z': 'abcdefghijklmnopqrstuvwxyz',
            'A-Z': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            '0-9': '0123456789'
        }

        # Generate keywords with selected prefixes
        for prefix in prefixes:
            if prefix in char_sets:
                for char in char_sets[prefix]:
                    expanded_keywords.append(f"{char}{base_prefix}{base_suffix}")
            else:
                expanded_keywords.append(f"{prefix}{base_prefix}{base_suffix}")

        return expanded_keywords
    return [keyword]

def get_google_suggestions(keyword, language, country, depth):
    url = f"https://suggestqueries.google.com/complete/search?client=firefox&q={keyword}&hl={language}&gl={country}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()[1][:int(depth)]  # Return the suggestions limited by depth
    return []



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



def fetch_google_suggestions(query, country_code='US'):
    url = f"http://google.com/complete/search?output=toolbar&gl={country_code}&q={query}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        suggestions = json.loads(response.text)[1]
        return [suggestion[0] for suggestion in suggestions]
    except (requests.RequestException, json.JSONDecodeError, IndexError) as e:
        print(f"Error fetching Google suggestions: {e}")
        return []

def fetch_youtube_suggestions(query):
    url = f"http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&alt=json&q={query}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        suggestions = response.json()[1]
        return [suggestion[0] for suggestion in suggestions]
    except (requests.RequestException, json.JSONDecodeError, IndexError) as e:
        print(f"Error fetching YouTube suggestions: {e}")
        return []


@keyword_bp.route("/seokeyword", methods=["GET", "POST"])
@login_required
def seokeyword():
    google_suggestions = []
    youtube_suggestions = []
    
    if request.method == "POST":
        user_input = request.form.get("keyword")
        country_code = request.form.get("country_code", "US")
        sources = request.form.getlist("sources")
        
        if user_input:
            with ThreadPoolExecutor(max_workers=2) as executor:
                futures = []
                if "google" in sources:
                    futures.append(executor.submit(fetch_google_suggestions, user_input, country_code))
                if "youtube" in sources:
                    futures.append(executor.submit(fetch_youtube_suggestions, user_input))
                
                results = [future.result() for future in futures]
                
                if "google" in sources:
                    google_suggestions = results.pop(0)
                if "youtube" in sources:
                    youtube_suggestions = results.pop(0)

    return render_template("seokeyword.html", google_suggestions=google_suggestions, youtube_suggestions=youtube_suggestions)


@keyword_bp.route("/fetch", methods=["POST"])
@login_required
def fetch_suggestions():
    data = request.json
    user_input = data.get("keyword")
    country_code = data.get("country_code", "US")
    sources = data.get("sources", [])
    
    results = {}
    
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = []
        if "google" in sources:
            futures.append(executor.submit(fetch_google_suggestions, user_input, country_code))
        if "youtube" in sources:
            futures.append(executor.submit(fetch_youtube_suggestions, user_input))
        
        future_results = [future.result() for future in futures]
        
        if "google" in sources:
            results["google"] = future_results.pop(0)
        if "youtube" in sources:
            results["youtube"] = future_results.pop(0)

    return jsonify(results)
