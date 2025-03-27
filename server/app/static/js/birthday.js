(function(){
    // 配置项
    const BIRTHDAY = "03-01"; // 修改为她的生日（月-日）
    const GRAVITY = 0.00002; // 重力加速度（每毫秒）
    const MOBILE_HORIZ_ACCEL = 0.000003; // 手机左右重力加速度

    // 判断是否为生日当天
    const now = new Date();
    const md = ("0"+(now.getMonth()+1)).slice(-2) + "-" + ("0"+now.getDate()).slice(-2);
    if(md !== BIRTHDAY) return; // 非生日当天则不执行动画

    // 等待用户点击来播放音乐
    let audioPlayed = false;
    const audio = new Audio("https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/birthday.mp3");
    audio.loop = true;  // 设置音乐为循环播放

    // 用户点击页面时播放音乐
    document.body.addEventListener("click", function() {
        if (!audioPlayed) {
            audio.play();  // 播放音乐
            audioPlayed = true; // 确保只播放一次
        }
    });

    // 创建全屏 canvas
    const canvas = document.createElement("canvas");
    canvas.id = "birthdayCanvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "1000"; // 保证canvas在最上层
    canvas.style.pointerEvents = "none"; // 使canvas不阻挡下层元素的点击
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    
    function resizeCanvas(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 判断设备
    const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // 手机左右重力
    let tilt = 0;
    if(isMobile && window.DeviceOrientationEvent){
        window.addEventListener("deviceorientation", e => {
            tilt = e.gamma || 0;
        });
    }

    // 定义下落粒子
    class Particle {
        constructor(x, y, symbol){
            this.x = x;
            this.y = y;
            this.vx = (Math.random()-0.5)*0.1;
            this.vy = Math.random()*0.1 + 0.1;
            this.symbol = symbol;
            this.size = 24; // 字体大小
        }
        update(dt){
            // 重力
            this.vy += GRAVITY * dt;
            // 手机根据左右重力调整水平速度
            if(isMobile){
                this.vx += tilt * MOBILE_HORIZ_ACCEL * dt;
            }
            // 更新位置
            this.x += this.vx * dt;
            this.y += this.vy * dt;
        }
        draw(ctx){
            ctx.font = this.size + "px serif";
            ctx.fillText(this.symbol, this.x, this.y);
        }
    }

    const particles = [];
    const symbols = ["🎂","🍰","🎉","🥳","🍾"];
    let lastSpawn = 0, lastTime = performance.now();

    function spawnParticles(timestamp){
        if(timestamp - lastSpawn > 100){
            // 每200ms随机生成1~2个粒子
            const count = Math.floor(Math.random()*2) + 1;
            for(let i=0; i<count; i++){
                const x = Math.random() * canvas.width;
                const y = -30;
                const symbol = symbols[Math.floor(Math.random()*symbols.length)];
                particles.push(new Particle(x, y, symbol));
            }
            lastSpawn = timestamp;
        }
    }

    function animate(timestamp){
        const dt = timestamp - lastTime;
        lastTime = timestamp;
        spawnParticles(timestamp);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 更新并绘制粒子
        for(let i = particles.length - 1; i >= 0; i--){
            const p = particles[i];
            p.update(dt);
            p.draw(ctx);
            // 超出底部则移除
            if(p.y - p.size > canvas.height){
                particles.splice(i,1);
            }
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();
