<template>
    <div class="map">
      <l-map style="width: 100%; height: 100%" :zoom="zoom" :center="center">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-geo-json
          ref="geojsonLayer"
          :geojson="geojson"
          :options="geojsonOptions"
          @ready="updateStyle"
        ></l-geo-json>
      </l-map>
    </div>
  </template>
  
  <script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import { ref, onMounted } from "vue";
export default {
  name: "App",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  setup() {
    const zoom = ref(6);
    const center = ref([47.313220, -1.319482]);
    const url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    const attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    const datageo = ref(undefined);
    onMounted(async () => {
      const response = await fetch("data/data_ddtm_atena.geojson");
      datageo.value = await response.json();
    });
    const geojson = datageo;


    
    const geojsonOptions = {
      onEachFeature: (feature, layer) => {
        layer.bindPopup((l) => getLabel(l));
        layer.on("mouseover", () => {
          layer.openPopup();
        });
        layer.on("mouseout", () => {
          layer.closePopup();
        });
      },
    };

    const getEtat = (lst, id) => {
      const result = lst.find((item) => item.id === id);
      return result?.ETAT?.toString() || 'N/A'; // Use 'N/A' or any default color you prefer
    };


    const updateStyle = () => {
      
      console.log("Updating style...");
      const geojsonLayer = this.$refs.geojsonLayer?.leafletObject;
      console.log("Next...");
      if (!geojsonLayer) {
        console.warn("GeoJSON layer not found. Skipping style update.");
        return;
      }

      const features = geojson.value.features;
      console.log("Features:", features);
      const newStyle = (feature) => {
        const etat = getEtat(features, feature.properties.id);
        console.log("ETAT:", etat);
        let color;
        switch (etat) {
          case 'Concédée':
            color = 'green';
            break;
          case 'Supprimée':
            color = 'grey';
            break;
          case 'Annulée':
            color = 'black';
            break;
          case 'Vacante':
            color = 'red';
            break;
          default:
            color = 'orange';
        }
        console.log("Setting color:", color);
        return {
          color,
          fillOpacity: 0.2,
        };
      };

      geojsonLayer.setStyle(newStyle);
      console.log("Style updated!");
    };

    return {
      zoom,
      center,
      url,
      attribution,
      geojson,
      geojsonOptions,
      getEtat,
      updateStyle
    };
  },
};
</script>
  
  <style>
  .map {
    height: 500px;
    width: 500px;
  }
  </style>
  