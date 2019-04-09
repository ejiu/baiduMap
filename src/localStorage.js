var notExistInSiteData = function(name){
    var data = localStorage.getItem('Site');
    if(data){
        var dataStr = data.split('/&/');
        for(var site = 0; site < dataStr.length; site++){
            var siteStr = dataStr[site].split('/,/');
            if(siteStr[0] == name){
                return false
            }
        }
    }
    return true;
}

var notExistInCenterData = function(name){
    var data = localStorage.getItem('Center');
    if(data){
        var dataStr = data.split('/&/');
        for(var site = 0; site < dataStr.length; site++){
            var siteStr = dataStr[site].split('/,/');
            if(siteStr[0] == name){
                return false
            }
        }
    }
    return true;
}

var notExistInSiteGroupData = function(name){
    var data = localStorage.getItem('SiteGroup');
    if(data){
        var dataStr = data.split('/&/');
        for(var site = 0; site < dataStr.length; site++){
            var siteStr = dataStr[site].split('/,/');
            if(siteStr[0] == name){
                return false
            }
        }
    }
    return true;
}

var editCenterName = function(preName, newName){
    if(preName == "定位原点"){
        alert("定位原点无法改名");
        return;
    }
    if(notExistInCenterData(newName)){
        var data = localStorage.getItem('Center');
        if(data){
            //replace加入'/,/', 避免preName是其兄弟元素的子集;
            //除非兄弟元素name为'preName,'
            data = data.replace(preName+'/,/', newName+'/,/');
            localStorage.setItem('Center', data);
        }
    }else{
        alert("已存在相同名称");
    }    
}

var editSiteName = function(preName, newName){
    if(notExistInSiteData(newName)){
        var data = localStorage.getItem('Site');
        if(data){
            //replace加入'/,/', 避免preName是其兄弟元素的子集;
            //除非兄弟元素name为'preName,'
            data = data.replace(preName+'/,/', newName+'/,/');
            localStorage.setItem('Site', data);
        }
    }else{
        alert("已存在相同名称");
    }
}

var getSiteData = function(){
    return localStorage.getItem('Site');
}

var getCenterData = function(){
    return localStorage.getItem('Center');
}

var getSiteGroupData = function(){
    var data = localStorage.getItem('SiteGroup');
    if(!data){
        localStorage.setItem('SiteGroup', "默认目录/,/false/&/");
        data = localStorage.getItem('SiteGroup');
    }
    return data;
}

var deleteCenterData = function(data){
    console.log("del:"+data);
    if(data){
        var dataStr = data.split('/,/');
        //当存在该点时,进行删除
        if(notExistInCenterData(dataStr[0])){
            console.log("Error: 正尝试对不存在的点进行删除");
        }else if(dataStr[0] == "定位原点"){
            alert("定位原点无法删除");
            return ;
        }
        else{
            var preData = localStorage.getItem('Center');
            if(preData){
                preData = preData.replace(data+'/&/', "");
                localStorage.setItem('Center', preData);
                alert("删除成功");
            }
        }
    }
}

var deleteSiteData = function(data){
    console.log("del:"+data);
    if(data){
        var dataStr = data.split('/,/');
        //仅当存在该点时,进行删除
        if(notExistInSiteData(dataStr[0])){
            console.log("Error: 正尝试对不存在的点进行删除");
        }else{
            var preData = localStorage.getItem('Site');
            if(preData){
                preData = preData.replace(data+'/&/', "");
                localStorage.setItem('Site', preData);
            }
        }
    }
}

var createDefaultBeginPoint = function(){
    var str = "定位原点/,/121.378506/,/31.191282/,/true/&/";
    localStorage.setItem('Center', str);
    return new BMap.Point(121.378506,31.191282);
}

var updateDefaultBeingPoint = function(point){
    var centerData = getCenterData();
    if(!centerData){
        createDefaultBeginPoint();
        centerData = getCenterData();
    }
    centerData = centerData.replace('true', 'false');

    if(point){
        var centerDataStr = centerData.split('/&/');
        for(var i in centerDataStr){
            var tmpStr = centerDataStr[i].split('/,/');
            if(tmpStr[0] == "定位原点"){
                var preStr = tmpStr[0]+'/,/'+tmpStr[1]+'/,/'+tmpStr[2]+'/,/'+tmpStr[3];
                var newStr = "定位原点"+'/,/'+point.lng+'/,/'+point.lat+'/,/'+"true";
                centerData = centerData.replace(preStr, newStr);
                localStorage.setItem('Center', centerData);
            }
        }
    }
}

var addSiteData = function(data){
    var preData = localStorage.getItem('Site');
    if(!preData){
        preData = "";
        console.log("initSiteData");
    }
    
    var preDataStr = preData.split('/&/');
    var count = preDataStr.length;
    console.log(count);
    if(count > 100){
        alert("数量已达上限, 请删除");
        return false;
    }
    
    var dataStr = data.split('/,/');
    if(notExistInSiteData(dataStr[0])){
        //未存在相同地点;
        localStorage.setItem('Site', preData + data + '/&/');
        return true;
    }
    else{
        //存在相同地点;
        alert("已存在相同名称");
        return false;
    }
}

var addCenterData = function(data){
    var preData = localStorage.getItem('Center');
    if(!preData){
        preData = "";
        console.log("initCenterData");
    }
    preData = preData.replace('true', 'false');

    var preDataStr = preData.split('/&/');
    var count = preDataStr.length;
    console.log(count);
    if(count > 100){
        alert("数量已达上限, 请删除");
        return false;
    }
    
    var dataStr = data.split('/,/');
    if(notExistInCenterData(dataStr[0])){
        //未存在相同地点;
        localStorage.setItem('Center', preData + data + '/&/');
        return true;
    }
    else{
        //存在相同地点;
        alert("已存在相同名称");
        return false;
    }
}

var addSiteGroupData = function(data){
    var preData = localStorage.getItem('SiteGroup');
    if(!preData){
        preData = "";
    }
    var dataStr = data.split('/,/');

    if(notExistInSiteGroupData(dataStr[0])){
        //未存在相同小组名称
        localStorage.setItem('SiteGroup', preData + data + '/&/');
        return true;
    }else{
        alert("已存在相同名称");
        return false;
    }
}

//返回Center结果中,第一个为true的数据
var getBeginPoint = function(){
    var data = getCenterData();
    if(data){
        var dataStr = data.split('/&/');
        for(var site = 0; site < dataStr.length; site++){
            var siteStr = dataStr[site].split('/,/');
            if(siteStr[3] == 'true'){
                var beginPoint = new BMap.Point(siteStr[1], siteStr[2]);
                return beginPoint;
            }
        }
    }
}

var setCenterData = function(point){
    var name = point.split('/,/')[0];

    var data = getCenterData();
    if(data){
        var dataStr = data.split('/&/');
        for(var site = 0; site < dataStr.length; site++){
            var siteStr = dataStr[site].split('/,/');
            if(siteStr[0] == name){
                data = data.replace('true', 'false');
                var newPoint = siteStr[0]+'/,/'+siteStr[1]+'/,/'+siteStr[2]+'/,/true';
                var oldPoint = siteStr[0]+'/,/'+siteStr[1]+'/,/'+siteStr[2]+'/,/false';
                data = data.replace(oldPoint, newPoint);
                localStorage.setItem('Center', data);
                return ;
            }
        }
    }
}

//试用期
//首次安装时,记录时间点a;
//每次运行时判断最新时间和时间点a的差距, 大于五天即视为试用过期;
var timeLimit = function(){
    var data = localStorage.getItem('timeLimit');
    if(!data){
        var beginTime = Date.parse(new Date());
        localStorage.setItem("timeLimit", beginTime);
    }else{
        var beginTime = data;
        var thisTime = Date.parse(new Date());
        // if(Math.abs(thisTime - beginTime) > 15000){//test
        if(Math.abs(thisTime - beginTime) > 432000000){
            // alert("试用已到期,请联系服务商");
            return false;
        }
    }
    return true;
}

//判断IMEI码
//IMEI注册流程:
//1. 用户Android设备获取本机IMEI码, IMEI进行BASE64编码得到编码A;
//2. 解码软件接收编码A, 解码获得IMEI, 添加前缀"357", 后缀"820"以混淆, 重新BASE64编码得到编码B;
//3. 用户输入编码B, 解码获得IMEI信息和额外信息, 删除前后缀得到IMEI, 与本机相等则通过, 写入本地缓存;
var imeiLimit = function(){
    var imeiData = localStorage.getItem("IMEI");
    if(!imeiData){
        //未获得IMEI数据, 判断未通过
        //提示用户进行注册流程;
        return false;        
    }{
        var imei = window.AndroidObj.getIMEI();
        if(imeiData == imei){
            //TODO 继续判断是否等于设备IMEI
            //验证通过
            return true;
        }else{
            return false;
        }
    }
}

var registerWithImei = function(data){
    var coder = new Base64();
    var code = coder.decodeAlter(data);
    var imei = window.AndroidObj.getIMEI();
    //解码获取data中的code, 若等于本机设备的imei则视为注册通过;
    if(code == imei){
        localStorage.setItem('IMEI', code);
        return true;
    }else{
        return false;
    }
}

//更新终点数据
var updateSiteData = function(data){
    var dataStr = data.split('/,/');
    var siteData = getSiteData();
    if(notExistInSiteData(dataStr[0])){
        console.log("ERROR: Can't find "+dataStr[0]+" in SiteData");
    }else{
        if(dataStr[3] == "true"){
            siteData = siteData.replace(dataStr[0]+'/,/'+dataStr[1]+'/,/'+dataStr[2]+'/,/'+"false"+"/,/"+dataStr[4], dataStr[0]+'/,/'+dataStr[1]+'/,/'+dataStr[2]+'/,/'+dataStr[3]+"/,/"+dataStr[4]);
        }else{
            siteData = siteData.replace(dataStr[0]+'/,/'+dataStr[1]+'/,/'+dataStr[2]+'/,/'+"true"+"/,/"+dataStr[4], dataStr[0]+'/,/'+dataStr[1]+'/,/'+dataStr[2]+'/,/'+dataStr[3]+"/,/"+dataStr[4]);
        }
        localStorage.setItem('Site', siteData);
    }
}

var setSiteDataVisible = function(data, visible){
    var dataStr = data.split('/,/');
    var siteData = getSiteData();
    if(notExistInSiteData(dataStr[0])){
        console.log("ERROR: Can't find "+dataStr[0]+" in SiteData");
    }else{
        if(dataStr[3] != visible){
            siteData = siteData.replace(data, dataStr[0]+'/,/'+dataStr[1]+'/,/'+dataStr[2]+'/,/'+visible+"/,/"+dataStr[4]);
            localStorage.setItem('Site', siteData);
        }
    }
}

var hideSiteData = function(){
    var data = getSiteData();
    console.log(data);
    if(data){
        var reg = "/"+"true"+"/g";
        var data = data.replace(eval(reg),"false");
        // data = data.replace('true', 'false');
        console.log(data);
        localStorage.setItem('Site', data);
    }
}

//更新组的数据(visible)
var updateGroupSelfData = function(data){
    var dataStr = data.split('/,/');
    var groupData = getSiteGroupData();
    if(notExistInSiteGroupData(dataStr[0])){
        console.log("ERROR: Can't find "+dataStr[0]+" in groupData");
    }else{
        console.log(groupData);
        if(dataStr[1] == "true"){
            groupData = groupData.replace(dataStr[0]+'/,/false', dataStr[0]+'/,/true');
        }else{
            groupData = groupData.replace(dataStr[0]+'/,/true', dataStr[0]+'/,/false');
        }
        localStorage.setItem('SiteGroup', groupData);
    }
}
