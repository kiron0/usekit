export const generateLoremIpsum = (minWords = 10, maxWords = 30) => {
  const loremWords = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "ut",
    "enim",
    "ad",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "aliquip",
    "ex",
    "ea",
    "commodo",
    "consequat",
    "duis",
    "aute",
    "irure",
    "dolor",
    "in",
    "reprehenderit",
    "in",
    "voluptate",
    "velit",
    "esse",
    "cillum",
    "dolore",
    "eu",
    "fugiat",
    "nulla",
    "pariatur",
    "excepteur",
    "sint",
    "occaecat",
    "cupidatat",
    "non",
    "proident",
    "sunt",
    "in",
    "culpa",
    "qui",
    "officia",
    "deserunt",
    "mollit",
    "anim",
    "id",
    "est",
    "laborum",
  ]

  const wordCount =
    Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords
  let result = ""

  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * loremWords.length)
    result += (i === 0 ? "" : " ") + loremWords[randomIndex]

    // Randomly add punctuation
    if (i === wordCount - 1) {
      result += "."
    } else if (Math.random() < 0.1) {
      result += Math.random() < 0.5 ? "," : "."
    }
  }

  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1)
}
