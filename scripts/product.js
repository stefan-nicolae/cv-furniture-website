import { activateSlider, loadProducts } from "./common.js"

const url = new URL(window.location.toLocaleString())
const productName = url.searchParams.get("name").replaceAll("_", " ")
const productCategory = url.searchParams.get("category")
const scrollDiv = document.querySelector("main .scroll-div")
const aside = document.querySelector("main aside")
const tracker = document.querySelector("section .tracker")


let PRODUCTS
loadProducts().then(res => {
    PRODUCTS = res
    PRODUCTS[productCategory].forEach(product => {
        if(product.name === productName) {
            document.title = `${productName} - Floriana Furniture`
            product.images.forEach(image => {
                const imageElement = `
                    <div class="image-element">
                        <img src="${image.src}" alt="${image.alt}">
                    </div>
                    `
                scrollDiv.innerHTML += imageElement
                tracker.innerHTML += `<span class="tracker-circle"></span>`
            })

            aside.innerHTML = `
                <h1>${product.name}</h1>
                <span>${product.description}</span>
                <span>${product.materials}</span>
                <span><b>${product.price}</b></span>
                <span>${product.date_created}</span>
                <span class="colors"></span>
            `

            if(product.colors) {
                product.colors.forEach(color => {
                    document.querySelector("aside .colors").innerHTML += 
                    `<span style="${`background-color: ${color}`}" class="color"></span>`
                })
                document.querySelectorAll("aside .color")[0].classList.add("selected")
                document.querySelectorAll("aside .color").forEach(colorSpan => {
                    colorSpan.addEventListener("click", e => {
                        document.querySelectorAll("aside .color").forEach(colorSpan => {
                            colorSpan.classList.remove("selected")
                        })
                        colorSpan.classList.add("selected")
                    })  
                })
            }

            activateSlider(
                document.querySelector(".slideshow"),
                document.querySelector("section .left-arrow"),
                document.querySelector("section .right-arrow"),
                document.querySelector("section").clientWidth,
                true,
                tracker
            )
        }    
    })    
})    



