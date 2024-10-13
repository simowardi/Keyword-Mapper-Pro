from datetime import datetime
from . import db
from flask_login import UserMixin

class User(UserMixin, db.Model):
    """
    this class represents a user
    """
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())

    def get_id(self):
        return str(self.id)