import {Tree, SchematicsException} from '@angular-devkit/schematics';

import {workspaces} from '@angular-devkit/core';
import {createHost} from './create-host';

export async function findProject(
  tree: Tree,
  name?: string,
): Promise<workspaces.ProjectDefinition> | never {
  const host = createHost(tree);
  const {workspace} = await workspaces.readWorkspace('/', host);

  // const workspaceConfig: Buffer | null = tree.read('/angular.json');

  // if (!workspaceConfig) {
  //   throw new SchematicsException(
  //     'Could not find Angular workspace configuration',
  //   );
  // }

  // // convert workspace to string
  // const workspaceContent = workspaceConfig.toString();

  // // parse workspace string into JSON object
  // const workspace: workspaces.WorkspaceDefinition =
  //   JSON.parse(workspaceContent);

  let projectName = name;
  if (!projectName) {
    if (workspace.projects.size > 1) {
      throw new SchematicsException('You need to specify the project name');
    }
    projectName = workspace.projects.keys().next().value as string;
  }

  const project: workspaces.ProjectDefinition | undefined =
    workspace.projects.get(projectName);

  if (!project) {
    throw new SchematicsException(
      name
        ? 'No project was find with that name'
        : 'Could not find any suitable project to apply the schematics',
    );
  }

  return project;
}
