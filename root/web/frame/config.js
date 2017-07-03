var MyConfig = 
{
	name: "v7-web-config",
	ver: "7.54.2.08131800",
	root: "../../web/",  // ���ܵľ�̬URL�ĸ�Ŀ¼����webĿ¼
	responseWidth: 800, // if the window width is less it, the layout of the page will be changed.
	Layout:
	{
		enable: false,
		width1: 768,
		width2: 980,
		width3: 1100
	},
	titleSeperator: " | ",
	config:
	{
		//debuger: false,
		keepAlive: 5000, // ����ʱ����, ����
		checkTimeout: 1000, // ����Ƿ�ʱ��ʱ����
		menuDelay: 200,     // ����˵������ˡ�ǰ������ת�����ӵȺ�ҳ�濪ʼ��Ӧ��ʱ����
		cachePage: true, // �Ƿ񻺴澲̬HTML��JS�ļ�
		effect:true
	},
	helpPanel:
	{
		size: "75%"
	},
	Dialog:
	{
		DEFAULT:{height:"auto", width:400},
		INFO:    // ��ʾ������
		{
			width: 500, 
			height: 40,
			visibleTime:2000,        //�Զ��رյ�ʱ�� ms
			position:"center-center" //λ��: ����֧�� top|center|bottom - left|center|right ���������
		},
		ALERT:{},
		CONFIRM:{},
		ERROR:{},
		PROMPT:{},
		FORM: {height:"auto", width:"auto"}
	},
	Plot:
	{
		maxPoint: 100,
		width: 250
	},
	Syslog:
	{
		severity: ["Emergency","Alert","Critical","Error","Warning","Notification","Informational","Debugging"], // ��־������
		lastestCount: 5
	},
	MList:
	{
		errorVisible: 2000, // �б༭ʱ������ʾ��Ϣ�ɼ���ʱ��
		smallWidth: 600,
		subRowHeight: 43
		,searchDelay: 500  // ms, delay for gloable search
		,selectMode: "pc"  // pc or mobile
		,rowHeight: 23
		,ROW_MARGIN: 20   // include margin top and bottom
		,pageBar: true
		,statusBar: true

		,EditList: "cell" // Display mode of EditList, the value is "block" or "cell"
	},
	jDate:
	{
		DEFAULT:
		{
			// Default regional settings
			numberOfMonths: 1,
			stepMonths: 2,
			showOtherMonths: true,
			selectOtherMonths: true,
			changeMonth: true,
			changeYear: true,
			yearRange: '2000:2035',
			dateFormat:	'yy-mm-dd',
			isRTL: false,
			showMonthAfterYear:	true,
			//showOptions:{direction:"up"},
			showButtonPanel: true
		},
		INLINE:
		{
			numberOfMonths: 1,
			stepMonths: 1,
			altFormat: 'yy-mm-dd',
			showButtonPanel: false
		}
	},
	PageRefresh:    // ��λ: ��
	{
		SysInfo: 1,
		IfStat: 1
	}
}
