// variables //
let productImagesContainer = document.querySelector('.product-images-container')
let carousel = document.querySelector('.main-images-container');
let carouselItems = Array.from(carousel.children)
let mainImg = carouselItems[0]
let moveBtns = document.querySelectorAll('.move-btn')
let lightBoxContainer = document.querySelector('.lightbox-container')
let lightBox = document.querySelector('.lightbox')
let imagesPositionJSON = []

// funtcions //

const updateItemsPosition = (itemsLngth, step, dict) => {
    if (dict.length === 0) {
        dict = Array.from({length:itemsLngth}, (_, i)=> 0 + i*step)
    }else {
        dict = dict.map(e => e += step)
    }
    return dict
}

const placeItemsTonewPosition = (items, object) => {
    items.forEach((item, i) => item.style.setProperty('--amount-to-move', `${object[i]}%`))
}

const changeItem = (thisItem, nextItem, attr, activeCondition) => {
    thisItem.setAttribute(attr, (!activeCondition).toString())
    nextItem.setAttribute(attr, activeCondition.toString()) 
}

const findItems = (container, stateForCurrActiveEl, forwardState)=> {
    let activeItem = container.find(item => item.matches(stateForCurrActiveEl))
    let nextItem = forwardState? activeItem.nextElementSibling: activeItem.previousElementSibling
    return nextItem !== null ? {thisItem: activeItem, nextItemToActive: nextItem} : null
}

const changeMainImgs = (e) => {
    let thisBtn = e.target.closest('button')
    const thisParent = thisBtn.parentElement.parentElement
    let mainImg = thisParent.querySelector('.current-slide img')
    const smallImagesContainers = Array.from(thisParent.querySelectorAll('.smaller-images-item'))
    const elementsToToggle = findItems(container=smallImagesContainers, stateForCurrActiveEl='.smaller-images-item[data-active="true"]', forwardState = thisBtn.dataset.state === 'fw')
    if (!elementsToToggle) return
    changeItem(elementsToToggle.thisItem, elementsToToggle.nextItemToActive, 'data-active', true)
    let newImgSrc = `images/image-${elementsToToggle.nextItemToActive.dataset.name}.jpg` 
    mainImg.setAttribute('src', newImgSrc)
}

const createLightBoxContent = (box, content) => {
    if (window.innerWidth < 850) return
    lightBoxContainer.setAttribute('aria-hidden', 'false')
    const clonedProductImagesContainer = content.cloneNode(true)
    let imagesContainer = productImagesContainer.querySelector('.main-images-container')  
    Array.from(imagesContainer.children).forEach((el, i)=> {if (i>0) imagesContainer.removeChild(el)})
    box.appendChild(clonedProductImagesContainer);
    let newMoveBtns = clonedProductImagesContainer.querySelectorAll('.move-btn')
    newMoveBtns.forEach(btn => btn.addEventListener('click', changeMainImgs))
}

// event listeners

moveBtns.forEach(btn => btn.addEventListener('click', ()=> {
    let step = btn.dataset.state === 'fw' ? -100 : 100;
    let elementsToToggle = findItems(container=carouselItems, stateForCurrActiveEl='.main-images-item[aria-hidden="false"]', forwardState = btn.dataset.state === 'fw') 
    if (!elementsToToggle) return
    changeItem(elementsToToggle.thisItem, elementsToToggle.nextItemToActive, 'aria-hidden', false)
    imagesPositionJSON = updateItemsPosition(itemsLngth = carouselItems.length, step = step, dict = imagesPositionJSON)
    placeItemsTonewPosition(carouselItems, imagesPositionJSON)
}))

mainImg.addEventListener('click', ()=> {createLightBoxContent(lightBox, productImagesContainer)})

// main

imagesPositionJSON = updateItemsPosition(itemsLngth = carouselItems.length, step = 100, dict = imagesPositionJSON);
placeItemsTonewPosition(carouselItems, imagesPositionJSON);
// createLightBoxContent(lightBox, productImagesContainer)







