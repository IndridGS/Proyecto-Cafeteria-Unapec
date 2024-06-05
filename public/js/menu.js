document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll("nav ul.menu-principal li");

    menuItems.forEach(function(menuItem) {
        menuItem.addEventListener("click", function(event) {
            if (this.querySelector("ul.submenu")) {
                event.preventDefault();
                const submenu = this.querySelector("ul.submenu");
                if (submenu.style.display === "block") {
                    submenu.style.display = "none";
                } else {
                    submenu.style.display = "block";
                }
            } else {
                // Allow the link to navigate to its href
                window.location = this.querySelector("a").href;
            }
        });
    });
});


