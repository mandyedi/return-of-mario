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

## Other

- [ ] Build full level
- [ ] HUD (Heads Up Display)  
  Score, coins, world, time, lives
- [ ] Game over  
  Times up, player falls, collides with enemy
- [x] Use Kontra Scene  
  Welcome scene, game scene, game over scene
- [ ] Player states: small and big  
- [ ] Pipe takes the player to bonus level  
- [ ] Create particle system for brick animation  
  Support multiple brick destroy, but not at the same time.
- [ ] Enemies collide with each other
- [ ] Navigate menu with keyboard
- [ ] Use WASD to move player

## Done
- [x] Organize source code. Use separate files for different entities and logic.
- [x] Use modulesm export, import
- [x] Fix collision test
- [x] Kill enemies only when jumped on it
- [x] Destroy tiles
- [x] Reduce tile size to 32
- [x] Add trigger option to enemies: enemy start moving when appears in the canvas