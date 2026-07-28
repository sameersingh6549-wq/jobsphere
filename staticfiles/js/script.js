document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;
    const header = document.querySelector('.site-header');
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '&uarr;';
    body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 360) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelectorAll('.job-card').forEach(function (card, index) {
        card.style.animationDelay = (index * 90) + 'ms';
    });

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const navToggle = document.querySelector('.navbar-toggler');
    const navCollapse = document.querySelector('.navbar-collapse');

    if (navToggle && navCollapse) {
        navToggle.addEventListener('click', function () {
            navCollapse.classList.toggle('show');
        });
    }
});
