<script setup>
  const url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  const attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  const zoom= ref(6)
  const center = [47.313220, -1.319482]
  const datageo = ref(undefined)
  onMounted(async () => {
    const response = await fetch(
        "data/data_ddtm_atena.geojson"
      );
      datageo.value = await response.json();
  });
  // add a load status computedRef
  const dataHasBeenLoaded = computed(() => datageo.value !== undefined)

  const geoStyler = (feature) => {
    const etat = feature.properties["Etat"]
    let color;
        switch (etat) {
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
          default:
            color = "#ffca00";
        };
      return {
        color: color,
        fillColor: color,
        stroke: true
      }
    }



</script>

<style>
  body {
    margin: 0;
  }
</style>

<template>
  <ClientOnly>
  <div 
    v-if="dataHasBeenLoaded"
    style="height:100vh; width:100vh">
  
    <LMap
      ref="map"
      :zoom="zoom"
      :center="center"
    >
      <LTileLayer
        :url="url"
        :attribution="attribution"
        layer-type="base"
        name="OpenStreetMap"
      />
      <LGeoJson 
        :geojson="datageo"
        :options-style="geoStyler"
        @pm:click="handleFeatureClick">
      </LGeoJson>
    </LMap>
  </div>
</ClientOnly>
</template>