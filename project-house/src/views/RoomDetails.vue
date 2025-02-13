<template>
  <v-container>
    <BackButton class="ml-4 pb-0" />
    <v-container class="text-center pa-0">
      <h1 class="display-1 ma-3">{{ room.name }}</h1>
      <p class="subheading font-weight-regular">
        {{ devices.length + `${devices.length == 1 ? ' device': ' devices'}` }}
        <v-icon>mdi-circle-small</v-icon
        >{{ activeDevices }} active
      </p>
    </v-container>

    <!-- Progress Circle -->
    <v-container v-if="loading" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-container>

    <!-- Devices -->
    <v-list v-else-if="devices.length != 0" class="text-center">
      <DeviceList
        v-for="type in deviceTypes"
        :key="type.id"
        :deviceType="type"
        :room="room"
      />
    </v-list>

    <!-- Empty room -->
    <v-container v-else class="text-center" fill-height>
      <v-col>
        <h1 class="display-1 my-2">Oops, this is empty</h1>
        <p>Click the button on the bottom right to add a device</p>
      </v-col>
    </v-container>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import DeviceList from "@/components/DeviceList";
import BackButton from "../components/BackButton.vue";

export default {
  title() {
    return `${this.slug} - Project House`
  },

  name: "RoomDetails",

  components: {
    DeviceList,
    BackButton,
  },

  props: {
    slug: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
    };
  },

  computed: {
    ...mapGetters("devices", {
      getDevicesFromRoom: "getDevicesByRoom"
    }),
    ...mapGetters("rooms", {
      getRoomByName: "getRoomByName",
      getActiveDevices: "getActiveDevices",
    }),
    room() {
      return this.getRoomByName(this.slug);
    },
    devices() {
      return this.getDevicesFromRoom(this.room)
    },
    activeDevices() {
      return this.getActiveDevices(this.devices)
    },
    ...mapState("deviceTypes", {
      deviceTypes: (state) => state.deviceTypes,
    }),
  },
  methods: {
    ...mapActions("devices", {
      getDevices: "getAll",
    }),
  },
  async created() {
    try {
      this.loading = true;
      await this.getDevices();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  },
};
</script>