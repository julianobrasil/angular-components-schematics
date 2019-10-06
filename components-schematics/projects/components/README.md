# Side note

This is an alpha library yet. If you have a nice idea for a schematic,
or a way to improve the code base, api etc, don't be shy and submit
a PR.

# Compiling the Library

From the project root:

`ng build components`

Switch to components project and:

`npm run build`

Switch back to project root and

`npm link dist/component`

Then you can run the Schematics

# Running the Schematics 

## Install the schematics library

`npm install --save-dev @julianobrasil/schematics-components`

### `ControlValueAccessor` interface

All the generated component are built with two features:
  - A component service (in the same directory of the component) containing an empty
    interface named after the component name suffixed with "Data"
  - A skeleton for the `ControlValueAccessor`
    - If you want to disable the generation of the `ControlValueAccessor` implementation,
      just add --controlValueAccessor false to the command line

## Available Schematics

### component-module schematic

Generates a module folder containing:

  - The module definition
  - A component (inside its on folder)
  - A component service (inside the component folder)
  - A routing module configures so it can be lazy loaded and can have its own routes
  - A material module 
  - (Optional and added by default) the skeleton for the `ControlValueAccessor` implementation

Example: To generate all the files for a my-file module inside a `views` folder under the 
`app` folder:

`ng g @julianobrasil/schematics-components:component-module --name my-data --path views`

### component schematic

Generates a component folder containing:

  - A component (inside its on folder)
  - A component service (inside the component folder)
  - (Optional and added by default) the skeleton for the `ControlValueAccessor` implementation

Example: To generate all the files for a my-file component inside a `views` folder under the 
`app` folder:

`ng g @julianobrasil/schematics-components:component --name my-data --path views`
