from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from api.models import db, Users, Games, Posts, Videos, Comments, Likes, ProfilePicture
from sqlalchemy import and_
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


@api.route('/signup', methods=['POST'])
def signup():
    response_body = {}
    data = request.json

    email = data.get("email", None).lower()
    password = data.get("password", None)
    username = data.get("username", None)
    pfp_id = 1  # Assuming you are sending the pfp_id in the request
    existing_user = Users.query.filter_by(email=email).first()

    if existing_user:
        response_body['error'] = 'El correo electrónico ya está registrado'
        return jsonify(response_body), 400

    # Query the ProfilePicture instance
    pfp = ProfilePicture.query.get(pfp_id)

    new_user = Users(
        email=email,
        password=password,
        is_active=True,
        first_name=data.get('first_name', None),
        last_name=data.get('last_name', None),
        username=username,
        is_admin=False,
        pfp=pfp  # Assign the ProfilePicture instance
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

@api.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_user(user_id):
    response_body = {}
    user = Users.query.get(user_id)
    
    if not user:
        return jsonify({'message': 'Usuario inexistente', 'results': {}}), 404
    
    if request.method == 'GET':
        response_body['results'] = user.serialize()
        response_body['message'] = 'Usuario encontrado'
        return jsonify(response_body), 200
    
    if request.method == 'PUT':
        data = request.json
        
        # Actualizar los campos del usuario
        user.email = data.get('email', user.email)
        user.is_active = data.get('is_active', user.is_active)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.username = data.get('username', user.username)
        user.is_admin = data.get('is_admin', user.is_admin)

        # Actualizar el campo pfp con el objeto ProfilePicture correspondiente
        pfp_id = data.get('pfp')
        if pfp_id:
            profile_picture = ProfilePicture.query.get(pfp_id)
            if profile_picture:
                user.pfp = profile_picture  # Asigna el objeto ProfilePicture en lugar de la URL
            else:
                return jsonify({'message': 'Imagen de perfil no encontrada', 'results': {}}), 404
        
        db.session.commit()
        response_body['message'] = 'Datos del usuario actualizados'
        response_body['results'] = user.serialize()
        return jsonify(response_body), 200


@api.route('/users', methods=['GET'])
def get_users():
    response_body = {}
    users = Users.query.all()
    results = [user.serialize() for user in users]
    response_body['results'] = results
    response_body['message'] = 'Listado de Usuarios'
    return jsonify(response_body), 200

@api.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
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


@api.route('/games', methods=['GET', 'POST'])
@jwt_required(optional=True)
def handle_games():
    response_body = {}
    current_user = get_jwt_identity()
    user_id = current_user['user_id'] if current_user else None

    if request.method == 'GET':
        games = Games.query.all()
        results = [game.serialize(user_id=user_id) for game in games]
        response_body['results'] = results
        response_body['message'] = 'Lista de videojuegos'
        return jsonify(response_body), 200

    if request.method == 'POST':
        data = request.json
        new_game = Games(
            name=data.get('name'),
            background_image=data.get('background_image'),
            description=data.get('description'),
            released_at=data.get('released_at'),
            metacritic=data.get('metacritic')
        )
        db.session.add(new_game)
        db.session.commit()
        response_body['message'] = 'Videojuego creado'
        response_body['results'] = new_game.serialize(user_id=user_id)
        return jsonify(response_body), 201
    

@api.route('/games/<int:game_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required(optional=True)
def handle_game(game_id):
    response_body = {}
    current_user = get_jwt_identity()
    user_id = current_user['user_id'] if current_user else None
    game = Games.query.get(game_id)
    
    if not game:
        return jsonify({'message': 'Videojuego inexistente', 'results': {}}), 404

    if request.method == 'GET':
        response_body['results'] = game.serialize(user_id=user_id)
        response_body['message'] = 'Videojuego encontrado'
        return jsonify(response_body), 200

    if request.method == 'PUT':
        data = request.json
        game.name = data.get('name', game.name)
        game.background_image = data.get('background_image', game.background_image)
        game.description = data.get('description', game.description)
        game.released_at = data.get('released_at', game.released_at)
        game.metacritic = data.get('metacritic', game.metacritic)
        db.session.commit()
        response_body['message'] = 'Datos del videojuego actualizados'
        response_body['results'] = game.serialize(user_id=user_id)
        return jsonify(response_body), 200

    if request.method == 'DELETE':
        db.session.delete(game)
        db.session.commit()
        response_body['message'] = 'Videojuego eliminado'
        return jsonify(response_body), 200

@api.route('/games/<int:game_id>/comment', methods=['POST', 'GET', 'DELETE'])
@jwt_required()
def handle_comment_game(game_id):
    current_user = get_jwt_identity()
    user_id = current_user['user_id']

    if request.method == 'POST':
        data = request.json
        body = data.get('body')

        if not body:
            return jsonify({'message': 'Falta el campo requerido: body'}), 400

        new_comment = Comments(body=body, user_id=user_id, game_id=game_id)
        db.session.add(new_comment)
        db.session.commit()

        return jsonify(new_comment.serialize()), 201

    elif request.method == 'GET':
        comment_id = request.args.get('comment_id')
        if not comment_id:
            return jsonify({'message': 'Falta el parámetro requerido: comment_id'}), 400

        comment = Comments.query.filter_by(id=comment_id, game_id=game_id).first()
        if not comment:
            return jsonify({'message': 'Comentario no encontrado'}), 404

        return jsonify(comment.serialize()), 200

    elif request.method == 'DELETE':
        comment_id = request.args.get('comment_id')
        if not comment_id:
            return jsonify({'message': 'Falta el parámetro requerido: comment_id'}), 400

        comment = Comments.query.filter_by(id=comment_id, game_id=game_id).first()
        if not comment:
            return jsonify({'message': 'Comentario no encontrado'}), 404

        db.session.delete(comment)
        db.session.commit()

        return jsonify({'message': 'Comentario eliminado'}), 200

@api.route('/posts', methods=['GET', 'POST'])
def handle_posts():
    response_body = {}
    
    if request.method == 'GET':
        posts = Posts.query.all()
        results = [post.serialize() for post in posts]  # Modificado para eliminar user_id
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
                    game_name=post_data['game_name'],
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
@jwt_required()
def handle_post(post_id):
    response_body = {}
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    post = Posts.query.get(post_id)

    if not post:
        return jsonify({'message': 'Publicación inexistente', 'results': {}}), 404

    if request.method == 'GET':
        response_body['results'] = post.serialize(user_id=user_id)
        response_body['message'] = 'Publicación encontrada'
        return jsonify(response_body), 200

    if request.method == 'PUT':
        
        data = request.json
        post.title = data.get('title', post.title)
        post.body = data.get('body', post.body)
        post.game_namw = data.get('game_name', post.game_name)
        post.image_url = data.get('image_url', post.image_url)
        
        db.session.commit()
        response_body['message'] = 'Publicación actualizada'
        response_body['results'] = post.serialize()
        return response_body, 200

    if request.method == 'DELETE':


        db.session.delete(post)
        db.session.commit()
        response_body['message'] = 'Publicación eliminada'
        return jsonify(response_body), 200


@api.route('/videos', methods=['GET', 'POST'])
def handle_videos():
    response_body = {}

    if request.method == 'GET':
        videos = Videos.query.all()
        results = [video.serialize() for video in videos]
        response_body['results'] = results
        response_body['message'] = 'Listado de Videos'
        return jsonify(response_body), 200

    if request.method == 'POST':
        data = request.json

        if not data:
            return jsonify({'message': 'No se enviaron datos'}), 400

        if isinstance(data, dict):
            data = [data]  # Convertir a lista si es un solo objeto

        if isinstance(data, list):
            new_videos = []
            for video_data in data:
                required_fields = ['title', 'embed', 'game_name']
                for field in required_fields:
                    if field not in video_data:
                        return jsonify({'message': f'Falta el campo requerido: {field}'}), 400
                
                new_video = Videos(
                    title=video_data['title'],
                    embed=video_data['embed'], 
                    game_name=video_data['game_name']
                )
                db.session.add(new_video)
                new_videos.append(new_video)
            
            db.session.commit()

            response_body['results'] = [video.serialize() for video in new_videos]
            response_body['message'] = 'Videos añadidos'
            return jsonify(response_body), 201

        else:
            return jsonify({'message': 'El formato de los datos debe ser un objeto o una lista de objetos'}), 400

@api.route('/videos/<int:video_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_video(video_id):
    response_body = {}
    video = Videos.query.get(video_id)  

    if not video:
        return jsonify({'message': 'Video inexistente', 'results': {}}), 404

    if request.method == 'GET':
        response_body['results'] = video.serialize()  
        response_body['message'] = 'Video encontrado'
        return jsonify(response_body), 200  # Corregido aquí

    if request.method == 'PUT':
        data = request.json
        video.title = data.get('title', video.title)  
        video.game_name = data.get('game_name', video.game_name)  # Corregido aquí
        video.embed = data.get('embed', video.embed)  # Corregido aquí

        db.session.commit()
        response_body['message'] = 'Video actualizado'
        response_body['results'] = video.serialize()  
        return jsonify(response_body), 200  

    if request.method == 'DELETE':
        db.session.delete(video)
        db.session.commit()
        response_body['message'] = 'Video eliminado'
        return jsonify(response_body), 200 
    if request.method == 'DELETE':
        db.session.delete(video)
        db.session.commit()
        response_body['message'] = 'Video eliminado'
        return jsonify(response_body), 200

@api.route('/like', methods=['POST', 'DELETE', 'GET'])
@jwt_required()
def handle_likes():
    response_body = {}
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    post_id = request.json.get('post_id')
    game_id = request.json.get('game_id')

    if post_id and game_id:
        return jsonify({'error': 'Cannot like both post and game at the same time'}), 400
    
    if request.method == 'GET':
        likes = Likes.query.filter_by(user_id=user_id).all()
    
        return jsonify([like.serialize() for like in likes]), 200

    if request.method == 'POST':
        if post_id:
            existing_like = Likes.query.filter_by(user_id=user_id, post_id=post_id).first()
            if existing_like:
                return jsonify({'message': 'Ya has dado like a esta publicación'}), 400
            new_like = Likes(user_id=user_id, post_id=post_id)
        elif game_id:
            existing_like = Likes.query.filter_by(user_id=user_id, game_id=game_id).first()
            if existing_like:
                return jsonify({'message': 'Ya has dado like a este juego'}), 400
            new_like = Likes(user_id=user_id, game_id=game_id)
        else:
            return jsonify({'error': 'Debe proporcionar post_id o game_id'}), 400
        
        db.session.add(new_like)
        db.session.commit()
        return jsonify({'message': 'Like agregado'}), 201

    if request.method == 'DELETE':
        if post_id:
            existing_like = Likes.query.filter_by(user_id=user_id, post_id=post_id).first()
            if not existing_like:
                return jsonify({'message': 'No has dado like a esta publicación'}), 400
        elif game_id:
            existing_like = Likes.query.filter_by(user_id=user_id, game_id=game_id).first()
            if not existing_like:
                return jsonify({'message': 'No has dado like a este juego'}), 400
        else:
            return jsonify({'error': 'Debe proporcionar post_id o game_id'}), 400
        
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({'message': 'Like eliminado'}), 200

@api.route('/likes', methods=['GET'])
@jwt_required()
def get_likes():
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    user_likes = Likes.query.filter_by(user_id=user_id).all()
    liked_games = [like.game_to.serialize() for like in user_likes if like.game_id]
    liked_posts = [like.post_to.serialize() for like in user_likes if like.post_id]
    
    return jsonify({
        'liked_games': liked_games,
        'liked_posts': liked_posts
    }), 200


@api.route('/profile_pictures', methods=['GET', 'POST'])
def handle_profile_pictures():
    response_body = {}
    if request.method == 'GET':
        profile_pictures = ProfilePicture.query.all()
        results = [profile_picture.serialize() for profile_picture in profile_pictures]
        response_body['results'] = results
        response_body['message'] = 'Lista de pfps'
        return jsonify(response_body), 200

    if request.method == 'POST':
        data = request.json
        new_profile_picture = ProfilePicture(
            name=data.get('name'),
            url=data.get('url'),
        )
        db.session.add(new_profile_picture)
        db.session.commit()
        response_body['message'] = 'Pfp creada'
        response_body['results'] = new_profile_picture.serialize()
        return jsonify(response_body), 201

@api.route('/profile_pictures/<int:profile_picture_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_profile_picture(profile_picture_id):
    response_body = {}
    profile_picture = ProfilePicture.query.get(profile_picture_id)
    
    if not profile_picture:
        return jsonify({'message': 'Pfp inexistente', 'results': {}}), 404

    if request.method == 'GET':
        response_body['results'] = profile_picture.serialize()
        response_body['message'] = 'Pfp encontrada'
        return jsonify(response_body), 200

    if request.method == 'PUT':
        data = request.json
        profile_picture.name = data.get('name', profile_picture.name)
        profile_picture.url = data.get('url', profile_picture.url)
        db.session.commit()
        response_body['message'] = 'Datos de la pfp actualizados'
        response_body['results'] = profile_picture.serialize()
        return jsonify(response_body), 200

    if request.method == 'DELETE':
        db.session.delete(profile_picture)
        db.session.commit()
        response_body['message'] = 'Pfp eliminada'
        return jsonify(response_body), 200