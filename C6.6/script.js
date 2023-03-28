const chatContent = document.querySelector('.chat-content');
const chatInput = document.querySelector('.chat-input');
const sendButton = document.querySelector('.btn-send');
const geoButton = document.querySelector('.btn-geo');
let socket;

// Создаем соединение
function connect() {
  socket = new WebSocket('wss://echo-ws-service.herokuapp.com');

  // Событие открытия соединения
  socket.addEventListener('open', (event) => {
    console.log('Connected to server');
  });

  // Событие получения сообщения от сервера
  socket.addEventListener('message', (event) => {
    // Выводим сообщение в чат
    const message = event.data;
    addMessageToChat(message);
  });

  // Событие закрытия соединения
  socket.addEventListener('close', (event) => {
    console.log('Disconnected from server');
  });

  // Событие ошибки соединения
  socket.addEventListener('error', (event) => {
    console.error('Connection error:', event);
  });
}

// Отправляем сообщение на сервер
function sendMessage(message) {
  socket.send(message);
}

// Добавляем сообщение в чат
function addMessageToChat(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.textContent = message;
  chatContent.appendChild(messageElement);
}

// Отправляем геолокацию на сервер
function sendLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const mapUrl = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      sendMessage(mapUrl);
    }, (error) => {
      console.error('Geolocation error:', error);
    });
  }
}

// При нажатии на кнопку "Отправить" отправляем текст сообщения на сервер
sendButton.addEventListener('click', () => {
  const message = chatInput.value;
  sendMessage(message);
  chatInput.value = '';
});

// При нажатии на кнопку "Геолокация" отправляем геолокацию на сервер
geoButton.addEventListener('click', () => {
  sendLocation();
});

// При загрузке страницы устанавливаем обработчик клика на кнопку отправки сообщения
window.addEventListener('load', function() {
var sendBtn = document.querySelector('.btn-send');
sendBtn.addEventListener('click', sendMessage);
});

// Функция отправки сообщения
function sendMessage() {
var input = document.querySelector('.chat-input');
var message = input.value;
addMessageToChat(message); // Добавляем сообщение в окно чата
input.value = ''; // Очищаем поле ввода
}

// Функция добавления сообщения в окно чата
function addMessageToChat(message, isGeoMessage) {
  var chatContent = document.querySelector('.chat-content');
  var messageEl = document.createElement('div');
  messageEl.classList.add('message');

  if (isGeoMessage) {
    messageEl.innerHTML = message;
  } else {
    messageEl.textContent = message;
  }

  chatContent.appendChild(messageEl);
}


// При загрузке страницы устанавливаем обработчик клика на кнопку отправки геолокации
window.addEventListener('load', function() {
var geoBtn = document.querySelector('.btn-geo');
geoBtn.addEventListener('click', sendGeoLocation);
});

// Функция отправки геолокации
function sendGeoLocation() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var link = 'https://www.openstreetmap.org/#map=18/' + lat + '/' + lon;
    addMessageToChat('Моя геолокация: <a href="' + link + '" class="geo-link" target="_blank">' + link + '</a>', true); // Добавляем сообщение в окно чата с указанием, что это геосообщение
  });
}

