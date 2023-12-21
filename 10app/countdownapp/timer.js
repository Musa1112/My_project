const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secondsEl = document.getElementById('seconds')


const newYear = '1 Jan 2024';

function countDown(){
    const newYearDate = new Date (newYear);

    const currentDate = new Date();

    const totalSeconds = (newYearDate - currentDate) / 1000;

    const days = Math.floor(totalSeconds /3600 / 24);
    const hours = Math.floor(totalSeconds/ 3600) % 24;
    const mins = Math.floor(totalSeconds/ 60) % 60; 
    const seconds = Math.floor(totalSeconds)% 60;


    daysEl.innerHTML= formatTime(days);
    hoursEl.innerHTML= formatTime(hours);
    minsEl.innerHTML= formatTime(mins);
    secondsEl.innerHTML= formatTime(seconds);


function formatTime(time){
    return time < 10? '0${time}' : time;
}
    console.log(days, hours, mins, seconds);

    
;}

countDown();
setInterval(countDown, 1000);