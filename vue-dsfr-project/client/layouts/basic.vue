<script setup>
const serviceTitle = 'Aquapreneur.e.s'
const serviceDescription = 'Cartographie des concessions sur domaine public maritime'
const logoText = ['Gouvernement']
const navItems = [
  {
    "to": "/",
    "text": "Déclaration de production"
  },
  {
    "to": "/cartographie",
    "text": "Cartographie des concessions"
  },
  {
    "title": "Informations complémentaires",
    "links": [
      {
        "text": "A propos",
        "to": "/apropos"
      },
      {
        "text": "Test carto",
        "to": "/test"
      },
      {
        "text": "Test carto 2",
        "to": "/cartoLeafletMbtiles"
      }
    ]
  }
]

</script>

<template>
  <DsfrHeader
    :service-title="serviceTitle"
    :service-description="serviceDescription"
    :logo-text="logoText"
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
