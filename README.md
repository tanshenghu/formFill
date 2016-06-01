## `formFill` By TanShenghu

<br>

**formFill方法就是通过后端返回的json数据，对号入座填充至表单的每一个文本域中**

<br>

---

> - 该方法最初是在聚划算做淘宝电影时所写
> - 该方法作用点在于，前端通过某个事件向后端发起一个(rpc)请求，后端响应之后抛给前端json数据，前端把这些json数据通过key=>value的形式填充到表单的文本域中
> - 需要注意的就是表单文本域的name属性值，这里的name值是需要跟后端过来的json对象里面key名一致，才能对号入座。

---

[demo](http://www.tanshenghu.com/widget/formFill/examples/formFill.html)

## html


````html
<form id="myform">
	<div>
		<label>用户名：</label>
		<input type="text" name="username">
	</div>
	<div>
		<label>性别：</label>
		<input type="radio" name="sex" value="男">男
		<input type="radio" name="sex" value="女">女
	</div>
	<div>
		<label>您是否喜欢国术：</label>
		<select name="kung_fu">
			<option value="yes">yes</option>
			<option value="no">no</option>
		</select>
	</div>
	<div class="hobby">
		<label>兴趣好爱：</label>
		<label><input type="checkbox" name="hobby" value="咏春拳">咏春拳</label> 
		<label><input type="checkbox" name="hobby" value="陈式太极">陈式太极</label> 
		<label><input type="checkbox" name="hobby" value="八卦掌">八卦掌</label> 
		<label><input type="checkbox" name="hobby" value="形意拳">形意拳</label> 
		<label><input type="checkbox" name="hobby" value="洪拳">洪拳</label> 
		<label><input type="checkbox" name="hobby" value="铁线拳">铁线拳</label> 
		<label><input type="checkbox" name="hobby" value="蔡李佛">蔡李佛</label> 
		<label><input type="checkbox" name="hobby" value="自然门">自然门</label> 
		<label><input type="checkbox" name="hobby" value="截拳道">截拳道</label> 
	</div>
	<div>
		<label>备注：</label>
		<textarea name="remark"></textarea>
	</div>
	<p align="center"><input type="button" value="提 交"></p>
</form>
````


## json数据


```javascript
{
	"content":
	{
		"username":"tanshenghu",
		"sex":"男",
		"remark":"程序猿 - 前端攻城狮！",
		"tblname":[
			{"company":"炎黄新星","nature":"民营公司","people":"1000人"},
			{"company":"中软国际","nature":"外包公司","people":"10000人"},
			{"company":"文思海辉","nature":"外包公司","people":"10000人"}
		]
	},
	"hasError":false
}
```


## javascript


```javascript
seajs.use(['$','formFill'], function($, formFill) {
	
		
	formFill.init({
		url: '/data.json', // 接口地址
		param: {"id":10}, // 接口所需的参数
		form: '#myform', // 填充数据的form节点
		cite: 'content', // 数据的key名 可选参数
		callback: function(){ } // 填充完之后该干嘛, 函数体内this指向form节点 可选参数
	});
	
	/* 
		该方法只能面临一般情况，数据结构复杂情况还有不足之处。 
		
		如果数据的value值是array类型并且里面还嵌json对象的话，
		就用formFill.filltr = function(data){ return '...'; };
		这个方法最好预定义，最终把拼结好的html代码以string类型返回
	*/
	
});
```


### 完 End