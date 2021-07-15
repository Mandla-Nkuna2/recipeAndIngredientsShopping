import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Soup recipe',
      "Grandma's soup recipe",
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfMYsN4NeTjvfxjcL5uru-nqtZhbVOpxoSmQ&usqp=CAU',
      [new Ingredient('beans', 1), new Ingredient('herbs', 2)]
    ),

    new Recipe(
      'Stew recipe',
      "Grandma's stew recipe",
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfMYsN4NeTjvfxjcL5uru-nqtZhbVOpxoSmQ&usqp=CAU',
      [new Ingredient('meat', 1), new Ingredient('veges', 3)]
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }
}
