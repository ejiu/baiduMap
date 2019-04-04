var GpsToAddress = function(point, callback){
    var geoc = new BMap.Geocoder();    
    geoc.getLocation(point, function(rs){
        var addComp = rs.addressComponents;
        var str;
        if(addComp.province == addComp.city){
            str =  addComp.city + " " + addComp.district + " " + addComp.street + " "+ addComp.streetNumber;
        }else{
            str = addComp.province + " " + addComp.city + " " + addComp.district + " " + addComp.street + " "+ addComp.streetNumber;
        }
        callback(str);
    });
}

var parseURL = function(url){
    var res = {};
    var arr = [];
    if(url){
        var url = url.split("?")[1];
        var para = url.split('/&/');
        var len = para.length;
        for(var i=0;i<len;i++){
            arr = para[i].split("=");
            res[arr[0]] = arr[1];
        }
    }else{
        console.log("未取得跳转数据");
    }
    return res;
}