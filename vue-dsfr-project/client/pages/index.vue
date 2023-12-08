<script setup>
definePageMeta({
  layout: 'basic',
})
const title_bandeau = "Site en cours de développement - les données ne sont pas actualisées et ne sont pas valides."
const closeable = true
const onClick = () => {
      const externalLink = "https://aquaculteurmarin.applicatif.net/"
      window.location.href = externalLink
    }
</script>

<template>
  <div>
    <Html lang="fr">
      <Head>
        <Title>Aquapreneur.e.s - Déclaration de production</Title>
      </Head>
    </Html>

    <h1 class="fr-mt-4w">
        Déclaration de production
    </h1>
    <DsfrButton
          type="button"
          label="Accéder à la déclaration de production"
          size="sm"
          @click="onClick()"
        />
    <br/>
    <br/>
  </div>
</template>
