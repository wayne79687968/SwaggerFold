const vscode = require('vscode');

// Global settings
let globalSettings = {
    autoFoldOnOpen: false,  // Whether to auto-fold when opening files
    foldState: 'none',      // 'fold', 'unfold', 'none'
    userManualActions: new Map()  // Record user manual actions: file uri -> { action: 'fold'|'unfold', timestamp: number }
};

function activate(context) {
    console.log('SwaggerFold is now active!');

    let provider = new SwaggerFoldingRangeProvider();

    // Register folding range provider
    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider(
        { language: 'php', scheme: 'file' },
        provider
    ));

    // Listen for file opening events and focus changes
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(async (editor) => {
        if (editor && editor.document.languageId === 'php') {
            // Auto-fold functionality
            if (globalSettings.autoFoldOnOpen) {
                const hasSwagger = hasSwaggerComments(editor.document);
                if (hasSwagger) {
                    const fileUri = editor.document.uri.toString();

                    // Check if user has manually operated this file within the last 5 minutes
                    const userAction = globalSettings.userManualActions.get(fileUri);
                    const now = Date.now();
                    const recentActionThreshold = 5 * 60 * 1000; // 5 minutes

                    if (userAction && (now - userAction.timestamp) < recentActionThreshold) {
                        console.log(`Skipping auto-fold for ${editor.document.fileName} - user recently performed manual ${userAction.action} action`);
                        return;
                    }

                    console.log(`Auto-applying fold state "${globalSettings.foldState}" to file: ${editor.document.fileName}`);

                    // Wait for editor to fully load
                    await new Promise(resolve => setTimeout(resolve, 200));

                    if (globalSettings.foldState === 'fold') {
                        foldSwaggerComments(editor, provider);
                    } else if (globalSettings.foldState === 'unfold') {
                        await unfoldSwaggerComments(editor, provider);
                    }
                }
            }
        }
    }));

    // Listen for document opening events (for tab switching)
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(async (document) => {
        if (document.languageId === 'php') {
            // Slight delay to wait for potential editor display
            setTimeout(async () => {
                const editor = vscode.window.visibleTextEditors.find(e => e.document === document);
                if (editor) {
                    // Auto-fold functionality
                    if (globalSettings.autoFoldOnOpen) {
                        const hasSwagger = hasSwaggerComments(document);
                        if (hasSwagger) {
                            const fileUri = document.uri.toString();

                            // Check if user has manually operated this file within the last 5 minutes
                            const userAction = globalSettings.userManualActions.get(fileUri);
                            const now = Date.now();
                            const recentActionThreshold = 5 * 60 * 1000; // 5 minutes

                            if (userAction && (now - userAction.timestamp) < recentActionThreshold) {
                                console.log(`Skipping auto-fold for opened document ${document.fileName} - user recently performed manual ${userAction.action} action`);
                                return;
                            }

                            console.log(`Auto-applying fold state "${globalSettings.foldState}" to opened document: ${document.fileName}`);

                            if (globalSettings.foldState === 'fold') {
                                foldSwaggerComments(editor, provider);
                            } else if (globalSettings.foldState === 'unfold') {
                                await unfoldSwaggerComments(editor, provider);
                            }
                        }
                    }
                }
            }, 300);
        }
    }));

    // 1. Fold current page
    let foldDisposable = vscode.commands.registerCommand('swaggerfold.foldSwaggerComments', function () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            console.log('Fold command executed');
            foldSwaggerComments(editor, provider);

            // Record user manual action
            const fileUri = editor.document.uri.toString();
            globalSettings.userManualActions.set(fileUri, {
                action: 'fold',
                timestamp: Date.now()
            });
            console.log(`Recorded manual fold action for ${editor.document.fileName}`);
        }
    });

    // 2. Unfold current page
    let unfoldDisposable = vscode.commands.registerCommand('swaggerfold.unfoldSwaggerComments', async function () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            console.log('Unfold command executed');
            await unfoldSwaggerComments(editor, provider);

            // Record user manual action
            const fileUri = editor.document.uri.toString();
            globalSettings.userManualActions.set(fileUri, {
                action: 'unfold',
                timestamp: Date.now()
            });
            console.log(`Recorded manual unfold action for ${editor.document.fileName}`);
        }
    });

    // 3. Auto-processing settings
    let enableAutoFoldDisposable = vscode.commands.registerCommand('swaggerfold.enableAutoFold', async function () {
        const options = [
            { label: 'Auto Fold', description: 'Automatically fold Swagger comments when opening files', value: 'fold' },
            { label: 'Auto Unfold', description: 'Automatically unfold Swagger comments when opening files', value: 'unfold' },
            { label: 'Disable Auto Processing', description: 'Do not automatically process Swagger comments when opening files', value: 'none' }
        ];

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select automatic processing method for opening files'
        });

        if (selected) {
            if (selected.value === 'none') {
                globalSettings.autoFoldOnOpen = false;
                globalSettings.foldState = 'none';
                vscode.window.showInformationMessage('SwaggerFold: Auto-processing disabled');
            } else {
                globalSettings.autoFoldOnOpen = true;
                globalSettings.foldState = selected.value;

                // Ask if user wants to clear manual action records
                const clearManualActions = await vscode.window.showInformationMessage(
                    `SwaggerFold: Auto-${selected.value === 'fold' ? 'fold' : 'unfold'} enabled\n\nDo you want to clear previous manual action records?\n(Clearing will re-apply auto settings to all files)`,
                    'Clear Manual Actions',
                    'Keep Manual Actions'
                );

                if (clearManualActions === 'Clear Manual Actions') {
                    globalSettings.userManualActions.clear();
                    console.log('Cleared all manual action records');
                }

                // Automatically apply settings to all opened PHP files
                const visibleEditors = vscode.window.visibleTextEditors;
                let processedCount = 0;

                for (const editor of visibleEditors) {
                    if (editor.document.languageId === 'php') {
                        const hasSwagger = hasSwaggerComments(editor.document);
                        if (hasSwagger) {
                            if (selected.value === 'fold') {
                                foldSwaggerComments(editor, provider);
                            } else {
                                await unfoldSwaggerComments(editor, provider);
                            }
                            processedCount++;
                            await new Promise(resolve => setTimeout(resolve, 100));
                        }
                    }
                }

                if (processedCount > 0) {
                    vscode.window.showInformationMessage(`SwaggerFold: Auto-${selected.value === 'fold' ? 'fold' : 'unfold'} enabled and applied to ${processedCount} opened files`);
                } else {
                    vscode.window.showInformationMessage(`SwaggerFold: Auto-${selected.value === 'fold' ? 'fold' : 'unfold'} enabled`);
                }
            }
            console.log('Auto fold settings updated:', globalSettings);
        }
    });

    console.log('All commands registered successfully');
    context.subscriptions.push(foldDisposable, unfoldDisposable, enableAutoFoldDisposable);
}

function foldSwaggerComments(editor, provider) {
    const foldRanges = provider.provideFoldingRanges(editor.document);
    console.log(`Folding ${foldRanges.length} Swagger comment blocks in ${editor.document.fileName}`);

    foldRanges.forEach(range => {
        editor.selection = new vscode.Selection(range.start, 0, range.start, 0);
        vscode.commands.executeCommand('editor.fold');
    });
    editor.selection = new vscode.Selection(0, 0, 0, 0); // Reset selection
}

async function unfoldSwaggerComments(editor, provider) {
    const foldRanges = provider.provideFoldingRanges(editor.document);
    console.log(`Unfolding ${foldRanges.length} Swagger comment blocks in ${editor.document.fileName}`);

    // Use unfoldAll command to unfold all folds, then re-fold non-Swagger content
    await vscode.commands.executeCommand('editor.unfoldAll');

    // Slight delay to ensure unfolding is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    editor.selection = new vscode.Selection(0, 0, 0, 0); // Reset selection
}

// Check if file contains Swagger comments
function hasSwaggerComments(document) {
    const text = document.getText();
    // Use the same regex as SwaggerFoldingRangeProvider
    return /\* @OA/.test(text);
}

class SwaggerFoldingRangeProvider {
    provideFoldingRanges(document, context, token) {
        console.log('Providing fold ranges for document: ', document.uri);
        const foldRanges = [];
        const startRegex = /\* @OA/; // Regex to match Swagger comments
        const commentStartRegex = /\/\*\*/; // Match comment start
        const endRegex = /\*\//; // Match comment end

        let inCommentBlock = false;
        let startLine = 0;

        for (let i = 0; i < document.lineCount; i++) {
            const lineText = document.lineAt(i).text;

            // If @OA tag is found
            if (startRegex.test(lineText)) {
                if (!inCommentBlock) {
                    // Search upward for comment start position
                    let commentStart = i;
                    for (let j = i - 1; j >= 0; j--) {
                        const prevLineText = document.lineAt(j).text;
                        if (commentStartRegex.test(prevLineText)) {
                            commentStart = j;
                            break;
                        }
                        // If encountering non-comment line, stop searching
                        if (!prevLineText.trim().startsWith('*') && !prevLineText.trim().startsWith('/*')) {
                            break;
                        }
                    }

                    startLine = commentStart;
                    inCommentBlock = true;
                    console.log(`Found Swagger comment starting at line ${startLine}`);
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

function deactivate() {
    console.log('SwaggerFold is now deactivated!');
}

exports.activate = activate;
exports.deactivate = deactivate;