(function ($)
{
var MODULE_NAME = "wsmbfile.Net_info";
//var NC, MODULE_NC = "wsmbfile.NC";
var g_aAllAPs;
var g_oDHCPAlloc=[];

function getRcText(sRcName)
{
    return Utils.Base.getRcString("net_info_rc", sRcName);
}

function buildAddr (row, cell, value, columnDef, dataContext, sType)  
{
    return (dataContext.CID ? dataContext.CID : dataContext.HAddress);
}
/*function onDelDhcpInfo(aRowData)
{
    var oDHCPServerIpInUse = Utils.Request.getTableInstance (NC.DHCPServerIpInUse);
    for(var i = 0; i < aRowData.length; i++)
    {
        oDHCPServerIpInUse.addRows({PoolIndex: aRowData[i].PoolIndex,Ipv4Address:aRowData[i].Ipv4Address});
    }
    Utils.Request.set ("remove", [oDHCPServerIpInUse], {onSuccess:initData, scope:$("#dhcp_service_list")}); 
}*/
function drawDhcpService()
{
    var opt = {
            colNames: getRcText ("DHCP_LABELS"),
            showHeader: true,
            multiSelect: true,
            colModel: [
                {name:'HAddress', datatype:"String"},
                {name:'Ipv4Address', datatype:"String"},
                {name:'DeviceType', datatype:"String"},
                {name:'EndLease', datatype:"String"}
            ],
            buttons:[
                {name: "delete"/*, action: Utils.Msg.deleteConfirm(onDelDhcpInfo)*/}
            ]
        };
    $("#dhcp_service_list").SList ("head", opt);
}

/*function onDelUnanthorAp(aRowData)
{
    var oApUnAuths = Utils.Request.getTableInstance (NC.ApUnAuths);
    for(var i = 0; i < aRowData.length; i++)
    {
        var VsdName = aRowData[i].VsdName;
        var MacAddress = aRowData[i].MacAddress;
        var aSensorName = aRowData[i].SensorName.split(",");
        for(var j = 0; j < aApName.length; i++)
        {
            var oTmp = {
                VsdName:VsdName,
                MacAddress:MacAddress,
                SensorName:aSensorName[j]
            }
            oApUnAuths.addRows(oTmp);
        }
    }
    Utils.Request.set ("remove", [oApUnAuths], {onSuccess:initData, scope:$("#unanthorized_ap_list")}); 
}*/

function drawUnanthorizedAp()
{
    var opt = {
            colNames: getRcText ("UNAUTH_AP"),
            showHeader: true,
            multiSelect: true,
            colModel: [
                {name:'MacAddress', datatype:"String"},
                {name:'Ipv4Address', datatype:"String"},
                {name:'SensorName', datatype:"String"},
                {name:'Action', datatype:"String"},
                {name:'Count', datatype:"String"},
                {name:'LastReportTime', datatype:"String"}
            ],
            buttons:[
                {name: "delete"/*, action: Utils.Msg.deleteConfirm(onDelUnanthorAp)*/}
            ]
        };
    $("#unanthorized_ap_list").SList ("head", opt);
}
/*function onDelUnanthorizedAgent(aRowData)
{

}*/
function drawUnanthorizedAgent()
{
    var opt = {
            colNames: getRcText ("UNAUTH_AGENT"),
            showHeader: true,
            multiSelect: true,
            colModel: [
                {name:'MacAddress', datatype:"String"},
                {name:'Ipv4Address', datatype:"String"},
                {name:'LastReportTime', datatype:"String"}
            ],
            buttons:[
                {name: "delete"/*, action: Utils.Msg.deleteConfirm(onDelUnanthorizedAgent)*/}
            ]
        };
    $("#unanthorized_agent_list").SList ("head", opt);
}

function drawWanInfo()
{
    var opt = {
            colNames: getRcText ("WAN_LABELS"),
            showHeader: true,
            multiSelect: false,
            colModel: [
                {name:'AbbreviatedName', datatype:"String"},
                {name:'Description', datatype:"String"},
                {name:'OperStatus', datatype: "String"},
                {name:'InOctets', datatype:"String"},
                {name:'PortLayer', datatype:"String"}
            ],
            onToggle : {
                action : showHideInfo,
                jScope : $("#wan_toggle")
            }
        };
    $("#wan_info_list").SList ("head", opt);
}

function showHideInfo(oRowdata , jScope)
{
   /* function myCallback(oInfo)
    {
        var oDHCPAlloc = Utils.Request.getTableRows(NC.DHCPAlloc, oInfo);
        var type = getRcText("WAN_TYPE").split(",");
        if(oDHCPAlloc.AllocEnable == "true")
            oDHCPAlloc.AllocEnable = type[2];
        Utils.Base.updateHtml($("#wan_toggle"),oDHCPAlloc);
    }*/
    if((oRowdata.InetAddressIPV4) && (oRowdata.InetAddressIPV4Mask))
    {
        oRowdata.AllocEnable = getRcText("WAN_TYPE").split(",")[1];
        Utils.Base.updateHtml($("#wan_toggle"),oRowdata);
    }
    else
    {

        var oDHCPAlloc = g_oDHCPAlloc;
        var type = getRcText("WAN_TYPE").split(",");
        if(oDHCPAlloc.AllocEnable == "true")
            oDHCPAlloc.AllocEnable = type[2];
        Utils.Base.updateHtml($("#wan_toggle"),oDHCPAlloc);
        /*var oDHCPAlloc = Utils.Request.getTableInstance (NC.DHCPAlloc);
        oDHCPAlloc.addFilter({IfIndex:oRowdata.IfIndex});
        Utils.Request.getAll ([oDHCPAlloc], myCallback);*/
    }
}


function getDHCPData(aMacRules, aManualAP, aIpInUse, aInterfaces, aArpTable)
{
    var type = getRcText("DEVICE_TYPE").split(",");
    var oIpInUse = {};
    for(var i = 0; i < aIpInUse.length; i++)
    {
        var HAddress = aIpInUse[i].HAddress.split("-").join();
        oIpInUse[HAddress] = aIpInUse[i];
    }

    for(var i = 0; i < aManualAP.length; i++)
    {
        var Mac = aManualAP[i].CfgMacAddress.split("-").join();
        if(oIpInUse[Mac])
        {
            oIpInUse[Mac].DeviceType = type[0];
        }
    }
    for(var i = 0; i < aMacRules.length; i++)
    {
        var Mac = aMacRules[i].MacAddr.split("-").join();
        if((oIpInUse[Mac])&&(!oIpInUse[Mac].DeviceType))
        {
            oIpInUse[Mac].DeviceType = aMacRules[i].DeviceType
        }
    }

    var oInter = {};
    var aInter = [];    
    for(var i = 0; i < aInterfaces.length; i++)
    {
        oInter[aInterfaces[i].IfIndex] = aInterfaces[i].IfIndex;
    }
    for(var i = 0; i < aArpTable.length; i++)
    {
        if(oInter[aArpTable[i].IfIndex])
        {
            aInter.push(aArpTable[i]);
        }
    }
    var aAll = [];
    for(var i = 0; i < aInter.length; i++)
    {
        var Mac = aInter[i].MacAddress.split("-").join();
        if((oIpInUse[Mac])&&(!oIpInUse[Mac].DeviceType))
        {
            oIpInUse[Mac].DeviceType = type[1];
        }
    }
    for(key in oIpInUse)
    {
        aAll.push(oIpInUse[key]);
    }
    return aAll;
}

function getWanInfo(aInterfaces,aStatistics)
{
    var oAll = {};
    for(var i = 0; i < aInterfaces.length; i++)
    {
        if(aInterfaces[i].Name.search("GigabitEthernet") != -1)
            oAll[aInterfaces[i].Name] = aInterfaces[i];
    }
    for(var i = 0; i < aStatistics.length; i++)
    {
        var sTmp = aStatistics[i].Name;
        if(oAll[sTmp])
        {
            oAll[sTmp] = $.extend(oAll[sTmp],aStatistics[i]);
        }
    }
    var aAll = [];
    for(key in oAll)
    {
        oAll[key].OperStatus = getRcText("WAN_STSTUS").split(",")[oAll[key].OperStatus];
        oAll[key].PortLayer = getRcText("WAN_MODE");
        aAll.push(oAll[key]);
    }
    return aAll;
}

function getUnAuthAPInfo(aManualAP, aApUnAuths)
{
    var oData = {};
    for(var i =0 ; i < aApUnAuths.length; i++)
    {
        var sTmp = aApUnAuths[i].MacAddress;
        if(!oData[sTmp])
        {
            oData[sTmp] = aApUnAuths[i];
            oData[sTmp].Count = 1;
        }
        else
        {
            oData[sTmp].SensorName = oData[sTmp].SensorName + "," + aApUnAuths[i].SensorName;
            oData[sTmp].Count++;
        }
    }
    var aData = [];
    for(i = 0; i < aManualAP.length; i++)
    {
        if(oData[aManualAP[i].Name])
        {
            oData[aManualAP[i].Name].CfgMacAddress = aManualAP[i].CfgMacAddress;
            aData.push(oData[aManualAP[i].Name]);
        }
    }
    return aData;
}

function initData()
{
    $.ajax({
        url: "../../wnm/net_info.json",
        type: "GET",
        dataType: "json",
        success: function(data){
            g_oDHCPAlloc= data.oDHCPAlloc;
            var aArpTable = data.aArpTable;
            var aInterfaces = data.aInterfaces;
            var aStatistics = data.aStatistics;
            var aIpInUse = data.aIpInUse;
            var aManualAP = data.aManualAP;
            var aRunAP = data.aRunAP;
            var aApUnAuths = data.aApUnAuths;
            var aMacRule = data.aMacRule;

            var aTemplate = getWanInfo(aInterfaces,aStatistics);
            $("#wan_info_list").SList ("refresh", aTemplate);

            var aTemplate = getDHCPData(aMacRule, aManualAP, aIpInUse, aInterfaces, aArpTable);
            $("#dhcp_service_list").SList ("refresh", aIpInUse);

            var aTemplate = getUnAuthAPInfo(aManualAP, aApUnAuths);
            /* for text */
            for(var i = 0; i < 3; i++)
            {
                var oTemp = {
                    MacAddress:"22-33-44-55-66-" + i,
                    Ipv4Address:"192.168.0." + i,
                    SensorName:"ap" + i,
                    Action:"HotspotAP",
                    Count:"" + (i + 1),
                    sen:"ssssss",
                    LastReportTime:"10:10:10"
                }
                aTemplate.push(oTemp);
            }
            /* end */
            $("#unanthorized_ap_list").SList ("refresh", aTemplate);

            $("#unanthorized_agent_list").SList ("refresh", aTemplate);
        },
        error:function(err,status){
            alert(err);
        }
    });
   /* function myCallback (oInfo)
    {
        var aArpTable = Utils.Request.getTableRows (NC.ArpTable, oInfo);
        var aInterfaces = Utils.Request.getTableRows(NC.Interfaces, oInfo);
        var aStatistics = Utils.Request.getTableRows(NC.Statistics, oInfo);
        var aIpInUse = Utils.Request.getTableRows(NC.IpInUse, oInfo);
        var aManualAP = Utils.Request.getTableRows(NC.ManualAP, oInfo);
        var aRunAP = Utils.Request.getTableRows(NC.RunAP, oInfo);
        var aApUnAuths = Utils.Request.getTableRows(NC.ApUnAuths, oInfo);
        var aMacRule = Utils.Request.getTableRows(NC.MacRule, oInfo);

        var aTemplate = getWanInfo(aInterfaces,aStatistics);
        $("#wan_info_list").SList ("refresh", aTemplate);

        var aTemplate = getDHCPData(aMacRule, aManualAP, aIpInUse, aInterfaces, aArpTable);
        $("#dhcp_service_list").SList ("refresh", aIpInUse);

        var aTemplate = getUnAuthAPInfo(aManualAP, aApUnAuths);
        /!* for text *!/
        for(var i = 0; i < 3; i++)
        {
            var oTemp = {
                MacAddress:"22-33-44-55-66-" + i,
                Ipv4Address:"192.168.0." + i,
                SensorName:"ap" + i,
                Action:"HotspotAP",
                Count:"" + (i + 1),
                sen:"ssssss",
                LastReportTime:"10:10:10"
            }
            aTemplate.push(oTemp);
        }
        /!* end *!/
        $("#unanthorized_ap_list").SList ("refresh", aTemplate);

        $("#unanthorized_agent_list").SList ("refresh", aTemplate);
    }

    var oIpInUse = Utils.Request.getTableInstance (NC.IpInUse);
    var oManualAP = Utils.Request.getTableInstance (NC.ManualAP);
    var oRunAP = Utils.Request.getTableInstance (NC.RunAP);
    //var oApUnAuths = Utils.Request.getTableInstance (NC.ApUnAuths);
    var oMacRule = Utils.Request.getTableInstance (NC.MacRule);
    var oArpTable = Utils.Request.getTableInstance (NC.ArpTable);
    var oInterfaces = Utils.Request.getTableInstance (NC.Interfaces);
        oInterfaces.addFilter({"PortLayer":"2"});
    var oStatistics = Utils.Request.getTableInstance (NC.Statistics);
    //var oStation = Utils.Request.getTableInstance (NC.Stations);
    Utils.Request.getAll ([oManualAP,oRunAP,oMacRule,oArpTable,oInterfaces,oStatistics,oIpInUse], myCallback);
    */
}

function initGrid(){
    drawWanInfo();
    drawDhcpService();
    drawUnanthorizedAp();
    drawUnanthorizedAgent();
}

function _init ()
{
   // NC = Utils.Pages[MODULE_NC].NC;
    initGrid();
    initData();
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
    "widgets": ["SList"],
    "utils": [/*"Request",*/"Base"]
    //"subModules": [MODULE_NC]
});

}) (jQuery);
