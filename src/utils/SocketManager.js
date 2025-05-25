import { io } from "socket.io-client"

class SocketManager {
  constructor(baseURL, maxReconnectAttempts = 5, reconnectDelay = 2000) {
    this.baseURL = baseURL
    this.maxReconnectAttempts = maxReconnectAttempts
    this.reconnectDelay = reconnectDelay
    this.reconnectAttempts = 0
    this.socket = null
    this.listeners = new Map()
    this.gameState = null
    this.isReconnecting = false
    this.lastGameId = null
  }

  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)

    // If socket exists and we're adding a listener, attach it immediately
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.set(
        event,
        this.listeners.get(event).filter((cb) => cb !== callback),
      )

      // If socket exists, remove the listener
      if (this.socket) {
        this.socket.off(event, callback)
      }
    }
  }

  emit(event, data, options = {}) {
    if (!this.socket) {
      console.error("Cannot emit event: Socket not connected")
      return Promise.reject(new Error("Socket not connected"))
    }

    const { retries = 3, retryDelay = 1000, acknowledgement = false } = options
    let attempts = 0

    return new Promise((resolve, reject) => {
      const tryEmit = () => {
        if (attempts >= retries) {
          const error = `Failed to emit ${event} after ${retries} attempts`
          console.error(error)
          reject(new Error(error))
          return
        }

        if (!this.socket.connected) {
          console.log(`Socket not connected, retrying ${event} in ${retryDelay}ms`)
          attempts++
          setTimeout(tryEmit, retryDelay)
          return
        }

        if (acknowledgement) {
          this.socket.emit(event, data, (response) => {
            console.log(`Received acknowledgement for ${event}:`, response)

            // If this is a move event, store the game state
            if (event === "move" && data.fen) {
              this.gameState = data.fen
            }

            resolve(response)
          })
        } else {
          this.socket.emit(event, data)

          // If this is a move event, store the game state
          if (event === "move" && data.fen) {
            this.gameState = data.fen
          }

          resolve(true)
        }
      }

      tryEmit()
    })
  }

  connect(user) {
    if (!user || !user.userId) {
      console.error("Cannot connect socket: Invalid user data")
      return null
    }

    if (this.socket && this.socket.connected) {
      console.log("Socket already connected")
      return this.socket
    }

    // Format URL correctly
    const socketUrl = this.baseURL.startsWith("http") ? this.baseURL : `http://${this.baseURL}`
    console.log("Connecting to socket server at:", socketUrl)

    // Create socket connection with improved options
    this.socket = io(socketUrl, {
      query: {
        user: JSON.stringify(user),
        lastGameId: this.lastGameId,
      },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      timeout: 20000, // Increase connection timeout
      transports: ["websocket", "polling"],
    })

    // Set up basic event handlers with improved logging
    this.socket.on("connect", () => {
      console.log("Socket connected with ID:", this.socket.id)
      this.reconnectAttempts = 0
      this.isReconnecting = false

      // Notify any listeners that we've connected
      if (this.listeners.has("connect")) {
        this.listeners.get("connect").forEach((callback) => callback())
      }
    })

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      this.reconnectAttempts++
      this.isReconnecting = true

      if (this.reconnectAttempts > this.maxReconnectAttempts) {
        console.error("Max reconnect attempts reached, giving up")

        // Notify any listeners of the connection failure
        if (this.listeners.has("connect_error")) {
          this.listeners.get("connect_error").forEach((callback) => callback(error))
        }
      }
    })

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
      this.isReconnecting = true

      // Auto-reconnect for certain disconnect reasons
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, reconnect manually
        this.socket.connect()
      }

      // Notify any listeners that we've disconnected
      if (this.listeners.has("disconnect")) {
        this.listeners.get("disconnect").forEach((callback) => callback(reason))
      }
    })

    this.socket.on("error", (error) => {
      console.error("Socket error:", error)

      // Notify any listeners of the error
      if (this.listeners.has("error")) {
        this.listeners.get("error").forEach((callback) => callback(error))
      }
    })

    // Handle game ID assignment
    this.socket.on("gameAssigned", (gameId) => {
      console.log("Game ID assigned:", gameId)
      this.lastGameId = gameId

      // Notify any listeners of game assignment
      if (this.listeners.has("gameAssigned")) {
        this.listeners.get("gameAssigned").forEach((callback) => callback(gameId))
      }
    })

    // Attach all registered listeners to the socket
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket.on(event, callback)
      })
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Get the current game state
  getGameState() {
    return this.gameState
  }

  // Request the current game state from the server
  requestGameState() {
    if (this.socket && this.socket.connected) {
      this.socket.emit("requestGameState")
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.socket && this.socket.connected
  }

  // Check if socket is reconnecting
  isSocketReconnecting() {
    return this.isReconnecting
  }

  // Set the last game ID for reconnection purposes
  setLastGameId(gameId) {
    this.lastGameId = gameId
  }
}

export default SocketManager

