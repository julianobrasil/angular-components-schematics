# Side note

This is an alpha-version library yet. If you have a nice idea for a 
componnt schematic, or a suggestion to improve the code base, api etc, 
don't be shy and submit a PR.

## How to contribute

If you want to compile the project, from the project root:

`ng build components`

Switch to components project and:

`npm run build`

Switch back to project root and

`npm link dist/component`

Then you can run the Schematics

# Using @julianobrasil/schematics-components 

## Install the schematics library

`npm install --save-dev @julianobrasil/schematics-components`

### `ControlValueAccessor` interface

All the generated components are built with two features out-of-the-box:
  - A component service (in the same directory of the component) containing an empty
    interface named after the component name suffixed with "Data". The service is
    already injected in the component and its scoped to the whole app. This is useful
    to be used as a façade service.
    - For example: if your component class is `MyComponent`, the interface will be
    `MyComponentData` 
  - A skeleton for the `ControlValueAccessor`
    - If you want to disable the generation of the `ControlValueAccessor` implementation,
      just add --controlValueAccessor false to the command line

## Available Schematics

### component-module schematic

Generates a module folder containing:

  - The module definition
  - A component (inside its own folder) along with its associated service
  - A routing module configures so it can be lazy loaded and can have its own routes
  - A custom module for reexporting `@angular/material` modules to the component
  - (Optional and added by default) the skeleton for the `ControlValueAccessor` implementation

Example: To generate all the files for a `my-file` module inside a `views` folder under the 
`app` folder:

`ng g @julianobrasil/schematics-components:component-module --name my-data --path views`

This will generate:

```
app
└───views
    └───my-data
        │   custom-material.module.ts
        │   index.ts
        │   my-data.module.ts
        │
        ├───my-data
        │       my-data-component.service.ts
        │       my-data.component.html
        │       my-data.component.scss
        │       my-data.component.ts
        │
        └───my-data-routing
                my-data-routing.component.ts
                my-data-routing.module.ts
```

### component schematic

Generates a component folder containing:

  - A component along with its associated service
  - (Optional and added by default) the skeleton for the `ControlValueAccessor` implementation

Example: To generate all the files for a `my-file` component inside a `views` folder under the 
`app` folder:

`ng g @julianobrasil/schematics-components:component --name my-data --path views`

This will generate:

```
app
└───views
    └───my-data
            my-data-component.service.ts
            my-data.component.html
            my-data.component.scss
            my-data.component.ts
```

Note: Notice that the component isn't declared in any module of your project, so its your
responsability to do so.
