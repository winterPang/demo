(function ($)
{
var MODULE_NAME = "wsmbfile.changename";
var NC, MODULE_NC = "wsmbfile.NC";
var g_aAllAPs;

function initForm()
{
	$("#ChangeApInfo").form("init","edit", {"btn_apply":onsubmit,"btn_cancel":onCancel});
}
function _init ()
{
    NC = Utils.Pages[MODULE_NC].NC;
    // initGrid();
    // initData();
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
    "widgets": ["SList"],
    "utils": ["Request","Base"],
    "subModules": [MODULE_NC]
});

}) (jQuery);