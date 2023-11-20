const vscode = require('vscode');

function activate(context) {
    console.log('SwaggerFold is now active!');

    let provider = new SwaggerFoldingRangeProvider();
    let isFolded = false;  // 追蹤摺疊狀態

    // 註冊摺疊範圍提供者
    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider(
        { language: 'php', scheme: 'file' },
        provider
    ));

    // 註冊命令
    let disposable = vscode.commands.registerCommand('swaggerfold.foldSwaggerComments', function () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            console.log('Fold command executed');
            if (!isFolded) {
                foldSwaggerComments(editor, provider);
                isFolded = true;
            } else {
                unfoldSwaggerComments(editor, provider);
                isFolded = false;
            }
        }
    });

    context.subscriptions.push(disposable);
}

function foldSwaggerComments(editor, provider) {
    const foldRanges = provider.provideFoldingRanges(editor.document);
    foldRanges.forEach(range => {
        editor.selection = new vscode.Selection(range.start, 0, range.start, 0);
        vscode.commands.executeCommand('editor.fold');
    });
    editor.selection = new vscode.Selection(0, 0, 0, 0); // 重置選擇
}

function unfoldSwaggerComments(editor, provider) {
    const foldRanges = provider.provideFoldingRanges(editor.document);
    foldRanges.forEach(range => {
        editor.selection = new vscode.Selection(range.start, 0, range.start, 0);
        vscode.commands.executeCommand('editor.unfold');
    });
    editor.selection = new vscode.Selection(0, 0, 0, 0); // 重置選擇
}

class SwaggerFoldingRangeProvider {
    provideFoldingRanges(document, context, token) {
        console.log('Providing fold ranges for document: ', document.uri);
        const foldRanges = [];
        const startRegex = /\* @OA/; // 正則表達式匹配 Swagger 註釋
        const endRegex = /\*\//;

        let inCommentBlock = false;
        let startLine = 0;

        for (let i = 0; i < document.lineCount; i++) {
            const lineText = document.lineAt(i).text;

            if (startRegex.test(lineText)) {
                if (!inCommentBlock) {
                    startLine = i;
                    inCommentBlock = true;
                }
            } else if (endRegex.test(lineText) && inCommentBlock) {
                console.log(`Adding fold range: ${startLine} to ${i}`);
                foldRanges.push(new vscode.FoldingRange(startLine, i));
                inCommentBlock = false;
            }
        }

        console.log(`Total fold ranges provided: ${foldRanges.length}`);
        return foldRanges;
    }
}

exports.activate = activate;
