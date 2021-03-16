


import os 
import sys
sys.path.append(os.path.abspath('../../'))
import unittest
from app import foo5
from app import foo12
from app import foo13
from app import add_user
import models
from datetime import date
import unittest

INPUT='input'
INITIAL_USER = "Gabin"
INITIAL_USER2="essos"
EXPECTED_OUTPUT = "expected"
intitial_user=models.Person(username=INITIAL_USER, score=100,date=date.today())

lst=[intitial_user.username]

class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                INPUT: ['user2',
                     
                    'user1'],
                    
                
                EXPECTED_OUTPUT: ['Gabin','user1','user2']
            },
            {
               INPUT : ['user3',
                     
                    'user4'],
                    
                
                EXPECTED_OUTPUT: ['user3','user4']
            },
            {
               INPUT: ['user5']
                     
                    ,
                    
                
                EXPECTED_OUTPUT:[ ]
            }
            
        ]
            
   
    
        
    def test_add_user(self):
        for test in self.success_test_params:
            lst.append(models.Person(username=test[INPUT][0], score=100,date=date.today()))
            lst.append(models.Person(username=test[INPUT][1], score=100,date=date.today()))
            
            
            actual_result= add_user(lst)
            print(test[INPUT])
            expected_result = test[EXPECTED_OUTPUT]
            print(expected_result)
            self.assertEqual(actual_result,expected_result)
            self.assertEqual(len(actual_result),len(expected_result))
             


if __name__ == '__main__':
    unittest.main()