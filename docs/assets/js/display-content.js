document.getElementById("show_key").innerHTML = "<a href='https://www.google.com/search?q=bass+clef+scale+" + todays_key + "&oq=" + todays_key + "' title='Practice every day! Good job!' class='scale' target='_blank'>" + todays_key + "</a>";
document.getElementById("show_excerpt").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + todays_excerpt + "&oq=" + todays_excerpt + "' title='That&apos;s the spirit!' class='excerpt' target='_blank'>" + todays_excerpt + "</a>";
document.getElementById("show_excerpt2").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + todays_excerpt2 + "&oq=" + todays_excerpt2 + "' title='That&apos;s the spirit!' class='excerpt' target='_blank'>" + todays_excerpt2 + "</a>";
document.getElementById("show_excerpt3").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + todays_excerpt3 + "&oq=" + todays_excerpt3 + "' title='That&apos;s the spirit!' class='excerpt' target='_blank'>" + todays_excerpt3 + "</a>";
document.getElementById("show_excerpt4").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + todays_excerpt4 + "&oq=" + todays_excerpt4 + "' title='That&apos;s the spirit!' class='excerpt' target='_blank'>" + todays_excerpt4 + "</a>";
document.getElementById("show_excerpt5").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + todays_excerpt5 + "&oq=" + todays_excerpt5 + "' title='That&apos;s the spirit!' class='excerpt' target='_blank'>" + todays_excerpt5 + "</a>";
document.getElementById("show_strauss").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + todays_strauss + "&oq=" + todays_strauss + "' title='Daily dosage' class='excerpt' target='_blank'>" + todays_strauss + "</a>";
document.getElementById("mandatory1").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + mandatory[0] + "&oq=" + mandatory[0] + "' title='Daily dosage' class='excerpt' target='_blank'>" + mandatory[0] + "</a>";
document.getElementById("mandatory2").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + mandatory[1] + "&oq=" + mandatory[1] + "' title='Daily dosage' class='excerpt' target='_blank'>" + mandatory[1] + "</a>";
document.getElementById("mandatory3").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + mandatory[2] + "&oq=" + mandatory[2] + "' title='Daily dosage' class='excerpt' target='_blank'>" + mandatory[2] + "</a>";
document.getElementById("mandatory4").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + mandatory[3] + "&oq=" + mandatory[3] + "' title='Daily dosage' class='excerpt' target='_blank'>" + mandatory[3] + "</a>";

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var mm = monthNames[today.getMonth()]
var yyyy = today.getFullYear();

today = 'Practice plan for ' + mm + ' ' + dd + ', ' + yyyy;
document.getElementById("date").innerHTML = today;
document.getElementById("pattern").innerHTML = todays_shiftpattern;
document.getElementById("pattern2").innerHTML = todays_shiftpattern2;

document.getElementById("show_pushups").innerHTML = todays_pushups;

// refresh button

const refreshButton = document.querySelector('.refresh-button');

const refreshPage = () => {
  window.location.reload();
}

refreshButton.addEventListener('click', refreshPage);




// document.getElementById("new_key_link").addEventListener("click", randomKey);
// document.getElementById("new_excerpt_link").addEventListener("click", randomExcerpt);

// function randomKey() {
//   document.getElementById("show_key").innerHTML = "<a href='https://www.google.com/search?q=bass+clef+scale+" + todays_key + "&oq=" + todays_key + "' title='Oh, that last one wasn't good enough for you? Here you go!' class='scale' target='_blank'>" + todays_key + " major &amp; minor</a>";
// }
// function randomExcerpt() {
//   document.getElementById("show_excerpt").innerHTML = "<a href='https://www.google.com/search?q=double+bass+excerpt+" + todays_excerpt + "&oq=" + todays_excerpt + "' title='That&apos;s the spirit!' class='excerpt' target='_blank'>" + todays_excerpt + "</a>";
// }
