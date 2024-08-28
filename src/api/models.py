from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from flask import request, jsonify
from datetime import datetime
import re
from flask_jwt_extended import get_jwt_identity, jwt_required

def delete_html_tags(text):
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean(), nullable=True)
    first_name = db.Column(db.String(), nullable=True)
    last_name = db.Column(db.String(), nullable=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    is_admin = db.Column(db.Boolean(), nullable=True)
    pfp_id = db.Column(db.Integer, db.ForeignKey('profile_picture.id'), nullable=True)
    pfp = db.relationship('ProfilePicture', backref='users', lazy=True)

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
            'pfp': self.pfp.url if self.pfp else None
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

    def serialize(self, user_id=None):
        is_liked = False
        if user_id:
            is_liked = Likes.query.filter_by(user_id=user_id, post_id=self.id).first() is not None

        return {
            'id': self.id,
            'title': self.title,
            'game_name': self.game_name,
            'body': self.body,
            'date': self.date,
            'image_url': self.image_url,
            'likes': len(self.likes),
            'comments': [comment.serialize() for comment in self.comments],
            'is_liked': is_liked
        }


class Games(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    background_image = db.Column(db.String(), unique=False, nullable=True) 
    description = db.Column(db.String(), unique=False, nullable=False)
    released_at = db.Column(db.String(), unique=False, nullable=True)
    metacritic = db.Column(db.Float(), unique=False, nullable=True)

    def __repr__(self):
        return f'<Game {self.name}>'
    
    def clean_description(self):
        return delete_html_tags(self.description)
        
    def serialize(self, user_id=None):
        is_liked = False
        if user_id:
            is_liked = Likes.query.filter_by(user_id=user_id, game_id=self.id).first() is not None

        return {
            'id': self.id,
            'name': self.name,
            'background_image': self.background_image, 
            'description': self.clean_description(),
            'metacritic': self.metacritic,
            'released_at': self.released_at,
            'likes': len(self.likes),
            'comments': [comment.serialize() for comment in self.comments],
            'is_liked': is_liked
        }

class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'))
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

class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(), nullable=False)
    date = db.Column(db.DateTime(), default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False,)
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
            'game_id': self.game_id,
            'username': self.user.username if self.user else None,
            'user_pfp': self.user.pfp.url if self.user and self.user.pfp else None,
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

class ProfilePicture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(), unique=True, nullable=False)
    name = db.Column(db.String(), nullable=True)

    def __repr__(self):
        return f'<ProfilePicture {self.name}>'

    def serialize(self):
        return {
            'id': self.id,
            'url': self.url,
            'name': self.name,
        }
