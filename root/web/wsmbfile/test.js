(function ($)
{
var MODULE_NAME = "wsmbfile.test";
var NC, MODULE_NC = "wsmbfile.NC";
var g_ClientInfor;

function getRcText(sRcName)
{
    return Utils.Base.getRcString("device_infor_rc", sRcName);
}

function initData()
{
    function myCallback (oInfo)
    {
        var aTemplate = Utils.Request.getTableRows (NC.Template, oInfo);
        $("#wirelessDevice").SList ("refresh", aTemplate);

        var opt = {
            type:"port-list",
            data:[
                {"Name":"LAN1","State":'0'},
                {"Name":"LAN2","State":'1'},
                {"Name":"LAN3","State":'1'},
                {"Name":"LAN4","State":'0'},
                {"Name":"WAN1","State":'1'}
            ],
            onSelect :function(oData){console.log(oData)}
        };
        $("#portList").Panel("init",opt);
    }

    var oTemplate = Utils.Request.getTableInstance (NC.Stations);
    Utils.Request.getAll ([oTemplate], myCallback);
}

function myToggle(oRowdata, jScope)
{
    var jForm = $("#bind_ap_form",jScope);
    var jDiv = $("#single_block",jScope);
    var jRadio = $("input[type=radio][name=bindVlan]",jScope);
    return "0";
}

function onOpenAdd(aRowData)
{
    var ss = aRowData;
}

function onDelTemplate(aRowData)
{
    var ss = aRowData;
}

function initGrid()
{
    var opt = {
        showHeader: true,
        multiSelect: false,
        colNames: getRcText ("W_DEVICE"),
        /*onToggle: {
            action: myToggle,
            jScope: $("#myToggle")
        },*/
        colModel: [
            {name: "Name", datatype: "String"},
            {name: "SSID", datatype: "String"},
            {name: "Enable", datatype: "String"}
        ],
        buttons:[
            {name: "open", action: onOpenAdd},
            {name: "delete", action: Utils.Msg.deleteConfirm(onDelTemplate)}
        ]
    };
    $("#wirelessDevice").SList ("head", opt);
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
}
Utils.Pages.regModule (MODULE_NAME, {
    "init": _init,
    "destroy": _destroy,
    "resize": _resize,
    "widgets": ["SList","Panel"],
    "utils": ["Request"],
    "subModules": [MODULE_NC]
});

}) (jQuery);
