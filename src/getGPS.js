var getDefaultGPS = function(){
    var beginPoint = null;
    var endSite = [];

    //从LS中获得原点数据
    var beginPoint = getBeginPoint();

    //从LS中获得终点数据
    var endData = getSiteData();
    if(endData){
        var dataStr = endData.split('/&/');

        for(var site = 0; site < dataStr.length - 1; site++){
            var siteStr = dataStr[site].split('/,/');
            if(siteStr[3] == "false"){
                continue;
            }
            endSite.push(siteStr);
        }
    }
    
    return [beginPoint, endSite];
}