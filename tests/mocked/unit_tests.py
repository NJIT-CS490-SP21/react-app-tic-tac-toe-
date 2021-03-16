import os
import sys
from unittest import TestCase
from flask import Flask, session
sys.path.append(os.path.abspath('../../'))
import unittest
import unittest.mock as mock
from unittest.mock import patch
import models
from app import APP
from datetime import date
from app import add_user
from app import get_all_users

INPUT = ""
EXPECTED_OUTPUT = "expected"
INITIAL_USER = 'Gabin'

intitia_user = models.Person(username=INITIAL_USER,
                             score=100,
                             date=date.today())
intitia_user2 = models.Person(username='user11', score=100, date=date.today())
intitia_user3 = models.Person(username='user21', score=100, date=date.today())
intitia_user4 = models.Person(username='user31', score=100, date=date.today())
lst2 = [intitia_user]
lst = [intitia_user]
lst3 = [INITIAL_USER]
d = {}
dict = {'user1': 100, 'user2': 100}


class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        
        self.success_test_params = [{
            INPUT: {
                'dic': {
                    'X': 'user1',
                    'O': 'user2'
                }
            },
            EXPECTED_OUTPUT: [INITIAL_USER, 'user1', 'user2']
        }, {
            INPUT: {
                'dic': {
                    'X': 'user3',
                    'O': 'user4'
                }
            },
            EXPECTED_OUTPUT:
            [INITIAL_USER, 'user1', 'user2', 'user3', 'user4']
        }, {
            INPUT: {
                'dic': {
                    'X': 'user5'
                }
            },
            EXPECTED_OUTPUT:
            [INITIAL_USER, 'user1', 'user2', 'user3', 'user4']
        }]
        self.success_test_params2 = [{
            INPUT: intitia_user2,
            EXPECTED_OUTPUT: ''
        }, {
            INPUT: intitia_user3,
            EXPECTED_OUTPUT: ''
        }, {
            INPUT: intitia_user4,
            EXPECTED_OUTPUT: ''
        }]

    def mocked_person(self):
        return lst2

    def mocked_add(self, user):
        lst2.append(user)

    def mocked_commit(self):
        pass
    def mocked_emit(self,foo, data, broadcast=True, include_self=False):
        pass

    def test_add_user(self):
        for test in self.success_test_params:
           
            with patch('models.Person.query') as mocked_query:
                mocked_query.all = self.mocked_person
                with patch('app.DB.session.add', self.mocked_add):
                    with patch('app.DB.session.commit', self.mocked_commit):
                        with patch('app.SOCKETIO.emit', self.mocked_emit):

                            actual_result = add_user(test[INPUT])

                            expected_result = test[EXPECTED_OUTPUT]

                            self.assertEqual(len(actual_result),
                                         len(expected_result))
                            self.assertEqual(actual_result, expected_result)
    def mocked_order(self):
        return lst

    def test_get_all_user(self):
        for test in self.success_test_params2:

            lst.append(test[INPUT])
            lst3.append(test[INPUT].username)
            with patch('models.Person.query') as mocked_query2:
                mocked_query2.all = self.mocked_order
                actual_result = get_all_users()

                expected_result = lst3

                self.assertEqual(len(actual_result), len(expected_result))
                self.assertEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
