(function ($)
{
var MODULE_NAME = "wsmbfile.systemsetting";
var NC, MODULE_NC = "wsmbfile.NC";
var g_jForm;

function getRcText(sRcName)
{
    return Utils.Base.getRcString("systemsetting_rc", sRcName);
}
function onSubmit()
{
	
}
function initForm()
{
	g_jForm.form("init", "edit", {"btn_apply":onSubmit});
}
function _init ()
{
    NC = Utils.Pages[MODULE_NC].NC;
    g_jForm = $("#warningid");
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
    "widgets": ["EditList","Form","SList"],
    "utils": ["Request","Base"],
    "subModules": [MODULE_NC]
});

}) (jQuery);
