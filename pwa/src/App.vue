<template>
    <v-app id="inspire">
        <v-navigation-drawer
                fixed
                v-model="drawer"
                app
        >
            <v-list dense>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>people</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{userName}}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>cloud</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{host}}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            Params
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Time Bomb</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>refresh</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <router-view></router-view>
        </v-content>
        <v-footer
                height="auto"
                color="indigo"
                fixed
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
  import { store } from "./store";
  export default {
    name: 'App',
    components: {},
    data () {
      return {
        drawer: null,
        links: [
          {icon: 'view_list', key: 'list-instance', fn: () => this.$router.push('/list-instance')},
          {icon: 'home', key: 'home', fn: () => this.$router.push('/')},
          {icon: 'book', key: 'rules', fn: () => this.$router.push('/')},
        ],
      }
    },
    computed: {
      userName () {
        return this.$store.state.user.name
      },
      host () {
        return this.$store.state.host
      },
    },

  }
</script>
