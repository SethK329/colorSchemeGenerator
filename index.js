
const modeSelect = document.getElementById("modeSelect")
const colorInput = document.getElementById("colorInput")
const colorContainer = document.getElementById("colorContainer")
const colorSpace = document.getElementById("colorSpace")
const searchedColor = document.getElementById("searchedColor")
const currentColor = document.getElementById("currentColor")
let dataArr = []
let colorIndex = 0


// EVENT LISTENERS
    //shows in text what hex value is currently selected in color input
    colorInput.addEventListener("change",()=>{currentColor.innerText=`Current: ${colorInput.value}` } )

    // changes which color format is displayed
    colorSpace.addEventListener("change", e=>{
        for(let i = 0; i<dataArr.length; i++){
            dataArr[i].colorFormat = colorSpace.value
        }
        render(colorIndex)
    })

    //on button click this triggers the series of functions that produce the color scheme
    document.getElementById("getScheme").addEventListener("click", getColorScheme)

    // copies color info from data attribute set by constructor
    colorContainer.addEventListener("click", e=> {
        navigator.clipboard.writeText(e.target.dataset.color);
    })

    // finds index for selected color that has been searched and then triggers render on that color
    searchedColor.addEventListener("change", getCurrentColor)

    // when changing modes, call api for new data to display change
    modeSelect.addEventListener("change", getColorScheme)

// calls api and pushes returned object into an array for use in a constructor, also add the colorspace property to data for later use.
function getColorScheme(){
    fetch(`https://www.thecolorapi.com/scheme?hex=${cleanHexCode()}&format=json&mode=${modeSelect.value}&count=5`)
    .then(res=>res.json())
    .then(data=> {
        data.colorFormat = colorSpace.value
        dataArr.unshift(data)
        console.log(dataArr)
        render(colorIndex)
        showSearchedColors()
    })

}

// prints html produced by the constructor into the DOM
function render(arrayIndex){
    // fallback for browsers that don't support view transition api
    if(!document.startViewTransition){
        colorContainer.innerHTML = new ColorScheme(dataArr[arrayIndex]).getColorContainerHTML()
    }
    // new view transition api. Does automatic animations for changes to the DOM. Currently only works in Chrome 111 and Edge 111.
    document.startViewTransition(()=> colorContainer.innerHTML = new ColorScheme(dataArr[arrayIndex]).getColorContainerHTML()) 
}

// utility function to display searched colors so user can go back and look at pallette again
function showSearchedColors(){
    searchedColor.innerHTML = ""
    let allSearchedColors = ""
    for(let i=0; i<dataArr.length; i++){
        allSearchedColors += `<option value ="${dataArr[i]._links.self}"> ${dataArr[i].seed.hex.value}  ${dataArr[i].mode} </option>`
    }
    searchedColor.innerHTML = allSearchedColors
}    

// selects the appropriate index from the dataArr for render when looking at a previously searched color and adjusts other options to match the change
function getCurrentColor(){
    colorIndex = dataArr.findIndex(i => i._links.self === searchedColor.value)
    colorInput.value = dataArr[colorIndex].seed.hex.value
    currentColor.innerText=`Current: ${colorInput.value}`
    modeSelect.value = dataArr[colorIndex].mode
    render(colorIndex)
}

// constructor for turning object returned by api into html visual. It might be overkill right now,
//  but I imagine it would make it easier to use all of the data returned by the api and produce a sort of color pallete dashboard
class ColorScheme{
    constructor(data){
        Object.assign(this, data)
    }
    getColorContainerHTML() {
        const {colors, colorFormat} = this
        colorContainer.innerHTML =""
        let palletteHTML = ''    
        colors.forEach(color =>{
            // ternary lets me choose what colorspace to display from the object by checking the option from the dom and then changing the variable
            let formatVariable = colorFormat === "hex"? color.hex.value : colorFormat === "rgb"? color.rgb.value: color.hsl.value;
            palletteHTML +=` <div class = "color-panel" data-color ="${formatVariable}">
                                <p class ="color-code" data-color ="${formatVariable}" style = "background-color:${color.hex.value}59">${formatVariable}</p>
                                <img src="${color.image.bare}" class="color-sample" data-color ="${formatVariable}"/>
                            </div>`
         })
        return palletteHTML
    }
}

// removes hex from color value for use in api query string
function cleanHexCode(){
    let hexValue = colorInput.value.slice(1,colorInput.value.length)
    return hexValue
}

getColorScheme()