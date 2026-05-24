const decisionTree = {
    root: {
        question: "How do you start your morning?",
        options: [
            { text: "Check my phone immediately", next: "q2_distracted", stability: 5 },
            { text: "Do something for myself first", next: "q2_focused", impact: 5 }
        ]
    },
    q2_distracted: {
        question: "You see someone doing better than you online. Feeling?",
        options: [
            { text: "Motivated to catch up", next: "q3_action", impact: 3 },
            { text: "Annoyed and behind", next: "q3_stuck", stability: 5 }
        ]
    },
    q2_focused: {
        question: "You have a big goal. How do you approach it?",
        options: [
            { text: "One small step every day", next: "q3_action", impact: 8 },
            { text: "Wait for the perfect moment", next: "q3_stuck", stability: 4 }
        ]
    },
    q3_action: {
        question: "A friend asks you to go out, but you have work to do.",
        options: [
            { text: "Go out (Choose fun)", next: "q4_balance", stability: 3 },
            { text: "Stay in (Choose work)", next: "q4_grind", impact: 6 }
        ]
    },
    q3_stuck: {
        question: "You're overwhelmed. What's the plan?",
        options: [
            { text: "Ask for help", next: "q4_balance", impact: 5 },
            { text: "Try to hide it", next: "q4_grind", stability: 7 }
        ]
    },
    q4_balance: {
        question: "Do you care more about being 'Liked' or 'Respected'?",
        options: [
            { text: "Liked by everyone", next: "q5_social", stability: 5 },
            { text: "Respected for my skills", next: "q5_skill", impact: 7 }
        ]
    },
    q4_grind: {
        question: "Is the pressure making you better or breaking you?",
        options: [
            { text: "It's making me stronger", next: "q5_skill", impact: 10 },
            { text: "It's burning me out", next: "q5_social", stability: 8 }
        ]
    },
    q5_social: {
        question: "Last one: If you fail, what is your next move?",
        options: [
            { text: "Try a different way", next: "end", impact: 5 },
            { text: "Quit and move on", next: "end", stability: 10 }
        ]
    },
    q5_skill: {
        question: "Last one: If you succeed, what is your next move?",
        options: [
            { text: "Celebrate and stop", next: "end", stability: 2 },
            { text: "Set a bigger goal", next: "end", impact: 10 }
        ]
    },
    end: { question: "Processing...", options: [] }
};

let stats = { stability: 0, impact: 0, steps: 0 };

function renderNode(nodeId) {
    const node = decisionTree[nodeId];
    const container = document.getElementById('logic-container');
    
    container.style.opacity = 0;

    setTimeout(() => {
        if (nodeId === 'end') {
            // THE PROCESSING DELAY
            container.innerHTML = `<h1 class="question" style="text-align:center; color: #666;">ANALYZING DATA...</h1>`;
            container.style.opacity = 1;
            
            setTimeout(() => {
                showAnalysis();
            }, 2000); // 2 second delay for "High End" feel
        } else {
            container.innerHTML = `
                <p class="node-id">${stats.steps + 1} of 5</p>
                <h1 class="question">${node.question}</h1>
                <div class="button-group" id="btn-group"></div>
            `;

            const btnGroup = document.getElementById('btn-group');
            node.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'logic-btn';
                btn.innerText = opt.text;
                btn.onclick = () => handleChoice(opt);
                btnGroup.appendChild(btn);
            });
            container.style.opacity = 1;
        }
        updateTelemetry();
    }, 400); 
}

function handleChoice(option) {
    stats.stability+= option.stability || 0;
    stats.impact += option.impact|| 0;
    stats.steps += 1;
    renderNode(option.next);
}

function showAnalysis() {
    const container = document.getElementById('logic-container');
    let title = "";
    let desc = "";

    if (stats.impact > stats.stability) {
        title = "You are the Architect";
        desc = "You see the world in systems. You have found a way to stay quiet when the world is loud, protecting your energy for what actually matters.";
    } else if (stats.stability > 20) {
        title = "You are the Seeker";
        desc = "You have high ambitions, but you are currently carrying too much weight. You are easily affected by the noise, but you are looking for a way out.";

    } else {
        title = "You are the Observer";
        desc = "You are careful and steady. You haven't made a wrong move yet, but you are waiting for a permission that may never come. It's time to choose.";
    }

    container.style.opacity = 0;
    setTimeout(() => {
        container.innerHTML = `
            <div style="text-align: center;">
                <p class="node-id"></p>
                <h1 class="question" style="color: #00ff41; font-size: 28px;">${title}</h1>
                <p style="line-height: 1.6; color: #aaa; margin-bottom: 40px;">${desc}</p>
                <button class="logic-btn" onclick="resetApp()" style="border-color: #00ff41; width: 100%;">Start Again</button>
            </div>
        `;
        container.style.opacity = 1;
    }, 400);
}

function resetApp() {
    stats = { impact: 0, stability: 0, steps: 0 };
    renderNode('root');
}

function updateTelemetry() {
    document.getElementById('lev-score').innerText = stats.impact;
    document.getElementById('risk-score').innerText = stats.stability;
    document.getElementById('step-count').innerText = stats.steps + "/5";
}

renderNode('root');
