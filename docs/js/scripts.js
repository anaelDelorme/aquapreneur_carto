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


const autoCompleteJS = new autoComplete({
    data: {
      src: async () => {
        try {
          // Loading placeholder text
          document
            .getElementById("autoComplete")
            .setAttribute("placeholder", "Loading...");
          // Fetch External Data Source (replace with your GeoJSON file path)
          const source = await fetch("./data_dttm_atena_point_light.geojson");
          console.log("Fetched Data:", source);
          const data = await source.json();
          console.log("Fetched Data:", data);
          // Post Loading placeholder text
          document
            .getElementById("autoComplete")
            .setAttribute("placeholder", autoCompleteJS.placeHolder);
          // Returns Fetched data
          const resultList = data.features.map(feature => ({
            match: feature.properties.NUM_CONCESSION,
            key: feature.properties.NUM_CONCESSION,
          }));
  
          console.log("Result List:", resultList);
          return resultList;
        } catch (error) {
          return error;
        }
      },
      cache: true,
      filter: (list) => {
        // Filter duplicates
        // in case of multiple data keys usage
        const filteredResults = Array.from(
          new Set(list.map((value) => value.match))
        ).map((NUM_CONCESSION,) => {
          return list.find((value) => value.match === NUM_CONCESSION,);
        });
  
        return filteredResults;
      }
    },
    placeHolder: "Saisir le numéro d'une parcelle...",
    resultsList: {
      element: (list, data) => {
        const info = document.createElement("p");
        if (data.results.length > 0) {
          info.innerHTML = `Affichage de <strong>${data.results.length}</strong> sur <strong>${data.matches.length}</strong> parcelles`;
        } else {
          info.innerHTML = `<strong>${data.matches.length}</strong> résultat correspondant pour <strong>"${data.query}"</strong>`;
        }
        list.prepend(info);
      },
      noResults: true,
      maxResults: 15,
      tabSelect: true
    },
    resultItem: {
      element: (item, data) => {
        // Modify Results Item Style
        item.style = "display: flex; justify-content: space-between;";
        // Modify Results Item Content
        item.innerHTML = `
        <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
          ${data.match}
        </span>
        <span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.2);">
          ${data.key}
        </span>`;
      },
      highlight: true
    },
    events: {
      input: {
        focus: () => {
          if (autoCompleteJS.input.value.length) autoCompleteJS.start();
        }
      }
    }
  });