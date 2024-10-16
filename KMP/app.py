from flask import Flask, render_template, send_from_directory
from models import db, init_app
from models.user import User
from datetime import datetime
from flask_login import login_user, LoginManager
from routes import auth_bp, account_bp, keyword_bp
import os


app = Flask(__name__)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'


app.config['SECRET_KEY'] = os.environ.get('az12', '123456789AZERTYUIOP')


# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user11:ZE2323@localhost/my_flask_app'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Initialize app with SQLAlchemy
init_app(app)


# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(account_bp, url_prefix='/account')
app.register_blueprint(keyword_bp, url_prefix='/keyword')


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))


@app.route('/')
def index():
    """
    Renders the 'index.html' template upon accessing the root route ('/').
    Returns:
        The rendered 'index.html' template.
    """
    return render_template('index.html')


@app.route('/TOS.html')
def terms_of_service():
    """
    Renders the 'TOS.html' template upon accessing '/TOS.html'.
    """
    return render_template('TOS.html')


@app.route('/privacy.html')
def privacy_policy():
    """
    Renders the 'privacy.html' template upon accessing '/privacy.html'.
    """
    return render_template('privacy.html')


# Only initialize database tables if running as the main application
if __name__ == '__main__':
    # Create database tables if they do not exist
    with app.app_context():
        db.create_all()
    
    # Run the Flask application
    app.run(debug=True)

@keyword_bp.route('/static/<path:filename>')
def serve_static(filename):
    root_dir = os.path.dirname(os.path.abspath(__file__))
    return send_from_directory(os.path.join(root_dir, 'static'), filename)
