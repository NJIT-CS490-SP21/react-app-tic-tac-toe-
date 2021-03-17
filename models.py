'''manage DB '''
# pylint: disable=E1101
# pylint: disable=C0413
# pylint: disable=W1508
# pylint: disable=R0903
# pylint: disable=W0603
from app import DB


class Person(DB.Model):
    ''' manage DB'''
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    score = DB.Column(DB.Integer, unique=False, nullable=False)
    date = DB.Column(DB.DateTime, unique=False, nullable=False)

    def __repr__(self):
        return '<Person %r>' % self.username
