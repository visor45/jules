import numpy as np

class World:
    def __init__(self, width, height, depth):
        self.grid = np.zeros((width, height, depth), dtype=int)

    def add_block(self, x, y, z, block_type):
        if 0 <= x < self.grid.shape[0] and \
           0 <= y < self.grid.shape[1] and \
           0 <= z < self.grid.shape[2]:
            self.grid[x, y, z] = block_type
        else:
            print("Error: Block position out of bounds.")

    def get_block(self, x, y, z):
        if 0 <= x < self.grid.shape[0] and \
           0 <= y < self.grid.shape[1] and \
           0 <= z < self.grid.shape[2]:
            return self.grid[x, y, z]
        else:
            print("Error: Block position out of bounds.")
            return None

    def place_block(self, position, block_type):
        x, y, z = position
        if 0 <= x < self.grid.shape[0] and \
           0 <= y < self.grid.shape[1] and \
           0 <= z < self.grid.shape[2]:
            self.grid[x, y, z] = block_type
        else:
            print("Error: Block position out of bounds.")

    def destroy_block(self, position):
        x, y, z = position
        if 0 <= x < self.grid.shape[0] and \
           0 <= y < self.grid.shape[1] and \
           0 <= z < self.grid.shape[2]:
            self.grid[x, y, z] = 0  # Assuming 0 represents an empty block
        else:
            print("Error: Block position out of bounds.")
