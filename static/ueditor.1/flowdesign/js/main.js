import store from '@/store'
var the_flow_id = '4';

/*页面回调执行    callbackSuperDialog
    if(window.ActiveXObject){ //IE  
        window.returnValue = globalValue
    }else{ //非IE  
        if(window.opener) {  
            window.opener.callbackSuperDialog(globalValue) ;  
        }
    }  
    window.close();
*/
function callbackSuperDialog(selectValue) {
  var aResult = selectValue.split('@leipi@');
  $('#' + window._viewField).val(aResult[0]);
  $('#' + window._hidField).val(aResult[1]);
  //document.getElementById(window._hidField).value = aResult[1];

}
/**
 * 弹出窗选择用户部门角色
 * showModalDialog 方式选择用户
 * URL 选择器地址
 * viewField 用来显示数据的ID
 * hidField 隐藏域数据ID
 * isOnly 是否只能选一条数据
 * dialogWidth * dialogHeight 弹出的窗口大小
 */
function superDialog(URL, viewField, hidField, isOnly, dialogWidth, dialogHeight) {
  dialogWidth || (dialogWidth = 620)
    , dialogHeight || (dialogHeight = 520)
    , loc_x = 500
    , loc_y = 40
    , window._viewField = viewField
    , window._hidField = hidField;
  // loc_x = document.body.scrollLeft+event.clientX-event.offsetX;
  //loc_y = document.body.scrollTop+event.clientY-event.offsetY;
  if (window.ActiveXObject) { //IE  
    var selectValue = window.showModalDialog(URL, self, "edge:raised;scroll:1;status:0;help:0;resizable:1;dialogWidth:" + dialogWidth + "px;dialogHeight:" + dialogHeight + "px;dialogTop:" + loc_y + "px;dialogLeft:" + loc_x + "px");
    if (selectValue) {
      callbackSuperDialog(selectValue);
    }
  } else {  //非IE 
    var selectValue = window.open(URL, 'newwindow', 'height=' + dialogHeight + ',width=' + dialogWidth + ',top=' + loc_y + ',left=' + loc_x + ',toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');

  }
}



$(function () {
  var alertModal = $('#alertModal'), attributeModal = $("#attributeModal");
  //消息提示
  var mAlert = function (messages, s) {
    if (!messages) messages = "";
    if (!s) s = 2000;
    alertModal.find(".modal-body").html(messages);
    alertModal.modal('toggle');
    setTimeout(function () { alertModal.modal("hide") }, s);
  }

  //属性设置
  attributeModal.on("hidden", function () {
    $(this).removeData("modal");//移除数据，防止缓存
  });
  var ajaxModal = function (url, fn) {
    console.log(attributeModal)
    url += url.indexOf('?') ? '&' : '?';
    url += '_t=' + new Date().getTime();
    attributeModal.find(".modal-body").html('<img src="Public/images/loading.gif"/>');
    attributeModal.modal({
      remote: url
    });

    //加载完成执行
    if (fn) {
      attributeModal.on('shown', fn);
    }
  }


  // }
  //刷新页面
  function page_reload() {
    console.log("刷新")
    location.reload();
  }
  /*
  php 命名习惯 单词用下划线_隔开
  js 命名习惯：首字母小写 + 其它首字线大写
  */
  /*步骤数据*/
  var processData = store.state.processData
  /*创建流程设计器*/
  var _canvas = $("#flowdesign_canvas").Flowdesign({
    "processData": processData
    /*,mtAfterDrop:function(params)
    {
        //alert("连接："+params.sourceId +" -> "+ params.targetId);
    }*/
    /*画面右键*/
    , canvasMenus: {
      "cmAdd": function (t) {
        var mLeft = $("#jqContextMenu").css("left"), mTop = $("#jqContextMenu").css("top");

        /*重要提示 start*/
        // alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
        /*重要提示 end */
        let data = { // 新建模板
          info: {
            'id': '5320', // 自定义id
            'flow_id': 1106, // 表单id
            'process_name': '新建步骤', // 步骤名称
            'process_to': '', // 下一个节点
            'icon': '', //图标
            'style': 'left:' + mLeft + ';top:' + mTop + ';color:#0e76a8;' // 样式
          }
        }
        _canvas.addProcess(data.info)
      },
      "cmSave": function (t) {
        var processInfo = _canvas.getProcessInfo();//连接信息
        console.log(processInfo)
      },
      //刷新
      "cmRefresh": function (t) {
        location.reload();//_canvas.refresh();
      }

    }
    /*步骤右键*/
    , processMenus: {
      "pmDelete": function (t) {
        if (confirm("你确定删除步骤吗？")) {
          var activeId = _canvas.getActiveId();//右键当前的ID
          console.log(activeId)
          //清除步骤
          _canvas.delProcess(activeId);
          //清除连接   暂时先保存设计 + 刷新 完成
          var processInfo = _canvas.getProcessInfo();//连接信息
          console.log(processInfo)
          location.reload();
        }
      },
      "pmAttribute": function (t) {
        var activeId = _canvas.getActiveId();//右键当前的ID
        /*重要提示 start*/
        // alert("这里要使用程序处理，并非简单html页面，如果无法显示，请建立虚拟站点");
        /*重要提示 end */
        //var url = "/index.php?s=/Flowdesign/attribute/id/"+activeId+".html";
        var url = '/myDemo/FlowdesignV3_0/FlowdesignV3_0/Public/js/flowdesign/attribute.html?id=' + activeId;
        ajaxModal(url, function () {
          //alert('加载完成执行')
        });
      },
      "pmForm": function (t) {
        var activeId = _canvas.getActiveId();//右键当前的ID

        /*重要提示 start*/
        // alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
        /*重要提示 end */

        var url = "/index.php?s=/Flowdesign/attribute/op/form/id/" + activeId + ".html";
        ajaxModal(url, function () {
          //alert('加载完成执行')
        });
      },
      "pmJudge": function (t) {
        var activeId = _canvas.getActiveId();//右键当前的ID

        /*重要提示 start*/
        // alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
        /*重要提示 end */

        var url = "/index.php?s=/Flowdesign/attribute/op/judge/id/" + activeId + ".html";
        ajaxModal(url, function () {
          //alert('加载完成执行')
        });
      },
      "pmSetting": function (t) {
        var activeId = _canvas.getActiveId();//右键当前的ID

        /*重要提示 start*/
        // alert("这里要使用程序处理，并非简单html页面，如果无法显示，请建立虚拟站点");
        /*重要提示 end */

        //var url = "/index.php?s=/Flowdesign/attribute/op/style/id/"+activeId+".html";
        var url = 'Public/js/flowdesign/attribute.html?id=' + activeId;
        ajaxModal(url, function () {
          //alert('加载完成执行')
        });
      }
    }
    , fnRepeat: function () {
      //alert("步骤连接重复1");//可使用 jquery ui 或其它方式提示
      mAlert("步骤连接重复了，请重新连接");

    }
    , fnClick: function () {
      var activeId = _canvas.getActiveId();
      mAlert("查看步骤信息 " + activeId);
    }
    , fnDbClick: function () {
      //和 pmAttribute 一样
      var activeId = _canvas.getActiveId();//右键当前的ID

      /*重要提示 start*/
      // alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
      /*重要提示 end */

      var url = "/index.php?s=/Flowdesign/attribute/id/" + activeId + ".html";
      ajaxModal(url, function () {
        //alert('加载完成执行')
      });
    }
  });



  /*保存*/
  $("#leipi_save").bind('click', function () {
    var processInfo = _canvas.getProcessInfo();//连接信息

    /*重要提示 start*/
    // alert("这里使用ajax提交，请参考官网示例，可使用Fiddler软件抓包获取返回格式");
    /*重要提示 end */


    var url = "/index.php?s=/Flowdesign/save_canvas.html";
    $.post(url, { "flow_id": the_flow_id, "process_info": processInfo }, function (data) {
      mAlert(data.msg);
    }, 'json');
  });
  /*清除*/
  $("#leipi_clear").bind('click', function () {
    if (_canvas.clear()) {
      //alert("清空连接成功");
      mAlert("清空连接成功，你可以重新连接");
    } else {
      //alert("清空连接失败");
      mAlert("清空连接失败");
    }
  });
});
export { page_reload }
