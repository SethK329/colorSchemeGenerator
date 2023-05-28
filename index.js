
const modeSelect = document.getElementById("modeSelect")
const colorInput = document.getElementById("colorInput")
const colorContainer = document.getElementById("colorContainer")
const colorSpace = document.getElementById("colorSpace")
let dataArr = []

// this event listener provides a visual change to show what hex value is currently selected by the input
document.getElementById("colorInput").addEventListener("change",  e=>{
    document.getElementById("colorInputLabel").innerText = `Current color: ${colorInput.value}`
})

// this triggers the series of functions that produce the color scheme
document.getElementById("getScheme").addEventListener("click",event=>{
    getColorScheme()
})

// removes hex from color value for use in api query string
function cleanHexCode(){
    let hexValue = colorInput.value.slice(1,colorInput.value.length)
    return hexValue
}

// calls api and pushes returned object into an array for use in a constructor
function getColorScheme(){
    fetch(`https://www.thecolorapi.com/scheme?hex=${cleanHexCode()}&format=json&mode=${modeSelect.value}&count=5`)
    .then(res=>res.json())
    .then(data=> {
        console.log(data)
        data.colorFormat = colorSpace.value
        dataArr.unshift(data)
        console.log(dataArr)
        render()
    })
}

// prints html produced by the constructor into the DOM
function render(){
    colorContainer.innerHTML = new ColorScheme(dataArr[0]).getColorContainerHTML()
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
        let colorArr = colors
        let palletteHTML = ''
        console.log(colorFormat)
    
        colorArr.forEach(color =>{
            let formatVariable = colorFormat === "hex"? color.hex.value : colorFormat === "rgb"? color.rgb.value: colorFormat === "hsl"? color.hsl.value: color.hsv.value;
            palletteHTML +=`
             <div class = "color-panel">
                <p class ="renderedColor">${formatVariable}</p>
                <img src="${color.image.bare}" class="color-sample"/>
            </div>
             `

        })
        return palletteHTML
    }
}
getColorScheme()