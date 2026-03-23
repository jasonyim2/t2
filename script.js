const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const questionEl = document.getElementById('question');
const scoreEl = document.getElementById('score');
const scoreBoard = document.getElementById('score-board');
const feedbackEl = document.getElementById('feedback');
const optionBtns = document.querySelectorAll('.option-btn');

let score = 0;
let currentAnswer = 0;
let options = [];
let isAnimating = false;

// 게임 시작 이벤트
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    score = 0;
    updateScore();
    nextQuestion();
});

// 다음 문제 출제
function nextQuestion() {
    isAnimating = false;
    feedbackEl.classList.add('hidden');
    questionEl.classList.remove('shake');
    
    // 문제 생성 애니메이션 (팝)
    questionEl.classList.remove('pop');
    void questionEl.offsetWidth; // reflow
    questionEl.classList.add('pop');
    
    // 2단 ~ 9단
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 9) + 1;
    currentAnswer = a * b;
    
    questionEl.textContent = `${a} x ${b} = ?`;
    
    // 보기 생성 (정답 포함 4개 보장)
    const answersSet = new Set([currentAnswer]);
    while (answersSet.size < 4) {
        // 완전 랜덤 오답보다는 정답과 근접하거나 실제 구구단 결과값 위주
        const wrongA = Math.floor(Math.random() * 8) + 2;
        const wrongB = Math.floor(Math.random() * 9) + 1;
        answersSet.add(wrongA * wrongB);
    }
    
    options = Array.from(answersSet);
    // 배열 섞기
    options.sort(() => Math.random() - 0.5);
    
    // 버튼에 보기 할당
    optionBtns.forEach((btn, index) => {
        btn.textContent = options[index];
        btn.classList.remove('shake');
        btn.style.opacity = '1';
    });
}

// 정답 확인 (HTML 버튼의 onclick에서 호출됨)
window.checkAnswer = function(selectedIndex) {
    if (isAnimating) return; // 애니메이션 도중 중복 클릭 방지
    
    const selectedAnswer = options[selectedIndex];
    const selectedBtn = optionBtns[selectedIndex];
    
    if (selectedAnswer === currentAnswer) {
        // 정답!
        isAnimating = true;
        score += 10;
        updateScore();
        
        feedbackEl.textContent = '⭕';
        feedbackEl.style.color = '#32CD32';
        feedbackEl.classList.remove('hidden');
        feedbackEl.classList.remove('pop');
        void feedbackEl.offsetWidth;
        feedbackEl.classList.add('pop');
        
        // 정답 맞췄을 때 1초 대기 후 다음 문제
        setTimeout(nextQuestion, 1000);
    } else {
        // 오답!
        score = Math.max(0, score - 5);
        updateScore();
        
        feedbackEl.textContent = '❌';
        feedbackEl.style.color = '#FF1493';
        feedbackEl.classList.remove('hidden');
        feedbackEl.classList.remove('pop');
        void feedbackEl.offsetWidth;
        feedbackEl.classList.add('pop');
        
        selectedBtn.classList.add('shake');
        selectedBtn.style.opacity = '0.4';
        
        // 오답 이펙트 잠시 띄워주기
        setTimeout(() => {
            feedbackEl.classList.add('hidden');
            selectedBtn.classList.remove('shake');
        }, 600);
    }
}

// 점수 업데이트 로직
function updateScore() {
    scoreEl.textContent = score;
    scoreBoard.classList.remove('score-bounce');
    void scoreBoard.offsetWidth; // reflow
    scoreBoard.classList.add('score-bounce');
}
