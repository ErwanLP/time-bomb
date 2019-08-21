<template>
    <v-layout>
        <v-flex>
            <v-list two-line>
                <template v-for="(item) in instances">
                    <v-subheader
                            v-if="item.header"
                            :key="item.header"
                    >
                        {{ item.header }}
                        <v-btn color="primary" flat small v-on:click="updateInstanceList">Refresh</v-btn>
                    </v-subheader>


                    <v-list-tile
                            v-else
                            :key="item.name"
                            avatar
                    >
                        <v-list-tile-avatar>
                            <v-icon>{{item.avatar}}</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="item.name"></v-list-tile-title>
                            <v-list-tile-sub-title>{{item.state}} - {{item.players}}</v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-list-tile-avatar>
                            <v-icon v-on:click="deleteInstance(item.uuid)">delete_forever</v-icon>
                        </v-list-tile-avatar>
                    </v-list-tile>
                </template>
            </v-list>
        </v-flex>
    </v-layout>
</template>
<script>
  import {mapState} from 'vuex';

  export default {
    name: 'AdminListInstance',
    components: {},
    data() {
      return {};
    },
    beforeMount: function() {
      this.$socket.emit('game_list');
    },
    methods: {
      updateInstanceList: function() {
        this.$socket.emit('game_list');
      },
      deleteInstance: function(uuid) {
        this.$socket.emit('game_delete', uuid);
      },
    },
    computed: mapState({
      instances: state => {
        let items = [
          {header: 'List Game'},
        ];
        state.instanceList.forEach((g) => {
          items.push({
            avatar: 'games',
            uuid: g.uuid,
            name: g.name,
            state: g.state,
            players: g.players,
          });
        });
        return items;
      },
    }),
  };
</script>
