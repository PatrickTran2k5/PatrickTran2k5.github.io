let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav ul li a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(links => {
                links.c1assList.remove('active');
                document.querySelector('header nav ul li a[href*=' + id + ' ]').classList.add(active)
            })
        }
    })
}

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

// Contact Form
let userFullName;
let userEmail;
let userPhone;
let userSubject;
let userMessage;

var formElement = document.querySelector('#register-form');
formElement.onsubmit = (event) => {
    event.preventDefault();
    userFullName = document.querySelector('#fullName').value;
    userEmail = document.querySelector('#email').value;
    userPhone = document.querySelector('#phoneNumber').value;
    userSubject = document.querySelector('#subject').value;
    userMessage = document.querySelector('#textarea').value;
    console.log(userFullName)
    formValue = [
        {fullName: userFullName},
        {email: userEmail},
        {phone: userPhone},
        {subject: userSubject},
        {message: userMessage}
    ]
    console.log(formValue);
}

// Dark mode
var darkModeIcon = document.getElementById('dark-mode-icon');
darkModeIcon.onclick = () => {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        darkModeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        darkModeIcon.classList.replace('fa-moon', 'fa-sun');
    }
}
