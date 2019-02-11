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
                :items="desserts"
                class="elevation-1"
                align="center"
                :pagination.sync="pagination"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
            </template>
        </v-data-table>
    </v-form>

</template>
<script>
  export default {
    name: 'ListInstance',
    components: {},
    data () {
      return {
        pagination: {
          rowsPerPage: -1,
          sortBy: name,
        },
        headers: [
          {
            text: 'Players',
            sortable: false,
            value: 'name',
            align: 'center',
          },
        ],
        desserts: [
          {
            name: 'Frozen Yogurt',

          },
          {
            name: 'Ice cream sandwich',
          },
          {
            name: 'Eclair',
          },
          {
            name: 'Cupcake',
          },
          {
            name: 'Gingerbread',
          },
          {
            name: 'Jelly bean',
          },
        ],
      }
    },
    methods: {
      createInstance: function () {
        this.$router.push('/create-instance')
      },
      startInstance: function () {
        this.$router.push('/create-instance')
      },

    },
  }
</script>
