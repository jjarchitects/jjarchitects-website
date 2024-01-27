// from contactus page
const amd_btn = document.querySelector("#amd-btn")
const bhj_btn = document.querySelector("#bhj-btn")
const address = document.querySelector("#address")
const map = document.querySelector("#map_frame")
const amdMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.74843351872!2d72.41493161428939!3d23.020474098949673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1705318539977!5m2!1sen!2sin"
const bhjMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58652.60249976934!2d69.62772042292282!3d23.250812939374832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3950e209000b6f17%3A0x7077f358af0774a6!2sBhuj%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1705319869235!5m2!1sen!2sin"

amd_btn.addEventListener("click", () => {
    address.innerHTML = `
        456 Innovation Boulevard, Floor 7 <br>
        Business City, Commerce District 12345 <br>
        Corporate County, Ahmedabad <br/>`

    if(map.src !== amdMapUrl)
        map.src = amdMapUrl

})

bhj_btn.addEventListener("click", () => {
    address.innerHTML = `
        789 Vision Avenue, Suite 101 <br/>
        Urban Center, Dreamland 56789 <br/>
        Creative County, Bhuj <br/>`

    if(map.src !== bhjMapUrl)
     map.src = bhjMapUrl

})