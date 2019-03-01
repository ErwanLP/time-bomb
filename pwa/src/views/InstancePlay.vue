<template>
    <v-form>
        <v-alert
                :value="endGameMsg !== null"
                type="info"
        >
            {{endGameMsg}}
            <br/>
            <strong v-on:click="backHome">Click here to return home</strong>

        </v-alert>
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
                                v-for="i in cards.length" :key="i" d-flex
                        >
                            <v-card flat tile class="d-flex">
                                <v-img
                                        :lazy-src="require('../assets/img/back.png')"
                                        :src="displayCards ? require(`../assets/img/${getImage(cards[i-1])}`) : require('../assets/img/back.png')"
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
                    <strong>Defusing Found :</strong>
                    <v-rating
                            v-model="numberOfDefuseFound"
                            :length="numberOfDefuseToFind"
                            empty-icon="alarm_on"
                            full-icon="alarm"
                            :readonly="readonly"
                            color="green lighten-3"
                            background-color="grey lighten-1"
                    ></v-rating>
                </div>
                <div class="text-xs-center">
                    <strong>Round :</strong>
                    <v-rating
                            v-model="roundNumber"
                            length="4"
                            empty-icon="label_important"
                            full-icon="label_important"
                            :readonly="readonly"
                            color="green lighten-3"
                            background-color="grey lighten-1"
                    ></v-rating>
                </div>
                <div class="text-xs-center" v-if="numberOfCardsToPickThisRound">
                    <strong>Card picked :</strong>
                    <v-rating
                            v-model="numberOfCardPickedThisRound"
                            :length="numberOfCardsToPickThisRound"
                            empty-icon="label_important"
                            full-icon="label_important"
                            :readonly="readonly"
                            color="green lighten-3"
                            background-color="grey lighten-1"
                    ></v-rating>
                </div>
                <div class="text-xs-center">
                    <strong>Wainting for {{currentPlayer}} ...</strong>
                </div>

            </v-card>
            <v-card v-show="myTurn">
                <v-subheader>Your turn ! please select players</v-subheader>

                <v-expansion-panel popout>
                    <v-expansion-panel-content
                            v-for="(player, i) in players"
                            :key="i"
                            hide-actions
                    >
                        <v-layout
                                slot="header"
                                align-center
                                row
                                spacer
                        >
                            <v-flex xs3>
                                <v-avatar
                                        slot="activator"
                                        size="36px"
                                >
                                    <v-icon
                                    >person
                                    </v-icon>
                                </v-avatar>
                            </v-flex>

                            <v-flex xs9 v-on:click="selectPlayer(player)">
                                <strong v-html="player.name"></strong>
                                <span
                                        class="grey--text"
                                >
                &nbsp;({{ player.cardsLength }})
              </span>
                            </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-container grid-list-sm fluid>
                                <v-layout row wrap>
                                    <v-flex v-for="i in selectedPlayer.cardsLength" :key="i" d-flex
                                    >
                                        <v-card flat tile class="d-flex">
                                            <v-img
                                                    :lazy-src="require('../assets/img/back.png')"
                                                    :src="require('../assets/img/back.png')"
                                                    v-on:click="selectCard(i-1)"
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
                        </v-card-text>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-card>
            <v-card v-if="playLog.length !== 0">
                <v-timeline
                        align-top
                        dense
                >

                    <v-timeline-item v-for="i in playLog.length"
                                     :color="getColor(playLog[i-1].card)"
                                     small :key="i"
                    >
                        <v-layout wrap pt-3>
                            <v-flex>
                                {{playLog[i-1].userFromName}} has taken card {{playLog[i-1].card}} from
                                {{playLog[i-1].userToName}}
                            </v-flex>
                        </v-layout>
                    </v-timeline-item>

                </v-timeline>
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
        readonly: true,
        selectedPlayer: {cardsLength: 0},
      };
    },
    methods: {
      toggleDisplay: function() {
        this.displayRole = !this.displayRole;
        this.displayCards = !this.displayCards;
      },
      backHome: function() {
        this.$router.push('/');
      },
      getImage: function(card) {
        if (card) {
          if (card.type === 'Securised') {
            return 'securised.png';
          } else if (card.type === 'Defusing') {
            return 'desusing.png';
          } else if (card.type === 'Bomb') {
            return 'bomb.png';
          } else {
            return 'back.png';
          }
        } else {
          return 'back.png';
        }
      },
      getColor: function(card) {
        if (card) {
          if (card === 'Securised') {
            return 'grey';
          } else if (card === 'Defusing') {
            return 'green';
          } else if (card === 'Bomb') {
            return 'red';
          } else {
            return 'grey';
          }
        } else {
          return 'back.png';
        }
      },
      selectPlayer: function(player) {
        this.selectedPlayer = player;
      },
      selectCard: function(index) {
        this.$socket.emit('game_pick_card', this.selectedPlayer.uuid,
            index);
        this.$store.commit('editMyTurn', false);
        this.selectedPlayer = {cardsLength: 0};
      },
    },
    computed: mapState({
      role: state => state.role || 'ROLE',
      cards: state => state.cards,
      playLog: state => state.playLog,
      numberOfDefuseFound: state => state.numberOfDefuseFound,
      currentPlayer: state => state.currentPlayer,
      numberOfDefuseToFind: state => state.numberOfDefuseToFind,
      roundNumber: state => state.roundNumber,
      numberOfCardsToPickThisRound: state => state.numberOfCardsToPickThisRound,
      numberOfCardPickedThisRound: state => state.numberOfCardPickedThisRound,
      players: state => state.players.filter(u => !u.isCurrentPlayer),
      myTurn: state => state.myTurn,
      endGameMsg: state => state.endGameMsg,
    }),
  };
</script>
