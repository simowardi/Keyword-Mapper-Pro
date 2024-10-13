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
    total_giveaways = Giveaway.query.filter_by(creator_id=user.id).count()
    active_giveaways = Giveaway.query.filter(Giveaway.creator_id == user.id, Giveaway.end_date >= datetime.now()).count()
    participants = Participation.query.join(Giveaway).filter(Giveaway.creator_id == user.id).count()
    prizes_awarded = Giveaway.query.filter_by(creator_id=user.id).filter(Giveaway.end_date < datetime.now()).count()

    return render_template('account.html', user=user, total_giveaways=total_giveaways, 
                           active_giveaways=active_giveaways, participants=participants, 
                           prizes_awarded=prizes_awarded)


@account_bp.route('/user_giveaways')
@login_required
def usergiveaways():
    """
    Renders the 'usergiveaways.html' template to display the user's giveaways.
    """
    user_giveaways = Giveaway.query.filter_by(creator_id=current_user.id).all()
    print(f"Number of giveaways found: {len(user_giveaways)}")  # Debug print
    for giveaway in user_giveaways:
        print(f"Giveaway ID: {giveaway.id}, Title: {giveaway.title}")  # More detailed debug
    return render_template('usergiveaways.html', user_giveaways=user_giveaways)


@account_bp.route('/delete_account', methods=['POST'])
@login_required
def delete_account():
    user = current_user
    
    # Get all giveaways created by the user
    user_giveaways = Giveaway.query.filter_by(creator_id=user.id).all()
    
    for giveaway in user_giveaways:
        # Delete all participations in this giveaway
        Participation.query.filter_by(giveaway_id=giveaway.id).delete()
        
        # Delete the winner for this giveaway
        Winner.query.filter_by(giveaway_id=giveaway.id).delete()
    
    # Delete all participations by the user in other giveaways
    Participation.query.filter_by(user_id=user.id).delete()
    
    # Delete all winners where the user won
    Winner.query.filter_by(user_id=user.id).delete()
    
    # Now it's safe to delete all giveaways created by the user
    Giveaway.query.filter_by(creator_id=user.id).delete()
    
    # Finally, delete the user
    db.session.delete(user)
    
    # Commit all changes
    db.session.commit()
    
    logout_user()
    flash('Your account has been successfully deleted.', 'success')
    return redirect(url_for('index'))
