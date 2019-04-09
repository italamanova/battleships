from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Game(models.Model):
    name = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return str(self.name)

    @property
    def finished_game(self):
        moves = Move.objects.filter(game=self, hit=True).count()
        ship_placements = ShipPlacement.objects.filter(ship__game=self).count()
        return moves == ship_placements

    class Meta:
        verbose_name = 'game'


class Ship(models.Model):
    game = models.ForeignKey(Game, related_name='ships', on_delete=models.CASCADE)
    name = models.CharField(max_length=20)

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name = 'ship'


class ShipPlacement(models.Model):
    ship = models.ForeignKey(Ship, on_delete=models.CASCADE)
    x = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    y = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])

    def __str__(self):
        return str('%s x %s' % (self.x, self.y))

    class Meta:
        verbose_name = 'placement'


class Move(models.Model):
    '''
        #TODO comments
    '''

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    x = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    y = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    hit = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'move'
