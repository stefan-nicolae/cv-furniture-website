import { loadProducts, activateSlider, openProduct } from "./common.js"

const dynamicProductList = document.querySelector("div.dynamic-product-list")
const dynamicProductListWrapper = document.querySelector("div.dynamic-product-list .wrapper")
const dynListSection = document.querySelector("div.dynamic-product-list .wrapper section")
const dynListHeader = document.querySelector("div.dynamic-product-list .wrapper .title")
const testimonials = document.querySelector(".testimonials")
const butterfly = document.querySelector("#butterfly")
let cursorOutsideProductList = true
let dynSelectedClass = ""
let PRODUCTS = []

loadProducts().then(res => {
    PRODUCTS = res
})
document.onmousemove = e => {
    const rect = dynamicProductList.getBoundingClientRect()
    if(e.clientX >= rect.x && e.clientX <= rect.x + rect.width &&
       e.clientY >= rect.y && e.clientY <= rect.y + rect.height
        ) 
    {
        dynamicProductListWrapper.classList.add("selected")
        cursorOutsideProductList = false
    } else {
        dynamicProductListWrapper.classList.remove("selected")
        cursorOutsideProductList = true
    }
}

document.onclick = e => {
    if(cursorOutsideProductList) 
        dynamicProductList.style.display = "none"
}

document.querySelector(".dynamic-product-list .close")
.addEventListener("click", e => {
    dynamicProductList.style.display = "none"
}) 

document.querySelectorAll(".round-header-button").forEach(headerButton => {
    headerButton.addEventListener("click", e => {
        e.stopPropagation()

        dynamicProductList.classList.remove(dynamicProductList.classList[1])
        dynamicProductList.classList.add(headerButton.classList[0])
        if(dynamicProductList.classList[1] !== dynSelectedClass) {
            dynamicProductList.style.display = "flex"
            dynListSection.innerHTML = ""
            PRODUCTS[dynamicProductList.classList[1]].forEach(product => {
                const productElement = 
                    `<div class="dyn-list-product" data-name=${product.name.replaceAll(" ", "_")} data-category=${dynamicProductList.classList[1]}>
                        <img src="${product.images[0].src}" alt="Thumbnail of ${product.name}">
                        <div class="info">
                            <h4>${product.name}</h4>
                            <span>${product.materials}</span>
                            <span class="price">${product.price}</span>
                        </div>
                        <a></a>
                    </div>`
                dynListSection.innerHTML += productElement
            })
            dynamicProductListWrapper.append()
        }
        else {
            if(dynamicProductList.style.display !== "flex") 
                dynamicProductList.style.display = "flex"
            else
                dynamicProductList.style.display = "none"
        }
        dynSelectedClass = dynamicProductList.classList[1]

        if(dynamicProductList.style.display === "flex") {
            dynListHeader.textContent = dynSelectedClass[0].toUpperCase() + dynSelectedClass.slice(1) + "s"

            dynamicProductList.style.marginLeft = 0
            if(window.innerWidth > 600) 
            {
                const rect = dynamicProductList.getBoundingClientRect()
                const rightOverflow = rect.right - window.innerWidth + 48
                if(rightOverflow > 0) dynamicProductList.style.marginLeft = -rightOverflow + "px"
            }

            document.querySelectorAll(".dyn-list-product a").forEach((link) => {
                link.href = openProduct(link.parentElement.dataset.category, link.parentElement.dataset.name)
            })
        }
    })
})

window.onresize = () => {
    dynamicProductList.style.marginLeft = 0
    if(window.innerWidth > 600) 
    {
        const rect = dynamicProductList.getBoundingClientRect()
        const rightOverflow = rect.right - window.innerWidth + 48
        if(rightOverflow > 0) dynamicProductList.style.marginLeft = -rightOverflow + "px"
    }
}

window.onscroll = () => {
    let space = window.innerHeight - testimonials.offsetTop + window.scrollY
    if(space >= 0) {
        document.querySelectorAll(".page2").forEach(page => {
           page.animate([
               {transform: "rotateY(180deg)"}
           ], { 
               duration: 2000,
               easing: "ease-in",
               fill: "forwards"
           })
       })
    }
}

const getButterflyDelta = (range, bias) => {
    const movement = Math.floor(Math.random() * (range+1))
    const biasResult = Math.floor(Math.random() * (bias+1)) <= 0 ? -0.5 : 0.5
    return movement * biasResult
}

const getButterflyProperty = (name) => {
    return window.getComputedStyle(butterfly)[name].slice(0, -2)
}

butterfly.style.top = "200px"

setInterval(() => {
    if(getButterflyProperty("left") > window.innerWidth) butterfly.style.left = "0px"
    if(getButterflyProperty("top") > window.innerHeight) butterfly.style.top = "0px"
    if(getButterflyProperty("top") < 0) butterfly.style.top = window.innerHeight + "px"

    butterfly.style.left = parseFloat(getButterflyProperty("left")) + getButterflyDelta(10, 10) + "px"
    butterfly.style.top = parseFloat(getButterflyProperty("top")) + getButterflyDelta(5, 1) + "px"
}, 70)

butterfly.addEventListener("mouseenter", e => {
    butterfly.animate([
        {transform: `translateY(${parseFloat(getButterflyProperty("top")) + getButterflyDelta(50, 1) - 200 + "px"})`}
    ], {
        duration: 500,
        easing: "ease-in",
        fill: "forwards"
    })
})

activateSlider(
    document.querySelector(".testimonials .testimonials-scroll"), 
    document.querySelector(".testimonials .left-arrow"), 
    document.querySelector(".testimonials .right-arrow")
)
          
if(sessionStorage.getItem("popup-closed") === "true") {
    document.querySelector(".popup").style.display = "none"
}

document.querySelector(".popup #close").addEventListener("click", e => {
    sessionStorage.setItem("popup-closed", "true")
    e.currentTarget.parentElement.style.display = "none"
})