// FILE: day1/03-arrays.js

// Imagine this is data coming from MongoDB
const users = [
  { id: 1, name: "Vikas", role: "admin", active: true, score: 85 },
  { id: 2, name: "Priya", role: "user", active: true, score: 92 },
  { id: 3, name: "Rahul", role: "user", active: false, score: 78 },
  { id: 4, name: "Anita", role: "user", active: true, score: 95 },
  { id: 5, name: "Dev", role: "admin", active: false, score: 88 }
]

// MAP — transform each user into API response format
const publicUsers = users.map(u => ({
  id: u.id,
  name: u.name,
  role: u.role
  // password not included — security
}))

// MAP — add computed property
const withGrade = users.map(u => ({
  ...u,  // spread all existing properties
  grade: u.score >= 90 ? "A" : u.score >= 80 ? "B" : "C"
}))

// FILTER — get active users only
const activeUsers = users.filter(u => u.active)

// FILTER + MAP combined (chaining)
const activeUserNames = users
  .filter(u => u.active)
  .map(u => u.name)
// ["Vikas", "Priya", "Anita"]

// REDUCE — calculate stats
const totalScore = users.reduce((sum, u) => sum + u.score, 0)
const avgScore = totalScore / users.length

// REDUCE — group by role (used in admin dashboards)
const groupedByRole = users.reduce((groups, u) => {
  if (!groups[u.role]) groups[u.role] = []
  groups[u.role].push(u)
  return groups
}, {})
// { admin: [...], user: [...] }

// REDUCE — count by role
const countByRole = users.reduce((count, u) => {
  count[u.role] = (count[u.role] || 0) + 1
  return count
}, {})
// { admin: 2, user: 3 }

// FIND — get single user
const admin = users.find(u => u.role === "admin")  // first admin
const userById = users.find(u => u.id === 3)

// FINDINDEX
const idx = users.findIndex(u => u.id === 3)  // 2 (index)

// SOME and EVERY
const hasAdmin = users.some(u => u.role === "admin")    // true
const allActive = users.every(u => u.active)             // false
const allHaveId = users.every(u => u.id !== undefined)   // true

// SORT — always spread first to avoid mutating original
const byScore = [...users].sort((a, b) => b.score - a.score)  // desc
const byName = [...users].sort((a, b) => a.name.localeCompare(b.name))

// FLAT and FLATMAP
const nested = [[1, 2], [3, 4], [5, 6]]
nested.flat()  // [1, 2, 3, 4, 5, 6]

const sentences = ["Hello World", "Foo Bar"]
sentences.flatMap(s => s.split(" "))
// ["Hello", "World", "Foo", "Bar"]

// ARRAY FROM OBJECT
const obj = { a: 1, b: 2, c: 3 }
Object.entries(obj).map(([key, val]) => `${key}=${val}`)
// ["a=1", "b=2", "c=3"]

// REMOVE DUPLICATES (Set)
const nums = [1, 2, 2, 3, 3, 4]
const unique = [...new Set(nums)]  // [1, 2, 3, 4]