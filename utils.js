
const path = require('path');

const createEntryHtml = () => {
    return `<!DOCTYPE html>
    <html>
        <head>
            <style>
                * {
                    border-sizing: border-box;
                }
                html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;

                }
            </style>
        </head>
        <body>            
            <div id='app'></div>
            <script src='main.js'></script>            
        </body>
    </html>`;
}
const createContentEntry = (port = 9123) => {
    return `<html>
        <header>
            <style>
                body, html, div {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background-color: #fff;
                }
            </style>
        </header>
        <body>
            <div>
                <iframe src="http://localhost:${port}" width="100%" height="100%" seamless frameborder=0>
                </iframe>
            </div>
        </body>
    </html>`
}
//
const createWebpackConfig = ({ devServerPort = 9123, contentBase, extensionPath, workspacePath }) => {
    //contentBase is where webpack dev server will serve our updated content
    
    return {
        entry: path.join(contentBase, 'index.js'),
        output: {
            path: contentBase            
        },
        resolve: {
            modules: [path.join(extensionPath, 'node_modules'), path.join(workspacePath, 'node_modules'), 'node_modules' ]            
        },
        context: extensionPath,        
        module: {
            rules: [
                { test: /\.js$/, 
                  exclude: /node_modules/, 
                  use: { 
                    loader: 'babel-loader', 
                    options: { 
                        presets: ['babel-preset-env', 'babel-preset-react', 'babel-preset-stage-2' ].map(require.resolve) 
                    } 
                  } 
                }
            ]
        },
        devServer: {
            contentBase: contentBase,
            port: devServerPort,
            inline: true,
            watchContentBase: true,
            clientLogLevel: 'info',
            host: 'localhost',
            overlay: true
        }
    }
}

module.exports = { createContentEntry, createEntryHtml, createWebpackConfig };
