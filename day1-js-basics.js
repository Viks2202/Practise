// ============================================
// SECTION 1: VARIABLES
// ============================================

// var = old, avoid. let = can change. const = cannot change
const name = "Vikas"     // use const by default
let age = 25             // use let when value changes
// var city = "Delhi"    // never use var

// Template literals — use backticks for string with variables
const message = `My name is ${name} and I am ${age} years old`
console.log(message)

// ============================================
// SECTION 2: FUNCTIONS
// ============================================

// Way 1 — function declaration (hoisted, can call before defining)
function add(a, b) {
  return a + b
}

// Way 2 — function expression (not hoisted)
const subtract = function(a, b) {
  return a - b
}

// Way 3 — arrow function (most used in modern code)
const multiply = (a, b) => a * b

// Default parameters
function greet(name = "User") {
  return `Hello ${name}!`
}
console.log(greet())         // Hello User!
console.log(greet("Vikas"))  // Hello Vikas!

// Rest parameters — collect multiple args into array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0)
}
console.log(sum(1, 2, 3, 4, 5))  // 15

// ============================================
// SECTION 3: ARRAYS — most used in interviews
// ============================================

const products = [
  { name: "iPhone", price: 80000, category: "electronics", inStock: true },
  { name: "Nike Shoes", price: 8000, category: "clothing", inStock: false },
  { name: "MacBook", price: 120000, category: "electronics", inStock: true },
  { name: "Book", price: 500, category: "books", inStock: true }
]

// MAP — transform each item, returns NEW array (original unchanged)
// Think: "give me [something] for each item"
const names = products.map(p => p.name)
console.log(names) // ["iPhone", "Nike Shoes", "MacBook", "Book"]

const withGST = products.map(p => ({
  name: p.name,
  priceWithGST: p.price * 1.18
}))

// FILTER — keep only matching items, returns NEW array
// Think: "give me items WHERE condition is true"
const electronics = products.filter(p => p.category === "electronics")
const inStock = products.filter(p => p.inStock === true)
const affordable = products.filter(p => p.price < 10000)

// FIND — returns FIRST matching item (not array)
// Think: "give me THE item where..."
const iphone = products.find(p => p.name === "iPhone")
const firstCheap = products.find(p => p.price < 1000)

// REDUCE — accumulate into single value
// Think: "combine all items into one result"
const totalValue = products.reduce((sum, p) => sum + p.price, 0)
console.log(totalValue) // 208500

// Group by category
const grouped = products.reduce((groups, p) => {
  const cat = p.category
  if (!groups[cat]) groups[cat] = []
  groups[cat].push(p)
  return groups
}, {})

// SORT — sorts array (always spread first to avoid mutating original)
const byPriceAsc = [...products].sort((a, b) => a.price - b.price)
const byPriceDesc = [...products].sort((a, b) => b.price - a.price)

// SOME — true if AT LEAST ONE matches
const hasExpensive = products.some(p => p.price > 100000)  // true

// EVERY — true if ALL match
const allInStock = products.every(p => p.inStock === true)  // false

// INCLUDES — check if value exists (for simple arrays)
const categories = ["electronics", "clothing", "books"]
console.log(categories.includes("electronics"))  // true

// CHAINING — combine methods
const expensiveElectronicsNames = products
  .filter(p => p.category === "electronics")
  .filter(p => p.price > 50000)
  .map(p => p.name)
// ["iPhone", "MacBook"]

// ============================================
// SECTION 4: OBJECTS
// ============================================

const user = {
  name: "Vikas",
  age: 25,
  role: "admin",
  address: {
    city: "Delhi",
    pincode: "110001"
  }
}

// Destructuring — extract values into variables
const { name: userName, age, role } = user
const { address: { city } } = user  // nested destructuring
const { phone = "N/A" } = user  // default value

// Spread — copy and modify
const updatedUser = { ...user, age: 26 }
const newUser = { ...user, role: "user", createdAt: new Date() }

// Optional chaining — safe access (prevents "cannot read property of undefined")
const cityName = user?.address?.city  // "Delhi"
const phone2 = user?.contact?.phone  // undefined (no error)

// Nullish coalescing — use default if null/undefined
const displayPhone = user.phone ?? "No phone"

// Object methods
const keys = Object.keys(user)    // ["name", "age", "role", "address"]
const values = Object.values(user)
const entries = Object.entries(user)

// Loop through object
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`)
}

// ============================================
// SECTION 5: ASYNC/AWAIT — most important for backend
// ============================================

// Understanding: JavaScript is single-threaded
// Without async: server would freeze waiting for database
// With async: server handles other requests while waiting for DB

// Sync — blocks everything
// const data = fs.readFileSync("file.txt")  // bad for servers

// Async — doesn't block
async function fetchData() {
  // await PAUSES this function only, other code keeps running
  const data = await someSlowOperation()
  return data
}

// async function ALWAYS returns a Promise
async function getNumber() {
  return 42
}
getNumber().then(n => console.log(n))  // 42

// try/catch with async/await
async function getUser(id) {
  try {
    const user = await User.findById(id)  // wait for DB
    if (!user) throw new Error("User not found")
    return user
  } catch (err) {
    console.log("Error:", err.message)
    throw err  // re-throw so caller knows about error
  }
}

// Run multiple async operations
// Sequential (one after another — slower)
async function sequential() {
  const users = await User.find()        // wait 100ms
  const products = await Product.find() // then wait 100ms
  // total: 200ms
}

// Parallel (both at same time — faster)
async function parallel() {
  const [users, products] = await Promise.all([
    User.find(),     // both start at same time
    Product.find()   // both wait together
  ])
  // total: 100ms (max of both)
}

// Common mistake with async in loops
// WRONG — forEach doesn't wait
async function sendEmailsWrong(users) {
  users.forEach(async (user) => {
    await sendEmail(user.email)  // doesn't wait — all start at once
  })
}

// CORRECT — use for...of
async function sendEmailsCorrect(users) {
  for (const user of users) {
    await sendEmail(user.email)  // waits for each one
  }
}

// ALSO CORRECT — use Promise.all for parallel
async function sendEmailsParallel(users) {
  await Promise.all(users.map(user => sendEmail(user.email)))
}