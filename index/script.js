<script>
    const scriptData = [
    { text: "哈哈哈哈摟！你是羅小成嗎？", type: "text" },
    { text: "聽說今天是你的生日！你要 22 歲ㄌ", type: "text" },
    { text: "生日快樂！！！", type: "text" },
    { text: "就是呢不知道你知不知道...", type: "text" },
    { 
        text: "【第一關】這是童羿寧第幾次跟羅小成過生日？", 
        type: "choice", 
        options: ["第 2 次", "第 3 次"],
        callbacks: [ansWrong, ansRight1]
            },
    { 
        text: "【第二關】童羿寧最喜歡羅小成的地方？", 
        type: "choice", 
        options: ["手很大！", "溫柔！", "超帥氣！"],
        callbacks: [ansRight2, ansRight2, ansRight2]
    },
    { 
        text: "【第三關】我現在最想做的事情？", 
        type: "choice", 
        options: ["親你", "把你撲倒", "在你身邊"],
        callbacks: [ansRight3, ansRight3, ansRight3]
    },
    // 3. 新增：大結局前的最後對話
    { text: "嘿嘿嘿，三關都過了！你果然是羅小成！", type: "text" },
    { text: "既然這樣，為了慶祝你生日，我要給你一個特別的東西...", type: "text" },
    { text: "嘻嘻嘻你太厲害了！其實科... 我一直想對你說...", type: "text" }
];

    let currentIdx = 0;
    let charIndex = 0;
    let isTyping = false;
    let hearts = 0;
    let isFeedbackMode = false;
    let isRetryMode = false;

    function updateHearts() {
        for(let i=1; i<=3; i++) {
            const h = document.getElementById('h'+i);
            if (i <= hearts) h.classList.remove('empty');
            else h.classList.add('empty');
        }
    }

    function startGame() {
        document.getElementById('scene-1').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('hearts-container').classList.remove('hidden');
        updateHearts();
        startTyping();
        createFirework();
    }

    function startTyping() {
        isTyping = true;
        isFeedbackMode = false;
        charIndex = 0;
        document.getElementById('dialog-text').innerHTML = "";
        document.getElementById('next-arrow').classList.add('hidden');
        document.getElementById('choice-area').classList.add('hidden');
        typeWriter();
    }

    function typeWriter() {
        const currentItem = scriptData[currentIdx];
        if (charIndex < currentItem.text.length) {
            document.getElementById('dialog-text').innerHTML += currentItem.text.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        } else {
            isTyping = false;
            if (currentItem.type === "choice") showOptions(currentItem);
            else document.getElementById('next-arrow').classList.remove('hidden');
        }
    }

    function showOptions(item) {
        const area = document.getElementById('opt-buttons');
        area.innerHTML = "";
        item.options.forEach((label, i) => {
            const btn = document.createElement('button');
            btn.className = "opt"; btn.innerText = label;
            btn.onclick = (e) => { e.stopPropagation(); item.callbacks[i](); };
            area.appendChild(btn);
        });
        document.getElementById('choice-area').classList.remove('hidden');
    }

    // --- 核心邏輯修正：確保能順利進入下一題 ---
    function handleDialogClick() {
    if (isTyping) {
        charIndex = scriptData[currentIdx].text.length;
        document.getElementById('dialog-text').innerHTML = scriptData[currentIdx].text;
        isTyping = false;
        if (scriptData[currentIdx].type === "choice") showOptions(scriptData[currentIdx]);
        else document.getElementById('next-arrow').classList.remove('hidden');
        return;
    }

    if (isFeedbackMode) {
        if (isRetryMode) {
            startTyping();
        } else {
            // 答對了，關閉反饋模式，回到劇本
            isFeedbackMode = false;
            currentIdx++;
            startTyping();
        }
        return;
    }

    if (!document.getElementById('next-arrow').classList.contains('hidden')) {
        // 核心邏輯修正：判斷結局
        if (currentIdx === scriptData.length - 1) {
            // 如果走到劇本最後一句話 (結局前言)
            showLetterScene(); // 顯示信封
        } else {
            currentIdx++;
            startTyping();
        }
    }
}

        // 3. 一般對話狀態（非選項題時）
        if (!document.getElementById('next-arrow').classList.contains('hidden')) {
            if (currentIdx < scriptData.length - 1) {
                currentIdx++;
                startTyping();
            }
        }
    }

    function showFeedback(msg, retry) {
        isFeedbackMode = true;
        isRetryMode = retry;
        document.getElementById('choice-area').classList.add('hidden');
        document.getElementById('dialog-text').innerHTML = msg;
        document.getElementById('next-arrow').classList.remove('hidden');
    }

    function ansWrong() { showFeedback("💔 童小寧：不對不對！你再想想看啦！", true); }
    function ansRight1() { hearts = 1; updateHearts(); showFeedback("你真強！還得是你！那我只好送你一顆我的愛心ㄌ", false); }
    function ansRight2() { hearts = 2; updateHearts(); showFeedback("嘿嘿，這是第二顆心！", false); }
    function ansRight3() { hearts = 3; updateHearts(); showFeedback("集滿了！羅小成，我愛你！", false); }

    function showSuccess() {
        document.getElementById('game-container').classList.add('hidden');
        document.getElementById('hearts-container').classList.add('hidden');
        document.getElementById('success-scene').classList.remove('hidden');
    }

    function resetGame() {
        currentIdx = 0; hearts = 0;
        document.getElementById('success-scene').classList.add('hidden');
        document.getElementById('scene-1').classList.remove('hidden');
        updateHearts();
    }

    // (煙火代碼 createFirework 保持不變，略...)
</script>

// --- 新增：大結局信件控制函數 ---

function showLetterScene() {
    // 1. 隱藏對話框和主角
    document.getElementById('dialog-text').innerHTML = "";
    document.getElementById('next-arrow').classList.add('hidden');
    document.getElementById('game-container').classList.add('hidden');
    
    // 2. 切換到成功場景，但先隱藏標題
    document.getElementById('success-scene').classList.remove('hidden');
    document.getElementById('success-title').classList.add('hidden'); // 隱藏原本的標題
    
    // 3. 跳出信封
    document.getElementById('pixel-envelope').classList.remove('hidden');
}

function openEnvelope() {
    // 1. 隱藏信封
    document.getElementById('pixel-envelope').classList.add('hidden');
    
    // 2. 顯示牛皮紙像素信紙
    document.getElementById('pixel-letter').classList.remove('hidden');
}

// 修正原本的 resetGame，也要重設信件狀態
function resetGame() {
    currentIdx = 0; hearts = 0;
    
    // 重設結局狀態
    document.getElementById('success-scene').classList.add('hidden');
    document.getElementById('success-title').classList.remove('hidden'); // 下次要顯示
    document.getElementById('pixel-envelope').classList.add('hidden');
    document.getElementById('pixel-letter').classList.add('hidden');
    
    document.getElementById('scene-1').classList.remove('hidden');
    updateHearts();
}