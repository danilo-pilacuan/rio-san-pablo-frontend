<template>
  <footer
    v-show="isFooterBarVisible"
    class="footer"
  >
    <div class="container-fluid">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div class="footer-copyright">
              &copy; {{ year }}, Cooperativa de Transporte Intraprovincial <b>Río San Pablo.</b>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="logo">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { useStore } from '@/store'
import { computed } from '@vue/composition-api'

export default {
  name: 'FooterBar',
  setup () {
    const year = new Date().getFullYear()

    const store = useStore()

    const isFooterBarVisible = computed(() => store.state.isFooterBarVisible)

    return {
      year,
      isFooterBarVisible
    }
  }
}
</script>
