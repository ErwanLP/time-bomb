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
                            <router-link to="/about">About</router-link>
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
            <v-container fluid fill-height>
                <v-layout
                        justify-center
                        align-center
                >
                    <v-flex text-xs-center>
                        <router-view></router-view>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <v-footer
                height="auto"
                color="indigo"
        >
            <v-layout
                    justify-center
                    row
            >
                <v-btn
                        v-for="linkObject in links"
                        :key="linkObject.key"
                        color="white"
                        flat
                        round
                >
                    {{linkObject.name}}
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
          {name: 'Title 1', key: '/home'},
          {name: 'Title 2', key: '/home2'},
          {name: 'Title 3', key: '/home3'},
        ],
      }
    },
  }
</script>
