<template>
    <v-container fill-height ma-0 pa-0>
        <v-layout>
            <v-flex>
                <v-card height="100%">
                    <v-img
                            :src="require('../assets/img/cover.jpeg')"
                            width="100%"
                    ></v-img>

                    <v-card-title primary-title>
                        <div>
                            <span class="grey--text">
                                 Ici Moriarty, nous vous informons qu’une bombe est placée dans Big Ben. Oui, la grande
                        horloge qui fait ding dong. Et vous savez quoi ? Bah à minuit tout pile, elle explosera…
                        Vous avez 4 tours… euh… heures, pour désamorcer la bombe. The game is on, Sherlock !

                            </span>
                        </div>
                    </v-card-title>
                    <v-card-actions class="justify-center">
                        <v-btn color="success" :to="{name: 'listInstance'}">Play</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

  export default {
    components: {}
  };
</script>
