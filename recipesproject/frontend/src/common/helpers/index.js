export const formatRecipe = ({
  title,
  description,
  hourTime,
  minuteTime,
  secondTime,
  ingredients,
  steps,
}) => {
  const newRecipe = {}

  newRecipe.title = title
  newRecipe.description = description

  let hours = ''
  let minutes = ''
  let seconds = ''

  if (hourTime === '') {
    hours = '0'
  } else if (hourTime >= '24') {
    hours = '23'
  } else {
    hours = hourTime
  }

  if (minuteTime === '') {
    minutes = '0'
  } else {
    minutes = minuteTime
  }

  if (secondTime === '') {
    seconds = '0'
  } else {
    seconds = secondTime
  }

  newRecipe.cooking_time = `${hours}:${minutes}:${seconds}`

  const allIngredients = ingredients.map((ingredient) => {
    return {
      name: ingredient.name,
    }
  })

  newRecipe.ingredients = allIngredients

  const allSteps = steps.map((step) => {
    return {
      description: step.description,
    }
  })

  newRecipe.steps = allSteps

  return newRecipe
}

export const formatCookingTime = (hours, minutes, seconds) => {
  let hourStr = ''
  let minuteStr = ''
  let secondStr = ''

  if (hours > '01') {
    hourStr = `${hours} hrs`
  } else if (hours == '01') {
    hourStr = `${hours} hr`
  }

  if (minutes > '01') {
    minuteStr = `${minutes} mins`
  } else if (minutes == '01') {
    minuteStr = `${minutes} min`
  }

  if (seconds > '01') {
    secondStr = `${seconds} mins`
  } else if (seconds == '01') {
    secondStr = `${seconds} min`
  }

  return {
    hours: hourStr,
    minutes: minuteStr,
    seconds: secondStr,
  }
}
