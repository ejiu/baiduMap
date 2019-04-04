function DIYOverlay(center, length){
    this._center = center;
    this._length = length;
}

DIYOverlay.prototype = new BMap.Overlay();
DIYOverlay.prototype.initialize = function(map){
    // 保存map对象实例
    this._map = map;
    // 创建div元素，作为自定义覆盖物的容器
    var div = document.createElement("div");
    div.style.position = "absolute";
    // 可以根据参数设置元素外观
    div.style.width = this._length + "px";
    div.style.height = this._length + "px";
    // 将div添加到覆盖物容器中
    map.getPanes().markerPane.appendChild(div);
    // 保存div实例
    this._div = div;
    var arrow = this._arrow = document.createElement("img");
    arrow.src = "./res/ring.png";
    arrow.style.width = this._length + "px";
    arrow.style.height = this._length + "px";
    arrow.style.top = "0px";
    arrow.style.left = "0px";
    
    div.appendChild(arrow);
    return div;
}

DIYOverlay.prototype.draw = function(){    
    // 根据地理坐标转换为像素坐标，并设置给容器    
    var position = this._map.pointToOverlayPixel(this._center);    
    this._div.style.left = position.x - this._length / 2 + "px";    
    this._div.style.top = position.y - this._length / 2 + "px";    
}
// 实现显示方法    
DIYOverlay.prototype.show = function(){    
    if (this._div){    
        this._div.style.display = "";    
    }    
}      
// 实现隐藏方法  
DIYOverlay.prototype.hide = function(){    
    if (this._div){    
        this._div.style.display = "none";    
    }    
}