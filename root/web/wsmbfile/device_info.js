(function ($)
{
var MODULE_NAME = "wsmbfile.Device_info";
var NC, MODULE_NC = "wsmbfile.NC";
var g_aAllAPs;

function getRcText(sRcName)
{
    return Utils.Base.getRcString("device_infor_rc", sRcName);
}
function ChangeAPInfo(row, cell, value, columnDef, dataContext, type)
{
    var sUrl;
    if(!value)
    {
        return "";
    }
    if("text" == type)
    {
        return value;
    }
    switch(cell)
    {
        case  0:
           { 
                if(value == "-")
                {
                    return value;
                }
                return "<a class='list-link' type='0' PolicyName='"+dataContext["Name"]+"'>"+dataContext["Name"]+"</a>";
                break;
            }
        case  3:
           { 
                if(value == "-")
                {
                    return value;
                }
                return "<a class='list-link' type='1' PolicyName='"+dataContext["f5ghz"]+"'>"+getRcText("ENABLE").split(",")[dataContext["f5ghz"]]+"</a>";
                break;
            }
        case  4:
           { 
                if(value == "-")
                {
                    return value;
                }
                return "<a class='list-link' type='2' PolicyName='"+dataContext["f2ghz"]+"'>"+getRcText("ENABLE").split(",")[dataContext["f2ghz"]]+"</a>";
                break;
            }
        case  6:
           { 
                if(value == "-")
                {
                    return value;
                }
                return "<a class='list-link' type='3' PolicyName='"+dataContext["history"]+"'>"+dataContext["history"]+"</a>";
                break;
            }
        default:
            break;
    }
    return false;    
}

function onEditApName(oData)
{
    function onSuccess()
    {
         Utils.Pages.closeWindow(Utils.Pages.getWindow($("#ApNameForm")));
         initData();
         return false;
    }

    function onOk()
    {
        var oReqAp = Utils.Request.getTableInstance (NC.RunAP);
        oReqAp.addRows({
            Name : oData.ApName,
            Description : $.trim($("#NewName").val())
        });

        Utils.Request.set ("merge", [oReqAp], {onSuccess:onSuccess});
    }

    $("#changename").form ("init", "edit", {title : getRcText("RENAME_TITLE"),"btn_apply": onOk});
    $("#OldName").html(oData.Name);
    $("#NewName").val("");
    //Utils.Base.openDlg(null, {}, {scope:$("#ApNameDlg"),className:"modal-super"});
}
function getRadioInfor(sCell,oData)
{
    if(sCell == "1")
    {
        return {
            Name : "5GHz(" + oData.RadioNum + ")",
            ID : oData.RadioNum,
            Status :  oData.f5ghz,
            Power : oData.PowerID5
        };
    }
    else
    {
        return {
            Name : "2.4GHz(" + oData.RadioNum + ")",
            ID : oData.RadioNum,
            Status :  oData.f2ghz,
            Power : oData.PowerID2
        };
    }
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
            ApName : oData.Name,
            RadioID : oData.RadioNum,
            Status : $("#Status").MCheckbox("getState") ? "1" : "0"
        });
        Utils.Request.set ("merge", [oReqRadio], {onSuccess:onSuccess});
    }

    var oRadio = getRadioInfor(sCell,oData);
    $("#StatusForm").form("init", "edit", {title : getRcText("STATUS_TITLE"),"btn_apply": onOk});
    $("#ApName").html(oData.Name);
    $("#RadioName").html(oRadio.Name);
    $("#Status").MCheckbox("setState", oRadio.Status == "1");
    Utils.Base.openDlg(null, {}, {scope:$("#StatusDlg"),className:"modal-super"});
}
function onChangeAPInfo()
{
    var jThis = $(this);
    var sApName = jThis.attr("PolicyName");
    var nType = jThis.attr("type");
    var jScope = $("#Opendlg");
    var oApData = $("#ap_info_list").SList("getSelectRow")[0];
    switch(nType)
    {
        case "0":
        {
            $ ("#changename").show();
            var oFormData = {OldApName:sApName};
            $ ("#changename").form ("updateForm", oFormData);
            Utils.Base.openDlg(null, {}, {scope:$("#ApNameDlg"),className:"modal-super dashboard"});
            onEditApName(oApData);
            break;
        }
        case "1":
        {
            onEditStatus(oApData,nType);
            break;
        }
        case "2":
        {
            onEditStatus(oApData,nType);
            break;
        }
        case "3":
        {
            Utils.Base.openDlg(null, {}, {scope:$("#historyinfo"),className:"modal-super dashboard"});
            break;
        }
        default:
            break;
    }
    return false;
}

function initForm()
{
    $("#ap_info_list").on('click', '.list-link', onChangeAPInfo);
//    $("#changename").form ("init", "edit", {"btn_apply": onSubmit, "btn_cancel":onCancel});
            
}
function onDelApInfo(aRowData)
{
    var oManualAP = Utils.Request.getTableInstance (NC.ManualAP);
    for(var i = 0; i < aRowData.length; i++)
    {
        oManualAP.addRows({Name: aRowData[i].Name});
    }
    Utils.Request.set ("remove", [oManualAP], {onSuccess:initData, scope:$("#ap_info_list")}); 
}
function drawApInfo()
{
    var opt = {
            colNames: getRcText ("AP_LABELS"),
            showHeader: true,
            multiSelect: true,
            colModel: [
                {name:'Name', datatype:"String",formatter:ChangeAPInfo},
                {name:'MacAddress', datatype:"String"},
                {name:'Ipv4Address', datatype:"String"},
                {name:'f5ghz', datatype:"String",formatter:ChangeAPInfo},
                {name:'f2ghz', datatype:"String",formatter:ChangeAPInfo},
                {name:'OnlineTime', datatype:"String"},
                {name:'history', datatype:"String",formatter:ChangeAPInfo}
            ],
            buttons:[
                {name: "delete", action: Utils.Msg.deleteConfirm(onDelApInfo)}
            ]
        };
    $("#ap_info_list").SList ("head", opt);
}

function onDelTemplate(aRowData)
{

}

function onOpenAdd(aRowData){

}
function showHistory(row, cell, value, columnDef, oRowData,sType)
{
    if(sType == "text")
    {
        return value;
    }

    return '<a class="list-link">'+ value +'</a>';;
}

function drawWirelessService()
{
    var opt = {
            colNames: getRcText ("W_DEVICE"),
            showHeader: true,
            multiSelect: false,
            colModel: [
                {name:'Name', datatype:"String"},
                {name:'SSID', datatype:"String"},
                {name:'Enable', datatype:"String"}
            ],
            onToggle : {
                action : showHide,
                jScope : $("#toggle_wireless")
            }
        };
    $("#wirelessService").SList ("head", opt);
}

function showHide(oRowdata, jScope)
{
    function myCallback(oInfo)
    {
        var oServiceStatus = Utils.Request.getTableRows(NC.ServiceStatus, oInfo)[0] || {};
        var oServiceTemplates = Utils.Request.getTableRows(NC.ServiceTemplates, oInfo)[0] || {};
        var oServiceSecurity = Utils.Request.getTableRows(NC.ServiceSecurity, oInfo)[0] || {};
        oServiceStatus.total = parseInt(oServiceStatus.ClientNumber5G) + parseInt(oServiceStatus.ClientNumber2G);
        oServiceStatus.toggle_status = oServiceTemplates.Enable;
        var apassword = getRcText("PASSWORD_STATUS").split(",");
        if(oServiceTemplates.Description == 0)
        {
            if(oServiceSecurity.AkmMode == 2)
                oServiceStatus.toggle_access_pwd = apassword[0];
            else
                oServiceStatus.toggle_access_pwd = apassword[1];
        }
        else if(oServiceTemplates.Description == 1)
        {
            if(oServiceSecurity.AkmMode == 2)
                oServiceStatus.toggle_access_pwd = apassword[2];
            else
                oServiceStatus.toggle_access_pwd = apassword[3];
        }
        else
        {
            oServiceStatus.toggle_access_pwd = apassword[4];
        }
        Utils.Base.updateHtml($("#toggle_wireless"),oServiceStatus);
    }
    var oServiceStatus = Utils.Request.getTableInstance (NC.ServiceStatus);
    var oServiceTemplates = Utils.Request.getTableInstance (NC.ServiceTemplates);
    var oServiceSecurity = Utils.Request.getTableInstance (NC.ServiceSecurity);
    oServiceStatus.addFilter({ServiceTemplateName:oRowdata.Name});
    oServiceTemplates.addFilter({Name:oRowdata.Name});
    Utils.Request.getAll ([oServiceStatus,oServiceTemplates], myCallback);
}

function initHideData(){
    
}

function initGrid(){
    drawApInfo();
    drawWirelessService();
}

function getApInfo(aRunAP, aRadio)
{
    var oRunAP = {};
    var aAll = [];
    for(var i = 0; i < aRunAP.length; i++)
    {
        oRunAP[aRunAP[i].Name] = aRunAP[i];
    }
    for(var i = 0; i < aRadio.length; i++)
    {
        if(oRunAP[aRadio[i].ApName])
        {
            var oFlag = {1:true,3:true,4:true,6:true}
            if(oFlag[aRadio[i].Mode])
            {
                oRunAP[aRadio[i].ApName].f2ghz = aRadio[i].Status;
            }
            else
            {
                oRunAP[aRadio[i].ApName].f5ghz = aRadio[i].Status;
            }
        }
    }
    for(key in oRunAP)
    {
        oRunAP[key].history = getRcText("HISTORY_HINT");
        aAll.push(oRunAP[key]);
    }
    return aAll;
}

function initData()
{
    $.ajax({
        url: "../../wnm/device_info.json",
        type: "GET",
        dataType: "json",
        success: function(data){
            var aRunAP = data.aRunAP;
            var aRadioRunningCfg = data.aRadioRunningCfg;
            var aAPInfo = getApInfo(aRunAP, aRadioRunningCfg);
            $("#ap_info_list").SList ("refresh", aAPInfo);

            var aServiceTemplates = data.aServiceTemplates;
            $("#wirelessService").SList ("refresh", aServiceTemplates);

            /*******AC info*************/
            var aInfo = data.aInfo;
            for(var i = 0; i < aInfo.length; i++)
            {
                aInfo[i].DeviceType = aInfo[i].Model ? aInfo[i].Model : aInfo[i].Name;
            }

            var oInfor = {
                "DeviceType" : false,//aInfo[0].Model || aInfo[0].Name
                "HardwareRev" : false,
                "FirmwareRev" : false,
                "SoftwareRev" : false,
                "SerialNumber" : false
            }, bFlag = false;

            for(var i=0;i<aInfo.length;i++)
            {
                bFlag = true;
                for(key in oInfor)
                {
                    oInfor[key] = oInfor[key] || aInfo[i][key];
                    if(!oInfor[key])
                    {
                        bFlag = false;
                    }
                }

                if(bFlag)
                {
                    break;
                }
            }
            Utils.Base.updateHtml($("#version_block"),oInfor);

            var oCloudAccount = data.oCloudAccount||{};
            var oCloudConnect = data.oCloudConnect||{};
            var oCloudMaintainAgent = data.oCloudMaintainAgent||{};
            var oInfor = {
                CloudConnectionState:oCloudAccount.CloudConnectionState,
                AgentName:oCloudMaintainAgent.AgentName,
                LastConnectTime:oCloudConnect.LastConnectTime,
                LastSyncTime:oCloudConnect.LastSyncTime
            }
            //Utils.Base.updateHtml($("#version_block"),oInfor);
        },
        error:function(err,status){

        }
    });
 /*   function myCallback (oInfo)
    {
        var aRunAP = Utils.Request.getTableRows(NC.ManualAP, oInfo);
        var aRadioRunningCfg = Utils.Request.getTableRows(NC.RadioRunningCfg, oInfo);
        var aAPInfo = getApInfo(aRunAP, aRadioRunningCfg);
        $("#ap_info_list").SList ("refresh", aAPInfo);

        var aServiceTemplates = Utils.Request.getTableRows(NC.ServiceTemplates, oInfo);
        $("#wirelessService").SList ("refresh", aServiceTemplates);

        /!*******AC info*************!/
        var aInfo = Utils.Request.getTableRows(NC.DeviceVersionEntities, oInfo);
        for(var i = 0; i < aInfo.length; i++)
        {
            aInfo[i].DeviceType = aInfo[i].Model ? aInfo[i].Model : aInfo[i].Name;
        }

        var oInfor = {
            "DeviceType" : false,//aInfo[0].Model || aInfo[0].Name
            "HardwareRev" : false, 
            "FirmwareRev" : false, 
            "SoftwareRev" : false, 
            "SerialNumber" : false
        }, bFlag = false;

        for(var i=0;i<aInfo.length;i++)
        {
            bFlag = true;
            for(key in oInfor)
            {
                oInfor[key] = oInfor[key] || aInfo[i][key];
                if(!oInfor[key])
                {
                    bFlag = false;
                }
            }

            if(bFlag)
            {
                break;
            }
        }
        Utils.Base.updateHtml($("#version_block"),oInfor);

        var oCloudAccount = Utils.Request.getTableRows (NC.CloudAccount, oInfo)[0]||{};
        var oCloudConnect = Utils.Request.getTableRows (NC.CloudConnect, oInfo)[0]||{};
        var oCloudMaintainAgent = Utils.Request.getTableRows (NC.CloudMaintainAgent, oInfo)[0]||{};
        var oInfor = {
            CloudConnectionState:oCloudAccount.CloudConnectionState,
            AgentName:oCloudMaintainAgent.AgentName,
            LastConnectTime:oCloudConnect.LastConnectTime,
            LastSyncTime:oCloudConnect.LastSyncTime
        }
        //Utils.Base.updateHtml($("#version_block"),oInfor);
    }
    var aRequest = [];
    var oRunAP = Utils.Request.getTableInstance (NC.ManualAP);
    var oRadioRunningCfg = Utils.Request.getTableInstance (NC.RadioRunningCfg);
    aRequest.push(oRunAP,oRadioRunningCfg);
    var oACInfo = Utils.Request.getTableInstance (NC.DeviceVersionEntities);
    var oServiceTemplates = Utils.Request.getTableInstance (NC.ServiceTemplates);
    aRequest.push(oACInfo,oServiceTemplates);
    var oCloudAccount = Utils.Request.getTableInstance (NC.CloudAccount);
    var oCloudConnect = Utils.Request.getTableInstance (NC.CloudConnect);
    var oCloudMaintainAgent = Utils.Request.getTableInstance (NC.CloudMaintainAgent);
    // aRequest.push(oCloudAccount,oCloudConnect,oCloudMaintainAgent);
    Utils.Request.getAll (aRequest, myCallback);*/
}

function _init ()
{
    NC = Utils.Pages[MODULE_NC].NC;
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
    "widgets": ["SList","Minput","Form","Switch"],
    "utils": ["Request","Base"],
    "subModules": [MODULE_NC]
});

}) (jQuery);
