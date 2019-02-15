<template>
    <v-form>

        <v-btn
                color="success"
                @click="startInstance"
                :block="true"
        >
            Start Instance
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
  import { mapState } from 'vuex'

  export default {
    name: 'InstanceLobby',
    components: {},
    data () {
      return {
        headers: [
          {
            text: 'Players',
            sortable: false,
            value: 'name',
            align: 'center',
          },
        ],
      }
    },
    methods: {
      startInstance: function () {
        console.log('start')
      },
    },
    computed: mapState({
      players: state => state.playerList ? state.playerList.map(u => ({name: u})) : [],
    }),
  }
</script>
