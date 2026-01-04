(function(){
    // —— 保留的周年日期与音频逻辑 ——
    const ANNIVERSARY_DATES = ["07-16", "07-17", "07-18", "07-19", "07-20"];
    const now = new Date();
    const md = ("0"+(now.getMonth()+1)).slice(-2) + "-" + ("0"+now.getDate()).slice(-2);
    if (!ANNIVERSARY_DATES.includes(md)) return;  // 非指定日期不执行

    let audioPlayed = false;
    const audio = new Audio("https://qianqiuzy-1313476938.cos.ap-shanghai.myqcloud.com/zhounian.mp3");
    audio.loop = true;
    document.body.addEventListener("click", function() {
        if (!audioPlayed) {
            audio.play();
            audioPlayed = true;
        }
    });

    // —— Canvas 初始化 ——
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.style.margin = 0;
    document.body.style.overflow = 'hidden';
    canvas.style.position = 'fixed';
    canvas.style.top = canvas.style.left = 0;
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // —— 工具函数 ——
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }
    function hsv2rgb(h, s, v) {
        let f = (n, k = (n + h/60) % 6) =>
            v - v * s * Math.max(Math.min(k,4-k,1),0);
        return `rgb(${f(5)*255|0},${f(3)*255|0},${f(1)*255|0})`;
    }

    // —— 烟花与粒子类 ——
    class Firework {
        constructor() {
            this.x = random(0, canvas.width);
            this.y = canvas.height;
            this.targetY = random(canvas.height * 0.2, canvas.height * 0.5);
            this.speed = random(2, 4);                         // 慢速上升
            this.angle = -Math.PI/2 + random(-0.2, 0.2);
            this.color = hsv2rgb(random(0,360), 1, 1);
            this.exploded = false;
            this.particles = [];
        }
        update() {
            if (!this.exploded) {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
                if (this.y <= this.targetY) this.explode();
            } else {
                this.particles.forEach(p => p.update());
                this.particles = this.particles.filter(p => p.alpha > 0);
            }
        }
        draw() {
            if (!this.exploded) {
                ctx.save();
                ctx.shadowBlur = 8;                             // 发射光晕
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI*2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            } else {
                this.particles.forEach(p => p.draw());
            }
        }
        explode() {
            this.exploded = true;
            const count = 80;                                   // 更多粒子
            for (let i = 0; i < count; i++) {
                this.particles.push(new Particle(this.x, this.y, this.color));
            }
        }
        isDone() {
            return this.exploded && this.particles.length === 0;
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y;
            this.radius = random(1, 3);                        // 随机大小
            const speed = random(0.5, 3);                      // 爆炸初速更慢
            const angle = random(0, Math.PI*2);
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.gravity = 0.03;
            this.alpha = 1;
            this.decay = random(0.008, 0.02);
            this.color = color;
        }
        update() {
            this.vx *= 0.98;                                   // 微弱摩擦
            this.vy *= 0.98;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.shadowBlur = 6;                                // 粒子光晕
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    // —— 主循环 ——
    const fireworks = [];
    let lastLaunch = 0;
    function loop(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (timestamp - lastLaunch > 700) {                  // 发射频率稍慢
            fireworks.push(new Firework());
            lastLaunch = timestamp;
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
            const fw = fireworks[i];
            fw.update();
            fw.draw();
            if (fw.isDone()) fireworks.splice(i, 1);
        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})();