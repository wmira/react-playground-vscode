
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

const upperCaseDriveLetter = (path) => {

}

function activate(context) {
    
    const { extensionPath } = context; //context.storagePath    
    const { rootPath: workspacePath } = vscode.workspace;  //users work dir    
    const contentBase = path.join(path.normalize(workspacePath), '.react-playground');
    
    const playgroundUri = vscode.Uri.file(`${contentBase}/playground.html`);
    const webpackConfig = createWebpackConfig({ contentBase, extensionPath: path.resolve(extensionPath), workspacePath: path.resolve(workspacePath)});
    
    //create folder
    if (!fs.existsSync(contentBase)){
        fs.mkdirSync(contentBase);
    }

    

    const disposable = vscode.commands.registerCommand('extension.openPlayground', function () {
        
        try {
            const editor = vscode.window.activeTextEditor;
            let filePath = editor.document.uri.path;
            const isWin = /^win/.test(process.platform);

            if ( isWin ) {
                filePath = filePath.substr(1);
            }
            
            fs.writeFileSync(path.join(contentBase, 'playground.html'), createContentEntry());
            fs.writeFileSync(path.join(contentBase, 'index.js'), createEntry(filePath));
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