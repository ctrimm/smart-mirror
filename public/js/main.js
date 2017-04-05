$(document).ready(function() {

  // Place JavaScript code here...

  // REFRESH THE PAGE EVERY 30 MINUTES
  // setInterval(function() {
  //   window.location.reload();
  // }, 300000); 

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const second = document.querySelector('#second');
  const minute = document.querySelector('#minute');
  const hour = document.querySelector('#hour');
  const dayOfWeek = document.querySelector('#dayOfWeek');
  const month = document.querySelector('#month');
  const date = document.querySelector('#date');
  const year = document.querySelector('#year');

  function setDate(){
    let now = new Date();
    let seconds = now.getSeconds();
    let minutes = now.getMinutes();
    let hours = now.getHours();
    let dow = days[now.getDay()];
    let d = now.getDate();
    let m = months[now.getMonth()];
    let y = now.getFullYear();

    if(seconds === 0) {
        seconds = "00";
    } else if (seconds < 10) {
        seconds = "0" + seconds;
    }

    if(minutes === 0) {
        minutes = "00";
    } else if (minutes < 10) {
        minutes = "0" + minutes;
    }

    second.innerHTML = seconds;
    minute.innerHTML = minutes;
    hour.innerHTML = hours;
    dayOfWeek.innerHTML = dow;
    month.innerHTML = m;
    date.innerHTML = d;
    year.innerHTML = y;
  }

  setInterval(setDate, 1000);

  // Reload the page every 20 minutes.
  setTimeout(function() {
  console.log('timeout');
    location.reload();
  }, 200000);

});
