window.addEventListener('DOMContentLoaded', event => {

    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    const sidebarWrapperLeft = document.getElementById('sidebar-wrapper-left');
    let scrollToTopVisible = false;

    sidebarWrapper.classList.add('active');
    sidebarWrapperLeft.classList.add('active');
    
    // Closes the sidebar menu
    const menuToggle = document.body.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        _toggleMenuIcon();
        menuToggle.classList.toggle('active');
    });

    // Closes the sidebar menu on the left
    const menuToggleLeft = document.body.querySelector('.menu-toggle-left');
    menuToggleLeft.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapperLeft.classList.toggle('active');
        _toggleMenuIconLeft();
        menuToggleLeft.classList.toggle('active');
    });

    // Closes responsive menu when a scroll trigger link is clicked
    var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
    scrollTriggerList.map(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            _toggleMenuIcon();
        })
    });

    // Scroll to top button appear
    document.addEventListener('scroll', () => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-xmark');

        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-xmark');
        }
        if (menuToggleTimes) {
            menuToggleTimes.classList.remove('fa-xmark');
            menuToggleTimes.classList.add('fa-bars');
        }
    }


    function _toggleMenuIconLeft() {
        const menuToggleLeftBars = document.body.querySelector('.menu-toggle-left > .fa-bars');
        const menuToggleLeftTimes = document.body.querySelector('.menu-toggle-left > .fa-xmark');
        const menuToggleLeft = document.body.querySelector('.menu-toggle-left');

        if (menuToggleLeftBars) {
            menuToggleLeftBars.classList.remove('fa-bars');
            menuToggleLeftBars.classList.add('fa-xmark');
            menuToggleLeft.classList.remove('moved15');
            menuToggleLeft.classList.add('moved180');
        }
        if (menuToggleLeftTimes) {
            menuToggleLeftTimes.classList.remove('fa-xmark');
            menuToggleLeftTimes.classList.add('fa-bars');
             menuToggleLeft.classList.remove('moved180');
            menuToggleLeft.classList.add('moved15');
        }
    }


    // Scroll to top button appear
    document.addEventListener('scroll', () => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    })
})

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};




$.getJSON('./data_dttm_atena_point_light.geojson', function(data) {
    // Récupérer les NUM_CONCESSION du GeoJSON
    var numConcessions = data.features.map(function(feature) {
        return feature.properties.NUM_CONCESSION;
    });

    // Activer l'autocomplétion avec jQuery UI Autocomplete
    $('#parcelleSearch').autocomplete({
        source: numConcessions,
        minLength: 1, // Nombre de caractères pour déclencher l'autocomplétion
        select: function(event, ui) {
            // Gérer la sélection de l'élément
            console.log("Sélectionné : " + ui.item.value);
        }
    });
});


