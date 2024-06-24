from flask_sqlalchemy import SQLAlchemy



db = SQLAlchemy()
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=True)
    first_name = db.Column(db.String(), unique=False, nullable= True)
    last_name = db.Column(db.String(), unique=False, nullable= True)
    age = db.Column(db.Integer(), unique=False, nullable=True)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=True)
    carts = db.relationship('Carts', backref='user', uselist=False)  
    orders = db.relationship('Orders', backref='user', lazy=True)

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
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    author_to = db.relationship('Users', foreign_keys=[author_id])
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    game_to = db.relationship('Games', foreign_keys=[game_id])
    def __repr__(self):
        return f'<Post {self.title}>'
    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'body': self.body,
                'date': self.date,
                'image_url': self.image_url,
                'author_id': self.author_id,
                'game_id': self.game_id}


class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=False, nullable=True)
    body_img = db.Column(db.String(), unique=False, nullable=True)
    cdk = db.Column(db.String(), unique=True, nullable=False)
    price = db.Column(db.Integer(), unique=False, nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))
    game_to = db.relationship('Games', foreign_keys=[game_id])
    platform = db.Column(db.Enum('computer', 'playstation', 'xbox', 'switch', 'mobile', name='platform_enum'), unique=False, nullable=False)
    def __repr__(self):
        return f'<Product {self.name}>'
        
    def serialize(self):
        return {'id': self.id,
                'name': self.name,
                'body_img': self.body_img,
                'cdk': self.cdk,
                'price': self.price,
                'game_id': self.game_id,
                'platform': self.platform}


class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    product_to = db.relationship('Products', foreign_keys=[product_id])
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id])
    def __repr__(self):
        return f'<Like {self.id}>'
        
    def serialize(self):
        return {'id': self.id,
                'product_id': self.product_id,
                'user_id': self.user_id}


class Games(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), unique=True, nullable=False)
    image_url = db.Column(db.String(), unique=True, nullable=True) 
    description = db.Column(db.String(), unique=False, nullable=False)
    genre = db.Column(db.String(), unique=False, nullable=False)
    platform = db.Column(db.String(), unique=False, nullable=False)
    def __repr__(self):
        return f'<Game {self.title}>'
        
    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'image_url': self.image_url, 
                'description': self.description,
                'platform': self.platform,
                'genre': self.genre}


class CartItems(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, unique=False, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id')) 
    product_to = db.relationship('Products', foreign_keys=[product_id])
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.id'))
    cart_to = db.relationship('Carts', foreign_keys=[cart_id])
    cart = db.relationship('Carts', backref='cart_items')

    def __repr__(self):
        return f'<CarItem {self.product_id}>'

    def serialize(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'price': self.product_to.price
            'cart_id': self.cart_id}


class Carts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)  
    user_to = db.relationship('Users', foreign_keys=[user_id]) 
    status = db.Column(db.Enum('en proceso', 'inactivo', name='status'), unique=False)
    def __repr__(self):
        return f'<Cart {self.id}>'

    def total_price(self):
        return sum(item.product_to.price * item.quantity for item in self.cart_items)
        
    def serialize(self):
        return {'id': self.id,
                'user_id': self.user_id,
                'status': self.status}

class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date(), unique=False, nullable=False)
    price_total = db.Column(db.Integer(), unique=False, nullable=False) 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user_to = db.relationship('Users', foreign_keys=[user_id])
    status = db.Column(db.Enum('pagado', 'cancelado', 'pendiente de pago', name='status'), unique=False)
    order_items = db.relationship('OrderItems', backref='order', lazy=True)
    def __repr__(self):
        return f'<Order {self.id}>'
        
    def serialize(self):
        return {'id': self.id,
                'user_id': self.user_id,
                'date': self.date,
                'status': self.status,
                'price_total': self.price_total} 

                
class OrderItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer(), unique=False, nullable=False)
    price = db.Column(db.Integer(), unique=False, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    order_to = db.relationship('Orders', foreign_keys=[order_id])
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    product_to = db.relationship('Products', foreign_keys=[product_id])
    def __repr__(self):
        return f'<OrderItem {self.id}>'
        
    def serialize(self):
        return {'id': self.id,
                'order_id': self.order_id,
                'product_id': self.product_id,
                'quantity': self.quantity,
                'price': self.price}
