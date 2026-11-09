# `ContentSecurityPolicy` re-derives directive names on every build

Minimal reproduction for `@remix-run/headers` 1.1.0.

```sh
npm install
npm start
```

`csp()` rebuilds its policy on every HTML request because the nonce changes. For each initializer key, `new ContentSecurityPolicy(init)` runs `name.replace(/[A-Z]/g, callback)`, even though a known key such as `scriptSrc` always converts to `script-src`.

The script times building a typical 17-directive policy, then times that key conversion on its own and prints its share of the build.
