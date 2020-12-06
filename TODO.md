# TODO
While the main functionalities of the game are in development I am going to use this file to track the features and issues. It is more simple and faster than creating and resolving github tickets.  
If anyone has a greate idea or find any bug feel free to open an issue the original way.

## Graphics
### Fixed Asset
- [ ] Background - Mountain
- [ ] Background - Rock
- [ ] Coin
### Animated Asset
- [ ] Player
- [ ] Enemy
- [ ] Brick - bonus
- [ ] Coin
- [ ] Coin on HUD

## Other

- [ ] Build full level
- [x] HUD (Heads Up Display)  
  Score, coins, world, time
- [x] Game over  
  Times up, player falls, collides with enemy
- [ ] Game over animation, player falls
- [x] Use Kontra Scene  
  Welcome scene, game scene, game over scene
- [ ] Player sizes: small and big  
- [ ] Pipe takes the player to bonus level  
- [ ] Create particle system for brick animation  
  Support multiple brick destroy, but not at the same time.
- [ ] Enemies collide with each other
- [ ] Navigate menu with keyboard
- [ ] Use WASD to move player
- [ ] Add sprint
- [ ] Left and right movement speed increasing while buttons are down
- [ ] Jump velocity increasing while up button is down
- [ ] Add player states: alive, going down in pipe, reach flag, upgrade or downgrade, dies

## Done
- [x] Organize source code. Use separate files for different entities and logic.
- [x] Use modulesm export, import
- [x] Fix collision test
- [x] Kill enemies only when jumped on it
- [x] Destroy tiles
- [x] Reduce tile size to 32
- [x] Add trigger option to enemies: enemy start moving when appears in the canvas