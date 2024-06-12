from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    first_name = db.Column(db.String(), unique=False, nullable=True)
    last_name = db.Column(db.String(), unique=False, nullable=True)
    age = db.Column(db.Integer(), unique=False, nullable=True)
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
    title = db.Column(db.String(), unique=False, nullable=True)
    body = db.Column(db.String(150), unique=False, nullable=True)
    date = db.Column(db.Date(), unique=False, nullable=True)
    image_url = db.Column(db.String(), unique=False, nullable=True)
    author_id = db.Column(db.Integer(), unique=True, nullable=True)
    games_id = db.Column(db.Boolean(), unique=True, nullable=True)

    def __repr__(self):
        return f'<User {self.title}>' 

    def serialize(self):
        return {'id': self.id,
                'title': self.title,
                'body': self.body,
                'date': self.date,
                'image_url': self.image_url,
                'author_id': self.author_id,
                'games_id': self.games_id}
    

class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=True)
    body_img = db.Column(db.String(), unique=True, nullable=True)
    cdk = db.Column(db.String(), unique=True, nullable=True)
    price = db.Column(db.Integer(), unique=False, nullable=True)
    game_id = db.Column(db.Integer(), unique=True, nullable=False)

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
    product_id = db.Column(db.Integer(), unique=True, nullable=True)
    user_id = db.Column(db.Integer(), unique=True, nullable=True)


    def __repr__(self):
        return f'<User {self.product_id}>'  # No sabemos bien aqui se aprecia asistencia muchas gracias

    def serialize(self):
        return {'id': self.id,
                'product_id': self.product_id,
                'user_id': self.user_id}
    
    

 



