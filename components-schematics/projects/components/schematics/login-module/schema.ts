export interface Schema {
  // The name of the module.
  name: string;

  // The path to create the module.
  path?: string;

  // The name of the project.
  project?: string;

  /** Wether to implement control value accessor interface */
  controlValueAccessor?: boolean;

  /** Whether to use standalone or not */
  standalone?: boolean;
}
