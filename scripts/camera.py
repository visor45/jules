import numpy as np

class Camera:
    def __init__(self, position=np.array([0, 0, 0], dtype=float), yaw=0.0, pitch=0.0):
        self.position = position
        self.yaw = yaw  # Rotation around the Y-axis
        self.pitch = pitch  # Rotation around the X-axis
        self.update_vectors()

    def update_vectors(self):
        # Calculate the new front vector
        front_x = np.cos(np.radians(self.yaw)) * np.cos(np.radians(self.pitch))
        front_y = np.sin(np.radians(self.pitch))
        front_z = np.sin(np.radians(self.yaw)) * np.cos(np.radians(self.pitch))
        self.front = np.array([front_x, front_y, front_z])
        self.front = self.front / np.linalg.norm(self.front) # Normalize

        # Also re-calculate the Right and Up vector
        # Right vector
        self.right = np.cross(self.front, np.array([0, 1, 0]))
        self.right = self.right / np.linalg.norm(self.right) # Normalize
        # Up vector
        self.up = np.cross(self.right, self.front)
        self.up = self.up / np.linalg.norm(self.up) # Normalize

    def move(self, direction, amount):
        if direction == "FORWARD":
            self.position += self.front * amount
        elif direction == "BACKWARD":
            self.position -= self.front * amount
        elif direction == "LEFT":
            self.position -= self.right * amount
        elif direction == "RIGHT":
            self.position += self.right * amount
        elif direction == "UP":
            self.position += self.up * amount
        elif direction == "DOWN":
            self.position -= self.up * amount

    def rotate(self, yaw_offset, pitch_offset):
        self.yaw += yaw_offset
        self.pitch += pitch_offset

        # Constrain pitch
        if self.pitch > 89.0:
            self.pitch = 89.0
        if self.pitch < -89.0:
            self.pitch = -89.0

        self.update_vectors()
