# -*- coding: utf-8 -*-

from functools import wraps
from flask import jsonify
from flask.ext.login import current_user


class MyException(Exception):
    def __init__(self, message):
        self.message = message


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated():
            return jsonify(success = False,
                           message = u'您还未登录！')
        return f(*args, **kwargs)
    return wrapper
