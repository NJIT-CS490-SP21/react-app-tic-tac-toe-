

import unittest
import unittest.mock as mock
from unittest.mock import patch

from app import foo5
from app import foo12
from app import foo13

INPUT = "input_artist_ids"
EXPECTED_OUTPUT = "expected"

class UpdateUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                INPUT:  [
                    '0Y5tJX1MQlPlqiwlOH1tJY', # Travis Scott
                    '4yvcSjfu4PC0CYQyLy4wSq', # Glass Animals
                    '3MZsBdqDrRTJihTHQrO6Dq', # Joji
                    '1Xyo4u8uXC1ZmMpatF05PJ', # The Weeknd
                ],
                EXPECTED_OUTPUT: 'https://api.spotify.com/v1/artists/0Y5tJX1MQlPlqiwlOH1tJY/top-tracks'
            },
            # TODO add another test case for when the input is None
        ]
   
    def add(self,user):
        return self.success_test_params[0][INPUT][0]
        
        
    def test_add_user(self):
        for test in self.success_test_params:
            # TODO: Mock random.choice to always return the 0 index
            #with patch('get_tracks.random.choice',test[INPUT][0]):
            with patch('get_tracks.random.choice',self.add):  
            # Look at app_test.py from the demo for example
            
            # TODO: Make a call to add user with your test inputs
            # then assign it to a variable
                actual_result = get_artist_url(test[INPUT])
            
            # Assign the expected output as a variable from test
                expected_result = test[EXPECTED_OUTPUT]

            # Use assert checks to see compare values of the results
                self.assertEqual(len(actual_result),len(expected_result))
                self.assertEqual(actual_result,expected_result)
             


if __name__ == '__main__':
    unittest.main()