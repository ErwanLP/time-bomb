<template>
    <v-form>

        <v-btn
                color="success"
                @click="startInstance"
                :block="true"
                :disabled="lockStartGame"
        >
            Start Instance ({{players.length}})
        </v-btn>
        <v-data-table
                :headers="headers"
                :items="players"
                class="elevation-1"
                align="center"
                :hide-actions="true"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
            </template>
        </v-data-table>
    </v-form>

</template>
<script>

  export default {
    name: 'InstanceLobby',
    components: {},
    data() {
      return {
        headers: [
          {
            text: 'Players',
            sortable: false,
            value: 'name',
            align: 'center'
          }
        ]
      };
    },
    beforeMount: function() {
    },
    beforeDestroy: function() {
      this.$socket.emit('game_leave_lobby');
    },
    methods: {
      startInstance: function() {
        this.$socket.emit('game_start');
      }
    },

    computed: {
      players() {
        return this.$store.state.instanceJoined[this.$route.params.id].playerNameList
            ? this.$store.state.instanceJoined[this.$route.params.id].playerNameList.map(u => ({name: u}))
            : [];
      },
      lockStartGame() {
        return !this.$store.state.instanceJoined[this.$route.params.id].canStartGame;
      }
    }
  };
</script>
