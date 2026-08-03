from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.user import User

profile_bp = Blueprint(
    "profile",
    __name__
)


@profile_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():

    print("=" * 50)
    print("PROFILE ROUTE HIT")

    user_id = int(get_jwt_identity())

    print("User ID:", user_id)

    # user_id is stored in User.user_id column
    user = User.query.filter_by(user_id=user_id).first_or_404()

    print("User Found:", user.user_name)

    print("=" * 50)

    return jsonify({

        "user_id": user.user_id,
        "user_name": user.user_name,
        "name": user.name,
        "email": user.email

    })