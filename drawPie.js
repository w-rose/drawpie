/**
 * Created by Administrator on 2016/12/30.
 */
(function (window) {
    function Pie(option) {
        this.container = option.container;
        //创建画布元素并追加到div
        var canvas = document.createElement("canvas");
        canvas.width = this.container.offsetWidth;
        canvas.height = this.container.offsetHeight;
        var context = canvas.getContext("2d");
        this.container.appendChild(canvas);
        this.context = context;
        this.data = option.data;
        this.dataProp = option.dataProp;
        this.textProp = option.textProp;
        this.x0 = this.container.offsetWidth / 2;
        this.y0 = this.container.offsetHeight / 2;
        this.radius = option.r || 150;
        this.startAngle = -90;
        this.lineOffset = option.lineOffset || 20;
        this.textOffsetX = option.textOffsetX || 20;
        this.textOffsetY = option.textOffsetY || 5;
        this.direction = 1;
        this.sum = 0;
        this.angleArr = null;

        this.init();
    }
    Pie.prototype = {
        constructor: "Pie",
        init: function () {
            this.sumInit();
            this.angleInit();
        },
        sumInit: function () {
            var that = this;
            this.data.forEach(function (v, i) {
                that.sum += v[that.dataProp];
            });
        },
        angleInit: function () {
            var that = this;
            this.angleArr = this.data.map(function (v, i) {
                return v[that.dataProp] / that.sum * 360;
            });
        },
        draw: function () {
            var that = this;
            that.angleArr.forEach(function (v, i) {
                //根据角度绘制每一个扇形
                that.context.beginPath();
                that.context.strokeStyle = that.context.fillStyle = getRandomColor();
                that.context.moveTo(that.x0, that.y0);
                that.context.arc(that.x0, that.y0, that.radius, computeRadian(that.startAngle), computeRadian(that.startAngle + v));
                that.context.fill();
                //绘制文本线
                that.context.moveTo(that.x0, that.y0);
                var x1 = that.x0 + (that.radius + that.lineOffset) * Math.cos(computeRadian(that.startAngle + v / 2));
                var y1 = that.y0 + (that.radius + that.lineOffset) * Math.sin(computeRadian(that.startAngle + v / 2));
                that.context.lineTo(x1, y1);
                if (x1 > that.x0) {
                    that.context.textAlign = "left";
                    that.direction = 1;
                } else {
                    that.context.textAlign = "right";
                    that.direction = -1;
                }
                //绘制文本
                that.context.fillText(that.data[i][that.textProp], x1 + that.textOffsetX * that.direction, y1 - that.textOffsetY);
                //绘制文本下方的那条线
                var textLength = that.context.measureText(that.data[i][that.textProp]).width;
                that.context.lineTo(x1 + that.textOffsetX * that.direction + textLength * that.direction, y1);
                that.context.stroke();
                that.startAngle += v;
            });
        }
    };


    //角度转化成弧度
    function computeRadian(angle) {
        return angle / 180 * Math.PI;
    }

    //生成随机颜色
    function getRandomColor() {
        var r = parseInt(Math.random() * 255);
        var g = parseInt(Math.random() * 255);
        var b = parseInt(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    window.Pie = Pie;
    window.computeRadian = computeRadian;
    window.getRandomColor = getRandomColor;

})(window);