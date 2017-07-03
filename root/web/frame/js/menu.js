
function createMenu(_jContainer, _jTabUl, oNav, pfReadyNotify)
{
    var _aMenuArray = false;
    var _oTabContent = $("#tabContent");
    var _aActive = [];
    var _oNav = $("<ul class='breadcrumb'></ul>").prependTo(oNav);
    var _aUrlTable = false;
    var _sDefaultMenuId = false;
    var _jActivePage = _oTabContent;
    var _bUseTab = true;
    var _sCustomUrl = false;
    var _hTimer = false;
    var _sQuickUrl = "#I_QuickNav";

    var _IconMap = {
        M_System: "icon-menu-system",
        M_QuickNav: "icon-menu-quick",
        M_NetworkCfg: "icon-menu-network",
        M_WirelessCfg: "icon-menu-wireless",
        M_UserManager: "icon-menu-user",
        M_SecurityPolicy: "icon-menu-security",
        M_AppManager: "icon-menu-app",
        M_SystemCfg: "icon-menu-syscfg"
        
    };

/***************************************************************************************/
/* interval methods */

    function _getUrlById(sMenuId)
    {
        return _aUrlTable[sMenuId||_sDefaultMenuId];
    }

    function _loadModule(oUrlInfo)
    {
        // oUrlInfo.url is "ModuleName/[lang]/Page.html"
        var sUrl = _sCustomUrl || oUrlInfo.url;
        var aModId = sUrl.split(/[/.]/);

        sUrl = (aModId.length>3) ? (aModId[0]+"."+aModId[2]) : sUrl;
        Utils.Pages.loadModule(sUrl, null, _jActivePage);
    }

    function _updateModule(oUrlInfo)
    {
        // oUrlInfo.url is "ModuleName/[lang]/Page.html"
        var aModId = oUrlInfo.url.split(/[/.]/);
        var sUrl = (aModId.length>3) ? (aModId[0]+"."+aModId[2]) : oUrlInfo.url;
        Utils.Pages.updateModule(sUrl, {type:"update"}, _jActivePage);
    }

    function _isNewMenuItem(sMenuId)
    {
        var bNewItem = true;
        $.each($("a",_jTabUl), function(i, item)
        {
            if("#"+sMenuId == $(this).attr("href"))
            {
                bNewItem = false;
                return false;
            }
        });

        return bNewItem;
    }

    function _getRcText(oItem, type)
    {
        //type:"Menu","mainFrame" ...
        var oRcMsg = $.MyLocale[type];
        var sId = oItem.id || oItem;
        if(_isHelpId(sId))
        {
            sId = "HELP";
        }

        return oItem.desc || oRcMsg[sId];
    }
    
    function _makeUrlTable(oParent, aMenuData, aUrlInfo)
    {
        if(!aMenuData || aMenuData.length == 0)
        {
            return ;
        }

        for(var i=0; i<aMenuData.length; i++)
        {
            var oData = aMenuData[i];
            oData.parent = oParent;
            
            if(oData.submenu)
            {
                _makeUrlTable(oData, oData.submenu, aUrlInfo);
            }
            else if(oData.tabs)
            {
                _makeUrlTable(oData, oData.tabs, aUrlInfo);
            }
            else
            {
                aUrlInfo[oData.id] = oData;
                if(!_sDefaultMenuId)
                {
                     _sDefaultMenuId = oData.id;
                }
            }
        }
    }

/***************************************************************************************/
/* plugin: menu path */

    function _setWindowTitle (sTitle)
    {
	//var aTitle = [Frame.get("devname")];
        var aTitle = [_getRcText("Device_Name","Menu")];

        var jMenuItems = _jContainer.find("li.active>a");
        for (var i=0; i<jMenuItems.length; i++)
        {
            aTitle.push ($(jMenuItems[i]).text());
        }

        if(sTitle)
        {
            aTitle.push(sTitle);
        }

        document.title = aTitle.join(MyConfig.titleSeperator || " | ");
    }
/***************************************************************************************/
/* menu */

    function _activeMenuItems(oMenuItem)
    {
        while (_aActive.length)
        {
            _aActive.pop().removeClass("active");
        }
        
        var jLink = $("a[href=#"+oMenuItem.id+"]");

        if(jLink.length == 0 )
        {
            var sMenuId = oMenuItem.parent.tabs || [];
            sMenuId = sMenuId[0] || {};
            sMenuId = sMenuId.id || "";

            jLink = $("a[href=#"+sMenuId+"]");
        }

        var jParent = jLink.parent();
        while ((jParent.length>0) && !jParent.is(_jContainer))
        {
            if(jParent.is("li"))
            {
                jParent.addClass("active");
                _aActive.push(jParent);
            }
            jParent  = jParent.parent();
        }
    }

    function _makeSubMenu(aArray, iLevel)
    {
        if(!aArray || aArray.length == 0)
        {
            return ;
        }
        var aClass = ["page-sidebar-menu","first sub-menu","sub-menu","sub-menu","sub-menu"];
        var jUL = $('<ul class=' + '"' + aClass[iLevel] + '"' +'></ul>');

        for (var i = 0; i<aArray.length; i++)
        {
            var oCurItem = aArray[i];
            var jItem = $('<li></li>');
            var jLink = $('<a href="#' + oCurItem.id + '" title="'+_getRcText(oCurItem, "Menu")+'"></a>');

            //TODO:  is need icon ?
            var sIcon = _IconMap[oCurItem.id];
            //var sIcon = "noIcon";

            if (sIcon)
            {
                // add custom menu icon
                $('<i class="menu-icon ' + sIcon + '"></i>').appendTo(jLink);
            }

            // menu node
            if ((oCurItem.submenu) || (oCurItem.tabs && !_bUseTab))
            {
                // add arrow icon
                $('<span class="menu-icon-arrow arrow"></span>').appendTo(jLink);
            }

            // add menu text
            $('<span class="menu-item"></span>')
                .text(_getRcText(oCurItem, "Menu"))
                .appendTo(jLink);

            jItem.append(jLink);

            if (oCurItem.submenu)
            {
                jItem.append(_makeSubMenu(oCurItem.submenu, iLevel+1));
            }

            else if (oCurItem.tabs)
            {
                if ( _bUseTab )
                {
                    // set the last menu-item link to the first tab item
                    jLink.attr("href", '#'+oCurItem.tabs[0].id);
                    jItem.data("tabs", oCurItem.tabs);
                }
                else
                {
                    jItem.append(_makeSubMenu(oCurItem.tabs, iLevel+1));
                }
            }
            jUL.append(jItem);
        }

        return jUL;
    }

    // main entry
    function _makeMenuMain()
    {
        var aMenuArry =  _aMenuArray;
        _jContainer.empty();
        _jContainer.append(_makeSubMenu(aMenuArry, 0));

        _aUrlTable = {};
        _makeUrlTable(null, aMenuArry, _aUrlTable);

        pfReadyNotify && pfReadyNotify();

       /* if(FrameInfo.isRunningCfg == "false")
        {
            window.location = _sQuickUrl;
        }*/
        _onUrlChanged();
    }

/***************************************************************************************/
/* tabs */

    function _createTabs(oUrlData)
    {
        if(!oUrlData)
        {
            return;
        }
        function _makeTabHtml(oTab)
        {
            var jItem = $('<li class="tab-item"></li>');
            var jLink = $('<a href="#' + oTab.id + '"><span></span></a>');

            jLink.find("span").text(_getRcText(oTab, "Menu"));
            jItem.append(jLink);
            _jTabUl.append(jItem);

            if(_isHelpId(oTab.id))
            {
                jLink.on("click", _onHelpClick);
            }
        }

        // remove the old tabs
        _jTabUl.empty();

        if (oUrlData.tabs && oUrlData.tabs.length > 1)
        {
            var aTabs = oUrlData.tabs;
            for (var i=0; i < aTabs.length; i++)
            {
                _makeTabHtml(aTabs[i]);
            }
            $("#layout_center .xb-center-panel").removeClass('no-nav');
            _jTabUl.parent().show();
        }
        else
        {
            _jTabUl.parent().hide();
            $("#layout_center .xb-center-panel").addClass('no-nav');
        }
    }

    function _activeTab(oUrlInfo)
    {
        if (_bUseTab)
        {
            // deActive the old tab
            $(".active", _jTabUl).removeClass("active");

            // active the new tab
            var sMenuId = oUrlInfo.id;
            var jLink = $('a[href="#'+sMenuId+'"]', _jTabUl);
            jLink.parent().addClass("active");
        }

        // load the new page
        _loadModule(oUrlInfo);
        _setWindowTitle ();
    }

function _isHelpId(sMenuId)
{
    return sMenuId.indexOf("_Help") > 0;
}

function _onHelpClick()
{
    var aTemp = this.href.split("#");
    var sMenuId = aTemp[1];
    _showHelp(sMenuId);
    return false;
}

function _showHelp(sMenuId)
{
    var jHelp = $("#help_content");
    var oUrlInfo = _getUrlById(sMenuId);

    sUrl = Frame.Util.getPathUrl(oUrlInfo.url);
    jHelp.load(sUrl, '', function(){jHelp.modal();});

    return false;
}

function _processSpecialUrl(sMenuId)
{
    if(sMenuId.indexOf("debug") == 0)
    {
        if("debug" == sMenuId) sMenuId = "debug.index";
        var sUrl = sMenuId.replace(".", "/") + ".html";
        Utils.Pages.loadModule(sUrl, null, _jActivePage);
        return true;
    }

    if(sMenuId.indexOf("_Help") > 0)
    {
        _showHelp(sMenuId);
        return true;
    }
    
    if (("" == sMenuId ) || ("M_Dashboard"==sMenuId))
    {
    	$("#page_container,#menu_div").addClass("dashboard");
        $("#side_menu ul li").has("a[href=#M_Dashboard]").addClass("active");
    }
    else
    {
    	$("#page_container,#menu_div").removeClass("dashboard");
    }

    return false;
}

/***************************************************************************************/
/* public methods */

    function _init()
    {
        
    }

    function _updatePage(sMenuId)
    {
        var oUrlInfo = _getUrlById(sMenuId);
        if(!oUrlInfo)
        {
            return false;
        }

        // menu-header
        if(oUrlInfo.submenu)
        {
            return true;
        }

        // menu-item
        if(oUrlInfo.tabs)
        {
            oUrlInfo = oUrlInfo.tabs[0];
        }

        _updateModule (oUrlInfo);
        return true;
    }

    function _loadPage(sMenuId)
    {
        if(_processSpecialUrl(sMenuId))
        {
            return true;
        }

        var oUrlInfo = _getUrlById(sMenuId);
        if(!oUrlInfo)
        {
            return false;
        }

        // menu-header
        if(oUrlInfo.submenu)
        {
            return true;
        }

        if (!_bUseTab)
        {
            _activeMenuItems(oUrlInfo);
            _activeTab(oUrlInfo);
            return true;
        }

        // menu-item
        if(oUrlInfo.tabs)
        {
            _activeMenuItems(oUrlInfo);
            _createTabs(oUrlInfo);
            _activeTab(oUrlInfo.tabs[0]);
        }
        else
        {
            // tab-item
            if(_isNewMenuItem(oUrlInfo.id))
            {
                _activeMenuItems(oUrlInfo);
                _createTabs(oUrlInfo.parent || oUrlInfo);
            }
            else if(oUrlInfo.parent)
            {
                _activeMenuItems(oUrlInfo.parent.tabs[0]);
            }

            _activeTab(oUrlInfo);
        }

        _jTabUl.find("li:last").addClass("lastitem");
        $("#global_btns").empty();

        return true;
    }
    
    var g_sCurMenuId = false;
    function parseCurMenuId()
    {
        var sHash  =window.location.hash;
        var sMenuId = sHash.split('?')[0];

        if(sMenuId != "")
        {
            // skip the first char "#"
            sMenuId = sMenuId.substring(1);
        }

        return sMenuId;
    }

    function getCurMenuId()
    {
        if(false === g_sCurMenuId)
        {
            g_sCurMenuId = parseCurMenuId();
        }

        return g_sCurMenuId;
    }

    function isSupport(sMenuId)
    {
        return _aUrlTable[sMenuId] ? true : false;
    }
    function getMenuPath (sMenuId)
	{
		var aPath = [];
		
		// menu is not loaded
		if (!_aUrlTable)
		{
			return "FRAME";
		}
		
		sMenuId = sMenuId || getCurMenuId() || _sDefaultMenuId;
		var oItem = _aUrlTable[sMenuId];
		while (oItem)
		{
			aPath.push(oItem.id);
			
			oItem = oItem.parent;
		}
		aPath.reverse();
		return aPath.join('/');
	}

    function _reFresh()
    {
        _onUrlChanged();
        return;
    }

    function _onUrlChanged()
    {
        var oUrlPara = Utils.Base.parseUrlPara ();
        var sOldMenuId = g_sCurMenuId;
        var sPage = oUrlPara.np;
        g_sCurMenuId = parseCurMenuId();

        if (0 == g_sCurMenuId.indexOf("M_Help."))
        {
            g_sCurMenuId = sOldMenuId;
            return;
        }
        
        Frame.getHelpPanel().close();
        if (sPage)
        {
            $("#page_container,#menu_div").removeClass("dashboard");
            _sCustomUrl = sPage;
        }
               
        _loadPage(g_sCurMenuId);
        _sCustomUrl = false;

        $(window).resize();
    }

/***************************************************************************************/
/* static code */

    Frame.NewMenu = {
        init: _init,
        loadPage: _loadPage,
        getCurMenuId: getCurMenuId,
        isSupport: isSupport,
        getMenuPath: getMenuPath,
        refreshPage: _reFresh
    };

    // Process BACK/FORWORD button on browser, not support IE6/7
    window.onhashchange = _onUrlChanged;

    Frame.regNotify("Menu", "language.changed", function()
    {
        if (!_aMenuArray || _aMenuArray.length == 0)
        {
            return;
        }

        initContainer();
    });

    function initContainer()
    {
        Utils.Base.lockScreen();
        Frame.Signal.waitVar (
            function ()
            {
                return $.MyLocale.Lang ? true : false;
            },
            function ()
            {
                _makeMenuMain();
                Utils.Base.unlockScreen();
            }
        );
    }

    ////{{ local start
    function getFirstChild(xmlNode)
    {
        // node.ELEMENT_NODE == node.nodeType
        return xmlNode.firstElementChild || xmlNode.firstChild;
    }

    function getSibling (xmlNode)
    {
        xmlNode = xmlNode.nextSibling;
        while (xmlNode && (xmlNode.nodeType != xmlNode.ELEMENT_NODE))
        {
            xmlNode = xmlNode.nextSibling;
        }
        return xmlNode;
    }

    function parseNode (node)
    {
        var aMenuData = [];
        while (node)
        {
            // {"id":"M_Dashboard","read":"true","write":"false","execute":"true","url":"sysinfo/[lang]/summary.html"}
            var oNode = {
                "id": node.getAttribute("id"),
                "desc": node.getAttribute($.MyLocale.Lang)
            }

            var sAccess = node.getAttribute("access");
            if (sAccess)
            {
                sAccess = "|" + sAccess + "|";
                oNode["read"] = (-1!=sAccess.indexOf("|read|")) ? "true" : "false";
                oNode["write"] = (-1!=sAccess.indexOf("|write|")) ? "true" : "false";
                oNode["execute"] = (-1!=sAccess.indexOf("|execute|")) ? "true" : "false";
            }

            var sUrl = node.getAttribute("url");
            if (sUrl)
            {
                oNode["url"] = sUrl;
            }
            else
            {
                var aSubData = parseNode (getFirstChild(node));
                var sKey = (aSubData[0]["url"]) ? "tabs" : "submenu";
                oNode[sKey] = aSubData;
            }

            node = getSibling (node);

            aMenuData.push (oNode);
        }
        return aMenuData;
    }

    function toMenuJson (aMenuData)
    {
        var aJsonText = [];

        function makeItemJson (oItem, sIndent, sComma)
        {
            var sFormat = '{"id":"%s", "desc":"%s", "url":"%s"}';
            var sText = Utils.Base.sprintf(sFormat, oItem.id, oItem.desc||"", oItem.url);
            aJsonText.push (sIndent + sText + sComma);
        }

        function makeSubMenuJson (aData, sIndent)
        {
            for (var i=0; i<aData.length; i++)
            {
                var sComma = (i==aData.length-1) ? "" : ",";
                var oItem = aData[i];
                if (oItem.url)
                {
                    makeItemJson (oItem, sIndent, sComma);
                }
                else if (oItem.submenu)
                {
                    var sFormat = '{"id":"%s", "desc":"%s", "submenu":[';
                    var sText = Utils.Base.sprintf(sFormat, oItem.id, oItem.desc||"");
                    aJsonText.push (sIndent + sText);
                    makeSubMenuJson (oItem.submenu, "    "+sIndent);
                    aJsonText.push (sIndent + "]}"+sComma);
                }
                else if (oItem.tabs)
                {
                    var sFormat = '{"id":"%s", "desc":"%s", "tabs":[';
                    var sText = Utils.Base.sprintf(sFormat, oItem.id, oItem.desc||"");
                    aJsonText.push (sIndent + sText);
                    makeSubMenuJson (oItem.tabs, "    "+sIndent);
                    aJsonText.push (sIndent + "]}"+sComma);
                }
            }
        }

        aJsonText.push ("[");
        makeSubMenuJson (aMenuData, "");
        aJsonText.push ("]");

        console.info(aJsonText.join('\r\n'));
    }

    function parseXmlMenu (xmlDoc)
    {
        // xmlDoc.firstChild.firstElementChild.nextElementSibling
        var root = getFirstChild (xmlDoc); // menu-root
        var node = getFirstChild (root);
        var aMenuData = parseNode (node);

        // toMenuJson (aMenuData);

        return aMenuData;
    }
    function arrToObj(arry)
    {
        var obj = {};
        for(var i=0;i<arry.length;i++)
        {
            obj[arry[i].id] = arry[i].tabs || arry[i].submenu;
        }

        // checkNode(obj,"M_ApNode");
        //  checkNode(obj,"M_ApGroup");
        return obj;
    }
    function checkAndMakeMenu()
    {
        Frame.Signal.waitVar (
            function ()
            {
                return $.MyLocale.Lang ? true : false;
            },
            function ()
            {
                _aMenuArray = parseXmlMenu (_aMenuArray);
                initContainer();
            });
    }

    if (true === MyConfig.config.local)
    {
        var bUseXml = true;
        if (bUseXml)
        {
            var sMenuUrl = Frame.Util.getPathUrl("../init/xiaobei/system.xml");
            $.get(sMenuUrl, null, function(aMenuData)
            {
                _aMenuArray = aMenuData;
                checkAndMakeMenu();
            }, "xml");
            return;
        }
        else
        {
            var sMenuUrl = Frame.Util.getDynUrl("menu.php");
            $.getJSON(sMenuUrl, function(aMenuData)
            {
                _aMenuArray = aMenuData;
                if ($.MyLocale.Menu)
                {
                    initContainer();
                }
            });
            return;
        }
    }

    var sMenuUrl = Frame.Util.getDynUrl("menu.j");
    $.getJSON(sMenuUrl, function(aMenuData)
    {
        _aMenuArray = aMenuData;
        if ($.MyLocale.Menu)
        {
            initContainer();
        }
    });
}
