define("widget/formFill/1.0.0/formFill-debug", [ "$-debug" ], function(require, exports, module) {
    var jQuery = require("$-debug"), $ = jQuery;
    var formFill = {
        init: function(o) {
            this.url = o.url;
            this.type = o.type || "getJSON";
            this.param = o.param;
            this.form = $(o.form);
            this.depth = o.depth;
            this.cite = o.cite || "";
            this.isCreate = o.isCreate;
            // 如果没有找到json中对应的字段名，就去创建一个
            this.callback = o.callback;
            // callfn
            this.fillLine = o.fillLine;
            // function
            this.MAP = o.map;
            // 可能存在多种映射map必须为数组 字段映射关系 比如：Y,N 是/否   本来这里是用数组array的，但考虑遍历性能方面的问题，还是用对象吧{a:{a:'',b:''},aa:{...}}
            // 后来修改添加的，有一些场景不是请求后端的数据，而是由前端自己组装数据、自己填充数据15-09-29
            this.url ? this.getData() : this.fillVal(this.param);
            return this.form;
        },
        getData: function() {
            var This = this, O = $.extend({
                _: +new Date()
            }, this.param), cite = "data." + this.cite;
            $[This.type](this.url, O, function(data) {
                This.fillVal(cite.length > 5 ? eval(cite) : data);
            }, "JSON");
        },
        fillVal: function(data) {
            var This = this, elesort = function(obj, name, val) {
                var tagname = obj.length && obj.prop("nodeName").toLowerCase(), type = obj.attr("type"), result;
                if (tagname === "input") {
                    result = type;
                } else if (tagname) {
                    result = tagname;
                } else {
                    if (This.isCreate) {
                        This.form.append('<input type="hidden" name="' + name + '" value="' + val + '">');
                        window.console && console.log(name + " Element is Null,creating...");
                    } else {
                        window.console && console.log(name + " Element is Null,need create!");
                    }
                }
                return result;
            }, iscomplete = true, setVal = function(ele, key, dataval) {
                switch (elesort(ele, key, dataval)) {
                  case "text":
                    ele.val(dataval);
                    break;

                  case "hidden":
                    ele.val(dataval);
                    break;

                  case "url":
                    ele.val(dataval);
                    break;

                  case "email":
                    ele.val(dataval);
                    break;

                  case "tel":
                    ele.val(dataval);
                    break;

                  case "textarea":
                    ele.val(dataval);
                    break;

                  case "checkbox":
                    ele.filter('[value="' + dataval + '"]').prop("checked", true);
                    break;

                  // 单个值走这里，如果checkbox是array就会走下面语句
                    case "radio":
                    ele.filter('[value="' + dataval + '"]').prop("checked", true);
                    break;

                  /*case 'select': 
                        var option = ele.find('[value="'+dataval+'"]').length ? ele.find('[value="'+dataval+'"]') : ele.find(':contains('+dataval+')');
                            option.prop('selected', true);
                    break;*/
                    case "select":
                    ele.val(dataval);
                    break;

                  default:
                    ele.text(dataval);
                    break;
                }
            };
            // 是否深度赋值
            // 深度赋值是以带name元素为核心，否则是以数据为核心的
            if (This.depth === true) {
                This.form.find('[name!=""]').each(function(i, ele) {
                    ele = $(ele);
                    var KEY = $.trim(ele.attr("name"));
                    if (KEY) {
                        var _V = "";
                        try {
                            _V = eval("data." + KEY);
                        } catch (e) {
                            window.console && console.log(KEY + " fail");
                        }
                        try {
                            // 映射关系处理
                            _V = This.MAP ? eval("This.MAP." + KEY)[_V] || _V : _V;
                        } catch (e) {
                            window.console && console.log(KEY + " fail");
                        }
                        if (typeof _V !== "object") {
                            setVal(ele, KEY, _V);
                        } else {
                            typeof This.fillLine === "function" && This.fillLine.call(ele, _V, KEY);
                        }
                    }
                });
            } else {
                for (var i in data) {
                    var dataval = data[i], ele = this.form.find('[name="' + i + '"]');
                    if (dataval === true || dataval === false || dataval === null) {
                        dataval += "";
                    }
                    // 映射关系处理
                    dataval = This.MAP && This.MAP[i] ? This.MAP[i][dataval] || dataval : dataval;
                    if (typeof dataval !== "object") {
                        setVal(ele, i, dataval);
                    } else if (dataval instanceof Array) {
                        // 到这一步，考虑到表格列表行数据，第一个td或许有checkbox最后一个td或许有操作等不定的因素。所以这块目前考虑回调，自己定义方法处理
                        //for(var j=0,l=iarr.length; j<l; j++){...}
                        // 不知道模板格式样子，在此处留了一个后台勾子，开发自定义去写吧，注意fillter返回标签代码string类型
                        typeof this.fillLine === "function" && this.fillLine.call(ele, dataval, i);
                    } else {
                        iscomplete = false;
                        window.console && console.log("warning: json layout!");
                    }
                }
            }
            typeof this.callback === "function" && this.callback.apply(this.form, [ iscomplete ]);
        }
    };
    module.exports = formFill;
});
