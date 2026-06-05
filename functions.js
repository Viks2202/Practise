// FILE: day1/02-functions.js

// TYPE 1: Function Declaration (hoisted)
console.log(add(2, 3))  // 5 — works before declaration!
function add(a, b) {
  return a + b
}

// TYPE 2: Function Expression (not hoisted)
// console.log(sub(5, 3))  // ERROR
const sub = function(a, b) {
  return a - b
}

// TYPE 3: Arrow Function
const mul = (a, b) => a * b          // implicit return
const square = n => n * n             // one param, no parens needed
const greet = () => "Hello!"          // no params
const getUser = () => ({ name: "V" }) // returning object needs parens

// DEFAULT PARAMETERS
function createUser(name, role = "user", active = true) {
  return { name, role, active }
}
createUser("Vikas")            // { name: "Vikas", role: "user", active: true }
createUser("Admin", "admin")   // { name: "Admin", role: "admin", active: true }

// REST PARAMETERS — collect args into array
function sum(first, second, ...rest) {
  console.log(first)   // first arg
  console.log(second)  // second arg
  console.log(rest)    // all remaining as array
  return [first, second, ...rest].reduce((t, n) => t + n, 0)
}
sum(1, 2, 3, 4, 5)  // first=1, second=2, rest=[3,4,5]

// HIGHER ORDER FUNCTIONS — functions that take/return functions
// This is used EVERYWHERE in JavaScript
function applyOperation(a, b, operation) {
  return operation(a, b)
}
applyOperation(5, 3, add)      // 8
applyOperation(5, 3, sub)      // 2
applyOperation(5, 3, mul)      // 15

// CLOSURE — inner function remembers outer scope
// Used in: event handlers, async code, module pattern
function makeCounter(startFrom = 0) {
  let count = startFrom  // this stays alive in memory

  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = startFrom },
    value: () => count
  }
}
const counter = makeCounter(10)
counter.increment()  // 11
counter.increment()  // 12
counter.decrement()  // 11
counter.value()      // 11
counter.reset()
counter.value()      // 10

// IIFE — Immediately Invoked Function Expression
// Runs immediately, creates private scope
const result = (function() {
  const private = "you can't access me outside"
  return private.toUpperCase()
})()
console.log(result)  // "YOU CAN'T ACCESS ME OUTSIDE"

// 'this' DIFFERENCE — regular vs arrow
const obj = {
  name: "DevMart",

  // Regular function — 'this' = obj (correct)
  regularMethod: function() {
    return this.name  // "DevMart"
  },

  // Arrow function — 'this' = outer scope (wrong for methods)
  arrowMethod: () => {
    return this.name  // undefined (this = global/window)
  },

  // Common mistake in async code
  fetchData: function() {
    // Regular function would break here:
    // setTimeout(function() { this.name }, 1000)  // this is wrong

    // Arrow function fixes it:
    setTimeout(() => {
      console.log(this.name)  // "DevMart" — arrow inherits 'this'
    }, 1000)
  }
}