<template>
    <v-container>
        <v-layout>
            <v-flex
            >
                <v-text-field
                        v-model="name"
                        label="Your name"
                        required
                ></v-text-field>
            </v-flex>
        </v-layout>
        <v-btn
                color="success"
                @click="saveSettings"
        >
            Validate
        </v-btn>
    </v-container>
</template>
<script>

  import localforage from 'localforage';

  export default {
    name: 'Settings',
    components: {},
    data() {
      return {
        name: '',
        uuid: null,
      };
    },
    beforeMount: function() {
      localforage.getItem('PLAYER_NAME', (err, value) => {
        if (err) {
          throw err;
        } else {
          this.name = value || '';
        }
      });
      localforage.getItem('PLAYER_UUID', (err, value) => {
        if (err) {
          throw err;
        } else {
          this.uuid = value || null;
        }
      });
    },
    methods: {
      saveSettings: function() {
        localforage.setItem('PLAYER_NAME', this.name, (err) => {
          if (err) {
            throw err;
          } else {
            this.$socket.emit('user_create', JSON.stringify({
              name: this.name,
              uuid: this.uuid,
            }));
          }
          this.$router.push('/');
        });
      },
    },
  };
</script>
