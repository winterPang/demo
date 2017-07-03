;(function($)
{
    var UTILNAME = "Panel"
   // var NC = Utils.Pages["Frame.NC"].NC_Panel;
    var MyLocal = $.MyLocale.panel;
   
    function PortList(jPanel,opt)
    {
        var _option = $.extend({
            onSelect : function(){},
            selected : false,
            disabled : false
        }, opt);
        var _jPanel = jPanel, _jList;

        function _resize()
        {

        }

        function _disabled(value)
        {
            value ? _jList.addClass("disabled") : _jList.removeClass("disabled");
        }

        function _getPort()
        {
            var oPortData  = {};
            $('li',_jList).each(function(){
                if($(this).hasClass('active'))
                {
                    oPortData = $(this).data('portData');
                    return false;
                }
            });
            return oPortData;
        }

        function _setPort(ifIndex)
        {
            if(typeof ifIndex !== "number" && typeof ifIndex !== "string")
            {
                throw new Error('Paramenter Error');
                return false;
            }

            $('li',_jList).removeClass("active").each(function(){
                if($(this).attr("ifIndex") == ifIndex)
                {
                    $(this).addClass("active");
                    return false;
                }
            });
        }

        function _create(aPort)
        {
            var nBoderWidth = 15/*margin-left*/+1/*margin-right*/+2*2/*boder*/;
            var nLength = 0;
            _jPanel.addClass('port-panel').empty();
            _jList = $('<ul class="port-list"></ul>').appendTo(_jPanel);
            if(_option.disabled)
            {
                _jList.addClass("disabled");
            }

            for(var i=0;i<aPort.length;i++)
            {
                var oMode = aPort[i];
                var sName = oMode.AbbreviatedName;

                if(sName.search('GE') == -1) continue;

                nLength ++;
                sName = parseInt(sName.split("\/")[2]);

                if(sName <= 4)
                    sName = "LAN" + sName;
                else
                    sName = "WAN" + sName;

                
                var jItem = $('<li ifIndex="'+oMode.IfIndex+'"></li>').data('portData',oMode).appendTo(_jList);
                jItem.append('<i></i><span class="port-icon"></span><span>'+sName+'</span>');
                if(i === 0 && !_option.selected)
                {
                    jItem.addClass('active');
                }
                if(_option.selected && oMode.IfIndex == _option.selected)
                {
                    jItem.addClass("active");
                }

                if(oMode.OperStatus == "1")
                {
                    jItem.addClass('online');
                }
            }

            _jList.width(nBoderWidth + nLength*(48/*item-width*/+14/*margin-right*/));

            _jList.on('click','li',function(e){
                var jEle = $(this);

                if(jEle.hasClass('active')) return false;
                if(jEle.parent().hasClass("disabled")) return false;

                jEle.parent().children('li.active').removeClass('active');
                jEle.addClass('active');

                _option.onSelect && _option.onSelect(jEle.data("portData"));
                _jList.trigger("change");
            });
        }

        function _getPortInfor(){
            $.ajax({
                url: "../../wnm/panel.json",
                type: "GET",
                dataType: "json",
                success: function(data){
                    var aPortList = data.aPortList;
                    _create(aPortList);
                },
                error:function(err,status){
                    alert(err);
                }
            });
            /*function myCallback(oInfor){
                var aPortList = Utils.Request.getTableRows (NC.PortInfor, oInfor);
                _create(aPortList);
            }
            var oPortInfor = Utils.Request.getTableInstance (NC.PortInfor);
            Utils.Request.getAll ([oPortInfor], myCallback);*/
        }

        _getPortInfor();

        function _destroy()
        {

        }

        this.resize = _resize;
        this.getPort = _getPort;
        this.setPort = _setPort;
        this.disabled = _disabled;
        this.destroy = _destroy;

    }

    function Topology(jPanel,opt)
    {
        var _options = $.extend(opt,{warnNum: 0, errNum : 0});
        var _jPanel = jPanel, _jMain, _jTipBox, _DataObj, _oTimer;
        var _HtmlMaker = {
            Cloud :function (){
                if(_DataObj.isIconTip)
                {
                    return '<p class="infor-child">'+MyLocal.CloudOff+'</p>';
                }
                return  '<p class="infor-child">'
                        +MyLocal.State+MyLocal.Connected
                        +'</p><p class="infor-child">'
                        +MyLocal.Account+_DataObj.CloudName+'</p>';
            },
            Net : function (){
                if(_DataObj.isIconTip)
                {
                    return '<p class="infor-child">'+MyLocal.NetOff+'</p>';
                }
            },
            AC : function (){
                return '<p class="infor-child">CPU : '+_DataObj.CPU+'%</p><p class="infor-child">'+MyLocal.memory+" : "+_DataObj.Memory+'%</p>';
            },
            AP : function (){
                var aOffAP = _DataObj.OffAP, nNum = _DataObj.OffAPNum, aHtml = [];
                aHtml.push('<p class="infor-child">'+MyLocal.Warning+'</p>');
                aHtml.push('<p class="infor-child">'+nNum+MyLocal.APOff+'</p>');
                aHtml.push('<p class="infor-child">'+MyLocal.OffAP+'</p>');

                //for tese
                aOffAP = []
                for(var i=0;i<nNum;i++)
                {
                    var oDate = new Date(2015, 9, 1, 0, Math.round(Math.random()*1000));
                    aOffAP.push({
                        Name : "ap-" + i,
                        Time : oDate.toLocaleDateString() + oDate.toLocaleTimeString()
                    });
                }

                for(var i=0;i<nNum;i++)
                {
                    var string = MyLocal.OffInfor.replace("%name",aOffAP[i].Name).replace("%time",aOffAP[i].Time);
                    aHtml.push('<p class="infor-child">'+string+'</p>');
                }

                if(nNum > 7)
                {
                    $(".tool-bar",_jTipBox).show();
                }

                return aHtml.join("");
            },
            Count : function (){
                return '<p class="infor-child">'+MyLocal.APCount+_DataObj.APNum+'</p>';
            }
        };

        function _create()
        {
           /* if(Frame.get("WorkMode") == "2")
            {
                _jPanel.addClass("brige");
            }*/
            _jPanel.addClass('topology-panel');


            //main
            _jMain = $('<div class="topology"></div>').appendTo(_jPanel);
            var oIconMode = [
                {className:"hide hover-trigger cloud", type:"Cloud"},
                {className:"hide hover-trigger network", type:"Net"},
                {className:"hide hover-trigger ac", type:"AC"},
                {className:"hide topo-icon cloud", type:"Cloud"},
                {className:"hide topo-icon network", type:"Net"},
                {className:"hide topo-icon ac", type:"AC"},
                {className:"hide topo-icon ap", type:"AP"},
                {className:"hide topo-icon topo-count", type:"Count", inner:"count-text"}
            ];
            var aInnerHtml = [];
            for(var i=0;i<oIconMode.length;i++)
            {
                var oMode = oIconMode[i];
                aInnerHtml.push('<span class="' + oMode.className + '" type="' + oMode.type + '">');
                if(oMode.inner)
                {
                    aInnerHtml.push('<i class="'+oMode.inner+'"></i>');
                }
                aInnerHtml.push('</span>');
            }
            _jMain.html(aInnerHtml.join(" "));
            $('.topo-icon,.hover-trigger', _jMain).mouseenter(showTipBox);

            //infor box
            var sBoxDiv =   '<div id="topo_tip_box" class="hide">'+
                                '<div class="bk-layer"></div>'+
                                '<div class="tip-body"></div>'+
                                '<div class="tool-bar hide"><span class="btn-detail"></span></div>'+
                            '</div>';
            _jTipBox = $(sBoxDiv).appendTo($('body'));

            //refresh
            _initData();
            _resize();
        }

        function _initData()
        {
            $.ajax({
                url: "../../wnm/panel.json",
                type: "GET",
                dataType: "json",
                success: function(data){
                    var oAccount= data.oAccount || {};

                    var aDeviceInfo = data.aDeviceInfo;

                    //Device information
                    var oDeviceInfor = {
                        "HardwareRev" : false,
                        "FirmwareRev" : false,
                        "SoftwareRev" : false,
                        "SerialNumber" : false
                    }, bFlag = false;

                    for(var i=0;i<aDeviceInfo.length;i++)
                    {
                        bFlag = true;
                        for(key in oDeviceInfor)
                        {
                            oDeviceInfor[key] = oDeviceInfor[key] || aDeviceInfo[i][key];
                            if(!oDeviceInfor[key]) bFlag = false;
                        }

                        if(bFlag) break;
                    }

                    //Cloud information
                    _DataObj = $.extend({
                        CloudState : oAccount.CloudConnectionState,
                        CloudName : oAccount.CloudAccountName,
                    },oDeviceInfor);

                    //Network information
                    _DataObj["NetState"] = 1;

                    getDynamicData();
                },
                error:function(err,status){
                    alert(err);
                }
            });
          /*  function myCallback(oInfos)
            {
                var oAccount= Utils.Request.getTableRows(NC.CloudAccount, oInfos)[0] || {};
                
                var aDeviceInfo = Utils.Request.getTableRows(NC.DeviceVersionEntities, oInfos);

                //Device information
                var oDeviceInfor = {
                    "HardwareRev" : false, 
                    "FirmwareRev" : false, 
                    "SoftwareRev" : false, 
                    "SerialNumber" : false
                }, bFlag = false;

                for(var i=0;i<aDeviceInfo.length;i++)
                {
                    bFlag = true;
                    for(key in oDeviceInfor)
                    {
                        oDeviceInfor[key] = oDeviceInfor[key] || aDeviceInfo[i][key];
                        if(!oDeviceInfor[key]) bFlag = false;
                    }

                    if(bFlag) break;
                }

                //Cloud information
                _DataObj = $.extend({
                    CloudState : oAccount.CloudConnectionState,
                    CloudName : oAccount.CloudAccountName,
                },oDeviceInfor);

                //Network information
                 _DataObj["NetState"] = 1;

                getDynamicData();
            }
            var oReqAccount = Utils.Request.getTableInstance(NC.CloudAccount);
            var oEntityInfo = Utils.Request.getTableInstance(NC.DeviceVersionEntities);

            return Utils.Request.getAll([oReqAccount,oEntityInfo], {onSuccess: myCallback, name:"system"});*/
        }

        function getDynamicData(Index)
        {
            $.ajax({
                url: "../../wnm/panel.json",
                type: "GET",
                dataType: "json",
                success: function(data){
                    var aEntityExtInfo = data.aEntityExtInfo;
                    var aManualAP= data.aManualAP || {};

                    //CPU and Memory
                    _DataObj["ACState"] = -1;
                    _DataObj["CPU"] = parseInt(aEntityExtInfo[0].CpuUsage);
                    _DataObj["Memory"] = parseInt(aEntityExtInfo[0].MemUsage);

                    //for test
                    _DataObj["CPU"] = parseInt(Math.random()*100);
                    _DataObj["Memory"] = parseInt(Math.random()*100);

                    if(_DataObj["CPU"] > 80 || _DataObj["Memory"] > 80) _DataObj["ACState"] = 0;

                    //AP Online Statistic
                    _DataObj["APNum"] = aManualAP.length;
                    _DataObj["OffAPNum"] = 0;
                    _DataObj["APState"] = -1;
                    _DataObj.OffAP = [];
                    for(var i=0;i<aManualAP.length;i++)
                    {
                        if(aManualAP[i].Status != "1")
                        {
                            _DataObj["OffAPNum"]++;
                            _DataObj.OffAP.push(aManualAP[i]);
                        }
                    }

                    //for test
                    _DataObj["APNum"] = parseInt(Math.random()*32);
                    _DataObj["OffAPNum"] = parseInt(Math.random()*32);

                    if(_DataObj["OffAPNum"] > 0) _DataObj["APState"] = 0;
                    if(_DataObj["OffAPNum"] == _DataObj["APNum"]) _DataObj["APState"] = 1;


                    _refresh(_DataObj);

                    if(_oTimer)
                    {
                        clearTimeout(_oTimer);
                    }
                    _oTimer = setTimeout(function(){getDynamicData();},5000);
                },
                error:function(err,status){
                    alert(err);
                }
            });
           /* function myCallback(oInfos)
            {
                var aEntityExtInfo = Utils.Request.getTableRows(NC.DeviceExtPhysicalEntities, oInfos);
                var aManualAP= Utils.Request.getTableRows(NC.ManualAP, oInfos)[0] || {};

                //CPU and Memory
                _DataObj["ACState"] = -1;
                _DataObj["CPU"] = parseInt(aEntityExtInfo[0].CpuUsage);
                _DataObj["Memory"] = parseInt(aEntityExtInfo[0].MemUsage);

                //for test
                _DataObj["CPU"] = parseInt(Math.random()*100);
                _DataObj["Memory"] = parseInt(Math.random()*100);

                if(_DataObj["CPU"] > 80 || _DataObj["Memory"] > 80) _DataObj["ACState"] = 0;

                //AP Online Statistic
                _DataObj["APNum"] = aManualAP.length;
                _DataObj["OffAPNum"] = 0;
                _DataObj["APState"] = -1;
                _DataObj.OffAP = [];
                for(var i=0;i<aManualAP.length;i++)
                {
                    if(aManualAP[i].Status != "1")
                    {
                        _DataObj["OffAPNum"]++;
                        _DataObj.OffAP.push(aManualAP[i]);
                    }
                }

                //for test
                _DataObj["APNum"] = parseInt(Math.random()*32);
                _DataObj["OffAPNum"] = parseInt(Math.random()*32);

                if(_DataObj["OffAPNum"] > 0) _DataObj["APState"] = 0;
                if(_DataObj["OffAPNum"] == _DataObj["APNum"]) _DataObj["APState"] = 1;
                
                
                _refresh(_DataObj);

                if(_oTimer)
                {
                    clearTimeout(_oTimer);
                }
                _oTimer = setTimeout(function(){getDynamicData();},5000);
            }

            var oExtPhysicalEntities = Utils.Request.getTableInstance(NC.DeviceExtPhysicalEntities);
            var oReqManualAP = Utils.Request.getTableInstance(NC.ManualAP);
            oExtPhysicalEntities.addFilter({"PhysicalIndex" : Index});  
            Utils.Request.getAll([oExtPhysicalEntities,oReqManualAP], myCallback);*/
        }

        function _refresh()
        {   
            var oMap = {CloudState : ".cloud", NetState : ".network", ACState : ".ac", APState : ".ap"};
            var aState = ['topo-warning','topo-error'];
            
            for(key in oMap)
            {
                if((typeof _oTimer == "number") && (key == "CloudState" || key == "NetState"))
                {
                    continue;
                }

                var sClass = oMap[key];
                var sState = aState[_DataObj[key]];
                if(sState && sState != "-1")
                {
                    $(".hover-trigger"+sClass, _jMain).hide();
                    $(".topo-icon"+sClass, _jMain).removeClass('topo-warning')
                                          .removeClass('topo-error')
                                          .addClass(sState)
                                          .show();
                }
                else
                {
                    $(".hover-trigger"+sClass, _jMain).show();
                    $(".topo-icon"+sClass, _jMain).hide();
                }
            }

            if(_DataObj.APNum > 1)
            {
                $('.topo-count', _jMain).removeClass('hide');
                $('.count-text', _jMain).html(_DataObj.APNum);
            }

            if(_jTipBox.is(":visible"))
            {
                refreshTip();
            }
        }

        function showTipBox(e)
        {
            var oTimer = false;
            _DataObj.TipType = $(this).attr("type");
            _DataObj.isIconTip = $(this).hasClass("topo-icon");
            refreshTip();
            _jTipBox.css({"left":e.pageX+20,"top":e.pageY+10}).fadeIn(200);
            $(document).on('mousemove.topology',function(e){
                if(oTimer)
                {
                    clearTimeout(oTimer);
                }
                oTimer = setTimeout(function(){
                    var jEle = $(e.srcElement);
                    if(jEle.is('.topology .topo-icon,.topology .hover-trigger,.topology i'))
                    {
                        _jTipBox.css({"left":e.pageX+20,"top":e.pageY+10}).show();
                    }
                    else if(jEle.parents("#topo_tip_box").length)
                    {
                        _jTipBox.show();
                    }
                    else
                    {
                        _jTipBox.fadeOut(200);
                        $(document).off('mousemove.topology');
                    }
                },50);
            });
        }

        function refreshTip()
        {
            var jBoxBody = $('.tip-body',_jTipBox),
                sType = _DataObj.TipType;
            $(".tool-bar",_jTipBox).hide();
            jBoxBody.empty().append(_HtmlMaker[sType]);
        }

        function _resize()
        {
            var nTotalWidth = _jPanel.width(),
                nMainWidth = _jMain.width(),
                nLeft = (nTotalWidth-nMainWidth)/2 + "px";
            _jMain.css({'left':nLeft});
        }

        function _destroy()
        {
            _jTipBox.remove();
            if(_oTimer)
            {
                clearTimeout(_oTimer);
            }
        }

        _create();
        this.resize = _resize;
        this.destroy = _destroy;
    }

    var oPanel = {
        pfMap:{
            "topology"  : Topology,
            "port-list" : PortList
        },
        _create : function()
        {
            this.panel = this.element;
        },
        _destroy:function()
        {
            // _destroy();
            this.oInstance.destroy();
            this.panel.remveData("opt");
            delete this.panel;
        },
        init: function (opt)
        {
            var oHandle = this;
            sType = opt.type;
            if(oHandle.pfMap[sType])
            {
                oHandle.oInstance = new oHandle.pfMap[sType](this.panel,opt);
            }
            Frame.regNotify(UTILNAME, "resize",  function(){
                oHandle.resize();
            });
        },
        resize: function(){
            this.oInstance.resize();
        },
        getPort : function(){
            return this.oInstance.getPort ? this.oInstance.getPort() : {};
        },
        setPort : function(ifIndex){
            this.oInstance.setPort && this.oInstance.setPort(ifIndex);
        },
        disabled : function(value)
        {
            this.oInstance.disabled && this.oInstance.disabled(value);
        }
    };

    function _init(oFrame)
    {
        $(".panel", oFrame).Panel();
    }

    function _destroy()
    {
    }

    $.widget("ui.Panel", oPanel);
    Widgets.regWidget(UTILNAME, {
        "init": _init, "destroy": _destroy,
        "widgets": [], 
       /* "utils":["Request"],*/
        "libs": ["Libs.Panel.Define"]
    });
})(jQuery);
