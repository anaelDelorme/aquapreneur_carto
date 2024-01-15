<template>
  <div class="map">
    <l-map style="width: 100%; height: 100%" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-geo-json
        ref="geojsonLayer"
        :geojson="geojson"
        :options="geojsonOptions"
        @pm:click="handleFeatureClick"
      ></l-geo-json>
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
export default {
  name: "App",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  data() {
    return {
      zoom: 6,
      center: [47.313220, -1.319482],
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      geojson: null,
      fillColor: "#e4ce7f"
    };
  },
  computed: {
    geojsonOptions() {
      return {
        onEachFeature: (feature, layer) => {
          const color = this.getColor(layer)
          layer.bindPopup((l) => this.getLabel(l));
          layer.setStyle({
            weight: 2,
            color: color,
            opacity: 1,
            fillColor: color,
            fillOpacity: 1
          });
        },
      };
    },
  },
  methods: {
    async loadData() {
      try {
        const response = await fetch("data/data_ddtm_atena.geojson");
        if (!response.ok) {
          throw new Error("Impossible de charger le fichier GeoJSON");
        }
        this.geojson = await response.json();
      } catch (erreur) {
        console.error("Erreur lors du chargement du fichier GeoJSON", erreur);
        throw erreur;
      }
    },
    getLabel(layer) {
      const props = layer?.feature?.properties;
      return `Numéro de la concession: ${props?.NUM_CONCESSION},<br> Etat (Atena): ${props?.Etat}`;
    },
    getColor(layer) {
      const props = layer?.feature?.properties;
      let color;
        switch (props?.Etat) {
          case "Concédée":
            color = "#00a95f";
            break;
          case "Supprimée":
            color = "#4b3525";
            break;
          case "Annulée":
            color = "#ecd7a2";
            break;
          case "Vacante":
            color = "#f60700";
            break;
          case null:
            color = "#ffca00";
            break;
          default:
            color = "#ffca00";
        };
      return color;
    },
    handleFeatureClick(event) {
      const layer = event.target;
      const isOpen = layer.isPopupOpen();
      if (isOpen) {
        layer.closePopup();
      } else {
        layer.openPopup();
      }
    },
    
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style>
.map {
  height: 500px;
  width: 100%;
}
</style>
