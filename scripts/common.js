export async function loadProducts() {
    return fetch('./assets/productList.json')
    .then(response => response.json())
    .then(data => data.products)
    .catch(error => console.log(error));
}

export function activateSlider(slider, leftArrow, rightArrow) {
    rightArrow.addEventListener("click", e => {
        slider.scrollBy({
            left: 400,
            behavior: "smooth"
        })
    })
    leftArrow.addEventListener("click", e => {
        slider.scrollBy({
            left: -400,
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

    slider.addEventListener('mouseup', () => {
        isDown = false
        slider.classList.remove("active")
    })

    slider.addEventListener('mousemove', (e) => {
        if(!isDown) return
        e.preventDefault()
        const x = e.pageX - slider.offsetLeft
        const walk = (x - startX) * 2
        slider.scrollLeft = scrollLeft - walk
    })
}
