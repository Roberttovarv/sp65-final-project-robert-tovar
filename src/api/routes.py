from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.models import db, Users, Games, Posts
import requests
from datetime import datetime
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/apiexterna', methods=['POST'])
def fetch_and_store_games():
    game_ids = request.json.get('game_ids')
    if not game_ids or not isinstance(game_ids, list):
        return jsonify({'error': 'No hay juegos o el formato es incorrecto'}), 400
    api_key = '10fbe8c8bd844a3aa7087a6af5e439c2'
    stored_games = []
    errors = []
    for game_id in game_ids:
        url = f'https://api.rawg.io/api/games/{game_id}?key={api_key}'
        response = requests.get(url)
        if response.status_code != 200:
            errors.append({'game_id': game_id, 'error': 'Fallo al obtener los datos'})
            continue
        game_data = response.json()

        released_at = game_data.get('released')
        
        metacritic = game_data.get('metacritic')

        if released_at is None or metacritic is None:
            errors.append({'game_id': game_id, 'error': 'Datos incompletos: falta released_at o metacritic'})
            continue

        new_game = Games(
            name=game_data.get('name'),
            background_image=game_data.get('background_image'),
            description=game_data.get('description'),
            released_at=released_at,
            metacritic=metacritic
        )
        db.session.add(new_game)
        stored_games.append(new_game)
    db.session.commit()
    return jsonify({
        'stored_games': [game.serialize() for game in stored_games],
        'errors': errors
    }), 201

@api.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_user(user_id):
    response_body = {}
    user = Users.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'Usuario inexistente', 'results': {}}), 404
    
    if request.method == 'GET':
        response_body['results'] = user.serialize()
        response_body['message'] = 'Usuario encontrado'
        return response_body, 200
    
    if request.method == 'PUT':
        data = request.json
        user.email = data.get('email', user.email)
        user.is_active = data.get('is_active', user.is_active)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.username = data.get('username', user.username)
        user.is_admin = data.get('is_admin', user.is_admin)
        user.pfp = data.get('pfp', user.pfp)
        
        db.session.commit()
        response_body['message'] = 'Datos del usuario actualizados'
        response_body['results'] = user.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        response_body['message'] = 'Usuario eliminado'
        return response_body, 200

@api.route('/games', methods=['GET', 'POST'])
def handle_games():
    response_body = {}
    
    if request.method == 'GET':
        games = Games.query.all()
        results = [game.serialize() for game in games]
        response_body['results'] = results
        response_body['message'] = 'Listado de Videojuegos'
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        required_fields = ['name', 'description', 'background_image']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Falta el campo requerido: {field}'}), 400
        
        new_game = Games(
            name=data['name'],
            description=data['description'],
            background_image=data['background_image'],
            # metacritic=data['metacritic']
        )
        db.session.add(new_game)
        db.session.commit()
        
        response_body['results'] = new_game.serialize()
        response_body['message'] = 'Videojuego creado'
        return response_body, 201

@api.route('/games/<int:game_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_game(game_id):
    response_body = {}
    game = Games.query.get(game_id)
    
    if not game:
        return jsonify({'message': 'Videojuego inexistente', 'results': {}}), 404
    
    if request.method == 'GET':
        response_body['results'] = game.serialize()
        response_body['message'] = 'Videojuego encontrado'
        return response_body, 200
    
    if request.method == 'PUT':
        data = request.json
        game.name = data.get('name', game.name)
        game.background_image = data.get('background_image', game.background_image)
        game.released_at = data.get('released_at', game.released_at)
        game.metacritic = data.get('metacritic', game.metacritic)
       
        
        db.session.commit()
        response_body['message'] = 'Datos del videojuego actualizados'
        response_body['results'] = game.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        db.session.delete(game)
        db.session.commit()
        response_body['message'] = 'Videojuego eliminado'
        return response_body, 200
    
@api.route('/posts', methods=['GET', 'POST'])
def handle_posts():
    response_body = {}

    if request.method == 'GET':
        posts = Posts.query.all()
        results = [post.serialize() for post in posts]
        response_body['results'] = results
        response_body['message'] = 'Listado de Publicaciones'
        return jsonify(response_body), 200

    if request.method == 'POST':
        data = request.json
        if isinstance(data, list):
            new_posts = []
            existing_images_url = {post.image_url for post in Posts.query.all()}  # Set of existing titles
            for post_data in data:
                required_fields = ['title', 'body', 'image_url']
                # Check for missing fields
                for field in required_fields:
                    if field not in post_data:
                        return jsonify({'message': f'Falta el campo requerido: {field}'}), 400
                
                # Check for duplicate title
                if post_data['image_url'] in existing_images_url:
                    continue  # Ignore this post_data and proceed to the next

                new_post = Posts(
                    title=post_data['title'],
                    body=post_data['body'],
                    game_id=post_data.get('game_id'),
                    image_url=post_data['image_url'],
                    date=datetime.today()
                )
                db.session.add(new_post)
                new_posts.append(new_post)
                existing_images_url.add(post_data['title'])  # Add to the set of existing titles
            
            db.session.commit()

            response_body['results'] = [post.serialize() for post in new_posts]
            response_body['message'] = 'Publicaciones creadas'
            return jsonify(response_body), 201

        else:
            return jsonify({'message': 'El formato de los datos debe ser una lista de publicaciones'}), 400

@api.route('/posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_post(post_id):
    response_body = {}
    post = Posts.query.get(post_id)
    
    if not post:
        return jsonify({'message': 'Publicación inexistente', 'results': {}}), 404
    
    if request.method == 'GET':
        response_body['results'] = post.serialize()
        response_body['message'] = 'Publicación encontrada'
        return response_body, 200
    
    if request.method == 'PUT':
        data = request.json
        post.title = data.get('title', post.title)
        post.body = data.get('body', post.body)
        post.game_id = data.get('game_id', post.game_id)
        post.image_url = data.get('image_url', post.image_url)
        
        db.session.commit()
        response_body['message'] = 'Publicación actualizada'
        response_body['results'] = post.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        db.session.delete(post)
        db.session.commit()
        response_body['message'] = 'Publicación eliminada'
        return response_body, 200

@api.route('/signup', methods=['POST'])
def signup():
    response_body = {}
    data = request.json
    
    email = data.get("email", None).lower()
    password = data.get("password", None)
    username = data.get("username", None)
    existing_user = Users.query.filter_by(email=email).first()
    
    if existing_user:
        response_body['error'] = 'El correo electrónico ya está registrado'
        return jsonify(response_body), 400
    
    print (request.json)
    new_user = Users(
        email=email,
        password=password,
        is_active=True,
        first_name=data.get('first_name', None),
        last_name=data.get('last_name', None),
        username=username,
        is_admin=False,
        pfp="https://www.teleadhesivo.com/es/img/arc226-jpg/folder/products-listado-merchanthover/pegatinas-coches-motos-space-invaders-marciano-iii.jpg"
    )
    db.session.add(new_user)
    db.session.commit()
    
    access_token = create_access_token(identity={'user_id': new_user.id})
    response_body['message'] = 'Usuario registrado y logueado'
    response_body['access_token'] = access_token
    
    return jsonify(response_body), 200

@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    user = Users.query.filter_by(email=email, password=password, is_active=True).first()
    
    if user:
        access_token = create_access_token(identity={'user_id': user.id, 'is_admin': user.is_admin})
        response_body['message'] = 'Usuario logueado'
        response_body['access_token'] = access_token
        response_body['is_admin'] = user.is_admin
        response_body['results'] = user.serialize()
        return jsonify(response_body), 200
    else:
        response_body['message'] = 'Correo o contraseña incorrectos'
        return jsonify(response_body), 401

@api.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    print("-----------------------------------------------------------------------------------------------------------------")
    response_body = {}
    current_user = get_jwt_identity()
    print(current_user)
    user = Users.query.get(current_user['user_id'])
    
    if user:
        response_body['message'] = 'Perfil encontrado'
        response_body['results'] = user.serialize()
        return jsonify(response_body), 200
    else:
        response_body['message'] = 'Perfil no encontrado'
        return jsonify(response_body), 404

@api.route('/users', methods=['GET'])
def get_users():
    response_body = {}
    users = Users.query.all()
    results = [user.serialize() for user in users]
    response_body['results'] = results
    response_body['message'] = 'Listado de Usuarios'
    return jsonify(response_body), 200