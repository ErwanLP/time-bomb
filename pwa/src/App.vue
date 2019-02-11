<template>
    <v-app id="inspire">
        <v-navigation-drawer
                fixed
                v-model="drawer"
                app
        >
            <v-list dense>
                <v-list-tile @click="">
                    <v-list-tile-action>
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <router-link to="/">Home</router-link>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="">
                    <v-list-tile-action>
                        <v-icon>contact_mail</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <router-link to="/list-instance">List instance</router-link>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Time Bomb</v-toolbar-title>
        </v-toolbar>
        <v-content>
            <router-view></router-view>
        </v-content>
        <v-footer
                height="auto"
                color="indigo"
                absolute="true"
        >
            <v-layout
                    justify-center
                    row
            >
                <v-btn
                        v-for="linkObject in links"
                        :key="linkObject.key"
                        color="white"
                        v-on:click="linkObject.fn"
                        flat
                        round
                >
                    <v-icon v-if="linkObject.icon">{{linkObject.icon}}</v-icon>
                    <span v-if="linkObject.name">{{linkObject.name}}</span>

                </v-btn>
            </v-layout>
        </v-footer>
    </v-app>
</template>
<script>
  export default {
    name: 'App',
    components: {},
    data () {
      return {
        drawer: null,
        links: [
          {icon: 'view_list', key: 'list-instance', fn: () => this.$router.push('/list-instance')},
          {icon: 'home', key: 'home1', fn: () => this.$router.push('/')},
          {icon: 'settings_applications', key: 'home3'},
        ],
      }
    },
  }
</script>
