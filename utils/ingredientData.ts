// Import the JSON object containing ingredient data
import ingredientData from "public/english_ingredients.json"

// Create a hashmap to store the ingredient data
const ingredientMap: { [UsdaId: number]: string } = {}

// Function to parse the JSON object and create the hashmap
function createIngredientMap() {
  for (const ingredient of ingredientData.data) {
    const { UsdaId, name } = ingredient
    ingredientMap[UsdaId] = name
  }
}

// Call the function to create the hashmap
createIngredientMap()

// Export the ingredientMap for use in other files
export default ingredientMap
