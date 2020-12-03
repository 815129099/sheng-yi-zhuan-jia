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
    this.list =
      [
        { text: '新增商品', image: 'add_salse', url: '/product/product/add', disable: false },
        { text: '新增会员', image: 'add_user', url: '/home', disable: false },
        { text: '收账记录', image: 'sales_account', url: '/home', disable: false },
        { text: '支出管理', image: 'a_note', url: '/home', disable: false },

        { text: '商品管理', image: 'sales_management', url: '/product/product/list', disable: false },
        { text: '会员管理', image: 'user_management', url: '/home', disable: false },
        { text: '查询销售', image: 'shop_management', url: '/home', disable: false },
        { text: '商品分类', image: 'analysis', url: '/product/category/list', disable: false },

        { text: '供应商管理', image: 'gongying_more', url: '/home', disable: false },
        { text: '挂单', image: 'guandan_more', url: '/home', disable: false },
        { text: '高级功能', image: 'image_addsales', url: '/home', disable: false },
      ];

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
