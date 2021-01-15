window.addEventListener('DOMContentLoaded', () => {
  const ide = document.body.querySelector('playground-ide');
  const saveButton = document.body.querySelector('.save-button');
  const snackbar = document.body.querySelector('.copy-snackbar');
  const url = new URL(window.location.href);

  const project = url.searchParams.get('project');
  if (project) {
    const decoded = JSON.parse(atob(project));
    // TODO(aomarks) We really need a second origin now that it is trivial for
    // somebody to share a link that executes arbitrary code.
    // https://github.com/PolymerLabs/lit.dev/issues/26
    ide.files = decoded;
  }

  saveButton.addEventListener('click', async () => {
    const project = btoa(JSON.stringify(ide.files));
    url.searchParams.set('project', project);
    window.history.replaceState(null, '', url.toString());
    await navigator.clipboard.writeText(url.toString());
    snackbar.show();
  });
});
