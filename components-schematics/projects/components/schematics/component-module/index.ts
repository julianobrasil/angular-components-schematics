import {
  Rule,
  Tree,
  SchematicsException,
  apply,
  url,
  applyTemplates,
  move,
  chain,
  mergeWith,
  Source,
} from '@angular-devkit/schematics';

import {strings, normalize, experimental} from '@angular-devkit/core';
import {WorkspaceProject} from '@angular-devkit/core/src/experimental/workspace';

import {Schema as ComponentModuleSchema} from './schema';

export function componentModule(options: ComponentModuleSchema): Rule {
  return (tree: Tree): Rule => {
    const workspaceConfig: Buffer | null = tree.read('/angular.json');

    if (!workspaceConfig) {
      throw new SchematicsException(
        'Could not find Angular workspace configuration',
      );
    }

    // convert workspace to string
    const workspaceContent = workspaceConfig.toString();

    // parse workspace string into JSON object
    const workspace: experimental.workspace.WorkspaceSchema = JSON.parse(
      workspaceContent,
    );

    if (!options.project) {
      options.project = workspace.defaultProject;
    }

    const projectName = options.project as string;

    const project: WorkspaceProject = workspace.projects[projectName];

    const projectType = project.projectType === 'application' ? 'app' : 'lib';

    if (options.path === undefined) {
      options.path = `${project.sourceRoot}/${projectType}`;
    } else {
      options.path = `${project.sourceRoot}/${projectType}/${options.path}`;
    }

    const templateSource: Source = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: options.name,
        controlValueAccessor: options.controlValueAccessor,
      }),
      move(normalize(options.path as string)),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
