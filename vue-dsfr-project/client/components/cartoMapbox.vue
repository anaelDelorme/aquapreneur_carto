<script setup lang="ts">
import { computed, ref, useMapboxMarkerRef, useMapboxPopup, useMapboxPopupRef, useMapboxRef } from "#imports";
import type { FillLayer, LngLatLike, VectorSource  } from "mapbox-gl";

const mapStyle = 'mapbox://styles/mapbox/satellite-v9';
const center: LngLatLike = [2.727990, 46.967532]; 
const zoom = 5;
const source = ref<VectorSource>({
  type: "vector",
  url: "mapbox://anaeldelorme.ci5uapc9",
});
const layerRef = ref<FillLayer>({
  source: "tileset_data",
  id: "concessions",
  type: "fill",
  "source-layer": 'data_dttm_atena_light-bgx993',
  paint: {
    "fill-color": [
            "match",
            ["get", "ETAT"],
            "Concédée", "#fc5d00",
            "Supprimée", "#f60700",
            "Vacance","#27a658",
            "#7b7b7b" /* Default color if no match is found */
        ],    
        "fill-opacity":0.8
  },
});

</script>

<style>
.popupConcession .mapboxgl-popup-content {
  background-color: white;
  color: black;
  opacity: 0.8;
}
</style>

<template>
  <ClientOnly>
    <div style="height: 100vh;">
      <MapboxMap
        map-id="map"
        style="position: absolute; top: 10px; bottom: 10px; left: 10px; right: 10px;"
        :options="{
          style: mapStyle,
          center: center,
          zoom: zoom
        }"
      >
        <MapboxGeolocateControl position="top-left" />
        <MapboxNavigationControl position="top-left" />
        <MapboxSource 
          source-id="tileset_data"
          :source="source"
        >
          <MapboxLayer
            :layer="layerRef"   
          />
        </MapboxSource>
        <MapboxFullscreenControl />
        <MapboxScaleControl unit="metric" maxWidth="120"/>
      </MapboxMap>
    </div>
  </ClientOnly>
</template>
