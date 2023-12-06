<script setup>
definePageMeta({
  layout: 'basic',
})
const placeholder = "Rechercher une concession"
const title_bandeau = "Site en cours de développement - les données ne sont pas actualisées et ne sont pas valides."
const closeable = true

</script>

<template>
  <div>
    <Html lang="fr">
      <Head>
        <Title>Aquapreneur.e.s - Cartographie des concessions</Title>
      </Head>
    </Html>

    <h1 class="fr-mt-4w">
      Concessions sur Domaine Public maritime
    </h1>
    <noticeDataTest></noticeDataTest>
    <br/>
    <tabCartoTablo></tabCartoTablo>
    <br/>
    
    <br/>
  </div>
</template>
