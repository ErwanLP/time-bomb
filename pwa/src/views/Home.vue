<template>
    <v-layout>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-img
                        :src="require('../assets/img/cover.jpg')"
                        height="255px"
                ></v-img>

                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">Time Bomb</h3>
                        <div> Ici Moriarty, nous vous informons qu’une bombe est placée dans Big Ben. Oui, la grande
                            horloge qui fait ding dong. Et vous savez quoi ? Bah à minuit tout pile, elle explosera…
                            Vous avez 4 tours… euh… heures, pour désamorcer la bombe. The game is on, Sherlock !
                        </div>
                    </div>
                </v-card-title>
            </v-card>
            <v-card>
                <v-card-actions>
                    <v-btn flat color="orange">Create my own instance</v-btn>
                </v-card-actions>
            </v-card>
            <v-card>
                <v-card-actions>
                    <v-btn flat color="orange">See Liste of instance</v-btn>
                </v-card-actions>
            </v-card>
            <v-card>
                <v-card-actions>
                    <v-btn flat color="orange">Rules</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>

</template>

<script>

  export default {
    components: {},
  }
</script>
