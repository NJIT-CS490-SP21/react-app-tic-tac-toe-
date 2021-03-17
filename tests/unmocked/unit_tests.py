import os
import sys

sys.path.append(os.path.abspath('../../'))
import unittest
from app import get_user_score
from app import archive_tchat
import models
from datetime import date
import unittest

INPUT = 'input'
INITIAL_USER = "Gabin"
INITIAL_USER2 = "essos"
EXPECTED_OUTPUT = "expected"
intitial_user = models.Person(username=INITIAL_USER,
                              score=90,
                              date=date.today())
lst = [intitial_user]


class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [{
            INPUT:
            'user2',
            EXPECTED_OUTPUT: [['Gabin', 'user2'], [90, 100]]
        }, {
            INPUT:
            'user3',
            EXPECTED_OUTPUT: [['Gabin', 'user2', 'user3'], [90, 100, 100]]
        }, {
            INPUT: [],
            EXPECTED_OUTPUT: [[], []]
        }]
        self.success_test_params2 = [{
            INPUT: 'hey',
            EXPECTED_OUTPUT: ['hey']
        }, {
            INPUT: 'wassup',
            EXPECTED_OUTPUT: ['hey', 'wassup']
        }, {
            INPUT: '',
            EXPECTED_OUTPUT: ['hey', 'wassup']
        }]

    def test_get_user_score(self):
        global lst
        for test in self.success_test_params:
            lst.append(
                models.Person(username=test[INPUT],
                              score=100,
                              date=date.today()))
            if test[INPUT] == []:
                lst = []
            actual_result = get_user_score(lst)
            #print(actual_result)
            expected_result = test[EXPECTED_OUTPUT]
            #print(expected_result)
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(len(actual_result), len(expected_result))

    def test_archive_message(self):
        for test in self.success_test_params2:
            actual_result = archive_tchat(test[INPUT])

            expected_result = test[EXPECTED_OUTPUT]
            self.assertEqual(actual_result, expected_result)
            self.assertEqual(len(actual_result), len(expected_result))


if __name__ == '__main__':
    unittest.main()
