from flask import Flask, render_template, send_from_directory
from models import db, init_app
from models.user import User
from flask_login import LoginManager
from routes import auth_bp, account_bp, keyword_bp
import os


app = Flask(__name__)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'


# Configure app with Flask-Login settings (see routes/__init__.py)
app.config['SECRET_KEY'] = os.environ.get('az12', '123456789AZERTYUIOP')


# Configure SQLAlchemy with app config settings (see models/__init__.py)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user11:ZE2323@localhost/my_flask_app'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Initialize app with SQLAlchemy (see models/__init__.py)
init_app(app)


# Register blueprints (see routes/__init__.py)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(account_bp, url_prefix='/account')
app.register_blueprint(keyword_bp, url_prefix='/keyword')


@login_manager.user_loader
def load_user(user_id):
    """
    User loader function for Flask-Login.
    Loads a user by its ID for login session management.
    Parameters:
        user_id (int): The ID of the user to load.
    Returns:
        The loaded User object, or None if not found.
    """
    return db.session.get(User, int(user_id))


@app.route('/')
def index():
    """
    Renders the 'index.html' template upon accessing the root route ('/').
    Returns:
        The rendered 'index.html' template.
    """
    return render_template('index.html')


@app.route('/terms')
def terms():
    """
    Renders the 'tos.html' template upon accessing '/tos.html'.
    """
    return render_template('terms.html')


@app.route('/privacy')
def privacy():
    """
    Renders the 'privacy.html' template upon accessing '/privacy.html'.
    """
    return render_template('privacy.html')


@app.route('/dashboard')
def dashboard():
    """
    Renders the 'dashboard.html' template upon accessing the root route ('/dashboard').
    Returns:
        The rendered 'dashboard.html' template.
    """
    return render_template('dashboard.html')


@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serves static files from the 'static' folder in the application root.
    Given a filename, this function will look for the file in the 'static' folder
    and return it if it exists. Otherwise, a 404 error is returned.
    Args:
        filename (str): The name of the file to return.
    Returns:
        The requested file if it exists, otherwise a 404 error.
    """
    root_dir = os.path.dirname(os.path.abspath(__file__))
    return send_from_directory(os.path.join(root_dir, 'static'), filename)



# Only initialize database tables if running as the main application
if __name__ == '__main__':
    # Create database tables if they do not exist
    with app.app_context():
        db.create_all()
    
    # Run the Flask application
    app.run(debug=True)