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


function topList() {
    return dynamicProductList.getBoundingClientRect().top
}

loadProducts().then(res => {
    PRODUCTS = res
})
// document.onmousemove = e => {
//     const rect = dynamicProductList.getBoundingClientRect()
//     if(e.clientX >= rect.x && e.clientX <= rect.x + rect.width &&
//        e.clientY >= rect.y && e.clientY <= rect.y + rect.height
//         ) 
//     {
//         dynamicProductListWrapper.classList.add("selected")
//         cursorOutsideProductList = false
//     } else {
//         dynamicProductListWrapper.classList.remove("selected")
//         cursorOutsideProductList = true
//     }
// }

document.onmousemove = (e) => {
    const dynamicProductList = document.querySelector('#dynamicProductList'); // Ensure this points to your element
    const dynamicProductListWrapper = document.querySelector('#dynamicProductListWrapper'); // Ensure this points to the correct wrapper element

    if (dynamicProductList) {
        const rect = dynamicProductList.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(dynamicProductList);

        // Extract the margins
        const marginTop = parseFloat(computedStyle.marginTop);
        const marginLeft = parseFloat(computedStyle.marginLeft);
        const marginRight = parseFloat(computedStyle.marginRight);
        const marginBottom = parseFloat(computedStyle.marginBottom);

        // Adjust the rect values to exclude margins
        const adjustedRect = {
            x: rect.x + marginLeft,
            y: rect.y + marginTop,
            width: rect.width - (marginLeft + marginRight),
            height: rect.height - (marginTop + marginBottom)
        };

        if (
            e.clientX >= adjustedRect.x &&
            e.clientX <= adjustedRect.x + adjustedRect.width &&
            e.clientY >= adjustedRect.y &&
            e.clientY <= adjustedRect.y + adjustedRect.height
        ) {
            dynamicProductListWrapper.classList.add("selected");
            cursorOutsideProductList = false;
        } else {
            dynamicProductListWrapper.classList.remove("selected");
            cursorOutsideProductList = true;
        }
    }
};


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
        dynamicProductList.style.marginTop = 0

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
                                            <span class="flexone"></span>

                            <span class="price">${product.price}</span>
                        </div>
                        <a></a>
                    </div>`
                dynListSection.innerHTML += productElement
            })
            dynamicProductListWrapper.append()
        }
        else {
            if(dynamicProductList.style.display !== "flex") {
                dynamicProductList.style.display = "flex"
            }
            else {
                dynamicProductList.style.display = "none"
            }
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

            console.log(topList())
            if((topList()) < 0) dynamicProductList.style.marginTop = -topList() + 10 + "px"

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

function getScrollWidth() {
    return window.matchMedia('(max-width: 1000px)').matches ? window.innerWidth - getScrollbarWidth() + 25 : 
        document.querySelector(".testimonial").offsetWidth * 2
}

function getSnap() {
    return window.matchMedia('(max-width: 1000px)').matches
}

activateSlider(
    document.querySelector(".testimonials .testimonials-scroll"), 
    document.querySelector(".testimonials .left-arrow"), 
    document.querySelector(".testimonials .right-arrow"),
    getScrollWidth,
    getSnap
)
      
if(sessionStorage.getItem("popup-closed") === "true") {
    document.querySelector(".popup").style.display = "none"
}

document.querySelector(".popup #close").addEventListener("click", e => {
    sessionStorage.setItem("popup-closed", "true")      
    e.currentTarget.parentElement.style.display = "none"
})

function getScrollbarWidth() {
    const container = document.createElement('div');
    container.style.overflow = 'scroll';
    container.style.width = '50px';
    container.style.height = '50px';
    document.body.appendChild(container);
    const scrollbarWidth = container.offsetWidth - container.clientWidth;
    document.body.removeChild(container);
    return scrollbarWidth;
}

const scrollbarWidth = getScrollbarWidth();
document.documentElement.style.setProperty('--scrollbarWidth', `${scrollbarWidth}px`);