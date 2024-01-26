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
  UpdateRecorder,
} from '@angular-devkit/schematics';
import {strings, normalize, workspaces, Path} from '@angular-devkit/core';
import {dasherize, classify} from '@angular-devkit/core/src/utils/strings';
import {
  findModuleFromOptions,
  buildRelativePath,
} from '@schematics/angular/utility/find-module';
import {addDeclarationToModule} from '@schematics/angular/utility/ast-utils';
import {InsertChange, Change} from '@schematics/angular/utility/change';
import {Schema as ComponentModuleSchema} from './schema';
import {
  createSourceFile,
  ScriptTarget,
  SourceFile,
} from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {findProject} from '../utils/find-project';

function readIntoSourceFile(
  host: Tree,
  modulePath: string | undefined,
): SourceFile | undefined {
  if (modulePath === undefined) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const text: Buffer | null = host.read(modulePath);
  const sourceText = !text ? '' : text.toString('utf-8');
  return createSourceFile(modulePath, sourceText, ScriptTarget.Latest, true);
}

function autoImport(options: ComponentModuleSchema): Rule {
  return (host: Tree) => {
    const modulePath: Path | undefined = findModuleFromOptions(host, options);
    const source: SourceFile | undefined = readIntoSourceFile(host, modulePath);

    if (source === undefined) {
      throw new SchematicsException(`Source ${source} does not exist.`);
    }

    const classifiedName = classify(`${options.name}Component`);

    const componentPath =
      `/${options.path}/` +
      dasherize(options.name) +
      '/' +
      dasherize(options.name) +
      '.component';

    const relativePath: string = buildRelativePath(
      !modulePath ? '' : String(modulePath),
      componentPath,
    );

    const declarationChanges: Change[] = addDeclarationToModule(
      source,
      !modulePath ? '' : String(modulePath),
      classifiedName,
      relativePath,
    );

    const declarationRecorder: UpdateRecorder = host.beginUpdate(
      !modulePath ? '' : String(modulePath),
    );

    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);
  };
}

export function component(options: ComponentModuleSchema): Rule {
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
        standalone: options.standalone,
      }),
      move(normalize(options.path as string)),
    ]);

    return chain(
      options.standalone
        ? [mergeWith(templateSource)]
        : [autoImport(options), mergeWith(templateSource)],
    );
  };
}
