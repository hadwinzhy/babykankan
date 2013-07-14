# -*- coding: utf-8 -*-


from flask import request, jsonify
from flask.ext.login import current_user, login_user, logout_user
from babykankan import app, db, lm
from babykankan.helpers import MyException, login_required
from babykankan.models import User, ItemSharing


@lm.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.before_first_request
def create():
    db.create_all()
    user1 = User(u'Alice', u'1234')
    user2 = User(u'Bob', u'1234')
    db.session.add_all([user1, user2])
    db.session.commit()


@app.route('/login/', methods=['POST'])
def login():
    try:
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter('username = :username').params(username=username).first()
        if not user:
            raise MyException(u'用户名不存在！')
        if user.password != password:
            raise MyException(u'密码错误！')
        friends_ids = []
        friends_usernames = []
        for friend in user.friends:
            friends_ids.append(friend.id)
            friends_usernames.append(friend.username)
        login_user(user)
    except MyException as e:
        return jsonify(success = False,
                       message = e.message)
    return jsonify(success = True,
                   f_ids = friends_ids,
                   f_names = friends_usernames)


@app.route('/logout/', methods = ['GET'])
@login_required
def logout():
    logout_user()
    return jsonify(success = True)


@app.route('/share/', methods = ['POST'])
@login_required
def share():
    try:
        to_user_id = int(request.form.get('to_user_id'))
        num_iid = int(request.form.get('num_iid'))
        to_user = User.query.get(to_user_id)
        if not to_user:
            raise MyException(u'Request Error!')
        item_sharing = ItemSharing(from_user = current_user,
                                   to_user = to_user,
                                   num_iid = num_iid)
        db.session.add(item_sharing)
        db.session.commit()
    except ValueError as e:
        return jsonify(success = False,
                       message = u'Request Error!')
    return jsonify(success = True)


@app.route('/read_sharing/', methods = ['GET'])
@login_required
def read_sharing():
    try:
        num_iids = []
        for sharing in current_user.sharings_received:
            num_iids.append(sharing.num_iid)
            sharing.read = True
        db.session.commit()
    except MyException as e:
        pass
    return jsonify(success = True,
                   num_iids = num_iids)
