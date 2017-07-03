(function ($)
{
var MODULE_NAME = "wsmbfile.summary";
var NC, MODULE_NC = "wsmbfile.NC";
var g_ClientInfor;
var g_aUserAppUP, g_aUserAppDown;
var g_oLineChart;
var g_oResizeTimer;
var g_oTimer ;

function getRcText(sRcName)
{
    return Utils.Base.getRcString("dashboard_rc", sRcName);
}
function Interval()
{
    function doDraw(oInfo)
    {
        var aTra_Interfaces = Utils.Request.getTableRows (NC.Tra_Interfaces, oInfo)||[];  
        var aInterfaces = Utils.Request.getTableRows (NC.Interfaces, oInfo)||[];
        var aTemp = getWanInfo(aTra_Interfaces,aInterfaces);
        var aData = [];
        var time = new Date();
        for(var i = 0; i < aTemp.length; i++)
        {
            var In = [time,mathSwitchIn(aTemp[i].InOctets)];
            var Out = [time,mathSwitchOut(aTemp[i].OutOctets)]; 
            aData.push(In);
            aData.push(Out);
            // aData.push([i*2,mathSwitchIn(aTemp[i].InOctets),true,true,time]);
            // aData.push([i*2+1,mathSwitchOut(aTemp[i].OutOctets),true,true,time]);
        }        
        g_oLineChart.addPoint(aData);
        // g_oLineChart.addData(aData);
        if(g_oTimer)
        {
            clearTimeout(g_oTimer);
        }
        g_oTimer = setTimeout(Interval,60000);
    }

    if(g_oLineChart)
    {   
        var oTra_Interfaces = Utils.Request.getTableInstance (NC.Tra_Interfaces);
        var oInterfaces = Utils.Request.getTableInstance (NC.Interfaces);
        Utils.Request.getAll ([oTra_Interfaces, oInterfaces], doDraw);
    }
}
function mathSwitchIn(Bytes)
{
    return Bytes/1024/1024;
}
function mathSwitchOut(Bytes)
{
    return -Bytes/1024/1024;
}
function drawOutletflow(aflow,aHistory)
{    
    var aseries = [];
    for(var i = 0; i < aflow.length; i++)
    {
        var aInData = [];
        var aOutData = [];
        for(var j = 0; j < aHistory.length; j++)
        {
            if(aHistory[j].IfIndex == aflow[i].IfIndex)
            {
                var In = [new Date(aHistory[j].RecordTime),mathSwitchIn(aHistory[j].InOctets)];
                var Out = [new Date(aHistory[j].RecordTime),mathSwitchOut(aHistory[j].OutOctets)];
                aInData.push(In);
                aOutData.push(Out);
            }
        }
        var oTemp = {
            //symbol: "none", 
            type: 'line', 
            smooth: true,
            symbol : "Circle",
            showAllSymbol: true,
            symbolSize : 2,
            itemStyle: {
                normal: 
                {
                    areaStyle: {type: 'default'},
                    lineStyle:{width:0}
                }
            },
            name: aflow[i].Name,
            data: aInData
        }
        aseries.push(oTemp);
        var oTemp = {
            //symbol: "none", 
            type: 'line', 
            smooth: true,
            symbol : "Circle",
            showAllSymbol: true,
            symbolSize : 2,
            itemStyle: {normal: {areaStyle: {type: 'default'},lineStyle:{width:0}}},
            name: aflow[i].Name,
            data: aOutData
        }
        aseries.push(oTemp);
    }
    var option = {
        width:"100%",
        height:"230px",
        tooltip: {
            show: true,
            trigger: 'item',
            formatter:function(params){
                var time = params.value[0].toISOString().split(".")[0].split("T").toString();
                if(params.value[1] < 0)
                    params.value[1] = -params.value[1];
                var string =params.seriesName + "<br/>" + time + "<br/>" + params.value[1] + "M"
                return string;
            },
            axisPointer:{
                type : 'line',
                lineStyle : {
                  color: '#373737',
                  width: 0,
                  type: 'solid'
                }
            }
        },
        // legend: {
        //     orient: "horizontal",
        //     y: 0,
        //     x: "right",
        //     textStyle:{color: '#617085', fontSize:"12px"},
        //     data: getRcText("UP_DOWN").split(",")
        // },
        grid: {
            x:60, y:20, x2:22, y2:70,
            borderColor: '#FFF'
        },
        calculable: false,
        dataZoom: {
            show: true,
            start : 30,
            end : 70,
            fillerColor:'#69C4C5',
            handleColor:'#617085',
            backgroundColor:'#E6F5F6'
        },
        
        xAxis: [
            {
                type: 'time',
                splitLine:true,
                axisLabel: {
                    show: true,
                    textStyle:{color: '#617085', fontSize:"12px"} 
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#AEAEB7', width: 1}
                },
                axisTick :{
                    show:false
                }
            }
        ],
        yAxis: [
            {
                name: "Mbps",
                type: 'value',
                splitLine : {
                    show : false
                },
                axisLabel: {
                    show: true,
                    textStyle:{color: '#617085', fontSize:"12px", width:2} 
                },
                axisLine  : {
                    show:true,
                    lineStyle :{color: '#AEAEB7', width: 1}
                }
            }
        ],
        animation: false,
        series: aseries
    };
    var oTheme = {
        color: ['#98D6DA','#B4E2E2'],
        // valueAxis:{
        //     splitLine:{lineStyle:{color:[ '#FFF']}},
        //     axisLabel:{textStyle: {color: [ '#abbbde']}}
        // },
        categoryAxis:{
            splitLine:{lineStyle:{color:['#FFF']}}
        }
    };
    g_oLineChart = $("#outletflow").echart ("init", option,oTheme);
    //Interval();
}

function drawAppflow(aUserApp)
{
    var aDataName = [];
    var aPktBytes = [];
    var aPktDropBytes = [];
    // for(var i = 0; i < aUserApp.length; i++)
    // {
    //     aDataName.push(aUserApp[i].AppName);
    //     aPktBytes.push(aUserApp[i].PktBytes);
    //     aPktDropBytes.push(aUserApp[i].PktDropBytes);
    // }

    /* for text****************/
    if($("#sendmsg").hasClass("active") == true)
    {
        aPktBytes = ['1','2','3','4','5','6','7','3'];
        aPktDropBytes = ['2','2','2','4','1','2','4','3'];
    }
    else
    {
        aPktDropBytes = ['1','2','3','4','5','2','1','3'];
        aPktBytes = ['2','4','2','4','1','2','4','3'];
    }
    /*****************/
    var option = {
        height:"140px",
        width:"100%",
        grid: {
            x: '60px', y: '20px', x2: '10px', y2: '25px',
            borderColor: '#FFFFFF'
        },
        legend: {
            orient: "horizontal",
            y: 0,
            x: "right",
            textStyle:{
                color:'#617085',
                fontSize:'14px'
            },
            data: getRcText("TIPS").split(",")
        },
        tooltip : {
            show: true,
            trigger: 'axis',
            formatter:function(y,x){
                        var sTips = y[0][1] + "<br/>" + y[0][0] + ":" + y[0][2] + "Mbps" + "<br/>" +
                                    y[1][0] + ":" + y[1][2] + "Mbps"
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
        xAxis : [
            {
                name : "APP",
                type : 'category',
                nameTextStyle:{
                    color:'#617085',
                    fontSize:'14px'
                },
                axisLine: {show:false},
                axisLabel: {
                    show:true,
                    textStyle:{color: '#617085', fontSize:"12px", width:2}
                },
                axisTick:{show:false},
                data : getRcText("APPINFO").split(","),
            //    data : aDataName,
                splitLine : {
                    show : false
                }
            }
        ],
        yAxis : [
            {
                name: "Mbps",
                type : 'value',
                axisLabel: {
                    show:true,
                    textStyle:{color: '#617085', fontSize:"12px", width:2}
                },
                axisLine: {
                    show:true,
                    lineStyle :{color: '#AEAEB7', width: 1}
                },
                axisTick : {show: false},
                splitLine : {
                    show : false
                }
            }
        ],
        series : [
            {
                name:getRcText("TIPS").split(",")[0],
                type:'bar',
                barCategoryGap: '40%',
                data: aPktBytes,
                stack: 'sum',
                itemStyle : {
                    normal: {
                        label : {
                            show: false,
                            position: 'inside'
                        }
                    }
                }
            },
            {
                name:getRcText("TIPS").split(",")[1],
                type:'bar',
                data: aPktDropBytes,
                stack: 'sum',
                itemStyle : { 
                    normal: {
                        label : {
                            show: false, 
                            position: 'inside',
                            formatter: function(x, y, val){return val;}
                        }
                    }
                }
            }
        ]
    };
    var oTheme = {
        color: ['#69C4C5','#F5F5F5']
    };
    $("#appflow").echart ("init", option,oTheme);
}

function drawEmptyPie()
{
    var option = {
        height:200,
        calculable : false,
        series : [
            {
                type:'pie',
                radius : '85%',
                center: ['50%', '50%'],
                itemStyle: {
                    normal: {
                        labelLine:{
                            show:false
                        },
                        label:
                        {
                            position:"inner"
                        }
                    }
                },
                data: [{name:'N/A',value:1}]
            }
        ]
    };
    var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
    
    $("#accessterminal").echart("init", option,oTheme);
}

function drawAccessterminal(oInfor)
{
    $("#Current").text( Utils.Base.addComma(oInfor.Total));
    if(oInfor.Total == 0)
    {
        drawEmptyPie();
        return ;
    }
    var aType = [
        {name:'802.11a(5GHz)',value:oInfor.wsm2.length},
        {name:'802.11an(5GHz)',value:oInfor.wsm16.length},
        {name:'802.11ac(5GHz)',value:oInfor.wsm64.length},
        {name:'802.11b(2.4GHz)',value:oInfor.wsm1.length},
        {name:'802.11g(2.4GHz)',value:oInfor.wsm4.length},
        {name:'802.11gn(2.4GHz)',value:oInfor.wsm8.length}
    ];
        // oInfor.Num5G = oInfor.wsm2.length + oInfor.wsm16.length + oInfor.wsm64.length;
        // oInfor.Num2G = oInfor.wsm1.length + oInfor.wsm4.length;
        var aLType = [
            {name:'5GHz',value:oInfor.Num5G},
            {name:'2.4GHz',value:oInfor.Num2G}
        ];
        var option = {
            height:200,
            tooltip : {
                show : true,
                trigger: 'item',
                formatter: function(aData){
                    /*if(aData[1] == "")
                    {
                        return false;
                    }*/

                    return aData[1]+'<br/>' + aData[2] +' (' + Math.round(aData[2]/this._option.nTotal*100) +'%)';
                }
            },
            calculable : false,
            myLegend:{
                scope : "#accessLegend",
                width: "45%",
                right: 20,
                top: 20,
            },
            nTotal : oInfor.Total,
            series : [
                {
                    type:'pie',
                    radius : ['60%','85%'],
                    center: ['25%', '50%'],
                    itemStyle: {
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
                        }
                    },
                    data: aType
                }
                ,{
                    type:'pie',
                    radius : '50%',
                    center: ['25%', '50%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            color: function(a) {
                                var colorList = ['#7FCAEA','#F9AB6B'];
                                return colorList[a.dataIndex];
                            },
                            label:
                            {
                                position:"inner",
                                formatter: '{b}'
                            }
                        }
                    },
                    data: aLType
                }
            ]
        };
        var oTheme={
                color: ['#239FD7','#7FCAEA','#A9DBF1','#FFDC6D','#F9AB6B','#BFBFBF']
        };
        
        $("#accessterminal").echart("init", option,oTheme);

}

function drawTerminaltype(aType)
{
    if(!aType.length)
    {
        return;
    }
        //for test
        var aType = [
            {value:20, name:'Printer'},
            {value:60, name:'iPad'},
            {value:110, name:'iPhone'},
            {value:30, name:'HTC'},
            {value:10, name:'Win 8'},
            {value:80, name:'Samsung'},
            {value:77, name:'Projector'},
            {value:80, name:'Unknown'}
        ];

        var option = {
            height:"100%",
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
                top: 20,
            },
            series : [
                {
                    name:'Client Type',
                    type:'pie',
                    radius :['40%', '70%'],
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
                    data:aType
                }
            ]
        };
        var oTheme = {
            color : ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4']
        };
        $("#terminaltype").echart ("init", option,oTheme);
}

function getwdNum(aArpTable, aInterfaces, aManualAP)
{
    var oAll = {};
    var aAll = [];
    
    for(var i = 0; i < aInterfaces.length; i++)
    {
        if(aInterfaces[i].PortLayer == 1)
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
            aAll.splice(i-1,1);
        }
    }
    return aAll.length;
}
function getTop8(aUserApp)
{
    var aTemp = [];
    var oAllApp = {};
    for(var i = 0; i < aUserApp.length; i++)
    {
        var sName = aUserApp[i].AppName;
        if(!oAllApp[sName])
        {
            oAllApp[sName] = aUserApp[i];
        }
        else
        {
            oAllApp[sName].PktCnts = oAllApp[sName].PktCnts + aUserApp[i].PktCnts;
            oAllApp[sName].PktBytes = oAllApp[sName].PktBytes + aUserApp[i].PktBytes;
            oAllApp[sName].PktDropCnts = oAllApp[sName].PktDropCnts + aUserApp[i].PktDropCnts;
            oAllApp[sName].PktDropBytes = oAllApp[sName].PktDropBytes + aUserApp[i].PktDropBytes;
        }
    }
    for(key in oAllApp)
    {
        aTemp.push(oAllApp[key]);
    }
    aTemp = aTemp.sort(function(a,b){
        return b.PktBytes-a.PktBytes;
    }).slice(0,8);

    return aTemp;
}
function getWanInfo(aTra_Interfaces,aInterfaces)
{
    var oTemp = {};
    for(var i = 0; i < aInterfaces.length; i++)
    {
        if((aInterfaces[i].PortLayer == 2) && (aInterfaces[i].Name.search("GigabitEthernet") != -1))
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
function initData()
{
    $.ajax({
        url: "../../wnm/summary.json",
        type: "GET",
        dataType: "json",
        success: function(data){
            var aTra_Interfaces = data.aTra_Interfaces||[];
            var aInterfaces = data.aInterfaces||[];
            var aHistoryStatistics = data.aHistoryStatistics||[];
            var aTemp = getWanInfo(aTra_Interfaces,aInterfaces);

            drawOutletflow(aTemp,aHistoryStatistics);
            /******ying yong liuliang********************/
            var aUserAppDown = data.aUserAppDown;
            g_aUserAppDown = getTop8(aUserAppDown);
            drawAppflow(g_aUserAppDown);

            /******jie ru zhong duan***************/
            var aData = data.aData;
            //for test//////////////////////////////////////////////////////
            aData = [];
            var ss = ["1","2","4","8","16","64"];
            for(var i=0;i<1024;i++)
            {
                var oo = {
                    WirelessMode: ss[parseInt(Math.random()*6)],
                };
                aData.push(oo);
            }
            /////////////////////////////////////////////////////////////////////////
            var oInfor = {
                Total : aData.length,
                Num5G : 0,
                Num2G : 0,
                wsm1 : [],  //802.11b
                wsm2 : [],  //802.11a
                wsm4 : [],  //802.11g
                wsm8 : [],  //802.11gn
                wsm16 : [], //802.11an
                wsm64 : []  //802.11ac
            };

            for(var i=0;i<oInfor.Total;i++)
            {
                var oTemp = aData[i];
                var sMode = "2G";
                oInfor.Num2G ++;

                if(oTemp.WirelessMode == "2" || oTemp.WirelessMode == "16" || oTemp.WirelessMode == "64")
                {
                    oInfor.Num5G ++ ;
                    oInfor.Num2G --;
                    sMode = "5G";
                }

                if(!oInfor["wsm" + oTemp.WirelessMode])
                {
                    oInfor["wsm" + oTemp.WirelessMode] = [oTemp];
                }
                else
                {
                    oInfor["wsm" + oTemp.WirelessMode].push(oTemp);
                }
            }
            drawAccessterminal(oInfor);
            var aArpTable = data.aArpTable;
            var aInterfaces = data.aInterfaces;
            var aManualAP = data.aManualAP;
            var wdNum = getwdNum(aArpTable, aInterfaces, aManualAP);
            var oNum = {
                wlNum:aData.length,
                wdNum:wdNum
            }
            Utils.Base.updateHtml($("#terminalNum"), oNum);
            /*****zhong duan lei xing******/
            var oDeviceType = data.oDeviceType[0] || {};
            var aDeviceType = [
                {name:oDeviceType.Top1Type,value:oDeviceType.Top1ClientNum},
                {name:oDeviceType.Top2Type,value:oDeviceType.Top2ClientNum},
                {name:oDeviceType.Top3Type,value:oDeviceType.Top3ClientNum},
                {name:oDeviceType.Top4Type,value:oDeviceType.Top4ClientNum},
                {name:oDeviceType.Top5Type,value:oDeviceType.Top5ClientNum},
                {name:oDeviceType.Top6Type,value:oDeviceType.Top6ClientNum},
                {name:oDeviceType.Top7Type,value:oDeviceType.Top7ClientNum},
                {name:getRcText("OTHERTYPE"),value:oDeviceType.OtherClientNum},
            ];
            drawTerminaltype(aDeviceType);
        },
        error:function(err,status){

        }
    });


    /*function upFlowReq(oInfo)
    {
        var aUserAppUP = Utils.Request.getTableRows (NC.UserApps, oInfo);
        g_aUserAppUP = getTop8(aUserAppUP);        
    }
    function myCallback (oInfo)
    {
        var aTra_Interfaces = Utils.Request.getTableRows (NC.Tra_Interfaces, oInfo)||[];  
        var aInterfaces = Utils.Request.getTableRows (NC.Interfaces, oInfo)||[];
        var aHistoryStatistics = Utils.Request.getTableRows (NC.HistoryStatistics, oInfo)||[];
        var aTemp = getWanInfo(aTra_Interfaces,aInterfaces);
        
        drawOutletflow(aTemp,aHistoryStatistics);
        /!******ying yong liuliang********************!/
        var aUserAppDown = Utils.Request.getTableRows (NC.UserApps, oInfo);
        g_aUserAppDown = getTop8(aUserAppDown);
        drawAppflow(g_aUserAppDown);
        
        /!******jie ru zhong duan***************!/
        var aData = Utils.Request.getTableRows (NC.Stations, oInfo);
            //for test//////////////////////////////////////////////////////
            aData = [];
            var ss = ["1","2","4","8","16","64"];
            for(var i=0;i<1024;i++)
            {
                var oo = {
                    WirelessMode: ss[parseInt(Math.random()*6)],
                };
                aData.push(oo);
            }
            /////////////////////////////////////////////////////////////////////////
        var oInfor = {
            Total : aData.length, 
            Num5G : 0,
            Num2G : 0,
            wsm1 : [],  //802.11b
            wsm2 : [],  //802.11a
            wsm4 : [],  //802.11g
            wsm8 : [],  //802.11gn
            wsm16 : [], //802.11an
            wsm64 : []  //802.11ac
        };
        
        for(var i=0;i<oInfor.Total;i++)
        {
            var oTemp = aData[i];
            var sMode = "2G";
            oInfor.Num2G ++;

            if(oTemp.WirelessMode == "2" || oTemp.WirelessMode == "16" || oTemp.WirelessMode == "64")
            {
                oInfor.Num5G ++ ;
                oInfor.Num2G --;
                sMode = "5G";
            }

            if(!oInfor["wsm" + oTemp.WirelessMode])
            {
                oInfor["wsm" + oTemp.WirelessMode] = [oTemp];
            }
            else
            {
                oInfor["wsm" + oTemp.WirelessMode].push(oTemp);
            }
        }
        drawAccessterminal(oInfor);
        var aArpTable = Utils.Request.getTableRows (NC.ArpTable, oInfo);
        var aInterfaces = Utils.Request.getTableRows (NC.Interfaces, oInfo);
        var aManualAP = Utils.Request.getTableRows (NC.ManualAP, oInfo);
        var wdNum = getwdNum(aArpTable, aInterfaces, aManualAP);
        var oNum = {
            wlNum:aData.length,
            wdNum:wdNum
        }
        Utils.Base.updateHtml($("#terminalNum"), oNum);
        /!*****zhong duan lei xing******!/
        var oDeviceType = Utils.Request.getTableRows (NC.DeviceType, oInfo)[0] || {};
        var aDeviceType = [
                {name:oDeviceType.Top1Type,value:oDeviceType.Top1ClientNum},
                {name:oDeviceType.Top2Type,value:oDeviceType.Top2ClientNum},
                {name:oDeviceType.Top3Type,value:oDeviceType.Top3ClientNum},
                {name:oDeviceType.Top4Type,value:oDeviceType.Top4ClientNum},
                {name:oDeviceType.Top5Type,value:oDeviceType.Top5ClientNum},
                {name:oDeviceType.Top6Type,value:oDeviceType.Top6ClientNum},
                {name:oDeviceType.Top7Type,value:oDeviceType.Top7ClientNum},
                {name:getRcText("OTHERTYPE"),value:oDeviceType.OtherClientNum},
            ];
        drawTerminaltype(aDeviceType);
    }
    var aRequest = [];
    /!********WAN INFO***************!/
    var oTra_Interfaces = Utils.Request.getTableInstance (NC.Tra_Interfaces);
    var oInterfaces = Utils.Request.getTableInstance (NC.Interfaces);
    var oHistoryStatistics = Utils.Request.getTableInstance (NC.HistoryStatistics);
    aRequest.push(oTra_Interfaces,oInterfaces,oHistoryStatistics);
    /!********ying yong liu liang****************!/
    var nTime = new Date();
    var EndTime = nTime.toISOString().split(".")[0];
        nTime = nTime.getTime();
    var StartTime = new Date(nTime - 500000);
        StartTime = StartTime.toISOString().split(".")[0];
    var oUserAppDown = Utils.Request.getTableInstance (NC.UserApps);
    
    oUserAppDown.addFilter ({StartTime:StartTime, EndTime:EndTime, PktDir:1, AddressType:0});
    //aRequest.push(oUserAppUp,oUserAppDown);

    /!********jie ru zhong duan**************!/
    var oStation = Utils.Request.getTableInstance (NC.Stations);
        /!**you xian zhong duan shu liang**!/
    var oArpTable = Utils.Request.getTableInstance (NC.ArpTable);
    var oInterfaces = Utils.Request.getTableInstance (NC.Interfaces);
    var oManualAP = Utils.Request.getTableInstance (NC.ManualAP);
    aRequest.push(oStation,oInterfaces,oManualAP);

    /!****zhong duan lei xing********!/
    var oDeviceType = Utils.Request.getTableInstance (NC.DeviceType);
    aRequest.push(oDeviceType);
    
    Utils.Request.getAll (aRequest, myCallback);

    var oUserAppUp = Utils.Request.getTableInstance (NC.UserApps);
    oUserAppUp.addFilter ({StartTime:StartTime, EndTime:EndTime, PktDir:0, AddressType:0});
    //Utils.Request.getAll (oUserAppUp, upFlowReq);*/
}

function initForm()
{
    $("#sendmsg").on("click", function(){
        $(this).addClass("active");
        $("#recvmsg").removeClass("active");
        drawAppflow(g_aUserAppUP);
    });
    $("#recvmsg").on("click", function(){
        $(this).addClass("active");
        $("#sendmsg").removeClass("active");
        drawAppflow(g_aUserAppDown);
    });
    $("#cloud").on("click", function(){
        var oLocalTime = Utils.Request.getTableInstance(NC.Base);
        oLocalTime.addRows({"LocalTime":"aaaaaa"});
        Utils.Request.action([oLocalTime], {onComplete:reloadPage});
    });
}

function reloadPage()
{
    Utils.Base.refreshCurPage ();
}

function _init ()
{
    NC = Utils.Pages[MODULE_NC].NC;
    initData();
    initForm();
    var opt = {
        type:"topology"
    };
    $("#topology").Panel("init",opt);
}
function _resize (jParent)
{
    if(g_oResizeTimer)
    {
        clearTimeout(g_oResizeTimer);
    }
    g_oResizeTimer = setTimeout(function(){
        g_oLineChart && g_oLineChart.chart && g_oLineChart.resize();
    }, 200);
}

function _destroy()
{
    g_oLineChart = null;
    clearTimeout(g_oTimer);
}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["Echart","Panel","Minput"],
    "utils": [/*"Request",*/ "Device"],
    "subModules": [MODULE_NC]
});

}) (jQuery);