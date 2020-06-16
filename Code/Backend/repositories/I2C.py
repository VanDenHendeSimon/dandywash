import smbus
import time


class I2C:
    def __init__(self, address):
        self.address = address
        self.i2c = smbus.SMBus(1)

    # Read a single byte
    def read(self):
        return self.i2c.read_byte(self.address)

    # Write a single command
    def write_cmd(self, cmd):
        self.i2c.write_byte(self.address, cmd)
        time.sleep(0.0001)

    # Write a command and argument
    def write_cmd_arg(self, cmd, data):
        self.i2c.write_byte_data(self.address, cmd, data)
        time.sleep(0.0001)

    # Write a block of data
    def write_block_data(self, cmd, data):
        self.i2c.write_block_data(self.address, cmd, data)
        time.sleep(0.0001)

    # Read
    def read_data(self, register):
        return self.i2c.read_byte_data(self.address, register)

    # Read a block of data
    def read_block_data(self, register):
        return self.i2c.read_block_data(self.address, register)

    def read_i2c_block_data(self, start_register, size):
        # Size moet even zijn
        if size % 2 == 0:
            values = self.i2c.read_i2c_block_data(self.address, start_register, size)
            return I2C.stitch_bytes(values, 16)[0]
        else:
            return [0] * size

    @staticmethod
    def stitch_bytes(values, bits):
        # Invert
        # values = values [::-1]

        result = []
        for i in range(0, len(values), 2):
            stitched = (values[i] << 8) | values[i + 1]

            # Check ofdat msb 1 is
            if stitched & (1 << (bits - 1)):
                # 2**(aantal bits) aftrekken
                stitched -= (1 << bits)
    
            result.append(stitched)

        return result
