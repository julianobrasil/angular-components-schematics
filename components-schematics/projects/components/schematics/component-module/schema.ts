export interface Schema {
  // The name of the module.
  name: string;

  // The path to create the module.
  path?: string;

  // The name of the project.
  project?: string;

  /** Whether to implements control value accessor interface */
  controlValueAccessor?: boolean;
}
