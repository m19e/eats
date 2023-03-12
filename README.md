# EATS

🔍 Easy Advanced Twitter Search

### Commands

| Group      | Command        | Operater                |
| ---------- | -------------- | ----------------------- |
| Basic      | keywords       | `what's happening`      |
| &nbsp;     | exact          | `"happy hour"`          |
| &nbsp;     | or             | `(cats OR dogs)`        |
| &nbsp;     | minus          | `-cats -dogs`           |
| &nbsp;     | tag            | `#bigdog`               |
| Users      | from           | `from:discord_jp`       |
| &nbsp;     | to             | `to:discord_jp`         |
| &nbsp;     | filter:follows | `filter:follows`        |
| Tweet Type | filter:media   | `filter:media`          |
| &nbsp;     | &nbsp;         | `filter:videos`         |
| &nbsp;     | &nbsp;         | `filter:twimg`          |
| &nbsp;     | &nbsp;         | `filter:consumer_video` |
| &nbsp;     | &nbsp;         | `filter:spaces`         |
| &nbsp;     | &nbsp;         | `filter:native_video`   |
| &nbsp;     | &nbsp;         | `filter:pro_video`      |
| &nbsp;     | filter:tweet   | `filter:nativeretweets` |
| &nbsp;     | &nbsp;         | `filter:replies`        |
| &nbsp;     | &nbsp;         | `filter:quote`          |
| &nbsp;     | lang           | `lang:ja`               |
| &nbsp;     | &nbsp;         | `lang:en`               |
| Time       | until          | `until:2023-3-11`       |
| &nbsp;     | since          | `since:2021-2-4`        |
| Engagement | min_retweets   | `min_retweets:280`      |
| &nbsp;     | min_faves      | `min_faves:280`         |
| &nbsp;     | min_replies    | `min_replies:280`       |

### TODO

- [ ] `until/since: hhmmss`
- [ ] `include:nativeretweets`
- [ ] `@USER -from:USER`
- [ ] OGP
- [ ] README > License
- [x] README > Reference

### Usage

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

### Reference

[👀 Advanced Search on Twitter](https://github.com/igorbrigadir/twitter-advanced-search)
