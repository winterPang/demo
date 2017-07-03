(function ($)
{
var MODULE_NAME = "wsmbfile.ws_aps";
var NC, MODULE_NC = "wsmbfile.NC";
var g_oAllAPs;

function getRcText(sRcName)
{
    return Utils.Base.getRcString("ws_aps_rc", sRcName);
}

function setMaxPower(oAP,oRadio,fDoSet)
{
    //Step A
    var tChannel = Utils.Request.getTableInstance (NC.ChannelTypeMap);
    var tAntenna = Utils.Request.getTableInstance (NC.AntennaDB);

    tChannel.addFilter({
        "RadioMode" : oRadio.Mode,
        "Bandwidth" : oRadio.Bandwidth,
        "Channel" : oRadio.Channel
    });

    tAntenna.addFilter({
        "ModelName" : oAP.Model,
        "RadioID" : oRadio.ID
    });
    Utils.Request.getAll ([tChannel,tAntenna],function(OA){
        //Step B
        var oAntenna = Utils.Request.getTableRows (NC.AntennaDB, OA)[0] || {};
        var oChannel = Utils.Request.getTableRows (NC.ChannelTypeMap, OA)[0] || {};
        var tPowerIndex = Utils.Request.getTableInstance (NC.PowerIndex);
        tPowerIndex.addFilter({
            "ModelName":oAP.Model,
            "RadioID":oRadio.ID,
            "RadioMode":oRadio.Mode,
            "AntennaType":oAntenna.AntennaType,
            "RegionCode":oAP.RegionCode,
            "ChannelType":oChannel.ChannelType
        });
        Utils.Request.getAll ([tPowerIndex], function(OB){
            //Step C
            var oIndex = Utils.Request.getTableRows (NC.PowerIndex, OB)[0] || {};
            var tPowerDb = Utils.Request.getTableInstance (NC.PowerDB);
            tPowerDb.addFilter({"PowerIndex":oIndex.PowerIndex,"ChannelType":oIndex.ChannelType});
            Utils.Request.getAll ([tPowerDb],function(OC){
                //Step D
                var oPower = Utils.Request.getTableRows (NC.PowerDB, OC)[0] || {};
                fDoSet(oPower.ValidMaxPower);
            });
        });
    });
}

function onEditPower(oData,sCell){
    function onSuccess()
    {
         Utils.Pages.closeWindow(Utils.Pages.getWindow($("#PowerForm")));
         initData();
    }

    function onOk()
    {
        var oReqRadio = Utils.Request.getTableInstance (NC.RadioOfManualAP);
        var nPower = $("input[name=PowerLevel]").MRadio("getValue");
        if(nPower == "2")
        {
            setMaxPower(oData,oRadio,function(max){
                oReqRadio.addRows({
                    ApName : oData.ApName,
                    RadioID : oRadio.ID,
                    CfgMaxPower : max
                });
                Utils.Request.set ("merge", [oReqRadio], {onSuccess:onSuccess});
            });
        }
        else
        {
            oReqRadio.addRows({
                ApName : oData.ApName,
                RadioID : oRadio.ID,
                CfgMaxPower : ((nPower*1+1)*8-nPower)
            });
            Utils.Request.set ("merge", [oReqRadio], {onSuccess:onSuccess});
        }
    }

    var oRadio = getRadioInfor(sCell,oData);
    $("#PowerForm").form("init", "edit", {title : getRcText("POWER_TITLE"),"btn_apply": onOk});
    $("#PowerRadio").html(oRadio.Name);
    $("#PowerAP").html(oData.ApName);
    $("input[name=PowerLevel]").MRadio("setValue", oRadio.Power);

    Utils.Base.openDlg(null, {}, {scope:$("#PowerDlg"),className:"modal-super"});
}

function onEditStatus(oData,sCell){
    function onSuccess()
    {
         Utils.Pages.closeWindow(Utils.Pages.getWindow($("#StatusForm")));
         initData();
    }

    function onOk()
    {
        var oReqRadio = Utils.Request.getTableInstance (NC.RadioOfManualAP);
        oReqRadio.addRows({
            ApName : oData.ApName,
            RadioID : oRadio.ID,
            Status : $("#Status").MCheckbox("getState") ? "1" : "0"
        });
        Utils.Request.set ("merge", [oReqRadio], {onSuccess:onSuccess});
    }

    var oRadio = getRadioInfor(sCell,oData);
    $("#StatusForm").form("init", "edit", {title : getRcText("STATUS_TITLE"),"btn_apply": onOk});
    $("#StatusAP").html(oData.ApName);
    $("#StatusRadio").html(oRadio.Name);
    $("#Status").MCheckbox("setState", oRadio.Status == "1");
    Utils.Base.openDlg(null, {}, {scope:$("#StatusDlg"),className:"modal-super"});
}

function onEditApName(oData,sCell)
{
    function onSuccess()
    {
         Utils.Pages.closeWindow(Utils.Pages.getWindow($("#ApNameForm")));
         initData();
    }

    function onOk()
    {
        var oReqAp = Utils.Request.getTableInstance (NC.ManualAP);
        oReqAp.addRows({
            Name : oData.ApName,
            Description : $.trim($("#NewAP").val())
        });

        Utils.Request.set ("merge", [oReqAp], {onSuccess:onSuccess});
    }

    $("#ApNameForm").form("init", "edit", {title : getRcText("RENAME_TITLE"),"btn_apply": onOk});
    $("#OldAP").html(oData.ApName);
    $("#NewAP").val("");
    Utils.Base.openDlg(null, {}, {scope:$("#ApNameDlg"),className:"modal-super"});
}

function onEditAp()
{
    var sCell = $(this).attr("cell"), sApName = $(this).attr("ap");
    var oApData = g_oAllAPs[sApName];
    var aFun = [onEditApName,onEditStatus,function(){},onEditPower,onEditStatus,function(){},onEditPower];
    aFun[sCell](oApData,sCell);
}

function showApData(row, cell, value, columnDef, dataContext, type)
{
    value = value || ""

    if("text" == type)
    {
        return value;
    }

    return '<a class="list-link" cell="'+cell+'" ap="'+dataContext.ApName+'">'+value+'</a>';
   
}

function getRadioInfor(sCell,oData)
{
    var oRadio = {};
    if(sCell < 4)
    {
        oRadio.Name = "5GHz(" + oData.RadioID5 + ")";
        sCell = "5";
    }
    else
    {
        oRadio.Name = "2.4GHz(" + oData.RadioID2 + ")";
        sCell = "2";
    }

    oRadio.ID = oData.["RadioID"+sCell];
    oRadio.Status = oData.["Status"+sCell];
    oRadio.Power = oData.["Power"+sCell];
    oRadio.Mode = oData.["Mode"+sCell];
    oRadio.Bandwidth = oData.["Bandwidth"+sCell];

    return oRadio;
}

function makeRadioData(aRadio,aAp)
{
    var oAll = {}, aAll = [];
    var aRcStasus =getRcText("STATUS").split(',');
    var aPowerLevel = getRcText("POWER_LEVEL").split(",");
    for(var i=0;i<aRadio.length;i++)
    {
        var oRadio = aRadio[i],sApName = oRadio.ApName;

        //****************************************************
        //for test
        oRadio.CfgMaxPower = Math.random()*30;
        oRadio.Status = parseInt(Math.random()*2);
        oRadio.CfgChannel = parseInt(Math.random()*150);
        //****************************************************

        var nLevel = parseInt(oRadio.CfgMaxPower);

        if(!oAll[sApName])
        {
            oAll[sApName] = {
                ApName : sApName
            };
            aAll.push(oAll[sApName]);
        }

        if(nLevel < 12) nLevel = 0;
        else if(nLevel < 18) nLevel = 1;
        else nLevel = 2;

        //1,3,4,6 is 2.4GHz
        //2,5,7 is 5GHz
        if(oRadio.Mode == "2" || oRadio.Mode == "5" || oRadio.Mode == "7")
        {
            oAll[sApName].RadioID5 = oRadio.RadioID;
            oAll[sApName].Status5 = aRcStasus[oRadio.Status];
            oAll[sApName].StatusID5 = oRadio.Status;
            oAll[sApName].Channel5 = oRadio.CfgChannel;
            oAll[sApName].Power5 = aPowerLevel[nLevel];
            oAll[sApName].PowerID5 = nLevel;
            oAll[sApName].Mode5 = oRadio.Mode;
            oAll[sApName].Bandwidth5 = oRadio.Bandwidth;
        }
        else
        {
            oAll[sApName].RadioID2 = oRadio.RadioID;
            oAll[sApName].Status2 = aRcStasus[oRadio.Status];
            oAll[sApName].StatusID2 = oRadio.Status;
            oAll[sApName].Channel2 = oRadio.CfgChannel;
            oAll[sApName].Power2 = aPowerLevel[nLevel];
            oAll[sApName].PowerID2 = nLevel;
            oAll[sApName].Mode2 = oRadio.Mode;
            oAll[sApName].Bandwidth2 = oRadio.Bandwidth;
        }
    }

    for(var i=0;i<aAp.length;i++)
    {
        var oAp = aAp[i];
        if(oAll[oAp.Name])
        {
            oAll[oAp.Name].ApName = oAp.Description || oAp.Name;
            $.extend(oAll[oAp.Name],oAp);
        }
    }

    g_oAllAPs = oAll;
    return aAll;
}

function initData(jScope)
{
    function myCallback (oInfo)
    {
        var aRadio = Utils.Request.getTableRows (NC.RadioOfManualAP, oInfo);
        var aAp = Utils.Request.getTableRows (NC.ManualAP, oInfo);
        var aAllAp = makeRadioData(aRadio,aAp);

        $("#apList").SList ("refresh", aAllAp);
    }


    var oReqRadio = Utils.Request.getTableInstance (NC.RadioOfManualAP);
    var oReqAp = Utils.Request.getTableInstance (NC.ManualAP);
    Utils.Request.getAll ([oReqRadio,oReqAp], myCallback);
}

function initGrid()
{
    var optAp = {
        colNames: getRcText ("AP_HEADER"),
        multiSelect: false,
        colModel: [
            {name:'ApName', datatype:"String",formatter:showApData},
            {name:'Status5', datatype:"String",formatter:showApData},
            {name:'Channel5', datatype:"String",formatter:showApData},
            {name:'Power5', datatype:"String",formatter:showApData},
            {name:'Status2', datatype:"String",formatter:showApData},
            {name:'Channel2', datatype:"String",formatter:showApData},
            {name:'Power2', datatype:"String",formatter:showApData}
        ]
    };

    $("#apList").SList ("head", optAp);
    $("#apList").on('click', 'a.list-link', onEditAp);
}

function _init ()
{
    NC = Utils.Pages[MODULE_NC].NC;
    initGrid();
    initData();
}

function _resize(jParent)
{
}

function _destroy()
{
	console.log("ws-aps is destory");
}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["SList","SingleSelect","Minput","Form"],
    "utils": ["Request","Base"],
    "subModules": [MODULE_NC]
});

}) (jQuery);
