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
                        <v-icon>home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <router-link to="/">Home</router-link>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>view_list</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <router-link to="/list-instance">List Game</router-link>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>book</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <router-link to="/rules">Rules</router-link>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-action>
                        <v-icon>settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <router-link to="/settings">Settings</router-link>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if="isAdmin">
                    <v-list-tile-action>
                        <v-icon>people</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <router-link to="/admin/users">Admin User</router-link>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if="isAdmin">
                    <v-list-tile-action>
                        <v-icon>view_list</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <router-link to="/admin/games">Admin Game</router-link>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
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
                        <v-icon>sync</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{version}}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="#1e1035" dark fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Time Bomb</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon>{{ isConnected}}</v-icon>
        </v-toolbar>
        <v-content>
            <v-alert
                    :value="errorDisplay"
                    :type="errorType"
                    transition="scale-transition"
            >
                {{errorMsg}}
            </v-alert>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>
<script>
  export default {
    name: 'App',
    components: {},
    data() {
      return {
        drawer: null,
      };
    },
    methods: {},
    computed: {
      userName() {
        return this.$store.state.user.name;
      },
      errorDisplay() {
        return this.$store.state.error.displayed;
      },
      errorMsg() {
        return this.$store.state.error.msg;
      },
      errorType() {
        return this.$store.state.error.type;
      },
      isAdmin() {
        return this.$store.state.user.isAdmin;
      },
      host() {
        return this.$store.state.host;
      },
      version() {
        return this.$store.state.version;
      },
      isConnected() {
        switch (this.$store.state.isConnected) {
          case'connect':
            return '';
          case'reconnecting':
            return 'sync_problem';
          case'disconnect':
            return 'sync_disabled';
          default:
            return 'sync_disabled';
        }

      },
    },

  };
</script>

