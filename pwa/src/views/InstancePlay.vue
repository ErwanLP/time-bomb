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
            <v-card>
                <v-subheader>Your turn ! please select players</v-subheader>

                <v-expansion-panel popout>
                    <v-expansion-panel-content
                            v-for="(message, i) in messages"
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
                                    >people
                                    </v-icon>
                                </v-avatar>
                            </v-flex>

                            <v-flex xs9>
                                <strong v-html="message.name"></strong>
                                <span
                                        v-if="message.total"
                                        class="grey--text"
                                >
                &nbsp;({{ message.total }})
              </span>
                            </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <v-card-text v-text="lorem"></v-card-text>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-card>
            <v-card v-if="playLog.length !== 0">
                <v-timeline
                        align-top
                        dense
                >

                    <v-timeline-item v-for="i in playLog.length"
                                     color="black lighten-3"
                                     small
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
        messages: [
          {
            name: 'John Leider',
          },
          {
            name: 'Social',
            total: 3,
          },
          {
            name: 'Promos',
            total: 4,
          },
        ],
        lorem: 'Lorem ipsum dolor sit amet, at aliquam vivendum vel, everti delicatissimi cu eos. Dico iuvaret debitis mel an, et cum zril menandri. Eum in consul legimus accusam. Ea dico abhorreant duo, quo illum minimum incorrupte no, nostro voluptaria sea eu. Suas eligendi ius at, at nemore equidem est. Sed in error hendrerit, in consul constituam cum.',
      };
    },
    methods: {
      toggleDisplay: function() {
        this.displayRole = !this.displayRole;
        this.displayCards = !this.displayCards;
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
          console.log(card);
          return 'back.png';
        }
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
    }),
  };
</script>
