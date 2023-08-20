export const fetchBody = (
  title: string,
  ingredients: string[],
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'any'
) =>
  fetch(process.env.NEXT_PUBLIC_DOMAIN_NAME + '/api/openai/body', {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      ingredients: ingredients,
      mealType: mealType,
    }),
    next: { tags: ['openai'] },
  })

export const fetchDescription = (
  title: string,
  ingredients: string[],
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'any'
) =>
  fetch(process.env.NEXT_PUBLIC_DOMAIN_NAME + '/api/openai/description', {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      ingredients: ingredients,
      mealType: mealType,
    }),
    next: { tags: ['openai'] },
  })

export const fetchTitle = (
  recipeIngredients: string[],
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'any'
) =>
  fetch(process.env.NEXT_PUBLIC_DOMAIN_NAME + '/api/openai/title', {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredients: recipeIngredients,
      mealType: mealType,
    }),
    next: { tags: ['openai'] },
  })

export const fetchImage = (title: string) =>
  fetch(process.env.NEXT_PUBLIC_DOMAIN_NAME + '/api/openai/image', {
    method: 'POST',
    headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: title }),
    next: { tags: ['openai'] },
  })
