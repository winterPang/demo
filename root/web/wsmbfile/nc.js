;(function ($) {
var MODULE_NC = "wsmbfile.NC";
var PageInfo = {
    NC:{
        /******************Dashboard*************/
        UserApps: {
            nodes: ["DRS", "UserApps"],
            row: "UserApp",
            index: ["StartTime", "EndTime", "PktDir", "AddressType", "UserId", "AppName"],
            column: ["Time", "PktCnts", "PktBytes", "PktDropCnts", "PktDropBytes", "AppCategory"],
            menus:["M_Dashboard","M_ClientInfor","M_RateAnalyse","I_SecurityPolicy"]
        }
        ,UserInterfaces: {
            nodes: ["DRS", "UserInterfaces"],
            row: "UserInterface",
            index: ["StartTime", "EndTime", "PktDir", "AddressType", "UserId", "InterfaceName"],
            column: ["Time", "PktCnts", "PktBytes", "PktDropCnts", "PktDropBytes"],
            menus:["M_RateAnalyse"]
        }
        ,Users: {
            nodes: ["DRS", "Users"],
            row: "User",
            index: ["AddressType", "UserId", "UserMac"],
            column: ["IsWlanClient", "UserIp"],
            menus:["M_RateAnalyse","I_UserManager"]
        }
        ,AppLogs:{
            nodes:["DRS","AppLogs"],
            row:"AppLog",
            index:["StartTime", "EndTime", "PktDir", "AddressType", "InterfaceName"],
            column:["PktBytes", "Time"],
            menus:["M_RateAnalyse","I_SecurityPolicy"]
        }
        ,ClientProbes: {
            nodes: ["WIPS", "ClientProbes"],
            row: "ClientProbe",
            index: ["MacAddress"],
            column: [/*"Ssid",*/"Status", "StatusDurationTime", "Vendor", "ReportSensorNum", "Channel", "RssiMax", "RssiMin", "Rssi", "FirstReportTime", "LastReportTime"],
            menus:["M_ClientInfor"]
        }
        ,ApUnAuths: {
            nodes: ["WIPS", "ApUnAuths"],
            row: "ApUnAuth",
            index: ["VsdName", "MacAddress", "SensorName"],
            column: ["HotspotAP", "SoftAP", "HoneypotAP", "LastReportTime"],
            menus:["M_ClientInfor"]
        }
        ,Stations: {
            nodes: ["WLANClient", "Stations"],
            row: "Station",
            index: ["MacAddress"],
            column: ["UserName", "Aid", "ApName", "RadioId", "Ssid", "Bssid", "VLAN","PowerSaveMode","ListenInterval","RSSI","RxRate","TxRate","UpTime","QoSMode","Ipv4Address","Ipv6Address","WirelessMode","SNR","DeviceType","ClassifyDeviceType"],
            menus:["M_Dashboard","M_ClientInfor","M_RateAnalyse"]
        }
        ,SecurityInfo: {
            nodes: ["WLANClient", "StationSecurityInformation"],
            row: "Security",
            index: ["MacAddress"],
            column: ["ClientType", "AkmMethod", "EncryptionCipher"],
            menus:["M_RateAnalyse"]
        }
        ,ServiceStatus: {
            nodes:["WLANClient","ServiceStatus"],
            row:"Status",
            index:["ServiceTemplateName"],
            column:["SSID", "ClientNumber","ClientNumber2G","ClientNumber5G","RadioNumber2G","RadioNumber5G"/*,"RxRate","TxRate"*/],
            menus:["M_DeviceInfor"]
        }
        ,DeviceType: {
            nodes: ["WLANClient", "DeviceTypeStatistics"],
            row: "",
            index: ["Top1ClientNum"],
            column: ["Top1Type", "Top2ClientNum", "Top2Type", "Top3ClientNum", "Top3Type", "Top4ClientNum", "Top4Type","Top5ClientNum","Top5Type","Top6ClientNum","Top6Type","Top7ClientNum","Top7Type","OtherClientNum"],
            menus:["M_Dashboard"]
        }
        ,StationStatistics: {
            nodes: ["WLANClient", "StationStatistics"],
            row: "Statistics",
            index: ["MacAddress"],
            column: ["TxBkFrames", "TxBkBytes", "TxBeFrames", "TxBeBytes", "TxViFrames", "TxViBytes", "TxVoFrames","TxVoBytes","RxBkFrames","RxBkBytes","RxBeFrames","RxBeBytes","RxViFrames","RxViBytes", "RxVoFrames", "RxVoBytes", "DropBkFrames", "DropBkBytes", "DropBeFrames", "DropBeBytes", "DropViFrames", "DropViBytes", "DropVoFrames", "DropVoBytes"],
            menus:["M_RateAnalyse"]
        }
        ,ArpTable:{
            nodes: ["ARP", "ArpTable"],
            row: "ArpEntry",
            index: ["IfIndex", "Ipv4Address"],
            column: ["MacAddress", "VLANID", "PortIndex", "VrfIndex", "ArpType"],
            menus:["M_ClientInfor", "M_NetworkInfor"]
        }
        ,ResetClient: {
            nodes: ["WLANClient", "ResetClient"],
            row: "Client",
            index: [""],
            column: ["MacAddress"],
            menus:["M_Dashboard"]
        }
        ,Statistics:{
            nodes: ["Ifmgr", "Statistics"],
            row: "Interface",
            index: ["IfIndex"],
            column: ["Name", "AbbreviatedName", "InOctets", "InUcastPkts", "InNUcastPkts"],
            menus:["M_NetworkInfor"]
        }
        ,Tra_Interfaces:{
            nodes: ["Ifmgr","TrafficStatistics", "Interfaces"],
            row: "Interface",
            index: ["IfIndex"],
            column: ["Name","Interval", "InPkts", "OutPkts", "InOctets", "OutOctets", "InBits","OutBits"],
            menus:["M_Dashboard","M_RateAnalyse"]
        }
        ,HistoryStatistics : {
            nodes:["ModuleProxy","HistoryStatistics","Interfaces"],
            row:"",
            index:["IfIndex"],
            column:["Name","InPkts","OutPkts","InOctets","OutOctets","RecordTime"],
            menus: ["M_Dashboard"]
        }
        ,AP_HistoryStatistics : {
            nodes:["ModuleProxy","HistoryStatistics","APs"],
            row:"",
            index:["Name"],
            column:["InPkts","OutPkts","InOctets","OutOctets","RecordTime"],
            menus: ["M_RateAnalyse"]
        }
        ,APStatistics : {
            nodes:["ModuleProxy","APStatistics","AP"],
            row:"",
            index:["Name"],
            column:["InPkts","OutPkts","InOctets","OutOctets"],
            menus: ["M_RateAnalyse"]
        }
        ,Interfaces: {
            nodes: ["Ifmgr", "Interfaces"],
            row: "Interface",
            index: ["IfIndex"],
            column: ["Name", "AbbreviatedName", "PortIndex", "ifTypeExt", "ifType", "Description", "AdminStatus", "OperStatus", "ConfigSpeed", "ActualSpeed", "ConfigDuplex", "ActualDuplex", "LinkType", "PVID", "InetAddressIPV4", "InetAddressIPV4Mask", "PhysicalIndex", "MAC", "PortLayer", "ForwardingAttributes", "Loopback", "MDI", "ConfigMTU", "ActualMTU", "ConfigBandwidth", "ActualBandwidth", "SubPort", "ForceUP"],
            menus:["M_ClientInfor","M_NetworkInfor","I_NetworkCfg"]
        }
        ,IpInUse : {
            nodes:["DHCP","DHCPServerIpInUse"],
            row:"IpInUse",
            index:["PoolIndex", "Ipv4Address"],
            column:["Ipv4Address","CID","HAddress","HType","VLANID","EndLease","Type","IfIndex"],
            menus:["M_NetworkInfor","I_NetworkCfg"]
        }
        ,ManualAP:{
            nodes: ["AP", "ManualAP"],
            row: "AP",
            index: ["Name"],
            column: ["Description","Model", "CfgSerialID", "CfgMacAddress","LocationName", "GroupName", "RegionCode", "Priority", "Preempt", "EchoInterval", "EchoCount", "RetransInterval", "RetransCount","TunnelEncryption","StatisInterval", "FirmwareUpgrade", "BackupACIPv4", "BackupACIPv6", "RadioNum", "Status", "RegionLock"],
            menus:["M_ClientInfor","I_WirelessCfg","I_SecurityPolicy","M_DeviceInfor"]
        }
        ,RunAP:{
            nodes: ["AP", "RunAP"],
            row: "AP",
            index: ["Name"],
            column: ["Model", "SerialID", "Type","MacAddress", "RadioNum", "Status", "Ipv4Address", "Ipv6Address", "PortNumber","GroupName", "OnlineTime", "HWVer", "SWVer", "BWVer", "TransCtrlPkt", "RecvCtrlPkt", "TransDataPkt", "RecvDataPkt", "EchoReqCnt", "EchoRespLossCnt", "DiscoveryType", "ConfigFailCnt", "LastFailReason", "LastRebootReason", "TunnelDownReason", "ConnectionType", "PeerACIPv4Address", "PeerACIPv6Address", "LocationName","AuthenticatedFlag"],
            menus:["M_ClientInfor","M_DeviceInfor"]
        }
        ,RadioRunningCfg:{
            nodes: ["AP", "RadioRunningCfg"],
            row: "Radio",
            index: ["ApName","RadioID"],
            column: ["Mode","Bandwidth","SupportDot11B","SupportDot11A","SupportDot11G","SupportDot11GN","SupportDot11AN","SupportDot11AC","Spectrum","Status","RateMulticast","RateMandatory","RateSupported","RateDisabled","Preamble","BeaconInterval","PowerLock","Distance","MaxRxDuration","FragmentThreshold","LongRetryThreshold","ProtectionThreshold","ShortRetryThreshold","CfgChannel","CfgMaxPower"],
            menus:["M_DeviceInfor","I_AppManager","I_WirelessCfg"]
        }
        ,RadioOfManualAP: {
            nodes: ["AP", "RadioOfManualAP"],
            row: "Radio",
            index: ["ApName","RadioID"],
            column: ["Mode","Bandwidth","Status","CfgChannel","CfgMaxPower","SupportDot11B","SupportDot11A","SupportDot11G","SupportDot11GN","SupportDot11AN","SupportDot11AC","Spectrum"],
            menus:["I_AppManager","I_WirelessCfg","M_DeviceInfor"]
        }
        ,RadioOfRunAP: {
            nodes: ["AP", "RadioOfRunAP"],
            row: "Radio",
            index: ["ApName","RadioID"],
            column: ["Mode","Bandwidth","SecondaryOffSet","Channel","MaxPower"],
            menus:["I_AppManager"]
        }
        ,ChannelTypeMap: {
            nodes: ["AP", "ChannelTypeMap"],
            row: "ChannelMap",
            index: ["RadioMode","Bandwidth","Channel"],
            column: ["ChannelType"],
            menus:["I_WirelessCfg"]
        }
        ,AntennaDB: {
            nodes: ["AP", "AntennaDB"],
            row: "Antenna",
            index: ["ModelName","RadioID","AntennaType"],
            column: [],
            menus:["I_WirelessCfg"]
        }
        ,PowerIndex: {
            nodes: ["AP", "PowerIndex"],
            row: "Index",
            index: ["ModelName","RadioID","RadioMode","AntennaType","RegionCode","ChannelType"],
            column: ["PowerIndex","PowerSubIndex"],
            menus:["I_WirelessCfg"]
        }
        ,PowerDB: {
            nodes: ["AP", "PowerDB"],
            row: "Power",
            index: ["PowerIndex","ChannelType"],
            column: ["PowerSubIndex","Channel","ValidMaxPower"],
            menus:["I_WirelessCfg"]
        }
        ,MacRule: {
            nodes:["BYOD","MacRules"],
            row:"MacRule",
            index:["MacAddr","MacMask"],
            column:["DeviceType","RuleClass"],
            menus:["M_NetworkInfor"]
        }
        ,DeviceVersionEntities : {
            nodes:["Device","PhysicalEntities"],
            row:"Entity",
            index:["PhysicalIndex"],
            column:["Chassis","Slot","SubSlot","Description","VendorType","ContainedIn","Class","ParentRelPos","Name","HardwareRev", "FirmwareRev","SoftwareRev","SerialNumber","MfgName","Model","Alias","AssetID","FRU","Uris","MfgDate"],
            menus: ["M_Dashboard","M_DeviceInfor"]
        }
        ,CloudAccount : {
            nodes:["Cmtnlmgr","CloudAccount"],
            row:"CloudAccountEntry",
            index:["CloudAccountName"],
            column:["CloudConnectionState"],
            menus: ["M_DeviceInfor"]
        }
        ,CloudConnect : {
            nodes:["Cmtnlmgr","CloudConnect"],
            row:"CloudConnectEntry",
            index:["ConnectDevSn"],
            column:["LastConnectTime","LastSyncTime"],
            menus: ["M_DeviceInfor"]
        }
        ,CloudVersion : {
            nodes:["Cmtnlmgr","CloudVersion"],
            row:"CloudVersionEntry",
            index:["VersionDevSn"],
            column:["CloudVersionNum","CloudVersionDisc"],
            menus: ["M_DeviceInfor"]
        }
        ,CloudMaintainAgent : {
            nodes:["Cmtnlmgr","CloudMaintainAgent"],
            row:"CloudMaintainAgentEntry",
            index:["AgentDevSn"],
            column:["AgentBind","AgentName"],
            menus: ["M_DeviceInfor"]
        }
        /////////////////user/////////////////////////////////
        ,UserGroups: {
            nodes:["UserAccounts","UserGroups"],
            row:"Group",
            index:["Name"],
            column:["AuthorizationInfo","AuthorizationInfo.AclNumber","AuthorizationInfo.CallbackNumber","AuthorizationInfo.FTPHomeDir","AuthorizationInfo.IdleTimeout","AuthorizationInfo.IpPool","AuthorizationInfo.Ipv6Pool","AuthorizationInfo.PrimaryDNSServer","AuthorizationInfo.SecondaryDNSServer","AuthorizationInfo.URL","AuthorizationInfo.UserProfile","AuthorizationInfo.VLANID","AuthorizationInfo.VRF"],
            menus:["I_UserManager"]
        }
        ,NetAccounts: {
            nodes:["UserAccounts","Network","Accounts"],
            row:"Account",
            index:["Name"],
            column:[/*"Password",*/"GroupName","ADVPN","IPoE","LanAccess","Portal","PPP","AccessLimit","CurrentAccessNum","AuthorizationInfo.AclNumber","AuthorizationInfo.CallbackNumber","AuthorizationInfo.IdleTimeout","AuthorizationInfo.Ipv4Address","AuthorizationInfo.Ipv6Address",/*"AuthorizationInfo.Ipv6Prefix.Ipv6Address","AuthorizationInfo.Ipv6Prefix.Ipv6PrefixLength","PrimaryDNSServer", "SecondaryDNSServer","URL","UserProfile","VLANID","VRF",*/"BindingInfo", "BindingInfo.CallNumber","BindingInfo.Interface","BindingInfo.Ipv4Address","BindingInfo.MacAddress","BindingInfo.VLANID"],
            menus:["I_UserManager"]
        }
        ,IPv4AdvanceRules: {
            nodes:["ACL","IPv4AdvanceRules"],
            row:"Rule",
            index:["GroupID","RuleID"],
            column:["Action","ProtocolType","SrcAny","SrcIPv4","SrcIPv4.SrcIPv4Addr","SrcIPv4.SrcIPv4Wildcard","DstAny","DstIPv4","DstIPv4.DstIPv4Addr","DstIPv4.DstIPv4Wildcard","DSCP","Precedence","TOS","SrcPort","SrcPort.SrcPortOp","SrcPort.SrcPortValue1","SrcPort.SrcPortValue2","DstPort","DstPort.DstPortOp", "DstPort.DstPortValue1","DstPort.DstPortValue2","TcpFlag","TcpFlag.ACK","TcpFlag.FIN","TcpFlag.PSH", "TcpFlag.RST","TcpFlag.SYN","TcpFlag.URG","Established","ICMP","ICMP.ICMPType","ICMP.ICMPCode","Fragment","TimeRange","VRF","Counting","Logging","Comment"],
            menus:["I_UserManager"]
        }
        ,GlobalStatus: {
            nodes:["Bonjour","GlobalStatus"],
            row:"",
            index:[""],
            column:["Enable","Stopm2uThreshold","SrcAny","SrcIPv4","SrcIPv4.SrcIPv4Addr","SrcIPv4.SrcIPv4Wildcard"],
            menus:["I_UserManager"]
        }
        ////////////////////////networkcfg/////////////////////////////////////////////////////
        ,ManAccounts: {
            nodes:["UserAccounts","Management","Accounts"],
            row:"Account",
            index:["Name"],
            column:["Password","GroupName","FTP","HTTP","HTTPS","PAD","SSH","TELNET","Terminal","AccessLimit","FTPHomeDir"],
            menus:["I_NetworkCfg"]
        }
        ,VLANs: {
            nodes:["VLAN","VLANs"],
            row:"VLANID",
            index:["ID"],
            column:["Description","Name","RouteIfIndex","UntaggedPortList","TaggedPortList","Shared"],
            menus:["I_NetworkCfg"]
        }
        ,DDNSPolicy: {
            nodes:["DDNS","DDNSPolicy"],
            row:"Policy",
            index:["PolicyName"],
            column:["URL","IntervalDay","IntervalHour","IntervalMinute","Username","Password","Method","SSLClientPolicy"],
            menus:["I_NetworkCfg"]
        }
        ,DDNSIfApply: {
            nodes:["DDNS","DDNSIfApply"],
            row:"IfApply",
            index:["IfIndex","PolicyName"],
            column:["FQDN"],
            menus:["I_NetworkCfg"]
        }      
        ,InboundStaticMappings: {
            nodes:["NAT","InboundStaticMappings"],
            row:"Mapping",
            index:["GlobalInfo.GlobalVRF","GlobalInfo.StartIpv4Address","GlobalInfo.EndIpv4Address","LocalInfo.LocalVRF","LocalInfo.Ipv4Address","LocalInfo.Ipv4PrefixLength"],
            column:["ACLNumber","Reversible"],
            menus:["I_NetworkCfg"]
        }
        ,ServerOnInterfaces: {
            nodes:["NAT","ServerOnInterfaces"],
            row:"Interface",
            index:["IfIndex","ProtocolType","GlobalInfo.GlobalVRF","GlobalInfo.GlobalStartIpv4Address","GlobalInfo.GlobalEndIpv4Address","GlobalInfo.GlobalStartPortNumber","GlobalInfo.GlobalEndPortNumber","GlobalInfo.GlobalIfIndex"],
            column:["LocalInfo.LocalVRF","LocalInfo.LocalStartIpv4Address","LocalInfo.LocalEndIpv4Address","LocalInfo.LocalStartPortNumber","LocalInfo.LocalEndPortNumber","LocalInfo.LocalSrvGroupNumber","ACLNumber"],
            menus:["I_NetworkCfg"]
        }
        //////////////////////////////////wireless cfg service start/////////////////////////////
        ,ServiceTemplates : {
            nodes:["WLANClient","ServiceTemplates"],
            row:"Template",
            index:["Name"],
            column:["SSID","DefaultVlan","HideSsid","MaxClientCnt","Enable","Description","UserIsolation"],
            menus: ["I_QuickNav","I_WirelessCfg","M_ClientInfor","M_DeviceInfor"]
        }
        ,ServiceSecurity : {
            nodes:["WLANClient","ServiceSecurity"],
            row:"Security",
            index:["Name"],
            column:["WpaIeSelected","RsnIeSelected","TkipSelected","CcmpSelected","Wep40Selected","Wep104Selected","Wep128Selected","AkmMode","PskInputMode","PskPassPhraseKey","PskRawKey","PtkLifeTime","GtkUpdateEnable","GtkUpdateMode","GtkUpdateTime","GtkPacketNumber","ClientOffUpdateGtk","TkipCmTime"],
            menus: ["I_QuickNav","I_WirelessCfg"]
        }
        ,Layer2Authentication : {
            nodes:["WLANClient","Layer2Authentication"],
            row:"Authentication",
            index:["ServiceTemplateName"],
            column:["AuthenticationMode","IntrusionProtectionEnable","IntrusionProtectionOperation","TemporaryServiceStopTimer","TemporaryBlockTimer","IgnoreAuthorization","AuthorizationFailOffline","Dot1xHandshakeEnable","Dot1xSecurityHandshakeEnable","Dot1xReauthenticationEnable","Dot1xMandatoryDomain","Dot1xMaxUserCount","MACAuthenticationDomain","MACAuthenticationMaxUserCount"],
            menus: ["I_QuickNav","I_WirelessCfg"]
        }
        ,IPv4PortalAut: {
            nodes: ["Portal","IPv4ServiceTemplates"],
            row: "IPv4ServiceTemplate",
            index: ["Name"],
            column:["Method","WebServer.WebServerName","WebServer.EscapeEnable","Domain","MaxUser","BasIP","EscapeSvrName","UserDetect.UserDetectType","UserDetect.UserDetectIdleTime","UserDetect.UserDetectInterval","UserDetect.UserDetectRetry"],
            menus:["I_WirelessCfg"]        
        }
        ,BandwidthGuarantee: {
            nodes:["WLANQoS","RadioBandwidthGuarantee"],
            row:"BandwidthGuarantee",
            index:["ApName","RadioID","ServiceTemplateName"],
            column:["Percent"],
            menus: ["I_WirelessCfg"]
        }
        ,GuaranteeStatus: {
            nodes:["WLANQoS","RadioBandwidthGuaranteeStatus"],
            row:"BandwidthGuarantee",
            index:["ApName","RadioID"],
            column:["Status"],
            menus: ["I_WirelessCfg"]
        }
        ,IPv4serviceTemplates: {
            nodes: ["Portal","IPv4Interfaces"],
            row: "IPv4Interface",
            index: ["IfIndex"],
            column:["OnlineUserNum","Method","WebServer.WebServerName","WebServer.EscapeEnable","Domain","MaxUser","BasIP","PreAuthPoolName","EscapeSvrName","UserDetect.UserDetectType","UserDetect.UserDetectIdleTime","UserDetect.UserDetectInterval","UserDetect.UserDetectRetry"],
            menus:["I_QuickNav","I_NetworkCfg"]        
        }
        /////////////////////////////////sys setting////////////////////////
        ,Base : {
            nodes:["Device","Base"],
            row:"",
            index:[],
            column:["Uptime","HostName","LocalTime","ClockProtocol.MDCID","ClockProtocol.Protocol","TimeZone.Zone","TimeZone.ZoneName"],
            menus: ["I_SystemCfg","I_NetworkCfg"]
        }
        ,Logs : {
            nodes:["Syslog","Logs"],
            row:"Log",
            index:["Index"],
            column:["Time","Group","Digest","Severity","Content"],
            menus: ["I_SystemCfg"]
        }
        ,ExtPhysicalEntities : {
            nodes:["Device","ExtPhysicalEntities"],
            row:"Entity",
            index:["PhysicalIndex"],
            column:["MemUsage","MemSize","PhyMemSize"],
            menus: ["I_SystemCfg"]
        }
        ,PhysicalEntities : {
            nodes:["Device","PhysicalEntities"],
            row:"Entity",
            index:["PhysicalIndex"],
            column:["HardwareRev","FirmwareRev","SoftwareRev"],
            menus: ["I_SystemCfg"]
        }
        ,CfgFileTable : {
            nodes:["Configuration","Files"],
            row:"File",
            index:["Name"],
            column:["NextMain","NextBackup","Running"],
            menus:["I_SystemCfg"]
        }
        ,DelFileTable : {
            nodes:["FileSystem","Files"],
            row:"File",
            index:["SrcName"],
            column:["Operations.Delete"],
            menus:["I_SystemCfg"]
        }
        ,Partitions : {
            nodes:["FileSystem","Partitions"],
            row:"Partition",
            index:["Name"],
            column:["Total","Free"],
            menus: ["I_SystemCfg"]
        }
        ,CfgFileTable : {
            nodes:["Configuration","Files"],
            row:"File",
            index:["Name"],
            column:["NextMain","NextBackup","Running"],
            menus:["I_SystemCfg"]
        }
        ,DelFileTable : {
            nodes:["FileSystem","Files"],
            row:"File",
            index:["SrcName"],
            column:["Operations.Delete"],
            menus:["I_SystemCfg"]
        }
        ,IPv4Ping: {
            nodes:["Ping","IPv4Ping"],
            row:"PingTest",
            index:["Host", "VRF"],
            column:[],
            menus:["I_SystemCfg"]
        }
        ,IPv4Ping_Get: {
            nodes:["Ping","IPv4Ping"],
            row:"PingTest",
            index:[],
            column:["Host", "PayloadLength", "EchoReply.IcmpSequence", "EchoReply.TTLValue", "EchoReply.ReplyTime", "TotalTransmitPacket", "TotalReceivePacket", "LossRate", "MinReplyTime", "MaxReplyTime", "AvgReplyTime", "StandardDeviation"],
            menus:["I_SystemCfg"]
        }
        ,VrfTable: {
            nodes:["L3vpn","L3vpnVRF"],
            row:"VRF",
            index:["VRF"],
            column: ["VrfIndex","Description","AssociatedInterfaceCount"],
            menus: ["I_SystemCfg"]
        }
        ,PowerCfg: {
            nodes:["RRM","PowerCfg"],
            row:"Radio",
            index:["ApName","RadioID"],
            column: ["AdjacencyFactor","PwrMin","PwrThreshold","PwrClbMode"],
            menus: ["I_WirelessCfg"]
        }
        ,PwrClbInterval: {
            nodes:["RRM","PwrClbInterval"],
            row:"",
            index:["Interval"],
            column:[],
            menus: ["I_WirelessCfg"]
        }
        ,ApChannelCfg: {
            nodes:["RRM","ApChannelCfg"],
            row:"Radio",
            index:["ApName","RadioID"],
            column: ["CrcErrThreshold","InterferenceThreshold","Toler anceLevel","ChlClbMode"],
            menus: ["I_WirelessCfg"]
        }
        ,ChlClbModeCfg: {
            nodes:["RRM","ChlClbModeCfg"],
            row:"Radio",
            index:["ApName","RadioID"],
            column:["ClbMode"],
            menus: ["I_WirelessCfg"]
        }
        ,TimeRangeNameCfg: {
            nodes:["RRM","TimeRangeNameCfg"],
            row:"Radio",
            index:["ApName","RadioID"],
            column:["TimeRangeName"],
            menus: ["I_WirelessCfg"]
        }
        ,PwrClbModeCfg: {
            nodes:["RRM","PwrClbModeCfg"],
            row:"Radio",
            index:["ApName","RadioID"],
            column:["ClbMode"],
            menus: ["I_WirelessCfg"]
        }
        ,Historys: {
            nodes:["RRM","History"],
            row:"RadioCount",
            index:["ApName","RadioID","HistoryCnt"],
            column:["ChangeTime"],
            menus: ["I_WirelessCfg"]
        }
        ,ApGroupTimeRangeNameCfg: {
            nodes:["RRM","ApGroupTimeRangeNameCfg"],
            row:"Radio",
            index:["ApGroupName","RadioID","ApModel"],
            column:["TimeRangeName"],
            menus: ["I_WirelessCfg"]
         }
        ,PerRanges: {
            nodes:["TimeRange","PerRanges"],
            row:"PerRange",
            index:["TimeRangeName","ID"],
            column:["StartTime","EndTime","DayOfWeek.Sun","DayOfWeek.Mon","DayOfWeek.Tue","DayOfWeek.Wed","DayOfWeek.Thu","DayOfWeek.Fri","DayOfWeek.Sat"],
            menus: ["I_WirelessCfg"]
        }
        ,ServiceBindings : {
            nodes:["WLANClient","ServiceBindings"],
            row:"Binding",
            index:["ApName","RadioId","ServiceTemplateName"],
            column:["Vlan"],
            menus: ["I_QuickNav","I_WirelessCfg"]
        } 
        ,Job : {
            nodes:["ModuleProxy","Job"],
            row:"",
            index:["Name"],
            column:["Command.Id","Command.CommandString"],
            menus: ["I_WirelessCfg"]
        }  
        ,Schedule : {
            nodes:["ModuleProxy","Schedule"],
            row:"",
            index:["Name"],
            column:["JobName","TimeString"],
            menus: ["I_WirelessCfg"]
        }
        /////////////////////////////////quick cfg////////////////////////
        ,Ipv4Addresses : {
            nodes:["IPV4ADDRESS","Ipv4Addresses"],
            row:"Ipv4Address",
            index:["IfIndex","Ipv4Address"],
            column:["Ipv4Mask","AddressOrigin"],
            menus: ["I_QuickNav","I_NetworkCfg"]
        },
        Global : {
            nodes:["ModuleProxy","Global"],
            row:"",
            index:[],
            column:["WorkMode","Sample","EnergySaving"],
            menus: ["I_QuickNav"]
        }
        ,GlobalConfigures : {
            nodes:["WIPS","GlobalConfigures"],
            row:"GlobalConfigure",
            index:["Type"],
            column:["State"],
            menus: ["I_SecurityPolicy"]
        }
        ,GlobalAps : {
            nodes:["WIPS","GlobalAps"],
            row:"GlobalAp",
            index:["ApName"],
            column:[],
            menus: ["I_SecurityPolicy"]
        }
        ,DRSInterfaces : {
            nodes:["DRS","Interfaces"],
            row:"Interface",
            index:["StartTime","EndTime","PktDir","Address Type","UserId","WebSiteName"],
            column:["CategoryName","Time","PktCnts","PktBytes"],
            menus: ["I_SecurityPolicy"]
        }
        ,UserSelects : {
            nodes:["DRS","UserSelects"],
            row:"UserSelect",
            index:["Address Type","UserId","UserMac"],
            column:["IsWlanClient","UserIp"],
            menus: ["I_SecurityPolicy"]
        }
        ,DrsStates : {
            nodes:["DRS","DrsStates"],
            row:"DrsState",
            index:["AddressType"],
            column:["State"],
            menus: ["I_SecurityPolicy"]
        } 
        /////////////////////////////////network cfg////////////////////////
        ,DHCPAlloc : {
            nodes:["DHCPC","DHCPAlloc"],
            row:"Alloc",
            index:["IfIndex"],
            column:["AllocEnable"],
            menus: ["I_NetworkCfg","M_NetworkInfor"]
        }
        /////////////////////////////////securitypolicy/////////////////////////
        ,WhiteList : {
            nodes:["WLANClient","WhiteList"],
            row:"MacList",
            index:["MacAddress"],
            column:[],
            menus: ["I_SecurityPolicy"]
        }
        ,StaticBlackList : {
            nodes:["WLANClient","StaticBlackList"],
            row:"MacList",
            index:["MacAddress"],
            column:[],
            menus: ["I_SecurityPolicy"]
        }
        ////////////////////////////////APP Manage//////////////////////////////
        ,ProbeRadio : {
            nodes:["WIPS","ProbeRadioConfigures"],
            row:"ProbeRadioConfigure",
            index:["ApName","RadioId"],
            column:["State"],
            menus: ["I_AppManager"]
        }
        ,Cupid : {
            nodes:["WLOC","CUPIDOfGlobal"],
            row:"",
            index:[],
            column:["Status"],
            menus: ["I_AppManager"]
        }

    }
};

Utils.Pages[MODULE_NC] = PageInfo;
})( jQuery );

