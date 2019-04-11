from collections import namedtuple

ShipType = namedtuple('ShipType', ['name', 'size'])

SHIP_TYPES = [
    ShipType('Destroyer', 2),
    ShipType('Submarine', 3),
    ShipType('Cruiser', 3),
    ShipType('Battleship', 4),
    ShipType('Carrier', 5),
]

