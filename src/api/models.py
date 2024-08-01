from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from flask import request, jsonify
from datetime import datetime
import re


def delete_html_tags(text):
        clean = re.compile('<.*?>')
        return re.sub(clean, '', text)

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=True)
    first_name = db.Column(db.String(), unique=False, nullable=True)
    last_name = db.Column(db.String(), unique=False, nullable=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=True)
    pfp = db.Column(db.String(), unique=False, nullable=True)

    def __repr__(self):
        return f'<User {self.email}>'
        
    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'is_active': self.is_active,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'username': self.username,
            'is_admin': self.is_admin,
            'pfp': self.pfp
        }


class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), unique=False, nullable=False)
    game_name = db.Column(db.String(), unique=False, nullable=True)
    body = db.Column(db.String(), unique=False, nullable=False)
    date = db.Column(db.Date(), unique=False, nullable=True)
    image_url = db.Column(db.String(), unique=False, nullable=True)

    def __repr__(self):
        return f'<Post {self.title}>'

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'game_name': self.game_name,
            'body': self.body,
            'date': self.date,
            'image_url': self.image_url,
            'likes': len(self.likes),
            'comments': [comment.serialize() for comment in self.comments]
        }




class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=True)
    user_to = db.relationship('Users', foreign_keys=[user_id])
    post_to = db.relationship('Posts', backref='likes', foreign_keys=[post_id])
    game_to = db.relationship('Games', backref='likes', foreign_keys=[game_id])

    def __repr__(self):
        return f'<Like {self.id}>'

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'game_id': self.game_id
        }


class Games(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    background_image = db.Column(db.String(), unique=False, nullable=True) 
    description = db.Column(db.String(), unique=False, nullable=False)
    released_at = db.Column(db.String(), unique=False, nullable=True)
    metacritic = db.Column(db.Integer(), unique=False, nullable=True)

    def __repr__(self):
        return f'<Game {self.name}>'
    
    def clean_description(self):
        return delete_html_tags(self.description)
        
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'background_image': self.background_image, 
            'description': self.clean_description(),
            'metacritic': self.metacritic,
            'released_at': self.released_at,
            'likes': len(self.likes),
            'comments': [comment.serialize() for comment in self.comments]
        }


class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(), nullable=False)
    date = db.Column(db.DateTime(), default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=True)
    
    user = db.relationship('Users', backref='comments')
    post = db.relationship('Posts', backref='comments', foreign_keys=[post_id])
    game = db.relationship('Games', backref='comments', foreign_keys=[game_id])

    def __repr__(self):
        return f'<Comment {self.body}>'

    def serialize(self):
        return {
            'id': self.id,
            'body': self.body,
            'date': self.date,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'game_id': self.game_id
        }

class Videos(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    embed = db.Column(db.String(), unique=True, nullable=False)
    title = db.Column(db.String(), nullable=True)
    game_name = db.Column(db.String(), nullable=True)

    def __repr__(self):
        return f'<Video {self.title}>'

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'embed': self.embed,
            'game_name': self.game_name
        }
