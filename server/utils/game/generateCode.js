function generateCode() {

  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  let code = ""

  for (
    let i = 0;
    i < 4;
    i++
  ) {

    code += letters[
      Math.floor(
        Math.random() *
        letters.length
      )
    ]
  }

  return code
}

module.exports =
  generateCode