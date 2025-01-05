// import Module from "node:module"

Module.register("MMM-BusTimesOBA", {

  defaults: {
    api_key: "TEST",
    stops: [],
    exampleContent: ""
  },

  /**
     * Apply the default styles.
     */
  getStyles() {
    return ["bustimesoba.css"]
  },

  /**
     * Pseudo-constructor for our module. Initialize stuff here.
     */
  start() {
    Log.log("Starting module: " + this.name)
    this.templateContent = this.config.exampleContent

    // set timeout for next random text
    setInterval(() => this.addRandomText(), 3000)
  },

  /**
     * Handle notifications received by the node helper.
     * So we can communicate between the node helper and the module.
     *
     * @param {string} notification - The notification identifier.
     * @param {any} payload - The payload data`returned by the node helper.
     */
  socketNotificationReceived: function (notification, payload) {
    if (notification === "EXAMPLE_NOTIFICATION") {
      this.templateContent = `${this.config.exampleContent} ${payload.text}`
      this.updateDom()
    }
  },

  /**
     * Render the page we're on.
     */
  getDom() {
    const wrapper = document.createElement("div")
    wrapper.innerHTML = `<b>Title</b><br />${this.templateContent}`

    return wrapper
  },

  addRandomText() {
    this.sendSocketNotification("GET_RANDOM_TEXT", { amountCharacters: 15 })
  },

  /**
     * This is the place to receive notifications from other modules or the system.
     *
     * @param {string} notification The notification ID, it is preferred that it prefixes your module name
     * @param {number} payload the payload type.
     */
  notificationReceived(notification, payload) {
    if (notification === "TEMPLATE_RANDOM_TEXT") {
      this.templateContent = `${this.config.exampleContent} ${payload}`
      this.updateDom()
    }
  }
})
