# Quick Introduction

This is the repository for storing all common component that we can copy to our code for faster development time. It could be a small UI component, a server running as a service or a full set of working UI + background services and server.

# Contribute guideline

## Each new feature would be in its own folder

## Each feature folder should have a single access point

Unless we are creating multiple files to be easily copy and they are independent of each other then we don't need to create an access point.

```
subscription
 -> index.js //Should include others, since they are related
 -> get/
 -> create/
 -> update/
```

```
date_utils
 -> is_date.js
 -> same_date.js
```

## Use underscores, not dashes in filenames for server file. For client use camelcase with capitalisation of the first letter to follow STFLex convention

Example: Use `file_server.ts` instead of `file-server.ts`. And use `EditListingPage` instead of `editListingPage` or `edit_listing_page`

## Add tests for new features.

Each module should contain or be accompanied by tests for its public
functionality. Right now, we are writing using `Jest for front-end` library and prefer to use `Mocha for back-end` functionality, however if you are not clear or does not have enough experience with Mocha you can also use Jest.

The reason for the choice is that Jest was created by Facebook to use specifically with React while Mocha is intended for Nodejs because it has a powerful mocking tool.

But in repository that has both front-end and back-end we would use Jest for both since we focus the front-end more.

## TODO Comments

TODO comments should usually include an issue or the author's github username in
parentheses. Example:

```ts
// TODO(ry): Add tests.
// TODO(#123): Support Windows.
// FIXME(#349): Sometimes panics.
```

## Meta-programming is discouraged. Including the use of Proxy.

Be explicit even when it means more code.

There are some situations where it may make sense to use such techniques, but in
the vast majority of cases it does not.

## Inclusive code

Please follow the guidelines for inclusive code outlined at
https://chromium.googlesource.com/chromium/src/+/master/styleguide/inclusive_code.md.

### Use JavaScript not TypeScript.

Although TypeScript gives lots of extension compare to JavaScript but the project would need to add a transpiler which would increase the code size.

### Use the term "module" instead of "library" or "package".

For clarity and consistency avoid the terms "library" and "package". Instead use
"module" to refer to a single JS file and also to refer to a directory of JS code.

### Exported functions: max 2 args, put the rest into an options object.

When designing function interfaces, stick to the following rules.

1. A function that is part of the public API takes 0-2 required arguments, plus
   (if necessary) an options object (so max 3 total).

2. Optional parameters should generally go into the options object.

   An optional parameter that's not in an options object might be acceptable if
   there is only one, and it seems inconceivable that we would add more optional
   parameters in the future.

3. The 'options' argument is the only argument that is a regular 'Object'.

   Other arguments can be objects, but they must be distinguishable from a
   'plain' Object runtime, by having either:

   - a distinguishing prototype (e.g. `Array`, `Map`, `Date`, `class MyThing`).
   - a well-known symbol property (e.g. an iterable with `Symbol.iterator`).

   This allows the API to evolve in a backwards compatible way, even when the
   position of the options object changes.

```js
// BAD: optional parameters not part of options object. (#2)
export function resolve(
  hostname,
  family,
  timeout,
){}

// GOOD.
export function resolve(
  hostname,
  options = {
    family = null,
    timeout = 0, //Default configuration
  },
){}
```

```js
// BAD: more than 3 arguments (#1), multiple optional parameters (#2).
export function renameSync(
  oldname,
  newname,
  replaceExisting,
  followLinks,
) {}

// GOOD.
export function renameSync(
  oldname,
  newname,
  options = {
    replaceExisting = false,
    followLinks = false,
  },
) {}
```

```js
// BAD: too many arguments. (#1)
export function pwrite(
  fd,
  buffer,
  offset,
  length,
  position,
) {}

// BETTER
export function pwrite(options = {
  fd = 0,
  buffer = null,
  offset = 0,
  length = 0,
  position = 0,
}) {}
```

### Minimize dependencies; do not make circular imports.

Given that we are writing a module to be used in multiple places, we must be careful to keep internal dependencies simple and manageable. In particular, be careful not to introduce circular imports.

### Use JSDoc for exported symbols.

We strive for complete documentation. Every exported symbol ideally should have
a documentation line.

If possible, use a single line for the JSDoc. Example:

```js
/** foo does bar. */
export function foo() {
  // ...
}
```

It is important that documentation is easily human readable, but there is also a need to provide additional styling information to ensure generated documentation is more rich text. Therefore JSDoc should generally follow markdown markup to enrich the text.

While markdown supports HTML tags, it is forbidden in JSDoc blocks.

Code string literals should be braced with the back-tick (\`) instead of quotes.
For example:

```js
/** Import something from the `test` module. */
```

It is recommended to uaw document function arguments when they are non-obvious of their intent.

```js
/**
 * Function with non obvious param.
 * @param foo Description of non obvious parameter.
 */
```

Vertical spacing should be minimized whenever possible. Therefore single line comments should be written as:

```js
/** This is a good single line JSDoc. */
```

And not:

```js
/**
 * This is a bad single line JSDoc.
 */
```

Code examples should utilize markdown format, like so:

````js
/** A straight forward comment and an example:
 * ```js
 * import { foo } from "test";
 * foo("bar");
 * ```
 */
````

Code examples should not contain additional comments and must not be indented. It is already inside a comment. If it needs further comments it is not a good example.

### Each module should come with a test module.

Every module with public functionality `foo.js` should come with a test module `foo.test.js`.

### Unit Tests should be explicit.

For a better understanding of the tests, function should be correctly named as its prompted throughout the test command. Like:

```
test myTestFunction ... ok
```

Example of test:

```js
import {
  isDate
} from './dates';

describe('date utils', () => {
  describe('isDate()', () => {
    it('should return false if parameters is string', () => {
      expect(isDate('Monday')).toBeFalsy();
    });
    it('should return false if parameters is number', () => {
      expect(isDate('1546293600000')).toBeFalsy();
    });
    it('should return false if parameters is incorrect Date', () => {
      expect(isDate(new Date('random string'))).toBeFalsy();
    });
    it('should return true if parameters is Date', () => {
      expect(isDate(new Date(1546293600000))).toBeTruthy();
    });
  });
});

```

#### Do not depend too much on external code.

We are building re-usable component that lots of programs can rely on. We want to guarantee to users that this code does not include potentially unreviewed third party code.

#### Document and maintain browser compatibility.

If a module is browser compatible, include the following in the JSDoc at the top
of the module:

```js
// This module is browser compatible.
```

Maintain browser compatibility for such a module by either not using much of the global namespace or feature-testing for it. Make sure any new dependencies are also browser compatible.