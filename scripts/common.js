const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));

export async function loadProducts() {
    return fetch('./assets/productList.json')
    .then(response => response.json())
    .then(data => data.products)
}

export function activateSlider(slider, leftArrow, rightArrow, scrollWidth=400, 
        snap=false, tracker=undefined, IMAGES=undefined, BIG_IMAGE=undefined) {

    let isDown = false, startX, scrollLeft, startTime, index=0

    const calculateBigImage = (XY) => {
        if(BIG_IMAGE) {
            const cropX = 128, cropY = 128
            let cursorX = XY[0], cursorY = XY[1]
            BIG_IMAGE.style.left = cursorX - cropX/2 + "px"
            BIG_IMAGE.style.bottom = cursorY - cropY/2 + "px"
            BIG_IMAGE.style.height = cropY + "px"
            BIG_IMAGE.style.width = cropX + "px"
            BIG_IMAGE.lastElementChild.style.objectPosition = `-${cursorX*2 - cropX/2}px ${cursorY*2+cropY/2-BIG_IMAGE.lastElementChild.clientHeight}px`
        }
    }

    const getBigImageXY = e => {
        const X = e.layerX !== undefined ? e.layerX : e.changedTouches[0].clientX
        const Y = e.layerY !== undefined ? e.layerY : e.changedTouches[0].clientY
        let cursorX = X - index*e.currentTarget.clientWidth 
        if(cursorX < 0) cursorX += slider.clientWidth * index
        const cursorY = e.currentTarget.clientHeight - Y
        return [cursorX, cursorY]
    }

    const toggleBigImage = e => {
        if(BIG_IMAGE) {
            if(BIG_IMAGE.style.display === "block") {
                BIG_IMAGE.style.display = "none"
                document.body.style.overflow = "unset";
            }
            else {
                BIG_IMAGE.style.display = "block"
                if(isMobile) document.body.style.overflow = "hidden";
            }
            BIG_IMAGE.lastElementChild.src = IMAGES[index].src
            calculateBigImage(getBigImageXY(e))
        }
    }

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
            leftArrow.click()
        }, (300));

        window.onresize = () => {
            imageResize()
            bigImageResize()
        }

        if(tracker) tracker.children[0].style.backgroundColor = "black"
    }

    rightArrow.addEventListener("click", e => {
        if(snap) scrollWidth = e.currentTarget.parentElement.clientWidth
        if(BIG_IMAGE) BIG_IMAGE.style.display = "none"
        slider.scrollBy({
            left: scrollWidth,
            behavior: "smooth"
        })
    });

    leftArrow.addEventListener("click", e => {
        if(snap) scrollWidth = e.currentTarget.parentElement.clientWidth
        if(BIG_IMAGE) BIG_IMAGE.style.display = "none"
        slider.scrollBy({
            left: -scrollWidth,
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

    ['mousedown', 'touchstart'].forEach(evt => {
        slider.addEventListener(evt, e => {
            isDown = true
            startTime = new Date()
            slider.classList.add("active")
            const cursorX = e.pageX !== undefined ? e.pageX : e.changedTouches[0].clientX
            startX = cursorX - slider.offsetLeft
            scrollLeft = slider.scrollLeft
        })
    });

    ['mouseup', 'touchend', 'mouseleave', 'touchleave'].forEach(evt => {
        slider.addEventListener(evt, e => {
            isDown = false
            slider.classList.remove("active")
            if(!snap) {
                if(evt === "mousleave" || evt === "touchleave") return
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
            calculateBigImage(getBigImageXY(e))
            if(!isDown) return
            if(BIG_IMAGE && BIG_IMAGE.style.display !== "none") return
            const x = X - slider.offsetLeft
            let multiplier = 1
            if(window.innerWidth <= 600) {
                multiplier = 0.1
            }
            if(snap) multiplier = 2
            const walk = (x - startX) * multiplier
            slider.scrollLeft = scrollLeft - walk
        })
    });

    slider.addEventListener("dblclick", e => {
        if(BIG_IMAGE) {
            toggleBigImage(e)
        }
    });
}

export function openProduct(category, name) {
    if(!window.location.href.includes("stefan-nicolae"))
        return `/product.html?category=${category}&name=${name}`
    return `/cv-furniture-website/product.html?category=${category}&name=${name}`
}