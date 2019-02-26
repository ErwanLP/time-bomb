<template>
    <v-form>

        <v-btn
                color="info"
                @click="toggleDisplay"
                :block="true"
        >
            {{ displayRole ? role : 'Click here to display your role'}}
        </v-btn>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-container grid-list-sm fluid>
                    <v-layout row wrap>
                        <v-flex
                                v-for="n in 5" :key="n" d-flex
                        >
                            <v-card flat tile class="d-flex">
                                <v-img
                                        :lazy-src="require('../assets/img/back.png')"
                                        :src="displayCards ? require('../assets/img/bomb.png') : require('../assets/img/back.png')"
                                        aspect-ratio="0.55"
                                        class="grey lighten-2"
                                >
                                    <v-layout
                                            slot="placeholder"
                                            fill-height
                                            align-center
                                            justify-center
                                            ma-0
                                    >
                                    </v-layout>
                                </v-img>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
                <div class="text-xs-center">
                    <v-rating
                            v-model="numberOfDefuseFound"
                            :length="numberOfDefuseToFind"
                            empty-icon="alarm_on"
                            full-icon="alarm"
                            :hover="hover"
                            :readonly="readonly"
                            color="green lighten-3"
                            background-color="grey lighten-1"
                    ></v-rating>
                </div>
            </v-card>
        </v-flex>

    </v-form>

</template>
<script>
  import {mapState} from 'vuex';

  export default {
    name: 'InstanceLobby',
    components: {},
    data() {
      return {
        displayRole: false,
        displayCards: false,
        hover: true,
        readonly: false,
      };
    },
    methods: {
      toggleDisplay: function() {
        this.displayRole = !this.displayRole;
        this.displayCards = !this.displayCards;
      },
    },
    computed: mapState({
      role: state => state.role || 'ROLE',
      cards: state => state.cards,
      numberOfDefuseFound: state => state.numberOfDefuseFound,
      currentPlayer: state => state.currentPlayer,
      numberOfDefuseToFind: state => state.numberOfDefuseToFind,
      roundNumber: state => state.roundNumber,
    }),
  };
</script>
