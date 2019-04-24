<template>
    <div>
        <v-tabs v-model="tabActive"
                fixed-tabs
                color="transparent"
        >
            <v-tab class="primary--text" ripple>
                <v-icon>person_pin</v-icon>
            </v-tab>
            <v-tab class="primary--text" ripple>
                <v-icon>play_arrow</v-icon>
            </v-tab>

            <v-tab-item
            >
                <v-container
                        fluid
                        grid-list-lg
                >
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card>
                                <v-layout row>
                                    <v-flex xs7>
                                        <v-card-title primary-title>
                                            <div>
                                                <div class="headline">Your information</div>
                                                <div>{{displayRole && role ? role.label : userName}}</div>
                                            </div>
                                        </v-card-title>
                                    </v-flex>
                                    <v-flex xs5>
                                        <v-img @click="toggleDisplayRole"
                                               :src="displayRole && role ? require('../assets/img/' + role.image) : require('../assets/img/back.png')"
                                               height="125px"
                                               contain
                                        ></v-img>
                                    </v-flex>
                                </v-layout>
                                <v-divider light></v-divider>
                                <v-card-actions class="pa-3">
                                    <v-btn
                                            color="info"
                                            @click="toggleDisplayCardAndRole"
                                            :block="true"
                                    >
                                        {{ displayCards ? 'Hide yours cards and your role' :
                                        'Display yours cards and your role'}}
                                    </v-btn>
                                </v-card-actions>
                                <v-divider light></v-divider>
                                <v-card-actions class="pa-3">
                                    <v-layout justify-center row wrap @click="toggleDisplayCard">
                                        <v-flex xs2
                                                v-for="(card, index) in cards" :key="index"
                                        >
                                            <v-img
                                                    :lazy-src="require('../assets/img/back.png')"
                                                    :src="displayCards ? require(`../assets/img/${getImage(card)}`) : require('../assets/img/back.png')"
                                            ></v-img>

                                        </v-flex>
                                    </v-layout>
                                </v-card-actions>
                                <v-divider light></v-divider>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-card-title primary-title>
                                            <div>
                                                <div class="headline"></div>
                                                <div>You can tell the other players your cards</div>
                                                <div>Of course you can lie...</div>
                                            </div>
                                        </v-card-title>
                                    </v-flex>
                                    <!--                                        <v-flex xs5>
                                                                                <v-img
                                                                                        src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                                                                                        height="125px"
                                                                                        contain
                                                                                ></v-img>
                                                                            </v-flex>-->
                                </v-layout>
                                <v-divider light></v-divider>
                                <v-card-actions class="pa-3">
                                    Have the bomb ?
                                    <v-spacer></v-spacer>
                                    <v-list-tile-avatar @click="sendMessage({type : 'bomb', value : false})">
                                        <v-btn flat small color="error">No</v-btn>
                                    </v-list-tile-avatar>
                                    <v-list-tile-avatar @click="sendMessage({type : 'bomb', value : true})">
                                        <v-btn flat small color="primary">Yes</v-btn>
                                    </v-list-tile-avatar>
                                </v-card-actions>
                                <v-divider light></v-divider>
                                <v-card-actions class="pa-3">
                                    Have some defusing cards ?
                                </v-card-actions>
                                <v-card-actions class="pa-3">
                                    <v-layout justify-center row wrap>
                                        <v-flex xs2
                                        >
                                            <v-list-tile-avatar @click="sendMessage({type : 'defusing', value : 0})">
                                                <v-btn flat small color="error">0</v-btn>
                                            </v-list-tile-avatar>

                                        </v-flex>
                                        <v-flex xs2
                                        >
                                            <v-list-tile-avatar @click="sendMessage({type : 'defusing', value : 1})">
                                                <v-btn flat small>1</v-btn>
                                            </v-list-tile-avatar>

                                        </v-flex>
                                        <v-flex xs2
                                        >
                                            <v-list-tile-avatar @click="sendMessage({type : 'defusing', value : 2})">
                                                <v-btn flat small>2</v-btn>
                                            </v-list-tile-avatar>

                                        </v-flex>
                                        <v-flex xs2
                                        >
                                            <v-list-tile-avatar @click="sendMessage({type : 'defusing', value : 3})">
                                                <v-btn flat small>3</v-btn>
                                            </v-list-tile-avatar>

                                        </v-flex>
                                        <v-flex xs2
                                        >
                                            <v-list-tile-avatar @click="sendMessage({type : 'defusing', value : 4})">
                                                <v-btn flat small>4</v-btn>
                                            </v-list-tile-avatar>

                                        </v-flex>
                                        <v-flex xs2
                                        >
                                            <v-list-tile-avatar @click="sendMessage({type : 'defusing', value : 5})">
                                                <v-btn flat small>5</v-btn>
                                            </v-list-tile-avatar>

                                        </v-flex>
                                    </v-layout>

                                </v-card-actions>
                                <v-divider light></v-divider>
                                <v-card-actions class="pa-3">
                                    Your mood, your feeling?
                                </v-card-actions>
                                <v-card-actions class="pa-3">
                                    <v-layout justify-center row wrap>
                                        <v-flex xs3 style="text-align: center; color:rgb(30, 16, 53)"
                                                v-bind:class="[this.selectedMood === 128519 ? 'selected-mood' : '']"
                                                @click="sendMessage({type : 'mood', value : 128519 })">
                                            <span style="font-size:50px">&#128519;</span>
                                        </v-flex>
                                        <v-flex xs3 style="text-align: center; color:rgb(30, 16, 53)"
                                                v-bind:class="[this.selectedMood === 129320 ? 'selected-mood' : '']"
                                                @click="sendMessage({type : 'mood', value : 129320 })">
                                            <span style="font-size:50px">&#129320;</span>
                                        </v-flex>
                                        <v-flex xs3 style="text-align: center; color:rgb(30, 16, 53)"
                                                v-bind:class="[this.selectedMood === 128515 ? 'selected-mood' : '']"
                                                @click="sendMessage({type : 'mood', value : 128515 })">
                                            <span style="font-size:50px">&#128515;</span>
                                        </v-flex>
                                        <v-flex xs3 style="text-align: center; color:rgb(30, 16, 53)"
                                                v-bind:class="[this.selectedMood === 128564 ? 'selected-mood' : '']"
                                                @click="sendMessage({type : 'mood', value : 128564 })">
                                            <span style="font-size:50px">&#128564;</span>
                                        </v-flex>
                                        <v-flex xs3 style="text-align: center; color:rgb(30, 16, 53)"
                                                v-bind:class="[this.selectedMood === 128520 ? 'selected-mood' : '']"
                                                @click="sendMessage({type : 'mood', value : 128520 })">
                                            <span style="font-size:50px">&#128520;</span>
                                        </v-flex>
                                        <v-flex xs3 style="text-align: center; color:rgb(30, 16, 53)"
                                                v-bind:class="[this.selectedMood === 129488 ? 'selected-mood' : '']"
                                                @click="sendMessage({type : 'mood', value : 129488 })">
                                            <span style="font-size:50px">&#129488;</span>
                                        </v-flex>
                                        <v-flex xs3 style="text-align: center; color:rgb(30, 16, 53)"
                                                v-bind:class="[this.selectedMood === 128526 ? 'selected-mood' : '']"
                                                @click="sendMessage({type : 'mood', value : 128526 })">
                                            <span style="font-size:50px">&#128526;</span>
                                        </v-flex>
                                        <v-flex xs3 style="text-align: center; color:rgb(30, 16, 53)"
                                                v-bind:class="[this.selectedMood === 128514 ? 'selected-mood' : '']"
                                                @click="sendMessage({type : 'mood', value : 128514 })">
                                            <span style="font-size:50px">&#128514;</span>
                                        </v-flex>
                                    </v-layout>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-tab-item>
            <v-tab-item>

                <v-container
                        fluid
                        grid-list-lg
                >
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-card-title primary-title>
                                            <div>
                                                <div class="headline">Players information</div>
                                            </div>
                                        </v-card-title>
                                    </v-flex>
                                </v-layout>
                                <v-divider light></v-divider>
                                <v-card-actions>
                                    <v-list>
                                        <v-list-tile v-for="(player) in playersMessages"
                                                     :key="player.userId"
                                                     avatar
                                        >
                                            <v-list-tile-avatar>
                                                <p style="font-size:30px"
                                                   v-if="!player.messages.find(m => m.type === 'mood')">
                                                    &#128578;</p>
                                                <p style="font-size:30px"
                                                   v-else-if="player.messages.find(m => m.type === 'mood').value === 128519 ">
                                                    &#128519;</p>
                                                <p style="font-size:30px"
                                                   v-else-if="player.messages.find(m => m.type === 'mood').value === 129320 ">
                                                    &#129320;</p>
                                                <p style="font-size:30px"
                                                   v-else-if="player.messages.find(m => m.type === 'mood').value === 128515 ">
                                                    &#128515;</p>
                                                <p style="font-size:30px"
                                                   v-else-if="player.messages.find(m => m.type === 'mood').value === 128564 ">
                                                    &#128564;</p>
                                                <p style="font-size:30px"
                                                   v-else-if="player.messages.find(m => m.type === 'mood').value === 129488 ">
                                                    &#129488;</p>
                                                <p style="font-size:30px"
                                                   v-else-if="player.messages.find(m => m.type === 'mood').value === 128520 ">
                                                    &#128520;</p>
                                                <p v-else>{{player.messages.find(m => m.type === 'mood').value}}</p>
                                            </v-list-tile-avatar>

                                            <v-list-tile-content>
                                                <v-list-tile-title v-html="player.userName"></v-list-tile-title>
                                            </v-list-tile-content>

                                            <v-list-tile-action>
                                                <v-chip small>
                                                    <v-avatar
                                                            v-if="player.messages.find(m => m.type === 'defusing') && player.messages.find(m => m.type === 'defusing').value !== undefined"
                                                            v-bind:class="[player.messages.find(m => m.type === 'defusing').value > 0 ? 'teal' : 'primary']"
                                                    >
                                                        {{player.messages.find(m => m.type === 'defusing') ?
                                                        player.messages.find(m => m.type === 'defusing').value : ''}}
                                                    </v-avatar>
                                                    <v-icon
                                                    >
                                                        alarm
                                                    </v-icon>
                                                </v-chip>
                                            </v-list-tile-action>
                                            <v-list-tile-action>
                                                <v-chip small>
                                                    <v-avatar
                                                            v-if="player.messages.find(m => m.type === 'bomb') && player.messages.find(m => m.type === 'bomb') !== undefined"
                                                            v-bind:class="[player.messages.find(m => m.type === 'bomb') && player.messages.find(m => m.type === 'bomb').value ? 'red' : 'teal']"
                                                    >
                                                        {{player.messages.find(m => m.type === 'bomb') &&
                                                        player.messages.find(m => m.type === 'bomb').value ? '!' : ''}}
                                                    </v-avatar>
                                                    <v-icon
                                                    >
                                                        whatshot
                                                    </v-icon>
                                                </v-chip>
                                            </v-list-tile-action>
                                        </v-list-tile>
                                    </v-list>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>


                <v-container
                        fluid
                        grid-list-lg
                        v-show="myTurn"
                >
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card style="border: 3px solid #2196f3">
                                <v-layout row>
                                    <v-flex xs7>
                                        <v-card-title primary-title>
                                            <div>
                                                <div class="headline">Your turn !</div>
                                                <div>Select a player</div>
                                                <div>then select a card</div>
                                            </div>
                                        </v-card-title>
                                    </v-flex>
                                    <v-flex xs5>
                                        <v-img
                                                :src="require(`../assets/img/pince.png`)"
                                                height="125px"
                                                contain
                                        ></v-img>
                                    </v-flex>
                                </v-layout>
                                <v-divider light></v-divider>
                                <v-card-actions class="pa-3">
                                    <v-layout wrap>
                                        <v-flex v-for="(player, index) in players" :key="index" xs6>
                                            <v-chip v-on:click="selectPlayer(player)">
                                                <v-avatar
                                                        v-bind:class="[selectedPlayer && selectedPlayer.user && player && player.user &&  selectedPlayer.user.uuid === player.user.uuid ? 'teal' : 'primary']"
                                                >
                                                    {{player.cardsLength}}
                                                </v-avatar>
                                                {{player.user.name}}
                                            </v-chip>
                                        </v-flex>
                                    </v-layout>
                                </v-card-actions>
                                <v-divider light v-show="selectedPlayer && selectedPlayer.user"></v-divider>
                                <v-card-actions class="pa-3" v-show="selectedPlayer && selectedPlayer.user">
                                    <v-layout justify-center row wrap>
                                        <v-flex v-for="(i, index) in selectedPlayer.cardsLength" :key="index" xs2>
                                            <v-img
                                                    :lazy-src="require('../assets/img/back.png')"
                                                    :src="require('../assets/img/back.png')"
                                                    v-on:click="selectCard(index)"
                                                    class="grey lighten-2"

                                            ></v-img>
                                        </v-flex>
                                    </v-layout>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>

                <v-container
                        fluid
                        grid-list-lg
                >
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-card>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-card-title primary-title>
                                            <div>
                                                <div class="headline">Game information</div>
                                                <div>ROUND {{roundNumber}}</div>
                                                <div>Waiting for {{currentPlayer}} ...</div>
                                            </div>
                                        </v-card-title>
                                    </v-flex>
                                    <!--                                        <v-flex xs5>
                                                                                <v-img
                                                                                        src="https://cdn.vuetifyjs.com/images/cards/halcyon.png"
                                                                                        height="125px"
                                                                                        contain
                                                                                ></v-img>
                                                                            </v-flex>-->
                                </v-layout>
                                <v-divider light></v-divider>
                                <v-card-actions class="pa-3">
                                    Number of defusing found
                                    <v-spacer></v-spacer>
                                    <v-icon
                                            v-for="i in numberOfDefuseToFind" :key="i"
                                            v-bind:class="{ 'defusing-found': i <= numberOfDefuseFound,
                                                 'un-defusing-found': i > numberOfDefuseFound}"

                                    >alarm
                                    </v-icon>
                                </v-card-actions>
                                <v-divider light></v-divider>
                                <v-card-actions class="pa-3">
                                    Number of card picked
                                    <v-spacer></v-spacer>
                                    <v-icon
                                            v-for="i in numberOfCardsToPickThisRound" :key="i"
                                            v-bind:class="{ 'picked': i <= numberOfCardPickedThisRound ,
                                                'unpicked': i > numberOfCardPickedThisRound}"

                                    >search
                                    </v-icon>
                                </v-card-actions>
                                <v-divider light></v-divider>
                                <v-timeline
                                        align-top
                                        dense
                                >

                                    <v-timeline-item v-for="(log, index) in playLog"
                                                     :color="getColor(log)"
                                                     small :key="index"

                                    >
                                        <v-layout wrap pt-3>
                                            <v-flex @click="toggleShortLog">
                                                <div v-if="log.type ==='NEW_ROUND'">
                                                    <strong>Round {{log.roundNumber}}</strong>
                                                </div>
                                                <div v-else-if="log.type ==='NEW_PICK'">
                                                    {{log.userFromName}} has taken card {{log.card.label}} from
                                                    {{log.userToName}}
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </v-timeline-item>

                                </v-timeline>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-tab-item>
        </v-tabs>
        <v-dialog
                v-model="dialogEndGame"
                max-width="290"
        >
            <v-card v-if="endGame">
                <v-card-title class="headline">{{endGame.teamWin}} Win !</v-card-title>

                <v-card-text>
                    <div class="text-xs-center">
                        <span> {{endGame.cause}}</span>
                    </div>
                    <br/>
                    <strong>Sherlock : </strong> {{endGame.sherlock ? endGame.sherlock.reduce((acc, val) => acc + val +
                    ' ') : ''}}
                    <br/>
                    <strong>Moriarty : </strong> {{endGame.moriarty ? endGame.moriarty.reduce((acc, val) => acc + val +
                    ' ') : ''}}
                </v-card-text>

                <v-card-actions>
                    <v-btn
                            flat="flat"
                            @click="backHome"
                    >
                        Back Home
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
                v-model="dialogPause"
                hide-overlay
                persistent
                width="300"
        >
            <v-card
                    color="primary"
                    dark
            >
                <v-card-text>
                    {{dialogPauseMsg}}
                    <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
                v-model="dialogPickCard" width="150"
        >
            <v-img
                    :lazy-src="require('../assets/img/back.png')"
                    :src="dialogPickCardType ? require(`../assets/img/${getImage(dialogPickCardType)}`) : require('../assets/img/back.png')"
            ></v-img>
        </v-dialog>
    </div>

</template>
<script>

  export default {
    name: 'InstanceLobby',
    components: {},
    data() {
      return {
        selectedMood: null,
        displayRole: false,
        dialog: true,
        tabActive: 0,
        displayCards: false,
        shortLog: true,
        readonly: true,
        selectedPlayer: {cardsLength: 0}
      };
    },
    beforeMount: function() {

    },
    beforeDestroy: function() {
      this.$socket.emit('game_leave');
    },
    methods: {
      toggleDisplayCardAndRole: function() {
        if (this.displayCards) {
          this.displayCards = false;
          this.displayRole = false;
        } else {
          this.displayCards = true;
          this.displayRole = true;
        }

      },
      toggleDisplayCard: function() {
        this.displayCards = !this.displayCards;
      },
      toggleDisplayRole: function() {
        this.displayRole = !this.displayRole;
      },
      toggleShortLog: function() {
        this.shortLog = !this.shortLog;
      },
      backHome: function() {
        this.$router.push('/');
      },
      getImage: function(card) {
        if (card) {
          if (card.type === 'SECURE_CABLE') {
            return 'secure_cable.png';
          } else if (card.type === 'DEFUSING_CABLE') {
            return 'defusing_cable.png';
          } else if (card.type === 'BOMB') {
            return 'bomb.png';
          } else {
            return 'back.png';
          }
        } else {
          return 'back.png';
        }
      },
      getColor: function(log) {
        if (log) {
          if (log.type === 'NEW_PICK') {
            if (log.card.type === 'SECURE_CABLE') {
              return 'grey';
            } else if (log.card.type === 'DEFUSING_CABLE') {
              return 'green';
            } else if (log.card.type === 'BOMB') {
              return 'red';
            } else {
              throw JSON.stringify(log);
            }
          } else if (log.type === 'NEW_ROUND') {
            return '#dbab79';
          } else {
            throw JSON.stringify(log);
          }

        } else {
          throw JSON.stringify(log);
        }
      },
      selectPlayer: function(player) {
        this.selectedPlayer = player;
      },
      selectCard: function(index) {
        this.$socket.emit('game_pick_card', this.selectedPlayer.user.uuid,
            index);
        this.$store.commit('myTurn', {
          gameId: this.$route.params.id,
          b: false,
          players: []
        });
        this.selectedPlayer = {cardsLength: 0};
      },
      sendMessage: function(message) {
        if (message.type === 'mood') {
          this.selectedMood = message.value;
        }
        this.$socket.emit('game_user_message', JSON.stringify(message));
      }
    }, computed: {
      userName() {
        return this.$store.state.user.name;
      },
      role() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].role
            : null;
      },
      dialogEndGame() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].dialogEndGame
            : false;
      },
      dialogPauseMsg() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].dialogPauseMsg
            : false;
      },
      dialogPickCard: {
        // accesseur
        get: function() {
          return this.$store.state.instanceJoined[this.$route.params.id]
              ? this.$store.state.instanceJoined[this.$route.params.id].dialogPickCard
              : false;
        },
        // mutateur
        set: function(newValue) {
          if (this.$store.state.instanceJoined[this.$route.params.id]) {
            this.$store.commit('editDialogPickCard', {
              gameId: this.$route.params.id,
              value: newValue
            });
          }
        }
      },
      dialogPickCardType() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].dialogPickCardType
            : false;
      },
      dialogPause() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].dialogPause
            : false;
      },
      cards() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].cards
            : [];
      },
      playLog() {
        if (this.shortLog === false) {
          return this.$store.state.instanceJoined[this.$route.params.id]
              ? this.$store.state.instanceJoined[this.$route.params.id].playLog
              : [];
        } else {
          return this.$store.state.instanceJoined[this.$route.params.id]
              ? this.$store.state.instanceJoined[this.$route.params.id].playLog.filter((v, i) => i < 3)
              : [];
        }

      },
      roundNumber() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].roundNumber
            : null;
      },
      numberOfDefuseFound() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].numberOfDefuseFound
            : null;
      },
      numberOfDefuseToFind() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].numberOfDefuseToFind
            : null;
      },
      numberOfCardPickedThisRound() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].numberOfCardPickedThisRound
            : null;
      },
      numberOfCardsToPickThisRound() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].numberOfCardsToPickThisRound
            : null;
      },
      currentPlayer() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].currentPlayer
            : null;
      },
      myTurn() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].myTurn
            : false;
      },
      endGame() {
        return this.$store.state.instanceJoined[this.$route.params.id]
            ? this.$store.state.instanceJoined[this.$route.params.id].endGame
            : false;
      },
      players() {
        return (this.$store.state.instanceJoined[this.$route.params.id] &&
            this.$store.state.instanceJoined[this.$route.params.id].players)
            ? this.$store.state.instanceJoined[this.$route.params.id].players.filter(u => !u.isCurrentPlayer)
            : [];
      },
      playersMessages() {
        if (this.$store.state.instanceJoined[this.$route.params.id] &&
            this.$store.state.instanceJoined[this.$route.params.id].playerMessages) {
          let resumeByPlayer = [];
          this.$store.state.instanceJoined[this.$route.params.id].playerMessages.forEach(message => {
            let p = resumeByPlayer.find(r => r.userId === message.userId);
            if (p) {
              p.messages.push(message);
            } else {
              resumeByPlayer.push({
                userId: message.userId,
                userName: message.userName,
                messages: [message]
              });
            }
          });
          return resumeByPlayer;
        } else {
          return [];
        }

      }
    }
  };
</script>
<style>
    .un-defusing-found {
        color: #D4D4E5 !important;
    }

    .defusing-found {
        color: #a5d6a7 !important;
    }

    .picked {
        color: rgba(0, 0, 0, 0.54);
    }

    .unpicked {
        color: #D4D4E5 !important;
    }

    .selected-mood {
        background-color: #efeded;
        border-radius: 50%;
    }
</style>
