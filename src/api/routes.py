"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)
CORS(api)

# SIGNUP - Crear usuario
@api.route("/signup", methods=['POST'])
def create_user():
    try:
        data = request.json
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        if None in [email, username, password]:
            return jsonify({"message": "Email, Username, and Password are required"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already exists"}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({"message": "Username already exists"}), 400

        password_hash = generate_password_hash(password)
        new_user = User(email=email, username=username, password_hash=password_hash)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "user": new_user.serialize(),
            "message": "User registered successfully"
        }), 201

    except Exception as e:
        db.session.rollback()
        print("Database error:", e)
        return jsonify({"message": "Error saving user to database"}), 500

# LOGIN - Generar Token
@api.route("/login", methods=['POST'])
def login():
    try:
        data = request.json
        email_or_username = data.get("email_or_username")
        password = data.get("password")

        if not email_or_username or not password:
            return jsonify({"message": "Email/Username and Password are required"}), 400

        user = User.query.filter(
            (User.email == email_or_username) | (User.username == email_or_username)
        ).first()

        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({"message": "Wrong email/username or password"}), 400

        token = create_access_token(identity=str(user.id))
        return jsonify({"token": token}), 201

    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"message": "An error occurred during login"}), 500

# USUARIOS PRIVADOS - Verificar Token
@api.route("/users", methods=['GET'])
@jwt_required()
def get_private_data():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"message": "User not found"}), 404

        return jsonify(user.serialize()), 200

    except Exception as e:
        return jsonify({"message": "Error retrieving user data", "error": str(e)}), 500
