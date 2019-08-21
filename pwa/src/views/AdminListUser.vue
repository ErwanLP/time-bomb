<template>
    <v-layout>
        <v-flex>
            <v-list two-line>
                <template v-for="(item) in users">
                    <v-subheader
                            v-if="item.header"
                            :key="item.header"
                    >
                        {{ item.header }}
                        <v-btn color="primary" flat small v-on:click="updateUserList">Refresh</v-btn>
                    </v-subheader>


                    <v-list-tile
                            v-else
                            :key="item.name"
                            avatar
                    >
                        <v-list-tile-avatar>
                            <v-icon v-on:click="setUserAdmin(item.uuid, !item.isAdmin)">{{item.avatar}}</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="item.name"></v-list-tile-title>
                            <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-list-tile-avatar v-if="item.isAdmin">
                            <v-icon>how_to_reg</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-avatar>
                            <v-icon v-on:click="deleteUser(item.uuid)">delete_forever</v-icon>
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
    name: 'AdminListUser',
    components: {},
    data() {
      return {};
    },
    beforeMount: function() {
      this.$socket.emit('user_list');
    },
    methods: {
      updateUserList: function() {
        this.$socket.emit('user_list');
      },
      deleteUser: function(uuid) {
        this.$socket.emit('user_delete', uuid);
      },
      setUserAdmin: function(uuid, isAdmin) {
        this.$socket.emit('user_set_admin', JSON.stringify({
          uuid: uuid,
          isAdmin: isAdmin,
        }));
      },
    },
    computed: mapState({
      users: state => {
        let items = [
          {header: 'List User'},
        ];
        state.userList.forEach((u) => {
          items.push({
            avatar: 'face',
            uuid: u.uuid,
            name: u.name,
            subtitle: u.connected ? 'Connected' : '',
            isAdmin: u.isAdmin,
          });
        });
        return items;
      },
    }),
  };
</script>
