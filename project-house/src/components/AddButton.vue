<template>
  <!-- Add new item Menu -->
  <v-menu v-model="menu" top left offset-x offset-y transition="slide-x-transition">

    <!-- Activador del menu (boton +) -->
    <template v-slot:activator="{ on, attrs }">
      <v-btn fab dark color="primary" fixed bottom right class="ma-4" v-bind="attrs" v-on="on">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-list>
      <AddDevice @dialogClosed="menu = false"/>
      <AddRoom @dialogClosed="menu = false"/>
      <v-list-item :to="{ name: 'CreateRoutine' }">
        <v-icon class="mr-4">mdi-timeline-text</v-icon>
        <v-list-item-title>Create Routine</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import AddDevice from './AddDevice.vue'
import AddRoom from './AddRoom.vue'

export default {
  components: { 
    AddDevice, 
    AddRoom, 
  },
  name: "AddButton",

  data() {
    return {
      menu: false,
      
      // menu items
      items: [
        { title: "Add room", opened: false, icon: "mdi-bed", component: 'AddRoom' },
        { title: "Add device", opened: false, icon: "mdi-lightbulb", component: 'AddDevice' },  // mdi-devices
        { title: "Add routine", opened: false, icon: "mdi-timeline-text", component: 'AddRoutine' }, // mdi-text-box
      ],
    }
  }
}
</script>
