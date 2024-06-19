"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from api.models import db, Users, Games, Carts, CartItems, Products, Orders, OrderItems, Posts



api = Blueprint('api', __name__)
CORS(api)  


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body["message"] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200

@api.route('/users', methods=['GET', 'POST'])  
def handle_users():
    response_body = {}
    if request.method == 'GET':
       
        rows = db.session.execute(db.select(Users)).scalars()
        results = [row.serialize() for row in rows]  
        response_body['results'] = results
        response_body['message'] = 'Listado de Usuarios'
        return response_body, 200
    if request.method == 'POST':
        response_body['message'] = 'Este endpoint no es válido. Ud debe hacer un /signup'
        return response_body, 200
    
@api.route('/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_user(user_id):
    response_body = {}
    if request.method == 'GET':
        user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        if user:
            response_body['results'] = user.serialize()
            response_body['message'] = 'Usuario encontrado'
            return response_body, 200
        response_body['message'] = 'Usario inexistente'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'PUT':
        data = request.json
        user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        if user:
            user.email = data['email']
            user.is_active = data['is_active']
            user.first_name = data['first_name']
            user.last_name = data['last_name']
            user.age = data['age']
            user.pfp = data ['pfp']
            user.is_admin = ['is_admin']
            db.session.commit()
            response_body['message'] = 'Datos del usuario actualizados'
            response_body['results'] = user.serialize()
            return response_body, 200
        response_body['message'] = 'Usario inexistente'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'DELETE':
        user = db.session.execute(db.select(Users).where(Users.id == user_id)).scalar()
        if user:
            db.session.delete(user)
            user.is_active = False
            db.session.commit()
            response_body['message'] = 'Usuario eliminado'
            response_body['results'] = {}
            return response_body, 200
        response_body['message'] = 'Usuario inexistente'
        response_body['results'] = {}
        return response_body, 200
    
@api.route('/games', methods=['GET', 'POST'])  
def handle_games():
    response_body = {}
    if request.method == 'GET':
       
        rows = db.session.execute(db.select(Games)).scalars()
        results = [row.serialize() for row in rows]  
        response_body['results'] = results
        response_body['message'] = 'Listado de Videojuegos'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        required_fields = ['title', 'description', 'genre', 'platform', 'image_url']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Falta el campo requerido: {field}'}), 400
        row = Games()
        row.title = data['title']
        row.description = data['description']
        row.image_url = data['image_url']
        row.genre = data['genre']
        row.platform = data['platform']  
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Videojuego creado'
        return response_body, 201
    
@api.route('/games/<int:game_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_game(game_id):
    response_body = {}
    if request.method == 'GET':
        game = db.session.execute(db.select(Games).where(Games.id == game_id)).scalar()
        if game:
            response_body['results'] = game.serialize()
            response_body['message'] = 'Videojuego encontrado'
            return response_body, 200
        response_body['message'] = 'Videojuego inexistente'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'PUT':
        data = request.json
        game = db.session.execute(db.select(Games).where(Games.id == game_id)).scalar()
        if game:
            game.title = data['title']
            game.image_url = data['image_url']
            game.genre = data['genre']
            game.platform = data['platform']
            game.description = data['description']
            db.session.commit()
            response_body['message'] = 'Datos del videojuego actualizados'
            response_body['results'] = game.serialize()
            return response_body, 200
        response_body['message'] = 'Videojuego inexistente'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'DELETE':
        game = db.session.execute(db.select(Games).where(Games.id == game_id)).scalar()
        if game:
            db.session.delete(game)
            db.session.commit()
            response_body['message'] = 'Videojuego eliminado'
            response_body['results'] = {}
            return response_body, 200
        response_body['message'] = 'Videojuego inexistente'
        response_body['results'] = {}
        return response_body, 404
    
@api.route('/posts', methods=['GET', 'POST'])  
def handle_posts():
    response_body = {}
    if request.method == 'GET':
       
        rows = db.session.execute(db.select(Posts)).scalars()
        results = [row.serialize() for row in rows]  
        response_body['results'] = results
        response_body['message'] = 'Listado de Publicaciones'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        required_fields = ['title', 'body', 'game_id', 'image_url', 'author_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Falta el campo requerido: {field}'}), 400
        row = Posts()
        row.title = data['title']
        row.body = data['body']
        row.image_url = data['image_url']
        row.game_id = data['game_id']
        row.author_id = data['author_id']
        row.date = datetime.today()
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Publicación creada'
        return response_body, 201
    
@api.route('/posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_post(post_id):
    response_body = {}
    if request.method == 'GET':
        post = db.session.execute(db.select(Posts).where(Posts.id == post_id)).scalar()
        if post:
            response_body['results'] = post.serialize()
            response_body['message'] = 'Publicación encontrada'
            return response_body, 200
        response_body['message'] = 'Publicación inexistente'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'PUT':
        data = request.json
        post = db.session.execute(db.select(Posts).where(Posts.id == post_id)).scalar()
        if post:
            post.title = data['title']
            post.description = data['description']
            post.image_url = data['image_url']
            post.body = data['body']
            post.game_id = data['game_id']
            db.session.commit()
            response_body['message'] = 'Publicación actualizada'
            response_body['results'] = post.serialize()
            return response_body, 200
        response_body['message'] = 'Publicación inexistente'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'DELETE':
        post = db.session.execute(db.select(Posts).where(Posts.id == post_id)).scalar() 
        if post:
            db.session.delete(post)
            db.session.commit()
            response_body['message'] = 'Publicación eliminada'
            response_body['results'] = {}
            return response_body, 200
        response_body['message'] = 'Publicación inexistente'
        response_body['results'] = {}
        return response_body, 404
    
@api.route('/products', methods=['GET', 'POST'])  
def handle_products():
    response_body = {}
    if request.method == 'GET':
       
        rows = db.session.execute(db.select(Products)).scalars()
        results = [row.serialize() for row in rows]  
        response_body['results'] = results
        response_body['message'] = 'Listado de Productos'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        required_fields = ['name', 'cdk', 'body_img', 'game_id', 'price']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'Falta el campo requerido: {field}'}), 400
        row = Products()
        row.name = data['name']
        row.cdk = data['cdk']
        row.body_img = data['body_img']
        row.game_id = data['game_id']  
        row.price = data['price']
        row.platform = data['platform']
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Producto añadido'
        return response_body, 201
    
@api.route('/products/<int:product_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_product(product_id):
    response_body = {}
    if request.method == 'GET':
        product = db.session.execute(db.select(Products).where(Products.id == product_id)).scalar()
        if product:
            response_body['results'] = product.serialize()
            response_body['message'] = 'Producto encontrado'
            return response_body, 200
        response_body['message'] = 'Producto inexistente'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'PUT':
        data = request.json
        product = db.session.execute(db.select(Products).where(Products.id == product_id)).scalar()
        if product:
            product.name = data['name']
            product.cdk = data['cdk']
            product.body_img = data['body_img']
            product.game_id = data['game_id'] # Preguntar
            product.price = data['price']
            db.session.commit()
            response_body['message'] = 'Producto actualizado'
            response_body['results'] = product.serialize()
            return response_body, 200
        response_body['message'] = 'Producto inexistente'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'DELETE':
        product = db.session.execute(db.select(Products).where(Products.id == product_id)).scalar()
        if product:
            db.session.delete(product)
            db.session.commit()
            response_body['message'] = 'Producto eliminado'
            response_body['results'] = {}
            return response_body, 200
        response_body['message'] = 'Producto inexistente'
        response_body['results'] = {}
        return response_body, 404
    
@api.route('/carts', methods=['GET', 'POST'])  
def handle_carts():
    response_body = {}
    if request.method == 'GET':
       
        rows = db.session.execute(db.select(Carts)).scalars()
        results = [row.serialize() for row in rows]  
        response_body['results'] = results
        response_body['message'] = 'Listado de Carritos'
        return response_body, 200
    if request.method == 'POST':
        row = Products()
        row.user_id = data['user_id']
        row.status = data['status']
        row.date = datetime.today()
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Carrito creado'
        return response_body, 201
    
@api.route('/carts/<int:cartitem_id>', methods=['GET', 'POST', 'DELETE']) 
def handle_cartitem(cartitem_id):
    response_body = {}
    if request.method == 'GET':
        cartitem = db.session.execute(db.select(CartItems).where(CartItems.id == cartitem_id)).scalar()
        if cartitem:
            response_body['results'] = cartitem.serialize()
            response_body['message'] = 'Productos encontrados'
            return response_body, 200
        response_body['message'] = 'Productos inexistentes'
        response_body['results'] = {}
        return response_body, 404
    if request.method == 'POST':
        row = CartItems()
        row.product_id = data['product_id']
        row.quantity = data['quantity']
        row.price = data['price']
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Productos añadidos'
        return response_body, 201
    if request.method == 'DELETE':
        cartitem = db.session.execute(db.select(CartItems).where(CartItems.id == cartitem_id)).scalar()
        if cartitem:
            db.session.delete(cartitem)
            db.session.commit()
            response_body['message'] = 'Productos eliminados'
            response_body['results'] = {}
            return response_body, 200
        response_body['message'] = 'Productos inexistentes'
        response_body['results'] = {}
        return response_body, 404
    
@api.route('/orders', methods=['GET', 'POST'])  
def handle_orders():
    response_body = {}
    if request.method == 'GET':
       
        rows = db.session.execute(db.select(Orders)).scalars()
        results = [row.serialize() for row in rows]  
        response_body['results'] = results
        response_body['message'] = 'Listado de Ordenes'
        return response_body, 200
    if request.method == 'POST':
        row = Orders()
        row.user_id = data['user_id']
        row.status = data['status']
        row.price_total = data['price_total']
        row.date = datetime.today()
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Orden creada'
        return response_body, 201

@api.route('/orders/<int:orderitem_id>', methods=['GET', 'POST'])  
def handle_orderitems():
    response_body = {}
    if request.method == 'GET':
       
        rows = db.session.execute(db.select(OrderItems)).scalars()
        results = [row.serialize() for row in rows]  
        response_body['results'] = results
        response_body['message'] = 'Listado de Productos de la Orden'
        return response_body, 200
    if request.method == 'POST':
        row = OrderItems()
        row.user_id = data['user_id']
        row.product_id = data['product_id']
        row.price_total = data['price_total']
        row.quantity = data['quantity']
        row.date = datetime.today()
        db.session.add(row)
        db.session.commit()
        response_body['results'] = row.serialize()
        response_body['message'] = 'Orden creada'
        return response_body, 201
