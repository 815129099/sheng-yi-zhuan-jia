import { Injectable } from '@angular/core';
import { AjaxResult } from 'src/app/shared/classes/ajax-result';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CATEGORIES } from './mock.categories';

export const CATEGORY_KEY = 'Category';
@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    constructor(private localStorageService: LocalStorageService) { }

    async getAll(): Promise<AjaxResult> {
        const categories = this.localStorageService.get(CATEGORY_KEY, CATEGORIES);
        return new AjaxResult(true, categories);
    }
}