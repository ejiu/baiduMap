//创建g管理列表
var initCenterList = function(){
    var obj = document.getElementById("r-result");
    obj.innerHTML = null;

    //获取当前localStorage数据;
    var centerData = getCenterData();
    if(centerData){
        var dataStr = centerData.split('/&/');
        for(var site = 0; site < dataStr.length - 1; site++){
            var siteStr = dataStr[site].split('/,/');
            //每条数据
            var ele = document.createElement("div");
            var radio = document.createElement("input");
            var label = document.createElement("label");
            radio.type = "radio";
            radio.name = "addr";
            radio.value = siteStr[0]+'/,/'+siteStr[1]+'/,/'+siteStr[2]+'/,/'+siteStr[3];
    
            var str = siteStr[0];
            label.innerHTML = str;
    
            ele.appendChild(radio);
            ele.appendChild(label);
            obj.append(ele);
        }
    }
}

var reName = function(){
    var data = getCheckedPoint();
    if(data){
        var dataStr = data.split('/,/');
        var preName = dataStr[0];
        var name = prompt("请输入新名称", preName);
        if(name){
            editCenterName(preName, name);
        }
    }else{
        alert("未选中任意点");
    }
}

var deleteCenterPoint = function(){
    var point = getCheckedPoint();
    if(point){
        deleteCenterData(point);
    }else{
        alert("未选中任意点");
    }
}

var setCenterPoint = function(){
    var centerPoint = getCheckedPoint();
    if(centerPoint){
        setCenterData(centerPoint);
        return true;
    }else{
        alert("未选中任意点");
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