// Basic Promise
const myPromise = new Promise((resolve, reject) => {
  const success = true
  if (success) {
    resolve("Data fetched!")
  } else {
    reject(new Error("Failed!"))
  }
})

// Use Promise with .then/.catch
myPromise
  .then(data => console.log(data))
  .catch(err => console.log(err.message))

// async/await — cleaner way
async function getData() {
  try {
    const data = await myPromise
    console.log(data)
    return data
  } catch (err) {
    console.log(err.message)
  }
}

// Promise.all — run multiple promises together
async function getMultiple() {
  const [users, products] = await Promise.all([
    User.find(),
    Product.find()
  ])
  return { users, products }
}

// Real backend example
async function createUser(userData) {
  try {
    // these run one after another
    const user = await User.create(userData)
    const token = await generateToken(user._id)
    await sendWelcomeEmail(user.email)
    return { user, token }
  } catch (err) {
    throw new Error(err.message)
  }
}