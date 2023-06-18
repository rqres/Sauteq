import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import IngredientsForm from "./IngredientsForm"

export default function CreateRecipePage() {
  return (
    <Card className="absolute left-1/2 top-1/2 mr-[-50%] w-[380px] -translate-x-1/2 -translate-y-1/2">
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
        <CardDescription>Select ingredients available</CardDescription>
      </CardHeader>
      <CardContent>
        <IngredientsForm />
      </CardContent>
      <CardFooter>
        <Button form="ingredients-form" className="w-full" type="submit">
          <Check className="mr-2 h-4 w-4" /> Generate recipe
        </Button>
      </CardFooter>
    </Card>
  )
}
