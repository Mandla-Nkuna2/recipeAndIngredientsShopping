import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html'
})

export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm
  subscription: Subscription
  editMode = false;
  editItemIndex: number;
  editItem: Ingredient

  constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit() {
      this.shoppingListService.startedEditing.subscribe((index: number) => {
        this.editItemIndex = index;
        this.editMode = true;
        this.editItem = this.shoppingListService.getIngred(index)
        this.slForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount
        })
      });
    }

    onSubmit(form: NgForm) {
      const value = form.value
        const newIngredient = new Ingredient(value.name, value.amount);
        if(this.editMode){
          this.shoppingListService.updateIngred(this.editItemIndex, newIngredient)
        } else {
          this.shoppingListService.addIngredient(newIngredient);
        }
        this.editMode=false
        form.reset()
    }

    onClear() {
      this.slForm.reset()
      this.editMode= false
    }

    onDelete() {
      this.shoppingListService.deleteIng(this.editItemIndex)
      this.onClear();
    }

    ngOnDestroy(){
      //this.subscription.unsubscribe();
    }
}
