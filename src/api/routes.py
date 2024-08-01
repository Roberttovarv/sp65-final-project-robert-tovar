from flask import Flask, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from models import db, Users, Games, Posts, Videos, Likes, Comments  # Asegúrate de importar los modelos necesarios

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret"  # Cambia esta clave por una secreta y segura
jwt = JWTManager(app)

@app.route('/games', methods=['GET', 'POST'])
def handle_games():
    response_body = {}
    if request.method == 'GET':
        games = Games.query.all()
        results = [game.serialize() for game in games]
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
        response_body['results'] = new_game.serialize()
        return jsonify(response_body), 201

@app.route('/games/<int:game_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_game(game_id):
    response_body = {}
    game = Games.query.get(game_id)
    
    if not game:
        return jsonify({'message': 'Videojuego inexistente', 'results': {}}), 404

    if request.method == 'GET':
        response_body['results'] = game.serialize()
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
        response_body['results'] = game.serialize()
        return jsonify(response_body), 200

    if request.method == 'DELETE':
        db.session.delete(game)
        db.session.commit()
        response_body['message'] = 'Videojuego eliminado'
        return jsonify(response_body), 200

@app.route('/posts', methods=['GET', 'POST'])
def handle_posts():
    response_body = {}
    
    if request.method == 'GET':
        posts = Posts.query.all()
        results = [post.serialize() for post in posts]
        response_body['results'] = results
        response_body['message'] = 'Lista de publicaciones'
        return jsonify(response_body), 200

    if request.method == 'POST':
        data = request.json
        new_post = Posts(
            title=data.get('title'),
            game_name=data.get('game_name'),
            body=data.get('body'),
            date=datetime.strptime(data.get('date'), '%Y-%m-%d') if data.get('date') else None,
            image_url=data.get('image_url')
        )
        db.session.add(new_post)
        db.session.commit()
        response_body['message'] = 'Publicación creada'
        response_body['results'] = new_post.serialize()
        return jsonify(response_body), 201

@app.route('/posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_post(post_id):
    response_body = {}
    post = Posts.query.get(post_id)
    
    if not post:
        return jsonify({'message': 'Publicación inexistente', 'results': {}}), 404

    if request.method == 'GET':
        response_body['results'] = post.serialize()
        response_body['message'] = 'Publicación encontrada'
        return jsonify(response_body), 200

    if request.method == 'PUT':
        data = request.json
        post.title = data.get('title', post.title)
        post.game_name = data.get('game_name', post.game_name)
        post.body = data.get('body', post.body)
        post.date = datetime.strptime(data.get('date'), '%Y-%m-%d') if data.get('date') else post.date
        post.image_url = data.get('image_url', post.image_url)
        db.session.commit()
        response_body['message'] = 'Datos de la publicación actualizados'
        response_body['results'] = post.serialize()
        return jsonify(response_body), 200

    if request.method == 'DELETE':
        db.session.delete(post)
        db.session.commit()
        response_body['message'] = 'Publicación eliminada'
        return jsonify(response_body), 200

@app.route('/videos', methods=['GET', 'POST'])
def handle_videos():
    response_body = {}
    
    if request.method == 'GET':
        videos = Videos.query.all()
        results = [video.serialize() for video in videos]
        response_body['results'] = results
        response_body['message'] = 'Lista de videos'
        return jsonify(response_body), 200

    if request.method == 'POST':
        data = request.json
        new_video = Videos(
            embed=data.get('embed'),
            title=data.get('title'),
            game_name=data.get('game_name')
        )
        db.session.add(new_video)
        db.session.commit()
        response_body['message'] = 'Video creado'
        response_body['results'] = new_video.serialize()
        return jsonify(response_body), 201

@app.route('/videos/<int:video_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_video(video_id):
    response_body = {}
    video = Videos.query.get(video_id)
    
    if not video:
        return jsonify({'message': 'Video inexistente', 'results': {}}), 404

    if request.method == 'GET':
        response_body['results'] = video.serialize()
        response_body['message'] = 'Video encontrado'
        return jsonify(response_body), 200

    if request.method == 'PUT':
        data = request.json
        video.embed = data.get('embed', video.embed)
        video.title = data.get('title', video.title)
        video.game_name = data.get('game_name', video.game_name)
        db.session.commit()
        response_body['message'] = 'Datos del video actualizados'
        response_body['results'] = video.serialize()
        return jsonify(response_body), 200

    if request.method == 'DELETE':
        db.session.delete(video)
        db.session.commit()
        response_body['message'] = 'Video eliminado'
        return jsonify(response_body), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', None)
    password = data.get('password', None)

    user = Users.query.filter_by(email=email, password=password).first()
    
    if user is None:
        return jsonify({'message': 'Email o contraseña inválidos'}), 401
    
    access_token = create_access_token(identity={'user_id': user.id, 'email': user.email})
    return jsonify({'token': access_token}), 200

# Rutas adicionales para manejar likes y comentarios

@app.route('/profile/likes', methods=['GET'])
@jwt_required()
def get_profile_with_likes():
    current_user = get_jwt_identity()
    user = Users.query.get(current_user['user_id'])
    
    if user:
        response_body = {
            'message': 'Perfil encontrado',
            'results': user.serialize()
        }
        response_body['results']['liked_posts'] = [like.post_to.serialize() for like in Likes.query.filter_by(user_id=user.id, post_id!=None).all()]
        response_body['results']['liked_games'] = [like.game_to.serialize() for like in Likes.query.filter_by(user_id=user.id, game_id!=None).all()]
        return jsonify(response_body), 200
    else:
        response_body = {
            'message': 'Perfil no encontrado'
        }
        return jsonify(response_body), 404

@app.route('/posts/<int:post_id>/comment', methods=['POST'])
@jwt_required()
def comment_post(post_id):
    data = request.json
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    body = data.get('body')

    if not body:
        return jsonify({'message': 'Falta el campo requerido: body'}), 400

    new_comment = Comments(body=body, user_id=user_id, post_id=post_id)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify(new_comment.serialize()), 201

@app.route('/games/<int:game_id>/comment', methods=['POST'])
@jwt_required()
def comment_game(game_id):
    data = request.json
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    body = data.get('body')

    if not body:
        return jsonify({'message': 'Falta el campo requerido: body'}), 400

    new_comment = Comments(body=body, user_id=user_id, game_id=game_id)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify(new_comment.serialize()), 201

@app.route('/posts/<int:post_id>/like', methods=['POST', 'DELETE'])
@jwt_required()
def like_post(post_id):
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    existing_like = Likes.query.filter_by(user_id=user_id, post_id=post_id).first()
    
    if request.method == 'POST':
        if existing_like:
            return jsonify({'message': 'Ya has dado like a esta publicación'}), 400
        
        new_like = Likes(user_id=user_id, post_id=post_id)
        db.session.add(new_like)
        db.session.commit()
        return jsonify({'message': 'Like agregado a la publicación'}), 201
    
    if request.method == 'DELETE':
        if not existing_like:
            return jsonify({'message': 'No has dado like a esta publicación'}), 400
        
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({'message': 'Like eliminado de la publicación'}), 200

@app.route('/games/<int:game_id>/like', methods=['POST', 'DELETE'])
@jwt_required()
def like_game(game_id):
    current_user = get_jwt_identity()
    user_id = current_user['user_id']
    existing_like = Likes.query.filter_by(user_id=user_id, game_id=game_id).first()
    
    if request.method == 'POST':
        if existing_like:
            return jsonify({'message': 'Ya has dado like a este juego'}), 400
        
        new_like = Likes(user_id=user_id, game_id=game_id)
        db.session.add(new_like)
        db.session.commit()
        return jsonify({'message': 'Like agregado al juego'}), 201
    
    if request.method == 'DELETE':
        if not existing_like:
            return jsonify({'message': 'No has dado like a este juego'}), 400
        
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({'message': 'Like eliminado del juego'}), 200

if __name__ == '__main__':
    app.run(debug=True)
