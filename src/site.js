var initSiteList = function(){
    var obj = document.getElementById("r-result");
    obj.innerHTML = null;
    
    var siteData = getSiteData();

    var groupList = [];//组集合
    if(siteData){
        var dataStr = siteData.split('/&/');
        for(var site = 0; site < dataStr.length - 1; site++){
            //遍历数据集
            //判断元素所属组是否已经创建, 如果有则加入组, 如果无则创建组后加入组;
            // 如果不存在, 则创建组
            if(!groupList.contains(dataStr[4])){
                var groupEle = document.createElement("div");
                var groupCheckbox = document.createElement("input");
                var groupLabel = document.createElement("label");
                groupEle.id = "group"+dataStr[4];
            }

            //组已创建或已存在

            checkbox.type = "checkbox";
            checkbox.name = dataStr[4];

            var siteStr = dataStr[site].split('/,/');
            //每条数据
            var ele = document.createElement("div");
            var checkbox = document.createElement("input");
            var label = document.createElement("label");
            checkbox.type = "checkbox";
            checkbox.name = "addr";
            checkbox.value = siteStr[0]+'/,/'+siteStr[1]+'/,/'+siteStr[2]+'/,/'+siteStr[3];
            
            if(siteStr[3] == "true"){
                checkbox.checked = true;
            }else{
                checkbox.checked = false;
            }

            checkbox.setAttribute("onclick", "checkboxOnClick(this)");
    
            var str = siteStr[0];
            label.innerHTML = str;
    
            ele.appendChild(checkbox);
            ele.appendChild(label);

            // 添加到组中
            var group = document.getElementById("group"+dataStr[4]);
            group.append(ele);

        }

        //遍历groupList, 添加组到list中
    }
}

var reName = function(){
    var data = getFirstCheckedPoint();
    if(data){
        var dataStr = data.split('/,/');
        var preName = dataStr[0];
        var name = prompt("请输入新名称", preName);
        if(name){
            editSiteName(preName, name);
        }
    }else{
        alert("未选中任意点");
    }
}

var deleteSitePoint = function(){
    var check = false;
    var checkbox = document.getElementsByName("addr");
    for(var i in checkbox){
        if(checkbox[i].checked == true){
            deleteSiteData(checkbox[i].value);
            check = true;
        }
    }

    if(check){
        alert("删除成功");
    }else{
        alert("未选中任意点");
    }
}


//返回true的第一个结果
var getFirstCheckedPoint = function(){
    var str;
    var checkbox = document.getElementsByName("addr");
    for(var i = checkbox.length - 1; i >= 0; i--){
        if(checkbox[i].checked == true){
            str = checkbox[i].value;
        }
    }
    if(!str){
        return;
    }
    return str;
}

var updateSite = function(data){
    if(data){
        updateSiteData(data);
    }
}

var unchoosedSite = function(){
    hideSiteData();
}