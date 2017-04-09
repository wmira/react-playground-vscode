
const vscode = require('vscode');
const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const { createEntry } = require('react-playground-kit');
const WebpackDevServer = require('webpack-dev-server');
const addDevServerEntrypoints = require('webpack-dev-server/lib/util/addDevServerEntrypoints');

const { 
    createContentEntry, 
    createEntryHtml, 
    createWebpackConfig 
} = require('./utils');

function activate(context) {
    
    const { extensionPath } = context; //context.storagePath    
    const { rootPath: workspacePath } = vscode.workspace;  //users work dir    
    const contentBase = path.join(workspacePath, '.react-playground');
    console.log(vscode.workspace, context);
    const playgroundUri = vscode.Uri.parse(`file://${contentBase}/playground.html`);
    const webpackConfig = createWebpackConfig({ contentBase, extensionPath, workspacePath});

    //create folder
    if (!fs.existsSync(contentBase)){
        fs.mkdirSync(contentBase);
    }

    

    const disposable = vscode.commands.registerCommand('extension.openPlayground', function () {
        console.log('command');
        try {
            const editor = vscode.window.activeTextEditor;
            
            console.info('Active Editor: ', editor.document); // editor.document.uri.path);
            
            fs.writeFileSync(path.join(contentBase, 'playground.html'), createContentEntry());
            fs.writeFileSync(path.join(contentBase, 'index.js'), createEntry(editor.document.uri.path));
            fs.writeFileSync(path.join(contentBase, 'index.html'), createEntryHtml());

            addDevServerEntrypoints(webpackConfig, webpackConfig.devServer);
            const compiler = webpack(webpackConfig);
            const devServer = new WebpackDevServer(compiler, webpackConfig.devServer);
            
            
            devServer.listen(webpackConfig.devServer.port, 'localhost', function(err) {
                if(err) throw err;
                isActivated = true;
                vscode.commands.executeCommand('vscode.previewHtml', playgroundUri, vscode.ViewColumn.Two, 'React Playground');
            });

            
        } catch ( e ) {
            console.error(e);
        }

    });

    context.subscriptions.push(disposable);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;