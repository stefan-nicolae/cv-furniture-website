export async function loadProducts() {
    return fetch('./assets/productList.json')
    .then(response => response.json())
    .then(data => data.products)
    .catch(error => console.log(error));
}

export function activateSlider(slider, leftArrow, rightArrow, scrollWidth=400, 
        snap=false, tracker=undefined, IMAGES=undefined, BIG_IMAGE=undefined) {

    let isDown = false, startX, scrollLeft, startTime, index=0

    if(snap) {
        const imageResize = () => {
            IMAGES.forEach(img => {
                img.style.width = img.parentElement.parentElement.parentElement.clientWidth + "px"
            })
        }

        const bigImageResize = () => {
            if(BIG_IMAGE) BIG_IMAGE.lastElementChild.style.width = IMAGES[0].clientWidth * 2 + "px"
        }

        imageResize()
    
        setTimeout(() => {        
            imageResize()
            bigImageResize()
        }, (300));

        window.onresize = () => {
            imageResize()
            bigImageResize()
        }

        if(tracker) tracker.children[0].style.backgroundColor = "black"
    }

    rightArrow.addEventListener("click", e => {
        if(snap) scrollWidth = e.currentTarget.parentElement.clientWidth
        slider.scrollBy({
            left: scrollWidth,
            behavior: "smooth"
        })
    });
    
    slider.addEventListener("scroll", e => {
        if(snap && tracker) {
            index = Math.round(slider.scrollLeft/e.currentTarget.clientWidth)
            for(const child of tracker.children) { child.style.backgroundColor = "unset" }
            tracker.children[index].style.backgroundColor = "black"
        }
    });

    leftArrow.addEventListener("click", e => {
        if(snap) scrollWidth = e.currentTarget.parentElement.clientWidth
        BIG_IMAGE.lastElementChild.style.display = "none"
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
            const X = e.pageX !== undefined ? e.pageX : e.changedTouches[0].clientX
            const cursorX = e.layerX - index*e.currentTarget.clientWidth
            const cursorY = e.currentTarget.clientHeight - e.layerY 
            calculateBigImage(cursorX, cursorY )

            if(!isDown) return
            e.preventDefault()
            const x = X - slider.offsetLeft
            const walk = (x - startX) * (2000/slider.clientWidth)
            slider.scrollLeft = scrollLeft - walk
            BIG_IMAGE.lastElementChild.style.display = "none"
        })
    });

    const calculateBigImage = (cursorX, cursorY) => {
        if(BIG_IMAGE) {
            BIG_IMAGE.style.left = cursorX + "px"
            BIG_IMAGE.style.bottom = cursorY + "px" 
            BIG_IMAGE.style.transform = `translate(${-cursorX*2}px, ${cursorY*2}px)`
            const cropX = 100, cropY = 100
            let leftCrop = cursorX*2 - cropX
            let rightCrop = BIG_IMAGE.clientWidth - cursorX*2 - cropX
            if(cursorX*2 <= cropX) leftCrop = 0
            if(cursorX*2 >= BIG_IMAGE.clientWidth - cropX) rightCrop = 0
            let topCrop = BIG_IMAGE.clientHeight - cursorY*2 - cropY
            let botCrop = cursorY*2 - cropY
            if(cursorY*2 <= cropY) botCrop = 0
            if(cursorY*2 >= BIG_IMAGE.clientHeight - cropY) topCrop = 0
            BIG_IMAGE.style.clipPath = `inset(${topCrop}px ${rightCrop}px ${botCrop}px ${leftCrop}px)`
        }
    }

    slider.addEventListener("dblclick", e => {
        if(BIG_IMAGE) {
            if(BIG_IMAGE.lastElementChild.style.display !== "none") BIG_IMAGE.lastElementChild.style.display = "none"
            else BIG_IMAGE.lastElementChild.style.display = "unset"
            BIG_IMAGE.lastElementChild.src = IMAGES[index].src
            const cursorX = e.layerX - index*e.currentTarget.clientWidth
            const cursorY = e.currentTarget.clientHeight - e.layerY 
            calculateBigImage(cursorX, cursorY)
        }
    });
}

export function openProduct(category, name) {
    return `/product.html?category=${category}&name=${name}`

}