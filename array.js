// FILE: js/03-arrays-objects.js

// ==========================================
// REAL BACKEND SCENARIO
// These are ACTUAL operations you do in controllers
// ==========================================

// Fake MongoDB data (like what you get from DB)
const usersFromDB = [
  { _id: "1", name: "Vikas", email: "v@g.com", password: "$2b$hash", role: "admin", active: true, score: 85 },
  { _id: "2", name: "Priya", email: "p@g.com", password: "$2b$hash", role: "user", active: true, score: 92 },
  { _id: "3", name: "Rahul", email: "r@g.com", password: "$2b$hash", role: "user", active: false, score: 78 },
  { _id: "4", name: "Dev", email: "d@g.com", password: "$2b$hash", role: "admin", active: true, score: 95 }
]

// ==========================================
// MAP — transform each item
// HOW TO KNOW WHEN TO USE: when you need a NEW array
// with same number of items but transformed
// ==========================================

// Backend use: format API response (hide password)
const publicUsers = usersFromDB.map(user => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
  // password NOT included
}))

// Backend use: add computed property
const usersWithGrade = usersFromDB.map(user => ({
  ...user,  // spread copies all existing properties
  grade: user.score >= 90 ? "A" : user.score >= 80 ? "B" : "C",
  password: undefined  // remove password from spread
}))

// ==========================================
// FILTER — keep matching items
// HOW TO KNOW WHEN TO USE: when you need SUBSET of items
// ==========================================

// Backend use: get active users only
const activeUsers = usersFromDB.filter(u => u.active)

// Backend use: get users by role
const admins = usersFromDB.filter(u => u.role === "admin")

// Chain filter + map (common pattern)
const activeAdminNames = usersFromDB
  .filter(u => u.active && u.role === "admin")
  .map(u => u.name)

// ==========================================
// REDUCE — combine into single value
// HOW TO KNOW WHEN TO USE: when you need ONE result from many
// ==========================================

// Backend use: calculate total
const totalScore = usersFromDB.reduce((sum, u) => sum + u.score, 0)
// starts at 0 (initial value)
// each iteration: sum = previous sum + current score

// Backend use: group by property (used in admin analytics)
const groupedByRole = usersFromDB.reduce((groups, user) => {
  const role = user.role
  if (!groups[role]) groups[role] = []  // create array if first of this role
  groups[role].push(user)
  return groups
}, {})  // start with empty object
// Result: { admin: [...], user: [...] }

// Backend use: count by status (order analytics)
const orders = [
  { status: "pending" }, { status: "delivered" },
  { status: "pending" }, { status: "cancelled" }
]
const orderCounts = orders.reduce((count, order) => {
  count[order.status] = (count[order.status] || 0) + 1
  return count
}, {})
// { pending: 2, delivered: 1, cancelled: 1 }

// ==========================================
// FIND — get first match
// HOW TO KNOW WHEN TO USE: when you need ONE item (like findById)
// ==========================================

const user = usersFromDB.find(u => u._id === "2")  // like findById
const firstAdmin = usersFromDB.find(u => u.role === "admin")

// ==========================================
// SORT — order items
// IMPORTANT: always spread first (sort mutates original!)
// ==========================================

const byScoreDesc = [...usersFromDB].sort((a, b) => b.score - a.score)
const byName = [...usersFromDB].sort((a, b) =>
  a.name.localeCompare(b.name))

// ==========================================
// OBJECTS — deep dive
// ==========================================

// Destructuring (used EVERYWHERE in backend)
const { name, email, role } = user
const { _id: userId, name: userName } = user  // rename while destructuring
const { password, ...safeUser } = user  // remove password with rest

// Spread (used to merge/update)
const updatedUser = { ...user, score: 100 }
const mergedConfig = { ...defaultConfig, ...userConfig }  // userConfig overrides

// Optional chaining (prevents "cannot read of undefined" crashes)
const city = user?.address?.city  // safe — returns undefined if missing
const phone = user?.contacts?.[0]?.number  // safe array access

// Nullish coalescing (default when null/undefined)
const displayName = user.name ?? "Anonymous"
const port = process.env.PORT ?? 8000

// Object methods
const keys = Object.keys(user)      // ["_id", "name", "email", ...]
const values = Object.values(user)  // ["1", "Vikas", "v@g.com", ...]
const entries = Object.entries(user)  // [["_id","1"], ["name","Vikas"], ...]

// Transform object to array (for sorting/filtering)
const sortedByValue = Object.entries(orderCounts)
  .sort(([,a], [,b]) => b - a)
  .map(([key, value]) => ({ status: key, count: value }))

// Deep clone (when you don't want to mutate)
const deepClone = JSON.parse(JSON.stringify(obj))  // works for simple objects
const structuredClone = structuredClone(obj)  // Node 17+ built-in

// Check if key exists
"name" in user        // true
user.hasOwnProperty("name")  // true
user.phone !== undefined  // false (safer)