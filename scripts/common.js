const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));

export async function loadProducts() {
    return fetch('./assets/productList.json')
    .then(response => response.json())
    .then(data => data.products)
}

export function activateSlider(slider, leftArrow, rightArrow, getscrollWidth, getSnap, tracker=undefined, IMAGES=undefined, BIG_IMAGE=undefined) {
    let scrollWidth = getscrollWidth()
    let snap = getSnap()
    onresize = () => {
        scrollWidth = getscrollWidth()
        snap = getSnap()
    }
    let isDown = false, startX, scrollLeft, startTime, index=0

    //it takes in #big-image, an element located in the slideshow div, in products.html
    //it then crops it and fits it in the middle of the cursor.
    //it runs on the mouse listener & in the toggleBigImage func
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

    //this calculates the cursor params in calculateBigImage()
    //takes in mousemove or touchmove as e
    const getBigImageXY = e => {
        const X = e.layerX !== undefined ? e.layerX : e.changedTouches[0].clientX
        const Y = e.layerY !== undefined ? e.layerY : e.changedTouches[0].clientY
        let cursorX = X - index*e.currentTarget.clientWidth 
        if(cursorX < 0) cursorX += slider.clientWidth * index
        const cursorY = e.currentTarget.clientHeight - Y
        return [cursorX, cursorY]
    }

    //works on doubleclick, makes bigimage visible and runs the calculate for the first time.
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


    if( IMAGES) {
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
        if(BIG_IMAGE) BIG_IMAGE.style.display = "none"
        slider.scrollBy({
            left: scrollWidth,
            behavior: "smooth"
        })
    });

    leftArrow.addEventListener("click", e => {
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
                if(evt === "mouseleave" || evt === "touchleave") return
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
                const delta = slider.scrollLeft%scrollWidth
                if(delta <= scrollWidth/2) slider.scrollBy({
                    left: -delta,
                    behavior: "smooth"
                }) 
                else slider.scrollBy({
                    left: -delta + scrollWidth,
                    behavior: "smooth"
                }) 
            }
        });
    });

    //Let's start with this. 
    ['mousemove', 'touchmove'].forEach(evt => {
        slider.addEventListener(evt, e => {
            //get mouse X position
            const X = e.pageX !== undefined ? e.pageX : e.changedTouches[0].clientX
            //calc big image if it's displayed
            calculateBigImage(getBigImageXY(e))
            //if the mouse isnt down. This gets set at the "on press" and "on release" listenersx
            //otherwise you'd slide the thing just with the cursor
            if(!isDown) return
            //if the image is up, you aren't allowed to slide the thing
            if(BIG_IMAGE && BIG_IMAGE.style.display !== "none") return
            
            let multiplier = 1
            //if it snaps, the thing scrolls 2x as much as usual with the same mouse movement. 
            if(snap) multiplier = 2 
            console.log(X)
            //X is the coordinate that moves with the cursor, startX is the cursor X before the dragging.
            const walk = (X - startX) * multiplier
            //walk are the coordinates of the mouse and scrollLeft is what's already been scrolled
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