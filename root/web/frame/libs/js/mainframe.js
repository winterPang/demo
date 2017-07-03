var Frame = {};
var Utils = {};

$.MyLocale = {};

function getPageWidth()
{
    return $("body").width();
}

/*****************************************************************************
@FuncName, Class, menuBar
@DateCreated: 2013-06-08
@Author: 
@Description: process menu
@Usage:
@ParaIn:
@Return: 
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
function MenuBar()
{
    this.initMenu = initMenu;
	this.resizeMenu = resize;

    var resizeCount = 0;
    var oTimer  = null;

    function onToggleMenu(e)
    {
        var jEle = $(this);
        var jLogo = $('.xb-layout-north.logo-panel .logo-bar .logo-icon');
        if(jEle.hasClass('menu-close'))
        {
            $("#block").animate({ 
                width: "90%",
                height: "100%", 
                fontSize: "10em", 
                borderWidth: 10
              }, 1000 );

            var jParent = jEle.parent().parent().animate({width:200},200);
            jLogo.parent().animate({width:200},200,function(){
                jLogo.removeClass('small-logo');
            });
            $('ul>li>a>span',jParent).fadeIn(200);
            $("#layout_center").animate({"left":"200px"},200);
            jEle.removeClass('menu-close');
        }
        else
        {
            var jParent = jEle.parent().parent().animate({width:100},200);
            jLogo.parent().animate({width:100},200,function(){
                jLogo.addClass('small-logo');
            });
            $('ul>li>a>span',jParent).fadeOut(200);
            $("#layout_center").animate({"left":"100px"},200);
            jEle.addClass('menu-close');
        }
        $(window).resize();
    }

    function onMenuClick(e)
    {
        var sMenuId = $(this).attr("href");
        var hasChanged = !!$("#tabContent .app-box .form-actions:visible").length;
        if(hasChanged && sMenuId.search(Frame.NewMenu.getCurMenuId()) == -1)
        {
            Frame.Msg.confirm($.MyLocale.SKIP_CONFIRM, {
                onOK : function(){window.location = sMenuId;},
                sId : "form_modify_confirm"
            });
        }

        return !hasChanged;
    }

    function onFlowMenu(e)
    {
        var jContent = $('#side_menu');
        var jMenu = $('.page-sidebar-menu',jContent);
        var nTop = jMenu.css('marginTop').replace('px',"")*1;
        var bIsUp = $(this).hasClass('down');
        var nGap = jContent.height()-jMenu.height();

        nGap = nGap > 0 ? 0 : nGap;
        bIsUp ? (nTop -= 78*2) : (nTop += 78*2);
        nTop  = nTop > 0 ? 0 : (nTop < nGap ? nGap : nTop);

        jMenu.animate({marginTop:nTop+'px'},200);
    }

    function resize()
    {
        var jContent = $('#side_menu');
        var jMenu = $('.page-sidebar-menu',jContent);

        if(jMenu.children('li').css("marginBottom") != '40px' && resizeCount < 10)
        {
            oTimer && clearTimeout(this.oTimer);
            oTimer = setTimeout(resize,200);
            resizeCount ++;
            return false;
        }

        resizeCount = 0;

        if(jMenu.height() < jContent.height())
        {
            $('.menu-ctrl').fadeOut(100);
            jContent.css({bottom:0});
            jMenu.animate({marginTop:0+'px'},200);
        }
        else
        {
            $('.menu-ctrl').fadeIn(100);
            jContent.css({bottom:'12px'});
        }
    }

	function initMenu()
	{
        // add events
        $('#side_menu .page-sidebar-menu')
            .on('click', 'li > a', onMenuClick);
        $('#menu_toggle span').unbind('click').bind('click',onToggleMenu);
        $('.menu-ctrl').off('click.menuCtrl').on('click.menuCtrl',onFlowMenu);
    }
}

var Tablet = {
    resize: function()
    {
        //summary view
        var jPageCont = $("#tabContent");
        //echart
        $(".myEchart", jPageCont).each(function(index,item){
            var jEle = $(this);
            if(jEle.is(":visible"))
            {
                jEle = $(this).data("instance");
                jEle && jEle.chart && jEle.resize();
            }
        });

    },
    init: function (bOpened)
    {
        
    },
    openNewPage: function()
    {
        
    },
    closeNewPage: function()
    {
        
    },
    onBodyClick: function(e)
    {

    }
}

var DeskPC = {
    resize: function()
    {
        var nScreenWidth = getPageWidth();
        var w = 200;
        $("#menu_div").width(w);
        var w2 = (nScreenWidth - w)/2;
        $("#edit_div").width(w2);
        $("#summary_div").width(w2);
    },
    init: function ()
    {
        $("#menu_div").show();
        $("#summary_div").show();
        $("#edit_div").show();

        MyConfig.MList.selectMode = "pc";
    },
    openNewPage: function()
    {
        $("#edit_div").show();
    },
    closeNewPage: function()
    {
        $("#edit_div").hide();
    },
    onBodyClick: function(e)
    {
        
    }
}

function UserBar()
{
    function onLogout()
    {
        Frame.Msg.confirm($.MyLocale.LOGOUT_CONFIRM, function(){Frame.logout();});
        return false;
    }

    function onPassWord()
    {
        Utils.Base.openDlg("wsmbfile.changepassword", {}, {className:"modal-large"});
        return false;
    }

    function onService()
    {
        alert("Not avaliable.");
    }

    function onItemClick(e)
    {
        var sIndex = $(this).attr("index");
        var pfMap = [onLogout,onPassWord,onService];
        pfMap[sIndex]();
    }

    function toggleUserMenu(e)
    {
        function show()
        {
            jMenu.slideDown(200);
            $('body').on('click.usermenu',hide);
        }
        function hide()
        {
            jMenu.slideUp(200);
            jMenu.prev().removeClass("active");
            $('body').off('click.usermenu');
        }

        var jMenu = $(this).next('ul');
        $(this).toggleClass('active');
        jMenu.is(':visible') ? hide() : show();

        e.stopPropagation();
    }

    function initUser()
    {
        $("#user_menu").unbind('click').bind('click',toggleUserMenu);
        $("#drop_list").off('click').on('click','li',onItemClick);
    }

    this.initUser = initUser;
}

/*****************************************************************************
@FuncName, Class, MainFrame
@DateCreated: 2013-06-08
@Author: 
@Description: process main MainFrame
@Usage:
@ParaIn:
@Return: 
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
function MainFrame()
{
	var _oMenuBar = new MenuBar();
    var _oUsetrBar = new UserBar();
    var _oCurDevice = false;
    var _bOpened = false;

    function onNewPageOpen()
    {
        _bOpened = true;
        _oCurDevice.openNewPage();
    }

    function onNewPageClose()
    {
        _bOpened = false;
        _oCurDevice.closeNewPage();
    }

    function onNewPageResize()
    {
        _oCurDevice.resize();
    }

    function onBodyClick(e)
    {
        _oCurDevice.onBodyClick(e);
    }

    function onMenuReady()
    {
       _oMenuBar.initMenu();
       _oUsetrBar.initUser();
    }

    function onMenuResize()
    {
        _oMenuBar.resizeMenu();
    }

    function getDeviceByWidth()
    {
        var oDevice;
        var nScreenWidth = getPageWidth();

        /*if(nScreenWidth >= MyConfig.Layout.width2)
        {
        }
        else if(nScreenWidth >= MyConfig.Layout.width1)
        {
            oDevice = Mobile; // Tablet
        }
        else
        {
            oDevice = Mobile;
        }*/

            oDevice = Tablet; //DeskPC;
        if(_oCurDevice != oDevice)
        {
            oDevice.init(_bOpened);
            _oCurDevice = oDevice;
        }

        return oDevice;
    }

    function doResize()
    {
        getDeviceByWidth();
        _oCurDevice.resize($(window).height());
        Frame.notify("all", "resize");
    }

    function initResize()
    {
        var oTimer;
        var oScrn = document.documentElement;
        var oOldScrn = {"width": oScrn.clientWidth, "height": oScrn.clientHeight};

        $(window).resize(function() 
        {
            if((oOldScrn.height == oScrn.clientHeight) && (oOldScrn.width == oScrn.clientWidth))
            {
                return;
            }

            oOldScrn = {"width": oScrn.clientWidth, "height": oScrn.clientHeight};

            if (oTimer) 
            {
                clearTimeout(oTimer);
            }
            oTimer = setTimeout(function() {doResize();}, 200);
        });
    }

    function initFrameCenter()
    {
        var _jFrame = $('.page-sidebar-fixed ');
        var bIsIE8 = isIE8Browser();
        if(bIsIE8)
        {
            _jFrame.addClass("ie8");
        }

        function isIE8Browser()
        {
            var bIE8 = false;
            if($.browser.msie && (parseInt($.browser.version) == 8))
            {
                bIE8 = true;
            }
            return bIE8;
        }    
    }

    Frame.regNotify("newPage", "open", onNewPageOpen);
    Frame.regNotify("newPage", "close", onNewPageClose);
    Frame.regNotify("newPage", "resize", onNewPageResize);
    Frame.regNotify("menu", "resize", onMenuResize);

    $("body").addClass("page-header-fixed page-sidebar-fixed page-footer-fixed");
    $(".header").removeClass("navbar-static-top").addClass("navbar-fixed-top");

    initFrameCenter();
    initResize();
    doResize();

    $("body").on("click", onBodyClick);

    createMenu($("#side_menu"), $("#frame_tablist"), $("#frame_nav"), onMenuReady);

    Frame.init();
}

var g_oMainFrame;

/*****************************************************************************
@FuncName, private, documentReady
@DateCreated: 2013-06-08
@Author: 
@Description: main entry
@Usage:
@ParaIn:
@Return: 
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
jQuery(document).ready(function() 
{
    /*Frame.set("isRunningCfg",'true' == "true");
    Frame.set("WorkMode",3);*/
    g_oMainFrame = new MainFrame();
});

