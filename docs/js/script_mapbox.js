// AccesToken
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hZWxkZWxvcm1lIiwiYSI6ImNscTI1eHI1bjAwcHQyam5zNXEzbG9sNDUifQ.OplU3wX4w6Thg2ZKomWZ9A';

// Configuration de la carte
var map = new mapboxgl.Map({container: 'map',
style: 'mapbox://styles/mapbox/satellite-v9', // fond de carte
center: [2.727990, 46.967532], // lat/long
zoom: 5
});

const searchJS = document.getElementById('search-js');
searchJS.onload = function () {
    const searchBox = new MapboxSearchBox();
    searchBox.accessToken = mapboxgl.accessToken;
    searchBox.options = {
        language: 'fr',
        country: 'FR',
        types: 'address,poi,region,place,locality',
        proximity: [2.727990, 46.967532]
    };
    searchBox.placeholder = 'Rechercher une commune ou une adresse';
    searchBox.marker = true;
    searchBox.mapboxgl = mapboxgl;
    map.addControl(searchBox);
};

function addAdditionalSourceAndLayer() {
    map.addSource('tileset_data',{
        "type":'vector',
        "url":'mapbox://anaeldelorme.7irw0cc8'
    });

    map.addLayer({
        "source": 'tileset_data',
        "id": 'concessions',
        "type": 'fill',
        "source-layer": 'data_dttm_atena_light-58sx1e',
        "paint":{"fill-color": [
            "match",
            ["get", "Disponibilité"],
            "Indisponible", [
                "match",
                ["get", "ETAT"],
                "Concédée", "#e4794a",
                "Supprimée", "#929292",
                "Annulée", "#929292",
                "#7b7b7b" 
            ],
            "Disponible","#1f8d49",
            "Etat inconnu","#fbb8f6",
            "#7b7b7b" /* Default color if no match is found */
        ],
        
        "fill-opacity":0.8}
    });

    // affichage des clusters de points
map.addSource('point_data', {
        "type": 'geojson',
         "data": 'https://anaeldelorme.github.io/aquapreneur_carto/data_dttm_atena_point_light.geojson',
        "cluster": true,
        "clusterMaxZoom": 20, // Max zoom to cluster points on
        "clusterRadius": 50 // Radius of each cluster when clustering points (defaults to 50)
      });

 map.addLayer({
        "id": 'clusters',
        "type": 'circle',
        "source": 'point_data',
        "filter": ['has', 'point_count'],
        "maxzoom":10,
        "paint": {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6', 500,
                '#f1f075', 1000,
                '#8dde73'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,  500,
                30,  1000,
                40
            ]
            }   
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'point_data',
        filter: ['has', 'point_count'],
        "maxzoom":10,
        layout: {
            'text-field': ['get', 'point_count'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'point_data',
            "maxzoom":10,
            filter: ['!', ['has', 'point_count']],
            paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
            }
            }); 

}

map.on('load', function(){

    addAdditionalSourceAndLayer();

});

const viewToggleSwitch = document.getElementById('viewToggleSwitch');

viewToggleSwitch.addEventListener('change', function () {
    if (this.checked) {
        // Si la case à cocher est cochée, utilisez le style satellite
        map.setStyle('mapbox://styles/mapbox/satellite-v9');
    } else {
        // Sinon, utilisez le style des rues
        map.setStyle('mapbox://styles/mapbox/light-v11');
    }
    map.on('style.load', function () {
        addAdditionalSourceAndLayer();
    });
});
// Ajout d'éléments de navigation
var nav = new mapboxgl.NavigationControl();
map.addControl(nav,'bottom-left');

map.addControl(new mapboxgl.ScaleControl({
    maxWidth:120,
    unit:'metric'
}));



// Intéractivité avec les données 
var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true,
    className: 'popupConcession'
});

map.on('mousemove', function(e) {
    var clusterFeatures = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    var concessionFeatures = map.queryRenderedFeatures(e.point, { layers: ['concessions'] });

    if (clusterFeatures.length) {
        map.getCanvas().style.cursor = 'pointer';
    } else if (concessionFeatures.length) {
        map.getCanvas().style.cursor = 'pointer';
    } else {
        map.getCanvas().style.cursor = '';
    }
});

function setPopupHTML(feature) {
            function isValidDate(date) {
                return date instanceof Date && !isNaN(date);
            }    
            function formatDate(date){
                var jour = date.getDate();
                var mois = date.getMonth() + 1; // Les mois commencent à 0, donc ajouter 1
                var annee = date.getFullYear();
                return dateFormatee = isValidDate(date) ? jour + '/' + mois + '/' + annee : '';
                
            }

        var dateExpiration = new Date(feature.properties.DATE_EXPIRATION);
        dateExpirationFormatee = formatDate(dateExpiration)

        var dateArrete = new Date(feature.properties['DATE_ARRETE ']);
        dateArreteFormatee = formatDate(dateArrete)

        var dateDebutEP = new Date(feature.properties['Date début Enquête publique']);
        dateDebutEPFormatee = formatDate(dateDebutEP)

        var dateFinEP = new Date(feature.properties['Date fin Enquête Publique']);
        dateFinEPFormatee = formatDate(dateFinEP)

    return '<h2> N° parcelle : ' + feature.properties.NUM_CONCESSION + '</h2>' +
            (dateDebutEPFormatee && dateFinEPFormatee ?
                '<p><b><span style="color: green;">Enquête Publique : du ' + dateDebutEPFormatee + ' au ' + dateFinEPFormatee +'</span></b></p><br/>' :
                '') +
            'Espèce : '+(feature.properties.ESPECE_PRINCIPALE || '') + '<br/>' +
            'Technique : '+ (feature.properties.NATURE_EXPLOITATION || '') + ' -' + (feature.properties.FAMILLE_EXPLOITATION || '') + '<br/>' +
            (feature.properties.SURFACE_PARCELLE ? 'Surface : ' + feature.properties.SURFACE_PARCELLE + 'm2 (ares)<br/>' : '') +
            (feature.properties.LONGUEUR_PARCELLE ? 'Longueur : ' + feature.properties.LONGUEUR_PARCELLE + 'm<br/>' : '') +
            (feature.properties.Surface ? 'Surface : ' + feature.properties.Surface + 'm2 (ares)<br/>' : '') +
            (feature.properties['Surface occupation (ares)'] ? 'Surface : ' + feature.properties['Surface occupation (ares)'] + 'm2 (ares)<br/>' : '')  +
            (feature.properties['Longueur (m)'] ? 'Longueur : ' + feature.properties['Longueur (m)'] + 'm<br/>' : '')+ 
             'Nature du terrain : '+(feature.properties.NATURE_TERRAIN || '')+'<br/>' +
             (feature.properties['N° demande'] ? 'N° demande : ' + feature.properties['N° demande'] + ' - '+ feature.properties.Opérations + '<br/>' :'') +
             (feature.properties.NUM_ARRETE ? 'N°arrêté AECM : ' + feature.properties.NUM_ARRETE + '<br/>' :'') +
             (feature.properties.DATE_ARRETE ? 'Date de fin de validité de l\'arrêté : ' + feature.properties.DATE_ARRETE + '<br/>' :'') ;
}


map.on('click', function(e) {
    var concessionFeatures = map.queryRenderedFeatures(e.point, { layers: ['concessions'] });
    var clusterFeatures = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });

    // Gestion des clics sur la couche 'concessions'
    if (concessionFeatures.length) {
        var feature = concessionFeatures[0];
        var coordinates = feature.geometry.type === 'Point' ?
            feature.geometry.coordinates :
            e.lngLat;        

        popup.setLngLat(coordinates)
            .setHTML(setPopupHTML(feature))
            .addTo(map);

        return;
    }

    // Gestion des clics sur la couche 'clusters'
    if (clusterFeatures.length) {
        const clusterId = clusterFeatures[0].properties.cluster_id;
        map.getSource('point_data').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
                if (err) return;

                map.easeTo({
                    center: clusterFeatures[0].geometry.coordinates,
                    zoom: zoom
                });
            }
        );
        return;
    }

});

var originalData;

fetch('./data_dttm_atena_point_light.geojson')
  .then(response => response.json())
  .then(data => {
    originalData = data;
  })
  .catch(error => console.error('Erreur lors de la récupération des données :', error));

// filtrer les concessions
function updateFilters() {
    var filters = ['any'];
    var etatsFiltresCluster = [];

    if (!originalData) {
        console.error('Original data is not yet loaded.');
        return;
      }

    if (document.getElementById('disponibleCheckbox').checked) {
      filters.push(['==', ['get', 'Disponibilité'], 'Disponible']);
      etatsFiltresCluster.push('Disponible');
    }
    if (document.getElementById('indisponibleCheckbox').checked) {
      filters.push(['==', ['get', 'Disponibilité'], 'Indisponible']);
      etatsFiltresCluster.push('Indisponible');
    }
    
    if (document.getElementById('indefinieCheckbox').checked) {
      filters.push(['==', ['get', 'Disponibilité'], 'Etat inconnu']);
      etatsFiltresCluster.push('Etat inconnu');
    }
    map.setFilter('concessions', filters);

    // Filter the GeoJSON data based on the combined filter
    var filteredData = {
        type: "FeatureCollection",
        crs: originalData.crs,
        features: originalData.features.filter(item => {
            if (item.properties && item.properties.Disponibilité) {
                return etatsFiltresCluster.includes(item.properties.Disponibilité);
            }
            return false;
        })
    };

    // Update the clustering source with the filtered data
    map.getSource('point_data').setData(filteredData);
  }

  // Ajoutez un écouteur d'événement pour chaque case à cocher
  document.getElementById('disponibleCheckbox').addEventListener('change', updateFilters);
  document.getElementById('indisponibleCheckbox').addEventListener('change', updateFilters);
  document.getElementById('indefinieCheckbox').addEventListener('change', updateFilters);


//zoom sur les régions conchylicole
document.getElementById('regionDropdown').addEventListener('change', function() {
    var selectedRegion = this.value;
    var coordinates = getCoordinatesForRegion(selectedRegion);
    var zoom = getZoomForRegion(selectedRegion);
    map.flyTo({
        zoom: zoom,
        center: coordinates
    });
});

// Fonction pour obtenir les coordonnées en fonction de la région sélectionnée
function getCoordinatesForRegion(region) {
    switch (region) {
        case 'Normandie':
            return [-1.1, 49.2];
        case 'Bnord':
            return [-3.5, 48.7];
        case 'Bsud':
            return [-4, 47.7];
        case 'Pdl':
            return [-3, 47];
        case 'Charente':
            return [-1.5, 45.89];
        case 'Arcachon':
            return [-1.3, 44.6];
        case 'Med':
            return [5.5, 43.14];
        default:
            return [3, 47]; 
    }
}

// Fonction pour obtenir les zooms en fonction de la région sélectionnée
function getZoomForRegion(region) {
    switch (region) {
        case 'Normandie':
            return 8.5;
        case 'Bnord':
            return 8.5;
        case 'Bsud':
            return 8.2;
        case 'Pdl':
            return 9;
        case 'Charente':
            return 9;
        case 'Arcachon':
            return 10;
        case 'Med':
            return 7.5;
        default:
            return 8; 
    }
}

// Gestion des erreurs
map.on('error', function(err) { 
    console.log('Mapbox Error:', err.error);
});


function setCentroid(feature){
    var polygon = turf.polygon(feature.geometry.coordinates);
    var centroid = turf.centroid(polygon);
    return(centroid.geometry.coordinates)
}


// Liste des parcelles visibles
let parcelles = [];

const listingEl = document.getElementById('feature-listing');

function renderListings(features) {
    const empty = document.createElement('p');
    // Clear any existing listings
    listingEl.innerHTML = '';

    const filteredFeatures = features.filter(feature => feature.properties.Disponibilité === "Disponible");


    if (filteredFeatures.length) {
    for (const feature of filteredFeatures) {
        const itemLink = document.createElement('a');
        const label = `${feature.properties.NUM_CONCESSION}`;
        
        itemLink.textContent = label;
        
        itemLink.addEventListener('mousemove', () => {
                popup
                .setLngLat(setCentroid(feature))
                .setText(label)
                .addTo(map);

        });

        itemLink.addEventListener('click', () => {
            map.flyTo({
                center: setCentroid(feature),
                zoom: 15,
                essential: true
            });
            popup.remove();
            // Open the popup at the centroid coordinates
            popup
                .setLngLat(setCentroid(feature))
                .setHTML(setPopupHTML(feature))
                .addTo(map);
        });
        listingEl.appendChild(itemLink);
    }
    

    } else if (filteredFeatures.length === 0 && map.getZoom() < 8) {
    empty.textContent = 'Zoomer sur la carte pour afficher les parcelles disponibles.';
    listingEl.appendChild(empty);
    } else {
    empty.textContent = 'Pas de parcelle disponible ici, changer de zone.';
    listingEl.appendChild(empty);
    
    }
}

function calculatePolygonCenter(coordinates) {
  // Votre logique pour calculer le centre du polygone
  // Par exemple, vous pourriez calculer la moyenne des coordonnées du polygone
  // Assurez-vous de manipuler les coordonnées selon la structure spécifique de vos données
  // Ci-dessous, c'est un exemple simple pour des coordonnées [lng, lat]
  const lngs = coordinates.map(coord => coord[0]);
  const lats = coordinates.map(coord => coord[1]);

  const centerLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
  const centerLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;

  return [centerLng, centerLat];
}

function getUniqueFeatures(features, comparatorProperty) {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
        const id = feature.properties[comparatorProperty];
        if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        uniqueFeatures.push(feature);
        }
    }
    return uniqueFeatures;
}
 
function normalize(string) {
return string.trim().toLowerCase();
}

map.on('moveend', () => {
    const features = map.queryRenderedFeatures({ layers: ['concessions'] });
    
    if (features) {
    const uniqueFeatures = getUniqueFeatures(features, 'NUM_CONCESSION');
    // Populate features for the listing overlay.
    renderListings(uniqueFeatures);
    
    
    // Store the current features in sn `airports` variable to
    // later use for filtering on `keyup`.
    parcelles = uniqueFeatures;
    }
});


