<script setup>
const serviceTitle = 'Aquapreneur.e.s'
const serviceDescription = 'Cartographie des concessions sur domaine public maritime'
const logoText = ['SGMer','Ministère', 'de l\'agriculture', 'et de la souveraineté', 'alimentaire']
const navItems = [
  {
    "to": "/",
    "text": "Cartographie"
  },
  {
    "title": "Informations complémentaires",
    "links": [
      {
        "text": "A propos",
        "to": "/apropos"
      }
    ]
  }
]

</script>

<template>
  <DsfrHeader
    v-model="query"
    :service-title="serviceTitle"
    :service-description="serviceDescription"
    :logo-text="logoText"
    :quick-links="quickLinks"
  />
  <div class="fr-container">
    <template>
      <DsfrNavigation :nav-items="navItems" />
    </template>
    <slot />
  </div>
  <DsfrFooter
      :a11y-compliance="a11yCompliance"
      :before-mandatory-links="beforeMandatoryLinks"
      :after-mandatory-links="afterMandatoryLinks"
      :logo-text="logoText"
      :legal-link="legalLink"
      :personal-data-link="personalDataLink"
      :cookies-link="cookiesLink"
      :a11y-compliance-link="a11yComplianceLink"
      :desc-text="descText"
      :home-link="homeLink"
      :partners="partners"
      :ecosystem-links="ecosystemLinks"
      :licence-text="licenceText"
      :licence-to="licenceTo"
      :licence-name="licenceName"
      :licence-link-props="licenceLinkProps"
    />            
</template>
