(function(){
    // 日期判断（4月1日）
    const TARGET_DATE = "04-01";
    const now = new Date();
    const md = ("0" + (now.getMonth()+1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    if(md !== TARGET_DATE) return;

    // 点击播放音乐
    let audioPlayed = false;
    const audio = new Audio("https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/joker.mp3");
    audio.loop = true;
    document.body.addEventListener("click", function(){
        if (!audioPlayed) {
            audio.play();
            audioPlayed = true;
        }
    });

    // 创建全屏 canvas
    const canvas = document.createElement("canvas");
    canvas.id = "foolCanvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "1000";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function resizeCanvas(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 定义下落粒子（仅下落，不左右移动），使用小丑emoji
    class Particle {
        constructor(x, y){
            this.x = x;
            this.y = y;
            this.vx = 0;  // 无水平速度
            this.vy = Math.random() * 0.1 + 0.1;
            this.symbol = "🤡";
            this.size = 24;
        }
        update(dt){
            this.vy += 0.00002 * dt;  // 重力加速度
            this.y += this.vy * dt;
        }
        draw(ctx){
            ctx.font = this.size + "px serif";
            ctx.fillText(this.symbol, this.x, this.y);
        }
    }

    const particles = [];
    let lastSpawn = 0, lastTime = performance.now();

    function spawnParticles(timestamp){
        if(timestamp - lastSpawn > 100){
            const count = Math.floor(Math.random() * 2) + 1;
            for(let i = 0; i < count; i++){
                const x = Math.random() * canvas.width;
                const y = -30;
                particles.push(new Particle(x, y));
            }
            lastSpawn = timestamp;
        }
    }

    function animate(timestamp){
        const dt = timestamp - lastTime;
        lastTime = timestamp;
        spawnParticles(timestamp);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i = particles.length - 1; i >= 0; i--){
            const p = particles[i];
            p.update(dt);
            p.draw(ctx);
            if(p.y - p.size > canvas.height){
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();
