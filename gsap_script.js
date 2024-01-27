console.log("Hello GSAP")

let tline = gsap.timeline()

tline.from("nav",{
    y:-100,
    duration: 1,
    opacity: 0,
    stagger: 0.4
})

tline.from("#first-section",{
    duration: 4.5,
    opacity: 0,
})

tline.from(".scroll-down",{
    y:10,
    repeat:-1,
    duration: 0.7,
    yoyo: true
})