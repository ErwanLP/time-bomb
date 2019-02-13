<template>
    <v-container grid-list-xl>
        <v-layout
                wrap
                justify-space-between
        >
            <v-flex xs12>
                <v-form ref="form">
                    <v-text-field
                            v-model="newInstance.name"
                            label="Name of instance"
                    ></v-text-field>
                </v-form>
            </v-flex>

            <v-flex xs12>
                <v-btn @click="back"> Cancel</v-btn>
                <v-btn color="success" @click="create"> Validate</v-btn>

            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
  export default {
    name: 'CreateInstance',
    components: {},
    data () {
      return {
        newInstance: {
          name: '',
        },
      }
    },
    methods: {
      back: function () {
        this.$router.push('/list-instance')
      },
      create: function () {
        this.$socket.emit('game_create', this.newInstance.name)
      },
    },
  }
</script>
