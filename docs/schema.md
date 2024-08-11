## Collections
- inventory
- level
- server-conf
- thc

## Schema
> [!NOTE]
> Open for suggestions on how to improve this section

- inventory:
  - `_id`
  - `id` - string: User id
  - `Custom Reply` - number: Count of custom reply the user has bought


- level:
  - `_id`
  - `id` - string: User id
  - `scores` - Array: [
    - {
      "guild" - srting: Guild Id,
      "score" - number: Score the use has got
    }, ...]
  ]
  - `achievements` - Array: contains enum values of each achievement the user has earned


- server-conf:
  - `_id`
  - `guildId` - string
  - `level` - string: Whether levels should be on/off
  - `custom_replies` - string: Whether custom_replies should be on/off


- thc:
  - `_id`
  - `id` - string: User ID
  - `name` - string: User display name
  - `count` - number: Number of coins/hmm counts the user has
