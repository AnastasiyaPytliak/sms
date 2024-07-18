let form = document.querySelector("form");
let btn = document.querySelector(".kod");
let choices = document.querySelector(".choices");
let notice = document.querySelector(".notice");
let textElement = document.querySelector(".vote-title p");
let voteseNumberElement = document.querySelector(".votes-number");
let phoneNumberElement = document.querySelector(".phone-number");

// -------------------> фетч запросить количество проголосвавших
let votes = '17 538'
voteseNumberElement.innerHTML = `проголосовали ${votes} человека`;


// Добавить класс активному инпуту
function handleClickToggleActive(e) {
  if (e.target.className === "check") {
    choices.querySelectorAll(".check").forEach(i => {
      i.classList.remove("active");
    });
    e.target.classList.toggle("active");
  }
}

// Генератор случайного числа в промежутке
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Отправить код на номер
btn.addEventListener("click", (e) => {
  e.preventDefault();
  let btnKod = document.querySelector(".kod");
  btnKod.setAttribute(
    "style",
    "pointer-events: none; color:grey;background:transparent"
  );

  // генерация кода для отправки
  let randomInt = getRandomInt(123456, 213046);
  localStorage.setItem("number", randomInt);

  // таймер
  function printNumbers(from, to) {
    let current = from;
    const timerElement = document.querySelector(".timer");

    setTimeout(function go() {
      timerElement.innerHTML = `Код отправлен. Повторно запросить код можно через ${current} сек`;
      if (current > to) {
        setTimeout(go, 1000);
      } else {
        timerElement.innerHTML = "";
        btnKod.setAttribute("style", " ");
      }
      current--;
    }, 1000);
  }
  printNumbers(60, 1);

  // -----> ФЕТЧ ДЛЧ ОТПРАВКИ КОДА АПИ <-----
  // const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  // const urlencoded = new URLSearchParams();
  // urlencoded.append("user", "info@cvr.by");
  // urlencoded.append("msisdn", `${tel}`);
  // urlencoded.append("apikey", "x24wUAs2Udp0y4hPE8bg");
  // urlencoded.append("text", `Ваш код: ${randomInt}`);

  // const requestOptions = {
  //   method: "POST",
  //   headers: myHeaders,
  //   body: urlencoded,
  //   redirect: "follow"
  // };

  // fetch("https://cabinet.websms.by/api/send/sms", requestOptions)
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.error(error));

  // ----->  ФЕТЧ ДЛЯ ОТПРАВКИ КОДА И НОМЕРА НА НАШ СЕРВЕР и ЗАПИСИ НОМЕРА + 3 ПОПЫТКИ <-----
  // в работе

});

// Отправка формы с результатами глоосования
function sendForm(e) {
  e.preventDefault();
  let result = [];
  let valueCh = document.querySelector(".check.active");

  if (document.querySelector("#num").value == localStorage.getItem("number") && valueCh ) {
    result.push({ choice: `${valueCh.value}` });
    result.push({ zapros: "good" });
    notice.innerHTML = ` `;
    // -------------------> дописать фетч отправить голос и полуичт результаты
    phoneNumberElement.setAttribute("style", "display:none");
    textElement.setAttribute("style", "display:none");
    textElement.parentElement.setAttribute("style", "padding-bottom: 16px;");
    choices.classList.add('results')

    document.querySelectorAll(".choices__desc").forEach(i => {
      let sp1 = document.createElement("div");
      let sp3 = document.createElement("div");
      sp1.className = "votes-count";
      sp3.className = "procents";
      // -------------------> дописать каждому голоса и проценты
      sp1.innerHTML = '<span></span> <div>1253</div>'
      sp3.innerHTML = '17%'
      sp1.querySelector('span').setAttribute('style',`width:${+sp1.querySelector('div').textContent / 100}px`)
      let sp2 = i.querySelector('.text')
      i.insertBefore(sp1, sp2);
      i.insertBefore(sp3, sp1);
  });

    document.querySelectorAll(".choices__desc img").forEach(i => i.style.display = "none");
    document.querySelectorAll(".fio").forEach(i => i.textContent += '. ' + i.nextElementSibling.textContent);
    choices.querySelectorAll(".check").forEach(i => i.style.display = "none");
    document.querySelectorAll(".text a").forEach(i => i.style.display = "none");

  } else if (
    document.querySelector("#num").value == localStorage.getItem("number") && !valueCh ) {
    notice.innerHTML = `Вы не выбрали за какого участника желаете проголосовать.`;
  } else {
    notice.innerHTML = `Неверный код. Попробуйте снова.`;
    result.push({ zapros: "bad" });
  }
  console.log(result);
}

choices.addEventListener("click", handleClickToggleActive);
form.addEventListener("submit", sendForm);

// Валидация
document.querySelector("#tel").addEventListener("input", function () {
  if (this.value) {
    // Применяем стили к непустому полю
    this.style.border = "2px solid #1d6347";
    this.nextSibling.classList.remove("cancel");
    this.nextSibling.classList.add("done");
  } else {
    // В противном случае стилизуем как пустое поле
    this.style.border = "2px solid #9d3510";
    this.nextSibling.classList.remove("done");
    this.nextSibling.classList.add("cancel");
  }
});

// Номер телефона
const numberPatterns = [
  "+375 NN NNN-NN-NN", // Беларусь
];
document.querySelectorAll("input[type=tel]").forEach(function (input) {
  const formatterObject = new Freedom.PhoneFormatter(numberPatterns);
  formatterObject.attachToInput(input);
});
