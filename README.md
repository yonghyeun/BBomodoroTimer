# BBomodoroTimer

<img src = 'https://velog.velcdn.com/images/yonghyeun/post/88c574cb-bf01-4b4a-bf0f-018dcc00da92/image.gif'>

뽀모도로 타이머를 토이프로젝트로 만들어보았습니다.

<a href = 'https://yonghyeun.github.io/BBomodoroTimer/'>사이트 링크</a>

온전한 이미지들과 가독성 높은 게시글은 <a href = 'https://velog.io/@yonghyeun/%EB%B0%94%EB%8B%90%EB%9D%BC-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-%EB%BD%80%EB%AA%A8%EB%8F%84%EB%A1%9C-%ED%83%80%EC%9D%B4%EB%A8%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0'>벨로그</a> 에서 확인하세요 !

# 구현 과정

---

저번에 만든 투두리스트 위에 뽀모도로 타이머 기능이 있으면 좋겠다고 생각했다.

뽀모도로 학습법이란 **사람의 뇌는 휴식 없이 한 가지 작업에 몰두하기 어렵기 때문에 짧은 시간의 작업과 휴식을 반복하면서 집중력을 높게 유지시키는 학습법을 의미한다.**

전체적인 공부 시간을 $N$ 번의 사이클 `(1뽀모)`로 나눈 후

각 사이클 별 `집중 시간` , `휴식 시간` 을 정해 $N$뽀모 만큼 학습하는 학습법을 의미한다.

나는 $1$뽀모의 기준을 1시간, 휴식 시간을 10분으로 설정하여 타이머를 만들려고 한다.

또한 토이 프로젝트를 하며 전체적인 흐름은 기능 구현 후에 리팩토링을 반복적으로 수행하면서 진행해보려고 한다.

> ㅎㅎ 리팩토링에 대한 서적을 딱 30페이지만 읽었다. 그래서 리팩토링에 대한 내용이 매우 부실 할 수 있지만 먼저 실습 해본 후 책을 더 읽어보려고 한다.

---

# 전체적인 틀 잡기

#### `html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="box"></div>
  </body>
  <script src="script.js"></script>
</html>
```

#### `CSS`

```css
* {
  font-family: kakao;
  margin: 0px;
  padding: 0px;
}

#box {
  margin: 100px auto;
  width: 500px;
  height: 500px;
  border-radius: 20%;
  position: relative;
  background-color: #ddd;
  /* flexbox 를 이용해 중앙 정렬 */
  display: flex;
  justify-content: center;
  align-items: center;
}
```

![](https://velog.velcdn.com/images/yonghyeun/post/9c683d0e-8bdc-481a-bfe8-d29679528147/image.png)

타이머가 들어갈 시계의 모양만 정적으로 잡아준 후

나머지는 모두 자바스크립트를 이용해 시침과 분침을 추가해주려고 한다.

---

# 시침과 분침 추가하기

## 기능 구현

#### `css`

![](https://velog.velcdn.com/images/yonghyeun/post/3a062fd1-0ba5-4f4c-b36d-4a0dfb0f0a4b/image.gif)

```css
.tick {
  position: absolute;
}

.thin {
  width: 80%;
  border: 1px solid black;
}

.thick {
  width: 90%;
  border: 1.5px solid black;
}
```

분침들을 나타내는 `.tick` 클래스의 태그가 `box` 내부에 형제 노드들로 쌓였을 때

하나씩 나열되는 것이 아니라 중첩되게 쌓일 수 있도록 `position : absolute` 를 설정해주었다.

이후 5분 간격을 나타내는 `.tick` 클래스는 더 두껍고 길게 해주었고 일반 분을 나타내는 `thin` 들은 더 얇고 짧게 스타일링을 설정해주었다.

#### `script`

```js
const $box = document.querySelector('#box');

// 시침과 분침 만들기

for (let i = 0; i < 30; i += 1) {
  const $tick = document.createElement('div');
  $tick.classList.add('tick');
  $box.appendChild($tick);

  if (i % 5) {
    $tick.classList.add('thin');
  } else {
    $tick.classList.add('thick');
  }
  $tick.style.transform = `rotateZ(${i * 6}deg)`;
}
```

60분 간격의 타이머에 필요한 분침의 개수는 30개이다.

그 이유는 한 분침의 좌우를 기점으로 양 옆의 분을 표현 할 수 있기 때문이다.

분침을 `box` 에 추가해준 후 `transform : rotateZ` 를 이용하여 회전시켜 주었다.

## 리팩토링 하기

### 문제점 1. 반복문 내 모호한 지역 변수명 사용

반복문에서 `i` 는 분침을 나타내는 지역변수 이기 때문에 `i` 라는 모호한 이름보다 `minute` 이란 이름으로 만들어주자

```js
// 시침과 분침 만들기

for (let minute = 0; minute < 30; minute += 1) {
  const $tick = document.createElement('div');
  $tick.classList.add('tick');
  $box.appendChild($tick);

  if (minute % 5) {
    $tick.classList.add('thin');
  } else {
    $tick.classList.add('thick');
  }
  $tick.style.transform = `rotateZ(${i * 6}deg)`;
}
```

### 문제점 2. 들여쓰기는 가독성을 해친다.

이전 다른 리팩토링 관련 유튜브 영상에서 들여쓰기가 적을 수록 가독성이 올라간다고 하였다.

분침은 오로지 `minute` 이란 지역 변수 만으로 결정되는 요소이기 때문에 함수를 이용해 들여쓰기를 최소화 해보자

```js
// 시침과 분침 만들기

const makeTick = (minute) => {
  const $tick = document.createElement('div');
  $box.appendChild($tick);
  $tick.classList.add('tick');
  $tick.style.transform = `rotateZ(${minute * 6}deg)`;
  if (minute % 5) {
    $tick.classList.add('thin');
    return;
  }
  $tick.classList.add('thick');
};

for (let minute = 0; minute < 30; minute += 1) {
  makeTick(minute);
}
```

들여쓰기를 지양하기 위해 `early return` 을 사용하였는데 여전히 지저분한 느낌이 난다.

어차피 조건문 블록 내부에서 하는 일이라곤 클래스 명을 결정하는 것 밖에 없기 때문에

삼항 연산자를 이용해보자

```js
// 시침과 분침 만들기

const makeTick = (minute) => {
  const $tick = document.createElement('div');
  $box.appendChild($tick);
  $tick.classList.add('tick');
  $tick.style.transform = `rotateZ(${minute * 6}deg)`;
  $tick.classList.add(minute % 5 ? 'thin' : 'thick');
};

for (let minute = 0; minute < 30; minute += 1) {
  makeTick(minute);
}
```

구우우웃~

### 문제점 3. 모호한 변수명이 존재한다.

분침을 의미하는 태그인 `$tick` 과 두꺼운 분침을 나타내는 `thick` 이 모호하다.

모호한 클래스명인 `tick` 을 `thick` 과 구별 될 수 있게 변경하자

```css
.minuteHand {
  position: absolute;
}
```

```js
// 시침과 분침 만들기

const appendMinuteHand = (minute) => {
  const $minuteHand = document.createElement('div');
  $box.appendChild($minuteHand);

  $minuteHand.classList.add('minuteHand');
  $minuteHand.style.transform = `rotateZ(${minute * 6}deg)`;
  $minuteHand.classList.add(minute % 5 ? 'thin' : 'thick');
};

for (let minute = 0; minute < 30; minute += 1) {
  appendMinuteHand(minute);
}
```

분침을 나타내는 변수 명을 `$minuteHand`로 변경해주고 클래스명도 변경해주었다.

구우웃~~

### 문제점4. `for` 문 말고 배열의 고급 함수를 이용하자

최대한 `for` 문을 지양하기 위해 배열의 고급 함수를 이용했다.

```js
// 시침과 분침 만들기

const appendMinuteHand = (minute) => {
  const $minuteHand = document.createElement('div');
  $box.appendChild($minuteHand);

  $minuteHand.classList.add('minuteHand');
  $minuteHand.style.transform = `rotateZ(${minute * 6}deg)`;
  $minuteHand.classList.add(minute % 5 ? 'thin' : 'thick');
};

[...Array(30).keys()].forEach((minute) => appendMinuteHand(minute));
```

30까지의 반복문을 스프레드 문법과 인덱스를 뽑아내는 `keys()` 를 이용하고 `forEach` 를 이용하여 반복문을 대체하였다.

구우웃 ~

### 리팩토링 평가

![](https://velog.velcdn.com/images/yonghyeun/post/98b03280-749b-4561-8c2c-9d7766f0f82e/image.png)

```js
// 리팩토링 이전

for (let i = 0; i < 30; i += 1) {
  const $tick = document.createElement('div');
  $tick.classList.add('tick');
  $box.appendChild($tick);

  if (i % 5) {
    $tick.classList.add('thin');
  } else {
    $tick.classList.add('thick');
  }
  $tick.style.transform = `rotateZ(${i * 6}deg)`;
}
```

```js
//리팩토링 이후

const appendMinuteHand = (minute) => {
  const $minuteHand = document.createElement('div');
  $box.appendChild($minuteHand);

  $minuteHand.classList.add('minuteHand');
  $minuteHand.style.transform = `rotateZ(${minute * 6}deg)`;
  $minuteHand.classList.add(minute % 5 ? 'thin' : 'thick');
};

[...Array(30).keys()].forEach((minute) => appendMinuteHand(minute));
```

변수명을 변경한 것이 가독성 향상에 큰 도움을 준 것 같다.

---

# 분침 텍스트 넣기

## 기능 구현

![](https://velog.velcdn.com/images/yonghyeun/post/58f590a7-c5d5-4fc3-9ece-c4e044adfca4/image.png)

#### `css`

```css
/* 분침 텍스트 관련 속성 */

.minuteText {
  position: absolute;
  font-size: 20px;
}
```

#### `script`

```js
// 분침 텍스트 만들기

const appendText = (minute, radius = 250) => {
  const angle = minute * 6;
  const radian = (angle / 180) * Math.PI;
  const X = radius * Math.cos(radian);
  const Y = radius * Math.sin(radian);
  const $minuteText = document.createElement('p');

  $minuteText.classList.add('minuteText');
  $minuteText.textContent = minute;
  $minuteText.style.transform = `translate(${X}px,${Y}px)`;

  $box.appendChild($minuteText);
};

[...Array(12).keys()].forEach((minute) => appendText(minute * 5));
```

위에서 리팩토링 때 준수했던 사항을 준수하여 분침 텍스를 넣는 스크립트를 작성하였다.

위치를 지정하지 않은 초기의 `$minuiteText` 는 `$box` 의 중앙 부분에 위치한다.

이동한 각도를 $\theta$ 라고 두었을 때 해당 각도를 $\pi$ `(라디안)` 으로 변경해주었다.

변경한 이유는 `Math.cos , Math.sin` 은 호도법을 기준으로 작동하기 때문이다.

이동시켜 줄 때에는 기준이 되는 `radius` (이동 반경의 반지름) 에 회전 값인 `Math.cos , Math.sin` 를 곱해줘 총 이동 거리인 `X , Y` 를 계산해주었다.

`radius` 값을 `250` 으로 둔 이유는 제일 긴 분침의 길이가 `$box` 의 `width (500px) * 90% = 450px` 이기 때문에 반지름 값은 `450px / 2` 보다는 조금 더 길게하여 분침 위에 존재 할 수 있도록 하기 위함이였다.

## 기능상의 문제 해결

![](https://velog.velcdn.com/images/yonghyeun/post/5bd297e8-dea3-453d-b192-9184ef2deb9c/image.png)

`$minuteText` 는 반복문 상에서 0부터 시작하기 때문에 `Math.sin(0)` 은 0이 되어 3시 시계 방향부터 `0` 이 시작하는 모습을 볼 수 있다.

전형적인 타이머의 경우 `0` 은 12시 방향부터 시작이기 때문에 시작부분인 `0` 이 12시 방향에 위치 할 수 있도록 수정해주자

![](https://velog.velcdn.com/images/yonghyeun/post/a30f8a4d-adc5-4940-9ef8-d1e3e3d063b8/image.png)

```js
const appendText = (minute, radius = 250) => {
  const angle = (minute - 15) * 6; // 12시 방향부터 0이 시작되도록 변경
  ...
```

그냥 간단하게 들어오는 `minute` 에서 15분을 뺴주어 12시 방향부터 0이 시작되도록 변경해주었다.

## 리팩토링

### 문제점 1. 함수 명이 애매모하다.

맨 처음 나는 `appendText` 라는 함수명을 사용했는데

이는 `5분간격의 분 텍스트` 를 넣어주는 함수의 기능을 잘 표현해주지 못한 것 같다.

그래서 함수 명을 변경해주었다.

```js
const appendMinuteText = (minute, radius = 250) => {
  const angle = (minute - 15) * 6; // 12시 방향부터 0이 시작되도록 변경
  ...
```

### 문제점 2. 함수 실행에서 잘못된 인수명을 사용하고 있다.

```js
[...Array(12).keys()].forEach((minute) => appendMinuteText(minute * 5));
```

이 부분이 마음에 안들었다.

나는 5분 간격으로 분침을 넣기 위해 `appendText` 에 `minute * 5` 를 인수로 넣어줬는데

사실상 `[...Array(12).keys()].forEach((minute)` 에서 전달되는 `minute` 은 실제 분을 의미하기 보다는 각 분의 인덱스를 나타내는 것과 같다. (`0번째 5분 간격상의 값 , 1번째 5분 간격상의 값 .. `)

그러니 좀 더 명확하게 표현 할 수 있도록 변경해주자

```js
const minuteFiveInterval = [...Array(12)].map((_, index) => index * 5);
minuteFiveInterval.forEach((minute) => appendMinuteText(minute));
```

5분 간격의 분들이 담겨있다는 것을 표현하기 위해 변수 명에 `FiveInterval` 이란 이름을 덧붙혀주었다.

비록 배열을 추가해주는 코드 한 줄이 늘었지만 가독성 부분에서는 어떤 값들이 인수로 전달되는지 더 명확하게 이해가 된다.

### 리팩토링 평가

```js
// 리팩토링 이전

const appendText = (minute, radius = 250) => {
  const angle = minute * 6;
  const radian = (angle / 180) * Math.PI;
  const X = radius * Math.cos(radian);
  const Y = radius * Math.sin(radian);
  const $minuteText = document.createElement('p');

  $minuteText.classList.add('minuteText');
  $minuteText.textContent = minute;
  $minuteText.style.transform = `translate(${X}px,${Y}px)`;

  $box.appendChild($minuteText);
};

[...Array(12).keys()].forEach((minute) => appendText(minute * 5));
```

```js
// 리팩토링 이후

const appendMinuteText = (minute, radius = 250) => {
  const angle = (minute - 15) * 6; // 12시 방향부터 0이 시작되도록 변경
  const radian = (angle / 180) * Math.PI;
  const X = radius * Math.cos(radian);
  const Y = radius * Math.sin(radian);
  const $minuteText = document.createElement('p');

  $minuteText.classList.add('minuteText');
  $minuteText.textContent = minute;
  $minuteText.style.transform = `translate(${X}px,${Y}px)`;
  $box.appendChild($minuteText);
};

const minuteFiveInterval = [...Array(12)].map((_, index) => index * 5);
minuteFiveInterval.forEach((minute) => appendMinuteText(minute));
```

리팩토링 이후 해당 함수들이 어떤 기능을 갖는지, 어떤 변수들이 전달되는지에 대해서 더 명확해진 것 같다.

# 분침 인터페이스 변경하기

타이머 부분에서 분침 부분의 가운데를 가려주는 `circleForHide` 라는 태그를 생성하여 분침을 가려주었다.

![](https://velog.velcdn.com/images/yonghyeun/post/2c71f535-7fc1-4613-a66a-1a7273a707d2/image.png)

#### `css`

```css
/* 분침 일부분만 보이도록 가려주는 태그 */

#circleForHide {
  position: absolute;
  width: 350px;
  height: 350px;
  background-color: #ddd;
  border-radius: 100%;
}
```

#### `script`

```js
const $circleForHide = document.createElement('div');
$circleForHide.id = 'circleForHide';
$box.appendChild($circleForHide);
```

---

# 시작 및 일시정지 버튼 만들기

![](https://velog.velcdn.com/images/yonghyeun/post/0183e58c-b48f-4075-b3c4-041082d710ce/image.gif)

## 기능 구현하기

#### `CSS`

```css
/* 시작 및 정지 버튼 */

.play-button {
  position: absolute;
  width: 20%;
  height: 20%;
  border-radius: 100%;
  border: 0px;
  font-size: 40px;
  color: red;
  background-color: white;
  transition: box-shadow 0.5s;
}

button:hover {
  box-shadow: 0px 0px 10px black;
}
```

#### `script`

```js
// 타이머 시작 및 정지 생성하기

const $playButton = document.createElement('button');
$playButton.classList.add('play-button');
$playButton.textContent = '❤️‍🔥';
$box.appendChild($playButton);
```

우선 버튼의 생김새만 먼저 만들어주었다. `:hover` 를 이용해서 마우스를 올렸을 때 그림자가 생기도록 해주었다.

---

# 타이머 전광판 구현하기

## 기능 구현

![](https://velog.velcdn.com/images/yonghyeun/post/d26d0e69-3794-4f22-988b-99933a2e1e62/image.gif)

#### `html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="box"></div>
    <div id="board">
      <span id="minute-text">00</span> :
      <span id="second-text">00</span>
    </div>
  </body>
  <script src="script.js"></script>
</html>
```

전광판처럼 구현하기 위해 `board > [minute-text , second-text]` 를 자식 태그로 생성해주었다.

#### `css`

```css
body {
  display: flex;
  flex-direction: column;
}

/* 타이머 전광판 */

#board {
  margin: 0 auto;
  font-size: 30px;
}
```

전광판 역할을 하는 것이 타이머 밑에 존재 할 수 있도록 `body` 의 `display` 속성을 변경해주었다.

#### `script`

```js
// 타이머 전광판 구현하기

let minute = 0;
let second = 0;
let cond = true;
const $minuteText = document.querySelector('#minute-text');
const $secondText = document.querySelector('#second-text');

const timerBoard = () => {
  if (cond) {
    if (second >= 59) {
      minute += 1;
      second = 0;
    } else {
      second += 1;
    }

    if (minute === 60) {
      minute = 0;
      cond = false;
    }

    $minuteText.textContent = minute < 10 ? `0${minute}` : minute;
    $secondText.textContent = second < 10 ? `0${second}` : second;
  } else {
    console.log(cond);
  }
};

setInterval(timerBoard, 1000);
```

전역변수로 `minute , second` 를 설정해주고 `setInterval` 을 이용해서 인터벌 별로 `#minute-text , #second-text` 내의 글자가 변경되도록 해주었다.

`초 , 분` 이 계산 될 때 `60초` 가 지나면 `1분`이 올라가게 변경해줬고 , `60분`이 지나면 컨디션 값을 변경하여 더 이상 타이머가 작동하지 않도록 변경해주었다.

이 때 삼항연산자를 이용하여 자리수가 한 자리수인 경우에는 문자 앞에 0을 추가해주었다.

> ### 리팩토리 모자는 나중에 쓰자
>
> 마틴 파울러의 리펙토링과 관련된 세미나를 최근에 보았다.
> <a href = 'https://www.youtube.com/watch?v=mNPpfB8JSIU'> [마틴 파울러] 리팩토링의 중요성 feat.테스트 코드를 짜는 이유(한글 자막)</a>
> 마틴 파울러는 리팩토링을 시행 할 때에는 기능 구현을 할 때엔 기능 구현만, 리팩토링 할 때는 리팩토링만 하라고 하더라
> 그런 행위를 모자를 쓰는 행위에 비유하면서, 한 번에 하나의 모자만 쓰라고 하더라
> 그래서 리팩터링 모자는 타이머의 동적 애니메이션 까지 만든 후에 쓰려고 한다.

## 기능상의 문제 해결하기

전광판을 보면 `textContent` 값이 변경됨에 따라 글자가 지진 난 것마냥 자글자글 흔들리는 모습을 볼 수 있다.

이는 글자를 `span` 태그로 감싸고 있기 때문이다. (span 태그는 인라인블록이기 때문에 글자가 변경됨에 따라 영역의 크기가 변경된다)
![](https://velog.velcdn.com/images/yonghyeun/post/d799d43e-938e-4432-a6de-30c2d59e8222/image.gif)

```css
[id*='text'] {
  display: inline-block;
  width: 30px;
  height: 30px;
}
```

그래서 `span` 태그의 디스플레이 속성을 인라인 블록으로 변경해줘 해결했다.

---

# 타이머 시계 구현하기

## 기능 구현

![](https://velog.velcdn.com/images/yonghyeun/post/fb5d2aad-e439-4b15-9323-7f04c4a37c7b/image.gif)

#### `CSS`

```css
/* 타이머 런닝 타임 관련 속성 */

.running-time {
  position: absolute;
  width: 40%;
  height: 20px;
  background-color: red;
  border: 2px solid red;
}
```

#### `script`

```js
// 타이머 런닝 타입 구현하기

let minute = 0;
let second = 0;
let cond = true;
const $minuteText = document.querySelector('#minute-text');
const $secondText = document.querySelector('#second-text');

const makeRunningTime = (radius = 112.5) => {
  const $runningTime = document.createElement('div');
  $runningTime.classList.add('running-time');

  const angle = (minute - 15) * 6;
  const radian = (angle / 180) * Math.PI;
  const X = radius * Math.cos(radian);
  const Y = radius * Math.sin(radian);

  $runningTime.style.transform = `translate(${X}px, ${Y}px)  rotateZ(${angle}deg)`;
  $box.appendChild($runningTime);
};
```

전역 변수에서 선언된 `minute` 을 참조하여 `.running-time` 태그를 생성하는 함수를 구현했다.

이후 해당 코드를 이전에 구현해뒀던 `timerBoard` 함수 내에 넣어 `setInterval` 할 때 같이 실행되도록 해줬다.

```js
const timerBoard = () => {
  if (cond) {
    if (second >= 59) {
      minute += 1;
      second = 0;
    } else {
      second += 1;
    }
    makeRunningTime();
    ...
```

## 기능상 문제점 해결하기

### `runningTime` 이 `Button` 을 가리는 현상 해결하기

![](https://velog.velcdn.com/images/yonghyeun/post/a3999239-ed1c-4b2f-9c51-edcd21d969a2/image.png)

```css
.play-button {
  position: absolute;
  width: 20%;
  height: 20%;
  border-radius: 100%;
  border: 0px;
  font-size: 40px;
  color: red;
  background-color: white;
  transition: box-shadow 0.5s;
  z-index: 1;
}
```

`button` 의 `z-index` 를 가장 낮게 설정해주어 가장 위에 뜰 수 있도록 변경해주었다.

---

# 버튼을 누르면 타이머 함수가 작동 되도록 만들기

## 기능 구현

![](https://velog.velcdn.com/images/yonghyeun/post/ef8c86d1-9abe-46ac-85f9-177cb73b0f44/image.gif)

#### `script`

```js
// 버튼을 누르면 타이머를 작동 시키도록 만들기

$playButton.addEventListener('click', () => {
  cond = cond ? false : true;
  playButton.textContent = cond ? '⏸️' : '❤️‍🔥';
  setInterval(timerBoard, 1000);
});
```

> 귀여운 이모지로 버튼의 텍스트 모양을 변경했다.

버튼이 눌리면 `cond` 의 값과 `textContent` 값이 변경되고 `setInterval` 이 실행되도록 하였다.

그런데 이렇게 하니 문제가 있다.

버튼을 눌렀을 때 일시 정지는 되지만 여전히 이전에 눌린 `setInterval` 은 실행되고 있고

한 번 더 누르는 순간 이전에 눌렸던 `setInterval` 도 작동하고 , 새로운 `setInterval` 이 또 추가되어 각 `setInterval` 끼리 중첩되어 무지하게 빠르게 타이머가 올라간다.

ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ

## 기능상 문제점 해결하기

타이머가 존재 할 때, 버튼이 한 번 더 눌리면 해당 타이머를 삭제하고 새로운 타이머를 생성해야 한다.

스로틀링과는 다르지만, 스로틀링과 유사한 패턴으로 실행된다.

문제점을 해결하면서 간단하게 코드도 정리해봤다.

![](https://velog.velcdn.com/images/yonghyeun/post/4ef1c0e2-0dc8-452b-9fce-f8d25b5f821f/image.gif)

```js
// timer 스로틀링 이용하여 생성하기

const settingInterval = () => {
  let timer;

  return () => {
    if (timer) {
      clearInterval(timer);
    }

    timer = setInterval(timerBoard, 0.5);
  };
};

// 버튼을 누르면 컨디션과 textContent가 변경되게 만들기

const settingButton = () => {
  cond = cond ? false : true;
  $playButton.textContent = cond ? '⏸️' : '❤️‍🔥';
};

// 버튼을 누르면 타이머를 작동 시키도록 만들기

$playButton.addEventListener('click', settingButton);
$playButton.addEventListener('click', settingInterval());
```

버튼이 눌릴 때 마다 `setInterval` 에 해당하는 `timer` 를 제거하고 새로 만들기 때문에 `timer` 들이 중첩되지 않고 한 번에 하나만 생성된다.

구우우웃 ~~

---

# 초기화 버튼 생성하기

일시정지 버튼을 눌렀으면 초기화 버튼도 있어야 할 것 같아서 만들어줬다.

![](https://velog.velcdn.com/images/yonghyeun/post/5936df39-392e-48be-960f-bfc7a9afb205/image.gif)

## 기능 구현 하기

#### `html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="box"></div>
    <button id="initialize-button">🚨</button>
    <div id="board">
      <span id="minute-text">00</span> :
      <span id="second-text">00</span>
    </div>
  </body>
  <script src="script.js"></script>
</html>
```

초기화 하는건 비상상황이니까 귀여운 🚨 이모지를 담아줬다.

#### `css`

```css
/* 초기화 버튼 관련 속성 */

#initialize-button {
  margin: 10px auto;
  font-size: 50px;
  background-color: white;
  border: 0px;
  border-radius: 100%;
}
```

대충 버튼 모양 잡아주고 ~~

```css
body {
  display: flex;
  flex-direction: column;
  transition: background-color 0.5s;
}
```

초기화 버튼 누르면 `body` 태그의 배경화면이 잠깐 반짝 거리게 만들것이기 때문에

애니메이션 효과를 위해 `transition` 을 설정해준다.

#### `script`

```js
// 초기화 버튼 이벤트 만들어주기

const $initializeButton = document.querySelector('#initialize-button');

// 설정 모두 초기화 하기
const timerInitializing = () => {
  minute = 0;
  second = 0;
  cond = 0;
  $minuteText.textContent = '00';
  $secondText.textContent = '00';
  $playButton.textContent = '❤️‍🔥';

  [...document.querySelectorAll('.running-time')].forEach((runningTime) => {
    $box.removeChild(runningTime);
  });
};

// 초기화 한거는 비상상황이니 배경화면 색 잠깐 빨갛게 만들었다가 돌려놓기

const emergecyTwinkling = () => {
  const $body = document.querySelector('body');
  setTimeout(() => {
    $body.style.background = 'white';
  }, 1000);
  $body.style.background = 'red';
};

$initializeButton.addEventListener('click', timerInitializing);
$initializeButton.addEventListener('click', emergecyTwinkling);
```

---

# 타이머 미션 달성 시 뽀모 횟수 카운트 하기

## 기능 구현

#### `html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="box"></div>
    <button id="initialize-button">🚨</button>
    <div id="board">
      <span id="minute-text">00</span> :
      <span id="second-text">00</span>
    </div>
    <div id="count-box"><span id="bbomo-count">0</span> 뽀모</div>
  </body>
  <script src="script.js"></script>
</html>
```

뽀모 횟수를 적을 수 있는 `#count-box` 태그와 그 안에 `span` 태그들을 생성해주고

#### `css`

```css
/* 뽀모 횟수 카운트 하기 */

#count-box {
  margin: 10px auto;
  font-size: 50px;
}

#bbomo-count {
  display: inline-block;
  width: 50px;
  height: 50px;
  text-align: center;
}
```

뽀모 횟수를 적은 `bbomo-count` 영역또한 `inline-block` 으로 해줘 글자가 변경되어도 글자가 흔들리지 않게 해주었다.

#### `script`

```js
// 뽀모 횟수 카운트하기

let bbomoNum = 0;
const $bbomoCount = document.querySelector('#bbomo-count');
const bbomoUpdate = () => {
  bbomoNum += 1;
  $bbomoCount.textContent = bbomoNum;
};

// 타이머 전광판 구현하기

const timerBoard = () => {
  if (cond) {
    if (second >= 59) {
      minute += 1;
      second = 0;
      makeRunningTime();
    } else {
      second += 1;
    }

    if (minute === 60) {
      cond = false;
      $playButton.textContent = '❤️‍🔥';
      bbomoUpdate();
    }
    ...
```

뽀모 횟수를 업데이트 하는 `bbomoUpdate` 함수를 만든 후 타이머 전광판에 맞춰 내부에 함수를 실행시켜줬다.

`minute` 이 0이 되는 순간 뽀모 횟수를 1올리고 텍스트에 작성되는 `bbomoCount` 내부의 글씨를 변경시켜주엇다.

---

# 잔잔바리 기능 업데이트

![](https://velog.velcdn.com/images/yonghyeun/post/d362bb52-f575-4bbc-8fdf-50e457b0d9af/image.gif)

## 타이머가 60분 사이클을 모두 돌고나면 설정 초기화 하기

```js
// 타이머 전광판 구현하기

const timerBoard = () => {
  if (cond) {
    if (second >= 59) {
      minute += 1;
      second = 0;
      makeRunningTime();
    } else {
      second += 1;
    }

    if (minute === 60) {
      cond = false;
      $playButton.textContent = '❤️‍🔥';
      bbomoUpdate();
      timerInitializing();
    }

    $minuteText.textContent = minute < 10 ? `0${minute}` : minute;
    $secondText.textContent = second < 10 ? `0${second}` : second;
  }
};
```

60분에 도달하면 타이머가 초기화 될 수 있도록 `timerInitializing` 함수를 `timerBoard` 함수 위로 올려주고

60분에 도달하면 초기화 할 수 있도록 해주었다.

## 타이머가 60분에 사이클을 모두 돌고나면 배경화면 애니메이션 주기

```js
// 모든 사이클을 돌았을 때 배경화면이 반짝이는 애니메이션 추가하기
const successTwinkling = () => {
  const $body = document.querySelector('body');
  setTimeout(() => {
    $body.style.background = 'white';
  }, 1000);
  $body.style.background = 'yellow';
};

// 타이머 전광판 구현하기

const timerBoard = () => {
  if (cond) {
    if (second >= 59) {
      minute += 1;
      second = 0;
      makeRunningTime();
    } else {
      second += 1;
    }

    if (minute === 60) {
      bbomoUpdate();
      timerInitializing();
      successTwinkling();
    }

    $minuteText.textContent = minute < 10 ? `0${minute}` : minute;
    $secondText.textContent = second < 10 ? `0${second}` : second;
  }
};
```

초기화 할 때 `body` 태그의 배경화면이 빨간색으로 번쩍였던 것 처럼 이번엔 60분에 모두 도달하면 노란색으로 번쩎일 수 있도록 변경해주었다.

---

# 전체 코드 리팩토링 하기

## 중복되는 코드 함수로 모듈화 하기

### 1. 시간에 따라 좌표값을 계산하는 코드

```js
// 중복되는 로직
// 분에 따른 좌표값을 계산하는 코드
...
const angle = (minute - 16) * 6;
  const radian = (angle / 180) * Math.PI;
  const X = radius * Math.cos(radian);
  const Y = radius * Math.sin(radian);
...
```

코드 중 `minute` 이 주어졌을 때 해당 `minute` 의 각도를 이용해 좌표를 계산하는 로직이 중복되어서 쓰인다.

`appendMinuteText` 함수에서도 사용되고 `makeRunningTime` 에서도 사용된다.

해당 코드를 함수로 만들어 중복되는 코드 사용을 모듈화 하여 관리해보자

```js
const minuteCalculator = (minute, radius) => {
  const result = {};

  result.angle = (minute - 15) * 6; // 12시 방향부터 0이 시작되도록 변경
  result.radian = (result.angle / 180) * Math.PI;
  result.X = radius * Math.cos(result.radian);
  result.Y = radius * Math.sin(result.radian);

  return result;
};
```

다음처럼 시간과 반지름이 주어지면 해당 시간의 각도와 종점의 좌표를 담은 객체 `result` 를 반환하는 함수를 만들어주었다.

### 2. `body` 의 배경색을 변경해주는 코드

```js
// 초기화 한거는 비상상황이니 배경화면 색 잠깐 빨갛게 만들었다가 돌려놓기

const emergecyTwinkling = () => {
  const $body = document.querySelector('body');
  setTimeout(() => {
    $body.style.background = 'white';
  }, 1000);
  $body.style.background = 'red';
};

// 모든 사이클을 돌았을 때 배경화면이 반짝이는 애니메이션 추가하기
const successTwinkling = () => {
  const $body = document.querySelector('body');
  setTimeout(() => {
    $body.style.background = 'white';
  }, 1000);
  $body.style.background = 'yellow';
};
```

두 함수는 같은 로직으로 작동하며 변경되는 배경 색만 다를 뿐이다.

이 또한 하나의 공통된 함수로 만들어주도록 하자

```js
const changeBodyBackgroud = (color) => {
  const $body = document.querySelector('body');
  setTimeout(() => {
    $body.style.background = baseBackground;
  }, 1000);
  $body.style.background = color;
};
```

다음과 같은 하나의 콜백함수만 생성한 후 사용해주었다.

## 2. 빌더 패턴을 이용하기

전체적인 코드에서 새로운 태그를 생성하고, 태그의 클래스 명을 설정하고, 스타일 (특히 `transform`) 을 설정하는 행위가 반복된다.

이런 경우 디자인 패턴 중 `빌더 패턴` 을 이용하여 행위들을 모듈화 시켜주자

```js
class Bulider {
  constructor(tag) {
    this.tag = document.createElement(tag);
  }

  addClass(className) {
    this.tag.classList.add(className);
    return this;
  }

  setID(idName) {
    this.tag.id = idName;
    return this;
  }

  setTransform(transform) {
    this.tag.style.transform = transform;
    return this;
  }

  setTextContent(text) {
    this.tag.textContent = text;
    return this;
  }
}
```

다음과 같이 태그명을 이용해 태그를 생성하고 자기 자신을 리턴하는 메소드들을 이용해

메소드 체이닝을 이용하여 빌더 패턴을 사용하도록 리팩토링 하였다.

### 리팩토링 평가

```js
// 리팩토링 이전

const appendMinuteText = (minute, radius = 250) => {
  const angle = (minute - 15) * 6; // 12시 방향부터 0이 시작되도록 변경
  const radian = (angle / 180) * Math.PI;
  const X = radius * Math.cos(radian);
  const Y = radius * Math.sin(radian);
  const $minuteText = document.createElement('p');

  $minuteText.classList.add('minuteText');
  $minuteText.textContent = minute;
  $minuteText.style.transform = `translate(${X}px,${Y}px)`;
  $box.appendChild($minuteText);
};

const minuteFiveInterval = [...Array(12)].map((_, index) => index * 5);
minuteFiveInterval.forEach((minute) => appendMinuteText(minute));
```

```js
// 리팩토링 이후
const appendMinuteText = (minute) => {
  const CalculatedCoord = minuteCalculator(minute, 250);

  const $minuteText = new Bulider('p')
    .addClass('minuteText')
    .setTextContent(minute)
    .setTransform(`translate(${CalculatedCoord.X}px,${CalculatedCoord.Y}px)`);

  $box.appendChild($minuteText.tag);
};
```

중복되는 메소드들을 구현해둔 함수로 하고 빌더 패턴을 이용하니 좀 더 코드가 수월하게 읽히는 것 같다.

빌더패턴 .. 만족스러워 ..

디자인 패턴을 더 공부해봐야겠다.

## 3. 전역 변수들을 하나의 객체로 모아 관리하자

```js
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
```

전역 변수에서 선언되어 있던 `minute , second ... bbomoNum` 을 모두 `timerData` 라는 객체에 저장하고

해당 객체의 프로퍼티로 접근 할 수 있게 해주었으며

흩어져있던 변수 선언문들을 코드 상단에 위치시켜 문맥 중단에서 산발적으로 선언되지 않게 하여 흐름이 끊기지 않도록 해주었다.

## 4. 악취나는 코드 변경하기

```js
const timerBoard = () => {
  if (timerData.cond) {
    if (timerData.second >= 59) {
      timerData.minute += 1;
      timerData.second = 0;
      makeRunningTime();
    } else {
      timerData.second += 1;
    }

    if (timerData.minute === 60) {
      bbomoUpdate();
      timerInitializing();
      changeBodyBackgroud('yellow');
    }

    $minuteText.textContent =
      timerData.minute < 10 ? `0${timerData.minute}` : timerData.minute;
    $secondText.textContent =
      timerData.second < 10 ? `0${timerData.second}` : timerData.second;
  }
};
```

이전에 구현해뒀던 해당 코드는 `if` 문이 중첩되기도 하고 `else` 문이 쓰이면서 악취가 난다.

> 리팩토링 서적에서 쓰레기 같은 코드를 악취가 나는 코드라고 하더라. 딱 내 코드가 그런듯 ..

그래서 해당 함수를 분리 하고 최대한 `if` 문을 중첩하지 않도록 리팩토링 해보자

```js
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
```

분리 할 수 있는 함수들은 최대한 분리하였는데 여전히 `timerData` 의 `분 , 초` 를 삼항 연산자를 이용해 설정하는게 악취가 나는 것 같이 느껴진다.

좀 더 고민해봐야겠다.

# 스타일 좀만 더 여기저기 만져서 완성해보자

![](https://velog.velcdn.com/images/yonghyeun/post/9fafb73e-84ea-49ba-b8d0-6d426ea22f96/image.gif)

야호 ~~

# 회고

아직 리팩토링을 제대로 알지 못함에도 불구하고

구현한 코드를 깔끔하게 만드는 것이 매우 재밌다.

빌더 패턴을 처음으로 사용해봤는데 , 디자인 패턴을 왜 알아야 하고 사용해야 하는지 이번에 체감 할 수 있었다.

룰루랄라

다만 여전히 자바스크립트를 제대로 알지 못한다고 생각이 드는게 배열 함수를 이용하는 것이나, 문자열을 슬라이싱 하는 것이 익숙치 않았다.

모던 자바스크립트 서적을 복습 할 때에는 더 열심히 읽어봐야겠다.

이제는 `API` 공부를 열심히 해야지 ..
