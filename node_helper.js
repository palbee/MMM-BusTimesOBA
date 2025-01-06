const NodeHelper = require("node_helper")
const OneBusAway = require("onebusaway-sdk")

module.exports = NodeHelper.create({
  oba: undefined,
  start: function () {
    console.log("MMM-BusTimesOBA helper, started...")

    // Set up the local values
    this.base_url = ""
    this.api_key = ""
    this.stops = []
    this.oba = null
  },

  fetchStopDetails: async function () {
    let result = {}
    for (const stopId of this.stops) {
      try {
        const response = await this.oba.stop.retrieve(stopId)
        result[stopId] = response.data.entry
      } catch (error) {
        console.error(error)
      }
    }
    return result
  },

  fetchArrivalDetails: async function () {
    let result = {}
    const query = {
      minutesBefore: 5, // include vehicles having arrived or departed in the previous n minutes (default=5)
      minutesAfter: 60, // include vehicles arriving or departing in the next n minutes (default=35)
    }
    for (const stopId of this.stops) {
      try {
        const response = await this.oba.arrivalAndDeparture.list(stopId, query)
        result[stopId] = response.data.entry.arrivalsAndDepartures
      } catch (error) {
        console.error(error)
      }
    }
    return result
  },

  async socketNotificationReceived(notification, payload) {
    // if (notification === "EXAMPLE_NOTIFICATION") {}
    if (notification === "CONFIGURATION") {
      this.api_key = payload.api_key
      this.base_url = payload.base_url
      this.stops = payload.stops
      this.oba = new OneBusAway({ baseURL: this.base_url, apiKey: this.api_key })
      const details = await this.fetchStopDetails()
      this.sendSocketNotification("STOP_DETAILS", { details: details })
    }

    if (notification === "ARRIVAL_AND_DEPARTURE") {
      const details = await this.fetchArrivalDetails()
      this.sendSocketNotification("ARRIVAL_DETAILS", { details: details })
    }
  },
})
