<template>
    <div class="fr-notice fr-notice--info">
      <div class="fr-container">
          <div class="fr-notice__body">
              <p class="fr-notice__title">Ce site est en construction! Les données ne sont pas actualisées et ne sont utilisées qu'à des fins de test.</p>
              <button class="fr-btn--close fr-btn" title="Masquer le message" onclick="const notice = this.parentNode.parentNode.parentNode; notice.parentNode.removeChild(notice)">
                  Masquer le message
              </button>
          </div>
      </div>
    </div>
</template>