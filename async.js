// FILE: day1/04-async.js

// LEVEL 1: Basic async/await
async function getUser(id) {
  // await pauses THIS function until the Promise resolves
  // Other code keeps running during the wait
  const user = await findUserById(id)
  return user
}

// LEVEL 2: Error handling
async function getUserSafe(id) {
  try {
    const user = await findUserById(id)
    if (!user) throw new Error("User not found")
    return { success: true, user }
  } catch (err) {
    // Any error in try block lands here
    return { success: false, error: err.message }
  }
}

// LEVEL 3: Multiple async operations

// Sequential — one after another (slower, but ordered)
async function loginUser(email, password) {
  const user = await User.findOne({ email })           // wait 1
  const isMatch = await bcrypt.compare(password, user.password)  // wait 2
  const token = await generateToken(user._id)          // wait 3
  await saveLoginLog(user._id)                         // wait 4
  return { user, token }
  // Total time = sum of all waits
}

// Parallel — all at same time (faster)
async function getDashboard(userId) {
  // Start all at same time, wait for ALL to finish
  const [user, orders, reviews] = await Promise.all([
    User.findById(userId),     // starts immediately
    Order.find({ userId }),    // starts immediately
    Review.find({ userId })    // starts immediately
  ])
  // Total time = max of all waits (not sum)
  return { user, orders, reviews }
}

// Race — first one wins
async function getDataFast(url) {
  const result = await Promise.race([
    fetchFromServer1(url),
    fetchFromServer2(url),
    fetchFromServer3(url)
  ])
  return result  // whichever server responds first
}

// LEVEL 4: async in loops — common mistake

// WRONG — forEach doesn't await
async function sendEmailsWRONG(users) {
  users.forEach(async (user) => {
    await sendEmail(user.email)  // doesn't actually wait
  })
  // Emails sent in parallel, uncontrolled
}

// CORRECT option 1 — for...of (sequential)
async function sendEmailsSEQUENTIAL(users) {
  for (const user of users) {
    await sendEmail(user.email)  // waits for each
    console.log(`Sent to ${user.email}`)
  }
}

// CORRECT option 2 — Promise.all (parallel, controlled)
async function sendEmailsPARALLEL(users) {
  await Promise.all(
    users.map(user => sendEmail(user.email))
  )
}

// LEVEL 5: How asyncHandler works in your project
// This is the exact pattern from DevMart/HireFlow

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

// Without asyncHandler (repetitive):
app.get("/products", async (req, res, next) => {
  try {
    const products = await Product.find()
    res.json({ products })
  } catch (err) {
    next(err)  // pass to error handler
  }
})

// With asyncHandler (clean):
app.get("/products", asyncHandler(async (req, res) => {
  const products = await Product.find()
  res.json({ products })
  // if this throws, asyncHandler's .catch(next) handles it
}))