<template>
  <aside
    v-show="isAsideVisible"
    class="aside is-placed-left"
  >
        <b-image
            :src="require('@/assets/logo2.jpg')"
            alt="The Buefy Logo"
            ratio="1by1"
            :rounded="true"
        ></b-image>
    <div class="aside-tools">
      <a
        class="navbar-item is-hidden-touch is-hidden-widescreen is-desktop-icon-only"
        @click="asideToggleDesktopOnly"
      >
        <b-icon icon="menu" />
      </a>
      <div class="aside-tools-label">
        <span>Cooperativa Río San Pablo</span>
      </div>
    </div>
    <div class="menu is-menu-main">
      <template v-for="(menuGroup, index) in menu">
        <p
          v-if="typeof menuGroup === 'string'"
          :key="index"
          class="menu-label"
        >
          {{ menuGroup }}
        </p>
        <aside-menu-list
          v-else
          :key="index"
          :menu="menuGroup"
          @menu-click="menuClick"
        />
      </template>
    </div>
  </aside>
</template>

<script>
import { useRouter } from '@/router'
import { useStore } from '@/store'
import { computed, onMounted } from '@vue/composition-api'
import AsideMenuList from '@/components/AsideMenuList.vue'

export default {
  name: 'AsideMenu',
  components: { AsideMenuList },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const store = useStore()

    const isAsideVisible = computed(() => store.state.isAsideVisible)

    const asideToggleDesktopOnly = () => {
      store.dispatch('asideDesktopOnlyToggle')
    }

    const menuClick = item => {
      //
    }

    const router = useRouter()

    onMounted(() => {
      router.afterEach(() => {
        store.dispatch('asideDesktopOnlyToggle', false)
      })
    })

    return {
      isAsideVisible,
      asideToggleDesktopOnly,
      menuClick
    }
  }
}
</script>
