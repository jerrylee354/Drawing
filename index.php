<?php
// index.php — 主畫布頁面
session_start();
?>
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>Procreate 風格繪圖工具</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <div class="sidebar">
        <h2>專案管理</h2>
        <iframe src="project_manager.php" frameborder="0" style="width:100%;height:250px;"></iframe>
    </div>
    <div class="main">
        <div class="topbar">
            <button id="newProjectBtn">新專案</button>
            <button id="saveBtn">儲存</button>
            <button id="clearBtn">清空</button>
        </div>
        <canvas id="drawCanvas" width="900" height="600"></canvas>
        <div class="toolbar">
            <label>畫筆顏色: <input type="color" id="colorPicker" value="#222222"></label>
            <label>畫筆粗細: <input type="range" id="brushSize" min="1" max="50" value="5"></label>
        </div>
    </div>
    <script src="assets/draw.js"></script>
</body>
</html>