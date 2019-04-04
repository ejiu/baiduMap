var map = new BMap.Map("searchMapContainer");

//初始化
var initSearchPage = function(){
    var beginPoint = getBeginPoint();
    if(beginPoint){
        map.centerAndZoom(beginPoint, 15);
    }
    console.log("initSearchPage");
}

//获取Input值,开始搜索
var searchPlace = function(){
    var searchInput = document.getElementById("suggestId");
    console.log(searchInput.value);

    var options = {
        onSearchComplete: function(results){
            // 判断状态是否正确
            if (local.getStatus() == BMAP_STATUS_SUCCESS){
                setResultList(results);
            }else{
                var obj = document.getElementById("r-result");
                obj.innerHTML = "无搜索结果";
            }
        }
    };
    var local = new BMap.LocalSearch(map, options);
    local.search(searchInput.value);
}

//设置结果列表
var setResultList = function(results){
    console.log("setResultList");
    
    var obj = document.getElementById("r-result");
    obj.innerHTML = null;

    for (var i = 0; i < results.getCurrentNumPois(); i ++){

        var ele = document.createElement("div");
        var rad = document.createElement("input");
        var label = document.createElement("label");
        rad.type = "radio";
        rad.name = "addr";
        //title, lng, lat, true 默认显示该终点;
        rad.value = results.getPoi(i).title + "/,/" + results.getPoi(i).point.lng + "/,/" + results.getPoi(i).point.lat + "/,/true";
        var str = results.getPoi(i).title + ", " + results.getPoi(i).address;
        label.innerHTML = str;

        ele.appendChild(rad);
        ele.appendChild(label);
        obj.append(ele);
    }
}

//设置地点
var setSitePoint = function(){
    var point = getCheckedPoint();
    if(point){
        var searchInput = document.getElementById("suggestId");
        var name = prompt("请输入自定义名称", searchInput.value);
        if(name){
            var dataStr = point.split('/,/');
            //连同'/,/'一并替换,防止dataStr[0]是其他兄弟元素的子集,从而替换多处
            //特殊情况: dataStr[0] 刚好为经纬度或"true/false". 暂不考虑;
            //replace默认仅替换一处, 但从安全角度仍保留后缀替换;
            point = point.replace(dataStr[0]+'/,/', name+'/,/');
            return addSiteData(point);
        }
    }else{
        alert("未选中任意点");
        return false;
    }
}

//添加原点
var setCenterPoint = function(){
    var point = getCheckedPoint();
    if(point){
        var searchInput = document.getElementById("suggestId");
        var name = prompt("请输入自定义名称", searchInput.value);
        if(name){
            var dataStr = point.split('/,/');
            point = point.replace(dataStr[0]+'/,/', name+'/,/');
            return addCenterData(point);
        }
    }else{
        alert("未选中任意点");
        return false;
    }
}

var getCheckedPoint = function(){
    var str;
    var radios = document.getElementsByName("addr");
    for(var i in radios){
        if(radios[i].checked == true){
            str = radios[i].value;
        }
    }
    if(!str){
        return;
    }
    return str;
}