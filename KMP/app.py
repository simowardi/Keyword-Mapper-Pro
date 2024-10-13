from flask import Flask, render_template
from models import db, init_app
from models.winner import Winner
from models.user import User
from models.giveaway import Giveaway
from models.participation import Participation
from datetime import datetime
from flask_login import login_user, LoginManager
from routes import auth_bp, giveaway_bp, account_bp
import os


app = Flask(__name__)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'


app.config['SECRET_KEY'] = os.environ.get('az12', '123456789AZERTYUIOP')


# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:zeé"ZE2323@localhost/my_flask_app'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# Initialize app with SQLAlchemy
init_app(app)


# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(giveaway_bp, url_prefix='/giveaway')
app.register_blueprint(account_bp, url_prefix='/account')


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
