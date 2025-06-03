import unittest
import numpy as np
from scripts.world import World

class TestWorld(unittest.TestCase):
    def test_initialization(self):
        world = World(10, 10, 10)
        self.assertEqual(world.grid.shape, (10, 10, 10))
        self.assertTrue(np.all(world.grid == 0))

    def test_add_and_get_block(self):
        world = World(5, 5, 5)
        world.add_block(1, 2, 3, 1)  # Assuming 1 is a block type
        self.assertEqual(world.get_block(1, 2, 3), 1)
        self.assertIsNone(world.get_block(10, 10, 10)) # Test out of bounds

    def test_place_block(self):
        world = World(5, 5, 5)
        world.place_block((2, 3, 4), 2) # Assuming 2 is another block type
        self.assertEqual(world.get_block(2, 3, 4), 2)
        world.place_block((10,10,10), 1) # Test out of bounds - should not change anything or error out, just print
        self.assertEqual(world.get_block(2,3,4), 2) # Verify original block still there

    def test_destroy_block(self):
        world = World(5, 5, 5)
        world.add_block(3, 3, 3, 1)
        world.destroy_block((3, 3, 3))
        self.assertEqual(world.get_block(3, 3, 3), 0) # Assuming 0 is empty
        world.destroy_block((10,10,10)) # Test out of bounds - should not error out

if __name__ == '__main__':
    unittest.main()
