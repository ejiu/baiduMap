var initSiteList = function(){
    var obj = document.getElementById("r-result");
    obj.innerHTML = null;
    
    var siteData = getSiteData();

    var groupList = [];//组集合
    if(siteData){
        var dataStr = siteData.split('/&/');
        for(var site = 0; site < dataStr.length - 1; site++){
            var siteStr = dataStr[site].split('/,/');
            //遍历数据集
            //判断元素所属组是否已经创建, 如果有则加入组, 如果无则创建组后加入组;
            // 如果不存在, 则创建组
            if(-1 == groupList.indexOf(siteStr[4])){
                var groupEle = document.createElement("div");
                var groupCheckbox = document.createElement("input");
                var groupLabel = document.createElement("label");
                groupEle.id = "group"+siteStr[4];
                groupCheckbox.type = "checkbox";
                groupCheckbox.name = "groupCheckbox";
                groupCheckbox.setAttribute("onclick", "groupCheckboxOnClick(this)");
                groupLabel.innerHTML = siteStr[4];

                //根据siteGroup数据控制checkbox的显示
                var groupData = getSiteGroupData();
                var groupDataStr = groupData.split('/&/');
                for(var i = 0; i < groupDataStr.length - 1; i++){
                    var groupDataStrStr = groupDataStr[i].split('/,/');
                    //当小组名称等于数据集中的组名
                    if(siteStr[4] == groupDataStrStr[0]){
                        groupCheckbox.value = groupDataStr[i];

                        console.log(siteStr[4]+"-"+groupDataStrStr[1]);
                        if(groupDataStrStr[1] == "true"){
                            groupCheckbox.checked = true;
                        }else{
                            groupCheckbox.checked = false;
                        }
                    }
                }

                groupEle.append(groupCheckbox);
                groupEle.append(groupLabel);

                //加入组
                groupList.push(siteStr[4]);

                //添加到html body中
                obj.append(groupEle);
            }

            //组已创建或已存在

            //每条数据
            var ele = document.createElement("div");
            var checkbox = document.createElement("input");
            var label = document.createElement("label");

            checkbox.type = "checkbox";
            checkbox.name = "addr";
            checkbox.value = siteStr[0]+'/,/'+siteStr[1]+'/,/'+siteStr[2]+'/,/'+siteStr[3]+'/,/'+siteStr[4];
            //TODO 根据组checked状态判断小组成员的状态
            if(siteStr[3] == "true"){
                checkbox.checked = true;
            }else{
                checkbox.checked = false;
            }
            checkbox.setAttribute("onclick", "checkboxOnClick(this)");
    
            label.innerHTML = siteStr[0];
    
            ele.appendChild(checkbox);
            ele.appendChild(label);

            //找到父组, 并加入组
            var group = document.getElementById("group"+siteStr[4]);
            group.append(ele);
        }
    }
}

var reName = function(){
    var data = getFirstCheckedPoint();
    if(data){
        var dataStr = data.split('/,/');
        var preName = dataStr[0];
        var name = prompt("请输入新名称", preName);
        if(name){
            editSiteName(preName, name.trim());
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
    hideSiteGroupData();
}

//更新小组节点
var updateGroupChild = function(childList, parentValue){
    var parentDataStr = parentValue.split('/,/');
    //从2开始, 0, 1为小组自带label和input;
    for(var i = 2; i < childList.length; i++){
        //1. 设置子节点的值;
        var data = childList[i].childNodes[0].value;
        setSiteDataVisible(data, parentDataStr[1]);
        
        //2. 即时控制子节点中的checkbox的状态
        if(parentDataStr[1] == "true"){
            childList[i].childNodes[0].checked = true;
        }else{
            childList[i].childNodes[0].checked = false;
        }
        
        //3. 设置子节点中checkbox.value;
        var dataStr = data.split('/,/');
        childList[i].childNodes[0].value = dataStr[0]+'/,/'+dataStr[1]+'/,/'+dataStr[2]+'/,/'+childList[i].childNodes[0].checked+'/,/'+dataStr[4];
    }
}

//更新组值
var updateGroupSelf = function(data){
    if(data){
        updateGroupSelfData(data);
    }
}

//根据小组成员点击事件 更新组状态
var updateGroupByChild = function(parentNode){
    //1. 组为勾选状态, 判断成员是否全勾选, 否则则取消勾选;
    //2. 组为未勾选状态, 判断是否全勾选, 全勾选则勾选组;

    var childList = parentNode.childNodes;
    if(childList[0].checked){
        //当组是勾选状态;
        for(var i = 2; i < childList.length; i++){
            if(!childList[i].childNodes[0].checked){
                //存在成员未勾选, 故取消组的勾选;
                childList[0].checked = false;

                var dataStr =childList[0].value.split('/,/');
                updateGroupSelfData(dataStr[0]+'/,/'+childList[0].checked);
                return ;
            }
        }
    }else{
        //当组是未勾选状态;
        var toggle = true;
        for(var i = 2; i < childList.length; i++){
            if(!childList[i].childNodes[0].checked){
                //若存在成员未勾选, 则toggle设为false
                toggle = false;
            }
        }
        //若所有成员都勾选, 则勾选组
        if(toggle){
            //勾选组
            childList[0].checked = true;
            
            var dataStr =childList[0].value.split('/,/');
            updateGroupSelfData(dataStr[0]+'/,/'+childList[0].checked);
            return;
        }
    }
}