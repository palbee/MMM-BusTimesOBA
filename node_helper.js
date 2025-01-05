const NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
  start: function () {
    console.log("MMM-BusTimesOBA helper, started...")

    // Set up the local values
    this.base_url = ""
    this.api_key = ""
    this.stops

    this.location = ""
    this.result = null
  },

  async socketNotificationReceived(notification, payload) {
    // if (notification === "EXAMPLE_NOTIFICATION") {}
    if (notification === "GET_RANDOM_TEXT") {
      const amountCharacters = payload.amountCharacters || 10
      const randomText = Array.from({ length: amountCharacters }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join("")
      this.sendSocketNotification("EXAMPLE_NOTIFICATION", { text: randomText })
    }
    if (notification === "CONFIGURATION") {
      const amountCharacters = payload.amountCharacters || 10
      const randomText = Array.from({ length: amountCharacters }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join("")
      this.sendSocketNotification("EXAMPLE_NOTIFICATION", { text: randomText })
    }
  },
})
