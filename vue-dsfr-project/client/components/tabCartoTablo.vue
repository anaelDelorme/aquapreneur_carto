<script setup lang = "ts">
const tabListName = "tabs"
const tabTitles = [
  {
    "title": "Carte des concessions",
    "icon": "ri-checkbox-circle-line",
    "tabId": "tab-0",
    "panelId": "tab-content-0"
  },
  {
    "title": "Liste des concessions",
    "icon": "ri-checkbox-circle-line",
    "tabId": "tab-1",
    "panelId": "tab-content-1"
  }
]

const initialSelectedIndex = 0
const { ascendant, selected, select } = useTabs()


</script>

<template>
  <DsfrTabs
    ref="tabs"
    :tab-list-name="tabListName"
    :tab-titles="tabTitles"
    :initial-selected-index="initialSelectedIndex"
    @select-tab="select"
  >
    <DsfrTabContent
      panel-id="tab-content-0"
      tab-id="tab-0"
      :selected="selected === 0"
      :asc="ascendant"
    >
    <cartoMapbox></cartoMapbox>
    </DsfrTabContent>
    <DsfrTabContent
      panel-id="tab-content-1"
      tab-id="tab-1"
      :selected="selected === 1"
      :asc="ascendant"
    >
      <div>Affichage du tableau</div>
    </DsfrTabContent>
    
  </DsfrTabs>

</template>