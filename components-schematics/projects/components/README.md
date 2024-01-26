# A tiny set of component schematics

## Side note

This project was tested with Angular 17.1 only, for that reason it was added it as a peer dependency.
It may or may not work with previous versions. There are plans to port this library to previous
angular versions, but no timeline for it to be done.

@julianobrasil/schematics-components is an alpha-version library used in personal projects. If you
 have a nice idea for a componnt schematic, or a suggestion to improve the code base, api etc, 
don't be shy and submit a PR.

**The schematics rely on @angular/material being installed**, but you can use it and further remove
the material dependency if you like to. However, material is a peer dependency of the library, which
means you have to add the `--force` option to the `npm install`.

## How to contribute

To compile the project, *from the project root directory* (the same as `angular.json`):

```bash
ng build components
```

Switch to *components project directory*  and copy the template files to `dist` directory keeping
the directories tree by running the below commands:

```bash
npm run build
```

Switch back to project root directory and create a link to the dist directory:

```bash
npm link dist/component
```

## Showcasing or smoke-testing the library during development

1. Build the project following the steps above
1. In the `package.json` of the root of the library (same diretory of the `Angular.json` file),
   add a dependency like this: `"@julianobrasil/schematics-components": "file:dist/components`
1. Run `npm install`

For every change you make in the library, rebuild it, and `npm install` again

## Using the library in your project

### Install the schematics library

```bash
npm install --save-dev @julianobrasil/schematics-components
```

### Default Behavior

All the generated components are built with two features out-of-the-box:
  1 - A component service (in the same directory of the component). The service is
    already injected in the component and it's scoped to the component only. This is useful to be
    used as a façade service (so you keep your component class cleaner).
  2 - A skeleton for the `ControlValueAccessor` (optional)
    - In this case, an empty type, named after the component's name suffixed with "Data" will
      also be created in the same file of the component service. That type will be used to
      represent the data in the Angular form.
      - For example: if your component class is `MyComponent`, the type will be
        `MyComponentData`
    - If you want to disable the generation of the `ControlValueAccessor` implementation,
      just add `--control-value-accessor false` to the command line

### Available Schematics

#### `component-module`/`login-module` schematic

Generates a module folder containing:

  - The module definition
  - A component (inside its own folder) along with its associated service
  - A routing module configured so it can be lazy loaded and can have its own routes
  - A custom module for reexporting `@angular/material` modules to the component
  - (Optional and added by default) the skeleton for the `ControlValueAccessor` implementation

For the **`login-module` schematics only**, you can also add the `--standalone true` option, then
you'll end up with:

  - A standalone component (inside its own folder) along with its associated service
  - A routing folder with exported routes and a routing component lazy loaded and can have its own routes
  - (Optional and added by default) the skeleton for the `ControlValueAccessor` implementation

Example: To generate all the files for a `my-file` module inside a `views` folder under the 
`app` folder:

```bash
ng g @julianobrasil/schematics-components:component-module --name my-data --path views
```

This will generate:

```bash
app
└─views
    └─my-data
      │  custom-material.module.ts
      │  index.ts
      │  my-data.module.ts
      │
      ├─my-data
      │  my-data-component.service.ts
      │  my-data.component.html
      │  my-data.component.scss
      │  my-data.component.ts
      │
      └───my-data-routing
            my-data-routing.component.ts
            my-data-routing.module.ts
```

To generate a login module, with a simple login screen, and named after "login":

```bash
ng g @julianobrasil/schematics-components:login-module --name login --path views
```

#### `component` schematic

Generates only a component folder containing:

  - A component along with its associated service
  - (Optional and added by default) the skeleton for the `ControlValueAccessor` implementation
  - The component will be added to a module you specify or to the main module of your application

If you add the `--standalone true` option, then you'll end up with a stand alone component

Example: To generate all the files for a `my-file` component inside a `views` folder under the 
`app` folder:

```bash
ng g @julianobrasil/schematics-components:component --name my-data --path views
```

This will generate:

```bash
app
└─views
  └─my-data
      my-data-component.service.ts
      my-data.component.html
      my-data.component.scss
    my-data.component.ts
```

Note: Notice that the component isn't declared in any module of your project, so its your
responsability to do so.
