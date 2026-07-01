// ============================================
// HASHMAP PROBLEMS — Most common in interviews
// Object as hashmap in JavaScript
// ============================================

// Why HashMap: O(1) lookup instead of O(n) array search

// PROBLEM 1: Two Sum (HashMap approach)
// Input: [2,7,11,15], target=9  Output: [0,1]
function twoSum(nums, target) {
  const map = {}  // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]

    if (map[complement] !== undefined) {
      return [map[complement], i]
    }

    map[nums[i]] = i
  }
  return []
}
// How it works:
// i=0: complement=7, map={}, not found, map={2:0}
// i=1: complement=2, map={2:0}, FOUND! return [0,1]

// PROBLEM 2: First non-repeating character
// Input: "leetcode"  Output: 0 (index of 'l')
function firstUniqChar(s) {
  const count = {}
  for (const char of s) count[char] = (count[char] || 0) + 1
  for (let i = 0; i < s.length; i++) {
    if (count[s[i]] === 1) return i
  }
  return -1
}

// PROBLEM 3: Valid anagram
// Input: s="anagram", t="nagaram"  Output: true
function isAnagram(s, t) {
  if (s.length !== t.length) return false
  const count = {}
  for (const char of s) count[char] = (count[char] || 0) + 1
  for (const char of t) {
    if (!count[char]) return false
    count[char]--
  }
  return true
}

// PROBLEM 4: Subarray sum equals k
// Input: [1,1,1], k=2  Output: 2 (count of subarrays)
function subarraySum(nums, k) {
  const map = { 0: 1 }  // prefixSum → count
  let count = 0
  let sum = 0

  for (const num of nums) {
    sum += num
    if (map[sum - k]) count += map[sum - k]
    map[sum] = (map[sum] || 0) + 1
  }
  return count
}

// PROBLEM 5: Longest consecutive sequence
// Input: [100,4,200,1,3,2]  Output: 4 (sequence: 1,2,3,4)
function longestConsecutive(nums) {
  const set = new Set(nums)
  let maxLen = 0

  for (const num of set) {
    // Only start counting from beginning of sequence
    if (!set.has(num - 1)) {
      let current = num
      let len = 1
      while (set.has(current + 1)) {
        current++
        len++
      }
      maxLen = Math.max(maxLen, len)
    }
  }
  return maxLen
}

// PROBLEM 6: Group anagrams
// Input: ["eat","tea","tan","ate","nat","bat"]
// Output: [["eat","tea","ate"],["tan","nat"],["bat"]]
function groupAnagrams(strs) {
  const map = {}
  for (const str of strs) {
    const key = str.split("").sort().join("")
    if (!map[key]) map[key] = []
    map[key].push(str)
  }
  return Object.values(map)
}

// PROBLEM 7: Top K frequent elements
// Input: [1,1,1,2,2,3], k=2  Output: [1,2]
function topKFrequent(nums, k) {
  const count = {}
  for (const n of nums) count[n] = (count[n] || 0) + 1

  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => Number(num))
}