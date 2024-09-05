// variables //
let productImagesContainer = document.querySelector('.product-images-container')
let carousel = document.querySelector('.main-images-container');
let carouselItems = Array.from(carousel.children)
let mainImg = carouselItems[0]
let moveBtns = document.querySelectorAll('.move-btn')
let lightBoxContainer = document.querySelector('.lightbox-container')
let lightBox = document.querySelector('.lightbox')
let lightBoxCloseBtn = document.querySelector('.x-mark-icon-btn')
let smallerImagesContainer = document.querySelectorAll('.smaller-images-item')
let imagesPositionJSON = []
let mediaThresshold = 749

const startMainImgSrc = 'images/image-product-1.jpg'
const matchMediaQuery = window.matchMedia(`(max-width:${mediaThresshold}px)`)
const orderBtns = document.querySelectorAll('#reduce-btn, #increase-btn')
console.log(orderBtns)
const orderValueEl = document.querySelector('.products-number')
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

const createLightBoxContent = (box, content) => {
    const clonedProductImagesContainer = content.cloneNode(true)
    let imagesContainer = clonedProductImagesContainer.querySelector('.main-images-container')  
    Array.from(imagesContainer.children).forEach((el, i)=> {if (i>0) imagesContainer.removeChild(el)})
    box.appendChild(clonedProductImagesContainer);
    let newMoveBtns = clonedProductImagesContainer.querySelectorAll('.move-btn')
    newMoveBtns.forEach(btn => btn.addEventListener('click', changeLightBoxMainImgs))
}

const handleMediaQueryChange = (e) => {
    if (e.matches) {
        lightBoxContainer.setAttribute('aria-hidden', 'true')
        if (mainImg.children[0].getAttribute('src') !== startMainImgSrc ) {
            mainImg.children[0].setAttribute('src', startMainImgSrc)
        }
    }else {
        if (smallerImagesContainer[0].getAttribute('data-active') !== 'true') {
            smallerImagesContainer.forEach(c => {if (c.getAttribute('data-active') === 'true'){
            c.setAttribute('data-active', 'false')
           }})
           smallerImagesContainer[0].setAttribute('data-active', 'true') 
        }
    }
}

const changeImage = (parent, imgTargetClass, imgToChangeName) => {
    let mainImg = parent.querySelector(imgTargetClass);
    let newImgSrc = `images/image-${imgToChangeName}.jpg` 
    mainImg.setAttribute('src', newImgSrc)
}

const changeLightBoxMainImgs = (e) => {
    let thisBtn = e.target.closest('button')
    const thisParent = thisBtn.parentElement.parentElement
    const smallImagesContainers = Array.from(thisParent.querySelectorAll('.smaller-images-item'))
    const elementsToToggle = findItems(container=smallImagesContainers, stateForCurrActiveEl='.smaller-images-item[data-active="true"]', forwardState = thisBtn.dataset.state === 'fw')
    if (!elementsToToggle) return
    changeItem(elementsToToggle.thisItem, elementsToToggle.nextItemToActive, 'data-active', true)
    changeImage(thisParent, '.current-slide img', elementsToToggle.nextItemToActive.dataset.name)
}

const changeMainImg = (e) => {
    let clickedItem = e.target.matches('.smaller-images-item') ? e.target : e.target.parentElement;
    smallerImagesContainer.forEach(container=> {container.setAttribute('data-active', 'false')})
    clickedItem.setAttribute('data-active', 'true')
    const thisParent = clickedItem.closest('.product-images-container')
    changeImage(thisParent, '.big-img', clickedItem.dataset.name)
}

const changeOrderValue = (orderEl, amount) => {
    let amountNow = Number(+orderEl.innerText)
    return amountNow + amount
}


// event listeners

moveBtns.forEach(btn => btn.addEventListener('click', ()=> {
    let step = btn.dataset.state === 'fw' ? -100 : 100;
    let elementsToToggle = findItems(container=carouselItems, stateForCurrActiveEl='.main-images-item[aria-hidden="false"]',forwardState = btn.dataset.state === 'fw') 
    if (!elementsToToggle) return
    changeItem(elementsToToggle.thisItem, elementsToToggle.nextItemToActive, 'aria-hidden', false)
    imagesPositionJSON = updateItemsPosition(itemsLngth = carouselItems.length, step = step, dict = imagesPositionJSON)
    placeItemsTonewPosition(carouselItems, imagesPositionJSON)
}))

mainImg.addEventListener('click', ()=> {
    if (window.innerWidth < mediaThresshold) return
    lightBoxContainer.setAttribute('aria-hidden', 'false')}
)

lightBoxCloseBtn.addEventListener('click', ()=> {lightBoxContainer.setAttribute('aria-hidden', 'true')})
smallerImagesContainer.forEach(img => img.addEventListener('click', changeMainImg))
matchMediaQuery.addEventListener('change', handleMediaQueryChange)

orderBtns.forEach(orderBtn => orderBtn.addEventListener('click', ()=> {
    const dir = orderBtn.id === 'reduce-btn' ? -1 : 1;
    if (dir === -1 && orderValueEl.innerText === '0') return
    orderValueEl.innerText = changeOrderValue(orderValueEl, dir)
}))
// main

imagesPositionJSON = updateItemsPosition(itemsLngth = carouselItems.length, step = 100, dict = imagesPositionJSON);
placeItemsTonewPosition(carouselItems, imagesPositionJSON);
createLightBoxContent(lightBox, productImagesContainer);