export interface Schema {
  // The name of the module.
  name: string;

  // The declaring NgModule.
  module?: string;

  // The path to create the module.
  path?: string;

  // The name of the project.
  project?: string;

  /** Wether to implements control value accessor interface */
  controlValueAccessor?: boolean;

  /** Whether to generate a standalone or module based component */
  standalone?: boolean;
}
