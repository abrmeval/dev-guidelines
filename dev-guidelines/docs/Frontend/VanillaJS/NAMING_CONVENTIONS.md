Folders sometimes use kebab-case (e.g., `my-folder`) eg. `my-frontend-project`
Files should use kebab-case (e.g., `my-file.js`) eg. `app.js`
Classes should use PascalCase (e.g., `MyClass`) eg. `MyComponent.js`
Functions should use camelCase (e.g., `myFunction()`) eg. `handleClick()`
Variables should use camelCase (e.g., `myVariable`) eg. `userName`
Constants should use camelCase when inside a function or  class (e.g., `myConstant`) eg. `const myConstant = 'value';` and UPPER_SNAKE_CASE when declared at the top level (e.g., `MY_CONSTANT`) eg. `const MY_CONSTANT = 'value';`
Modules should use PascalCase (e.g., `MyModule`) eg. `UserService.js`
Global variables should be avoided, but if necessary, they should use camelCase when using var or window (e.g., `myGlobalVariable`) eg. `window.myGlobalVariable. When using const, they should use UPPER_SNAKE_CASE (e.g., `MY_GLOBAL_CONSTANT`) eg. `const MY_GLOBAL_CONSTANT = 'value';`
Use Object.defineProperty() to create read-only global variables e.g. `Object.defineProperty(window, 'MY_GLOBAL_CONSTANT', { value: 'value', writable: false });`
Versioning should use semantic versioning at the end of the file (e.g., `v1.0.0`) eg. `v1.0.0` using a query parameter (e.g., `app.js?v=1.0.0`) eg. `app.js?v=1.0.0`

