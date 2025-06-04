<?php
session_start();
?>
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>Procreate Web 線上繪圖專案</title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
    <div class="sidebar">
        <h1>專案管理</h1>
        <iframe src="/api/project_manager.php" frameborder="0" id="projectFrame"></iframe>
    </div>
    <div class="main">
        <div class="topbar">
            <button id="newLayerBtn" title="新增圖層">＋圖層</button>
            <button id="delLayerBtn" title="刪除圖層">－圖層</button>
            <button id="upLayerBtn" title="圖層上移">↑</button>
            <button id="downLayerBtn" title="圖層下移">↓</button>
            <button id="exportBtn" title="匯出 PNG">匯出</button>
            <button id="clearBtn" title="清空畫布">清空</button>
            <button id="saveBtn" title="儲存專案">儲存</button>
        </div>
        <div class="canvas-area">
            <div id="layerList" class="layer-list"></div>
            <div class="canvas-stack" id="canvasStack"></div>
        </div>
        <div class="toolbar">
            <div>
                <label>筆刷顏色 <input type="color" id="colorPicker" value="#222222"></label>
                <label>粗細 <input type="range" id="brushSize" min="1" max="50" value="8"></label>
                <label>不透明 <input type="range" id="brushAlpha" min="1" max="100" value="100"></label>
                <button id="eraserBtn" title="橡皮擦">橡皮擦</button>
                <button id="brushBtn" title="筆刷">筆刷</button>
            </div>
            <div class="palette">
                <span>調色盤：</span>
                <button class="pcolor" style="background:#222222"></button>
                <button class="pcolor" style="background:#f44336"></button>
                <button class="pcolor" style="background:#2196f3"></button>
                <button class="pcolor" style="background:#4caf50"></button>
                <button class="pcolor" style="background:#ffeb3b"></button>
                <button class="pcolor" style="background:#ffffff"></button>
                <button class="pcolor" style="background:#000000"></button>
            </div>
        </div>
    </div>
    <script src="/assets/layer.js"></script>
    <script src="/assets/draw.js"></script>
    <script>
    // 畫布載入專案自動還原
    <?php
    if (isset($_SESSION['loaded_img']) && is_array($_SESSION['loaded_img'])) {
        echo "window.onload = function() {
            restoreProject(" . json_encode($_SESSION['loaded_img']) . ");
        };";
        unset($_SESSION['loaded_img']);
    }
    ?>
    </script>
</body>
</html>