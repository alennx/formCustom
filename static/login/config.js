function getServerInfoConfig () {
  var con = {
    sso_ip: '58.16.181.23',
    // sso_ip: '59.215.128.12',
    sso_port: '10086'
  }
  var host = window.location.host
  if (host.indexOf('192') === -1 && host.indexOf('localhost') === -1) {
    con.sso_ip = window.location.hostname
    con.sso_port = window.location.port
  }
  return con
}

const serverInfoConfig = getServerInfoConfig()
const loginConfig = {
  sso_login_url: `http://${serverInfoConfig.sso_ip}:${serverInfoConfig.sso_port}/gaxq-center/slogin`,
  sso_validate_url: `http://${serverInfoConfig.sso_ip}:${serverInfoConfig.sso_port}/gaxq-center/svalidate`,
  sso_logout_url: `http://${serverInfoConfig.sso_ip}:${serverInfoConfig.sso_port}/gaxq-center`,
  homeManage_local_service_url: 'gaxq-homeManage/index.html',
  formCustom_local_service_url: 'gaxq-formCustom/index.html',
  processConnect_local_service_url: 'gaxq-processConnect/index.html',
  'gaxq-homeManage_appKey': 'PyzR4Wxrn1jp0yHX0wdb8fZQVJjOltNytPJbvafetz6V5SHcftxgRspddaR5xQzYf.8CttT.jVvkHpldt5lbv5ruPrv.brhuu.gjTrOMPHBsQM3',
  'gaxq-formCustom_appKey': 'p253putWZobH5vFyzePxpnnmpvlitUT.BkjNvnvqpUxfXnDz1xBBs',
  'gaxq-processConnect_appKey': 'xh4G8u2ejkjhfvnqpwpSnpb_L6v_Tw6wj7Nx5Dvs6qdyd2B8OfaAR'
}

export default loginConfig
