//1.1 Variables and Data Types
// PRIMITIVE TYPES — stored by VALUE
let name = 'Vikas'        // String
let age = 24              // Number
let isActive = true       // Boolean
let nothing = null        // Null (intentional empty value)
let notDefined            // Undefined (declared but not assigned)
let id = Symbol('id')     // Symbol (unique identifier)
let big = 9007199254740991n // BigInt (very large numbers)

// REFERENCE TYPE — stored by REFERENCE (pointer to memory location)
let user = { name: 'Vikas', age: 24 }  // Object
let skills = ['Node', 'React']           // Array (also an object)
let greet = function() {}                // Function (also an object)

// WHY THIS MATTERS:
let a = 5
let b = a
b = 10
console.log(a) // 5 — primitive, copied by value, a unaffected

let obj1 = { name: 'Vikas' }
let obj2 = obj1
obj2.name = 'Changed'
console.log(obj1.name) // 'Changed' — reference type, both point to same memory

// TYPE CHECKING
typeof 'hello'     // 'string'
typeof 42          // 'number'
typeof true        // 'boolean'
typeof undefined   // 'undefined'
typeof null        // 'object' ← famous JS bug, memorize this
typeof {}          // 'object'
typeof []          // 'object'
typeof function(){} // 'function'
Array.isArray([])   // true ← correct way to check arrays



