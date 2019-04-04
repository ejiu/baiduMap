var map;

var initMap = function(beginPoint, endSite, needGetGpsByGeo){
    lastBeginPoint = beginPoint;

    var tMap = new BMap.Map("container");    // 创建Map实例
    map = tMap;
    tMap.centerAndZoom(beginPoint, 15);  // 初始化地图,设置原点点坐标和地图级别
    tMap.addControl(new BMap.MapTypeControl(
        {
            mapTypes:[
                BMAP_NORMAL_MAP,
                BMAP_HYBRID_MAP
        ]}
    ));	  

    //导航组件
    var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_ZOOM
      });

    tMap.addControl(navigationControl);

    // tMap.setCurrentCity("北京");          // 设置地图显示的城市
    // tMap.disablePinchToZoom(false);      //禁用双指缩放
    tMap.enableScrollWheelZoom(false);      //开启鼠标滚轮缩放

    if(needGetGpsByGeo){
        var msg = window.AndroidObj.getGPSinfo();
        getCenterByGps3(msg);
    }

    return tMap;
}


var updateMap = function(map, beginPoint, endSite){
    //更新覆盖物(罗盘, 线段)
    updateOverlay(map, beginPoint, endSite);
    updateDefaultBeingPoint(beginPoint);
}

// 通过Html原生服务
var getCenterByGps = function(){
    if(navigator.geolocation){
        //浏览器支持geolocation
        alert('您的浏览器支持地理位置定位');
        navigator.geolocation.getCurrentPosition(success,error,options);
    }else{
        //浏览器不支持geolocation
        alert('您的浏览器不支持地理位置定位');
    }

    var options = {
        enableHighAccuracy: true,
        maximumAge: 1000
    };

    function success(pos) {
        alert("Html原生服务获取成功");

        var crd = pos.coords;
        console.log('Your current position is:');
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        console.log('More or less ' + crd.accuracy + ' meters.');
        var newPoint = new BMap.Point(crd.longitude, crd.latitude);

        setTimeout(function(){
            var convertor = new BMap.Convertor();
            var pointArr = [];
            pointArr.push(newPoint);
            convertor.translate(pointArr, 1, 5, translateCallback)
        }, 100); 

        translateCallback = function (data){
            if(data.status === 0) {
                updateMap(map, data.points[0], endSite);
            }
        }
    };
    function error(err) {
        status=true;
        switch(error.code){
            case error.PERMISSION_DENIED:
                alert("定位失败,用户拒绝请求地理定位");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("定位失败,位置信息是不可用");
                break;
            case error.TIMEOUT:
                alert("定位失败,请求获取用户位置超时");
                break;
            case error.UNKNOWN_ERROR:
                alert("定位失败,定位系统失效");
                break;
        }
    };    
}

//baiduMap JS API
var getCenterByGps2 = function(){
    var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){

        alert("status:"+this.SW);
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            //根据新起点(r.point)设置地图,并更新地图及覆盖物
            console.log('您的位置：'+r.point.lng+'/,/'+r.point.lat);
            updateMap(map, r.point, endSite);
        }
        else {
            console.log('failed'+this.getStatus());
        }
    },{enableHighAccuracy: true});
}

//baiduMap android sdk获取GPS, 传值到JS中;
var getCenterByGps3 = function(data){
    if(data){
        var dataStr = data.split('-');
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数

        if(regPos.test(dataStr[0]) || regNeg.test(dataStr[0]) || regPos.test(dataStr[1]) || regNeg.test(dataStr[1])) {
            var point = new BMap.Point(parseFloat(dataStr[0]), parseFloat(dataStr[1]));
            updateMap(map, point, endSite);
            return true;
        }
    }else{
        return false;
    }
}