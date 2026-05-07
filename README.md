# gib-validate

gib-validate is a lightweight validation helper for Vue 3 Composition API. It validates Vue-readable form state with synchronous and asynchronous rules.

## Installation

```bash
npm install gib-validate
```

## Basic Usage

```ts
import { reactive } from 'vue';
import { useValidation, required, minLength, isEmail } from 'gib-validate';

const form = reactive({ email: '', password: '' });

const rules = {
  email: [required('Email is required'), isEmail('Invalid email')],
  password: [required(), minLength(8, 'Minimum 8 characters')]
};

const v = useValidation(form, rules);

async function submit() {
  if (!(await v.value.$validate())) return;

  // submit form
}
```

```html
<template>
  <input v-model="form.email" />
  <div v-if="v.$errors.email">{{ v.$errors.email[0] }}</div>

  <input v-model="form.password" type="password" />
  <div v-if="v.$errors.password">{{ v.$errors.password[0] }}</div>

  <button :disabled="v.$pending" @click="submit">Submit</button>
</template>
```

`useValidation` accepts any Vue-readable state source: a `reactive` object, `ref` with an object, `computed`, getter, or a plain object. Reactive updates are tracked when the source itself is reactive.

```ts
const form = ref({ email: '', password: '' });
const v = useValidation(form, rules);

const fromStore = useValidation(() => userStore.form, rules);
```

## API

`useValidation(state, rules, name?)` returns a computed validation state:

- `$touch()` marks all local fields and child validators as touched.
- `$reset()` resets dirty/touched state, external errors, and children.
- `$resetValidation()` resets local dirty/touched state and external errors.
- `$touchField(field | fields)` marks one or more fields as touched.
- `$resetField(field | fields)` resets touched state for one or more fields.
- `$validate()` touches and validates the form, including children, and returns `Promise<boolean>`.
- `$validateField(field)` touches and validates one field.
- `$setExternalErrors(errors)` adds backend/server errors.
- `$clearExternalErrors(field?)` clears backend/server errors.
- `$dirty` is `true` after touch/validate.
- `$pending` is `true` while async validation is running.
- `$invalid`, `$valid`, `$error`, `$silentInvalid` expose validity flags.
- `$errors` contains visible errors for touched fields.
- `$silentErrors` contains all rule and external errors.
- `$message` contains the first visible message per field.
- `$children` contains nested validators.

## Rules

A rule receives `(value, state)` and returns `true` or an error message. It can be synchronous or asynchronous.

```ts
const samePassword = (value: string, state: { password: string }) => {
  return value === state.password || 'Passwords do not match';
};

const uniqueEmail = async (email: string) => {
  const ok = await api.checkEmail(email);
  return ok || 'Email already exists';
};
```

Format, length, range, file and comparison rules treat empty values as valid. Use `required` or `requiredIf` when a field must be filled.

## Dynamic Rules

```ts
import { computed, reactive, ref } from 'vue';
import { useValidation, required, minLength } from 'gib-validate';

const form = reactive({ password: '' });
const requirePassword = ref(false);

const rules = computed(() => ({
  password: requirePassword.value
    ? [required('Password is required'), minLength(8)]
    : [minLength(8)]
}));

const v = useValidation(form, rules);
```

## External Errors

```ts
try {
  await submitForm(form);
} catch (error) {
  v.value.$setExternalErrors({
    email: ['Email already exists']
  });
}
```

## Nested Validation

Child validators automatically register with the parent validator when they are created inside Vue setup.

```ts
// Parent
const parentValidation = useValidation(form, {
  name: [required('Name required')]
});

// Child
const addressValidation = useValidation(address, {
  street: [required('Street is required')],
  city: [required('City is required'), minLength(2)]
}, 'addressForm');

await parentValidation.value.$validate();
```

## Named Validation

```ts
import { reactive } from 'vue';
import { useNamedValidation, useValidation, required } from 'gib-validate';

const form = reactive({ name: '' });
const v = useValidation(form, { name: [required()] }, 'userForm');

const userFormValidation = useNamedValidation('userForm');
userFormValidation.value?.$touch();
```

## Built-in Rules

- `required(error?)`
- `requiredIf(condition, error?)`
- `oneOf(list, error?)`
- `isEmail(error?)`
- `isUrl(error?)`
- `isPhone(error?)`
- `isNumeric(error?)`
- `isInteger(error?)`
- `isDate(error?)`
- `isPastDate(error?)`
- `isFutureDate(error?)`
- `isPassword(minLen?, hasSpecialChar?, error?)`
- `fileType(allowedTypes, error?)`
- `fileSizeLessThan(maxMB, error?)`
- `equalTo(target, error?)`
- `sameAs(target, error?)`
- `contains(valueToFind, error?)`
- `between(min, max, error?)`
- `minLength(min, error?)`
- `maxLength(max, error?)`
