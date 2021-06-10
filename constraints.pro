constraints_min_version(1).

% Ensure the license is set to MIT.
gen_enforced_field(WorkspaceCwd, 'license', 'MIT').

% Ensure that the minimum Node.js version is 14.0.0
gen_enforced_field(WorkspaceCwd, 'engines.node', '>=14.0.0').

% Only allow private set as true
gen_enforced_field(WorkspaceCwd, 'private', true).

% Force all packages that depend on TypeScript to also depend on tslib
gen_enforced_dependency(WorkspaceCwd, 'tslib', '*', 'dependencies') :-
    workspace_has_dependency(WorkspaceCwd, 'typescript', _, DependencyType),
    DependencyType \= 'peerDependencies',
    WorkspaceCwd \= '.',
    \+ workspace_has_dependency(WorkspaceCwd, 'tslib', _, _).

% This rule will enforce that a workspace MUST depend on the same version of a dependency as the one used by the other workspaces
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType) :-
      workspace_has_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, DependencyType),
      workspace_has_dependency(OtherWorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType2),
      DependencyType \= 'peerDependencies',
      DependencyType2 \= 'peerDependencies'.

% This rule will prevent workspaces from depending on non-workspace versions of available workspaces
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, WorkspaceRange, DependencyType) :-
    workspace_has_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, DependencyType),
    workspace_ident(DependencyCwd, DependencyIdent),
    workspace_field(DependencyCwd, 'version', DependencyVersion),
    atom(DependencyVersion),
    \+ project_workspaces_by_descriptor(DependencyIdent, DependencyRange, DependencyCwd),
    (
      DependencyType \= 'peerDependencies' ->
        atom_concat('workspace:^', DependencyVersion, WorkspaceRange)
      ;
        atom_concat('^', DependencyVersion, WorkspaceRange)
    ).

% Prevent workspaces from conflicting
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType) :-
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, DependencyType),
  workspace_has_dependency(OtherWorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType2),
  DependencyRange \= DependencyRange2.

% Adds a description field.
gen_enforced_field(WorkspaceCwd, 'description', 'Description Required') :-
  WorkspaceCwd \= '.',
  \+ workspace_field(WorkspaceCwd, 'description', _).

% Names the primary author.
gen_enforced_field(WorkspaceCwd, 'author.name', '1chiSensei').
gen_enforced_field(WorkspaceCwd, 'author.email', 'mail@tomio.codes').
gen_enforced_field(WorkspaceCwd, 'author.url', 'https://github.com/1chiSensei').

% Sets our development entry file.
gen_enforced_field(WorkspaceCwd, 'main', 'dist/index.js') :-
  WorkspaceCwd \= '.'.
