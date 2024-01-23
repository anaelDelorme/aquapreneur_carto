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



fetch('./data_dttm_atena_point_light.geojson')
    .then(response => response.json())
    .then(data => {
        // Extraire les informations nécessaires (NUM_CONCESSION dans cet exemple)
        const parcelles = data.features.map(feature => feature.properties.NUM_CONCESSION);

        function zoomToParcelle(NUM_CONCESSION) {
            // Trouver la feature correspondant à la parcelle sélectionnée
            const selectedFeature = data.features.find(feature => feature.properties.NUM_CONCESSION === NUM_CONCESSION);
        
            if (selectedFeature) {
                // Récupérer les coordonnées de la feature
                const coordinates = selectedFeature.geometry.coordinates;
        
                // Effectuer le zoom vers les coordonnées
                map.flyTo({
                    center: coordinates,
                    zoom: 15, // Ajustez le niveau de zoom selon vos besoins
                    essential: true // Empêche l'animation brusque lors du zoom
                });
        
                // Afficher la popup
                const popup = new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(setPopupHTML(selectedFeature))
                    .addTo(map);
            }
        }
        
        // Utiliser les parcelles comme source de données pour l'auto-complétion
        const autoCompleteJS = new autoComplete({
            selector: "#autoComplete",
            placeHolder: "Saisir le numéro d'une parcelle...",
            data: {
                src: parcelles,
                cache: true,
            },
            resultsList: {
                element: (list, data) => {
                    if (!data.results.length) {
                        const message = document.createElement("div");
                        message.setAttribute("class", "no_result");
                        message.innerHTML = `<span>Aucun résultat pour "${data.query}"</span>`;
                        list.prepend(message);
                    }
                },
                noResults: true,
            },
            resultItem: {
                highlight: true,
                onClick: (event, data) => {
                    const selection = data.selection.value;
                    autoCompleteJS.input.value = selection;
                    zoomToParcelle(selection);
                }
            },
            events: {
                input: {
                    selection: (event) => {
                        const selection = event.detail.selection.value;
                        autoCompleteJS.input.value = selection;
                    }
                }
            }
        });
    })
    .catch(error => console.error('Erreur lors du chargement du fichier GeoJSON:', error));

