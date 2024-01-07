const $box = document.querySelector('#box');
const $minuteText = document.querySelector('#minute-text');
const $secondText = document.querySelector('#second-text');
const $bbomoCount = document.querySelector('#bbomo-count');
const $initializeButton = document.querySelector('#initialize-button');

const timerData = {
  minute: 0,
  second: 0,
  cond: false,
  bbomoNum: 0,
};

const baseBackground = '#cd73d9';

// 시간이 주어졌을 때 해당 시간의 각도와 종점의 좌표를 반환하는 함수

const minuteCalculator = (minute, radius) => {
  const result = {};

  result.angle = (minute - 15) * 6; // 12시 방향부터 0이 시작되도록 변경
  result.radian = (result.angle / 180) * Math.PI;
  result.X = radius * Math.cos(result.radian);
  result.Y = radius * Math.sin(result.radian);

  return result;
};

// 시침과 분침 만들기

const appendMinuteHand = (minute) => {
  const $minuteHand = new Bulider('div')
    .addClass('minuteHand')
    .addClass(minute % 5 ? 'thin' : 'thick')
    .setTransform(`rotateZ(${minute * 6}deg)`);

  $box.appendChild($minuteHand.tag);
};

[...Array(30).keys()].forEach((minute) => appendMinuteHand(minute));

// 분침 텍스트 만들기

const appendMinuteText = (minute) => {
  const CalculatedCoord = minuteCalculator(minute, 250);

  const $minuteText = new Bulider('p')
    .addClass('minuteText')
    .setTextContent(minute)
    .setTransform(`translate(${CalculatedCoord.X}px,${CalculatedCoord.Y}px)`);

  $box.appendChild($minuteText.tag);
};

const minuteFiveInterval = [...Array(12)].map((_, index) => index * 5);
minuteFiveInterval.forEach((minute) => appendMinuteText(minute));

// 분침부분 일부분만 보이도록 만들어주기

const $circleForHide = new Bulider('div').setID('circleForHide');
$box.appendChild($circleForHide.tag);

// 타이머 시작 및 정지 생성하기

const $playButton = new Bulider('button')
  .addClass('play-button')
  .setTextContent('❤️‍🔥');

$box.appendChild($playButton.tag);

// 타이머 런닝 타입 구현하기

const makeRunningTime = () => {
  const CalculatedCoord = minuteCalculator(timerData.minute, 112.5);

  const $runningTime = new Bulider('div')
    .addClass('running-time')
    .setTransform(
      `translate(${CalculatedCoord.X}px, ${CalculatedCoord.Y}px)  rotateZ(${CalculatedCoord.angle}deg)`,
    );

  $box.appendChild($runningTime.tag);
};

// 뽀모 횟수 카운트하기

const bbomoUpdate = () => {
  timerData.bbomoNum += 1;
  $bbomoCount.textContent = timerData.bbomoNum;
};

// 초기화 버튼 이벤트 만들어주기

// 설정 모두 초기화 하기
const timerInitializing = () => {
  timerData.minute = 0;
  timerData.second = 0;
  timerData.cond = false;

  $minuteText.textContent = '00';
  $secondText.textContent = '00';
  $playButton.setTextContent('❤️‍🔥');

  [...document.querySelectorAll('.running-time')].forEach((runningTime) => {
    $box.removeChild(runningTime);
  });
};

// body 태그의 배경색을 변경해주었다가 원상태로 복구하는 함수
const changeBodyBackgroud = (color) => {
  const $body = document.querySelector('body');
  setTimeout(() => {
    $body.style.background = baseBackground;
  }, 1000);
  $body.style.background = color;
};

$initializeButton.addEventListener('click', timerInitializing);
$initializeButton.addEventListener('click', () => changeBodyBackgroud('red'));

// 타이머 실행하는 콜백함수 구현하기

const changeTimerBoard = () => {
  $minuteText.textContent =
    timerData.minute < 10 ? `0${timerData.minute}` : timerData.minute;
  $secondText.textContent =
    timerData.second < 10 ? `0${timerData.second}` : timerData.second;
};

// 타이머 실행 메소드 구현하기

const timerActivate = () => {
  if (!timerData.cond) return;
  if (timerData.second >= 59) makeRunningTime();

  timerData.minute =
    timerData.second >= 59 ? timerData.minute + 1 : timerData.minute;
  timerData.second = timerData.second >= 59 ? 0 : timerData.second + 1;

  if (timerData.minute === 60) {
    bbomoUpdate();
    timerInitializing();
    changeBodyBackgroud('yellow');
  }
  changeTimerBoard();
};

// timer 스로틀링 이용하여 생성하기

const settingInterval = () => {
  let timer;

  return () => {
    if (timer) {
      clearInterval(timer);
    }

    timer = setInterval(timerActivate, 200);
  };
};

// 플레이 버튼을 누르면 컨디션과 textContent가 변경되게 만들기

const settingplayButton = () => {
  $playButton.setTextContent(timerData.cond ? '⏸️' : '❤️‍🔥');

  timerData.minute = timerData.minute === 60 ? 0 : timerData.minute;
  timerData.cond = timerData.cond ? false : true;
};

// 플레이 버튼을 누르면 타이머를 작동 시키도록 만들기

$playButton.tag.addEventListener('click', settingplayButton);
$playButton.tag.addEventListener('click', settingInterval());
