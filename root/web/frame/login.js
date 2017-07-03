var g_oDeviceInfo = {};
var BASE_URL = "../../";
var OEM_BASE = BASE_URL+"web/frame/oem/";

var PageText = {
	curLang: "cn",
	cn:
	{
		change_pswd: ["�޸�����", "�� �� ��", "�� �� ��", "����ȷ��", "ȷ��", "ȡ��", "�������������", "����ȷ���������"],
		confirm_dlg: {title: "���������", ok: "ȷ��", cancel: "ȡ��"},
		login_div:[
		    "����",
			"����������汾���ͣ���ʹ��IE8����µİ汾����",
			"�û���",
			"�����뱾�ع�������",
			"��֤��",
			"ˢ��ͼƬ",
			"ʹ�ұ��ֵ�¼״̬",
			"��¼"
		],
		login_check:["���벻��Ϊ��","��֤���������"],
		net_err: "��¼ʧ�ܣ����������Ƿ���ͨ������%s�����Ƿ�����",
		title:"��¼",
		treeRoot:"All Networks"
	},
	en:
	{
		change_pswd: ["Change Password", "Old Password", "New Password", "Confirm Password", "Apply", "Cancel", "New Password Error", "Confirm Password Error"],
		confirm_dlg: {title: "Change password", ok: "Apply", cancel: "Cancel"},
		login_div:[
			"English",
			"Your browser is not supported, please update to IE8 or more recent.",
			"Username",
			"Password",
			"Verify code",
			"Refresh",
			"Keep me signed in",
			"Login"
		],
		login_check:["UserName cannot empty","Verify code error"],
		net_err: "Login in failed, please check your network, or the %s service is enable",
		title:"Login",
		treeRoot:"All Networks"
	},
	changeLanguage: function(sLang, tar)
	{
		if(!sLang)
		{            
			sLang = ("cn"==this.curLang) ? "cn" : "en";
		}

		var jLang = $("#lang_contrainer");
		var jCurrentA = $("#change_lang li a[data="+sLang+"]", jLang);
		$("#change_lang li a.selected", jLang).removeClass("selected");
		jCurrentA.addClass("selected");
	    document.title = PageText[sLang]["title"];

	    getCopyright(sLang);

		this.curLang = sLang;
		var oText = PageText[sLang][tar];

		$("#"+tar).show().find(".text_lang").each(function(i)
		{
			if("IMG" == this.tagName)
			{
				this.alt = this.title = oText[i];
			}
			else if("INPUT" != this.tagName)
			{
				$(this).html(oText[i]);
			}
			else if(("text" == this.type)||("password" == this.type))
			{
				$(this).attr("placeholder", oText[i]);
			}
		});
	}
};

$.MyLocale = {
	OEM:{}
};

function getCopyright(sLang)
{
    function setCopyright()
    {
        if(!$.MyLocale.OEM[sLang])
        {
            // save to locale
            $.MyLocale.OEM[sLang] = $.MyLocale.OEM;
        }

        var oem = $.MyLocale.OEM = $.MyLocale.OEM[sLang];
        var sCopyright = sprintf(oem.copyright, "", g_oDeviceInfo.year||2014);        
        $("#copyright").html(sCopyright);
    }

    if(!$.MyLocale.OEM[sLang])
    {
        _loadScript (OEM_BASE+g_oDeviceInfo.oem+"/"+sLang+"/config.js", setCopyright);
    }
    else
    {
        setCopyright();
    }
}
function sprintf(sFormat, valuelist)
{
    var arrTmp = new Array();
    for (var j=1; j<arguments.length; j++)
    {
        arrTmp[j-1] = arguments[j];
    }

    var sRet = "";
    var sTemp = sFormat;
    var n = sTemp.indexOf("%");
    for ( var i=0; ((i<arrTmp.length) && (-1!=n)); i++ )
    {
        var sNewChar;
        var ch = sTemp.charAt(n+1);

        switch ( ch )
        {
        case '%':
            sNewChar = "%";
            i--;
            break;
        case 'd':
            sNewChar = parseInt(arrTmp[i]);
            break;
        case 's':
            sNewChar = arrTmp[i];
            break;
        default:
            sNewChar = "%"+ch;
            break;
        }

        sRet += sTemp.substring(0,n) + sNewChar;
        sTemp = sTemp.substring(n+2);
        n = sTemp.indexOf("%");
    }
    sRet += sTemp;
    return sRet;
}
var Cookie = 
{
	get: function (sName)
	{
		// cookies are separated by semicolons
		var aCookie = document.cookie.split("; ");
		for (var i=0; i < aCookie.length; i++)
		{
			// a name/value pair (a crumb) is separated by an equal sign
			var aCrumb = aCookie[i].split("=");
			if (sName == aCrumb[0]) 
			  return unescape(aCrumb[1]||"");
		}
		
		// a cookie with the requested name does not exist
		return null;
	},

    set: function (oPara, retentionDuration)
    {
        var sExpres = "";
        var n = parseInt(retentionDuration);
        if(-1 == n)
        {
            // ���ϻ�
            var date = new Date(2099,12,31);
            sExpres = "expires=" + date.toGMTString();
        }
        else if(n>0)
        {
            var date = new Date();
            date.setTime(date.getTime() + n*3600000);
            sExpres = "expires=" + date.toGMTString();
        }

        for (var sName in oPara)
        {
            var sCookie = sName+"="+escape(oPara[sName])+"; path=/;" + sExpres;
            document.cookie = sCookie;
        }
    },
    del: function(sName)
    {
        var date = new Date();
        date.setTime(date.getTime() - 10000);

        var aTemp = sName.split(",");
        for(var i=0; i<aTemp.length; i++)
        {
            var sCookie = aTemp[i] + "=d; path=/; expires=" + date.toGMTString();
            document.cookie = sCookie;
        }
    }
}

function _loadScript(sJsFile, cb, para)
{
	var obj = document.body ? document.body : document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.setAttribute('src', sJsFile);
	obj.appendChild(script);

	if(document.all) 
	{
		script.onreadystatechange = function() 
		{
			(this.readyState == 'complete' || this.readyState == 'loaded') && cb&&cb(para);
		};
	}
	else 
	{
		script.onload = function(){cb&&cb(para);};
	}
}

function getDynUrl(sUrl)
{
	return BASE_URL + "wnm/" + sUrl;
}

function getBrowserLanguage()
{
	var sLang;

	sLang = Cookie.get("lang");
	if(!sLang)
	{
		sLang = navigator.language || navigator.language || navigator.userLanguage || navigator.systemLanguage || "en";
		sLang = sLang.toLowerCase();
		sLang = (sLang.indexOf("cn")!=-1) ? "cn" : "en";
	}

	return sLang;
}

function getLanguage()
{
	var sLang;

	//������Ҫ�鿴��ǰ��ƷOEM֧�ֵ�����ģʽ
	var sLanguageSupported = OemConfig.getSupportedLang ();
	switch (sLanguageSupported)
	{
		//��֧��һ������
		case "en":
		case "cn":  
			sLang = sLanguageSupported;
			break;

		//֧�ֶ�������
		default:    //�����������Ӣ��˫���ͬ����
			$("#lang_contrainer").show();
			sLang = getBrowserLanguage();
			break;
	}
    Cookie.set({"supportLang": sLanguageSupported});
	return sLang;
}

function refreshVCode()
{
	$("#img_vcode").attr("src", getDynUrl("vcode.bmp?t="+Math.random()));
}

// ajax������
function onAjaxErr()
{
	var sProtocal = window.location.protocol.replace(":", "").toUpperCase();
	var sMsg = PageText[PageText.curLang]["net_err"].replace("%s", sProtocal);
	alert(sMsg);
}

// ��ʾ�޸�����Ի���
function showPswdDlg(oLoginResult)
{
	function onApplyClick()
	{
		var sNewPswd = $("#new_pswd", jChgePwd).val();
		var sCnfPswd = $("#cnf_pswd", jChgePwd).val();
		if(!sNewPswd)
		{
		    $("#pswd_info", jChgePwd).html(oCPText[6]);
		    return;
		}
		if(!sCnfPswd || sNewPswd != sCnfPswd)
		{
		    $("#pswd_info", jChgePwd).html(oCPText[7])
		    return;
		}
		// �ύ���豸�Ͻ����޸�����.
		var oBtn = $(this);
		oBtn.attr("disabled", true);
		
		$.ajax({
			url: getDynUrl("frame/changepswd.php"),
			dataType: "json",
			data: {
				sessionid: oLoginResult.sessionid,
				opswd: $("#old_pswd", jChgePwd).val(),
				npswd: sNewPswd
			},
			success: function (oInfo)
			{
				if (oInfo.ok)
				{
					window.location = oLoginResult.url;
				}
				else 
				{
					$("#pswd_info").html(oInfo.error).addClass("alert-error");
					oBtn.attr("disabled", false);
				}
			},
			error: onAjaxErr
		});
		
		return false;
	};
	function onCancelClick()
	{
		var oBtn = $(this);
		oBtn.attr("disabled", true);

		/* ����Ǽ�������, ��ȡ����������ҳ��. ����رմ���
		 	SESSION_LOGIN_PSWD_NORMAL   0  ����Ҫ�޸����� 
		 	SESSION_LOGIN_PSWD_CHANGE   1  �����ѵ���, �����޸�. ���ȡ���������¼ 
		 	SESSION_LOGIN_PSWD_CONFIRM  2  ���뼴������, ���Բ��޸�, ���ȡ����������� */
		if (2 == oLoginResult.type)
		{
			/* ���뼴������, ���Բ��޸�, ֱ������ */
			window.location = oLoginResult.url;
		}
		else
		{
			/*�����ѵ���, ���ȡ����ťʱ��logout, �ٹرմ���*/
			$.get(getDynUrl("logout.j?sessionid="+oLoginResult.sessionid));
			setTimeout(function()
			{
				/* �ڲ���������Ϲرմ��ڻ�ʧЧ, ����ҳ��û�ж����������ת��һ����ҳ����ʵ�ֵ��ȡ����ı仯 */
				//window.close();
				window.location = PageText.curLang+"/logout.html";
			}, 500);
		}

		return false;
	};
    var jChgePwd = $("#change_pswd");
    var sLang = Cookie.get("lang");
    var oCPText = PageText[sLang]["change_pswd"];
    
    jChgePwd.find(".text_lang").each(function(i)
    {
        $(this).html(oCPText[i]);
    });
    $("#pswd_info", jChgePwd).html(oLoginResult.msg);
    $("#btn_apply", jChgePwd).click(onApplyClick);
    $("#btn_cancel", jChgePwd).click(onCancelClick);
    jChgePwd.modal();
}

function rememberLogin()
{
    var oForm = document.getElementById("loginform");
    Cookie.set({user_name: oForm.user_name.value});
}

function resetTreePara()
{
	var aPath = [{sId:"_TreeRoot",sText:PageText[PageText.curLang].treeRoot}];
	var oNode = {"nodeId":"_TreeRoot"};

	Cookie.set({
		"MenuPath" : JSON.stringify(aPath),
		"TreeNode" : JSON.stringify(oNode)
		});
}

// �����豸�Ϸ��صĵ�¼���
function onLoginEnd(oLoginResult)
{
	if (oLoginResult.error)
	{
		if ("true"===oLoginResult.vcode)
		{
			refreshVCode();
			$("#vcode_cnt").show();
		}
		else
		{
			$("#vcode_cnt").hide();
		}
		$('#err_msg').html(oLoginResult.error);
	}
	else if (oLoginResult.changePswd)
	{
		showPswdDlg(oLoginResult);
	}
	else if (oLoginResult.url)
	{
        if($("#remember_user").hasClass("checked"))
        {
            rememberLogin();
        }
		// ��¼�ɹ�, ��̨�᷵��һ����ת��URL
		window.location = oLoginResult.url;
	}
}

function getQueryPara(sName, def)
{
	var sHref = window.location.href;
	var a = sHref.split('?');
	if (a.length == 1)
	{
		return def;
	}
	
	var s = a[1];
	a = s.split('&');
	for(var i=0; i<a.length; i++)
	{
		var a1 = a[i].split('=');
		if (sName == a1[0])
		{
			return a1[1];
		}
	}
	
	return def;
}
function checkUserName()
{
    if(("" == $("#user_name").val())||($("#user_name").attr("placeholder") == $("#user_name").val()))
    {
        var jError = $('.alert-error', $('.login-form')).show();
        var jMsg = $("span.msg", jError);
        var sMsg = PageText[PageText.curLang]["login_check"][0];

        jMsg.html(sMsg);
        return false;
    }
}

function checkInput (sPassword)
{
	// check the input
	if ("" == sPassword)
	{
		return 0;
	}

	if ( $("#vcode_cnt").is(":visible") && !$.trim($("#vcode").val()))
	{
		return 1;
	}

	return -1;
}

function disableBtn(){
	$("#loginBtn").removeClass("login-enable");
}

function enableBtn(){
	$("#loginBtn").addClass("login-enable");
}

// �����¼��ť�Ĵ���
function onLoginSubmit()
{
	var sPassword = $.trim($("#password").val());
	var nErrId = checkInput (sPassword);
	if (-1 != nErrId)
	{
		var sMsg = PageText[PageText.curLang]["login_check"][nErrId];
		$('#err_msg').html(sMsg);
		return false;
	}

	var sLang = PageText.curLang;
	var oData = {
		user_name: "admin",
		password: sPassword,
		ssl: getQueryPara("ssl", "true"),
		lang:sLang
    }
	if($("#vcode_cnt").is(":visible"))
    {
        oData.vldcode = $.trim($("#vcode").val());
    }	
	
	Cookie.set({"lang": sLang}, 360);
	disableBtn();

	////{{ local start
	if(window.localRun)
	{
		var sMenu = $("#product_list").val();
		sMenu = "60" //wireless
		window.location = BASE_URL + "wnm/frame/index.php?sessionid=abc1234&menu="+sMenu;
		return false;
	}
	////}}

	// �·���¼����
	$.ajax({
		url: getDynUrl("frame/login.php"),
		dataType: "json",
		data: oData,
		success: function(oResult){
			onLoginEnd(oResult);
			enableBtn();
		},
		error: function(){
			onAjaxErr();
			enableBtn();
		}
	});

	return false;
}

// ��ʾloginҳ��
function showLogin()
{
	function _showLoginPage(vcode)
	{		
		if ("true" == vcode)
		{
			refreshVCode ();
			$("#vcode_cnt").show();
		}

		PageText.changeLanguage(PageText.curLang, "login_div");
		$("#user_name").focus(); 
	}
	
	// HTTPS����: ��ʼ�Զ���¼, ��¼�ɹ��Ļ�����ת����ҳ��, ������ʾ��¼ҳ��
	$.ajax({
		url: getDynUrl("frame/login.php"),
		dataType: "json",
		data: {ssl:getQueryPara("ssl", "true"),lang:PageText.curLang},
		success: function(oLoginResult)
		{
			if (oLoginResult.error)
			{
				// �Զ���¼ʧ��, ��ʾ��¼ҳ��
				_showLoginPage(oLoginResult.vcode);
			}
			else if (oLoginResult.changePswd)
			{
				// ��¼�ɹ�, ��̨�᷵��һ����ת��URL
				showPswdDlg(oLoginResult);
			}
			else
			{
				// ��¼�ɹ�, �Ҳ���Ҫ�޸�����, ֱ�ӽ�����ҳ��
				window.location = oLoginResult.url;
			}
		},
		error: onAjaxErr
	});
}

function onInitContent()
{
	function onFlowClick(e)
	{
		clearInterval(oTimer);
		if($(this).hasClass('left'))
		{
			changeAdImg();
		}
		else
		{
			var jAdList = $('#adPanel ul');
			var jItem = $('li',jAdList);
			var nLeft = jItem.width();
			jItem.first().before(jItem.last());
			jAdList.css({left:-nLeft});

			jAdList.animate({left:0},400);
		}

		oTimer = setInterval(changeAdImg,2000);
	}

	function changeAdImg()
	{
		if(!bFlag) return false;

		var jAdList = $('#adPanel ul');
		var jItem = $('li',jAdList);
		var nLeft = jAdList.css('left').replace("px","")*1;
		nLeft -= jItem.width();
		jAdList.animate({left:nLeft},400,function(e){
			var jFirst = $('li',this).first();
			$('li',this).last().after(jFirst);
			$(this).css({left:0});
		});
	}

	var oTimer = setInterval(changeAdImg,2000);
	var bFlag = true;

    $("#adPanel").on('click','.flow-btn',onFlowClick)
    			 .on('mouseenter','ul>li',function(){bFlag = false})
    			 .on('mouseleave','ul>li',function(){bFlag = true});
}

function bindChangeLang()
{
	$("#change_lang a").bind("click", function()
	{
		$("#lang_contrainer .dropdown-toggle").dropdown('toggle');
	    var sLang = $(this).attr("data");
		PageText.changeLanguage(sLang, "login_div");
		$("#user_name").focus(); 
		return false;
	});
}
function bindRefreshVCode()
{
	$("#img_vcode").bind("click", function(){refreshVCode();return false;});

}
// ҳ���ʼ��
function onPageInit()
{
	PageText.curLang = getLanguage();
	onInitContent();
    /*bindChangeLang();*/
	bindRefreshVCode();
    $("#loginBtn").on("click", function(){
    	if($(this).hasClass('login-enable'))
    	{
    		onLoginSubmit();
    	}

    	return false;
    });
	$("#password").attr("placeholder",PageText[PageText.curLang]["login_div"][3])
				  .focus()
				  .keydown(function(e){
					if(e.keyCode == 13)
					{
						$("#loginBtn").click();
					}
				});
	$("#vcode").attr("placeholder",PageText[PageText.curLang]["login_div"][4])
				  .keydown(function(e){
					if(e.keyCode == 13)
					{
						$("#loginBtn").click();
					}
				});
}

function initLanguage()
{
	PageText.curLang = getBrowserLanguage();
}

function checkBroswer()
{
	var bIsIE = $.browser.msie;
    var ver = parseFloat($.browser.version);
    var isNotSupport = function()
    {
        if(bIsIE && (ver <= 6))
        {
            return true;
        }
        
        return false;
    };
    
    // if the browser is not supported, show the message, but allow user continue.
    if(isNotSupport())
    {
        $("#browser_not_support").show();
        $("#loginform").hide();
    }
}

function getConfig(pfCallback)
{
	$.ajax({
		url: getDynUrl("check.j"),
		dataType: "json",
		success: function(oDevInfo)
		{
			g_oDeviceInfo = oDevInfo;
			_loadScript (OEM_BASE+oDevInfo.oem+"/config.js", pfCallback);
		},
		error: onAjaxErr
	});
}

function onMyLoad()
{
	initLanguage();
	checkBroswer();
	getConfig(onPageInit);
}

var Login = function () {

    return {
        //main function to initiate the module
        init: function () 
        {
            // handleLogin();
            onMyLoad();
        },
        resize: function (nHeight)
        {
        	var sClass = "height_1";
        	if (nHeight < 480)
        	{
        		sClass = "height_2";
        	}
        	else if (nHeight < 790)
        	{
        		sClass = "height_3";
        	}
        	else if (nHeight < 1024)
        	{
        		sClass = "height_4";
        	}
        	$("body").removeClass("height_1 height_2 height_3 height_4").addClass (sClass);
        }
    };

}();

$(window).resize(function ()
{
	Login.resize($(window).height());
})
