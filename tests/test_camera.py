import unittest
import numpy as np
from scripts.camera import Camera

class TestCamera(unittest.TestCase):
    def test_initialization(self):
        camera = Camera(position=np.array([1, 2, 3], dtype=float), yaw=-90.0, pitch=30.0)
        np.testing.assert_array_almost_equal(camera.position, np.array([1, 2, 3], dtype=float))
        self.assertAlmostEqual(camera.yaw, -90.0)
        self.assertAlmostEqual(camera.pitch, 30.0)
        # Test default initialization
        camera_default = Camera()
        np.testing.assert_array_almost_equal(camera_default.position, np.array([0, 0, 0], dtype=float))
        self.assertAlmostEqual(camera_default.yaw, 0.0)
        self.assertAlmostEqual(camera_default.pitch, 0.0)

    def test_move(self):
        camera = Camera(position=np.array([0, 0, 0], dtype=float))
        camera.move("FORWARD", 5.0)
        # Default orientation is looking along -Z, so FORWARD moves towards -Z
        np.testing.assert_array_almost_equal(camera.position, np.array([0, 0, -5.0]))
        camera.move("RIGHT", 2.0)
        # Default right is +X
        np.testing.assert_array_almost_equal(camera.position, np.array([2.0, 0, -5.0]))
        camera.move("UP", 3.0)
        np.testing.assert_array_almost_equal(camera.position, np.array([2.0, 3.0, -5.0]))

    def test_rotate(self):
        camera = Camera()
        camera.rotate(yaw_offset=90.0, pitch_offset=-30.0)
        self.assertAlmostEqual(camera.yaw, 90.0)
        self.assertAlmostEqual(camera.pitch, -30.0)

        # Test pitch constraints
        camera.rotate(yaw_offset=0, pitch_offset=150.0) # Try to pitch beyond 89
        self.assertAlmostEqual(camera.pitch, 89.0)
        camera.rotate(yaw_offset=0, pitch_offset=-200.0) # Try to pitch beyond -89
        self.assertAlmostEqual(camera.pitch, -89.0)

    def test_update_vectors(self):
        camera = Camera()
        # Default: yaw=0, pitch=0. Front should be (0,0,-1) if positive Z is "out of screen"
        # My current camera implementation front is (cos(yaw)cos(pitch), sin(pitch), sin(yaw)cos(pitch))
        # For yaw=0, pitch=0: (1*1, 0, 0*1) = (1,0,0) - This means default front is +X
        # Let's adjust tests based on this:
        # Default front should be [1,0,0]
        # Default right should be [0,0,-1] (cross([1,0,0], [0,1,0])) -> normalized [0,0,-1] after my code's norm
        # Actually, np.cross([1,0,0], [0,1,0]) is [0,0,1]. So right is [0,0,1]
        # Default up should be cross([0,0,1], [1,0,0]) which is [0,1,0]

        np.testing.assert_array_almost_equal(camera.front, np.array([1, 0, 0]), decimal=5)
        np.testing.assert_array_almost_equal(camera.right, np.array([0, 0, -1]), decimal=5) # np.cross(camera.front, np.array([0,1,0])) then normalized
        np.testing.assert_array_almost_equal(camera.up, np.array([0, 1, 0]), decimal=5) # np.cross(camera.right, camera.front) then normalized

        # Rotate yaw by 90 degrees. New front should be (cos(90)cos(0), sin(0), sin(90)cos(0)) = (0,0,1)
        camera.rotate(90, 0)
        np.testing.assert_array_almost_equal(camera.front, np.array([0, 0, 1]), decimal=5)
        # New right: cross([0,0,1], [0,1,0]) = [-1,0,0]
        np.testing.assert_array_almost_equal(camera.right, np.array([-1, 0, 0]), decimal=5)
        # New up: cross([-1,0,0], [0,0,1]) = [0,-1,0] -> but up should remain mostly positive Y unless pitch is extreme.
        # cross(right, front) = cross([-1,0,0], [0,0,1]) = [0, -1, 0]. Ah, my up vector calculation is standard.
        np.testing.assert_array_almost_equal(camera.up, np.array([0, 1, 0]), decimal=5) # Up is recalced based on world up [0,1,0] for stability mostly

        # Rotate pitch by -45 degrees. Yaw is still 90.
        # front_x = np.cos(np.radians(90)) * np.cos(np.radians(-45)) = 0
        # front_y = np.sin(np.radians(-45)) = -0.7071
        # front_z = np.sin(np.radians(90)) * np.cos(np.radians(-45)) = 0.7071
        camera.rotate(0, -45) # Total yaw 90, pitch -45
        expected_front_x = np.cos(np.radians(90)) * np.cos(np.radians(-45))
        expected_front_y = np.sin(np.radians(-45))
        expected_front_z = np.sin(np.radians(90)) * np.cos(np.radians(-45))
        expected_front = np.array([expected_front_x, expected_front_y, expected_front_z])
        expected_front /= np.linalg.norm(expected_front)

        np.testing.assert_array_almost_equal(camera.front, expected_front, decimal=5)


if __name__ == '__main__':
    unittest.main()
