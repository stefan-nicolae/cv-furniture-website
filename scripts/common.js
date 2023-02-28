export async function loadProducts() {
    return fetch('./assets/productList.json')
    .then(response => response.json())
    .then(data => data.products)
    .catch(error => console.log(error));
}

export function activateSlider(slider, leftArrow, rightArrow, scrollWidth=400, snap=false, tracker=undefined) {
    let isDown = false, startX, scrollLeft, startTime, index = 0

    if(snap) {
        document.querySelectorAll(".scroll-div img").forEach(img => {
            img.style.width = img.parentElement.parentElement.parentElement.clientWidth + "px"
        })
    
        setTimeout(() => {        
            document.querySelectorAll(".scroll-div img").forEach(img => {
                img.style.width = img.parentElement.parentElement.parentElement.clientWidth + "px"
            })
            document.querySelector("#big-image").style.width = (document.querySelector(".scroll-div img").clientWidth * 2) + "px"
        }, (300));
    }

    if(snap && tracker) tracker.children[0].style.backgroundColor = "black"

    if(snap) {
        window.onresize = () => {
            document.querySelectorAll(".scroll-div img").forEach(img => {
                img.style.width = img.parentElement.parentElement.parentElement.clientWidth + "px"
            })
            document.querySelector("#big-image").style.width = (document.querySelector(".scroll-div img").clientWidth * 2) + "px"
        }
    }

    rightArrow.addEventListener("click", e => {
        if(snap) scrollWidth = e.currentTarget.parentElement.clientWidth
        slider.scrollBy({
            left: scrollWidth,
            behavior: "smooth"
        })
    });

    leftArrow.addEventListener("click", e => {
        if(snap) scrollWidth = e.currentTarget.parentElement.clientWidth
        slider.scrollBy({
            left: -scrollWidth,
            behavior: "smooth"
        })
    });

    ['mousedown', 'touchstart'].forEach(evt => {
        slider.addEventListener(evt, e => {
            startTime = new Date()
            isDown = true
            slider.classList.add("active")
            const cursorX = e.pageX !== undefined ? e.pageX : e.changedTouches[0].clientX
            startX = cursorX - slider.offsetLeft
            scrollLeft = slider.scrollLeft
            e.preventDefault()
        })
    });

    ['mouseleave', 'touchleave'].forEach(evt => {
        slider.addEventListener(evt, e => {
            isDown = false
            slider.classList.remove("active")
        })
    });

    ['mouseup', 'touchend'].forEach(evt => {
        slider.addEventListener(evt, e => {
            isDown = false
            slider.classList.remove("active")
            if(!snap) {
                const time = new Date() - startTime
                const cursorX = e.pageX !== undefined ? e.pageX : e.changedTouches[0].clientX
                const endX = cursorX - slider.offsetLeft
                const distance = endX - startX
                const speed = distance/time 
                slider.scrollBy({
                    left: -500 * speed,
                    behavior: "smooth"
                })
            }
            else {
                const delta = slider.scrollLeft%e.currentTarget.clientWidth
                if(delta <= e.currentTarget.clientWidth/2) slider.scrollBy({
                    left: -delta,
                    behavior: "smooth"
                }) 
                else slider.scrollBy({
                    left: -delta + e.currentTarget.clientWidth,
                    behavior: "smooth"
                }) 
            }
        });
    });

    ['mousemove', 'touchmove'].forEach(evt => {
        slider.addEventListener(evt, e => {
            const cursorX = e.pageX !== undefined ? e.pageX : e.changedTouches[0].clientX
            if(!isDown) return
            e.preventDefault()
            const x = cursorX - slider.offsetLeft
            const walk = (x - startX) * (2000/slider.clientWidth)
            slider.scrollLeft = scrollLeft - walk
        })
    });
    
    slider.addEventListener("scroll", e => {
        if(snap && tracker) {
            index = Math.round(slider.scrollLeft/e.currentTarget.clientWidth)
            for(const child of tracker.children) { child.style.backgroundColor = "unset" }
            tracker.children[index].style.backgroundColor = "black"
        }
    });

    slider.addEventListener("dblclick", e => {
        if(snap) {
            const bigImage = document.querySelector("#big-image")
            const cursorX = e.layerX - index*e.currentTarget.clientWidth
            const cursorY = e.currentTarget.clientHeight - e.layerY 

            if(bigImage.style.display !== "none") bigImage.style.display = "none"
            else bigImage.style.display = "block"

            bigImage.style.left = cursorX + "px"
            bigImage.style.bottom = cursorY + "px" 

        }
    });
}

export function openProduct(category, name) {
    const url = new URL("/product.html" , "http://" + window.location.host)
    url.searchParams.append('category', category)
    url.searchParams.append('name', name)
    return url.href
}