# flumedb-delete

> current progress on deleting content from flumedb

The source code opens two instances of flumedb: `a` and `b`. Each of the
messages are streamed with `a.stream()` and appended to be with `b.append()`
as long as they pass the filter. The filter checks whether the message author
is `"bob"`, and only appends messages that do *not* have that author.

To completely delete content from flumedb, it may be wise to make sure that
all views are regenerated as well. **This module does not regenerate views**.
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

If you'd like to delete a Scuttlebutt feed, you can experiment with `ssb.js`.
Please keep in mind that this is **highly experimental** and you should only
participate in this experiment if you're comfortable with losing your SSB 
database. I can't promise that this will work, but here's what I did:

```sh
node ssb.js
node delete-views.js
```

If you'd like to delete a different SSB feed, edit `ssb.js` manually.

## Maintainers

[@fraction](https://github.com/fraction)

## Contributing

PRs accepted.

## License

MIT © 2018 Fraction LLC
