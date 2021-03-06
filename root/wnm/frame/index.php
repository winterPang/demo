<!DOCTYPE html>  
<html lang="en">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<title></title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />  
	<meta content="" name="description" />  
	<meta content="" name="author" />
	<link href="../../web/frame/libs/css/bootstrap.css" rel="stylesheet" type="text/css"/>  
	<link href="../../web/frame/libs/css/bootstrap-responsive.css" rel="stylesheet" type="text/css"/>  
	<link id="mytheme" rel="stylesheet" type="text/css"/>  

<script type="text/javascript">
var FrameInfo = {};
</script>
<script>
var FrameInfo = 
{
	sessionid: "abcd1234",
	oem: "001",
	uname: "John Smith",
	devname: "С��",
	vid: "1",
	ns:
	{
		base: "http://www.h3c.com/netconf/base:1.0",
		data: "http://www.h3c.com/netconf/data:1.0",
		config: "http://www.h3c.com/netconf/config:1.0",
		action: "http://www.h3c.com/netconf/action:1.0"
	}
};
</script>
	<!--wnm:FrameInfo-->
	
	<!--[if IE 8]>
	<link rel="stylesheet" href="../../web/frame/libs/css/font-awesome-ie7.min.css">
	<script type="text/javascript" src="../../web/frame/utils/respond.js"></script>
	<![endif]-->
</head>  
<!-- END HEAD -->  
<!-- BEGIN BODY -->  
<body >  

<!-- manually attach allowOverflow method to pane -->
<div class="xb-layout-north logo-panel">
	<div class="logo-bar pull-left">
		<a class="logo-icon"></a>
	</div>
	<div class="user-bar pull-right">
		<a id="user_menu">
			<i class="droplist-icon  pull-right"></i>
			<i class="user-icon  pull-right"></i>
		</a>
		<ul id="drop_list" class="pull-right hide">
			<li index="0">
				<span id="lougout_label"></span>
			</li>
			<li index="1">
				<span id="password_label"></span>
			</li>
			<li index="2">
				<span id="online_service"></span>
			</li>
		</ul>
	</div>
</div>

<div class="xb-layout-west menu-panel">
	<!-- BEGIN SIDEBAR -->
	<div id="menu_toggle" class="menu-toggle">
		<span></span>
	</div>
	<div id="side_menu" class="page-sidebar"></div>
	<div class="menu-ctrl up hide"><span class="up-icon"></span></div>
	<div class="menu-ctrl down hide"><span class="down-icon"></span></div>
	<!-- END SIDEBAR -->  
</div>

<div class="xb-layout-south status-panel hide">
	<div id="copyright" class="copyright hide">Copy right</div>
</div>

<div id="layout_center" class="xb-layout-center content-panel">
	<div id="frame_nav" class="xb-nav-panel path">
		<ul id="frame_tablist" tab-content="tabContent" class="nav nav-tabs"></ul>
		<ul id="global_btns"></ul>
	</div>
	<div class="xb-center-panel page-container">
		<div id="tabContent" class="tab-content row-fluid sub-page portlet"></div>
	</div>
</div>

	<!-- END CONTAINER -->  
	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->  
	<!-- BEGIN CORE PLUGINS -->  
	<script src="../../web/frame/libs/js/jquery.js" type="text/javascript"></script>  
	<script src="../../web/frame/libs/js/jquery-ui.js" type="text/javascript"></script>
	<script src="../../web/frame/libs/js/bootstrap.min.js" type="text/javascript"></script>  
	<script type="text/javascript" src="../../web/frame/libs/js/jquery.event.drag-2.2.js"></script>
	<!--[if lt IE 9]>  
	<script src="../../web/frame/libs/js/excanvas.min.js"></script>  
	<script src="../../web/frame/libs/js/respond.min.js"></script>    
	<![endif]-->     
	<!-- END CORE PLUGINS -->  

	<!-- BEGIN bootstrap PLUGINS -->  
	<script type="text/javascript" src="../../web/frame/libs/js/bootstrap-modal.js" ></script>
	<script type="text/javascript" src="../../web/frame/libs/js/bootstrap-modalmanager.js" ></script> 
	<script type="text/javascript" src="../../web/frame/libs/js/bootstrap-carousel.js" ></script> 
	<!-- END bootstrap PLUGINS --> 
	
	<!-- BEGIN PAGE LEVEL SCRIPTS -->
	<script type="text/javascript" src="../../web/frame/config.js"></script>
	<script type="text/javascript" src="../../web/frame/libs/js/mainframe.js"></script>
	<script type="text/javascript" src="../../web/frame/js/menu.js"></script>	

	
	<script type="text/javascript" src="../../web/frame/widgets/debuger.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/frame.js"></script>
	<script type="text/javascript" src="../../web/frame/js/mjs.js"></script>
	<script type="text/javascript" src="../../web/frame/nc.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/util.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/dialog.js"></script>
	<script type="text/javascript" src="../../web/frame/widgets/dbm.js"></script>
	<script type="text/javascript" src="../../web/frame/utils/base.js"></script>
	<script type="text/javascript" src="../../web/frame/utils/request.js"></script>
	<script type="text/javascript" src="../../web/frame/utils/system.js"></script>
</body>
<!-- END BODY -->  
</html>
<script>
document.cookie = "abcd1234=true; path=/;";
MyConfig.config.local = true;
MyConfig.useXmlMenu = (window.navigator.userAgent.indexOf("MSIE")==-1);
</script>
