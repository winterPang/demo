(function ($)
{
var MODULE_NAME = "wsmbfile.Flow_analysis";
//var NC, MODULE_NC = "wsmbfile.NC";

var g_aAllAppName = [];
var g_oAppAllData = {};
var g_StartTime, g_EndTime;
var g_oAllUsrMac = {};
var g_aSend = [],g_aReceive = [];

function getRcText(sRcName)
{
    return Utils.Base.getRcString("flow_analysis_rc", sRcName);
}

function drawApFlow(aData)
{
    var aName = [];
    var aUpData = [];
    var aDownData = [];
    for(var i = 0; i < aData.length; i++)
    {
        aName.push(aData[i].Name);
        aUpData.push(aData[i].OutOctets);
        aDownData.push(-aData[i].InOctets);
    }
    /****for text*********/
    aName = ["ap1","ap2", "ap3", "ap4", "ap5", "ap6", "ap7", "ap8"];
    aUpData = ['1','2','3','4','5','6','7','3'];
    aDownData = ['-1','-2','-3','-4','-5','-6','-7','-3'];
    /*************/
    var nWidth = $("#ap_flow").parent().width()*0.99;
    var option = {
        height:"100%",
        grid: {
            x:8, y:20, x2:10, y2:25,
            borderColor: '#FFFFFF'
        },
        legend: {
            orient: "horizontal",
            y: 0,
            x: "right",
            textStyle:{
                color:'#617085',
                fontSize:'12px'
            },
            data: getRcText("LEGEND").split(",")
        },
        tooltip : {
            show: true,
            trigger: 'axis',
            formatter:function(y,x){
                        var sTips = y[0][1] + "<br/>" + y[0][0] + ":" + y[0][2] + "Mbps<br/>" +
                                    y[1][0] + ":" + (-y[1][2]) + "Mbps"
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
            end : 70,
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
                    show:false,
                    lineStyle: {
                        color: '#373737',
                        type: 'solid',
                        width: 1
                    }
                },
                splitArea : {
                    areaStyle : {
                        color: '#174686'
                    }
                },
                axisLine  : {
                    show:true,
                    textStyle:{color: '#617085', fontSize:"12px", width:2},
                    lineStyle :{color: '#617085', width: 1}
                },
                axisLabel : {
                    textStyle:{color: '#617085', fontSize:"12px", width:2},
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
                axisTick : {show: false},
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#617085', width: 1}
                },
                data : aName,
                splitLine : {
                    show : false
                }
            }
        ],
        series : [
                {
                    type:'bar',
                    data: aUpData,
                    name: getRcText("LEGEND").split(",")[0],
                    barCategoryGap: '40%',
                    stack:"kk",
                    itemStyle : {
                        normal: {
                            label : {
                                show: true, 
                                position: 'insideLeft',
                                formatter: function(oData){
                                    return oData.name;
                                },
                                textStyle: {color:"#617085"}
                            }
                        }
                    }
                },
                {
                    
                    type:'bar',
                    data: aDownData,
                    name: getRcText("LEGEND").split(",")[1],
                    barCategoryGap: '40%',
                    stack:"kk",
                    itemStyle : {
                        normal: {
                            label : {
                                show: false
                            }
                        }
                    }
                }
        ]
    };
    var oTheme = {
        color: ['#FFBB33','#CDDC39']
    };
    $("#ap_flow").echart("init", option, oTheme);
}
function mathSwitchIn(Bits)
{
    var ss;
    if(Bits/1024/1024 < 1)
    {
        if(Bits/1024 < 1)
        {
            ss = Bits;
            return Bits;
        }
        else
        {
            ss = Math.round(Bits/1024);
            return ss;
        }
    }
    else
    {
        ss = Math.round(Bits/1024/1024);
        return ss;
    }
}
function drawLinePortFlow(aTemp)
{
    var aName = [];
    var InBits = [];
    var OutBits = [];
    for(var i = 0; i < aTemp.length; i++)
    {
        aName.push(aTemp[i].Name);
        InBits.push(mathSwitchIn(aTemp[i].InBits));
        OutBits.push(-mathSwitchIn(aTemp[i].OutBits));
    }
    var nWidth = $("#line_port_flow").parent().width()*0.99;
    var option = {
        height:"100%",
        grid: {
            x:8, y:20, x2:10, y2:25,
            borderColor: '#FFFFFF'
        },
        legend: {
            orient: "horizontal",
            y: 0,
            x: "right",
            textStyle:{
                color:'#617085',
                fontSize:'12px'
            },
            data: getRcText("LEGEND").split(",")
        },
        tooltip : {
            show: true,
            trigger: 'axis',
            formatter:function(y,x){
                        var sTips = y[0][1] + "<br/>" + y[0][0] + ":" + y[0][2] + "Mbps<br/>" +
                                    y[1][0] + ":" + (-y[1][2]) + "Mbps"
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
            show : false,
            realtime : true,
            start : 0,
            end : 100,
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
                    show:false,
                    lineStyle: {
                        color: '#373737',
                        type: 'solid',
                        width: 1
                    }
                },
                splitArea : {
                    areaStyle : {
                        color: '#174686'
                    }
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#617085', width: 1}
                },
                axisLabel : {
                    textStyle:{color: '#617085', fontSize:"12px", width:2},
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
                axisTick : {show: false},
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#617085', width: 1}
                },
                //data : ["ap1","ap2", "ap3", "ap4", "ap5", "ap6", "ap7", "ap8"],
                data : aName,
                splitLine : {
                    show : false
                }
            }
        ],
        series : [
                {
                    
                    type:'bar',
                    //data: ['1','2','3','4','5','6','7','3'],
                    data:InBits,
                    name: getRcText("LEGEND").split(",")[0],
                    barCategoryGap: '40%',
                    stack:"kk",
                    itemStyle : {
                        normal: {
                            label : {
                                show: true, 
                                position: 'insideLeft',
                                formatter: function(oData){return oData.name;},
                                textStyle: {color:"#617085"}
                            }
                        },
                        emphasis: {
                            label : {
                                show: false,
                                formatter: function(oData){return oData.name;},
                                textStyle: {color:"#617085"}
                            }
                        }
                    }
                },
                {
                    
                    type:'bar',
                    //data: ['-1','-2','-3','-4','-5','-6','-7','-3'],
                    data: OutBits,
                    name: getRcText("LEGEND").split(",")[1],
                    barCategoryGap: '40%',
                    stack:"kk",
                    itemStyle : {
                        normal: {
                            label : {
                                show: false
                            }
                        }
                    }
                }
        ]
    };
    var oTheme = {
        color: ['#69C4C5','#53B9E7']
    };
    $("#line_port_flow").echart("init", option, oTheme);
}

function drawAnalysisLine(oData)
{
    /*var aUserAppUP = [];
    var aUserAppDown = [];
   
    var oUserAppDown = Utils.Request.getTableInstance (NC.AppLogs);
    for(var i = 0; i < 12; i++)
    {
        var Start = new Date(g_StartTime + 3600000*i);
        var StartTime = Start.toISOString().split(".")[0];
        var End = new Date(g_StartTime + 3600000*(i + 1));
        var EndTime = End.toISOString().split(".")[0];
    //    var oData = getFlowInfo("AppLogs", StartTime, EndTime, 1,oData.AppName);
        // aUserAppUP.push(oData.UpData);
        // aUserAppDown.push(oData.DownData);
    }
    
    var aUpHis = [];
    var aDownHis = [];*/
    // for(var i = 0; i < aUserAppUP.length; i++)
    // {
    //     var aTmp = [new Date(aUserAppUP[i].time), aUserAppUP[i].PktBytes]
    //     aUpHis.push(aTmp);
    // }
    // for(var i = 0; i < aUserAppDown.length; i++)
    // {
    //     var aTmp = [new Date(aUserAppDown[i].time), aUserAppDown[i].PktBytes]
    //     aDownHis.push(aTmp);
    // }
    /* for text */
    g_aAllAppName = getRcText("LABELS").split(",");
    var aTimes = ['8:00' , '9:00' , '10:00','11:00' , '12:00' , '13:00','14:00' , '15:00' , '16:00','17:00'];
    var aData = [];
    aData[0] = [10, 8, 6, 8, 13, 17, 20 , 17 , 16 , 13];
    aData[1] = [32, 25, 27, 18, 22, 27, 28 , 19 , 16 , 15];
    /* end */
    
    var option = {
        width:'100%',
        height:200,
        title:{
            text:oData ? oData.name :g_aAllAppName[0],
            x:70
        },
        tooltip : {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#373737',
                  width: 1,
                  type: 'solid'
                }
            }
        },
        tooltip : {
            show: true,
            trigger: 'axis',
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#fff',
                  width: 0,
                  type: 'solid'
                }
            },
            formatter : function(aData){
                var aUp = aData[1];
                var aDown = aData[0];
                return  aUp[1] + "<br/>" + aUp[0] + " : " + Utils.Base.addComma(aUp[2]) + " Kbps<br/>" + aDown[0] + " : " +Utils.Base.addComma(aDown[2]) + " Kbps";
            }
        },
        grid: {
            x: '5%', y: '40',x2:'40',y2:'30',
            borderColor: '#FFF'
        },
        calculable: false,
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                splitLine:{
                    show:false
                },
                axisLabel: {
                    show:true,
                    textStyle:{color: '#617085', fontSize:"12px", width:2}
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#d4d4d4', width: 1}
                },
                axisTick :{
                    show:false,
                    lineStyle:{color:'#d4d4d4', width: 1}
                },
                data: aTimes
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitLine:{
                    show:false,
                    lineStyle:{color:'#d4d4d4', width: 1}
                },
                axisLabel: {
                    show: true,
                    textStyle:{color: '#617085', fontSize:"12px", width:2}
                },
                axisLine  : {
                    show:false,
                    lineStyle :{color: '#d4d4d4', width: 1}
                }
            }
        ],
        series: [
            {
                name : getRcText("UP_DOWN").split(",")[0],
                symbol: "none", 
                type: 'line', 
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
                data:aData[0]
            //    data: aUpHis
            },
            {
                name : getRcText("UP_DOWN").split(",")[1],
                symbol: "none", 
                type: 'line', 
                smooth: true,
                itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
                data:aData[1]
            //    data: aDownHis
            }
        ]

    };
    var oTheme = {
            color: ['#53B9E7','#A9DCF3']
        };
    if(oData)
    {
        if(oData.name == g_aAllAppName[0])
        {
            var oTheme = {
                color: ['#53B9E7','#A9DCF3']
            };
        }
        if(oData.name == g_aAllAppName[1])
        {
            var oTheme = {
                color: ['#31ADB4','#98D6C2']
            };
        }
        if(oData.name == g_aAllAppName[2])
        {
            var oTheme = {
                color: ['#69C4C5','#B4E1E1']
            };
        }
        if(oData.name == g_aAllAppName[3])
        {
            var oTheme = {
                color: ['#FFBB33','#FFDD99']
            };
        }
        if(oData.name == g_aAllAppName[4])
        {
            var oTheme = {
                color: ['#FF8800','#FFC37F']
            };
        }
        if(oData.name == g_aAllAppName[5])
        {
            var oTheme = {
                color: ['#CC324B','#E699A5']
            };
        }
        if(oData.name == g_aAllAppName[6])
        {
            var oTheme = {
                color: ['#E64C65','#F3A6B2']
            };
        }
        if(oData.name == g_aAllAppName[7])
        {
            var oTheme = {
                color: ['#D7DDE4','#DFE3E8']
            };
        }
    }
    $("#usage").echart ("init", option,oTheme);

}

/*function initPie()
{
    var aArray = [];
    aArray[0] = getRcText("Tips");
    var option = {
        tooltip : {
            trigger: 'item',
            formatter: getRcText("Tips")
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:aArray
        },
        height:200,
        calculable : false,
        myLegend:{
            scope : "#anaylsis_pie-Legend",
            width: "45%",
            right: 0,
            top: -28
        },
        series : [
            {
                name:getRcText("NAMELINE"),
                type:'pie',
                radius : '60%',
                center: ['60%', '50%'],
                itemStyle: {

                    normal: {
                        labelLine:{
                            show:false
                        },
                        label:
                        {
                            position:"inner",
                            formatter: function(a,b,c,d){
                                return Math.round(d)+"%";
                            },
                            textStyle : {
                                color : 'rgba(0,0,0,1)',
                                align : 'center',
                                baseline : 'middle',
                                fontSize : 16
                                
                            }
                        }
                    }
                },
                data:[{name:aArray[0],value:1}]
            }
        ]
    };
    var oTheme = {
        color : ['#D7DDE4']
    };
    $("#anaylsis_pie").echart("init", option, {color: ["rgba(216, 216, 216, 0.75)"]
    });
    
}*/
function drawAnalysisPie(aPieData)
{
    // if(aPieData.length == 0)
    // {
    //     initPie();
    //     return;
    // }
    var aType  = [];
    for(var i = 0; i < aPieData.length; i++)
    {
        var oTmp = {
            value:aPieData[i].PktBytes,
            name:aPieData[i].AppName
        }
        aType.push(oTmp);
    }
    //for test
    var labels = getRcText("LABELS").split(",");        
    var aType = [
        {value:20, name:labels[0]},
        {value:60, name:labels[1]},
        {value:90, name:labels[2]},
        {value:30, name:labels[3]},
        {value:10, name:labels[4]},
        {value:80, name:labels[5]},
        {value:77, name:labels[6]},
        {value:80, name:labels[7]}
    ];
    /* end */
    var option = {
        height:220,
        tooltip : {
            show:true,
            trigger: 'item',
            formatter: "{b}<br/> {c} ({d}%)"
        },
        calculable : false,
        myLegend:{
            scope : "#anaylsis_pie-Legend",
            width: "40%",
            right: "10%",
            top: -28,
        },
        series : [
            {
                name:'App flow anaylsis',
                type:'pie',
                radius : ['50%', '90%'],
                center: ['25%', '45%'],
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
                data:aType
            }
        ]
        ,click: drawAnalysisLine
    };
    var oTheme = {
        color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
    };
    $("#anaylsis_pie").echart ("init", option,oTheme);
}
function getTableData(aStations, aStationStatistics, aUserApp, flag)
{
    
    var oTemp = {};
    for(var i = 0; i < aStations.length; i++)
    {
        if(flag == 0)
        {
            aStations[i].Rate = TxRate;
        }
        else
        {
            aStations[i].Rate = RxRate;
        }
        oTemp[aStations[i].MacAddress] = aStations[i];
    }
    if(flag == 0)
    {
        for(var i = 0; i < aStationStatistics.length; i++)
        {
            var sIndex = aStationStatistics[i].MacAddress;
            if(oTemp[sIndex])
            {
                oTemp[sIndex].VoBytes = aStationStatistics[i].TxVoBytes;
                oTemp[sIndex].VoFrames = aStationStatistics[i].TxVoFrames;
            }
        }
    }else
    {
        for(var i = 0; i < aStationStatistics.length; i++)
        {
            var sIndex = aStationStatistics[i].MacAddress;
            if(oTemp[sIndex])
            {
                oTemp[sIndex].VoBytes = aStationStatistics[i].RxVoBytes;
                oTemp[sIndex].VoFrames = aStationStatistics[i].RxVoFrames;
            }
        }
    }
    /*****app type***********/
    for(var i = 0; i < aUserApp.length; i++)
    {
        var sIndex = aUserApp[i].UserMac;
        if(oTemp[sIndex])
        {
            if(!oTemp[sIndex].AppType)
                oTemp[sIndex].AppType = aUserApp[i].AppName;
            else
                oTemp[sIndex].AppType = oTemp[sIndex].AppType + "," + aUserApp[i].AppName;
        }
    }
    var aAllData = [];
    for(key in oTemp)
    {
        aAllData.push(oTemp[key]);
    }
    return aAllData;
}
function getWanInfo(aTra_Interfaces,aInterfaces)
{
    var oTemp = {};
    for(var i = 0; i < aInterfaces.length; i++)
    {
        if(aInterfaces[i].Name.search("GigabitEthernet") != -1)
        {
            oTemp[aInterfaces[i].IfIndex] = true;
        }
    }  
    var aTemp = [];
    for(var i = 0; i < aTra_Interfaces.length; i++)
    {
        if(oTemp[aTra_Interfaces[i].IfIndex])
        {
            aTemp.push(aTra_Interfaces[i]);
        }
    }
    return aTemp;
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
function getPieData(aUserAppDown)
{
    var i;
    var oAllApp = {};
    for(i = 0; i < aUserAppDown.length; i++)
    {
        var sName = aUserAppDown[i].AppName;
        if(!oAllApp[sName])
        {
            oAllApp[sName] = aUserAppDown[i];
        }
        else
        {
            oAllApp[sName].PktCnts = oAllApp[sName].PktCnts + aUserAppDown[i].PktCnts;
            oAllApp[sName].PktBytes = oAllApp[sName].PktBytes + aUserAppDown[i].PktBytes;
            oAllApp[sName].PktDropCnts = oAllApp[sName].PktDropCnts + aUserAppDown[i].PktDropCnts;
            oAllApp[sName].PktDropBytes = oAllApp[sName].PktDropBytes + aUserAppDown[i].PktDropBytes;
        }
    }
    var aTemp = [];
    for(key in oAllApp)
    {
        aTemp.push(oAllApp[key]);
    }
    aTemp = aTemp.sort(function(a,b){
        return b.PktBytes-a.PktBytes;
    }).slice(0,8);   

    // for(i = 0; i < aTemp.length; i++)
    // {
    //     g_aAllAppName.push(aTemp[i].AppName);
    // }  
    return aTemp;
}
function initData()
{
    var nTime = new Date();
    var end = nTime.toISOString().split(".")[0];
        g_EndTime = nTime.getTime();
        g_StartTime = nTime - 43200000;//12H,1H = 3600000
    var start = new Date(g_StartTime).toISOString().split(".")[0];
    $.ajax({
        url: "../../wnm/flow_analysis.json",
        type: "GET",
        dataType: "json",
        success: function(data){
            var aAPStatistics = data.aAPStatistics||[];
            drawApFlow(aAPStatistics);
            var aTra_Interfaces = data.aTra_Interfaces||[];
            var aInterfaces = data.aInterfaces||[];
            var aWanInfo = getWanInfo(aTra_Interfaces,aInterfaces);
            drawLinePortFlow(aWanInfo);

            var aStations = data.aStations;
            var aStationStatistics = data.aStationStatistics;
            //var aUserAppDown = Utils.Request.getTableRows(NC.UserApps, oInfo);
           // var oAllData = getFlowInfo("UserApps", start, end, 0);
            var oAllData = data.oAllData;
            g_oAppAllData = oAllData;
            var aUserAppDown = oAllData.DownData.concat(oAllData.UpData);
            var aUsers = data.aUsers;
            var oAllApp = {};
            var aPieData = getPieData(aUserAppDown);
            drawAnalysisPie(aPieData);
            drawAnalysisLine(aPieData[0]);


            var oAllUsrId = {};
            for(var i = 0; i < aUsers.length; i++)
            {
                if(!g_oAllUsr[aUsers[i].UserMac])
                {
                    g_oAllUsr[aUsers[i].UserMac] = aUsers[i];
                }
                if(!oAllUsrId[aUsers[i].UserId])
                {
                    oAllUsrId[aUsers[i].UserId] = aUsers[i];
                }
            }

            for(var i = 0; i < oAllData.DownData.length; i++)
            {
                if(oAllUsrId[oAllData.DownData[i].UserId])
                {
                    oAllData.DownData[i].UserMac = oAllUsrId[oAllData.DownData[i].UserId].UserMac;
                }
            }

            for(var i = 0; i < oAllData.UpData.length; i++)
            {
                if(oAllUsrId[oAllData.UpData[i].UserId])
                {
                    oAllData.UpData[i].UserMac = oAllUsrId[oAllData.UpData[i].UserId].UserMac;
                }
            }


            var g_aSend = getTableData(aStations, aStationStatistics,oAllData.UpData, 0);
            var g_aReceive = getTableData(aStations, aStationStatistics,oAllData.DownData, 1);
            //发送，上行流量
            //var aTemp = getTableData(aStations, aStationStatistics,oAllData.UpData);
            /* for text */
            var aTemp = [];
            for(var i = 0; i < 3; i++)
            {
                oTemp = {
                    MacAddress:"11-22-33-44-55-" + i,
                    WirelessMode:getRcText("WIRELESSMODE").split(",")[i],
                    VoBytes:parseInt(Math.random()*1000000000000),
                    VoFrames:parseInt(Math.random()*1000000000000),
                    Rate:parseInt(Math.random()*10000000),
                    AppType:getRcText("LABELS").split(",")
                };
                aTemp.push(oTemp);
            }
            /* end */
            $("#wireless_list").SList ("refresh", aTemp);
        },
        error:function(err,status){

        }
    });

  /*  function myCallback (oInfo)
    {

        var aAPStatistics = Utils.Request.getTableRows (NC.APStatistics, oInfo)||[];
        drawApFlow(aAPStatistics);
        var aTra_Interfaces = Utils.Request.getTableRows (NC.Tra_Interfaces, oInfo)||[];  
        var aInterfaces = Utils.Request.getTableRows (NC.Interfaces, oInfo)||[];
        var aWanInfo = getWanInfo(aTra_Interfaces,aInterfaces);
        drawLinePortFlow(aWanInfo);

        var aStations = Utils.Request.getTableRows(NC.Stations, oInfo);
        var aStationStatistics = Utils.Request.getTableRows(NC.StationStatistics, oInfo);
        //var aUserAppDown = Utils.Request.getTableRows(NC.UserApps, oInfo);
        var oAllData = getFlowInfo("UserApps", start, end, 0);
        g_oAppAllData = oAllData;
        var aUserAppDown = oAllData.DownData.concat(oAllData.UpData);
        var aUsers = Utils.Request.getTableRows(NC.Users, oInfo);
        var oAllApp = {};
        var aPieData = getPieData(aUserAppDown);
        drawAnalysisPie(aPieData);
        drawAnalysisLine(aPieData[0]);
          
        
        var oAllUsrId = {};
        for(var i = 0; i < aUsers.length; i++)
        {
            if(!g_oAllUsr[aUsers[i].UserMac])
            {
                g_oAllUsr[aUsers[i].UserMac] = aUsers[i];
            }
            if(!oAllUsrId[aUsers[i].UserId])
            {
                oAllUsrId[aUsers[i].UserId] = aUsers[i];
            }
        }
        
        for(var i = 0; i < oAllData.DownData.length; i++)
        {
            if(oAllUsrId[oAllData.DownData[i].UserId])
            {
                oAllData.DownData[i].UserMac = oAllUsrId[oAllData.DownData[i].UserId].UserMac;
            }
        }

        for(var i = 0; i < oAllData.UpData.length; i++)
        {
            if(oAllUsrId[oAllData.UpData[i].UserId])
            {
                oAllData.UpData[i].UserMac = oAllUsrId[oAllData.UpData[i].UserId].UserMac;
            }
        }
        

        var g_aSend = getTableData(aStations, aStationStatistics,oAllData.UpData, 0);
        var g_aReceive = getTableData(aStations, aStationStatistics,oAllData.DownData, 1);
        //发送，上行流量
        //var aTemp = getTableData(aStations, aStationStatistics,oAllData.UpData);
        /!* for text *!/
        var aTemp = [];
        for(var i = 0; i < 3; i++)
        {
            oTemp = {
                MacAddress:"11-22-33-44-55-" + i,
                WirelessMode:getRcText("WIRELESSMODE").split(",")[i],
                VoBytes:parseInt(Math.random()*1000000000000),
                VoFrames:parseInt(Math.random()*1000000000000),
                Rate:parseInt(Math.random()*10000000),
                AppType:getRcText("LABELS").split(",")
            };
            aTemp.push(oTemp);
        }
        /!* end *!/
        $("#wireless_list").SList ("refresh", aTemp);
    }
    var aRequest = [];
    var oAPStatistics = Utils.Request.getTableInstance (NC.APStatistics);
    //aRequest.push(oAPStatistics);
    var oTra_Interfaces = Utils.Request.getTableInstance (NC.Tra_Interfaces);
    var oInterfaces = Utils.Request.getTableInstance (NC.Interfaces);
    aRequest.push(oTra_Interfaces,oInterfaces);

    var oStation = Utils.Request.getTableInstance (NC.Stations);
    var oStationStatistics = Utils.Request.getTableInstance (NC.StationStatistics);
    aRequest.push(oStation, oStationStatistics);

    Utils.Request.getAll (aRequest, myCallback);*/
}



/*function onOpenAdd(aRowData){

}*/


function showWirelessInfo(oData)
{
    if(!oData){
        return false;
    }
    var sMac = oData.MacAddress;
    $("#ssidTitle").html(getRcText ("TITLE_TERINFO") + sMac);
    $.ajax({
        url: "../../wnm/flow_analysis.json",
        type: "GET",
        dataType: "json",
        success: function(data){
            var aSSID = data.aSSID|| [];
            var aSecurity = data.aSecurity || [];
            var aQOSMODE = getRcText("QOSMODE").split(",");
            var aCLIENTTYPE = getRcText("CLIENTTYPE").split(",");
            var aENCRYPTIONCIPHER = getRcText("ENCRYPTIONCIPHER").split(",");
            var aWsMODE = getRcText("WIRELESS_MODE").split(",");
            for(var i=0;i<aSSID.length;i++)
            {
                aSSID[i].QoSMode = aQOSMODE[aSSID[i].QoSMode];
                if(aSSID[i].Ipv4Address == "0.0.0.0")
                {
                    aSSID[i].Ipv4Address = "";
                }
                if(aSSID[i].Ipv6Address == "::")
                {
                    aSSID[i].Ipv6Address = "";
                }
                var nMode = aSSID[i].WirelessMode || "";
                switch(nMode)
                {
                    case "1": nMode = 0; break;
                    case "2": nMode = 1; break;
                    case "4": nMode = 2; break;
                    case "8": nMode = 3; break;
                    case "16": nMode = 4; break;
                    case "64": nMode = 5; break;
                }
                aSSID[i].WirelessMode = aWsMODE[nMode];
            }
            $.each(aSecurity,function(index,oData)
            {
                oData.ClientType = aCLIENTTYPE[oData.ClientType];
                var nMode = oData.EncryptionCipher || "";
                switch(nMode)
                {
                    case "0": nMode = 0; break;
                    case "1": nMode = 1; break;
                    case "2": nMode = 2; break;
                    case "4": nMode = 3; break;
                    case "5": nMode = 4; break;
                    case "6": nMode = 5; break;
                    case "7": nMode = 6; break;
                    case "255": nMode = 7; break;
                }
                oData.EncryptionCipher = aENCRYPTIONCIPHER[nMode];
            });
            Utils.Base.updateHtml($("#view_client_form"), aSecurity[0]);
            Utils.Base.updateHtml($("#view_client_form"), aSSID[0]);
            //getChannel(aSSID[0].ApName,aSSID[0].RadioID);
            var oAP = data.oAP|| {};
            Utils.Base.updateHtml($("#view_client_form"), oAP);
            Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlg"),className:"modal-super"});
        },
        error:function(err,status){

        }
    });

    /*function getChannel(ApName,RadioID)
    {
        function myCallback(oInfos)
        {
            var oAP = Utils.Request.getTableRows(NC.RadioOfRunAP, oInfos)[0] || {};
            Utils.Base.updateHtml($("#view_client_form"), oAP);
        }
        var oAP = Utils.Request.getTableInstance(NC.RadioOfRunAP);
        oAP.addFilter({ApName:ApName,RadioID:RadioID});
        Utils.Request.getAll([oAP], myCallback);

    }
    function myCallback(oInfos)
    {
        var aSSID = Utils.Request.getTableRows(NC.Stations, oInfos) || [];
        var aSecurity = Utils.Request.getTableRows(NC.SecurityInfo, oInfos) || [];
        var aQOSMODE = getRcText("QOSMODE").split(",");
        var aCLIENTTYPE = getRcText("CLIENTTYPE").split(",");
        var aENCRYPTIONCIPHER = getRcText("ENCRYPTIONCIPHER").split(",");
        var aWsMODE = getRcText("WIRELESS_MODE").split(",");
        for(var i=0;i<aSSID.length;i++)
        {
            aSSID[i].QoSMode = aQOSMODE[aSSID[i].QoSMode];
            if(aSSID[i].Ipv4Address == "0.0.0.0")
            {
                aSSID[i].Ipv4Address = "";
            }
            if(aSSID[i].Ipv6Address == "::")
            {
                aSSID[i].Ipv6Address = "";
            }
            var nMode = aSSID[i].WirelessMode || "";
            switch(nMode)
            {
                case "1": nMode = 0; break;
                case "2": nMode = 1; break;
                case "4": nMode = 2; break;
                case "8": nMode = 3; break;
                case "16": nMode = 4; break;
                case "64": nMode = 5; break;
            }
            aSSID[i].WirelessMode = aWsMODE[nMode];               
        }
        $.each(aSecurity,function(index,oData)
        {
            oData.ClientType = aCLIENTTYPE[oData.ClientType];
            var nMode = oData.EncryptionCipher || "";
            switch(nMode)
            {
                case "0": nMode = 0; break;
                case "1": nMode = 1; break;
                case "2": nMode = 2; break;
                case "4": nMode = 3; break;
                case "5": nMode = 4; break;
                case "6": nMode = 5; break;
                case "7": nMode = 6; break;
                case "255": nMode = 7; break;
            }
            oData.EncryptionCipher = aENCRYPTIONCIPHER[nMode];
        });
        Utils.Base.updateHtml($("#view_client_form"), aSecurity[0]);
        Utils.Base.updateHtml($("#view_client_form"), aSSID[0]);
        getChannel(aSSID[0].ApName,aSSID[0].RadioID);
        
        
        Utils.Base.openDlg(null, {}, {scope:$("#TerminalInfoDlg"),className:"modal-super"});
    }
    var sMac = oData.MacAddress;
    $("#ssidTitle").html(getRcText ("TITLE_TERINFO") + sMac);

    var oSSID = Utils.Request.getTableInstance(NC.Stations);
    var oSecurity = Utils.Request.getTableInstance(NC.SecurityInfo);

    oSSID.addFilter({MacAddress:oData.MacAddress});
    Utils.Request.getAll([oSSID,oSecurity], myCallback);*/
}
function showFlowInfo(oData)
{     
    // if($("#btn_send").hasClass("active") == true)
    // {
    //     aAllData = g_oAppAllData.UpData;
    // }
    // else
    // {
    //     aAllData = g_oAppAllData.DownData;
    // }
    /* data */
    // var usrId = g_oAllUsrMac[oData.MacAddress].UserId;
    
    // var oType = {};
    // for(var i = 0; i < aAllData.length; i++)
    // {        
    //     if(!oType[aAllData[i].AppName])
    //     {
    //         var oo = {
    //         AppCategory:aAllData[i].AppCategory,
    //         AppName:aAllData[i].AppName
    //     }
    //         oType[aAllData[i].AppName] = oo;
    //     }
    //     else
    //     {
    //         oType[oo.AppCategory].AppName = oType[oo.AppCategory].AppName + "," + aAllData[i].AppName;
    //     }
    // } 
    var aType = [];
    // for(key in oType)
    // {
    //     aType.push(oType[key]);
    // }
    /* text */
    for(i = 0; i < 4; i++)
    {
        var oo = {
            AppCategory:getRcText("TYPE_FORTEXT").split(",")[i],
            AppName:getRcText("TYPESXQ_" + i)
        }
        aType.push(oo);
    }
    /* end */
    $("#flowdetail_list").SList ("refresh", aType);
    /* 组织好数据后 */
    Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});  
}
function onDisDetail()
{
    var oData = $("#wireless_list").SList("getSelectRow")[0];
    var sType = $(this).attr("cell");
    if(sType == 0)
    {
        showWirelessInfo(oData);
    }
    else
    {
        showFlowInfo(oData);
    }
}
/*function onDelWireless(aRowData)
{
    var oStationStatistics = Utils.Request.getTableInstance (NC.StationStatistics);
    for(var i = 0; i < aRowData.length; i++)
    {
        oStationStatistics.addRows({MacAddress: aRowData[i].MacAddress});
    }
    Utils.Request.set ("remove", [oStationStatistics], {onSuccess:initData, scope:$("#wireless_list")}); 
}*/

function showLink(row, cell, value, columnDef, dataContext, type)
{
    value = value || "";

    if("text" == type)
    {
        return value;
    }

    return '<a class="list-link" cell="'+cell+'">'+value+'</a>';   
}
function initGrid()
{
    var opt = {
            colNames: getRcText ("WIRELESS_HEADER"),
            showHeader: true,
            multiSelect : true ,
            colModel: [
                {name:'MacAddress', datatype:"String",formatter:showLink},
                {name:'WirelessMode', datatype:"String"},
                {name:'VoBytes', datatype:"String"},
                {name:'VoFrames', datatype:"String"},
                {name:'Rate', datatype:"String"},
                {name:'AppType', datatype:"String",formatter:showLink}
            ],
            buttons:[
                {name: "delete"/*, action: Utils.Msg.deleteConfirm(onDelWireless)*/}
            ]
        };
    $("#wireless_list").SList ("head", opt);
    $("#wireless_list").on('click', 'a.list-link', onDisDetail);

    var opt = {
            colNames: getRcText ("FLOWDETAIL_HEADER"),
            showHeader: true,
            multiSelect : true ,
            colModel: [
                {name:'AppCategory', datatype:"String"},
                {name:'AppName', datatype:"String"}
            ]
        };
    $("#flowdetail_list").SList ("head", opt);
}
function initForm()
{
    $("#view_client_form").form("init", "edit", {"title":getRcText("TITLE_TERINFO"),"btn_apply": false,"btn_cancel":false});
    $("#flowdetail_form").form("init", "edit", {"title":getRcText("TITLE_FLOWINFO"),"btn_apply": false,"btn_cancel":false});
    $("#btn_send").on("click",function(){
        $(this).addClass("active");
        $("#btn_receive").removeClass("active");
        $("#wireless_list").SList("refresh",g_aSend);
    });
    $("#btn_receive").on("click",function(){
        $(this).addClass("active");
        $("#btn_send").removeClass("active");
        $("#wireless_list").SList("refresh",g_aReceive);
    });
}
function _init()
{
  //  NC = Utils.Pages[MODULE_NC].NC;
    initGrid();
    initData();
    initForm();
    
}

function _resize(jParent)
{
}

function _destroy()
{
}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["Echart","SList","Minput","Panel","Form"],
    "utils": [/*"Request",*/ "Device","Base"]
   // "subModules": [MODULE_NC]
});

}) (jQuery);
