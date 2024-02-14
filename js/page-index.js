window.onload = function () {
    // 动态修改所有图片的宽度
    var imgUl = document.getElementById('imgList');
    var imglis = imgUl.getElementsByTagName('li');
    // 总宽度设置为图片数量的长度乘网页的宽度
    imgUl.style.width = imglis.length * 960 + "px";
    // 点击超链接切换到制定图片
    var pointDiv = document.getElementsByClassName('pointDiv');
    var allA = pointDiv[0].getElementsByTagName('a');
    var index = 0;
    // 初始化第一个导航点为活跃状态
    allA[0].style.background = "url('img/point-active.png')";

    for (var i = 0; i < allA.length; i++) {
        // 为每一个链接添加一个num属性
        allA[i].num = i;
        allA[i].onclick = function () {
            // 检测到点击时，关闭自动切换定时器
            clearInterval(timer);
            //获取点击超链接的索引，并将其设置为index
            index = this.num;
            move(imgUl, "left", -960 * index, 30, function () {
                autoChange();
            });
            setA();
        };
    }

    //开启自动切换图片
    autoChange();

    //创建一个方法设置选中的a
    function setA() {
        // 如果当前索引是最后一张图片的索引，则重置索引值和图片列表位置，实现循环轮播
        if (index >= imglis.length - 1) {
            index = 0;
            //通过设置css将最后一张切换成第一张
            imgUl.style.left = 0;
        }

        // 更新所有导航按钮样式，使当前索引对应的导航按钮为活跃状态
        for (var i = 0; i < allA.length; i++) {
            allA[i].style.backgroundImage = "";
        }
        allA[index].style.backgroundImage = "url('img/point-active.png')";
    }

    var timer;

    //创建一个函数，来开启自动切换函数
    function autoChange() {
        // 创建定时器，每隔3秒切换一次图片
        timer = setInterval(function () {
            // 索引值自增，以切换到下一张图片
            index++;
            // 索引值取模图片数量，确保循环切换
            index %= imglis.length;
            // 调用move函数移动图片列表，切换到下一张图片
            move(imgUl, "left", -960 * index, 20, function () {
                setA();
            });

            // 更新导航按钮样式，显示当前图片对应的导航按钮为活跃状态
            for (var i = 0; i < allA.length; i++) {
                allA[i].style.backgroundImage = "";
            }
            allA[index].style.backgroundImage = "url('img/point-active.png')";
        }, 3000);// 每隔3秒执行一次
    }
};

// 实现从当前位置慢慢移动到目标位置的动画过程
/*
obj：代表需要移动的HTML元素对象（DOM对象）。
attr：代表需要改变的CSS属性，比如‘left’、‘top’等。
target：代表属性需要变化到的目标值。
speed：代表移动的速度，通常为正整数，单位是像素/秒。
callback：是一个回调函数，用于在动画结束后执行一些额外的操作，可选参数。
 */
// 实现元素动画效果函数
function move(obj, attr, target, speed, callback) {
    // 清除当前元素的计时器，以防止同时执行多个动画
    clearInterval(obj.timer);
    // 获取当前元素的位置
    var current = parseInt(getStyle(obj,attr));
    // 根据当前值和目标值的大小关系确定移动的方向和速度
    if(current>target){
        speed=-speed;
    }

    // 创建定时器，实现元素的动画效果
    obj.timer=setInterval(function (){
        // 获取原来的值
        var oldValue=parseInt(getStyle(obj,attr));
        // 计算新值
        var newValue=oldValue+speed;
        // 如果速度小于0且新值小于目标值，或者速度大于0且新值大于目标值，则将新值设置为目标值
        if(speed<0&&newValue<target||speed>0&&newValue>target){
            newValue=target;
        }
        // 更新元素的位置
        obj.style[attr]=newValue+"px";
        // 如果新值等于目标值，清除定时器，并执行回调函数
        if(newValue==target){
            clearInterval(obj.timer);
            callback && callback();
        }
    },30);// 每隔30毫秒执行一次动画
}

/*
函数接受两个参数：
1. `obj`：表示要获取样式的 HTML 元素对象（DOM 对象）。
2. `name`：表示要获取的 CSS 属性的名称。

函数首先通过 `window.getComputedStyle` 方法尝试获取指定元素的计算样式（computed style）。如果浏览器支持 `getComputedStyle` 方法，
则调用该方法来获取指定元素的计算样式，并从中获取指定属性的值，最后返回该值。

如果浏览器不支持 `getComputedStyle` 方法（通常发生在较老的 IE 浏览器中），则使用 `obj.currentStyle` 属性来获取元素
的当前样式（current style），并从中获取指定属性的值，最后返回该值。

这个函数的作用是封装了获取元素指定 CSS 属性值的逻辑，使得无论是在支持 `getComputedStyle` 的现代浏览器
还是在不支持的 IE 浏览器中都能正确地获取到元素的样式值。

window.getComputedStyle 是 JavaScript 中用于获取计算样式（computed style）的方法。

它的作用是返回一个对象，该对象包含指定元素的所有 CSS 属性的计算后的样式值，这些样式值包括从 CSS 样式表、
内联样式和浏览器默认样式计算得出的最终样式值。

window.getComputedStyle 方法接受两个参数：

element：要获取计算样式的元素对象（DOM 对象）。
pseudoElement：一个可选参数，用于指定要获取的伪元素的名称，比如 ':before' 或 ':after'。
 */
// 获取元素样式值的兼容函数
function getStyle(obj, name) {
    // 如果浏览器支持getComputedStyle方法，则调用该方法获取元素的样式值
    if (window.getComputedStyle) {
        return getComputedStyle(obj, null)[name];
    } else {
        // 否则，使用currentStyle属性获取元素的样式值
        return obj.currentStyle[name];
    }
}