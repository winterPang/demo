(function ($)
{
var MODULE_NAME = "wsmbfile.terminalinfo";
/*var NC, MODULE_NC = "wsmbfile.NC";*/
var hTimer = false;
var g_aArpTable = [],g_aAPTer = [];
var g_StartTime, g_EndTime,g_aAllApp = [];

function getRcText(sRcName)
{
    return Utils.Base.getRcString("terminal_rc", sRcName);
}
function onOpenDetailShow(oData)
{
    function datatime (argument) 
    {
        // var temp = eval(argument);
        var day  = parseInt(argument/86400);
        var temp = argument%86400;
        var hour = parseInt(temp/3600);
        temp = argument%3600;
        var mini = parseInt(temp/60);
        var sec  = argument%60;
        if (hour < 10)
        {
            var sDatatime = day+":0"+hour;
        }
        else
        {
            var sDatatime = day+":"+hour;
        }
        if (mini < 10)
        {
             sDatatime = sDatatime+":0"+mini;
        } else 
        {
             sDatatime = sDatatime+":"+mini;
        }
        if (sec < 10)
        {
            sDatatime = sDatatime+":0"+sec;
        } else 
        {
            sDatatime = sDatatime+":"+sec;
        }
        return sDatatime;
    }
    $.ajax({
        url: "../../wnm/terminalinfo.json",
        type: "GET",
        dataType: "json",
        success: function(data){
            var aStation = data.aStation || [];
            // var aData = Utils.Request.getTableRows (NC.Stations, oInfo) || [];
            // var aStation = [];
            // for(var i = 0; i < aData.length; i++)
            // {
            //     if(oData[aData[i].MacAddress])
            //     {
            //         aStation.push(aData[i]);
            //     }
            // }
            var aMode = getRcText("MODE").split(",");
            $.each(aStation, function(index, oStation){
                    if (oStation.Ipv6Address == "::")
                    {
                        oStation.IpAddress = oStation.Ipv4Address;
                    }
                    else
                    {
                        oStation.IpAddress = oStation.Ipv4Address + ", " + oStation.Ipv6Address;
                    }
                    oStation.Throughput = oStation.RxRate + "/" + oStation.TxRate;
                    switch(oStation.WirelessMode)
                    {
                        case "1":
                        case "2":
                            oStation.WirelessMode = aMode[oStation.WirelessMode];
                            break;
                        case "4":
                            oStation.WirelessMode = aMode[3];
                            break;
                        case "8":
                            oStation.WirelessMode = aMode[4];
                            break;
                        case "16":
                            oStation.WirelessMode = aMode[5];
                            break;
                        case "64":
                            oStation.WirelessMode = aMode[6];
                            break;
                        default :
                            break;
                    }
                    oStation.UpTime = datatime(oStation.UpTime);
            });
        },
        error:function(err,status){
            alert(err);
        }
    });
   /* function myCallback(oInfo)
    {
        var aStation = Utils.Request.getTableRows (NC.Stations, oInfo) || [];
        // var aData = Utils.Request.getTableRows (NC.Stations, oInfo) || [];
        // var aStation = [];
        // for(var i = 0; i < aData.length; i++)
        // {
        //     if(oData[aData[i].MacAddress])
        //     {
        //         aStation.push(aData[i]);
        //     }
        // }
        var aMode = getRcText("MODE").split(",");
        $.each(aStation, function(index, oStation){
            if (oStation.Ipv6Address == "::")
            {
                oStation.IpAddress = oStation.Ipv4Address;
            }
            else
            {
                oStation.IpAddress = oStation.Ipv4Address + ", " + oStation.Ipv6Address;
            }               
            oStation.Throughput = oStation.RxRate + "/" + oStation.TxRate;
            switch(oStation.WirelessMode)
            {
                case "1":
                case "2":
                    oStation.WirelessMode = aMode[oStation.WirelessMode];
                    break;
                case "4":
                    oStation.WirelessMode = aMode[3];
                    break;
                case "8":
                    oStation.WirelessMode = aMode[4];
                    break;
                case "16":
                    oStation.WirelessMode = aMode[5];
                    break;
                case "64":
                    oStation.WirelessMode = aMode[6];
                    break;
                default :
                    break;
            }
            oStation.UpTime = datatime(oStation.UpTime);
        });
        
        $("#detail-list").SList("refresh", aStation);

        Utils.Base.openDlg(null, {}, {scope:$("#tableDlg"),className:"modal-super"});
    }
    var oStation = Utils.Request.getTableInstance (NC.Stations);
    Utils.Request.getAll ([oStation], myCallback);*/
}
/*function onOpenTerDetail(oData)
{
    for(var i = 0; i < g_aAllApp.length; i++)
    {
        if(g_aAllApp[i].name == oData.name)
        {
            var aMac = g_aAllApp[i].aMac;
            break;
        }
    }
    var oMac = {};
    for(var i = 0; i < aMac.length; i++)
    {
        oMac[aMac[i]] = aMac[i];
    }
    onOpenDetailShow(oMac);
}*/
/*function onOpenSigDetail(oData)
{
    var aData = g_allData.snr[parseInt(oData.name/10)-1].subData;
    var oMac = {};
    for(var i = 0; i < aData.length; i++)
    {
        if(!oMac[aData[i].MACAddress])
        {
            oMac[aData[i].MACAddress] = aData[i].MACAddress;
        }
    }
    onOpenDetailShow(oMac);
}*/
/*function onOpenRateDetail(oData)
{
    var aData = g_allData.speed[parseInt(oData.name/10)-1].subData;
    var oMac = {};
    for(var i = 0; i < aData.length; i++)
    {
        if(!oMac[aData[i].MACAddress])
        {
            oMac[aData[i].MACAddress] = aData[i].MACAddress;
        }
    }
    onOpenDetailShow(oMac);
}*/
/*function onOpenAPDetail(oData)
{
    for(var i = 0; i < g_aAPTer.length; i++)
    {
        if(g_aAPTer[i].name == oData.name)
        {
            break;
        }
    }
    var oMac = {};
    for(var j = 0; j < g_aAPTer[i].aMac.length; i++)
    {
        if(!oMac(g_aAPTer[i].aMac[j]))
        {
            oMac[g_aAPTer[i].aMac[j]] = g_aAPTer[i].aMac[j];
        }
    }
    onOpenDetailShow(oMac);
}*/
function drawTerminaltype(aAllApp)
{
	var aType = getRcText("APPINFO").split(",")
	var atempData = [{name:aType[0],value:3},
                     {name:aType[1],value:5},
                     {name:aType[2],value:3},
                     {name:aType[3],value:5},
                     {name:aType[4],value:6},
                     {name:aType[5],value:4},
                     {name:aType[6],value:4},
                     {name:aType[7],value:6}];
    var option = {
        height:"80%",
        tooltip : {
            show:true,
            trigger: 'item',
            formatter: "{b}<br/> {c} ({d}%)"
        },
        calculable : false,
        myLegend:{
            scope : "#myLegend",
            width: "45%",
            right: 20,
            top: -4,
        },
        series : [
            {
                type:'pie',
                radius : ['50%', '85%'],
                center: ['25%', '55%'],
                itemStyle : {
                    normal : {
                        label : {
                            position : 'inner',
                            formatter : function (a,b,c,d) {
                                return ""
                            }
                        },
                        labelLine : {
                            show : false
                        }
                    },
                    emphasis : {
                        label : {
                            formatter : "{b}\n{d}%"
                        }
                    }
                },
                data:atempData
            //    data:aAllApp
            }
        ],
        //click: onOpenTerDetail
        click:onOpenDetailShow
    };
    var oTheme = {
        color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
    };
    $("#terminaltype").echart ("init", option,oTheme);
}

function drawSignalstrength(snr)
{
    var aData = [];
    for(var i = 0; i < snr.length; i++)
    {
        aData.push(snr[i].subData.length);
    }
    option = {
        height:180,
        title : {
            subtext: '',
            x:'center',
            y:"60"
        },
        tooltip : {
            show:false,
            trigger: 'axis'
        },
        calculable : false,
        grid :
        {
           x:40, y:30, x2:50, y2:10,
            borderColor : '#fff'
        },
        xAxis : [
            {
                name:"dB",
                boundaryGap: true,
                splitLine:false,
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#9da9b8', width: 1}
                },
                axisTick:{show:false},
                axisLabel:{
                    show:true,
                    textStyle:{color: '#9da9b8', fontSize:"12px", width:2},
                    formatter:function (value){
                        return value;
                    },
                    interval:0
                },

                // axisTick:"item",
                 type : 'category',
                data : ['10','20','30','40','50','60','70','80','90','100']
            }
        ],
        yAxis : [
            {
                name:getRcText("SIGNALSTR"),
                splitLine:false,
                axisLabel: {
                    show:true,
                    textStyle:{color: '#9da9b8', fontSize:"12px", width:2}
                },
                axisLine : {
                    show:true,
                    lineStyle :{color: '#9da9b8', width: 1}
                },
                type : 'value'
            }
        ],
        series : [
            {
                name:"yistLine",
                type:'bar',
                barCategoryGap: '40%',
                data:aData,
                itemStyle : {
                    normal: {
                        label : {
                            show: true, 
                            position: 'top',
                            formatter: function(oData){
                                return oData.value;

                            }
                        },
                        color:function(oData){
                            var aColor = ['#D84B61','#E893A0','#EFB7C0','#F99D41','#F5B638','#C3E7E8','#A5DCDC','#86D0D1','#69C4C5','#45B5BB'];

                            return aColor[oData.dataIndex];
                        }
                    }
                }            
            }
        ],
        click:onOpenDetailShow
    };
    var oTheme = {
            color : ['#229A61','#3DD38C','#79E1CD','#FFDC6D','#F9AB6B','#EF6363','#F09ABF','#BEC7D0']
        };
                
    $("#signalstrength").echart("init", option, oTheme);

}

function drawRate(speed)
{
    var aData = [];
    for(var i = 0; i < speed.length; i++)
    {
        aData.push(speed[i].subData.length);
    }
    option = {
        height:180,
        title : {
            subtext: '',
            x:'center',
            y:"60"
        },
        tooltip : {
            show: false,
            trigger: 'axis',
            formatter:function(y,x){
                       var sTips = y[0][1] + "<br/>" + y[0][0] + ":" + y[0][2] + "<br/>" +
                                   y[1][0] + ":" + (-y[1][2])
                        return y;
                    },
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#fff',
                  width: 0,
                  type: 'solid'
                }
            }
        },
        calculable : false,
        grid :
        {
           x:40, y:20, x2:50, y2:10,
            borderColor : '#fff'
        },
        xAxis : [
            {
                name:"bps",
                boundaryGap: true,
                splitLine:false,
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#617085', width: 1}
                },
                axisTick:{show:false},
                axisLabel: {
                    show:true,
                    textStyle:{color: '#617085', fontSize:"12px", width:2}
                },

                // axisTick:"item",
                 type : 'category',
                data : ['6','12','24','36','54','108','450']
            }
        ],
        yAxis : [
            {
                name:getRcText("RATE"),
                splitLine:false,
                axisLabel: {
                    show:true,
                    textStyle:{color: '#617085', fontSize:"12px", width:2}
                },
                axisLine : {
                    show:true,
                    lineStyle :{color: '#617085', width: 1}
                },
                type : 'value'
            }
        ],
        series : [
            {
                name:"yistLine",
                type:'bar',
                barCategoryGap: '40%',
                data:aData,
                itemStyle : {
                    normal: {
                        label : {
                            show: true, 
                            position: 'top',
                            formatter: function(oData){
                                return oData.value;

                            }
                        },
                        color:function(oData){
                            var aColor = ['#D84B61','#E893A0','#EFB7C0','#F99D41','#F5B638','#C3E7E8','#A5DCDC','#86D0D1','#69C4C5','#45B5BB'];

                            return aColor[oData.dataIndex];
                        }
                    }
                }            
            }
        ],
        click: onOpenDetailShow
    };
    var oTheme = {
            color : ['#229A61','#3DD38C','#79E1CD','#FFDC6D','#F9AB6B','#EF6363','#F09ABF','#BEC7D0']
        };        
    $("#rate").echart("init", option );
}
function initApterminal()
{

}
function drawApterminal(aName, aValue)
{
    if(aName.length == 0)
    {
        initApterminal();
        return;
    }
    /******for text**********/
    var aName = ["ap1","ap2", "ap3", "ap4", "ap5", "ap6", "ap7", "ap8"];
    var aValue = ['1','2','3','4','5','6','7','3'];
    var nWidth = $("#apterminal").parent().width()*0.95;
    var nlength = 600/aName.length > 100 ? 100 : 600/aName.length;
    var option = {
        height:"200px",
        grid: {
            x:3, y:20, x2:100, y2:0,
            borderColor: '#FFFFFF'
        },
        
        tooltip : {
            show: false,
            trigger: 'axis',
            formatter:function(y,x){
                        var sTips = y[0][1] + "<br/>" + y[0][0] + ":" + y[0][2] + "<br/>" +
                                    y[1][0] + ":" + (-y[1][2])
                        return sTips;
                    },
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#fff',
                  width: 0,
                  type: 'solid'
                }
            }
        },
        calculable : false,
        dataZoom : {
            show : true,
            realtime : true,
            start : 0,
            end : nlength,
            zoomLock: true,
            orient: "vertical",
            width: 5,
            x: nWidth,
            backgroundColor:'#F7F9F8',
            fillerColor:'#bec6cf',
            handleColor:'#bec6cf',
            border:'none'
        },
        xAxis : [
            {
            //    name : "Flow",
                type : 'value',
                splitLine : {
                    show:false
                },
                splitArea : {
                    areaStyle : {
                        color: '#174686'
                    }
                },
                axisLine  : {
                    show:false,
                    lineStyle :{color: '#373737', width: 1}
                },
                axisLabel : {
                    formatter:function(nNum){
                        return nNum < 0 ? -nNum : nNum;
                    }
                }
            }
        ],
        yAxis : [
            {
            //    name: "APP",
                type : 'category',
                axisLine  : {
                    show:false,
                    lineStyle :{color: '#373737', width: 1}
                },
                axisTick : {show: false},
                data : aName,
                splitLine : {
                    show : false
                }
            }
        ],
        series : [
                {
                    name:'Number',
                    type:'bar',
                    data:aValue,
                    itemStyle : { 
                        normal: {
                            label : {
                                show: true, 
                                position: 'right',
                                formatter: function(oData){
                                    return oData.value;
                                },
                                textStyle: {
                                    color:"#a7b7c1"
                                }
                            }
                        },
                        emphasis:{
                        }
                    }
                },
                {
                    barCategoryGap:'60%',
                    type:'bar',
                    data:aName,
                    stack: 'kk',
                    itemStyle : { 
                           normal: {
                             label : {
                               show: true, 
                               position: 'insideLeft',
                               formatter: function(oData){
                                    return oData.name;
                                },
                               textStyle: {color:"#47495d"}
                             },
                             color: 'rgba(0,0,0,0)'
                           },
                           emphasis: {
                             label : {
                               show: true,
                               formatter: function(oData){
                                    return oData.name;
                                },
                               textStyle: {color:"#47495d"}
                             }
                             , color: 'rgba(0,0,0,0)'
                           }
                        }
                }
        ],
        click: onOpenDetailShow
    };
    var oTheme = {
        color: ['#69C4C5','#F6F7F8']
    };
    $("#apterminal").echart ("init", option, oTheme);
}

function  drawLabel(jLabel,opt)
{
    jLabel.empty();
    var _height= jLabel.height();
    var _width = jLabel.width();
    var aData =opt.data;
    var _labelHeight= 0,_lableWidth=0;
    function createLabel(sLable)
    {
       var _jLabel = $("<div></div>");
        if(sLable=="-"){
            _jLabel.width(_lableWidth/2);
            _jLabel.html("");
            var _style="float:left;"+"width:"+(_lableWidth/2)+"px;height:"+_labelHeight+"px;text-align:center";
            _jLabel.attr("style",_style);
        }else{
            _jLabel.width(_lableWidth);
            _jLabel.html(sLable);
            var _style="float:left;"+"width:"+_lableWidth+"px;height:"+_labelHeight+"px;text-align:center";
            _jLabel.attr("style",_style);
        }
        _jLabel.height(_labelHeight);
        return _jLabel;
    }
    if(opt&&aData)
    {
        if($.type(aData)=="array")
        {
            _labelHeight=_height;
            _lableWidth =_width/(aData.length+1);
            jLabel.append(createLabel("-"));
            $.each(aData,function(_nIndex,sLable){
                jLabel.append(createLabel(sLable));
            });
            jLabel.append(createLabel("-"));
        }
    }
}
function initLable()
{
    drawLabel($("#signalstrengthLabel"),{
        data : ['10','15','20','25','30','35','40','45','50','55','60']
    });
    drawLabel($("#rateLabel"),{
        data : ['0','6','12','24','36','54','108','450']
    });
} 
function getwdNum(aArpTable, aInterfaces, aManualAP)
{
    var oAll = {};
    var aAll = [];
    
    for(var i = 0; i < aInterfaces.length; i++)
    {    
        if(aInterfaces[i].Name.search("GigabitEthernet") != -1)
        {
            oAll[aInterfaces[i].IfIndex] = aInterfaces[i].IfIndex;
        }
    }
    for(var i = 0; i < aArpTable.length; i++)
    {
        if(oAll[aArpTable[i].IfIndex])
        {
            aAll.push(aArpTable[i]);
        }
    }
    var oAllMac = {};
    for(var i = 0; i < aManualAP.length; i++)
    {
        if(!oAllMac[aManualAP[i].CfgMacAddress])
            oAllMac[aManualAP[i].CfgMacAddress] = aManualAP[i].CfgMacAddress;
    }
    for(var i = 0; i < aAll.length; i++)
    {
        if(oAllMac[aAll[i].MAC])
        {
            aAll.splice(i,1);
        }
    }
    return aAll;
} 
function updateInfor(aData)
{
    //for test/////////////////////////////////////////////////////////
    aData = [];
    var ss = ["1","2","4","8","16","64"];
    for(var i=0;i<1024;i++)
    {
        var oo = {
            WirelessMode: ss[parseInt(Math.random()*6)],
            RxRate:parseInt(Math.random()*450),
            TxRate:parseInt(Math.random()*450),
            MACAddress:"11-22-33-44-55-66",
            SNR : parseInt(Math.random()*60)
        };
        aData.push(oo);
    }
    //////////////////////////////////////////////////////////////////

    var oInfor = {
        Total : aData.length, wsm1 : 0, wsm2 : 0, wsm4 : 0, wsm8 : 0, wsm16 : 0, wsm64 : 0
    };

    aData.sort(function(a,b){
        return b.RxRate-a.RxRate;
    });
    
    var oAll = {
        speed : [
            {name:"S6",subData:[]},
            {name:"S12",subData:[]},
            {name:"S24",subData:[]},
            {name:"S36",subData:[]},
            {name:"S54",subData:[]},
            {name:"S108",subData:[]},
            {name:"S450",subData:[]}
        ],
        snr : [
            {name:"S0",subData:[]},
            {name:"S1",subData:[]},
            {name:"S2",subData:[]},
            {name:"S3",subData:[]},
            {name:"S4",subData:[]},
            {name:"S5",subData:[]},
            {name:"S6",subData:[]},
            {name:"S7",subData:[]},
            {name:"S8",subData:[]},
            {name:"S9",subData:[]}
        ]
    };
    for(var i=0;i<oInfor.Total;i++)
    {
        var oTemp = aData[i];

        oInfor["wsm" + oTemp.WirelessMode]++;

        var nSpeed = parseInt(oTemp.RxRate);
        if(nSpeed <= 6){
            oAll.speed[0].subData.push(oTemp);
        }else if(nSpeed > 6 && nSpeed <= 12){
            oAll.speed[1].subData.push(oTemp);
        }else if(nSpeed > 12 && nSpeed <= 24){
            oAll.speed[2].subData.push(oTemp);
        }else if(nSpeed > 24 && nSpeed <= 36){
            oAll.speed[3].subData.push(oTemp);
        }else if(nSpeed > 36 && nSpeed <= 54){
            oAll.speed[4].subData.push(oTemp);
        }else if(nSpeed > 54 && nSpeed <= 108){
            oAll.speed[5].subData.push(oTemp);
        }else if(nSpeed > 108){
            oAll.speed[6].subData.push(oTemp);
        }

        var nSnr = parseInt(oTemp.SNR/5 -2);
        nSnr = nSnr < 0 ? 0 : (nSnr > 9 ? 9 : nSnr);
        oAll.snr[nSnr].subData.push(oTemp);
    }

    return oAll;
}  

/*function getFlowInfo(Table, start, end, Other, value)
{
    var UP = [];
    var Down = [];
    //$.ajaxSettings.async=false;
    function DownData(oInfo)
    {
        Down = Utils.Request.getTableRows (NC[Table], oInfo);
    }
    function UpData(oInfo)
    {
        UP = Utils.Request.getTableRows (NC[Table], oInfo);

        var oUserAppDown = Utils.Request.getTableInstance (NC[Table]);
        if(Other == 0)
        {
            oUserAppDown.addFilter ({StartTime:start, EndTime:end, PktDir:1, AddressType:0});
        }
        else if(Other == 1)
        {
            oUserAppDown.addFilter ({StartTime:start, EndTime:end, PktDir:1, AddressType:0,AppName:value});
        }
        else
        {
            oUserAppDown.addFilter ({StartTime:start, EndTime:end, PktDir:1, AddressType:0,UserId:value});
        }
        
        Utils.Request.getAll (oUserAppDown, DownData);
    }

    var oUserAppUp = Utils.Request.getTableInstance (NC[Table]);
    if(Other == 0)
    {
        oUserAppUp.addFilter ({StartTime:start, EndTime:end, PktDir:0, AddressType:0});
    }
    else if(Other == 1)
    {
        oUserAppUp.addFilter ({StartTime:start, EndTime:end, PktDir:0, AddressType:0,AppName:value});
    }
    else
    {
        oUserAppUp.addFilter ({StartTime:start, EndTime:end, PktDir:0, AddressType:0,UserId:value});
    }
    Utils.Request.getAll ([oUserAppUp], UpData);
    return {UpData:UP,DownData:Down};
}*/
function initData()
{
    var nTime = new Date();
    var end = nTime.toISOString().split(".")[0];
        g_EndTime = nTime.getTime();
        g_StartTime = nTime - 43200000;//12H,1H = 3600000
    var start = new Date(g_StartTime).toISOString().split(".")[0];
    $.ajax({
        url: "../../wnm/terminalinfo.json",
        type: "GET",
        dataType: "json",
        success: function(data){
            var aArpTable = data.aArpTable;
            g_aArpTable = aArpTable;
            var aInterfaces = data.aInterfaces;
            var aManualAP = data.aManualAP;
            var aWDData = getwdNum(aArpTable, aInterfaces, aManualAP);

            var aStations = data.aStations;
            var oInfor = {
                SUM : aStations.length + aWDData.length,
                wireless : aStations.length,
                wired : aWDData.length,
                wsm1 : 0,  //802.11b
                wsm2 : 0,  //802.11a
                wsm4 : 0,  //802.11g
                wsm8 : 0,  //802.11gn
                wsm16 : 0, //802.11an
                wsm64 : 0  //802.11ac
            };

            for(var i=0;i<oInfor.wireless;i++)
            {
                var oTemp = aStations[i];
                oInfor["wsm" + oTemp.WirelessMode]++;
            }
            Utils.Base.updateHtml($("#terminal-num"),oInfor);
            /*******AP guan lian zhong duan******************/
            var oAPTer = {};
            for(var i = 0; i < aManualAP.length; i++)
            {
                var oTemp = {
                    name: aManualAP[i].Name,
                    aMac:[],
                    value: 0
                }
                oAPTer[aManualAP[i].Name] = oTemp;
            }
            for(var i = 0; i < aStations.length; i++)
            {
                if(oAPTer[aStations[i].ApName])
                {
                    oAPTer[aStations[i].ApName].value++;
                    oAPTer[aStations[i].ApName].aMac.push(aStations[i].MacAddress);
                }
            }

            var aName = [];
            var aValue = [];
            for(key in oAPTer)
            {
                aName.push(oAPTer[key].Name);
                aValue.push(oAPTer[key].value);
                g_aAPTer.push(oAPTer[key]);
            }
            drawApterminal(aName, aValue);
            /*********************************/
            g_allData = updateInfor(aStations);
            drawSignalstrength(g_allData.snr);
            drawRate(g_allData.speed);
            /*******ying yong***********/
            var aUserMac = data.aUserMac;
            var oAllData = data.oAllData;
            /*getFlowInfo("UserApps", g_StartTime, g_EndTime, 0);*/
            var aUserApp = oAllData.DownData.concat(oAllData.UpData);
            var oAllApp = {};
            var oUsr = {};
            for(var i = 0; i < aUserMac.length; i++)
            {
                oUsr[UserId] = aUserMac[i];
            }
            for(var i = 0; i < aUserApp.length; i++)
            {

                if(!oAllApp[aUserApp[i].AppName])
                {
                    var aMac = [];
                    aMac.push(oUsr[aUserApp[i].UserId].UserMac);
                    var oTemp = {
                        name: aUserApp[i].AppName,
                        mac:aMac,
                        value: 0
                    }
                    oAllApp[aUserApp[i].AppName] = oTemp;
                }
                else
                {
                    oAllApp[aUserApp[i].AppName].value++;
                    oAllApp[aUserApp[i].AppName].aMac.push(oUsr[aUserApp[i].UserId].UserMac);
                }
            }
            var aAllApp = [];
            for(key in oAllApp)
            {
                aAllApp.push(oAllApp[key]);
            }
            g_aAllApp = aAllApp.sort(function(a,b){
                return b.value-a.value;
            }).slice(0,8);
            drawTerminaltype(g_aAllApp);

            var aTemplate = data.aTemplate;
            $("#wirelessterminal_slist").SList ("refresh", aTemplate);
            var aClientProbes = data.aClientProbes;
            /* for text*/
            for(var i = 0; i < 3; i++)
            {
                var oTemp = {
                    MacAddress:"11-22-33-44-55-" + i,
                    ReportSensorNum:i + "",
                    FirstReportTime:"11:10:20",
                    Channel:112 + i*4,
                    Rssi:i*20 + ""
                };
                aClientProbes.push(oTemp);
            }
            /*end*/
            $("#nwt_slist").SList ("refresh", aClientProbes);
            // var aTableData = getWiredTer(aArpTable, aInterfaces);
            var aTableData =[];
            /* for text */
            for(var i = 0; i < 3; i ++)
            {
                var oTemp = {
                    MacAddress:"11-22-33-44-55-" + i,
                    Ipv4Address:"192.168.0." + i,
                    AbbreviatedName:"" + i*2,
                    Time:"11:10:20"
                };
                aTableData.push(oTemp);
            }
            /* end */
            $("#wiredterminal_slist").SList ("refresh", aTableData);
        },
        error:function(err,status){

        }
    });
   /* function myCallback (oInfo)
    {
        var aArpTable = Utils.Request.getTableRows (NC.ArpTable, oInfo);
        g_aArpTable = aArpTable;
        var aInterfaces = Utils.Request.getTableRows (NC.Interfaces, oInfo);
        var aManualAP = Utils.Request.getTableRows (NC.ManualAP, oInfo);
        var aWDData = getwdNum(aArpTable, aInterfaces, aManualAP);

        var aStations = Utils.Request.getTableRows (NC.Stations, oInfo);
        var oInfor = {
            SUM : aStations.length + aWDData.length,
            wireless : aStations.length, 
            wired : aWDData.length,
            wsm1 : 0,  //802.11b
            wsm2 : 0,  //802.11a
            wsm4 : 0,  //802.11g
            wsm8 : 0,  //802.11gn
            wsm16 : 0, //802.11an
            wsm64 : 0  //802.11ac
        };
        
        for(var i=0;i<oInfor.wireless;i++)
        {
            var oTemp = aStations[i];
            oInfor["wsm" + oTemp.WirelessMode]++;
        }
        Utils.Base.updateHtml($("#terminal-num"),oInfor);
        /!*******AP guan lian zhong duan******************!/
        var oAPTer = {};
        for(var i = 0; i < aManualAP.length; i++)
        {
            var oTemp = {
                name: aManualAP[i].Name,
                aMac:[],
                value: 0
            }
            oAPTer[aManualAP[i].Name] = oTemp;
        }
        for(var i = 0; i < aStations.length; i++)
        {
            if(oAPTer[aStations[i].ApName])
            {
                oAPTer[aStations[i].ApName].value++;
                oAPTer[aStations[i].ApName].aMac.push(aStations[i].MacAddress);
            }
        }

        var aName = [];
        var aValue = [];
        for(key in oAPTer)
        {
            aName.push(oAPTer[key].Name);
            aValue.push(oAPTer[key].value);
            g_aAPTer.push(oAPTer[key]);
        }
        drawApterminal(aName, aValue);
        /!*********************************!/
        g_allData = updateInfor(aStations);
        drawSignalstrength(g_allData.snr);
        drawRate(g_allData.speed);
        /!*******ying yong***********!/
        var aUserMac = Utils.Request.getTableRows (NC.Users, oInfo);
        var oAllData = getFlowInfo("UserApps", g_StartTime, g_EndTime, 0);
        var aUserApp = oAllData.DownData.concat(oAllData.UpData);
        var oAllApp = {};
        var oUsr = {};
        for(var i = 0; i < aUserMac.length; i++)
        {
            oUsr[UserId] = aUserMac[i];
        }
        for(var i = 0; i < aUserApp.length; i++)
        {

            if(!oAllApp[aUserApp[i].AppName])
            {
                var aMac = [];
                aMac.push(oUsr[aUserApp[i].UserId].UserMac);
                var oTemp = {
                    name: aUserApp[i].AppName,
                    mac:aMac,
                    value: 0
                }
                oAllApp[aUserApp[i].AppName] = oTemp;
            }
            else
            {
                oAllApp[aUserApp[i].AppName].value++;
                oAllApp[aUserApp[i].AppName].aMac.push(oUsr[aUserApp[i].UserId].UserMac);
            }
        }
        var aAllApp = [];
        for(key in oAllApp)
        {
            aAllApp.push(oAllApp[key]);
        }
        g_aAllApp = aAllApp.sort(function(a,b){
            return b.value-a.value;
        }).slice(0,8);
        drawTerminaltype(g_aAllApp);

        var aTemplate = Utils.Request.getTableRows (NC.Stations, oInfo);
        $("#wirelessterminal_slist").SList ("refresh", aTemplate);
        var aClientProbes = Utils.Request.getTableRows (NC.ClientProbes, oInfo);
        /!* for text*!/
        for(var i = 0; i < 3; i++)
        {
            var oTemp = {
                MacAddress:"11-22-33-44-55-" + i,
                ReportSensorNum:i + "",
                FirstReportTime:"11:10:20",
                Channel:112 + i*4,
                Rssi:i*20 + ""
            };
            aClientProbes.push(oTemp);
        }
        /!*end*!/
        $("#nwt_slist").SList ("refresh", aClientProbes);
       // var aTableData = getWiredTer(aArpTable, aInterfaces);
        var aTableData =[];
        /!* for text *!/
        for(var i = 0; i < 3; i ++)
        {
            var oTemp = {
                MacAddress:"11-22-33-44-55-" + i,
                Ipv4Address:"192.168.0." + i,
                AbbreviatedName:"" + i*2,
                Time:"11:10:20"
            };
            aTableData.push(oTemp);
        }
        /!* end *!/
        $("#wiredterminal_slist").SList ("refresh", aTableData);
    }
    var aRequest = [];
    var oStation = Utils.Request.getTableInstance (NC.Stations);
    var oArpTable = Utils.Request.getTableInstance (NC.ArpTable);
    var oInterfaces = Utils.Request.getTableInstance (NC.Interfaces);
    var oManualAP = Utils.Request.getTableInstance (NC.ManualAP);
    aRequest.push(oStation,oArpTable,oInterfaces,oManualAP);
   
    var oUsrMac = Utils.Request.getTableInstance(NC.Users);
    //aRequest.push(oUsrMac); 
    /!*****table 2*********!/
    var oClientProbes = Utils.Request.getTableInstance (NC.ClientProbes);
    // aRequest.push(oClientProbes);
    /!*****table 3**************!/
    Utils.Request.getAll (aRequest, myCallback);*/
}


/*function onDelWirelessTer(aRowData)
{
    var oStations = Utils.Request.getTableInstance (NC.Stations);
    for(var i = 0; i < aRowData.length; i++)
    {
        oStations.addRows({MacAddress: aRowData[i].MacAddress});
    }
    Utils.Request.set ("remove", [oStations], {onSuccess:initData, scope:$("#wirelessterminal_slist")}); 
}*/
/*function onDelNwt(aRowData)
{
    var oClientProbes = Utils.Request.getTableInstance (NC.ClientProbes);
    for(var i = 0; i < aRowData.length; i++)
    {
        oClientProbes.addRows({MacAddress: aRowData[i].MacAddress});
    }
    Utils.Request.set ("remove", [oClientProbes], {onSuccess:initData, scope:$("#nwt_slist")}); 
}*/
/*function onDelwiredter(aRowData)
{
    var oArpTable = Utils.Request.getTableInstance (NC.ArpTable);
    var oAll = {};
    for(var i = 0; i < g_aArpTable.length; i++)
    {
        if(!oAll[g_aArpTable[i].MacAddress])
        {
            oAll[g_aArpTable[i].MacAddress] = g_aArpTable[i];
        }
    }
    for(var i = 0; i < aRowData.length; i++)
    {
        var mac = aRowData[i].MacAddress;
        oArpTable.addRows({IfIndex: oAll[mac].IfIndex,Ipv4Address:oAll[mac].Ipv4Address});
    }
    Utils.Request.set ("remove", [oArpTable], {onSuccess:initData, scope:$("#wiredterminal_slist")}); 
}*/
function initGrid()
{
	var opt = {
            showHeader: true,
            multiSelect: true,
            colNames: getRcText ("WIRELESSTERMINAL"),
            colModel: [
                {name: "MacAddress", datatype: "String",width:120},
                {name: "Ipv4Address", datatype: "String",width:100},
                {name: "UserName", datatype: "String",width:100},
                {name: "Ssid", datatype: "String",width:100},
                {name: "ApName", datatype: "String",width:100},
                {name: "DeviceType", datatype: "String",width:100},
                {name: "WirelessMode", datatype: "String",width:100}
            ], buttons: [
            //    {name: "add", enable:false},
            //    {name: "open", action: onOpenAdd},
                {name: "delete"/*, action: Utils.Msg.deleteConfirm(onDelWirelessTer)*/}
            ]
        };
        $("#wirelessterminal_slist").SList ("head", opt);

        var opt = {
            showHeader: true,
            multiSelect: true,
            colNames: getRcText ("NWT"),
            colModel: [
                {name: "MacAddress", datatype: "String",width:100},
                {name: "ReportSensorNum", datatype: "String",width:60},
                {name: "FirstReportTime", datatype: "String",width:60},
                {name: "Channel", datatype: "String",width:60},
                {name: "Rssi", datatype: "String",width:50},
                {name: "BSSID", datatype: "String",width:80}
            ], buttons: [
            //    {name: "add", enable:false},
                {name: "delete"/*, action: Utils.Msg.deleteConfirm(onDelNwt)*/}
            ]
        };
        $("#nwt_slist").SList ("head", opt);

        var opt = {
            showHeader: true,
            multiSelect: true,
            colNames: getRcText ("WIREDTERMINAL"),
            colModel: [
                {name: "MacAddress", datatype: "String",width:100},
                {name: "Ipv4Address", datatype: "String",width:60},
                {name: "AbbreviatedName", datatype: "String",width:60},
                {name: "Time", datatype: "String",width:50}
            ], buttons: [
            //    {name: "add", enable:false},
                {name: "delete"/*, action: Utils.Msg.deleteConfirm(onDelwiredter)*/}
            ]
        };
        $("#wiredterminal_slist").SList ("head", opt);

        var opt = {
            search:false,
            multiSelect: true,
            colNames: getRcText ("detail-list-title"),
            colModel: [
                {name: "MacAddress", datatype: "String",width:100},
                {name: "IpAddress", datatype: "String",width:60},
                {name: "UserName", datatype: "String",width:60},
                {name: "Ssid", datatype: "String",width:60},
                {name: "ApName", datatype: "String",width:50},
                {name: "WirelessMode", datatype: "String",width:80},
                {name: "VLAN", datatype: "String",width:40},
                {name: "Throughput", datatype: "String",width:100},
                {name: "UpTime", datatype: "String",width:80}
            ],
            buttons:[
            {name: "disconnect", /*action: disconnect,*/value: getRcText ("SETTING"), description: getRcText ("SETTING")}
            ]
        };
        $("#detail-list").SList ("head", opt);
}
/*function disconnect(aRowData)
{
    function onSuccess()
    {
        Utils.Pages.closeWindow (Utils.Pages.getWindow ($("#tableDlg")));
        initData();
    }
    var oReset = Utils.Request.getTableInstance(NC.ResetClient);
    for(var i=0; i<aRowData.length;i++)
    {
        oReset.addRows({"MacAddress":aRowData[i].MacAddress});
    }
    Utils.Request.action([oReset], {onSuccess:onSuccess, scope:$("#terminalinfo")});
}*/

function initForm()
{
    $("#tableForm").form("init", "edit", {"title":getRcText("TITLE_TERINFO"),"btn_apply": false,"btn_cancel":false});
}
function _init ()
{
  //  NC = Utils.Pages[MODULE_NC].NC;
    initData();
    initForm();
    initGrid();
    initLable();
}

function _resize(jParent)
{
    if(hTimer)
    {
        clearTimeout(hTimer);
    }
    hTimer = setTimeout(initLable,200);
}

function _destroy()
{
    clearTimeout(hTimer);
}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["SList","Echart","Panel","Form","EditList","Minput"],
    "utils": [/*"Request",*/ "Device","Base"]
    /*"subModules": [MODULE_NC]*/
});

}) (jQuery);
