# valida2

![npm](https://img.shields.io/npm/v/valida2)
![Test](https://github.com/MasterOdin/valida2/workflows/Test/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/MasterOdin/valida2/branch/master/graph/badge.svg)](https://codecov.io/gh/MasterOdin/valida2)

__NOTE__: README is out-of-date as things get rebuilt for v3. Please see [v2.5.0 README](https://github.com/MasterOdin/valida2/blob/v2.5.0/README.md) for
production usage.

valida2 - A lightweight sanitizer and validator library for Node.js.

This document describes how the valida2 library works and which features it offers. Each section of this document includes usage examples.
You can find additional examples at [examples](https://github.com/MasterOdin/valida2/tree/master/examples) folder.

## Installation

```bash
npm intall valida2
```

## Usage

```javascript
const valida = require('valida2');

var schema = {
  id: [
    { sanitizer: Valida.Sanitizer.toInt },
    { validator: Valida.Validator.required }
  ],
  age: [
    { sanitizer: Valida.Sanitizer.toInt },
    { validator: Valida.Validator.required, groups: ['create'] }
  ],
  name: [
    { validator: Valida.Validator.required, groups: ['update'] }
  ],
  answers: [
    { validator: Valida.Validator.array },
    { validator: Valida.Validator.len, min: 3, max: 10 },
  ]
};

var person = { age: '10', answers: ['A', 'D'] };

Valida.process(person, schema, function(err, ctx) {
  if (err) return console.log(err);
  if (!ctx.isValid()) return console.log(ctx.errors());
  console.log('valid', person);
}, ['create']);
```

## Features

* Sanitization
* Synchronous and asynchronous validation
* Groups
* Extensible

All the features are applied through the `process` function.

```js
Valida.process(
  @data,
  @schema,
  @callback,
  @group
);
```

**options:**

* `@data` is the object to be applied the sanitization and validation
* `@schema` is an object describing to valida2 how to process it
* `@callback` is a function that is going to be called after processing the data
* `@group` is a string or array describing which groups must be applied in this process (optional)

### Sanitization

valida2 supports synchronous sanitization.

* `toInt`
* `toFloat`
* `toDate`
* `trim`
* `string`
* `lowerCase`
* `titleCase`
* `upperCaseFirst`
* `upperCase`
* `toBool`

#### toInt

**options:**

* `radix` (optional, default 10)

```js
var schema = {
  age: [{ sanitizer: Valida.Sanitizer.toInt }]
};
```

#### toFloat

**options:**

* `precision` (optional)

```js
var schema = {
  salary: [{ sanitizer: Valida.Sanitizer.toFloat }]
};
```

#### toDate

```js
var schema = {
  birthday: [{ sanitizer: Valida.Sanitizer.toDate }]
};
```

#### trim

**options:**

* `chars` (optional)

```js

var schema = {
  name: [{ sanitizer: Valida.Sanitizer.trim }]
};
```

#### string

```js

var schema = {
  name: [{ sanitizer: Valida.Sanitizer.string }]
};
```

#### lowerCase

```js

var schema = {
  name: [{ sanitizer: Valida.Sanitizer.lowerCase }]
};
```

#### titleCase

```js

var schema = {
  name: [{ sanitizer: Valida.Sanitizer.titleCase }]
};
```

#### upperCaseFirst

```js

var schema = {
  name: [{ sanitizer: Valida.Sanitizer.upperCaseFirst }]
};
```

#### upperCase

```js

var schema = {
  name: [{ sanitizer: Valida.Sanitizer.upperCase }]
};
```

#### toBool

```js

var schema = {
  published: [{ sanitizer: Valida.Sanitizer.toBool }]
};
```

### Validation

Valida supports both synchronous and asynchronous validation.

* `required`
* `empty`
* `regex`
* `len`
* `array`
* `plainObject`
* `date`
* `integer`
* `enum`
* `bool`
* `float`
* `range`
* `custom`

#### required

Field is required.

```js
var schema = {
  age: [{ validator: Valida.Validator.required }]
};
```

#### empty

Field must be **not** empty.

```js
var schema = {
  description: [{ validator: Valida.Validator.empty }]
};
```

#### regex

Validation based in a regex.

**options:**

* `pattern`: regex pattern
* `modifiers`: regex modifier (optional)

```js
var schema = {
  name: [{ validator: Valida.Validator.regex, pattern: '[A-Z]', modifiers: 'i' }]
};
```

#### len

Validation based in the size of an array or in the number of chars of a non-array.

**options:**

* `min`
* `max`

```js
var schema = {
  products: [{ validator: Valida.Validator.len, min: 2, max: 10 }]
};
```

#### array

Field must be an array.

```js
var schema = {
  products: [{ validator: Valida.Validator.array }]
};
```

#### plainObject

Field must be a plain object.

```js
var schema = {
  person: [{ validator: Valida.Validator.plainObject }]
};
```

#### date

Field must be a date.

```js
var schema = {
  createdAt: [{ validator: Valida.Validator.date }]
};
```

#### integer

Field must be a integer.

```js
var schema = {
  createdAt: [{ validator: Valida.Validator.integer }]
};
```

#### enum

Field value must be list of valid values.

**options:**

* `items`: an array with the valid values

```js
var schema = {
  color: [{ validator: Valida.Validator.enum, items: ['blue', 'black', 'white'] }]
};
```

#### bool

Field must be a bool.

**options:**

* `default`

```js
var schema = {
  published: [{ validator: Valida.Validator.bool, default: false }]
};
```

#### float

Field must be a float.

```js
var schema = {
  salary: [{ validator: Valida.Validator.float }]
};
```

#### range

Field value must be between a min and/or max value.

**options:**

* `min`: The minimum value of the range
* `max`: The maximum value of the range

```js
var schema = {
  code: [{ validator: Valida.Validator.range, min: 0, max: 10 }]
};
```

### Groups

Allows reuse the same schema validation for multiple actions. For example on creating an item a specific field is required. But on updating it that field is optional.

```js
var schema = {
  id: [{ validator: Valida.Validator.required, groups: ['update'] }]
  products: [{ validator: Valida.Validator.array, groups: ['create'] }]
};

Valida.process(data, schema, function(err, ctx) {
  console.log('create', create);
}, 'create');
```

### Extensible
