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
                    <template v-for="(item, index) in instances">
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
                                @click="joinInstance(item.id)"
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
  import { mapState } from 'vuex'

  export default {
    name: 'ListInstance',
    components: {},
    data () {
      return {}
    },
    beforeMount: function () {
      console.log('beforeMount')
      this.$socket.emit('game_list')
    },
    methods: {
      createInstance: function () {
        this.$router.push('/create-instance')
      },
      joinInstance: function (id) {
        this.$router.push('/instance/' + id + '/lobby')
      },
    },
    computed: mapState({
      instances: state => {
        let items = [
          {header: 'List Instance'},
        ]
        state.instanceList.forEach((i, idx, array) => {
          items.push({
            avatar: 'games',
            id: i.uuid,
            title: i.name,
            subtitle: 'Alex, Scott, Jennifer',
          })
          if (idx !== array.length - 1) {
            items.push({divider: true, inset: true})
          }
        })
        return items
      },
    }),
  }
</script>
