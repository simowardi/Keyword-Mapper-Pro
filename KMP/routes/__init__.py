# routes/__init__.py
from flask import Blueprint


# Initialize the blueprints
auth_bp = Blueprint('auth', __name__)
account_bp = Blueprint('account', __name__)


# Import routes to register them with blueprints
from .auth import auth_bp
from .account import account_bp