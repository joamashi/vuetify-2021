<template>
  <v-container fluid>
    
    <v-card
      dark
      color="#26c6da"
      class="mx-auto"
      max-width="400">

      <v-card-title>
        <v-icon large left>mdi-twitter</v-icon>
        <span class="title font-weight-light">Twitter</span>
      </v-card-title>

      <v-card-text class="headline font-weight-bold">
        "Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well."
      </v-card-text>

      <v-card-actions>
        <v-list-item class="grow">
          <v-list-item-avatar color="grey darken-3">
            <v-img
              class="elevation-6"
              alt=""
              src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Evan You</v-list-item-title>
          </v-list-item-content>

          <v-row
            align="center"
            justify="end">
            <v-icon class="mr-1">mdi-heart</v-icon>
            <span class="subheading mr-2">256</span>
            <span class="mr-1">·</span>
            <v-icon class="mr-1">mdi-share-variant</v-icon>
            <span class="subheading">45</span>
          </v-row>
        </v-list-item>
      </v-card-actions>
    </v-card>

    <hr>

    <v-card
      class="mx-auto"
      max-width="400">
      <v-img
        class="white--text align-end"
        height="200px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg">
        <v-card-title>Top 10 Australian beaches</v-card-title>
      </v-img>

      <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>

      <v-card-text class="text--primary">
        <div>Whitehaven Beach</div>
        <div>Whitsunday Island, Whitsunday Islands</div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="orange"
          text>Share</v-btn>
        <v-btn
          color="orange"
          text>Explore</v-btn>
      </v-card-actions>
    </v-card>

    <hr>

    <v-card
      class="mx-auto"
      max-width="344">
      <v-card-text>
        <div>Word of the Day</div>
        <p class="display-1 text--primary">
          be•nev•o•lent
        </p>
        <p>adjective</p>
        <div class="text--primary">
          well meaning and kindly.<br>
          "a benevolent smile"
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="deep-purple accent-4">Learn More</v-btn>
      </v-card-actions>
    </v-card>

    <hr>

    <v-card
      class="mx-auto"
      max-width="344">
      <v-img
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
        height="200px"></v-img>

      <v-card-title>Top western road trips</v-card-title>

      <v-card-subtitle>1,000 miles of wonder</v-card-subtitle>

      <v-card-actions>
        <v-btn
          color="orange lighten-2"
          text>Explore</v-btn>

        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="show = !show">
          <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
          <v-card-text>
            I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>

    <hr>

    <v-card
      class="mx-auto"
      max-width="344">
      <v-card-text>
        <div>Word of the Day</div>
        <p class="display-1 text--primary">
          el·ee·mos·y·nar·y
        </p>
        <p>adjective</p>
        <div class="text--primary">
          relating to or dependent on charity; charitable.<br>
          "an eleemosynary educational institution."
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          text
          color="teal accent-4"
          @click="reveal = true">Learn More</v-btn>
      </v-card-actions>

      <v-expand-transition>
        <v-card
          v-if="reveal"
          class="transition-fast-in-fast-out v-card--reveal"
          style="height: 100%;">
          <v-card-text class="pb-0">
            <p class="display-1 text--primary">
              Origin
            </p>
            <p>late 16th century (as a noun denoting a place where alms were distributed): from medieval Latin eleemosynarius, from late Latin eleemosyna ‘alms’, from Greek eleēmosunē ‘compassion’</p>
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-btn
              text
              color="teal accent-4"
              @click="reveal = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-card>

    <hr>

    <v-card
      class="mx-auto"
      max-width="344"
      outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">
            OVERLINE
          </div>

          <v-list-item-title class="headline mb-1">
            Headline 5
          </v-list-item-title>

          <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar
          tile
          size="80"
          color="grey"></v-list-item-avatar>
      </v-list-item>

      <v-card-actions>
        <v-btn
          outlined
          rounded
          text>Button</v-btn>
      </v-card-actions>
    </v-card>

    <hr>

    <v-card
      :loading="loading"
      class="mx-auto my-12"
      max-width="374">

      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img
        height="250"
        src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>

      <v-card-title>Cafe Badilico</v-card-title>

      <v-card-text>
        <v-row
          align="center"
          class="mx-0">
          <v-rating
            :value="4.5"
            color="amber"
            dense
            half-increments
            readonly
            size="14"></v-rating>

          <div class="grey--text ml-4">
            4.5 (413)
          </div>
        </v-row>

        <div class="my-4 subtitle-1">
          $ • Italian, Cafe
        </div>

        <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Tonight's availability</v-card-title>

      <v-card-text>
        <v-chip-group
          v-model="selection"
          active-class="deep-purple accent-4 white--text"
          column>
          <v-chip>5:30PM</v-chip>
          <v-chip>7:30PM</v-chip>
          <v-chip>8:00PM</v-chip>
          <v-chip>9:00PM</v-chip>
        </v-chip-group>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="deep-purple lighten-2"
          text
          @click="reserve">Reserve</v-btn>
      </v-card-actions>
    </v-card>

  </v-container>
</template>

<script>
export default {
  name: 'Cards',
  data: () => ({ 
    show: false,
    reveal: false,

    loading: false,
    selection: 1,
  }),
  methods: {
    reserve () {
      this.loading = true
      setTimeout(() => (this.loading = false), 2000)
    },
  },
}
</script>

<style lang="scss">
hr {
  border: none;
  padding: 24px 0;
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  // opacity: .5;
  position: absolute;
  width: 100%;
  
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>