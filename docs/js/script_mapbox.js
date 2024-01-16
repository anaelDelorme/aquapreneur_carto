// AccesToken
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hZWxkZWxvcm1lIiwiYSI6ImNscTI1eHI1bjAwcHQyam5zNXEzbG9sNDUifQ.OplU3wX4w6Thg2ZKomWZ9A';

// Configuration de la carte
var map = new mapboxgl.Map({container: 'map',
style: 'mapbox://styles/mapbox/satellite-v9', // fond de carte
center: [2.727990, 46.967532], // lat/long
zoom: 5
});

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
            ["get", "ETAT"],
            "Concédée", "#fc5d00",
            "Supprimée", "#f60700",
            "Annulée", "#dbdbdc",
            "Vacante","#27a658",
            "Etat inconnu","#7b7b7b",
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
map.addControl(nav,'top-left');

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



map.on('click', function(e) {
    var concessionFeatures = map.queryRenderedFeatures(e.point, { layers: ['concessions'] });
    var clusterFeatures = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });

    // Gestion des clics sur la couche 'concessions'
    if (concessionFeatures.length) {
        var feature = concessionFeatures[0];
        var coordinates = feature.geometry.type === 'Point' ?
            feature.geometry.coordinates :
            e.lngLat;

        var dateExpiration = new Date(feature.properties.DATE_EXPIRATION);
        var jourExpiration = dateExpiration.getDate();
        var moisExpiration = dateExpiration.getMonth() + 1; // Les mois commencent à 0, donc ajouter 1
        var anneeExpiration = dateExpiration.getFullYear();
        var dateFormateeExpiration = jourExpiration + '/' + moisExpiration + '/' + anneeExpiration;

        var dateArrete = new Date(feature.properties['DATE_ARRETE ']);
        var jourArrete = dateArrete.getDate();
        var moisArrete = dateArrete.getMonth() + 1; // Les mois commencent à 0, donc ajouter 1
        var anneeArrete = dateArrete.getFullYear();
        var dateFormateeArrete = jourArrete + '/' + moisArrete+ '/' + anneeArrete;

        popup.setLngLat(coordinates)
            .setHTML('<h2> Concession n°' + feature.properties.NUM_CONCESSION + '</h2>' +
                '<h3> Arrêté n°' + feature.properties.NUM_ARRETE + ' du ' + dateFormateeArrete + '</h3>' +
                '<p>Etat : ' + feature.properties.ETAT + '<br/>' +
                '<p>Date d\'expiration : ' + dateFormateeExpiration + '<br/>' +
                '<p>Type de parcelle : ' + feature.properties['TYPE PARCELLE'] + '<br/>' +
                '<p>Nature du terrain : ' + feature.properties.NATURE_TERRAIN + '<br/>' +
                '<p>Nature et famille d\'exploitation : ' + feature.properties.NATURE_EXPLOITATION + ' -' + feature.properties.FAMILLE_EXPLOITATION + '<br/>' +
                '<p>Espèce : ' + feature.properties.ESPECE_PRINCIPALE + '<br/>' +
                '</p>')
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

map.on('data', function(e) {
  if (e.sourceId === 'point_data' && e.isSourceLoaded) {
    originalData = map.getSource('point_data')._data;
    console.log('originalData:', originalData); // Ajout de cette ligne pour afficher dans la console
  }
});
// filtrer les concessions
function updateFilters() {
    var filters = ['any'];

    if (document.getElementById('supprimeeCheckbox').checked) {
      filters.push(['==', ['get', 'ETAT'], 'Supprimée']);
    }
    if (document.getElementById('annuleeCheckbox').checked) {
      filters.push(['==', ['get', 'ETAT'], 'Annulée']);
    }
    if (document.getElementById('vacanteCheckbox').checked) {
      filters.push(['==', ['get', 'ETAT'], 'Vacante']);
    }
    if (document.getElementById('concedeeCheckbox').checked) {
      filters.push(['==', ['get', 'ETAT'], 'Concédée']);
    }
    if (document.getElementById('indefinieCheckbox').checked) {
      filters.push(['==', ['get', 'ETAT'], 'Etat inconnu']);
    }

    map.setFilter('concessions', filters);

        
    // pour les clusters
    var filteredData = originalData?.features?.filter(item => {
        if (mylist.filter(myitem => myitem.id === item.properties.wineryid).length > 0) {
        return item;
        }
    });
    console.log('filteredData:', filteredData); // Ajout de cette ligne pour afficher dans la console

    // Update the clustering source with the filtered data
    map.getSource('point_data').setData(filteredData);
  }

  // Ajoutez un écouteur d'événement pour chaque case à cocher
  document.getElementById('supprimeeCheckbox').addEventListener('change', updateFilters);
  document.getElementById('annuleeCheckbox').addEventListener('change', updateFilters);
  document.getElementById('vacanteCheckbox').addEventListener('change', updateFilters);
  document.getElementById('concedeeCheckbox').addEventListener('change', updateFilters);
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
            return [-0.7236, 49.2473];
        case 'Bnord':
            return [-3.026, 48.802];
        case 'Bsud':
            return [-3.5046, 47.7016];
        case 'Pdl':
            return [-2.472, 46.975];
        case 'Charente':
            return [-1.2543, 46.0857];
        case 'Arcachon':
            return [-1.1884, 44.5649];
        case 'Med':
            return [5.841, 43.139];
        default:
            return [2.727990, 46.967532]; 
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
            return 10;
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