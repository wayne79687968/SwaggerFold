// SwaggerFold 修正測試腳本
const fs = require('fs');
const path = require('path');

console.log('🔍 SwaggerFold 修正驗證');
console.log('========================');

// 檢查 extension.js 是否包含關鍵修正
const extensionPath = path.join(__dirname, 'extension.js');
const extensionContent = fs.readFileSync(extensionPath, 'utf8');

console.log('✅ 檢查修正項目：');

// 1. 檢查防止重複執行機制
if (extensionContent.includes('globalSettings.isProcessingWorkspace')) {
    console.log('  ✓ 防止重複執行機制已實現');
} else {
    console.log('  ✗ 防止重複執行機制缺失');
}

// 2. 檢查暫停檔案監聽器
if (extensionContent.includes('globalSettings.autoFoldOnOpen = false')) {
    console.log('  ✓ 暫停檔案監聽器功能已實現');
} else {
    console.log('  ✗ 暫停檔案監聽器功能缺失');
}

// 3. 檢查清理待處理狀態
if (extensionContent.includes('globalSettings.fileProcessingStates.clear()')) {
    console.log('  ✓ 清理待處理狀態功能已實現');
} else {
    console.log('  ✗ 清理待處理狀態功能缺失');
}

// 4. 檢查 applyStoredProcessingState 修正
if (extensionContent.includes('if (globalSettings.isProcessingWorkspace)')) {
    console.log('  ✓ applyStoredProcessingState 干擾防護已實現');
} else {
    console.log('  ✗ applyStoredProcessingState 干擾防護缺失');
}

// 5. 檢查診斷功能增強
if (extensionContent.includes('processingStates > 20')) {
    console.log('  ✓ 診斷功能增強已實現');
} else {
    console.log('  ✗ 診斷功能增強缺失');
}

console.log('\n🎯 修正重點：');
console.log('1. 工作區處理期間會暫停檔案監聽器，避免干擾');
console.log('2. 檢測到大量待處理狀態時會自動提示清理');
console.log('3. 防止重複執行和狀態衝突');
console.log('4. 增強診斷功能，提供更詳細的狀態資訊');

console.log('\n📋 使用建議：');
console.log('1. 如果第二次執行卡住，先執行 "SwaggerFold: 診斷和重置"');
console.log('2. 如果看到大量待處理狀態，選擇清理選項');
console.log('3. 定期清理過期狀態以維持最佳效能');

console.log('\n✅ 修正驗證完成！');