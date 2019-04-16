
var getMarker = function(map, beginPoint, title, endPoint){
    var myIcon = new BMap.Icon("./res/icon_end.png", new BMap.Size(28,37), {  
        anchor: new BMap.Size(14, 37), // 指定定位位置  
        imageOffset: new BMap.Size(0, 0) // 设置图片偏移  
    });

    var marker = new BMap.Marker(endPoint, {icon:myIcon});

    var res = calculateAngle(map.pointToPixel(beginPoint), map.pointToPixel(endPoint));
    var mountainSite = res[0];
    var direction = res[1];
    
    var label = new BMap.Label(mountainSite,{offset:new BMap.Size(30,-5)});
    label.setStyle({
        color: "black",
        fontSize: "32px",
        backgroundColor: "white"
    })
    marker.setLabel(label);

    var distance = (map.getDistance(beginPoint, endPoint)/1000).toFixed(2);

    GpsToAddress(endPoint, (value)=>{
        addr = value;
        var secondLabel = new BMap.Label(title + "("+distance +"公里,"+direction+")",{offset:new BMap.Size(0, 45)});
        marker.setLabel(secondLabel);
    });
    return marker;
}


var getRing = function(point, radius){
    var ring = new DIYOverlay(point, radius);
    return ring;
}

var getLine = function(beginPoint, endPoint){
    var polyline = new BMap.Polyline([beginPoint, endPoint], {
        strokeColor:"red",
        strokeStyle:"solid",
        strokeWeight:1,
        strokeOpacity:1
    });

    return polyline;
}

var updateOverlay = function(map, beginPoint, endSite){
    map.clearOverlays();

    var points = [beginPoint];
    var ring = getRing(beginPoint, 450);
    if(ring){
        map.addOverlay(ring);
    }

    for(var i in endSite){
        var dataStr = endSite[i];
        var tmpPoint = new BMap.Point(dataStr[1], dataStr[2]);
        addNewSite(map, beginPoint, dataStr[0], tmpPoint);
        points.push(tmpPoint);
    }
    moveCamera(map, points);
}

//添加新地点(连线, 标记, 方位, 地址等覆盖物)
var addNewSite = function(map, beginPoint, endTitle, endPoint){
    //如果两点太近, 不绘制新地点,直接返回;
    if((Math.abs(beginPoint.lng - endPoint.lng) < 0.000001 && Math.abs(beginPoint.lat - endPoint.lat) < 0.000001)){
        return ;
    }
    //如果终点与原点同名,则不绘制该终点,直接返回
    var beginName = getBeginName();
    if(beginName == endTitle){
        return;
    }
    var mark = getMarker(map, beginPoint, endTitle, endPoint);
    var line = getLine(beginPoint, endPoint);

    if(line){
        map.addOverlay(line);
    }
    if(mark){
        map.addOverlay(mark);
    }
}

//相机置points中
var moveCamera = function(map, points){
    var view = map.getViewport(eval(points));
    var mapZoom = view.zoom; 
    var centerPoint = view.center; 
    //视野原点为起点
    map.centerAndZoom(points[0],mapZoom);
}

var calculateAngle = function(beginPoint, endPoint){
    //计算角度时, 缩放层级设置最大
    map.setZoom(18);

    var offsetX = beginPoint.x - endPoint.x;
    var offsetY = beginPoint.y - endPoint.y;

    var direction;

    var angle = 0;
    //以小键盘九宫格为方位,起点位于原点5;
    //终点9
    if(offsetX < 0 && offsetY > 0){
        angle = Math.atan2(Math.abs(offsetX), Math.abs(offsetY));
        angle = angle * 180 / Math.PI;        
    }
    //终点3
    else if(offsetX < 0 && offsetY < 0){
        angle = Math.atan2(Math.abs(offsetY), Math.abs(offsetX));
        angle = (angle * 180 / Math.PI) + 90;        
    }      
    //终点1  
    else if(offsetX > 0 && offsetY < 0){
        angle = Math.atan2(Math.abs(offsetX), Math.abs(offsetY));
        angle = (angle * 180 / Math.PI) + 180;        
    }
    //终点7
    else if(offsetX > 0 && offsetY > 0){
        angle = Math.atan2(Math.abs(offsetY), Math.abs(offsetX));
        angle = (angle * 180 / Math.PI) + 270;        
    }else if(offsetX == 0 && offsetY != 0){
        //终点2
        if(offsetY < 0){
            angle = 180;            
        }
        //终点8
        else{
            angle = 0;            
        }
    }else if(offsetY == 0 && offsetX != 0){
        //终点4
        if(offsetX > 0){
            angle = 270;            
        }
        //终点6
        else{
            angle = 90;            
        }
    }else{
        //起点-终点 距离过近,无法计算角度
        angle = 0;
        // angle = Math.random() * 360;        
    }

    
    // console.log("angle: "+angle);
    var str;
    
    if(angle > 360){
        str = "错误";
    }
    else if(angle > 352.5){
        str = "子";
        direction = "北";
    }
    else if(angle > 337.5){
        str = "壬";
        direction = "北";
    }
    else if(angle > 322.5){
        str = "亥";
        direction = "西北";
    }
    else if(angle > 307.5){
        str = "乾";
        direction = "西北";
    }
    else if(angle > 292.5){
        str = "戌";
        direction = "西北";
    }
    else if(angle > 277.5){
        str = "辛";
        direction = "西";
    }
    else if(angle > 262.5 ){
        str = "酉";
        direction = "西";
    }
    else if(angle > 247.5){
        str = "庚";
        direction = "西";
    }
    else if(angle > 232.5){
        str = "申";
        direction = "西南";
    }
    else if(angle > 217.5){
        str = "坤";
        direction = "西南";
    }
    else if(angle > 202.5){
        str = "未";
        direction = "西南";
    }
    else if(angle > 187.5){
        str = "丁";
        direction = "南";
    }
    else if(angle > 172.5){
        str = "午";
        direction = "南";
    }
    else if(angle > 157.5){
        str = "丙";
        direction = "南";
    }
    else if(angle > 142.5){
        str = "巳";
        direction = "东南";
    }
    else if(angle > 127.5){
        str = "巽";
        direction = "东南";
    }
    else if(angle > 112.5 ){
        str = "辰";
        direction = "东南";
    }
    else if(angle > 97.5 ){
        str = "乙";
        direction = "东";
    }
    else if(angle > 82.5 ){
        str = "卯";
        direction = "东";
    }
    else if(angle > 67.5 ){
        str = "甲";
        direction = "东";
    }
    else if(angle > 52.5 ){
        str = "寅";
        direction = "东北";
    }
    else if(angle > 37.5 ){
        str = "艮";
        direction = "东北";
    }
    else if(angle > 22.5){
        str = "丑";
        direction = "东北";
    }
    else if(angle > 7.5){
        str = "癸";
        direction = "北";
    }
    else if(angle >= 0){
        str = "子";
        direction = "北";
    }else{
        str = "错误";
        direction = "none";
    }
    
    direction = direction + angle.toFixed(2) + "°";
    return [str, direction];
}
