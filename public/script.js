function toggleDropdown() {
    var dropdown = document.getElementById('dropdown');
    dropdown.classList.toggle('show');
}

function toggleNav(){
    const navcontainer = document.getElementsByClassName('navcontainer')[0];
    const hamBurger = document.getElementsByClassName('hamBurger')[0];
    if (hamBurger.innerHTML ==='\n              <a onclick="toggleNav()">☰</a>\n            ') {
        hamBurger.innerHTML = '\n              <a onclick="toggleNav()">✕</a>\n            '; // Change to cross
    } else {
        hamBurger.innerHTML = '\n              <a onclick="toggleNav()">☰</a>\n            '; // Change back to hamburger
    }
    if(navcontainer.classList.contains('responsive'))
        navcontainer.classList.remove('responsive');
    else
        navcontainer.classList.add('responsive');    
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
if (!event.target.matches('.circle')) {
    var dropdowns = document.getElementsByClassName('dropdown');
    for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }
}
}