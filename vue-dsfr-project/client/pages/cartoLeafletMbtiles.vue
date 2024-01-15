<script setup>
  const url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  const attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  const zoom= ref(6)
  const center = [47.313220, -1.319482]
  const url_data = "data/file.mbtiles"

</script>

<style>
  body {
    margin: 0;
  }
</style>

<template>
  <ClientOnly>
  <div style="height:100vh; width:100vh">
  
    <LMap
      ref="map"
      :zoom="zoom"
      :center="center"
    >
      <LTileLayer
        :url="url_data" 
        />
    </LMap>
  </div>
</ClientOnly>
</template>