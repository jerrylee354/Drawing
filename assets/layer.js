// 多圖層管理
class LayerManager {
    constructor() {
        this.layers = [];
        this.current = 0;
        this.width = 900;
        this.height = 600;
        this.layerList = document.getElementById("layerList");
        this.canvasStack = document.getElementById("canvasStack");
        this.init();
    }
    init() {
        // 預設一層
        this.addLayer();
        this.updateUI();
    }
    createLayer(name) {
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.className = "draw-layer";
        canvas.tabIndex = 0;
        // 事件註冊
        ["mousedown","touchstart"].forEach(ev=>canvas.addEventListener(ev, window.drawEvents.start));
        ["mousemove","touchmove"].forEach(ev=>canvas.addEventListener(ev, window.drawEvents.move));
        ["mouseup","mouseleave","touchend"].forEach(ev=>canvas.addEventListener(ev, window.drawEvents.end));
        return { name: name || `圖層${this.layers.length+1}`, canvas: canvas, visible: true };
    }
    addLayer(name) {
        let layer = this.createLayer(name);
        this.layers.splice(this.current+1, 0, layer);
        this.current = this.current+1;
        this.updateUI();
    }
    deleteCurrentLayer() {
        if(this.layers.length <= 1) return alert("至少需保留一層");
        this.layers.splice(this.current, 1);
        if(this.current >= this.layers.length) this.current = this.layers.length-1;
        this.updateUI();
    }
    moveLayerUp() {
        if(this.current <= 0) return;
        [this.layers[this.current], this.layers[this.current-1]] = [this.layers[this.current-1], this.layers[this.current]];
        this.current = this.current-1;
        this.updateUI();
    }
    moveLayerDown() {
        if(this.current >= this.layers.length-1) return;
        [this.layers[this.current], this.layers[this.current+1]] = [this.layers[this.current+1], this.layers[this.current]];
        this.current = this.current+1;
        this.updateUI();
    }
    getCurrentLayer() {
        return this.layers[this.current];
    }
    updateUI() {
        // Layer list
        this.layerList.innerHTML = "";
        this.layers.forEach((layer, idx)=>{
            let div = document.createElement("div");
            div.className = "layer-item" + (idx===this.current?" active":"");
            div.innerHTML = `<span>${layer.name}</span>`;
            div.onclick = ()=>{ this.current = idx; this.updateUI(); };
            this.layerList.appendChild(div);
        });
        // Canvas stack
        this.canvasStack.innerHTML = "";
        this.layers.forEach((layer, idx)=>{
            layer.canvas.style.zIndex = idx;
            layer.canvas.style.display = layer.visible ? "block" : "none";
            layer.canvas.className = "draw-layer" + (idx===this.current?" active":"");
            this.canvasStack.appendChild(layer.canvas);
        });
    }
    clearAll(){
        this.layers.forEach(l=>{
            let ctx = l.canvas.getContext("2d");
            ctx.clearRect(0,0,l.canvas.width, l.canvas.height);
        });
    }
    exportMergedPNG(){
        let temp = document.createElement("canvas");
        temp.width = this.width;
        temp.height = this.height;
        let tctx = temp.getContext("2d");
        this.layers.forEach(l=>{
            if(l.visible) tctx.drawImage(l.canvas,0,0);
        });
        return temp.toDataURL("image/png");
    }
    serialize(){
        // 儲存所有圖層資料
        return {
            layers: this.layers.map(l=>{
                return {name:l.name, visible:l.visible, img: l.canvas.toDataURL("image/png")};
            }),
            current: this.current
        };
    }
    restore(data){
        if(!data || !data.layers) return;
        this.layers = [];
        data.layers.forEach((l, idx)=>{
            let layer = this.createLayer(l.name);
            let img = new Image();
            img.onload = ()=>layer.canvas.getContext("2d").drawImage(img,0,0);
            img.src = l.img;
            layer.visible = l.visible;
            this.layers.push(layer);
        });
        this.current = data.current || 0;
        this.updateUI();
    }
}

window.layerManager = new LayerManager();
