export const calculateInterval = (data) => {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  let k = Math.log2(data.length) + 1
  const integerPart = Math.floor(k)
  k = integerPart % 2 === 0 ? Math.ceil(k) : integerPart
  const interval = Math.ceil(range / k)
  return interval
}

export const assignRanges = (data, interval) => {
  const ranges = []
  let minAge = Math.min(...data)
  let maxAge = minAge + interval

  while (minAge <= Math.max(...data)) {
    ranges.push({ min: minAge, max: maxAge })
    minAge = maxAge + 1
    maxAge = minAge + interval
  }

  return ranges
}

export const groupDataByRangeAndAlzheimer = (data, ageRanges, typeData) => {
  const groupedData = {}

  ageRanges.forEach(({ min, max }) => {
    const rangeKey = `${min}-${max}`
    groupedData[rangeKey] = {}

    if (typeData === 1) {
      data.forEach(({ alzheimerType, age, realCount }) => {
        if (age >= min && age <= max) {
          if (!groupedData[rangeKey][alzheimerType]) {
            groupedData[rangeKey][alzheimerType] = 0
          }
          groupedData[rangeKey][alzheimerType] += realCount
        }
      })
    } else {
      data.forEach(({ alzheimerType, age, predictionCount }) => {
        if (age >= min && age <= max) {
          if (!groupedData[rangeKey][alzheimerType]) {
            groupedData[rangeKey][alzheimerType] = 0
          }
          groupedData[rangeKey][alzheimerType] += predictionCount
        }
      })
    }
  })

  return groupedData
}
