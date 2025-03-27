(function(){
    // 设置周年日期（格式：月-日）
    const ANNIVERSARY_DATE = "07-16";
    const now = new Date();
    const md = ("0"+(now.getMonth()+1)).slice(-2) + "-" + ("0"+now.getDate()).slice(-2);
    if(md !== ANNIVERSARY_DATE) return;  // 非周年当天不执行

    // 创建全屏 canvas
    const canvas = document.createElement("canvas");
    canvas.id = "anniversaryCanvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "1001";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    function resizeCanvas(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let fireworks = [];
    let particles = [];
    const gravity = 0.05;

    // 烟花类：从底部发射，到达目标高度后随机选一种爆炸模式
    class Firework {
        constructor(){
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height / 2 + 50;
            this.speed = Math.random() * 3 + 4;
            this.exploded = false;
            this.hue = Math.floor(Math.random() * 360);
        }
        update(){
            if(!this.exploded){
                this.y -= this.speed;
                if(this.y <= this.targetY){
                    this.explode();
                    this.exploded = true;
                }
            }
        }
        draw(){
            if(!this.exploded){
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
                ctx.fill();
            }
        }
        explode(){
            const mode = Math.floor(Math.random()*3);
            if(mode === 0){ // 经典爆炸：随机角度与速度
                const count = 50 + Math.floor(Math.random() * 30);
                for(let i = 0; i < count; i++){
                    particles.push(new Particle(this.x, this.y, this.hue, "classic"));
                }
            } else if(mode === 1){ // 环形爆炸：均匀分布成环
                const count = 40;
                for(let i = 0; i < count; i++){
                    const angle = i * (Math.PI * 2 / count);
                    const speed = 4 + Math.random() * 2;
                    particles.push(new Particle(this.x, this.y, this.hue, "ring", angle, speed));
                }
            } else if(mode === 2){ // 螺旋爆炸：初始角度逐步递增，形成螺旋
                const count = 60;
                for(let i = 0; i < count; i++){
                    const angle = i * (Math.PI / 15) + Math.random() * 0.2;
                    const speed = 3 + Math.random() * 2;
                    particles.push(new Particle(this.x, this.y, this.hue, "spiral", angle, speed));
                }
            }
        }
    }

    // 定义可选的粒子类型
    const particleTypes = ["circle", "square", "star", "emoji"];
    const emojiList = ["🔥", "✨", "💥"];

    // 粒子类：支持多种爆炸模式和粒子外观
    class Particle {
        constructor(x, y, hue, mode = "classic", angle = null, speed = null){
            this.x = x;
            this.y = y;
            this.hue = hue;
            this.alpha = 1;
            this.size = Math.random() * 2 + 2;
            this.mode = mode;
            // 随机选择粒子类型
            this.type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
            if(this.type === "emoji"){
                this.emoji = emojiList[Math.floor(Math.random()*emojiList.length)];
                // 文字型粒子可使用稍大字号
                this.size = Math.random() * 8 + 16;
            }
            if(mode === "classic"){
                const a = Math.random() * Math.PI * 2;
                const s = Math.random() * 5;
                this.vx = Math.cos(a) * s;
                this.vy = Math.sin(a) * s;
            } else {
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
            }
        }
        update(){
            this.x += this.vx;
            this.y += this.vy;
            // 螺旋效果：每帧让速度稍作旋转
            if(this.mode === "spiral"){
                const currentAngle = Math.atan2(this.vy, this.vx);
                const speed = Math.hypot(this.vx, this.vy);
                const newAngle = currentAngle + 0.02;
                this.vx = Math.cos(newAngle) * speed;
                this.vy = Math.sin(newAngle) * speed;
            }
            this.vy += gravity;
            this.alpha -= 0.02;
        }
        draw(){
            ctx.save();
            ctx.globalAlpha = this.alpha;
            // 根据粒子类型绘制不同形状
            if(this.type === "circle"){
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                grad.addColorStop(0, `hsla(${this.hue}, 100%, 80%, 1)`);
                grad.addColorStop(0.5, `hsla(${this.hue}, 100%, 50%, 0.8)`);
                grad.addColorStop(1, `hsla(${this.hue}, 100%, 30%, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else if(this.type === "square"){
                // 绘制正方形并做简单旋转
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI / 4);
                const grad = ctx.createLinearGradient(-this.size, -this.size, this.size, this.size);
                grad.addColorStop(0, `hsla(${this.hue}, 100%, 80%, 1)`);
                grad.addColorStop(1, `hsla(${this.hue}, 100%, 30%, 0)`);
                ctx.fillStyle = grad;
                ctx.fillRect(-this.size, -this.size, this.size*2, this.size*2);
                ctx.rotate(-Math.PI / 4);
                ctx.translate(-this.x, -this.y);
            } else if(this.type === "star"){
                drawStar(ctx, this.x, this.y, this.size, 5, this.size/2, `hsla(${this.hue}, 100%, 50%, ${this.alpha})`);
            } else if(this.type === "emoji"){
                ctx.font = `${this.size}px sans-serif`;
                ctx.fillText(this.emoji, this.x, this.y);
            }
            ctx.restore();
        }
    }

    // 绘制星形辅助函数
    function drawStar(ctx, cx, cy, outerRadius, points, innerRadius, fillStyle){
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / points;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for(let i = 0; i < points; i++){
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }

    // 动画主循环
    function animate(){
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        for(let i = fireworks.length - 1; i >= 0; i--){
            fireworks[i].update();
            fireworks[i].draw();
            if(fireworks[i].exploded) fireworks.splice(i, 1);
        }
        for(let i = particles.length - 1; i >= 0; i--){
            particles[i].update();
            particles[i].draw();
            if(particles[i].alpha <= 0) particles.splice(i, 1);
        }
        if(Math.random() < 0.05){
            fireworks.push(new Firework());
        }
        requestAnimationFrame(animate);
    }
    animate();
})();
