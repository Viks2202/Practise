// try/catch/finally
async function riskyOperation() {
  try {
    const result = await someAsyncThing()
    return result
  } catch (err) {
    console.log("Error:", err.message)
    throw err  // re-throw to let caller handle
  } finally {
    console.log("Always runs")  // cleanup here
  }
}

// Custom Error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = "AppError"
  }
}

// Use it
throw new AppError("User not found", 404)
throw new AppError("Unauthorized", 401)

// Catch specific errors
try {
  await riskyOperation()
} catch (err) {
  if (err.name === "AppError") {
    console.log(`App error: ${err.statusCode} ${err.message}`)
  } else {
    console.log(`Unknown error: ${err.message}`)
  }
}