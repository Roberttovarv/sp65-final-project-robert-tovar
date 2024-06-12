from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum  # Enum?


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    first_name = db.Column(db.String(), unique=False, nullable=False)
    last_name = db.Column(db.String(), unique=False, nullable=False)
    age = db.Column(db.Integer(), unique=False, nullable=False)
    is_admin = db.Column(db.Boolean(80), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>' 

    def serialize(self):
        return {'id': self.id,
                'email': self.email,
                'is_active': self.is_active,
                'first_name': self.first_name,
                'last_name': self.last_name,
                'age': self.age,
                'is_admin': self.is_admin}
    

class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), unique=False, nullable=False)
    body = db.Column(db.String(150), unique=False, nullable=False)
    date = db.Column(db.Date(), unique=False, nullable=True)
    image_url = db.Column(db.String(), unique=False, nullable=True)
    author_id = db.Column(db.Integer, db,ForeignKey('users.id'))  # Hace falta poner nullable aqui?
    author_to = db.relationship('Users, foreign_keys=[user_id]')
    game_id = db.Column(db.Integer, db,ForeignKey('games.id')) 
    game_to = db.relationship('Games, foreign_keys=[game_id]')

    def __repr__(self):
        return f'<User {self.title}>' 

    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'body': self.body,
                'date': self.date,
                'image_url': self.image_url,
                'author_id': self.author_id,
                'game_id': self.games_id}
    

class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    body_img = db.Column(db.String(), unique=True)
    cdk = db.Column(db.String(), unique=True, nullable=False)
    price = db.Column(db.Integer(), unique=False, nullable=False)
    game_id = db.Column(db.Integer, db,ForeignKey('games.id')) 
    game_to = db.relationship('Games, foreign_keys=[game_id]')

    def __repr__(self):
        return f'<User {self.name}>' 

    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'body': self.body,
                'cdk': self.cdk,
                'price': self.price,
                'game_id': self.game_id}
    

class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db,ForeignKey('games.id')) 
    product_to = db.relationship('Games, foreign_keys=[product_id]')
    user_id = db.Column(db.Integer, db,ForeignKey('users.id')) 
    user_to = db.relationship('Users, foreign_keys=[user_id]')


    def __repr__(self):
        return f'<User {self.product_id}>'  # No sabemos bien aqui se aprecia asistencia muchas gracias

    def serialize(self):
        return {'id': self.id,
                'product_id': self.product_id,
                'user_id': self.user_id}


class Games(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), unique=True, nullable=False)
    image_url = db.Column(db.String(), unique=True)
    description = db.Column(db.String(), unique=False, nullable=False)
    genre = db.Column(db.String(), unique=False, nullable=False)
    platform = db.Column(Enum('computer', 'playstation', 'xbox', 'switch', 'mobile', name='platform_enum'), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.title}>' 

    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'image_url': self.image_url,
                'description': self.description,
                'genre': self.genre,
                'platform': self.platform}


class CarItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer(), unique=False, nullable=False)
    price = db.Column(db.Integer(), unique=False, nullable=False)
    product_id = db.Column(db.Integer, db,ForeignKey('caritems.id')) 
    product_to = db.relationship('CarItems, foreign_keys=[product_id]')

    def __repr__(self):
        return f'<User {self.products_id}>'  # No sabemos bien

    def serialize(self):
        return {'id': self.id,
                'product_id': self.products_id,
                'quantity': self.quantity,
                'price': self.price}
  

class Carts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum('en proceso', 'cancelado'), unique=False)
    date = db.Column(db.Date(), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db,ForeignKey('users.id')) 
    user_to = db.relationship('Users, foreign_keys=[user_id]')

    def __repr__(self):
        return f'<User {self.status}>' 

    def serialize(self):
        return {'id': self.id,
                'user_id': self.user_id,
                'status': self.status,
                'date': self.date}

class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer(), unique=True)
    date = db.Column(db.Date(), unique=False, nullable=False)
    price_total = db.Column(db.Integer(), unique=False, nullable=False)
    status = db.Column(db.Enum('pagado', 'cancelado', 'pendiente de pago'), unique=False)

    def __repr__(self):
        return f'<User {self.status}>' 

    def serialize(self):
        return {'id': self.id,
                'user_id': self.products_id,
                'date': self.quantity,
                'price_total': self.price_total,
                'status': self.status}


class OrderItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer(), unique=True)
    product_id = db.Column(db.Integer(), unique=True)
    quantity = db.Column(db.Integer(), unique=False, nullable=False)
    price = db.Column(db.Integer(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.order_id}>' 

    def serialize(self):
        return {'id': self.id,
                'order_id': self.order_id,
                'product_id': self.product_id,
                'quantity': self.quantity,
                'price': self.price}


