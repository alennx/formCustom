/*

*/
(function ($) {
  /*Flowdesign 命名纯粹为了美观，而不是 formDesign */
  $.fn.Flowdesign = function (options) {
    var defaults = {
      processData: {},//步骤节点数据
      //processUrl:'',//步骤节点数据
      fnRepeat: function () {
        console.log('步骤连接重复')
      },
      fnClick: function () {
        console.log('单击')
      },
      fnDbClick: function () {
        console.log('双击')
      },
      canvasMenus: {
        "one": function (t) { console.log('画面右键') }
      },
      processMenus: {
        "one": function (t) { console.log('步骤右键') }
      },
      /*右键菜单样式*/
      menuStyle: {
        border: '1px solid #5a6377',
        minWidth: '150px',
        padding: '5px 0'
      },
      itemStyle: {
        fontFamily: 'verdana',
        color: '#333',
        border: '0',
        /*borderLeft:'5px solid #fff',*/
        padding: '5px 40px 5px 20px'
      },
      itemHoverStyle: {
        border: '0',
        /*borderLeft:'5px solid #49afcd',*/
        color: '#fff',
        backgroundColor: '#5a6377'
      },
      mtAfterDrop: function (params) {
        //alert('连接成功后调用');
        //alert("连接："+params.sourceId +" -> "+ params.targetId);
      },
      //这是连接线路的绘画样式
      connectorPaintStyle: {
        lineWidth: 3,
        strokeStyle: "#49afcd",
        joinstyle: "round"
      },
      //鼠标经过样式
      connectorHoverStyle: {
        lineWidth: 3,
        strokeStyle: "#da4f49"
      }

    };/*defaults end*/
    var initEndPoints = function () {
      $(".process-flag").each(function (i, e) {
        var p = $(e).parent();
        jsPlumb.makeSource($(e), {
          parent: p,
          anchor: "Continuous",
          endpoint: ["Dot", { radius: 1 }],
          connector: ["Flowchart", { stub: [5, 5] }],
          connectorStyle: defaults.connectorPaintStyle,
          hoverPaintStyle: defaults.connectorHoverStyle,
          dragOptions: {},
          maxConnections: -1
        });
      });
    }

    /*设置隐藏域保存关系信息*/
    var aConnections = [];
    var setConnections = function (conn, remove) {
      if (!remove) aConnections.push(conn);
      else {
        var idx = -1;
        for (var i = 0; i < aConnections.length; i++) {
          if (aConnections[i] == conn) {
            idx = i; break;
          }
        }
        if (idx != -1) aConnections.splice(idx, 1);
      }
      if (aConnections.length > 0) {
        var s = "";
        for (var j = 0; j < aConnections.length; j++) {
          var from = $('#' + aConnections[j].sourceId).attr('process_id');
          var target = $('#' + aConnections[j].targetId).attr('process_id');
          s = s + "<input type='hidden' value=\"" + from + "," + target + "\">";
        }
        $('#process_info').html(s);
      } else {
        $('#process_info').html('');
      }
      jsPlumb.repaintEverything();//重画
    };
    // defaults.processData = options.processData
    var _canvas = $(this);
    //右键步骤的步骤号
    _canvas.append('<input type="hidden" id="leipi_active_id" value="0"/><input type="hidden" id="leipi_copy_id" value="0"/>');
    _canvas.append('<div id="process_info"></div>');


    /*配置*/
    $.each(options, function (i, val) {
      if (typeof val == 'object' && defaults[i])
        $.extend(defaults[i], val);
      else
        defaults[i] = val;
    });
    /*画布右键绑定*/
    var contextmenu = {
      bindings: defaults.canvasMenus,
      menuStyle: defaults.menuStyle,
      itemStyle: defaults.itemStyle,
      itemHoverStyle: defaults.itemHoverStyle
    }
    $(this).contextMenu('canvasMenu', contextmenu);

    jsPlumb.importDefaults({
      DragOptions: { cursor: 'pointer' },
      EndpointStyle: { fillStyle: '#225588' },
      Endpoint: ["Dot", { radius: 1 }],
      ConnectionOverlays: [
        ["Arrow", { location: 1 }],
        ["Label", {
          location: 0.1,
          id: "label",
          cssClass: "aLabel"
        }]
      ],
      Anchor: 'Continuous',
      ConnectorZIndex: 5,
      HoverPaintStyle: defaults.connectorHoverStyle
    });
    if ($.browser.msie && $.browser.version < '9.0') { //ie9以下，用VML画图
      jsPlumb.setRenderMode(jsPlumb.VML);
    } else { //其他浏览器用SVG
      jsPlumb.setRenderMode(jsPlumb.SVG);
    }


    //初始化原步骤(有历史数据时候渲染)
    var lastProcessId = 0;
    var processData = defaults.processData;
    var canWidth = $("#flowdesign_canvas").width(), canHeight = $("#flowdesign_canvas").height();
    if (processData.list) {
      $.each(processData.list, function (i, row) {
        var nodeDiv = document.createElement('div');
        var nodeId = "node" + row.id, badge = 'badge-inverse', icon = 'icon-star';
        var style = '', mLeft = 0, mTop = 0;
        if (lastProcessId == 0)//第一步
        {
          badge = 'badge-info';
          icon = 'icon-play';
        }
        if (row.icon) {
          icon = row.icon;
        }
        if (row.defaultWH) {
          let deviationWidth = (100 / row.defaultWH.width).toFixed(2) - (100 / canWidth).toFixed(2);
          let deviationHeight = (100 / row.defaultWH.height).toFixed(2) - (100 / canHeight).toFixed(2);
          if (row.defaultWH.left !== 0) {
            if (deviationWidth > 0.05) {
              mLeft = canWidth * ((row.defaultWH.left / row.defaultWH.width) + deviationWidth)
            } else if (deviationWidth < 0) {
              mLeft = canWidth * ((row.defaultWH.left / row.defaultWH.width) + deviationWidth)
            } else {
              mLeft = canWidth * (row.defaultWH.left / row.defaultWH.width)
            }
          } else {
            mLeft = 0
          }
          // if (mLeft < 0) mLeft = 0
          if (mLeft > canWidth) mLeft = canWidth - 100
          if (row.defaultWH.top !== 0) {
            if (deviationHeight > 0.05) {
              mTop = canHeight * ((row.defaultWH.top / row.defaultWH.height) + deviationHeight)
            } else if (deviationHeight < 0) {
              mTop = canHeight * ((row.defaultWH.top / row.defaultWH.height) - deviationHeight)
            } else {
              mTop = canHeight * (row.defaultWH.top / row.defaultWH.height)
            }
          } else {
            mTop = 0
          }
          // if (mTop < 0) mTop = 0
          if (mTop > canHeight) mTop = canHeight - 26
          style = 'left:' + mLeft + 'px;top:' + mTop + 'px;color:#0e76a8;'
        }
        $(nodeDiv).attr("id", nodeId)
          .attr("style", style)
          // .attr("style", row.style)
          .attr("process_to", row.process_to)
          .attr("process_id", row.id)
          .addClass("process-step btn btn-small")
          .html('<span class="process-flag badge ' + badge + '"><i class="' + icon + ' icon-white"></i></span>&nbsp;' + row.process_name)
          // .html('<span class="process-flag badge ' + badge + '"></span>' + row.process_name)
          .mousedown(function (e) {
            if (e.which == 3) { //右键绑定
              _canvas.find('#leipi_active_id').val(row.id);
              contextmenu.bindings = defaults.processMenus
              $(this).contextMenu('processMenu', contextmenu);
            }
          });
        _canvas.append(nodeDiv);
        //索引变量
        lastProcessId = row.id;
      });//each
    }

    var timeout = null;
    //点击或双击事件,这里进行了一个单击事件延迟，因为同时绑定了双击事件
    $(".process-step").live('click', function () {
      //激活
      _canvas.find('#leipi_active_id').val($(this).attr("process_id")),
        clearTimeout(timeout);
      var obj = this;
      timeout = setTimeout(defaults.fnClick, 300);
    }).live('dblclick', function () {
      clearTimeout(timeout);
      defaults.fnDbClick();
    });
    //使之可拖动
    jsPlumb.draggable(jsPlumb.getSelector(".process-step"), {
      containment: jsPlumb.getSelector(".process-step").parent() // 限定拖拽区域
    });
    initEndPoints();

    //绑定添加连接操作。画线-input text值  拒绝重复连接
    jsPlumb.bind("jsPlumbConnection", function (info) {
      setConnections(info.connection)
    });
    //绑定删除connection事件
    jsPlumb.bind("jsPlumbConnectionDetached", function (info) {
      setConnections(info.connection, true);
    });
    //绑定删除确认操作
    jsPlumb.bind("click", function (c) {
      if (!window.delObj) window.delObj = {}
      if (!window.delObj[c.id]) {
        if (confirm("你确定取消连接吗?"))
        jsPlumb.detach(c);
        window.delObj[c.id] = c
      }
      setTimeout(() => {
        window.delObj[c.id] = null
      }, 500);
    });
    //连接成功回调函数
    function mtAfterDrop(params) {
      defaults.mtAfterDrop({ sourceId: $("#" + params.sourceId).attr('process_id'), targetId: $("#" + params.targetId).attr('process_id') });
    }
    jsPlumb.makeTarget(jsPlumb.getSelector(".process-step"), {
      dropOptions: { hoverClass: "hover", activeClass: "active" },
      anchor: "Continuous",
      maxConnections: -1,
      endpoint: ["Dot", { radius: 1 }],
      paintStyle: { fillStyle: "#ec912a", radius: 1 },
      hoverPaintStyle: this.connectorHoverStyle,
      beforeDrop: function (params) {
        if (params.sourceId == params.targetId) return false;/*不能链接自己*/
        var j = 0;
        $('#process_info').find('input').each(function (i) {
          var str = $('#' + params.sourceId).attr('process_id') + ',' + $('#' + params.targetId).attr('process_id');
          if (str == $(this).val()) {
            j++;
            return;
          }
        })
        if (j > 0) {
          defaults.fnRepeat();
          return false;
        } else {
          mtAfterDrop(params);
          return true;
        }
      }
    });
    //reset  start
    var _canvas_design = function () {
      //连接关联的步骤
      $('.process-step').each(function (i) {
        try {
          var sourceId = $(this).attr('process_id');
          // var nodeId = "node"+id;
          var prcsto = $(this).attr('process_to');
          var toArr = prcsto.split(",");
          var processData = defaults.processData;
          $.each(toArr, function (j, targetId) {
            if (targetId != '' && targetId != 0) {
              //检查 source 和 target是否存在
              var is_source = false, is_target = false;
              if (processData.list) {
                $.each(processData.list, function (i, row) {
                  if (row.id == sourceId) {
                    is_source = true;
                  } else if (row.id == targetId) {
                    is_target = true;
                  }
                  if (is_source && is_target)
                    return true;
                });
              }
              if (is_source && is_target) {
                jsPlumb.connect({ // 连接内容
                  source: "node" + sourceId, // 开始点
                  target: "node" + targetId // 目的点
                  /* ,labelStyle : { cssClass:"component label" }
                   ,label : id +" - "+ n*/
                });
                // return;
              }
            }
          })
        }
        catch (err) {
          // location.reload()
          console.log(err)
        }
      });

      //使之可拖动
      jsPlumb.draggable(jsPlumb.getSelector(".process-step"), {
        containment: jsPlumb.getSelector(".process-step").parent() // 限定拖拽区域
      });
    }//_canvas_design end reset 
    _canvas_design();

    //-----外部调用----------------------
    var bindEvent = function (dom, eventName, listener) {
      if (dom.attachEvent) {
        dom.attachEvent('on' + eventName, listener);
      } else {
        dom.addEventListener(eventName, listener);
      }
    }
    var Flowdesign = {
      addProcess: function (row) { //添加流程
        if (row.id <= 0) {
          return false;
        }
        var nodeDiv = document.createElement('div');
        var nodeId = "node" + row.id, badge = 'badge-inverse', icon = 'icon-star';

        if (row.icon) {
          icon = row.icon;
        }
        $(nodeDiv).attr("id", nodeId)
          .attr("style", row.style)
          .attr("process_to", row.process_to)
          .attr("process_id", row.id)
          .addClass("process-step btn btn-small")
          .html('<span class="process-flag badge ' + badge + '"><i class="' + icon + ' icon-white"></i></span>&nbsp;' + row.process_name)
          // .html('<span class="process-flag badge ' + badge + '"></span>' + row.process_name)
          .mousedown(function (e) {
            if (e.which == 3) { //右键绑定
              _canvas.find('#leipi_active_id').val(row.id);
              contextmenu.bindings = defaults.processMenus
              $(this).contextMenu('processMenu', contextmenu);
            }
          });

        _canvas.append(nodeDiv);
        jsPlumb.draggable(jsPlumb.getSelector(".process-step"), {
          containment: jsPlumb.getSelector(".process-step").parent() // 限定拖拽区域
        });
        initEndPoints();
        //使可以连接线
        jsPlumb.makeTarget(jsPlumb.getSelector(".process-step"), {
          dropOptions: { hoverClass: "hover", activeClass: "active" },
          anchor: "Continuous",
          maxConnections: -1,
          endpoint: ["Dot", { radius: 1 }],
          paintStyle: { fillStyle: "#ec912a", radius: 1 },
          hoverPaintStyle: this.connectorHoverStyle,
          beforeDrop: function (params) {
            var j = 0;
            $('#process_info').find('input').each(function (i) {
              var str = $('#' + params.sourceId).attr('process_id') + ',' + $('#' + params.targetId).attr('process_id');
              if (str == $(this).val()) {
                j++;
                return;
              }
            })
            if (j > 0) {
              defaults.fnRepeat();
              return false;
            } else {
              return true;
            }
          }
        });
        // _canvas_design();  注释掉重连线，会造成多连的bug
        return true;
      },
      delProcess: function (activeId) { // 删除流程
        if (activeId <= 0) return false;
        $("#node" + activeId).remove();
        let delNum = 0;
        $("#process_info input[type=hidden]").each(function (i) {
          var processVal = $(this).val().split(",");
          processVal.forEach(item => {
            if (activeId === item) {
              $("#process_info").find("input[type=hidden]")[i - delNum].remove()
              delNum++
            }
          })
        })
        return true;
      },
      getActiveId: function () {
        return _canvas.find("#leipi_active_id").val();
      },
      copy: function (active_id) {
        if (!active_id)
          active_id = _canvas.find("#leipi_active_id").val();

        _canvas.find("#leipi_copy_id").val(active_id);
        return true;
      },
      paste: function () {
        return _canvas.find("#leipi_copy_id").val();
      },
      getProcessInfo: function () {
        try {
          /*连接关系*/
          var aProcessData = {};
          $("#process_info input[type=hidden]").each(function (i) {
            var processVal = $(this).val().split(",");
            if (processVal.length == 2) {
              if (!aProcessData[processVal[0]]) {
                aProcessData[processVal[0]] = { "top": 0, "left": 0, "process_to": [] };
              }
              aProcessData[processVal[0]]["process_to"].push(processVal[1]);
            }
          })
          /*位置*/
          let arr = {}, pIdObj = {};
          _canvas.find("div.process-step").each(function (i) { //生成Json字符串，发送到服务器解析
            if ($(this).attr('id')) {
              var pId = $(this).attr('process_id');
              var pLeft = parseInt($(this).css('left'));
              var pTop = parseInt($(this).css('top'));
              pIdObj[pId] = true
              if (!aProcessData[pId]) {
                aProcessData[pId] = { "top": 0, "left": 0, "process_to": [] };
              }
              // aProcessData[pId]["top"] = (pTop / $('#flowdesign_canvas').height())*100;
              // aProcessData[pId]["left"] = (pLeft / $('#flowdesign_canvas').width())*100;
              aProcessData[pId]["top"] = pTop;
              aProcessData[pId]["left"] = pLeft;
            }
          })
          console.log($("#process_info input[type=hidden]"))
          console.log(aProcessData)
          return JSON.stringify(aProcessData);
        } catch (e) {
          return '';
        }
      },
      clear: function () {
        try {
          $('#flowdesign_canvas').html('');
          jsPlumb.deleteEveryEndpoint();
          jsPlumb.detachEveryConnection();
          jsPlumb.repaintEverything();
          _canvas_design();
          return true;
        } catch (e) {
          return false;
        }
      }, 
      refresh: function () {
        try {
          //jsPlumb.reset();
          this.clear();
          // _canvas_design();
          return true;
        } catch (e) {
          return false;
        }
      }
    };
    return Flowdesign;
  }//$.fn
})(jQuery);