
const modeSelect = document.getElementById("modeSelect")
const colorInput = document.getElementById("colorInput")
const colorContainer = document.getElementById("colorContainer")
const colorSpace = document.getElementById("colorSpace")
const currentColor = document.getElementById("currentColor")
let dataArr = []
let colorIndex = 0

//shows what hex value is currently selected
colorInput.addEventListener("change", showCurrentColor)

// changes which color format is displayed
colorSpace.addEventListener("change", e=>{
    for(let i = 0; i<dataArr.length; i++){
        dataArr[i].colorFormat = colorSpace.value
    }
    getCurrentColor()
})

// this triggers the series of functions that produce the color scheme
document.getElementById("getScheme").addEventListener("click", e=>{
    getColorScheme()
})

// copies color info from data attribute set by constructor
colorContainer.addEventListener("click", e=> {
    navigator.clipboard.writeText(e.target.dataset.color);
    console.log("copied")
})

// finds index for selected color that has been searched and then triggers render on that color
currentColor.addEventListener("change", getCurrentColor)

// removes hex from color value for use in api query string
function cleanHexCode(){
    let hexValue = colorInput.value.slice(1,colorInput.value.length)
    return hexValue
}

// calls api and pushes returned object into an array for use in a constructor, also add the colorspace value so that when it is changed the displayed data is changed too.
function getColorScheme(){
    fetch(`https://www.thecolorapi.com/scheme?hex=${cleanHexCode()}&format=json&mode=${modeSelect.value}&count=5`)
    .then(res=>res.json())
    .then(data=> {
        data.colorFormat = colorSpace.value
        dataArr.unshift(data)
        render(colorIndex)
        console.log(dataArr)
    })

}

// prints html produced by the constructor into the DOM
function render(arrayIndex){
    colorContainer.innerHTML = new ColorScheme(dataArr[arrayIndex]).getColorContainerHTML()
    showCurrentColor()
}

// utility function to display current selected color and  all searched colors
function showCurrentColor(){
    currentColor.innerHTML = ""
    let allSearchedColors = ""
    for(let i=0; i<dataArr.length; i++){
        allSearchedColors += `<option value ="${dataArr[i].seed.hex.value}"> ${dataArr[i].seed.hex.value} </option>`
    }
    currentColor.innerHTML = allSearchedColors
}    

// function that will run with render() to create an options list with each searched color. Loop through data array to write the HTML into the DOM each time a pallete is requested.
// Then allow for the selection of that color and re-render from the dataArr.
function getCurrentColor(){
    colorIndex = dataArr.findIndex(i => i.seed.hex.value === currentColor.value)
    console.log(colorIndex)
    render(colorIndex)
}
// constructor for turning object returned by api into html visual. It is overkill right now,
//  but would make it easier to use all of the data returned by the api and produce a sort of color pallete dashboard
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
            let formatVariable = colorFormat === "hex"? color.hex.value : colorFormat === "rgb"? color.rgb.value: colorFormat === "hsl"? color.hsl.value: color.hsv.value;
            palletteHTML +=` <div class = "color-panel" data-color ="${formatVariable}">
                                <p class ="rendered-color" data-color ="${formatVariable}">${formatVariable}</p>
                                <img src="${color.image.bare}" class="color-sample" data-color ="${formatVariable}"/>
                            </div>`
         })
        return palletteHTML
    }
}
getColorScheme()