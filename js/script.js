window.onload = function () {
  setTimeout(function () {
    window.scrollTo(0, 0);
  }, 100);
};

const audio = document.getElementById('audio');
const progressBar = document.getElementById('progressBar');
const progressBarFill = document.getElementById('progressBarFill');
const transcript = document.getElementById('transcript');
const transcript_children = document.getElementById('transcript').children;
let currentSentenceIndex = 0;

progressBar.addEventListener('click', function (event) {
  const clickOffsetX = event.offsetX;
  const clickPercentage = (clickOffsetX / progressBar.offsetWidth);
  const newTime = clickPercentage * audio.duration;
  audio.currentTime = newTime;
});

audio.addEventListener('timeupdate', function () {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBarFill.style.width = progress + '%';
  highlightCurrentText(audio.currentTime);
});

function highlightCurrentText(currentTime) {
  const paragraphs = transcript.querySelectorAll('p');
  let num = 0;
  if (currentTime < parseFloat(paragraphs[0].getAttribute('data-start')))
    paragraphs[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (currentTime > parseFloat(paragraphs[paragraphs.length - 1].getAttribute('data-start'))) {
    currentSentenceIndex = paragraphs.length + 1;
    paragraphs[paragraphs.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  for (let i = 0; i < paragraphs.length; i++) {
    let startTime = parseFloat(paragraphs[i].getAttribute('data-start'));
    let endTime = parseFloat(paragraphs[i].getAttribute('data-end'));
    let textContent = transcript_children[i].textContent.trim();
    if (textContent !== "") {
      console.log("Paragraph has text: " + textContent);
      if (startTime <= currentTime && endTime >= currentTime) {
        num++;
        console.log("Highlighting paragraph: " + textContent);
        transcript_children[i].innerHTML = '<span style="color: #7889f9">' + textContent + '</span>';
        if (num == 1)
          paragraphs[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        currentSentenceIndex = i;
      } else {
        transcript_children[i].innerHTML = '<span style="color: black">' + textContent + '</span>';
      }
    } else {
      console.log("Paragraph is empty");
      transcript_children[i].style.backgroundColor = 'transparent';
    }
  }
}

function playAudio() {
  audio.play();
}

function playPause() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function prevSentence() {
  if (currentSentenceIndex - 1 > 0) {
    currentSentenceIndex--;
    currentSentenceIndex--;
    audio.currentTime = parseFloat(transcript_children[currentSentenceIndex].getAttribute('data-start'));
  }
}

function nextSentence() {
  if (audio.currentTime < parseFloat(transcript_children[0].getAttribute('data-start'))) {
    currentSentenceIndex = -2;
  }
  if (currentSentenceIndex + 1 < transcript_children.length) {
    currentSentenceIndex++;
    currentSentenceIndex++;
    audio.currentTime = parseFloat(transcript_children[currentSentenceIndex].getAttribute('data-start'));
  }
}

document.addEventListener('keydown', function (event) {
  if (event.code === 'Space') {
    event.preventDefault();
    playPause();
  }
  // 按下左箭头键
  else if (event.keyCode === 37) {
    prevSentence()
  }
  // 按下右箭头键
  else if (event.keyCode === 39) {
    nextSentence()
  }
  // 按下向上箭头键
  else if (event.keyCode === 38) {
    jumpToFirstSentence();
  }
  // 按下向下箭头键
  else if (event.keyCode === 40) {
    jumpToLastSentence();
  }
});

// 跳转到第一句
function jumpToFirstSentence() {
  const firstParagraph = transcript.querySelector('p');
  const startTime = parseFloat(firstParagraph.getAttribute('data-start'));
  //firstParagraph[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  audio.currentTime = startTime;
  /*setTimeout(function () {
    highlightCurrentText(audio.currentTime);
    //firstParagraph.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 800);*/
}

// 跳转到最后一句
function jumpToLastSentence() {
  const paragraphs = transcript.querySelectorAll('p');
  const lastParagraph = paragraphs[paragraphs.length - 1];
  const startTime = parseFloat(lastParagraph.getAttribute('data-start'));
  audio.currentTime = startTime;
  /*setTimeout(function () {
    highlightCurrentText(audio.currentTime);
    //paragraphs[paragraphs.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 800);*/
}

progressBar.addEventListener('click', function (event) {
  const clickOffsetX = event.offsetX;
  const clickPercentage = (clickOffsetX / progressBar.offsetWidth);
  const newTime = clickPercentage * audio.duration;
  audio.currentTime = newTime;
});

// 获取所有音频文字元素
const paragraphs = transcript.querySelectorAll('p');

// 为每个音频文字元素添加点击事件监听器
paragraphs.forEach(paragraph => {
  paragraph.addEventListener('click', function () {
    seekTo(this); // 调用 seekTo 函数并传递当前点击的元素
  });
});

// 点击句子跳转到对应的音频位置
function seekTo(element) {
  const startTime = parseFloat(element.getAttribute('data-start'));
  audio.currentTime = startTime;
}
