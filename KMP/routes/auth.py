from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify
from models import db
from models.user import User
from datetime import datetime
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """
    This function is responsible for handling the login process.

    Parameters:
    - None

    Returns:
    - If the request method is 'POST' and the login is successful, 
    it redirects to the account page.
    - If the request method is 'POST' and the login is unsuccessful, 
    it renders the login page with an error message.
    - If the request method is not 'POST', it renders the login page.
    """
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            return jsonify({'success': True, 'redirect': url_for('dashboard')})
        else:
            return jsonify({'success': False, 'message': 'Invalid username or password'})

    return render_template('login.html')


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    """
    This function is responsible for handling the registration process

    Parameters:
    - None

    Returns:
    - If the request method is 'POST' and the registration is successful, it redirects to the account page.
    - If the request method is not 'POST', it renders the 'signup.html' template for the registration form.
    """
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        # Handle registration logic
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

		# Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return render_template('signup.html', error="Email already registered")

        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        # Log in the user directly after registration
        login_user(new_user)

        # Redirect to account page after registration
        return redirect(url_for('dashboard'))

    return render_template('signup.html')


@auth_bp.route('/logout')
def logout():
    """
    Clears the session and logs out the user.
    """
    # Clear the session
    logout_user()
    # Redirect to home page or login page
    return redirect(url_for('index'))

