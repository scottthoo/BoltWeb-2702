// =========================================================
// Make Ten Adventure — kid-friendly bilingual math game
// =========================================================

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ---------- Constants ----------
const PROBLEMS = [
  { a: 8, b: 3 }, { a: 9, b: 2 }, { a: 7, b: 4 },
  { a: 4, b: 7 }, { a: 5, b: 6 }, { a: 8, b: 4 },
  { a: 6, b: 5 }, { a: 9, b: 3 }, { a: 7, b: 5 },
  { a: 8, b: 5 }, { a: 6, b: 7 }, { a: 5, b: 8 },
  { a: 9, b: 4 }, { a: 8, b: 7 }, { a: 7, b: 6 },
  { a: 9, b: 5 }, { a: 6, b: 9 }, { a: 9, b: 8 },
  { a: 8, b: 8 }, { a: 7, b: 9 }, { a: 9, b: 9 },
];

const ANIMAL_PAIRS = [
  ['🐸', '🦆'], ['🐱', '🐶'], ['🐰', '🐻'],
  ['🐯', '🦁'], ['🐼', '🐨'], ['🦊', '🐺'],
  ['🐵', '🐷'], ['🐭', '🐹'], ['🦄', '🐲'],
];

const ANIMAL_NAMES = {
  '🐸': { en: 'frogs', zh: '青蛙' }, '🦆': { en: 'ducks', zh: '鸭子' },
  '🐱': { en: 'kitties', zh: '小猫' }, '🐶': { en: 'puppies', zh: '小狗' },
  '🐰': { en: 'bunnies', zh: '兔子' }, '🐻': { en: 'bears', zh: '小熊' },
  '🐯': { en: 'tigers', zh: '老虎' }, '🦁': { en: 'lions', zh: '狮子' },
  '🐼': { en: 'pandas', zh: '熊猫' }, '🐨': { en: 'koalas', zh: '考拉' },
  '🦊': { en: 'foxes', zh: '狐狸' }, '🐺': { en: 'wolves', zh: '小狼' },
  '🐵': { en: 'monkeys', zh: '小猴' }, '🐷': { en: 'piggies', zh: '小猪' },
  '🐭': { en: 'mice', zh: '老鼠' }, '🐹': { en: 'hamsters', zh: '仓鼠' },
  '🦄': { en: 'unicorns', zh: '独角兽' }, '🐲': { en: 'dragons', zh: '小龙' },
};

const JOKES = [
  { en: "Why was the math book sad? Too many problems!", zh: "数学书为什么难过？因为问题太多啦！" },
  { en: "What did zero say to eight? Nice belt!", zh: "0对8说什么？好酷的腰带哦！" },
  { en: "Why is six afraid of seven? Because seven ate nine!", zh: "为什么6怕7？因为 7 吃 (8) 了 9！" },
  { en: "What's a bunny's favorite math? Multi-PLY-ing!", zh: "兔子最爱的数学？跳跳乘法！" },
];

const ENCOURAGEMENTS = [
  { en: "You're a math wizard!", zh: "你是数学小天才！" },
  { en: "Wow, super smart!", zh: "哇，太聪明啦！" },
  { en: "High five!", zh: "击掌！" },
  { en: "Awesome sauce!", zh: "棒呆了！" },
  { en: "You did it!", zh: "你做到啦！" },
  { en: "Math champion!", zh: "数学小冠军！" },
];

// ---------- Voice ----------
const Voice = {
  enabled: true,
  speak(text, lang = 'en') {
    if (!this.enabled) return;
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
      u.rate = 0.95;
      u.pitch = 1.3;
      u.volume = 0.95;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  },
  cancel() {
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
  },
};

// ---------- Logic ----------
function planProblem(a, b) {
  const baseIsLeft = a >= b;
  const base = Math.max(a, b);
  const other = Math.min(a, b);
  const needed = 10 - base;
  const remainder = other - needed;
  return { a, b, baseIsLeft, base, other, needed, remainder, sum: 10 + remainder };
}

function buildQuizOptions(answer) {
  const opts = [answer];
  const pool = [answer - 2, answer - 1, answer + 1, answer + 2].filter(v => v > 0 && v !== answer);
  while (opts.length < 3 && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    opts.push(pool.splice(idx, 1)[0]);
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

function speakStep(step, plan, lang, animals) {
  const baseAnimal = plan.baseIsLeft ? animals[0] : animals[1];
  const otherAnimal = plan.baseIsLeft ? animals[1] : animals[0];
  const baseName = ANIMAL_NAMES[baseAnimal];
  const otherName = ANIMAL_NAMES[otherAnimal];

  let en = '', zh = '';
  switch (step) {
    case 0:
      en = `Let's solve ${plan.a} plus ${plan.b}!`;
      zh = `我们来算 ${plan.a} 加 ${plan.b}！`;
      break;
    case 1:
      en = `The ${plan.base} ${baseName.en} need ${plan.needed} more friend${plan.needed > 1 ? 's' : ''} to make ten!`;
      zh = `${plan.base}只${baseName.zh}还差${plan.needed}个朋友就能凑成十！`;
      break;
    case 2:
      en = `Hop hop! ${plan.needed} ${otherName.en} jumping over!`;
      zh = `跳跳跳！${plan.needed}只${otherName.zh}跳过去！`;
      break;
    case 3:
      en = plan.remainder > 0
        ? `We made ten! And ${plan.remainder} left over.`
        : `Look, we made ten!`;
      zh = plan.remainder > 0
        ? `我们凑成十啦！还剩${plan.remainder}个。`
        : `看，我们凑成十啦！`;
      break;
    case 4:
      en = `Ten plus ${plan.remainder} equals ${plan.sum}!`;
      zh = `十加${plan.remainder}等于${plan.sum}！`;
      break;
    case 5:
      en = `Tap the answer! What is ${plan.a} plus ${plan.b}?`;
      zh = `点一下答案！${plan.a} 加 ${plan.b} 等于多少？`;
      break;
    default: return;
  }
  Voice.speak(lang === 'zh' ? zh : en, lang);
}

// =========================================================
// App
// =========================================================
function App() {
  const [screen, setScreen] = useState('welcome');
  const [problemIdx, setProblemIdx] = useState(0);
  const [stars, setStars] = useState(0);
  const [lang, setLang] = useState('en');
  const [muted, setMuted] = useState(false);
  const [animalPairIdx, setAnimalPairIdx] = useState(0);
  const [confetti, setConfetti] = useState(0);

  useEffect(() => { Voice.enabled = !muted; }, [muted]);

  useEffect(() => {
    setAnimalPairIdx(Math.floor(Math.random() * ANIMAL_PAIRS.length));
  }, [problemIdx, screen]);

  const handleStart = () => {
    setScreen('problem');
    setProblemIdx(0);
    setStars(0);
  };
  const handleCorrect = () => {
    setStars(s => s + 1);
    setConfetti(c => c + 1);
  };
  const handleNextProblem = () => {
    if (problemIdx + 1 >= PROBLEMS.length) setScreen('complete');
    else setProblemIdx(i => i + 1);
  };
  const handleHome = () => { Voice.cancel(); setScreen('welcome'); };

  return (
    <div className="app">
      <div className="cloud c1">☁️</div>
      <div className="cloud c2">☁️</div>
      <div className="cloud c3">☁️</div>
      <div className="hill"></div>

      {screen !== 'welcome' && (
        <Header
          stars={stars}
          lang={lang}
          onLang={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          muted={muted}
          onMute={() => setMuted(m => !m)}
          onHome={handleHome}
          problemIdx={problemIdx}
          total={PROBLEMS.length}
        />
      )}

      {screen === 'welcome' && (
        <Welcome
          onStart={handleStart}
          lang={lang}
          onLangToggle={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          muted={muted}
          onMute={() => setMuted(m => !m)}
        />
      )}

      {screen === 'problem' && (
        <ProblemScene
          key={`p-${problemIdx}`}
          problem={PROBLEMS[problemIdx]}
          animals={ANIMAL_PAIRS[animalPairIdx]}
          lang={lang}
          onCorrect={handleCorrect}
          onNext={handleNextProblem}
          jokeIdx={problemIdx % JOKES.length}
        />
      )}

      {screen === 'complete' && (
        <CompleteScreen stars={stars} total={PROBLEMS.length} onReplay={handleStart} />
      )}

      {confetti > 0 && <Confetti key={`c-${confetti}`} />}
    </div>
  );
}

// =========================================================
// Welcome
// =========================================================
function Welcome({ onStart, lang, onLangToggle, muted, onMute }) {
  return (
    <React.Fragment>
      <div className="header" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <div style={{ width: 100 }}></div>
        <div className="icon-buttons">
          <button className="icon-btn lang" onClick={onLangToggle}>
            {lang === 'en' ? 'EN' : '中文'}
          </button>
          <button className={`icon-btn ${!muted ? 'on' : ''}`} onClick={onMute}>
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>
      <div className="welcome">
        <div className="welcome-animals">
          <span>🐸</span><span>🦆</span><span>🐱</span><span>🐰</span><span>🐻</span>
        </div>
        <h1 className="welcome-title">
          Make <span className="word2">TEN!</span>
        </h1>
        <p className="welcome-sub">
          A fun math adventure · <span className="zh">凑十大冒险</span>
        </p>
        <button
          className="big-btn"
          onClick={() => {
            Voice.speak(lang === 'zh' ? '我们开始吧！' : "Let's go!", lang);
            onStart();
          }}
        >
          {lang === 'zh' ? '开始 ▶' : 'START ▶'}
        </button>
      </div>
    </React.Fragment>
  );
}

// =========================================================
// Header
// =========================================================
function Header({ stars, lang, onLang, muted, onMute, onHome, problemIdx, total }) {
  const windowSize = Math.min(7, total);
  let startIdx = Math.max(0, Math.min(problemIdx - 3, total - windowSize));
  const dots = [];
  for (let i = 0; i < windowSize; i++) {
    const idx = startIdx + i;
    let cls = 'dot';
    if (idx < problemIdx) cls += ' done';
    if (idx === problemIdx) cls += ' current';
    dots.push(<div key={idx} className={cls}></div>);
  }
  return (
    <div className="header">
      <div className="stars-pill">
        <span className="star">⭐</span>
        <span className="num">{stars}</span>
      </div>
      <div className="progress">{dots}</div>
      <div className="icon-buttons">
        <button className="icon-btn lang" onClick={onLang} title="Switch language">
          {lang === 'en' ? 'EN' : '中文'}
        </button>
        <button className={`icon-btn ${!muted ? 'on' : ''}`} onClick={onMute} title="Toggle sound">
          {muted ? '🔇' : '🔊'}
        </button>
        <button className="icon-btn" onClick={onHome} title="Home">🏠</button>
      </div>
    </div>
  );
}

// =========================================================
// ProblemScene — step-by-step animation
// =========================================================
function ProblemScene({ problem, animals, lang, onCorrect, onNext, jokeIdx }) {
  const plan = useMemo(() => planProblem(problem.a, problem.b), [problem]);
  const [step, setStep] = useState(0);
  const [moving, setMoving] = useState(false);
  const [quizState, setQuizState] = useState(null);
  const [chosen, setChosen] = useState(null);

  const leftAnimal = animals[0];
  const rightAnimal = animals[1];
  const baseSide = plan.baseIsLeft ? 'left' : 'right';
  const otherSide = plan.baseIsLeft ? 'right' : 'left';

  const animalsState = useMemo(() => {
    const list = [];
    for (let i = 0; i < problem.a; i++) {
      list.push({ id: `L${i}`, kind: leftAnimal, originalSide: 'left', initialCell: i, willMove: false });
    }
    for (let i = 0; i < problem.b; i++) {
      list.push({ id: `R${i}`, kind: rightAnimal, originalSide: 'right', initialCell: i, willMove: false });
    }
    const otherList = list.filter(x => x.originalSide === otherSide);
    const movers = otherList.slice(otherList.length - plan.needed);
    movers.forEach(m => { m.willMove = true; });
    let destSlot = plan.base;
    movers.forEach(m => { m.destCell = destSlot++; });
    return list;
  }, [problem, plan, leftAnimal, rightAnimal, otherSide]);

  useEffect(() => {
    if (step === 2) {
      setMoving(true);
      const t = setTimeout(() => { setMoving(false); setStep(3); }, 900);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    const t = setTimeout(() => speakStep(step, plan, lang, animals), 250);
    return () => clearTimeout(t);
  }, [step, lang]);

  function handlePick(value) {
    if (quizState === 'correct') return;
    setChosen(value);
    if (value === plan.sum) {
      setQuizState('correct');
      onCorrect();
      const enc = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      Voice.speak(`${plan.sum}! ${lang === 'zh' ? enc.zh : enc.en}`, lang);
      setTimeout(() => setStep(6), 700);
    } else {
      setQuizState('wrong');
      Voice.speak(lang === 'zh' ? '再试一次！看看图片！' : "Oops, try again! Look at the picture!", lang);
      setTimeout(() => { setQuizState(null); setChosen(null); }, 800);
    }
  }

  const quizOptions = useMemo(() => buildQuizOptions(plan.sum), [plan.sum]);

  const advance = () => {
    if (step === 5 || step === 2) return;
    if (step === 6) { Voice.cancel(); onNext(); return; }
    setStep(s => s + 1);
  };
  const replay = () => { setStep(0); setQuizState(null); setChosen(null); };

  return (
    <div className="scene">
      <Equation plan={plan} step={step} />
      <Stage plan={plan} animals={animals} animalsState={animalsState} step={step} moving={moving} />
      {step < 5 && <NarratorBubble step={step} plan={plan} animals={animals} />}
      {step === 5 && (
        <QuizPanel plan={plan} options={quizOptions} chosen={chosen} quizState={quizState} onPick={handlePick} />
      )}

      <div className="controls">
        {step !== 5 && step !== 2 && (
          <React.Fragment>
            <button className="next-btn replay" onClick={replay} title="Replay">↺</button>
            <button className="next-btn" onClick={advance}>
              {step === 6 ? (lang === 'zh' ? '下一题 ▶' : 'Next ▶') : (lang === 'zh' ? '继续 ▶' : 'Next ▶')}
            </button>
          </React.Fragment>
        )}
      </div>

      <div className="joke">
        💡 {JOKES[jokeIdx].en} · {JOKES[jokeIdx].zh}
      </div>
    </div>
  );
}

// =========================================================
// Equation
// =========================================================
function Equation({ plan, step }) {
  const showMadeTen = step >= 3;
  const showAnswer = step >= 4;
  let leftVal, rightVal;
  if (!showMadeTen) {
    leftVal = plan.a; rightVal = plan.b;
  } else if (plan.baseIsLeft) {
    leftVal = 10; rightVal = plan.remainder;
  } else {
    leftVal = plan.remainder; rightVal = 10;
  }

  const leftCls = showMadeTen && plan.baseIsLeft ? 'ten' : 'left';
  const rightCls = showMadeTen && !plan.baseIsLeft ? 'ten' : 'right';

  return (
    <div className="equation">
      <span key={`l-${leftVal}-${leftCls}`} className={`eq-num ${leftCls} ${leftVal === 0 ? 'zero' : ''}`}>
        {leftVal}
      </span>
      <span className="eq-op">+</span>
      <span key={`r-${rightVal}-${rightCls}`} className={`eq-num ${rightCls} ${rightVal === 0 ? 'zero' : ''}`}>
        {rightVal}
      </span>
      <span className="eq-op">=</span>
      {showAnswer
        ? <span key="ans" className="eq-num eq-answer">{plan.sum}</span>
        : <span className="eq-num eq-answer hidden"></span>
      }
    </div>
  );
}

// =========================================================
// Stage — two ten-frames with animal layer
// =========================================================
function Stage({ plan, animals, animalsState, step, moving }) {
  const baseSide = plan.baseIsLeft ? 'left' : 'right';
  const highlight = step === 1 ? baseSide : null;
  const fullFrame = step >= 3 ? baseSide : null;
  const leftCount = step < 3 ? plan.a : (plan.baseIsLeft ? 10 : plan.remainder);
  const rightCount = step < 3 ? plan.b : (plan.baseIsLeft ? plan.remainder : 10);

  return (
    <div className="stage">
      <FrameSide
        side="left"
        plan={plan}
        animalsState={animalsState}
        step={step}
        moving={moving}
        highlighted={highlight === 'left'}
        full={fullFrame === 'left'}
        countLabel={leftCount}
      />
      <div className="plus-sign">+</div>
      <FrameSide
        side="right"
        plan={plan}
        animalsState={animalsState}
        step={step}
        moving={moving}
        highlighted={highlight === 'right'}
        full={fullFrame === 'right'}
        countLabel={rightCount}
      />
    </div>
  );
}

function FrameSide({ side, plan, animalsState, step, moving, highlighted, full, countLabel }) {
  const baseSide = plan.baseIsLeft ? 'left' : 'right';
  const isBase = side === baseSide;

  const glowCells = new Set();
  if (step === 1 && isBase) {
    for (let i = plan.base; i < 10; i++) glowCells.add(i);
  }

  const onThisSide = animalsState.filter(a => {
    if (step < 2) return a.originalSide === side;
    if (a.willMove) return isBase;
    return a.originalSide === side;
  });

  function cellPosition(idx) {
    const col = idx % 5;
    const row = Math.floor(idx / 5);
    return {
      left: `calc(6px + ${col} * (var(--cell) + 4px))`,
      top: `calc(6px + ${row} * (var(--cell) + 4px))`,
    };
  }

  return (
    <div className="frame-wrap">
      <div className={`group-label ${side} ${full ? 'full' : ''}`}>
        {countLabel}{full ? ' = 10! 🎉' : ''}
      </div>
      <div className={`ten-frame ${highlighted ? 'highlight' : ''} ${full ? 'full' : ''}`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`cell ${glowCells.has(i) ? 'glow' : ''}`}></div>
        ))}
        <div className="animals-layer">
          {onThisSide.map(a => {
            let cellIdx;
            if (a.willMove && step < 2) cellIdx = a.initialCell;
            else if (a.willMove && step >= 2) cellIdx = a.destCell;
            else cellIdx = a.initialCell;
            const pos = cellPosition(cellIdx);
            const isHopping = a.willMove && step === 2 && moving;
            return (
              <div
                key={a.id}
                className={`animal entering ${isHopping ? 'hopping' : ''}`}
                style={{ ...pos, animationDelay: step === 0 ? `${a.initialCell * 0.04}s` : '0s' }}
              >
                {a.kind}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =========================================================
// Narrator
// =========================================================
function NarratorBubble({ step, plan, animals }) {
  const baseAnimal = plan.baseIsLeft ? animals[0] : animals[1];
  const otherAnimal = plan.baseIsLeft ? animals[1] : animals[0];
  const baseName = ANIMAL_NAMES[baseAnimal];
  const otherName = ANIMAL_NAMES[otherAnimal];
  const mascot = ['🦉', '🐻', '🦊', '🐱'][step % 4];

  let en, zh;
  switch (step) {
    case 0:
      en = <React.Fragment>Let's solve <span className="highlight">{plan.a} + {plan.b}</span>!</React.Fragment>;
      zh = <React.Fragment>我们来算 <span className="highlight">{plan.a} + {plan.b}</span> 吧！</React.Fragment>;
      break;
    case 1:
      en = <React.Fragment>The <span className="highlight-sun">{plan.base}</span> {baseName.en} need <span className="highlight">{plan.needed}</span> more friend{plan.needed > 1 ? 's' : ''} to make <span className="highlight-sun">TEN!</span></React.Fragment>;
      zh = <React.Fragment><span className="highlight-sun">{plan.base}</span>只{baseName.zh}还差 <span className="highlight">{plan.needed}</span> 个朋友就凑成 <span className="highlight-sun">十</span>啦！</React.Fragment>;
      break;
    case 2:
      en = <React.Fragment>Hop, hop! <span className="highlight">{plan.needed}</span> {otherName.en} jumping over!</React.Fragment>;
      zh = <React.Fragment>跳跳跳！<span className="highlight">{plan.needed}</span>只{otherName.zh}跳过去！</React.Fragment>;
      break;
    case 3:
      en = <React.Fragment>Yay! We made <span className="highlight-sun">TEN</span>{plan.remainder > 0 ? <React.Fragment>, with <span className="highlight">{plan.remainder}</span> left over!</React.Fragment> : '!'}</React.Fragment>;
      zh = <React.Fragment>耶！我们凑成 <span className="highlight-sun">十</span>{plan.remainder > 0 ? <React.Fragment>啦，还剩 <span className="highlight">{plan.remainder}</span> 个！</React.Fragment> : '啦！'}</React.Fragment>;
      break;
    case 4:
      en = <React.Fragment><span className="highlight-sun">10</span> + <span className="highlight">{plan.remainder}</span> = <span className="highlight-grass">{plan.sum}</span>! Easy peasy!</React.Fragment>;
      zh = <React.Fragment><span className="highlight-sun">10</span> + <span className="highlight">{plan.remainder}</span> = <span className="highlight-grass">{plan.sum}</span>！简单！</React.Fragment>;
      break;
    default: en = ''; zh = '';
  }

  return (
    <div className="narrator">
      <div className="mascot">{mascot}</div>
      <div className="bubble">
        <span className="en">{en}</span>
        <span className="zh">{zh}</span>
      </div>
    </div>
  );
}

// =========================================================
// Quiz Panel
// =========================================================
function QuizPanel({ plan, options, chosen, quizState, onPick }) {
  return (
    <React.Fragment>
      <div className="quiz-question">
        What is {plan.a} + {plan.b}? 🤔
        <span className="zh">{plan.a} + {plan.b} 等于多少？</span>
      </div>
      <div className="quiz-options">
        {options.map(v => {
          let cls = 'quiz-opt';
          if (chosen === v && quizState === 'correct') cls += ' correct';
          if (chosen === v && quizState === 'wrong') cls += ' wrong';
          if (quizState === 'correct' && chosen !== v) cls += ' disabled';
          return (
            <button key={v} className={cls} onClick={() => onPick(v)}>
              {v}
            </button>
          );
        })}
      </div>
    </React.Fragment>
  );
}

// =========================================================
// Confetti
// =========================================================
function Confetti() {
  const pieces = useMemo(() => {
    const arr = [];
    const emojis = ['🎉', '⭐', '🌟', '✨', '🎊', '💫', '🌈', '🎈', '🦄'];
    for (let i = 0; i < 50; i++) {
      arr.push({
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2 + Math.random() * 1.8,
        size: 22 + Math.random() * 24,
      });
    }
    return arr;
  }, []);
  return (
    <div className="confetti-layer">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

// =========================================================
// Complete Screen
// =========================================================
function CompleteScreen({ stars, total, onReplay }) {
  useEffect(() => {
    Voice.speak("You did it! What a math champion!", 'en');
  }, []);
  return (
    <div className="complete-overlay">
      <div style={{ fontSize: 100 }}>🏆</div>
      <h1 className="complete-title">You did it!</h1>
      <p className="complete-sub">你做到啦！</p>
      <div className="complete-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.15}s` }}>⭐</span>
        ))}
      </div>
      <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', marginBottom: 30 }}>
        ⭐ {stars} / {total}
      </div>
      <button className="big-btn coral" onClick={onReplay}>
        Play Again ↺
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
