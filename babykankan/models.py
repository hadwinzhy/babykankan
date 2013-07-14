# -*- coding: utf-8 -*-

from babykankan import db
from flask.ext.login import UserMixin


friendship = db.Table('friendships',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('friend_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
)


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    password = db.Column(db.String(256))

    friends = db.relationship('User',
                              secondary=friendship,
                              primaryjoin=id==friendship.c.user_id,
                              secondaryjoin=id==friendship.c.friend_id,
                              backref='reverse_friends')

    def __init__(self, username, password):
        self.username = username
        self.password = password


class ItemSharing(db.Model):
    __tablename__ = 'item_sharings'
    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    num_iid = db.Column(db.Integer, nullable=False)
    read = db.Column(db.Boolean, nullable=False, default=False)

    from_user = db.relationship('User', foreign_keys=[from_user_id], backref=db.backref('sharings_sent', lazy='dynamic', cascade='all, delete-orphan'))
    to_user = db.relationship('User', foreign_keys=[to_user_id], backref=db.backref('sharings_received', lazy='dynamic', cascade='all, delete-orphan'))

    def __init__(self, from_user, to_user, num_iid):
        self.from_user = from_user
        self.to_user = to_user
        self.num_iid = num_iid
