from flask import Blueprint, render_template, redirect, url_for, flash
from models import db, Giveaway, Participation, User, Winner
from flask_login import login_required, current_user, logout_user
from datetime import datetime

account_bp = Blueprint('account', __name__)


@account_bp.route('/account')
@login_required
def account():
    """
    Renders the 'account.html' template upon accessing the '/account' route.
    """
    user = current_user

    return render_template('account.html', user=user)


@account_bp.route('/delete_account', methods=['POST'])
@login_required
def delete_account():
    user = current_user
        
    # Finally, delete the user
    db.session.delete(user)
    
    # Commit all changes
    db.session.commit()
    
    logout_user()
    flash('Your account has been successfully deleted.', 'success')
    return redirect(url_for('index'))
