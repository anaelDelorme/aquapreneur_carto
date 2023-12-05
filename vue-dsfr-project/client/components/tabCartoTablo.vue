<script setup>
const tabListName = "tabs";
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
const tabContents = ['Blabla', 'Bidule'];

const initialSelectedIndex = 0;
</script>

<template>
  <DsfrTabs
    :tab-list-name="tabListName"
    :tab-titles="tabTitles"
    :tab-contents="tabContents"
    :initial-selected-index="initialSelectedIndex"
  />
</template>