export async function loadProducts() {
    return fetch('./assets/productList.json')
    .then(response => response.json())
    .then(data => data.products)
    .catch(error => console.log(error));
}

export function activateSlider(slider, leftArrow, rightArrow, scrollWidth=400, snap=false, tracker=undefined) {
    document.querySelectorAll(".scroll-div img").forEach(img => {
        img.style.width = img.parentElement.parentElement.parentElement.clientWidth + "px"
    })
    if(tracker) tracker.children[0].style.backgroundColor = "black"
    if(snap) {
        window.onresize = () => {
            document.querySelectorAll(".scroll-div img").forEach(img => {
                img.style.width = img.parentElement.parentElement.parentElement.clientWidth + "px"
            })
        }
    }

    rightArrow.addEventListener("click", e => {
        if(snap) scrollWidth = e.currentTarget.parentElement.clientWidth
        slider.scrollBy({
            left: scrollWidth,
            behavior: "smooth"
        })
    })

    leftArrow.addEventListener("click", e => {
        if(snap) scrollWidth = e.currentTarget.parentElement.clientWidth
        slider.scrollBy({
            left: -scrollWidth,
            behavior: "smooth"
        })
    })

    let isDown = false, startX, scrollLeft

    slider.addEventListener('mousedown', (e) => {
        isDown = true
        slider.classList.add("active")
        startX = e.pageX - slider.offsetLeft
        scrollLeft = slider.scrollLeft
        e.preventDefault()
    })

    slider.addEventListener('mouseleave', () => {
        isDown = false
        slider.classList.remove("active")
    })

    slider.addEventListener('mouseup', e => {
        isDown = false
        slider.classList.remove("active")
        if(snap) {
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
    })

    slider.addEventListener('mousemove', (e) => {
        if(!isDown) return
        e.preventDefault()
        const x = e.pageX - slider.offsetLeft
        const walk = (x - startX) * 2
        slider.scrollLeft = scrollLeft - walk
    })

    slider.addEventListener("scroll", e => {
        if(snap && tracker) {
            const index = Math.round(slider.scrollLeft/e.currentTarget.clientWidth)
            for(const child of tracker.children) { child.style.backgroundColor = "unset" }
            tracker.children[index].style.backgroundColor = "black"
        }
    })
}
