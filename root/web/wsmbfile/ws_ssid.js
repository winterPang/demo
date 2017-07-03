(function ($)
{
var MODULE_NAME = "wsmbfile.ws_ssid";
var NC, MODULE_NC = "wsmbfile.NC";
var g_Radios, g_PercentMax = 100;

function getRcText(sRcName)
{
    return Utils.Base.getRcString("ws_ssid_rc", sRcName);
}

function showSSID(oRowdata, sName){

    function onCancel()
    {
        jFormSSID.form("updateForm",oRowdata);
        $("input[type=text]",jFormSSID).each(function(){
            Utils.Widget.setError($(this),"");
        });
        return false;
    }

    function onSubmitSSID()
    {
        //Step 4:success
        function onSuccess()
        {
            if(sName == "add")
            {
                Utils.Pages.closeWindow(Utils.Pages.getWindow(jFormSSID));
            }
            Utils.Base.refreshCurPage();
        }

        //Step 3:enable the ST,Bind to AP
        function onEnableSt()
        {
            var oTemplate = Utils.Request.getTableInstance (NC.ServiceTemplates);
            var oReqBWG = Utils.Request.getTableInstance(NC.BandwidthGuarantee);
            var aReq = [], aRadio = g_Radios;

            if(sName == "add")
            {
                var oReqBind = Utils.Request.getTableInstance (NC.ServiceBindings);
                for (i=0;i<aRadio.length;i++)
                {
                   oReqBind.addRows ({
                        ApName : aRadio[i].ApName ,
                        RadioId : aRadio[i].RadioID,
                        ServiceTemplateName : sStName
                    });
                }
                aReq.push(oReqBind);
            }

            if(oStData.Percent)
            {
                for(var i=0;i<aRadio.length;i++)
                {
                    oReqBWG.addRows ({
                        ApName : aRadio[i].ApName ,
                        RadioID : aRadio[i].RadioID,
                        ServiceTemplateName : sStName,
                        Percent : oStData.Percent
                    });
                }
                aReq.push(oReqBWG);
            }

            oTemplate.addRows ({"Name":sStName, "Enable":"true"});
            aReq.push(oTemplate);
            Utils.Request.set ("merge", aReq, {onSuccess:onSuccess});
        }

        //step 2:config the security
        function onSecCfg()
        {
            var tSecReq = Utils.Request.getTableInstance (NC.ServiceSecurity);
            var tAuthent = Utils.Request.getTableInstance (NC.Layer2Authentication);
            var sSecType = "0";

            //get security type
            if(StType == "1")
            { 
                sSecType = $("input[name=AccPwdStaff]").MRadio("getValue");
            }
            else if(StType == "2")
            {
                sSecType = $("input[name=AccPwdCorpo]").MRadio("getValue");
            }
            else if(StType == "3")
            {
                sSecType = "2";
            }


            //set Security Mode and Authentication Mode
            var oAuthenData = {
                ServiceTemplateName: sStName,
                AuthenticationMode: "0",
                Dot1xMandatoryDomain : Frame.Util.generateID("MD").replace("_","")
            };
            var oSecData = {
                Name : sStName,
                WpaIeSelected : "true",
                RsnIeSelected : "true",
                TkipSelected : "true",
                CcmpSelected : "true",
                Wep40Selected : "false",
                Wep104Selected : "false",
                Wep128Selected : "false",
                AkmMode : sSecType
            };

            if(sSecType == "0")
            {
                tSecReq.addRows ({"Name" : sStName});
                Utils.Request.set ("remove", [tSecReq], {onSuccess:onEnableSt,showSucMsg:false});
                Utils.Request.set ("merge", [tAuthent], {onSuccess:$.noop,showSucMsg:false});
            }
            else if(sSecType == "1")
            {   
                oAuthenData.AuthenticationMode = "3";
                tSecReq.addRows (oSecData);
                tAuthent.addRows (oAuthenData);
                Utils.Request.set ("merge", [tSecReq,tAuthent], {onSuccess:onEnableSt,showSucMsg:false});
            }else if(sSecType == "2")
            {

                oSecData.PskInputMode = "1";
                oSecData.PskPassPhraseKey = oStData.PskPassPhraseKey;
                tSecReq.addRows (oSecData);
                tAuthent.addRows (oAuthenData);
                Utils.Request.set ("merge", [tSecReq,tAuthent], {onSuccess:onEnableSt,showSucMsg:false});
            }
        }

        //Step 1:disable the ST,merge other Config
        function onBasicCfg()
        {
            var oBasicReq = Utils.Request.getTableInstance (NC.ServiceTemplates);

            oBasicReq.addRows ({
                "Name" : sStName,
                "Enable" : "false",
                "Description" : StType,
                "SSID" : oStData.SSID,
                "UserIsolation" : oStData.UserIsolation
            });

            Utils.Request.set (sType, [oBasicReq], {onSuccess:onSecCfg,showSucMsg:false});
        }
        var oTempTable = {
            index:[],
            column:["SSID","UserIsolation","PskPassPhraseKey","Percent"]
        };
        var oStData = jFormSSID.form ("getTableValue", oTempTable);
        var StType = $("input[name=StType]").MRadio("getValue");

        onBasicCfg();
    }

    var jFormSSID = $("#toggle_form"), sType, sStName;
    var CurrentPercent = oRowdata || {};
    CurrentPercent = CurrentPercent.Percent || 0;
    CurrentPercent = g_PercentMax + CurrentPercent*1;
    $("#percentMax").html(CurrentPercent);
    $("#Percent").attr("max",CurrentPercent);
    CurrentPercent >= 1 ? $("#Percent_Block").show() : $("#Percent_Block").hide();
    if(sName == "add") //Add
    {
        sType = "create";
        sStName = Frame.Util.generateID("ST");
        var jDlg = $("#AddSsidDlg");
        if(jDlg.children().length)
        {
            $("#ssidToggle").show().insertAfter($(".modal-header",jDlg));
        }
        else
        {
            $("#ssidToggle").show().appendTo(jDlg);
        }

        jFormSSID.form("init", "edit", {"title":getRcText("ADD_TITLE"),"btn_apply": onSubmitSSID});
        jFormSSID.form("updateForm",{
            SSID : "",
            StType : "1",
            UserIsolation : "false"
        });
        $("input[type=text]",jFormSSID).each(function(){
            Utils.Widget.setError($(this),"");
        });
        Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-super"});
    }
    else //Edit
    {
        sType = "merge";
        sStName = oRowdata.Name;
        jFormSSID.form ("init", "edit", {"btn_apply": onSubmitSSID, "btn_cancel":onCancel});
        jFormSSID.form("updateForm",oRowdata);
        $("input[type=text]",jFormSSID).each(function(){
            Utils.Widget.setError($(this),"");
        });
    }
}

function onDelSSID(oData)
{
    var oTemplate = Utils.Request.getTableInstance (NC.ServiceTemplates);
    var oBind = Utils.Request.getTableInstance (NC.ServiceBindings);
    var aRadio = g_Radios;
    for (var i=0;i<aRadio.length;i++)
    {
        oBind.addRows ({
            ApName : aRadio[i].ApName ,
            RadioId : aRadio[i].RadioID,
            ServiceTemplateName : oData.Name
        });
    }
    oTemplate.addRows({Name:oData.Name});
    Utils.Request.set ("remove", [oBind,oTemplate], {onSuccess: Utils.Base.refreshCurPage});
}

function makeStData(aSt,aSec,aAuthen,aBwg){
    var mapBwg = {}, mapSec = {}, mapAuthen = {};

    for(var i=0;i<aAuthen.length;i++)
    {
        if(!mapAuthen[aAuthen[i].ServiceTemplateName])
        {
            mapAuthen[aAuthen[i].ServiceTemplateName] = aAuthen[i].Dot1xMandatoryDomain || "";
        }
    }

    for(var i=0;i<aSec.length;i++)
    {
        if(!mapSec[aSec[i].Name])
        {
            mapSec[aSec[i].Name] = aSec[i].AkmMode || "0";
        }
    }

    for(var i=0;i<aBwg.length;i++)
    {
        if(!mapBwg[aBwg[i].ServiceTemplateName])
        {
            mapBwg[aBwg[i].ServiceTemplateName] = aBwg[i].Percent || "";
        }
    }

    for(i=0;i<aSt.length;i++)
    {
        var oTemp = aSt[i];
        oTemp.StType = oTemp.Description || "1";
        oTemp.Percent =  mapBwg[oTemp.Name];
        oTemp.Domain = mapAuthen[oTemp.Name];
        oTemp.AccPwdCorpo = mapSec[oTemp.Name];
        oTemp.AccPwdStaff = mapSec[oTemp.Name];
        g_PercentMax -= oTemp.Percent || 0;
    }
}

function checkBWGS(aBwgs,aRadio){
    if((aBwgs[0] || {}).Status == "1")
    {
        return ;
    }

    var oReqBWGS = Utils.Request.getTableInstance (NC.GuaranteeStatus);

    for(var i=0;i<aRadio.length;i++)
    {
        oReqBWGS.addRows({
            "ApName" : aRadio[i].ApName,
            "RadioID" : aRadio[i].RadioID,
            "Status" : "1"
        });
    }

    Utils.Request.set ("merge", [oReqBWGS], {onSuccess:$.noop,showSucMsg:false});
}

function initData(jScope)
{
    function myCallback (oInfo)
    {
        var aSt = Utils.Request.getTableRows (NC.ServiceTemplates, oInfo);
        var aSec = Utils.Request.getTableRows (NC.ServiceSecurity, oInfo);
        var aAuthen = Utils.Request.getTableRows (NC.Layer2Authentication, oInfo);
        var aSt = Utils.Request.getTableRows (NC.ServiceTemplates, oInfo);
        var aRadio = Utils.Request.getTableRows (NC.RadioOfManualAP, oInfo);
        var aBWG = Utils.Request.getTableRows (NC.BandwidthGuarantee, oInfo);
        var aBWGS = Utils.Request.getTableRows (NC.GuaranteeStatus, oInfo);

        checkBWGS(aBWGS,aRadio);
        makeStData(aSt,aSec,aAuthen,aBWG);
        g_Radios = aRadio;

        $("#ssidList").SList ("refresh", aSt);
    }

    var tSTemplate = Utils.Request.getTableInstance (NC.ServiceTemplates);
    var tSecyrity = Utils.Request.getTableInstance (NC.ServiceSecurity);
    var tAuthent = Utils.Request.getTableInstance (NC.Layer2Authentication);
    var tReqRadio = Utils.Request.getTableInstance (NC.RadioOfManualAP);
    var tReqBWG = Utils.Request.getTableInstance (NC.BandwidthGuarantee);
    var tReqBWGS = Utils.Request.getTableInstance (NC.GuaranteeStatus);
    Utils.Request.getAll ([tSTemplate,tSecyrity,tAuthent,tReqRadio,tReqBWG,tReqBWGS], myCallback);
}

function initGrid()
{
    var optSsid = {
        colNames: getRcText ("SSID_HEADER"),
        multiSelect: false,
        colModel: [
            {name:'SSID', datatype:"String"},
            {name:'AuthenType', datatype:"String"}
        ],
        onToggle : {
            action : showSSID,
            jScope : $("#ssidToggle"),
            BtnDel : {
                show : true,
                action : onDelSSID
            }
        },
        buttons:[
            {name: "add", action: showSSID}
        ]
    };
    $("#ssidList").SList ("head", optSsid);

    $(".switch,#impose_auth").bind("minput.changed",function(e,data){
        var sClass = $(this).attr("ctrlBlock");
        this.checked ? $(sClass).show() : $(sClass).hide() ;
    });

    $("input:[name=StType],input[name=AccPwdStaff]").bind("change",function(){
        var aContent = $(this).attr("content");
        var sCtrlBlock = $(this).attr("ctrlBlock") || "";
        $(sCtrlBlock).hide();

        if(!aContent) return true;

        aContent = aContent.split(",");
        for(var i=0;i<aContent.length;i++)
        {
            if(!aContent[i])continue;
            $(aContent[i]).show();
        }
        $("input:[name=AccPwdCorpo]").MRadio("setValue",'2',true);
        $("input:[name=AccPwdStaff]").MRadio("setValue",'2');
    });

    $("input:[name=AccPwdCorpo]").bind("change",function(){
        var jEle = $("#PskPassPhraseKey").val("");
        if(this.value == "0")
        {
            jEle.prop('disabled',true);
            jEle.nextAll('label.info-explain').hide().last().show();
        }
        else
        {
            jEle.prop('disabled',false);
            jEle.nextAll('label.info-explain').hide().first().show();
        }
        Utils.Widget.setError($("#PskPassPhraseKey"),"");
    });
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
    g_PercentMax = 100;
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
