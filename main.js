import moment from "moment";
import { readFileSync } from "fs";

const file = readFileSync("_chat.txt", "utf8") // file should be added to root folder
const rgxD = /\[([0-9]+(\.[0-9]+)+).*[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?\]/i;
const rgxU = /] (.*?): /i

const useRegex = (input, regex) => {
  return regex.test(input);
}

let textByLine = file.split("\n")

const groupName = () => {
  return textByLine[0].match(rgxU)[0].replace("] ", "").replace(": ", "")
}

const wordLister = () => {
  return textByLine.slice(3).reduce((acc, curr) => {
    if (useRegex(curr, rgxU)) {
      const rxg = curr.match(rgxU)[0]
      const beginningIndex = curr.indexOf(rxg) + rxg.length
      const sentence = curr.substring(beginningIndex, curr.length)
      acc.push.apply(acc, sentence.split(" "))
    }
    else {
      acc.push.apply(acc, curr.split(" "))
    }
    return acc
  }, [])
}

const lineList = (textByLine, regex, format, replaceOne, replaceTwo) => {
  return textByLine.slice(3).reduce((acc, curr) => {
    if (useRegex(curr, regex)) {
      let rxg = curr.match(regex)[0]
      rxg = rxg.replace(replaceOne, "").replace(replaceTwo, "")
      const formattedValue = moment(rxg, "DD.MM.YYYY HH.mm.ss")
      const item = formattedValue.format(format)
      acc.push(formattedValue.isValid() ? item : rxg)
    }
    return acc
  }, [])

}

const mapper = (list) => {
  return list.sort().reduce(
    (acc, curr) => {
      let trimmed = curr.trim().replace("\r", "")
      acc[trimmed] = acc.hasOwnProperty(trimmed) ? acc[trimmed] + 1 : 1
      return acc
    }, {})
}

const getTops = (item) => {
  return Object.entries(item).sort((a, b) => b[1] - a[1]).slice(0, 50).sort().reduce(
    (acc, curr) => {
      if (curr[0].length > 0) {
        acc[curr[0]] = curr[1]
      }
      return acc
    }, {})
}

let mainData = {
  groupName: groupName(),
  numberOfMembers: Object.keys(mapper(lineList(textByLine, rgxU, "", "] ", ": "))).length,
  byName: mapper(lineList(textByLine, rgxU, "", "] ", ": ")),
  byHour: mapper(lineList(textByLine, rgxD, "HH", "]", "[")),
  byMonth: mapper(lineList(textByLine, rgxD, "YYYY-MM", "]", "[")),
  byWeek: mapper(lineList(textByLine, rgxD, "dd", "]", "[")),
  byWord: getTops(mapper(wordLister()))
}

console.log(mainData)

