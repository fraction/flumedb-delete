# flumedb-delete

> current progress on deleting content from flumedb

The source code opens two instances of flumedb: `a` and `b`. Each of the
messages are streamed with `a.stream()` and appended to be with `b.append()`
as long as they pass the filter. The filter checks whether the message author
is `"bob"`, and only appends messages that do *not* have that author.

If being used with Scuttlebutt, **this module does not delete blobs**.

## Install

```
git@github.com:fraction/flumedb-delete.git
cd flumedb-delete
```

## Usage

This module includes a small demonstration in `index.js`.

```
npm start
```

To delete a feed, first select a valid ssb feed id, and run these two commands:

```
node ssb.js --id='feedId'
node delete-views
```

It can also help to private block a feed, so that it doesn't resync later: 

```
scuttlebot publish --type contact --blocking --recps 'yourId' --contact 'feedId'
```

If you'd like to delete a Scuttlebutt feed, you can experiment with `ssb.js`.
Please keep in mind that this is **highly experimental** and you should only
participate in this experiment if you're comfortable with losing your SSB 
database.

1. Turn off all Scuttlebutt services.
2. Delete content from your log with `node ssb.js`.
3. Delete your views with `node delete-views.js`
4. Restart Scuttlebutt
5. Wait for views to regenerate.
6. Keep waiting...
7. Done! You've deleted a feed from your database.

If you'd like to delete a different SSB feed, edit `ssb.js` manually.

## Maintainers

[@fraction](https://github.com/fraction)

## Contributing

PRs accepted.

## License

MIT © 2018 Fraction LLC
