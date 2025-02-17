//Fetch all required elements
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector(["#lowercase"]);
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const strengthIndicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatePassword");
const allCheckBtn = document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$^&*()_+-={}[]|;:><,./?~";
//Declare and initialize all initial conditions/values of website
let password = "";
let passwordLength = 10;
let checkCount = 0; 
setIndicator("#ccc") //Initially set to gray
handleSlider();
//Create function for each feature

//Set passwordLength acccording to slider
function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"; 
} 
//Set strengthIndicator color
function setIndicator(color)
{
    strengthIndicator.style.backgroundColor = color;
    strengthIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
//Generate random values
function getRandomInteger(min, max)
{
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateNumber()
{
    return getRandomInteger(0, 9);
}
function generateUppercase()
{
    return String.fromCharCode(getRandomInteger(65, 91));
}
function generateLowercase()
{
    return String.fromCharCode(getRandomInteger(97, 123));
}
function generateSymbol()
{
    let randomNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}
//Calculate strength of Password
function calculateStrength()
{
    let containsUpper = false;
    let containsLower = false;
    let containsNumber = false;
    let containsSymbol = false;
    if(uppercaseCheck.checked)  containsUpper = true;
    if(lowercaseCheck.checked)  containsLower = true;
    if(numberCheck.checked)     containsNumber = true;
    if(symbolCheck.checked)     containsSymbol = true;

    if(containsUpper && containsLower && (containsNumber || containsSymbol) && passwordLength>=8)
    {
        setIndicator(`#0f0`);
    }
    else if((containsLower || containsUpper) && (containsNumber || containsSymbol) && passwordLength>=6)
    {
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    }
}
//Copy password to clipboard
async function copyToClipboard()
{
    //navigator.clipboard.writeText() returns promise => async function for await to work
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 1000);
}
//Shuffle the generated password to make it secure
function shufflePassword(array)
{
    //Shuffle using Fisher Yates Algorithm
    for(let i=array.length-1; i>=0; i--)
    {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el)=>str+=el);
    return str;
}
//Handle variables and enviornment everytime when a checkbox is clicked
function handleCheckboxChange(){
    checkCount = 0;
    allCheckBtn.forEach((checkBox)=>{
        if(checkBox.checked)    checkCount++;
    });
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}
// Add event listeners
allCheckBtn.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
});

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value)
    {
        copyToClipboard();
    }
});

generateBtn.addEventListener('click', ()=>{
    //No checkbox selected
    if(checkCount <= 0)     return;
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
    //Now find password
    password = "";
    let randomArr = [];
    if(uppercaseCheck.checked)
        randomArr.push(generateUppercase);
    if(lowercaseCheck.checked)
        randomArr.push(generateLowercase);
    if(numberCheck.checked)
        randomArr.push(generateNumber);
    if(symbolCheck.checked)
        randomArr.push(generateSymbol);
    //Compulsary addition
    for(let i=0; i<randomArr.length; i++)
    {
        password += randomArr[i]();
    }
    //Remaining addition
    for(let i=randomArr.length; i<passwordLength; i++)
    {
        let index = getRandomInteger(0,randomArr.length);
        password += randomArr[index]();
    }
    //Shuffle characters
    password = shufflePassword(Array.from(password));
    calculateStrength();
    passwordDisplay.value = password;
});