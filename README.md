# Voi

Some minor extensions to Joi in TypeScript

## Install

```
npm install @v-n-b/voi
```

### Browser polyfills

Voi uses ES6 features and Map, so if you support older browsers you might need polyfills.

## Usage

```ts
import { Voi } from '@v-n-b/voi';

enum Dnd {
    dungeons = 'dungeons',
    dragons = 'dragons',
}

Voi.voi().enum(Action).validate('dungeons');
// Validates

Voi.voi().enum(Status).validate('foo');
// Results in error with type 'voi.enum'

Voi.string().simpleEmail().validate('test@example.com');
// Validates

Voi.string().simpleEmail().validate('testexample.com');
// Results in error with type string.simpleEmail
```
