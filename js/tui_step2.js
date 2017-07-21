(function($){
  $.fn.extend({
    //初始化
    loadStep: function(params){
      
      //基础框架
      var baseHtml =  "<div class='ystep_container'>"+
                        "<ul class='ystep_container_steps'>"+
                        "</ul>"+"</div>";
      //步骤框架
      var stepHtml = "<li class='ystep_step ystep_step_undone'>"+
                     "<span data-html='true' data-placement='top' data-title='' data-trigger='click' data-container='body'></span></li>";
      //决策器
      var logic = {
        size: {
          small: function($html){
            var stepCount = $html.find("li").length-1;
			 $html.find("li").css({
			  width: (parseInt(100/stepCount))+"%"
            });
			$html.find("li").eq(stepCount).css({
			  position:"absolute",
			  width:"16px",
			  right:"-16px"
			});
            $html.addClass("ystep_sm");
          },
          large: function($html){
            var stepCount = $html.find("li").length-1;
			 $html.find("li").css({
			  width: (parseInt(100/stepCount))+"%"
            });
			$html.find("li").eq(stepCount).css({
			  position:"absolute",
			  width:"40px",
			  right:"-40px"
			});
            $html.addClass("ystep_lg"); 
          }
        },
        color: {
          green: function($html){
            $html.addClass("ystep_green");
          },
          blue: function($html){
            $html.addClass("ystep_blue");
          }
        }
      };
      
      //支持填充多个步骤容器
      $(this).each(function(i,n){
        var $baseHtml = $(baseHtml),
        $stepHtml = $(stepHtml),
        $ystepContainerSteps = $baseHtml.find(".ystep_container_steps"),
        arrayLength = 0,
        $n = $(n),
        i=0;
        
        //步骤
        arrayLength = params.steps.length;
        for(i=0;i<arrayLength;i++){
          var _s = params.steps[i];
          //构造步骤html
          $stepHtml.find("span").attr("data-title","<div class='tui_step_title' style='font-weight:700;background:#f7f7f7'>"+_s.title+"</div>"+"<div>"+_s.content+"</div>");
          $stepHtml.find("span").text(_s.title);
          //将步骤插入到步骤列表中
          $ystepContainerSteps.append($stepHtml);
          //重置步骤
          $stepHtml = $(stepHtml);
        }
        
        //尺寸
        logic.size[params.size||"small"]($baseHtml);
        //配色
        logic.color[params.color||"green"]($baseHtml);
        
        //插入到容器中
        $n.append($baseHtml);

        //默认执行第一个步骤
        $n.setStep(1);
      });
    },
    //跳转到指定步骤
    setStep: function(step) {
      $(this).each(function(i,n){
        //获取当前容器下所有的步骤
        var $steps = $(n).find(".ystep_container").find("li");
        //判断当前步骤是否在范围内
        if(1<=step && step<=$steps.length){
          //更新进度
          var scale = "%";
          scale = Math.round((step-1)*100/($steps.length-1))+scale;

              //移动节点
              $steps.each(function(j,m){
                var _$m = $(m);
                var _j = j+1;
                if(_j < step){
                  _$m.attr("class","ystep_step_done");
                }else if(_j === step){
                  _$m.attr("class","ystep_step_active");
                }else if(_j > step){
                  _$m.attr("class","ystep_step_undone");
                }
				if(j==0){
					_$m.addClass("ystep_step_first");
				}
              });


        }else{
          return false;
        }
      });
    },
    //获取当前步骤
    getStep: function() {
      var result = [];
      
      $(this)._searchStep(function(i,j,n,m){
        result.push(j+1);
      });
      
      if(result.length == 1) {
        return result[0];
      }else{
        return result;
      }
    },
    //下一个步骤
    nextStep: function() {
      $(this)._searchStep(function(i,j,n,m){
        $(n).setStep(j+2);
      });
    },
    //上一个步骤
    prevStep: function() {
      $(this)._searchStep(function(i,j,n,m){
        $(n).setStep(j);
      });
    },
    //通用节点查找
    _searchStep: function (callback) {
      $(this).each(function(i,n){
        var $steps = $(n).find(".ystep_container").find("li");
        $steps.each(function(j,m){
          //判断是否为活动步骤
          if($(m).attr("class") === "ystep_step_active"){
            if(callback){
              callback(i,j,n,m);
            }
            return false;
          }
        });
      });
    }
  });
})(jQuery);