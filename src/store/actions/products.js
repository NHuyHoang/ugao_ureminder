import { SAVE_PRODUCTS } from './ActionTypes';

export const saveProducts = (products) => {
    return {
        type: SAVE_PRODUCTS,
        products,
    }

}

export const trySaveProducts = (products) => {
    return dispacth => {
        if (products.length === 0) return;
        let results = [];
        for (let i = 0; i < products.length; i += 2) {
            let resObj = [];
            if (products[i])
                resObj.push(products[i]);
            if (products[i + 1])
                resObj.push(products[i + 1]);
            results.push(resObj);
        }
        dispacth(saveProducts(results))
    }
}