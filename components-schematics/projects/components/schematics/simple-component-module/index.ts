import {
  Rule,
  Tree,
  SchematicsException,
  apply,
  url,
  applyTemplates,
  move,
  chain,
  mergeWith
} from '@angular-devkit/schematics';
import {buildDefaultPath} from '@schematics/angular/utility/project';
import {parseName} from '@schematics/angular/utility/parse-name';

import {strings, normalize, experimental} from '@angular-devkit/core';

import {Schema as SimpleComponentModuleSchema} from './schema';

export function simpleComponentModule(
    options: SimpleComponentModuleSchema): Rule {
  return (tree: Tree) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new SchematicsException(
          'Could not find Angular workspace configuration');
    }

    // convert workspace to string
    const workspaceContent = workspaceConfig.toString();

    // parse workspace string into JSON object
    const workspace: experimental.workspace.WorkspaceSchema =
        JSON.parse(workspaceContent);

    if (!options.project) {
      options.project = workspace.defaultProject;
    }

    const projectName = options.project as string;

    const project = workspace.projects[projectName];

    const projectType = project.projectType === 'application' ? 'app' : 'lib';

    const defaultProjectPath = buildDefaultPath(project as any);
    const parsedPath = parseName(defaultProjectPath, options.name);
    const {name, path} = parsedPath;

    if (options.path === undefined) {
      options.path = `${project.sourceRoot}/${projectType}`;
      tree.create(`${path}/${name}/index.ts`,
                `export * from './${options.name}.module';\n`);
    } else {
      tree.create(`${path}/${options.path}/${name}/index.ts`,
                `export * from './${options.name}.module';\n`);
      options.path = `${project.sourceRoot}/${projectType}/${options.path}`;
    }

    console.log(options.path);

    const templateSource = apply(url('./files'), [
      applyTemplates({
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: options.name
      }),
      move(normalize(options.path as string))
    ]);

    return chain([mergeWith(templateSource)]);
  };
}
