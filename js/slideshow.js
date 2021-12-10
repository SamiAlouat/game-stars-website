

console.clear();
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const left = document.querySelector(".left");
const right = document.querySelector(".right");
const slideColors = ["url('https://images.unsplash.com/photo-1638787849475-aa8d5fcb525b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1330&q=80')", "url('https://images.unsplash.com/photo-1638869231977-567c5b62352c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1140&q=80')", "url('https://images.unsplash.com/photo-1638875649493-c14c187af981?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=816&q=80')", "url('https://images.unsplash.com/photo-1638871110499-4310b20501ad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80')"];
let scrollValue = 0;
                                                                                                                                                                                                   

slides.forEach((slide, index) =>{
  
  slide.style.backgroundImage = slideColors[index];
  
});

left.addEventListener("click", ()=>{
  
  
  scrollValue -= slider.scrollWidth / slides.length;
  
  if(scrollValue < 0){
    scrollValue = slider.scrollWidth - (slider.scrollWidth / slides.length)  ;
  }
 
  console.log(scrollValue);
  slider.scrollLeft = scrollValue;
 
  
  
});

right.addEventListener("click", ()=>{
  
  
  scrollValue += slider.scrollWidth / slides.length;
  
  if(scrollValue >= slider.scrollWidth){
    scrollValue = 0;
  }
  
  slider.scrollLeft = scrollValue;
  
  
});
