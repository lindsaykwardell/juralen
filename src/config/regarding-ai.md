For an AI player, the order of methods to take a single action should probably be:

1. Determine each available action, and its cost in actions.
2. Weight the actions based on predetermined scores
  1. Capturing a castle should rate highly
  2. Capturing a town should rate high
  3. Attacking an opponents castle or town
  4. Moving assassins into forests in enemy territory.
  5. Preparing units for an attack.
  6. Taking farms
  7. Fortifying
  8. These actions would all be judged based on basic consequenses as well.
    1. How likely does this move result in losing a town/castle?
    2. How likely does this move result in unit death?
    3. What are the chances of combat success?
      1. Should the AI run combat examples for each attack? Combat can be predetermined, so the AI would never make a combat mistake. Or perhaps it assumes all units are at full health? Still wouldn't make a mistake, but gives a better chance to human player.
    4. If combat is successful, how many potential counterattacks are there? Would those be successful?
3. Take an action.
4. Repeat until no action points remain.

This would be pricey as far as processing, as it would need to read the board for all potential moves. Wizards add a LOT of moves (probably the AI wouldn't use wizards well for awhile), so it would need to scan the board for each option. This isn't a problem (I think...), but a thing to note.

Maybe the first step would be to write the AI to determine each legal action for a given board state, and choose one at random. Then start to rate them based on success or failure. Maybe machine learning (gasp!) would be applicable.