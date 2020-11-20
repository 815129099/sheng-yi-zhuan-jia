import { Injectable } from '@angular/core';
import { AjaxResult } from 'src/app/shared/classes/ajax-result';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Category } from './category';
import { CategoryPage } from './category.page';
import { CATEGORIES } from './mock.categories';

export const CATEGORY_KEY = 'Category';
@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    constructor(private localStorageService: LocalStorageService) { }

    async getAll(): Promise<AjaxResult> {
        const categories = this.localStorageService.get(CATEGORY_KEY, null);
        if (categories == null) {
            this.localStorageService.set(CATEGORY_KEY, CATEGORIES);
            return new AjaxResult(true, CATEGORIES);
        }
        return new AjaxResult(true, categories);
    }

    /**
     * 获取大分类的总数
     */
    public getBigCategoryNum(): any {
        const categories = this.localStorageService.get(CATEGORY_KEY, null);
        if (categories == null) {
            this.localStorageService.set(CATEGORY_KEY, CATEGORIES);
            return CATEGORIES.length;
        }
        return categories.length;
    }

    /**
     * 根据大分类名称查询大分类
     * @param name 
     */
    public getBigCategoryByName(name: string): Category {
        let categories = this.localStorageService.get(CATEGORY_KEY, CATEGORIES);
        for (let category of categories) {
            if (category.name == name) {
                return category;
            }
        }
        return null;
    }

    /**
     * 新增分类
     * @param category 
     */
    async insert(category: Category): Promise<AjaxResult> {
        let ajax = await this.isUniqueName(category);
        if (ajax.success == false) {
            return ajax;
        }
        let categories = this.localStorageService.get(CATEGORY_KEY, CATEGORIES);
        /*
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].name == category.name) {
                categories[i] = category;
                this.localStorageService.set(CATEGORY_KEY, categories);
                return new AjaxResult(true, null);
            }
        }*/
        categories.push(category);
        this.localStorageService.set(CATEGORY_KEY, categories);
        return new AjaxResult(true, null);
    }

    /**
     * 判断小分类名称是否已存在
     * @param category 
     */
    async isUniqueName(category: Category): Promise<AjaxResult> {
        let categorys = category.children;
        let names = [];
        for (let c of categorys) {
            names.push(c.name);
        }
        let s = names.join(",") + ",";
        for (let i = 0; i < names.length; i++) {
            if (s.replace(names[i] + ",", "").indexOf(names[i] + ",") > -1) {
                return new AjaxResult(false, null, {
                    message: names[i] + '已存在',
                    details: ''
                });
            }
        }
        return new AjaxResult(true, true);
    }

    /**
     * 添加小分类
     * @param categories 
     */
    async insertSubCategory(categories: Category[], category: Category): Promise<AjaxResult> {
        for (let i = 0; i < categories.length; i++) {
            category.children.push(categories[i]);
        }
        let ajax = await this.isUniqueName(category);
        if (ajax.success == false) {
            return ajax;
        } else {
            return this.update(category);
        }
    }

    /**
     * 修改分类
     * @param category 
     */
    async update(category: Category): Promise<AjaxResult> {
        let categories = this.localStorageService.get(CATEGORY_KEY, CATEGORIES);
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id == category.id) {
                categories[i] = category;
                this.localStorageService.set(CATEGORY_KEY, categories);
                return new AjaxResult(true, null);
            }
        }
        return new AjaxResult(false, null, {
            message: '该大分类不存在',
            details: ''
        });
    }
    /**
     * 根据id获取
     * @param id 
     */
    public get(id: number): Category {
        let categories = this.localStorageService.get(CATEGORY_KEY, CATEGORIES);
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id == id) {
                return categories[i];
            }
        }
        return null;
    }

    async delete(id: number, subId?: number): Promise<AjaxResult> {
        let categories = this.localStorageService.get(CATEGORY_KEY, CATEGORIES);
        for (let i = 0; i < categories.length; i++) {
            //删除小分类
            if (categories[i].id == id && subId != null) {
                for (let j=0;j<categories[i].children.length;j++) {
                    if (categories[i].children[j].id == subId) {
                        categories[i].children.splice(j,1);
                        this.localStorageService.set(CATEGORY_KEY, categories);
                        return new AjaxResult(true, null);
                    }
                }
                new AjaxResult(false, null, {
                    message: '小分类id不存在，删除失败!',
                    details: ''
                });
            } else if(categories[i].id == id) {
                //删除大分类
                categories.splice(i,1);
                this.localStorageService.set(CATEGORY_KEY, categories);
                return new AjaxResult(true, null);
            }
        }
        return new AjaxResult(false, null, {
            message: '大分类id不存在，删除失败!',
            details: ''
        });
    }

    async modify(category:Category):Promise<AjaxResult>{
        let categories = this.localStorageService.get(CATEGORY_KEY, CATEGORIES);
        for (let i = 0; i < categories.length; i++) {
            if(categories[i].id==category.id){
                categories[i] = category;
                this.localStorageService.set(CATEGORY_KEY, categories);
                return new AjaxResult(true, null);
            }
        }
        return new AjaxResult(false, null, {
            message: '大分类'+category.name+'不存在，修改失败!',
            details: ''
        });
    }



}