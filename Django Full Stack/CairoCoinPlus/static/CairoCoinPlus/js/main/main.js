document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function (e) {
        var navbarCollapse = document.querySelector('.navbar-collapse');
        var navbarToggler = document.querySelector('.navbar-toggler');

        if (!navbarCollapse.contains(e.target) && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    });
});