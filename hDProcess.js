	(function() {
		//绑定事件函数,兼容IE8
		var bindEvent=function(el,type,handler){
			if(el.attachEvent){
				bindEvent=function(el,type,handler){
					el.attachEvent("on"+type,handler);
				}
			}else{
				bindEvent=function(el,type,handler){
					el.addEventListener(type,handler);
				}
			}

			bindEvent(el,type,handler);
		};

		function hProcess(configObj) {
			//兼容没有写 new 关键字的情况
			if( !(this instanceof hProcess)){
				return new hProcess(configObj);
			};

			var _configObj={
				id:configObj.id,
				goalId:configObj.goalId
			};

			this.configObj=_configObj;

			this.checkConfig();
			//绑定窗口大小改变事件
			// bindEvent
			var self=this;
			//绑定滚动事件
			this.bindScroll();
		};

		hProcess.prototype={
			/**
			 * 检查参数配置，以及准备需要的数据
			 * @return {[type]} [description]
			 */
			checkConfig:function(){

				var configObj=this.configObj,
					dom=document.getElementById(configObj.id),
					goalDom=document.getElementById(configObj.goalId);

				if(!dom||!goalDom){
					throw new Error("Not get the container or the goal dom element (id),please check the config attributes (goalId);");
				};

			
				this.id=configObj.id;

				this.totalHeight=Math.abs(goalDom.scrollHeight-goalDom.clientHeight);

				// console.log(goalDom.scrollHeight,"" goalDom.clientHeight);
				// console.log(goalDom.scrollHeight, goalDom.offsetHeight);

				this.dom=dom;
				this.dom.style.position="relative";
				this.dom.style.overflow="hidden";

				//创建一个元素
				var innerDom=document.createElement("div");

				innerDom.style.cssText="position: absolute;left: -100%;top: 0;height: 100%;width:100%;";

				innerDom.className="innerEl";

				this.dom.appendChild(innerDom);

				this.innerDom=innerDom;
				console.log(innerDom);
				this.goalDom=goalDom;			
			},
			bindScroll:function(){

				var self=this;

				bindEvent(this.goalDom,"scroll",function(){
					var scrollTop=self.goalDom.scrollTop;
					if(self.totalHeight===0){
						return;
					}

					var percent=scrollTop/self.totalHeight;

					//兼容ie7 ，有时 计算的 percent 会大于0；
					percent=Math.min(percent,1);
					self.moveTo(percent);
				});				
			},
			/**
			 * 兼容IE快速刷新时,高度获取不正确的bug。
			 * @return {[type]} [description]
			 */
			fixIE7:function(){

				var self=this;
				setTimeout(function(){
					var distance=Math.abs(self.goalDom.scrollHeight-self.goalDom.clientHeight);
					self.totalHeight=distance;
					console.log(self.totalHeight);

				}, 500);

				return this;
			},
			moveTo:function(percent){
					var percent=(1-percent)*100;
					this.innerDom.style.left="-"+percent+"%";
			}
		}




		if (typeof module !== 'undefined' && typeof exports === 'object') {
			module.exports = hProcess;
		} else if (typeof define === 'function' && (define.amd || define.cmd)) {
			define(function() {
				return hProcess;
			});
		} else {
			this.hProcess = hProcess;
		}
	}).call(function() {
		return this || (typeof window !== 'undefined' ? window : global);
	}());