import {
  Rule,
  Tree,
  apply,
  url,
  applyTemplates,
  move,
  chain,
  mergeWith,
  Source,
} from '@angular-devkit/schematics';

import {strings, normalize, workspaces} from '@angular-devkit/core';

import {Schema as ComponentModuleSchema} from './schema';
import {findProject} from '../utils/find-project';

export function componentModule(options: ComponentModuleSchema): Rule {
  return async (tree: Tree): Promise<Rule> => {
    const project: workspaces.ProjectDefinition = await findProject(
      tree,
      options.project,
    );

    const projectType =
      project.extensions.projectType === 'application' ? 'app' : 'lib';

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
