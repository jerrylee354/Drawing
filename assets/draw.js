// 需配合 layer.js，提供多圖層繪製、匯出、調色盤、筆刷、橡皮擦
let brushColor = "#222222";
let brushWidth = 8;
let brushAlpha = 1;
let currentTool = "brush";
let isDrawing = false;

function getCurrentLayerCanvas() {
    let layer = window.layerManager.getCurrentLayer();
    return layer ? layer.canvas : null;
}
function getCurrentCtx() {
    let canvas = getCurrentLayerCanvas();
    return canvas ? canvas.getContext("2d") : null;
}

// 畫筆參數設定
document.getElementById('colorPicker').oninput = e => brushColor = e.target.value;
document.getElementById('brushSize').oninput = e => brushWidth = e.target.value;
document.getElementById('brushAlpha').oninput = e => brushAlpha = e.target.value / 100;
document.getElementById('eraserBtn').onclick = e => { currentTool = "eraser"; document.body.classList.add('eraser'); };
document.getElementById('brushBtn').onclick = e => { currentTool = "brush"; document.body.classList.remove('eraser'); };

// 調色盤
Array.from(document.querySelectorAll('.pcolor')).forEach(btn=>{
    btn.onclick = ()=>{ brushColor = rgb2hex(btn.style.backgroundColor); document.getElementById('colorPicker').value = brushColor; }
});
function rgb2hex(rgb){
    if(rgb.charAt(0)==="#") return rgb;
    let rgbArr = rgb.match(/\d+/g); 
    return "#" + rgbArr.map(x=>(+x).toString(16).padStart(2,"0")).join("");
}

// 畫布繪製事件
window.drawEvents = {
    start: function(e) {
        isDrawing = true;
        const ctx = getCurrentCtx();
        if (!ctx) return;
        ctx.globalAlpha = brushAlpha;
        ctx.lineWidth = brushWidth;
        ctx.lineJoin = ctx.lineCap = "round";
        ctx.strokeStyle = (currentTool === "eraser") ? "#fff" : brushColor;
        ctx.globalCompositeOperation = (currentTool === "eraser") ? "destination-out" : "source-over";
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        window.lastDraw = pos;
    },
    move: function(e) {
        if (!isDrawing) return;
        const ctx = getCurrentCtx();
        if (!ctx) return;
        ctx.globalAlpha = brushAlpha;
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = (currentTool === "eraser") ? "#fff" : brushColor;
        ctx.globalCompositeOperation = (currentTool === "eraser") ? "destination-out" : "source-over";
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        window.lastDraw = pos;
        e.preventDefault();
    },
    end: function() {
        isDrawing = false;
        const ctx = getCurrentCtx();
        if (ctx) ctx.closePath();
    }
};

// 取得滑鼠/觸控位置
function getPos(e) {
    let canvas = getCurrentLayerCanvas();
    let rect = canvas.getBoundingClientRect();
    if (e.touches) e = e.touches[0];
    return {
        x: (e.clientX - rect.left) * (canvas.width/rect.width),
        y: (e.clientY - rect.top) * (canvas.height/rect.height)
    };
}

// 匯出 PNG
document.getElementById('exportBtn').onclick = ()=>{
    let data = window.layerManager.exportMergedPNG();
    let a = document.createElement('a');
    a.href = data;
    a.download = 'procreate_web.png';
    a.click();
};

// 清空所有圖層
document.getElementById('clearBtn').onclick = ()=>{
    window.layerManager.clearAll();
};

// 儲存專案（存所有圖層）
document.getElementById('saveBtn').onclick = ()=>{
    let project = prompt("儲存專案檔名？");
    if (!project) return;
    let data = JSON.stringify(window.layerManager.serialize());
    fetch('/api/project_manager.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'action=save&project=' + encodeURIComponent(project) + '&img=' + encodeURIComponent(data)
    }).then(()=>location.reload());
};

// 載入專案（由PHP onload呼叫）
function restoreProject(data){
    window.layerManager.restore(data);
}

// 圖層按鈕事件
document.getElementById('newLayerBtn').onclick = ()=>window.layerManager.addLayer();
document.getElementById('delLayerBtn').onclick = ()=>window.layerManager.deleteCurrentLayer();
document.getElementById('upLayerBtn').onclick = ()=>window.layerManager.moveLayerUp();
document.getElementById('downLayerBtn').onclick = ()=>window.layerManager.moveLayerDown();
