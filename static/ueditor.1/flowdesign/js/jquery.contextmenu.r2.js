/*
 * ContextMenu - jQuery plugin for right-click context menus
 *
 * Author: Chris Domigan
 * Contributors: Dan G. Switzer, II
 * Parts of this plugin are inspired by Joern Zaefferer's Tooltip plugin
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Version: r2
 * Date: 16 July 2007
 *
 * For documentation visit http://www.trendskitchens.co.nz/jquery/contextmenu/
 *
 */

(function($) {
 	var menu, shadow, trigger, content, hash, currentTarget;
  var defaults = {
    menuStyle: {
      listStyle: 'none',
      padding: '1px',
      margin: '0px',
      backgroundColor: '#fff',
      border: '1px solid #999',
      width: '100px'
    },
    itemStyle: {
      margin: '0px',
      color: '#000',
      display: 'block',
      cursor: 'default',
      padding: '3px',
      border: '1px solid #fff',
      backgroundColor: 'transparent'
    },
    itemHoverStyle: {
      border: '1px solid #0a246a',
      backgroundColor: '#b6bdd2'
    },
    eventPosX: 'offsetX',
    eventPosY: 'offsetY',
    // eventPosX: 'pageX',
    // eventPosY: 'pageY',
    shadow : true,
    onContextMenu: null,
    onShowMenu: null
 	};
  $.fn.contextMenu = function(id, options) {
    if ($("#jqContextMenu").length === 0) { // 判断右键菜单不存在时
      menu = null;
      hash = []
    }
    if (!menu) { // Create singleton menu
      menu = $('<div id="jqContextMenu"></div>')
               .hide()
               .css({position:'absolute', zIndex:'500'})
                .appendTo('#flowdesign_canvas')
               .bind('click', function(e) {
                 e.stopPropagation();
               });
    }
    if (!shadow) {
      shadow = $('<div></div>')
                 .css({backgroundColor:'#000',position:'absolute',opacity:0.2,zIndex:499})
                .appendTo('#flowdesign_canvas')
                 .hide();
    }
    hash = hash || [];
    hash.push({
      id: id,
      menuStyle: $.extend({}, defaults.menuStyle, options.menuStyle || {}),
      itemStyle: $.extend({}, defaults.itemStyle, options.itemStyle || {}),
      itemHoverStyle: $.extend({}, defaults.itemHoverStyle, options.itemHoverStyle || {}),
      bindings: options.bindings || {},
      shadow: options.shadow || options.shadow === false ? options.shadow : defaults.shadow,
      onContextMenu: options.onContextMenu || defaults.onContextMenu,
      onShowMenu: options.onShowMenu || defaults.onShowMenu,
      eventPosX: options.eventPosX || defaults.eventPosX,
      eventPosY: options.eventPosY || defaults.eventPosY
    });
    var index = hash.length - 1;
    $(this).bind('contextmenu', function(e) {
      if (index !== 0 && hash[index]) {
        hash[index].eventPosX = 'offsetLeft'
        hash[index].eventPosY = 'offsetTop'
      }
      // Check if onContextMenu() defined
      var bShowContext = (!!hash[index].onContextMenu) ? hash[index].onContextMenu(e) : true;
      if (bShowContext) display(index, this, e, options);
      return false;
    });
    return this;
  };

  function display(index, trigger, e, options) {
    var cur = hash[index];
    content = $('#'+cur.id).find('ul:first').clone(true);
    content.css(cur.menuStyle).find('li').css(cur.itemStyle).hover(
      function() {
        $(this).css(cur.itemHoverStyle);
      },
      function(){
        $(this).css(cur.itemStyle);
      }
    ).find('img').css({verticalAlign:'middle',paddingRight:'2px'});
    // Send the content to the menu
    menu.html(content);

    // if there's an onShowMenu, run it now -- must run after content has been added
		// if you try to alter the content variable before the menu.html(), IE6 has issues
		// updating the content
    if (!!cur.onShowMenu) menu = cur.onShowMenu(e, menu);

    $.each(cur.bindings, function(id, func) {
      $('#'+id, menu).bind('click', function(e) {
        hide();
        func(trigger, currentTarget);
      });
    });
    var explorer = window.navigator.userAgent // 判断浏览器
    var nodeName = ''
    if (explorer.indexOf("Firefox") >= 0) { // 判断为火狐浏览器时候
      nodeName = e.srcElement.nodeName
    } else { // 判断为其他浏览器时候
      nodeName = e.toElement.nodeName
    }
    if (index !== 0) { // 判断鼠标右键选择的div-0：空白
      menu.css({ 'left': $(trigger)[0].offsetLeft, 'top': $(trigger)[0].offsetTop + $(trigger)[0].offsetHeight }).show();
      if (cur.shadow) shadow.css({ width: menu.width(), height: menu.height(), left: $(trigger)[0].offsetLeft + 2, top: $(trigger)[0].offsetTop + $(trigger)[0].offsetHeight + 2 }).show();
    } else {
      if (nodeName === 'path') {
        menu.css({ 'left': e.toElement.parentElement.style.left, 'top': e.toElement.parentElement.style.top }).show();
        if (cur.shadow) shadow.css({ width: menu.width(), height: menu.height(), left: e.toElement.parentElement.style.left, top: e.toElement.parentElement.style.top }).show();
      } else {
        menu.css({ 'left': e[cur.eventPosX], 'top': e[cur.eventPosY] }).show();
        if (cur.shadow) shadow.css({ width: menu.width(), height: menu.height(), left: e.offsetX + 2, top: e.offsetY + 2 }).show();
      }
    }
    $(document).one('click', hide);
  }

  function hide() {
    menu.hide();
    shadow.hide();
  }

  // Apply defaults
  $.contextMenu = {
    defaults : function(userDefaults) {
      $.each(userDefaults, function(i, val) {
        if (typeof val == 'object' && defaults[i]) {
          $.extend(defaults[i], val);
        }
        else defaults[i] = val;
      });
    }
  };

})(jQuery);

$(function() {
  $('div.contextMenu').hide();
});