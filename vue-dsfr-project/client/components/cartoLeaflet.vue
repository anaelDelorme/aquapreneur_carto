<script setup>
const url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
const zoom= ref(6)
const center = [47.313220, -1.319482]
const datageo = ref(undefined)
onMounted(async () => {
 const response = await fetch(
    "data/merged.geojson"
  );
  datageo.value = await response.json();
});


const geoStyler = (feature) => {
  const etat = feature.properties["Etat de la"]

  // Logique pour définir le style en fonction de la valeur de "Etat de la"
  if (etat === "V") {
    return {
      color: "#F23030",
      fillColor: "#F23030",
      stroke: true
    }
  } else if (etat === "C") {
    // Style pour "C"
    return {
      color: "#267365",
      fillColor: "#267365",
      stroke: true
    }
  } else if (etat === "S") {
    // Style pour "S"
    return {
      color: "#F29F05",
      fillColor: "#F29F05",
      stroke: true
    }
  } else {
    // Style par défaut
    return {
      color: "gray",
      fillColor: "gray",
      stroke: true
    }
  }
}

</script>

<style>
body {
  margin: 0;
}
</style>

<template>
  <div style="height:100vh; width:100vh">
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
        :options-style="geoStyler">
      </LGeoJson>
    </LMap>
  </div>
</template>
