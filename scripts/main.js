import { loadProducts, activateSlider, openProduct } from "./common.js"

const dynamicProductList = document.querySelector("div.dynamic-product-list")
const dynamicProductListWrapper = document.querySelector("div.dynamic-product-list .wrapper")
const dynListSection = document.querySelector("div.dynamic-product-list .wrapper section")
const dynListHeader = document.querySelector("div.dynamic-product-list .wrapper .title")
const testimonials = document.querySelector(".testimonials")
let cursorOutsideProductList = true
let dynSelectedClass = ""
let PRODUCTS = []

const articleTopPadding = 128


function isMobileWindowWidth() {
    const mediaQuery = window.matchMedia('(max-width: 1000px)');
    return mediaQuery.matches
}

loadProducts().then(res => {
    PRODUCTS = res
})

document.onmousemove = e => {
    const rect = dynamicProductList.getBoundingClientRect()
    if(e.clientX >= rect.x && e.clientX <= rect.x + rect.width &&
       e.clientY >= rect.y && e.clientY <= rect.y + rect.height
        ) 
    {
        // dynamicProductListWrapper.classList.add("selected")
        cursorOutsideProductList = false
    } else {
        // dynamicProductListWrapper.classList.remove("selected")
        cursorOutsideProductList = true
    }
}

document.onclick = e => {
    if(cursorOutsideProductList) 
        dynamicProductList.style.display = "none"
        document.querySelector("article").style.paddingTop = articleTopPadding + "px"
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
                <h4 class="bold">${product.name}</h4>
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
        
        dynListHeader.textContent = dynSelectedClass[0].toUpperCase() + dynSelectedClass.slice(1) + "s"

        document.querySelectorAll(".dyn-list-product a").forEach((link) => {
            link.href = openProduct(link.parentElement.dataset.category, link.parentElement.dataset.name)
        })

        const adjustMobile = () => {
            if(isMobileWindowWidth()) {
                dynamicProductList.id = 'mobile-dyn-list'
                document.querySelector("article").style.paddingTop = dynamicProductList.clientHeight + articleTopPadding + "px";
            } 
        }
        
        const adjustOverflow = () => {
            dynamicProductList.style.marginLeft = 0
            if(dynamicProductList.style.display === "flex" && !isMobileWindowWidth()) {
                console.log("running")
                const rect = dynamicProductList.getBoundingClientRect()
                const rightOverflow = rect.right - document.documentElement.clientWidth + 48
                if(rightOverflow > 0) dynamicProductList.style.marginLeft = -rightOverflow + "px"
            }
        }
        
        adjustMobile()
        adjustOverflow()

        window.addEventListener('resize', () => {
            adjustMobile()
            adjustOverflow()
        })

    })

    // window.onresize = () => {
    //     console.log("resizing")
    //     adjustOverflow()
    //     adjustMobile()
    // }
})


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




function getScrollWidth () {
    if(isMobileWindowWidth()) {
        const padding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--t-padding'))
        return document.documentElement.clientWidth +padding
    }   else return 400
} 


activateSlider(
    document.querySelector(".testimonials .testimonials-scroll"), 
    document.querySelector(".testimonials .left-arrow"), 
    document.querySelector(".testimonials .right-arrow"),
    () => getScrollWidth(), 
    isMobileWindowWidth
)
          
if(sessionStorage.getItem("popup-closed") === "true") {
    document.querySelector(".popup").style.display = "none"
}

document.querySelector(".popup #close").addEventListener("click", e => {
    sessionStorage.setItem("popup-closed", "true")
    e.currentTarget.parentElement.style.display = "none"
})

function setVw() {
    let vw = document.documentElement.clientWidth / 100;
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  }
  
  setVw();
  window.addEventListener('resize', setVw);