from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy object
db = SQLAlchemy()


# Import your models
from .user import User
# from .giveaway import Giveaway





# Function to initialize app with SQLAlchemy
def init_app(app):
    """
    A function that initializes the Flask application with the database.
    Parameters:
        app (Flask): The Flask application to initialize.
    Returns:
        None
    """
    db.init_app(app)
    with app.app_context():
        db.create_all()