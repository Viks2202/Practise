// FILE: js/02-functions.js

// ==========================================
// PATTERN 1: Declaration vs Expression vs Arrow
// When to use which in backend
// ==========================================

// Function Declaration — hoisted, use for utility functions
function hashPassword(password) {
  return `hashed_${password}`  // simplified
}

// Function Expression — not hoisted, use when assigning
const generateToken = function(userId) {
  return `token_${userId}`
}

// Arrow Function — short, no own 'this', use in callbacks
const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email
  // password excluded for security
})

// ==========================================
// PATTERN 2: Parameters
// ==========================================

// Default parameters (used in pagination)
function getPaginatedResults(page = 1, limit = 10, sort = "newest") {
  return { page, limit, sort }
}

// Rest parameters (collect multiple args)
function createLog(level, ...messages) {
  // level = "error", messages = ["Something failed", "at line 42"]
  console.log(`[${level.toUpperCase()}]`, messages.join(" "))
}
createLog("error", "Something failed", "at line 42", "in auth.js")

// Destructuring in parameters (most common in backend)
function createUser({ name, email, password, role = "user" }) {
  // Instead of: function createUser(name, email, password, role)
  // This is cleaner when object has many properties
  return { name, email, password, role }
}
createUser({ name: "Vikas", email: "v@g.com", password: "pass" })

// ==========================================
// PATTERN 3: Higher Order Functions
// Functions that take or return functions
// ==========================================

// asyncHandler IS a higher-order function
// Takes a function, returns a function
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// Middleware factory (returns middleware based on config)
const rateLimit = (maxRequests) => {
  const requestCounts = {}

  return (req, res, next) => {
    const ip = req.ip
    requestCounts[ip] = (requestCounts[ip] || 0) + 1

    if (requestCounts[ip] > maxRequests) {
      return res.status(429).json({ error: "Too many requests" })
    }
    next()
  }
}
// Usage: app.use(rateLimit(100))

// authorize IS a higher-order function (from your project!)
const authorize = (...roles) => {
  // roles captured in closure
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("Not authorized"))
    }
    next()
  }
}
// Usage: router.get("/admin", protect, authorize("admin"), handler)

// ==========================================
// PATTERN 4: Closures
// Inner function remembers outer scope
// ==========================================

// Database connection counter (real use case)
function createConnectionPool(maxConnections) {
  let activeConnections = 0  // remembered by closures below

  return {
    connect: function() {
      if (activeConnections >= maxConnections) {
        throw new Error("Connection pool exhausted")
      }
      activeConnections++
      console.log(`Connected. Active: ${activeConnections}`)
    },
    disconnect: function() {
      activeConnections = Math.max(0, activeConnections - 1)
      console.log(`Disconnected. Active: ${activeConnections}`)
    },
    getCount: function() {
      return activeConnections
    }
  }
}

const pool = createConnectionPool(10)
pool.connect()     // Active: 1
pool.connect()     // Active: 2
pool.disconnect()  // Active: 1

// Config manager (closure for private state)
function createConfig(defaultConfig) {
  let config = { ...defaultConfig }  // private — can't access directly

  return {
    get: (key) => config[key],
    set: (key, value) => { config[key] = value },
    getAll: () => ({ ...config })  // spread to prevent direct mutation
  }
}

const config = createConfig({ port: 8000, debug: false })
config.set("debug", true)
config.get("debug")  // true

// ==========================================
// PATTERN 5: 'this' keyword — crucial for backend
// ==========================================

// Regular function: 'this' = who called the function
const server = {
  name: "DevMart",
  port: 8000,

  // Regular function — 'this' = server object
  getInfo: function() {
    return `${this.name} on port ${this.port}`
  },

  // Arrow function — 'this' = outer scope (wrong for methods!)
  getInfoArrow: () => {
    return `${this?.name} on port ${this?.port}`  // undefined
  },

  // Async method — use regular function
  start: async function() {
    console.log(`Starting ${this.name}`)  // works
    // If this was arrow: this.name would be undefined
  }
}

// Mongoose uses 'this' extensively — why you need regular function
// in pre-save hooks:
// userSchema.pre("save", async function() {
//   this.password = await hash(this.password)  // 'this' = document
// })
// Arrow function would break: 'this' would not be the document