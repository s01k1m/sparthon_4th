/** 게임 변수 */
let timer = 0; // 장애물 생성 시간
let obstacleArray = []; // 장애물 배열(*장애물이 여러개일 수 있기 때문에 배열로 관리함)
let gameOver = false; // 게임 종료 여부
let jump = false; // 점프 여부

/** 르탄이 */
const RTAN_WIDTH = 100; // 르탄이 가로 너비
const RTAN_HEIGHT = 100; // 르탄이 세로 높이
const RTAN_INITIAL_X_POSITION = 10; // 르탄이의 위치 X 좌표
const RTAN_INITIAL_Y_POSITION = 400; // 르탄이의 위치 Y 좌표

/** 장애물 */
const OBSTACLE_WIDTH = 30; // 장애물 너비
const OBSTACLE_HEIGHT = 30; // 장애물 높이
const OBSTACLE_FREQUENCY = 50; // 장애물 생성 빈도
const OBSTACLE_SPEED = 7; // 장애물 속도

/** 오디오 객체 */
const jumpSound = new Audio();
jumpSound.src = "./assets/sounds/jump.mp3";
const bgmSound = new Audio();
bgmSound.src = "./assets/sounds/bgm.mp3";
const scoreSound = new Audio();
scoreSound.src = "./assets/sounds/score.mp3";
const defeatSound = new Audio();
defeatSound.src = "./assets/sounds/defeat2.mp3";

/** 이미지 */
// (1) 배경
const bgImage = new Image();
bgImage.src = "./assets/images/rtan_background.png";
// (2) 게임 시작
const startImage = new Image();
startImage.src = "./assets/images/rtan_start.png";
// (3) 게임 오버
const gameoverImage = new Image();
gameoverImage.src = "./assets/images/rtan_gameover.png";
// (4) 게임 재시작
const restartImage = new Image();
restartImage.src = "./assets/images/rtan_restart.png";
// (5) 달리는 르탄이 A
const rtanAImage = new Image();
rtanAImage.src = "./assets/images/rtan_running_a.png";
// (6) 달리는 르탄이 B
const rtanBImage = new Image();
rtanBImage.src = "./assets/images/rtan_running_b.png";
// (7) 게임 오버 르탄이
const rtanCrashImage = new Image();
rtanCrashImage.src = "./assets/images/rtan_crash.png";
// (8) 장애물
const rtan_obstacle = new Image();
rtan_obstacle.src = "./assets/images/rtan_obstacle.png";

/**
 * 게임 시작 화면을 그리는 함수
 */
function drawStartScreen() {
    // 배경 이미지 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  
    const imageWidth = 473;
    const imageHeight = 316;
    const imageX = canvas.width / 2 - imageWidth / 2;
    const imageY = canvas.height / 2 - imageHeight / 2;
  
    ctx.drawImage(startImage, imageX, imageY, imageWidth, imageHeight);
  }

  /**
 * 두 개의 이미지가 모두 로드되면 게임 시작 화면을 그린다.
 */
let bgImageLoaded = new Promise((resolve) => {
    bgImage.onload = resolve;
  });
  
  let startImageLoaded = new Promise((resolve) => {
    startImage.onload = resolve;
  });
  
  Promise.all([bgImageLoaded, startImageLoaded]).then(drawStartScreen);

  const rtan = {
    x: RTAN_INITIAL_X_POSITION,
    y: RTAN_INITIAL_Y_POSITION,
    width: RTAN_WIDTH,
    height: RTAN_HEIGHT,
    draw() {
      // when rtan crashes, draw crash image
      if (gameOver) {
        ctx.drawImage(rtanCrashImage, this.x, this.y, this.width, this.height);
        return;
      } else {
        if (timer % 20 > 10) {
          ctx.drawImage(rtanAImage, this.x, this.y, this.width, this.height);
        } else {
          ctx.drawImage(rtanBImage, this.x, this.y, this.width, this.height);
        }
      }
    },
  };

  class Obstacle {
    constructor() {
      this.x = canvas.width;
      this.y = Math.floor(Math.random() * (canvas.height - OBSTACLE_HEIGHT));
      this.width = OBSTACLE_WIDTH;
      this.height = OBSTACLE_HEIGHT;
    }
    draw() {
      ctx.drawImage(rtan_obstacle, this.x, this.y, this.width, this.height);
    }
  }

  /**
 * 마우스 이벤트
 */
canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    if (
      !gameStarted &&
      x >= 0 &&
      x <= canvas.width &&
      y >= 0 &&
      y <= canvas.height
    ) {
      gameStarted = true;
      animate();
    }
  });/**
  * 게임 애니메이션 함수
  */
 function animate() {
   if (gameOver) {
     return;
   }
 
   bgmSound.play();
 
   // 배경 이미지 그리기
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.drawImage(bgImage, bgX, 0, canvas.width, canvas.height);
   ctx.drawImage(bgImage, bgX + canvas.width, 0, canvas.width, canvas.height);
 
   bgX -= BG_MOVING_SPEED;
   if (bgX < -canvas.width) bgX = 0;
 
   rtan.draw();
   timer++;
   requestAnimationFrame(animate);
 }

 /**
 * 게임 애니메이션 함수
 */
function animate() {
    if (gameOver) {
      return;
    }
  
    bgmSound.play();
  
    // 배경 이미지 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, bgX, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, bgX + canvas.width, 0, canvas.width, canvas.height);
  
    bgX -= BG_MOVING_SPEED;
    if (bgX < -canvas.width) bgX = 0;
  
    if (timer % OBSTACLE_FREQUENCY === 0) {
      const obstacle = new Obstacle();
      obstacleArray.push(obstacle);
    }
  
    obstacleArray.forEach((a) => {
      // x가 0보다 작아지면 화면 밖으로 나가는 것이므로 삭제
      if (a.x < -OBSTACLE_WIDTH) {
        obstacleArray.shift();
        score += 10;
        scoreText.innerHTML = "현재점수: " + score;
        scoreSound.play();
        setTimeout(() => {
          scoreSound.pause(); // 일정 시간 후에 오디오 일시정지
          scoreSound.currentTime = 0; // 오디오 재생 위치를 시작으로 재설정
        }, 350); // 200ms 후에 오디오 일시정지
      }
      
          // Step4 충돌 기능 animate 코드 입력하는 곳
          
          
      a.x -= OBSTACLE_SPEED; // 한 프레임이 지날 때마다 장애물을 왼쪽으로 일정량 이동
  
      a.draw();
    });
    rtan.draw();
    timer++;
    requestAnimationFrame(animate);
  }