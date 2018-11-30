# flumedb-delete

> current progress on deleting content from flumedb

The source code opens two instances of flumedb: `a` and `b`. Each of the
messages are streamed with `a.stream()` and appended to be with `b.append()`
as long as they pass the filter. The filter checks whether the message author
is `"bob"`, and only appends messages that do *not* have that author.

To completely delete content from flumedb, it may be wise to make sure that
all views are regenerated as well. **This module does not regenerate views**.

## Install

```
git@github.com:fraction/flumedb-delete.git
cd flumedb-delete
```

## Usage

```
npm start
```

## Maintainers

[@fraction](https://github.com/fraction)

## Contributing

PRs accepted.

## License

MIT © 2018 Fraction LLC
