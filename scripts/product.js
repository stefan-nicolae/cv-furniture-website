import { loadProducts } from "./common.js"

const url = new URL(window.location.toLocaleString())
const productName = url.searchParams.get("name")
const productCategory = url.searchParams.get("category")

console.log(productName)
console.log(productCategory)

loadProducts().then(res => {
    console.log(res)    
})

