import { Product } from './product';

export const PRODUCTS: Product[] = [
    {
        id: '28341992-6bf2-fa3f-9dbc-16cb65052367',
        name: '战神笔记本',
        categoryId: 6,
        categoryName: '笔记本',
        category: {
            id: 6,
            name: '笔记本',
            children: [
                {
                    id: 61,
                    name: '笔记本',
                    children: []
                }
            ]
        },
        barcode: '2434123131123',
        images: [],
        price: 6000,
        purchasePrice: 1,
        repertory: 20,
        specification: '笔记本',
        remark: '笔记本'
    },
    {
        id: '77c6d17d-28a1-70d2-7a1a-1133f5c881de',
        name: '华为笔记本',
        categoryId: 61,
        categoryName: '笔记本',
        category: {
            id: 61,
            name: '笔记本',
            children: []
        },
        barcode: '',
        images: [],
        price: 5888,
        purchasePrice: 5666,
        repertory: 22,
        specification: '笔记本',
        remark: '笔记本'
    }
];