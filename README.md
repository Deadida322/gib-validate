# gib-validate

gib-validate is a lightweight validation helper for Vue 3 (Composition API). It provides a set of common validation rules and a `useValidation` hook to validate reactive form state.

### Quick summary
- Peer dependency: Vue 3
- Main exports: `useValidation`, a collection of rules (for example `required`, `minLength`, `isEmail`) and types (`ValidationState`, `ValidationRule`, `ValidationRules`, `Errors`).

### Installation

```bash
npm install gib-validate
```

### Basic usage (Vue 3, Composition API)

```ts
import { reactive } from 'vue';
import { useValidation, required, minLength, isEmail } from 'gib-validate';

const form = reactive({ email: '', password: '' });

const rules = {
  email: [required('Email is required'), isEmail('Invalid email')],
  password: [required(), minLength(8, 'Minimum 8 characters')]
};

// useValidation returns ComputedRef<ValidationState<T>>
const v = useValidation(form, rules);

// In script: access via v.value (v is a ComputedRef)
// v.value.$errors, v.value.$touch(), v.value.$reset(), etc.

```

```html
<template>
  <input v-model="form.email" />
  <div v-if="v.$errors.email">{{ v.$errors.email[0] }}</div>

  <input v-model="form.password" type="password" />
  <div v-if="v.$errors.password">{{ v.$errors.password[0] }}</div>

  <button @click="v.$touch()">Submit</button>
</template>
```

### API overview

- useValidation:
  - Returns a computed validation state exposing:
    - `$touch()` — mark form as touched (marks all fields and child validators)
    - `$reset()` — reset dirty/touched state
    - `$touchField(field | fields)` — mark one or more fields as touched
    - `$dirty: boolean` — whether the form was attempted/submitted
    - `$errors: Errors<T>` — visible errors (only for touched fields)
    - `$silentErrors: Errors<T>` — all validation errors regardless of touched state
    - `$children` — support for nested validators (via provide/inject)

### Dynamic rules

The `useValidation` function now supports dynamic rules through computed properties. This allows you to change validation rules based on reactive conditions:

```ts
import { reactive, ref, computed } from 'vue';
import { useValidation, required, minLength } from 'gib-validate';

const form = reactive({ password: '' });
const requirePassword = ref(false);

// Dynamic rules based on reactive conditions
const rules = computed(() => ({
  password: requirePassword.value 
    ? [required('Password is required'), minLength(8, 'Minimum 8 characters')] 
    : [minLength(8, 'Minimum 8 characters')]
}));

const v = useValidation(form, rules);

// Later, when you change requirePassword, the validation rules will automatically update
requirePassword.value = true;
```

- useNamedValidation:
  - Returns a reactive ref to a named validation:
    - Allows reactive access to named validations
    - Updates automatically when the named validation changes
    - Returns undefined if no validation is registered with that name

- Validation rules: a `ValidationRule<T>` returns `true` (success) or a string (error message). Rules can be synchronous or asynchronous (return Promise<string|boolean>).

Types (short):
- `ValidationRule<T>` = (value: T) => string | boolean | Promise<string | boolean>
- `ValidationRules<T>` = { [K in keyof T]?: ValidationRule<T[K]>[] }
- `Errors<T>` = Partial<Record<keyof T, string[]>>

### Built-in rules

The package exports a set of common rules from `src/rules`:

- `required(error?)`
- `requiredIf(...)`
- `oneOf(...)`
- `isEmail(...)`
- `isUrl(...)`
- `isPhone(...)`
- `isNumeric(...)`
- `isInteger(...)`
- `isDate(...)`
- `isPastDate(...)`, `isFutureDate(...)`
- `isPassword(...)`
- `fileType(...)`, `fileSizeLessThan(...)`
- `equalTo(...)`
- `contains(...)`
- `between(...)`
- `minLength(...)`, `maxLength(...)`

Each rule typically accepts parameters (for example, `minLength(8, 'Too short')`) and returns a function that will be invoked with the value to validate.

Example custom rules:

```ts
// sync rule
const startsWithA = (v: string) => (v.startsWith('A') ? true : 'Must start with A');

// async rule
const uniqueEmail = async (email: string) => {
  const ok = await checkEmailOnServer(email); // your API call
  return ok ? true : 'Email already taken';
};

```

### Behavior and notes

- The hook watches the provided `state` and runs validation rules automatically, updating `$silentErrors`.
- `$errors` contains only errors for fields that are touched (or after calling `$touch()`).
- Rules return `true` on success or a string with an error message on failure. Async rules are supported.
- Nested validators are supported: child validators register with a parent via provide/inject.

### Nested validation

gib-validate supports nested validators across component boundaries. When a child component calls `useValidation`, it will automatically register its validation state with a parent validator (if a parent is present) using provide/inject. This allows the parent to trigger child validation (`$touch`) and for child validators to be reset together with the parent.

Key points:
- Child validators register automatically; you don't need to pass the parent explicitly.
- Parent's `$touch()` will call `$touch()` on registered children. Parent's `$reset()` will reset children as well.
- Registered children appear under the parent's `$children` ref (keys are assigned internally, in insertion order).

Simple example (Parent + Child component):

Parent component (script setup):

```ts
import { reactive } from 'vue';
import { useValidation, required } from 'gib-validate';
import AddressField from './AddressField.vue';

const form = reactive({ name: '', address: { street: '', city: '' } });

const rules = {
  name: [required('Name required')]
};

const v = useValidation(form, rules);

// trigger parent + child validation before submit
function onSubmit() {
  v.value.$touch(); // will also touch children
  // check parent errors and optionally inspect children via v.value.$children
}
```

Child component `AddressField.vue` (script setup):

```ts
import { toRef } from 'vue';
import { useValidation, required, minLength } from 'gib-validate';

// props: { address }
const street = toRef(props.address, 'street');
const city = toRef(props.address, 'city');

const rules = {
  street: [required('Street is required')],
  city: [required('City is required'), minLength(2, 'Too short')]
};

// useValidation in the child registers itself with the parent validator automatically
const v = useValidation(props.address, rules);

```

How to inspect child errors from parent:

```ts
// v is parent's computed validation state
// parent silent errors
console.log(v.value.$silentErrors);

// iterate registered children
for (const [key, childState] of Object.entries(v.value.$children.value)) {
  console.log('child errors', key, childState.$errors);
}
```

Note: child validators are stored under `$children` as a `Ref<Record<string, ValidationState>>;` the keys are created internally and may change when children mount/unmount. Use `$children` for programmatic inspection only — prefer using high-level flows like `v.$touch()` on the parent which will propagate to children.

### Named validations

gib-validate also supports naming your validations to make them easier to access and manage. You can name both top-level validations and nested children validations.

#### Named top-level validations

```ts
import { reactive } from 'vue';
import { useValidation, required, useNamedValidation } from 'gib-validate';

const form = reactive({ name: '' });
const rules = {
  name: [required('Name is required')]
};

// Register validation with a name
const v = useValidation(form, rules, 'userForm');

// Later, retrieve the validation by name from anywhere in your app
// useNamedValidation returns a reactive ref that updates when the validation changes
const userFormValidation = useNamedValidation('userForm');
userFormValidation.value?.$touch(); // Trigger validation
```

#### Named nested children validations

When creating nested validations, you can provide names for children to make them easier to identify:

```ts
// Parent component
import { reactive } from 'vue';
import { useValidation, required } from 'gib-validate';

const form = reactive({ name: '', address: { street: '', city: '' } });
const rules = {
  name: [required('Name required')]
};

// Parent validation (without name)
const parentValidation = useValidation(form, rules);

// Child component
import { toRef } from 'vue';
import { useValidation, required, minLength } from 'gib-validate';

const address = toRef(props, 'address');
const rules = {
  street: [required('Street is required')],
  city: [required('City is required'), minLength(2, 'Too short')]
};

// Child validation with name - this will appear in parent.$children under the key 'addressForm'
const addressValidation = useValidation(address, rules, 'addressForm');

// Now you can access the child by name:
// parentValidation.value.$children.value['addressForm']
```

This makes it easier to work with nested validations as you can directly access children by meaningful names rather than numeric indices.
</file_content>

</file_content>