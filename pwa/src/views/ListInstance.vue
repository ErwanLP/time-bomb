<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-list two-line>
                    <template>
                        <v-list-tile
                                avatar
                                @click="createInstance"
                        >
                            <v-list-tile-avatar>
                                <v-icon>add</v-icon>
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>Create new instance</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-divider></v-divider>
                    <template v-for="(item, index) in items">
                        <v-subheader
                                v-if="item.header"
                                :key="item.header"
                        >
                            {{ item.header }}
                        </v-subheader>

                        <v-divider
                                v-else-if="item.divider"
                                :key="index"
                                :inset="item.inset"
                        ></v-divider>

                        <v-list-tile
                                v-else
                                :key="item.title"
                                avatar
                                @click="joinInstance"
                        >
                            <v-list-tile-avatar>
                                <v-icon>{{item.avatar}}</v-icon>
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
  export default {
    name: 'ListInstance',
    components: {},
    data () {
      return {
        items: [
          {header: 'List Instance'},
          {
            avatar: 'games',
            title: 'Instance 1',
            subtitle: 'Alex, Scott, Jennifer',
          },
          {divider: true, inset: true},
          {
            avatar: 'games',
            title: 'Instance 2',
            subtitle: 'Alex, Scott, Jennifer',
          },
          {divider: true, inset: true},
          {
            avatar: 'games',
            title: 'Instance 3',
            subtitle: 'Alex, Scott, Jennifer',
          },
        ],
      }
    },
    methods: {
      createInstance: function () {
        this.$router.push('/create-instance')
      },
      joinInstance: function () {
        this.$router.push('/instance/1/lobby')
      },
    },
  }
</script>
