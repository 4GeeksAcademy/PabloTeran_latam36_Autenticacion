"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager

# Configuración de entorno
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

# Configuración de archivos estáticos
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

# Inicializar Flask
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL", "sqlite:////tmp/test.db")
app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY', "super-secret-key")

# Inicializar JWT
jwt = JWTManager(app)

# Inicializar migraciones y base de datos
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Agregar panel de administración y comandos
setup_admin(app)
setup_commands(app)

# Registrar rutas de la API
app.register_blueprint(api, url_prefix='/api')

# Manejo de errores como JSON
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generar el sitemap con todos los endpoints en entorno de desarrollo
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Manejo de archivos estáticos en producción
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Evitar cache
    return response

# Iniciar servidor
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
