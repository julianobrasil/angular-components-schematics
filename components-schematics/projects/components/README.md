## Compiling the Library

From the project root:

`ng build components`

Switch to components project and:

`npm run build`

Switch back to project root and

`npm link dist/component`

Then you can run the Schematics

## Running the Schematics 

### Install the schematics library

`npm install --save-dev @julianobrasil/schematics-components`

### Generating a sinple single component module with material and routing

`ng g @julianobrasil/schematics-components:simple-component-module --name my-data --path views`
