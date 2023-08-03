To install the extension:

Install the vsce package:

```sh
npm install -g @vscode/vsce
```

Install the modules for the repo:
```sh
npm install
```

Package and install the extension:

```sh
# This will create the extension file under the name rails-vscode-utils-X.X.X.vsix
vsce package # Say yes to everything

code --install-extension rails-vscode-utils-X.X.X.vsix
```
