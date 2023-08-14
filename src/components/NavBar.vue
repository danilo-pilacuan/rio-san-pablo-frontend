<template>
  <nav
    v-show="isNavBarVisible"
    id="navbar-main"
    class="navbar is-fixed-top no-print"
  >
    <div class="navbar-brand">
      <a
        class="navbar-item is-hidden-desktop"
        @click.prevent="asideToggleMobile"
      >
        <b-icon :icon="asideMobileIcon" />
      </a>
      <a
        class="navbar-item is-hidden-touch is-hidden-widescreen is-desktop-icon-only"
        @click.prevent="asideDesktopOnlyToggle"
      >
        <b-icon icon="menu" />
      </a>
      
    </div>
    <div class="navbar-brand is-right">
      <a
        class="navbar-item navbar-item-menu-toggle is-hidden-desktop"
        @click.prevent="menuToggle"
      >
        <b-icon
          :icon="menuToggleIcon"
          custom-size="default"
        />
      </a>
    </div>
    <div
      class="navbar-menu fadeIn animated faster"
      :class="{ 'is-active': isMenuActive }"
    >
      <div class="navbar-end">
        <!-- <nav-bar-menu class="has-divider">
          <b-icon
            icon="menu"
            custom-size="default"
          />
          <span>Sample Menu</span>
          <div
            slot="dropdown"
            class="navbar-dropdown"
          >
            <router-link
              to="/profile"
              class="navbar-item"
              exact-active-class="is-active"
            >
              <b-icon
                icon="account"
                custom-size="default"
              />
              <span>My Profile</span>
            </router-link>
            <a class="navbar-item">
              <b-icon
                icon="settings"
                custom-size="default"
              />
              <span>Settings</span>
            </a>
            <a class="navbar-item">
              <b-icon
                icon="email"
                custom-size="default"
              />
              <span>Messages</span>
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item">
              <b-icon
                icon="logout"
                custom-size="default"
              />
              <span>Log Out</span>
            </a>
          </div>
        </nav-bar-menu> -->
        <nav-bar-menu class="has-divider has-user-avatar">
          <!-- <user-avatar /> -->
          <div class="is-user-name" v-if="user">
            <span>{{ user.nombres }} {{ user.apellidos }} ({{ user.tipo==1?"Administrador":"Secretaria" }})</span>
          </div>

          <div
            slot="dropdown"
            class="navbar-dropdown"
          >
            <!-- <router-link
              to="/profile"
              class="navbar-item"
              exact-active-class="is-active"
            >
              <b-icon
                icon="account"
                custom-size="default"
              />
              <span>Mi perfil</span>
            </router-link> -->
            <!-- <a class="navbar-item">
              <b-icon
                icon="settings"
                custom-size="default"
              />
              <span>Configuración</span>
            </a> -->
            <!-- <hr class="navbar-divider"> -->
            <a class="navbar-item" @click="logout">
              <b-icon
                icon="logout"
                custom-size="default"
              />
              <span>Cerrar Sesión</span>
            </a>
          </div>
        </nav-bar-menu>
       
        <a
          class="navbar-item is-desktop-icon-only"
          title="Log out"
          @click="logout"
        >
          <b-icon
            icon="logout"
            custom-size="default"
          />
          <span>Log out</span>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
import { useStore } from '@/store'
import { useRouter } from '@/router'
import NavBarMenu from '@/components/NavBarMenu.vue'
import UserAvatar from '@/components/UserAvatar.vue'

export default {
  name: 'NavBar',
  components: {
    UserAvatar,
    NavBarMenu
  },
  data() {
    return {
      isMenuActive: false
    }
  },
  computed: {
    isAsideMobileExpanded() {
      return this.$store.state.isAsideMobileExpanded
    },
    asideMobileIcon() {
      return this.isAsideMobileExpanded ? 'backburger' : 'forwardburger'
    },
    isNavBarVisible() {
      return this.$store.state.isNavBarVisible
    },
    userName() {
      return this.$store.state.userName
    },
    menuToggleIcon() {
      return this.isMenuActive ? 'close' : 'dots-vertical'
    },
    user() {
            return this.$store.state.user;
        },
  },
  methods: {
    asideToggleMobile() {
      this.$store.commit('asideMobileStateToggle')
    },
    asideDesktopOnlyToggle() {
      this.$store.dispatch('asideDesktopOnlyToggle')
    },
    menuToggle() {
      this.isMenuActive = !this.isMenuActive
    },
    logout() {
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setAuth", false);
      this.$router.push('/login')
    }
  },
  mounted() {
    this.$router.afterEach(() => {
      this.isMenuActive = false
    })
  }
}
</script>

<style>
@media print {
  .no-print, .no-print * {
    display: none !important;
  }
}
</style>