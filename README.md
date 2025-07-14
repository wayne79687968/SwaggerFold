# SwaggerFold - Laravel Swagger Comment Folding Tool

A VS Code extension designed for Laravel developers to easily manage folding and unfolding of Swagger/OpenAPI comments in PHP files.

## ✨ Features

- 🎯 **Smart Detection**: Automatically detects Swagger comment blocks starting with `@OA`
- 🔽 **One-Click Fold**: Quickly fold all Swagger comments to keep code clean
- 🔼 **One-Click Unfold**: Quickly unfold all Swagger comments when needed
- 🚀 **Auto Processing**: Configure automatic folding/unfolding when opening files
- 🧠 **Smart Memory**: Remembers your manual actions and respects your preferences
- ⚡ **Lightweight**: Simple, fast, and focused on core functionality

## 📦 Installation

1. Open VS Code
2. Press `Ctrl+Shift+X` to open the Extensions marketplace
3. Search for "SwaggerFold"
4. Click Install

## 🚀 Quick Start

### Basic Operations

1. **Fold Swagger Comments in Current File**
   - Command Palette: `SwaggerFold: Fold Swagger Comments`
   - Shortcut: `Ctrl+Shift+P` → type "fold swagger"

2. **Unfold Swagger Comments in Current File**
   - Command Palette: `SwaggerFold: Unfold Swagger Comments`

3. **Configure Auto Processing**
   - Command Palette: `SwaggerFold: Auto Processing Settings`
   - Choose from three options:
     - **Auto Fold**: Automatically fold Swagger comments when opening files
     - **Auto Unfold**: Automatically unfold Swagger comments when opening files
     - **Disable Auto Processing**: No automatic processing

### Smart Memory System

SwaggerFold remembers your manual actions for 5 minutes. If you manually fold or unfold a file, the extension won't override your preference when you switch back to that file within the time window.

## 🎛️ Available Commands

| Command | Description |
|---------|-------------|
| `SwaggerFold: Fold Swagger Comments` | Fold Swagger comments in the current file |
| `SwaggerFold: Unfold Swagger Comments` | Unfold Swagger comments in the current file |
| `SwaggerFold: Auto Processing Settings` | Configure automatic folding/unfolding behavior |

## 🔧 How It Works

### Swagger Comment Detection

The extension detects Swagger/OpenAPI comments by looking for:
- Comment blocks containing `@OA` annotations
- Properly formatted DocBlock comments (`/** ... */`)
- Standard Laravel/PHP comment structure

### Example Swagger Comment

```php
/**
 * @OA\Get(
 *     path="/api/users",
 *     summary="Get all users",
 *     @OA\Response(
 *         response=200,
 *         description="Successful operation"
 *     )
 * )
 */
public function index()
{
    return User::all();
}
```

## 🎯 Usage Scenarios

### Scenario 1: Daily Development
```bash
# Set up auto-fold mode
SwaggerFold: Auto Processing Settings → Choose "Auto Fold"

# Now all files with Swagger comments will auto-fold when opened
```

### Scenario 2: Code Review
```bash
# Quickly fold all Swagger comments in current file
SwaggerFold: Fold Swagger Comments

# Focus on business logic code
```

### Scenario 3: Documentation Work
```bash
# Set up auto-unfold mode
SwaggerFold: Auto Processing Settings → Choose "Auto Unfold"

# All Swagger comments will be visible when opening files
```

## 🧠 Smart Memory Features

- **5-Minute Memory**: Manual actions are remembered for 5 minutes
- **Preference Respect**: Auto-processing won't override recent manual actions
- **Per-File Tracking**: Each file's manual actions are tracked independently
- **Memory Cleanup**: Option to clear manual action history when changing auto-processing settings

## 🐛 Troubleshooting

### Common Issues

1. **Extension not working**
   - Make sure you're working with PHP files
   - Check that files contain `@OA` annotations
   - Restart VS Code if needed

2. **Auto-processing not working**
   - Verify auto-processing is enabled via the settings command
   - Check if you recently performed manual actions (5-minute memory)

3. **Comments not detected**
   - Ensure Swagger comments follow DocBlock format (`/** ... */`)
   - Verify `@OA` annotations are present

## 🔄 Changelog

### v0.0.1
- 🎉 Initial release
- 🔽 Basic fold/unfold functionality
- 🚀 Auto-processing settings
- 🧠 Smart memory system
- ⚡ Lightweight and fast

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 💡 Tips

- Use auto-fold mode for cleaner code viewing during development
- Use auto-unfold mode when working extensively with API documentation
- Manual actions take precedence over auto-processing for 5 minutes
- The extension only processes files containing actual Swagger comments

---

**Happy coding with cleaner PHP files! 🚀**
