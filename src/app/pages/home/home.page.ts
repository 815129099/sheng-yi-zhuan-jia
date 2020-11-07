import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  //销售数据
  sales = [];
  titles = ["今天", "7天", "本月"];
  contents = ["比昨日", "比同期", "比同期"];

  //列表数据
  list = [];
  images = ["add_salse.png","add_user.png","sales_account.png","a_note.png",
           "sales_management.png","user_management.png","shop_management.png","analysis.png",
           "gongying_more.png","guandan_more.png","image_addsales.png"];
  texts = ["新增商品", "新增会员", "收银记账", "支用管理", "商品管理", "会员管理", "查询销售", "智能分析", "供应商管理", "挂单", "高级功能"];
  constructor() {
    //初始化数据
    this.getSales();
    //初始化列表
    this.getList();
  }

  ngOnInit() {
  }

  /**
   * 生成数据
   */
  public getSales() {
    for (let i = 0; i < 3; i++) {
      const sale = {
        title: this.titles[i],
        content: this.contents[i],
        previous: this.getRandomNumber(),
        current: this.getRandomNumber(),
      };
      this.sales.push(sale);
    }
  }
  /**
   * 获取功能列表
   */
  public getList() {
    let length = this.texts.length;
    for(let i=0;i<length;i++){
      const list = {
        text:this.texts[i],
        image:"./assets/img/"+this.images[i]
      }
      this.list.push(list);
    }
  }

  /**
   * 获取随机数字
   */
  public getRandomNumber(): number {
    return Math.floor(Math.random() * 1000);
  }

  /**
  *
  *
  * @param {number} current 当前销售数据
  * @param {number} previous 前期销售数据
  * @returns {number} 1 增长 0 持平 -1 减少
  * @memberof HomePage
  */
  minus(current: number, previous: number): number {
    const result = current - previous;
    if (result > 0) {
      return 1;
    } else if (result === 0) {
      return 0;
    } else {
      return -1;
    }
  }


}
