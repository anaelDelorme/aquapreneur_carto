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
      <button @click="setMunicipality">Municipality</button>
      <button @click="setScore1">Score1</button>
      <button @click="setScore2">Score2</button>
    </div>
  </template>
  
  <script>
  import "leaflet/dist/leaflet.css";
  import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
  import { LondonSquare } from "./geojson";
  import { score1 } from "./score1";
  import { score2 } from "./score2";
  
  export default {
    name: "App",
    components: {
      LMap,
      LTileLayer,
      LGeoJson,
    },
    data() {
      return {
        zoom: 12,
        center: [51.505, -0.09],
        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        geojson: LondonSquare,
        mode: "municipality",
      };
    },
    computed: {
      geojsonOptions() {
        return {
          onEachFeature: (feature, layer) => {
            layer.bindPopup((l) => this.getLabel(l));
            layer.on("mouseover", () => {
              layer.openPopup();
            });
            layer.on("mouseout", () => {
              layer.closePopup();
            });
          },
        };
      },
    },
    methods: {
      setMunicipality() {
        this.mode = "municipality";
        this.updateStyle();
      },
      setScore1() {
        this.mode = "score1";
        this.updateStyle();
      },
      setScore2() {
        this.mode = "score2";
        this.updateStyle();
      },
      getScore(lst, id) {
        const result = lst.find((item) => {
          return item.id === id;
        });
  
        return result?.score?.toString();
      },
  
      getLabel(layer) {
        const props = layer?.feature?.properties;
        switch (this.mode) {
          case "municipality":
            return props?.name;
  
          case "score1":
            return this.getScore(score1, props?.id);
  
          case "score2":
            return this.getScore(score2, props?.id);
  
          default:
            break;
        }
      },
  
      updateStyle() {
        const geojsonLayer = this.$refs.geojsonLayer?.leafletObject;
        if (!geojsonLayer) {
          return;
        }
  
        let style;
        if (this.mode === "municipality") {
          style = {
            color: "blue",
            fillOpacity: 0.3,
          };
        } else if (this.mode === "score1") {
          style = (feature) => {
            const score = this.getScore(score1, feature.properties.id);
            return {
              color: score > 5 ? "red" : "orange",
              fillOpacity: score > 5 ? 0.2 : 0.05,
            };
          };
        } else if (this.mode === "score2") {
          style = (feature) => {
            const score = this.getScore(score2, feature.properties.id);
            return {
              color: "green",
              fillOpacity: score,
            };
          };
        }
  
        this.$refs.geojsonLayer.leafletObject.setStyle(style);
      },
    },
  };
  </script>
  
  <style>
  .map {
    height: 500px;
    width: 500px;
  }
  </style>
  