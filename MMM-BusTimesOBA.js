// import Module from "node:module"

Module.register("MMM-BusTimesOBA", {
  defaults: {
    api_key: "TEST",
    stops: [],
    base_url: "https://api.pugetsound.onebusaway.org/",
  },

  /**
   * Apply the default styles.
   */
  getStyles: function () {
    return ["bustimesoba.css"]
  },

  /**
     * Pseudo-constructor for our module. Initialize stuff here.
     */
  start: function () {
    Log.log("Starting module: " + this.name)
    this.templateContent = this.config.exampleContent
    // Configure fields
    this.arrival_details = null
    this.stop_details = null

    // set timeout for next random text
    this.setConfiguration()
    this.getArrivalAndDeparture()
    setInterval(() => this.getArrivalAndDeparture(), 30000)
  },

  /**
     * Handle notifications received by the node helper.
     * So we can communicate between the node helper and the module.
     *
     * @param {string} notification - The notification identifier.
     * @param {any} payload - The payload data`returned by the node helper.
     */
  socketNotificationReceived: function (notification, payload) {
    if (notification === "STOP_DETAILS") {
      this.stop_details = payload.details
      this.updateDom()
    }
    if (notification === "ARRIVAL_DETAILS") {
      this.arrival_details = payload.details
      this.updateDom()
    }
  },

  /**
     * Render the page we're on.
     */
  getDom: function () {
    const wrapper = document.createElement("div")

    const stopInfo = document.createElement("div")
    if (this.stop_details !== null) {
      const stopData = document.createElement("ul")
      this.config.stops.forEach((s) => {
        const stopRow = document.createElement("li")
        stopRow.innerHTML = `${this.stop_details[s].name} (${this.stop_details[s].direction})`
        stopData.appendChild(stopRow)
        if (this.arrival_details !== null) {
          const schedule = document.createElement("ul")
          for (const arrivalDetail of this.arrival_details[s]) {
            const entry = document.createElement("li")
            const bus = `${arrivalDetail.routeShortName} - ${arrivalDetail.tripHeadsign}`
            let arrivalTime
            if (arrivalDetail.predicted) {
              arrivalTime = `${new Date(arrivalDetail.predictedArrivalTime).toLocaleTimeString()} predicted`
            } else {
              arrivalTime = ` ${new Date(arrivalDetail.scheduledArrivalTime).toLocaleTimeString()} scheduled`
            }
            entry.innerHTML = `${bus} : ${arrivalTime}`
            schedule.appendChild(entry)
          }
          stopData.appendChild(schedule)
        }
      })
      stopInfo.appendChild(stopData)
    }

    wrapper.appendChild(stopInfo)
    return wrapper
  },

  setConfiguration: function () {
    this.sendSocketNotification("CONFIGURATION",
      { api_key: this.config.api_key,
        stops: this.config.stops,
        base_url: this.config.base_url
      })
  },

  getArrivalAndDeparture: function () {
    this.sendSocketNotification("ARRIVAL_AND_DEPARTURE", {})
  },

  /**
   * This is the place to receive notifications from other modules or the system.
   *
   * @param {string} notification The notification ID, it is preferred that it prefixes your module name
   * @param {number} payload the payload type.
   */
  notificationReceived: function (notification, payload) {
    Log.log(`Notification Received: ${notification}, payload: ${payload}`)
    // if (notification === "TEMPLATE_RANDOM_TEXT") {
    //   this.templateContent = `${this.config.exampleContent} ${payload}`
    //   this.updateDom()
    // }
  }
})
